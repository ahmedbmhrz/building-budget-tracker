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
  
  console.log("DEBUG -> Expense payload:", { category, amount, date, desc })

  if (!category || !amount || !date) {
    console.log("DEBUG -> Missing required fields!")
    return { error: 'Missing required fields' }
  }

  // Get the logged in user to tag the expense
  const { data: { user } } = await supabase.auth.getUser()
  console.log("DEBUG -> Authenticated user for expense:", user?.id)

  const { error } = await supabase.from('expenses').insert({
    budget_id: budget.id,
    category,
    amount: new Decimal(amount).toNumber(),
    expense_date: date,
    description: desc,
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
