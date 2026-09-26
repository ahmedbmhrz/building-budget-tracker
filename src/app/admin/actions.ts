'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Decimal from 'decimal.js'

export async function addApartment(formData: FormData) {
  const supabase = await createClient()
  
  const unitNumber = formData.get('unitNumber') as string
  const sqft = formData.get('sqft') as string

  if (!unitNumber || !sqft) {
    return { error: 'Missing required fields' }
  }

  // --- DEBUGGING ---
  const { data: authData } = await supabase.auth.getUser()
  console.log("DEBUG -> Current Auth User ID:", authData.user?.id)
  if (authData.user?.id) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single()
    console.log("DEBUG -> Current Profile:", profile)
  } else {
    console.log("DEBUG -> User is NOT authenticated.")
  }
  // -----------------

  const { error } = await supabase.from('apartments').insert({
    unit_number: unitNumber,
    sqft: new Decimal(sqft).toNumber()
  })

  if (error) {
    console.error('Error adding apartment:', error)
    return { error: error.message }
  }
  
  revalidatePath('/admin/apartments')
  return { success: true }
}

export async function logExpense(formData: FormData) {
  const supabase = await createClient()
  console.log("DEBUG -> logExpense action started!")
  
  // Find the active budget for the most recent year
  const { data: budgets, error: budgetFetchError } = await supabase
    .from('budgets')
    .select('id')
    .eq('status', 'active')
    .order('year', { ascending: false })
    .limit(1)

  const budget = budgets?.[0]

  console.log("DEBUG -> Active budget fetched:", budget?.id, "Error:", budgetFetchError?.message)

  if (!budget) {
    return { error: 'No active budget found. Please create and lock a budget first.' }
  }

  const category = formData.get('category') as string
  const amount = formData.get('amount') as string
  const date = formData.get('date') as string
  const desc = formData.get('desc') as string
  const receiptFile = formData.get('receipt') as File | null
  
  if (!category || !amount || !date) {
    return { error: 'Missing required fields' }
  }

  // Get the logged in user to tag the expense
  const { data: { user } } = await supabase.auth.getUser()

  let receiptUrl = null

  if (receiptFile && receiptFile.size > 0) {
    // Generate a unique filename
    const fileExt = receiptFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // Attempt to upload to the 'receipts' bucket
    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, receiptFile)

    if (uploadError) {
      console.error('DEBUG -> Storage Upload Error (ensure "receipts" bucket exists and is public):', uploadError)
      // We can continue saving the expense even if the upload fails (e.g., if bucket is missing during dev)
    } else {
      // Get the public URL
      const { data: publicUrlData } = supabase.storage.from('receipts').getPublicUrl(fileName)
      receiptUrl = publicUrlData.publicUrl
    }
  }

  const { error } = await supabase.from('expenses').insert({
    budget_id: budget.id,
    category,
    amount: new Decimal(amount).toNumber(),
    expense_date: date,
    description: desc,
    receipt_url: receiptUrl,
    logged_by: user?.id || null
  })

  if (error) {
    console.error('DEBUG -> Error logging expense:', error)
    return { error: error.message }
  }

  console.log("DEBUG -> Expense successfully logged!")
  revalidatePath('/admin/expenses')
  revalidatePath('/admin')
  return { success: true }
}

export async function saveBudget(formData: FormData) {
  const supabase = await createClient()
  console.log("DEBUG -> saveBudget action started!")
  
  const yearStr = formData.get('year') as string
  const totalAmountStr = formData.get('total') as string
  console.log("DEBUG -> year:", yearStr, "total:", totalAmountStr)
  
  if (!yearStr || !totalAmountStr) return { error: 'Missing year or total amount.' }

  const year = parseInt(yearStr, 10)
  const total_amount = new Decimal(totalAmountStr).toNumber()

  // Extract categories dynamically
  const categories: {name: string, amount: number}[] = []
  
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('cat_') && value) {
      const categoryName = key.replace('cat_', '')
      categories.push({
        name: categoryName,
        amount: new Decimal(value as string).toNumber()
      })
    }
  }

  console.log("DEBUG -> categories:", categories)

  // Verify total sums up correctly using Decimal
  const sum = categories.reduce((acc, cat) => acc.plus(cat.amount), new Decimal(0))
  if (!sum.equals(new Decimal(total_amount))) {
    console.log(`DEBUG -> sum mismatch: ${sum.toString()} != ${total_amount}`)
    return { error: `Category allocations (${sum.toString()}) do not match the total budget amount (${total_amount}).` }
  }

  console.log("DEBUG -> Inserting/Updating budget...")
  // Upsert Budget (Update if it already exists for this year)
  const { data: budgetData, error: budgetError } = await supabase
    .from('budgets')
    .upsert({
      year,
      total_amount,
      status: 'active'
    }, { onConflict: 'year' })
    .select('id')
    .single()

  if (budgetError) {
    console.error('Error saving budget:', budgetError)
    return { error: budgetError.message }
  }
  console.log("DEBUG -> Budget saved with ID:", budgetData.id)

  // Clear out old categories for this budget to avoid duplicates
  await supabase.from('budget_categories').delete().eq('budget_id', budgetData.id)

  // Insert Categories
  if (categories.length > 0) {
    const categoryInserts = categories.map(cat => ({
      budget_id: budgetData.id,
      category_name: cat.name,
      allocated_amount: cat.amount
    }))
    
    console.log("DEBUG -> Inserting categories...")
    const { error: catError } = await supabase.from('budget_categories').insert(categoryInserts)
    if (catError) {
       console.error('Error saving categories:', catError)
       return { error: catError.message }
    }
  }

  console.log("DEBUG -> Budget saved successfully!")
  revalidatePath('/admin/budget')
  revalidatePath('/admin')
  return { success: true }
}

