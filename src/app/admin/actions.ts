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
  
  // Find the active budget for this year
  const { data: budget } = await supabase
    .from('budgets')
    .select('id')
    .eq('status', 'active')
    .single()

  if (!budget) {
    return { error: 'No active budget found. Please create and lock a budget first.' }
  }

  const category = formData.get('category') as string
  const amount = formData.get('amount') as string
  const date = formData.get('date') as string
  const desc = formData.get('desc') as string

  if (!category || !amount || !date) {
    return { error: 'Missing required fields' }
  }

  // Get the logged in user to tag the expense
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('expenses').insert({
    budget_id: budget.id,
    category,
    amount: new Decimal(amount).toNumber(),
    expense_date: date,
    description: desc,
    logged_by: user?.id || null
  })

  if (error) {
    console.error('Error logging expense:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/expenses')
  revalidatePath('/admin')
  return { success: true }
}

export async function saveBudget(formData: FormData) {
  const supabase = await createClient()
  
  const yearStr = formData.get('year') as string
  const totalAmountStr = formData.get('total') as string
  
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

  // Verify total sums up correctly using Decimal
  const sum = categories.reduce((acc, cat) => acc.plus(cat.amount), new Decimal(0))
  if (!sum.equals(new Decimal(total_amount))) {
    return { error: `Category allocations (${sum.toString()}) do not match the total budget amount (${total_amount}).` }
  }

  // Insert Budget
  const { data: budgetData, error: budgetError } = await supabase
    .from('budgets')
    .insert({
      year,
      total_amount,
      status: 'active'
    })
    .select('id')
    .single()

  if (budgetError) {
    console.error('Error saving budget:', budgetError)
    return { error: budgetError.message }
  }

  // Insert Categories
  if (categories.length > 0) {
    const categoryInserts = categories.map(cat => ({
      budget_id: budgetData.id,
      category_name: cat.name,
      allocated_amount: cat.amount
    }))
    
    const { error: catError } = await supabase.from('budget_categories').insert(categoryInserts)
    if (catError) {
       console.error('Error saving categories:', catError)
       return { error: catError.message }
    }
  }

  revalidatePath('/admin/budget')
  revalidatePath('/admin')
  return { success: true }
}
