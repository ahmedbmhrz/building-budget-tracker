import { AdminDashboard } from "@/components/adminDashboardComponents/AdminDashboard"
import { createClient } from "@/lib/supabase/server"
import { calculateAllOwnerBalances } from "@/lib/calculations"

export default async function AdminPage() {
  const supabase = await createClient()

  // 1. Get active budget
  const { data: budgets } = await supabase
    .from('budgets')
    .select('id, total_amount, year')
    .eq('status', 'active')
    .order('year', { ascending: false })
    .limit(1)

  const budget = budgets?.[0]

  let totalBudget = 0
  let totalExpenses = 0
  let chartData: any[] = []
  let recentExpenses: any[] = []
  let totalCollected = 0 

  if (budget) {
    totalBudget = Number(budget.total_amount)

    // 2. Get budget categories
    const { data: categories } = await supabase
      .from('budget_categories')
      .select('category_name, allocated_amount')
      .eq('budget_id', budget.id)

    // 3. Get expenses for active budget
    const { data: expenses } = await supabase
      .from('expenses')
      .select('category, amount, description, expense_date')
      .eq('budget_id', budget.id)
      .order('expense_date', { ascending: false })

    if (expenses) {
      totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0)
      recentExpenses = expenses.slice(0, 4) // Top 4 recent
    }

    // Combine categories and expenses for chartData
    if (categories) {
      chartData = categories.map(cat => {
        const used = expenses 
          ? expenses.filter(e => e.category === cat.category_name).reduce((sum, e) => sum + Number(e.amount), 0)
          : 0
        return {
          category: cat.category_name,
          allocated: Number(cat.allocated_amount),
          used
        }
      })
    }
  }

  // Calculate global owner balances
  const balancesData = await calculateAllOwnerBalances()
  if (balancesData?.balances) {
    totalCollected = balancesData.balances.reduce((sum, b) => sum + b.total_paid, 0)
  }

  return (
    <AdminDashboard 
      totalBudget={totalBudget} 
      totalExpenses={totalExpenses} 
      totalCollected={totalCollected}
      chartData={chartData}
      recentExpenses={recentExpenses}
    />
  )
}