export async function logPayment(formData: FormData) {
  const supabase = await createClient()

  const profile_id = formData.get('profile_id') as string
  const amountStr = formData.get('amount') as string
  const date = formData.get('date') as string
  const method = formData.get('method') as string

  if (!profile_id || !amountStr || !date) {
    return { error: 'Missing required payment fields.' }
  }

  const { error } = await supabase.from('payments').insert({
    profile_id,
    amount: new Decimal(amountStr).toNumber(),
    payment_date: date,
    payment_method: method
  })

  if (error) {
    console.error('Error logging payment:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/owners')
  revalidatePath('/admin')
  return { success: true }
}

import { createClient as createRawClient } from '@supabase/supabase-js'

export async function createAndAssignOwner(formData: FormData) {
  const adminClient = await createClient()
  
  const apartment_id = formData.get('apartment_id') as string
  const full_name = formData.get('full_name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const percentageStr = formData.get('percentage') as string
  const phone = formData.get('phone') as string || null

  if (!apartment_id || !full_name || !email || !password || !percentageStr) {
    return { error: 'Missing required fields.' }
  }

  const percentage = parseFloat(percentageStr)
  if (percentage <= 0 || percentage > 100) return { error: 'Percentage must be between 1 and 100.' }

  // We use a raw client for signup so it doesn't overwrite the Admin's login cookies!
  const rawClient = createRawClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: authData, error: authError } = await rawClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: full_name,
      }
    }
  })

  if (authError) {
    return { error: `Auth Error: ${authError.message}` }
  }

  const newUserId = authData.user?.id
  if (!newUserId) return { error: 'Failed to retrieve new user ID.' }

  // Update profile phone if provided (Auth trigger creates the profile)
  if (phone) {
    await adminClient.from('profiles').update({ phone }).eq('id', newUserId)
  }

  // Assign to apartment
  const { error: assignError } = await adminClient.from('apartment_owners').insert({
    apartment_id,
    profile_id: newUserId,
    ownership_percentage: percentage
  })

  if (assignError) {
    return { error: `Assignment Error: ${assignError.message}` }
  }

  revalidatePath('/admin/apartments')
  revalidatePath('/admin/owners')
  return { success: true }
}

export async function globalSearch(query: string) {
  if (!query || query.length < 1) return { owners: [], apartments: [], expenses: [] }
  const supabase = await createClient()

  const [
    { data: owners },
    { data: apartments },
    { data: expenses }
  ] = await Promise.all([
    supabase.from('profiles').select('id, full_name').eq('role', 'owner').ilike('full_name', `%${query}%`).limit(3),
    supabase.from('apartments').select('id, unit_number').ilike('unit_number', `%${query}%`).limit(3),
    supabase.from('expenses').select('id, category, description').or(`description.ilike.%${query}%,category.ilike.%${query}%`).limit(3)
  ])

  return { 
    owners: owners || [], 
    apartments: apartments || [], 
    expenses: expenses || [] 
  }
}

export async function uploadMissingReceipt(formData: FormData) {
  const supabase = await createClient()
  
  const expenseId = formData.get('expense_id') as string
  const receiptFile = formData.get('receipt') as File | null

  if (!expenseId || !receiptFile || receiptFile.size === 0) {
    return { error: 'Missing expense ID or file' }
  }

  const fileExt = receiptFile.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  
  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(fileName, receiptFile)

  if (uploadError) {
    console.error('DEBUG -> Storage Upload Error:', uploadError)
    return { error: 'Failed to upload file to storage.' }
  }

  const { data: publicUrlData } = supabase.storage.from('receipts').getPublicUrl(fileName)
  const receiptUrl = publicUrlData.publicUrl

  const { error: updateError } = await supabase
    .from('expenses')
    .update({ receipt_url: receiptUrl })
    .eq('id', expenseId)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/admin/expenses')
  return { success: true }
}
