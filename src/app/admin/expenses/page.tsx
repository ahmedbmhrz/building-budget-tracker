import { ExpenseTracker } from "@/components/expenseComponents/ExpenseTracker"
import { createClient } from "@/lib/supabase/server"

export default async function ExpensesPage() {
  const supabase = await createClient()

  const { data: expenses } = await supabase
    .from('expenses')
    .select(`
      id,
      category,
      amount,
      expense_date,
      description,
      receipt_url,
      profiles (
        full_name
      )
    `)
    .order('expense_date', { ascending: false })

  return <ExpenseTracker initialExpenses={expenses || []} />
}
