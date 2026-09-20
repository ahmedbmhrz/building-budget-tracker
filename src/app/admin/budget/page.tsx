import { BudgetWizard } from "@/components/budgetComponents/BudgetWizard"
import { BudgetHistory } from "@/components/budgetComponents/BudgetHistory"
import { createClient } from "@/lib/supabase/server"

export default async function BudgetPage() {
  const supabase = await createClient()
  
  // Fetch all budgets ordered by year descending
  const { data: budgets } = await supabase
    .from('budgets')
    .select('*')
    .order('year', { ascending: false })

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BudgetWizard />
      
      <div className="max-w-5xl mx-auto">
        <BudgetHistory budgets={budgets || []} />
      </div>
    </div>
  )
}
