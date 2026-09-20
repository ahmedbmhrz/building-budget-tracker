import { OwnerLedger } from "@/components/ownerComponents/OwnerLedger"
import { calculateAllOwnerBalances } from "@/lib/calculations"
import { createClient } from "@/lib/supabase/server"

export default async function OwnersPage({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const params = await searchParams
  const targetYear = params.year ? parseInt(params.year) : undefined
  const result = await calculateAllOwnerBalances(targetYear)
  
  const supabase = await createClient()
  const { data: budgets } = await supabase.from('budgets').select('year').order('year', { ascending: false })
  const availableYears = budgets?.map(b => b.year) || []

  return (
    <OwnerLedger 
      balances={result.balances || []} 
      currentYear={result.year || new Date().getFullYear()}
      availableYears={availableYears}
      error={result.error}
    />
  )
}
