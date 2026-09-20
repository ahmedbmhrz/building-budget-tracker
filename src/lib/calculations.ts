import { createClient } from '@/lib/supabase/server'
import Decimal from 'decimal.js'

export type OwnerBalance = {
  profile_id: string;
  full_name: string;
  phone: string | null;
  units: { unit_number: string, percentage: number, sqft: number, unit_due: number }[];
  total_owed: number;
  total_paid: number;
  outstanding_balance: number;
}

export async function calculateAllOwnerBalances(targetYear?: number): Promise<{ balances?: OwnerBalance[], error?: string, totalBudget?: number, totalSqft?: number, year?: number }> {
  const supabase = await createClient()

  // 1. Get budget (either specific year or active)
  let budgetQuery = supabase.from('budgets').select('*')
  
  if (targetYear) {
    budgetQuery = budgetQuery.eq('year', targetYear)
  } else {
    budgetQuery = budgetQuery.eq('status', 'active').order('year', { ascending: false }).limit(1)
  }

  const { data: budgets } = await budgetQuery
  const budget = budgets?.[0]
  if (!budget) return { error: `No budget found${targetYear ? ` for year ${targetYear}` : ''}` }

  const totalBudget = new Decimal(budget.total_amount)

  // 2. Get all apartments
  const { data: apartments } = await supabase.from('apartments').select('*')
  if (!apartments || apartments.length === 0) return { error: "No apartments registered" }

  const totalSqft = apartments.reduce((sum, apt) => sum.plus(apt.sqft), new Decimal(0))

  // 3. Get all owners and their profiles
  const { data: apartmentOwners } = await supabase
    .from('apartment_owners')
    .select(`
      apartment_id,
      ownership_percentage,
      profile_id,
      profiles (
        full_name,
        phone
      )
    `)

  // 4. Get all payments (filtered by the resolved budget year for an isolated view)
  const resolvedYear = budget.year
  const startDate = `${resolvedYear}-01-01`
  const endDate = `${resolvedYear}-12-31`
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .gte('payment_date', startDate)
    .lte('payment_date', endDate)

  // 5. Calculate everything using Decimal.js for precision
  const balancesMap = new Map<string, OwnerBalance>()

  // Initialize map with profiles
  apartmentOwners?.forEach(ao => {
    const profileId = ao.profile_id
    if (!balancesMap.has(profileId)) {
      balancesMap.set(profileId, {
        profile_id: profileId,
        full_name: (ao.profiles as any)?.full_name || 'Unknown Owner',
        phone: (ao.profiles as any)?.phone || null,
        units: [],
        total_owed: 0,
        total_paid: 0,
        outstanding_balance: 0
      })
    }
  })

  // Calculate dues per unit per owner
  apartmentOwners?.forEach(ao => {
    const apt = apartments.find(a => a.id === ao.apartment_id)
    if (!apt) return

    const ownerBalance = balancesMap.get(ao.profile_id)
    if (!ownerBalance) return

    // Apartment Due = (Apartment Sqft / Total Sqft) * Total Budget
    const sqftRatio = new Decimal(apt.sqft).dividedBy(totalSqft)
    const aptTotalDue = sqftRatio.times(totalBudget)

    // Owner Due for this apartment = Apartment Due * (Ownership % / 100)
    const ownershipRatio = new Decimal(ao.ownership_percentage).dividedBy(100)
    const ownerDueForApt = aptTotalDue.times(ownershipRatio)

    ownerBalance.units.push({
      unit_number: apt.unit_number,
      percentage: Number(ao.ownership_percentage),
      sqft: Number(apt.sqft),
      unit_due: ownerDueForApt.toNumber()
    })

    ownerBalance.total_owed = new Decimal(ownerBalance.total_owed).plus(ownerDueForApt).toNumber()
  })

  // Apply Payments
  payments?.forEach(payment => {
    const ownerBalance = balancesMap.get(payment.profile_id)
    if (ownerBalance) {
      ownerBalance.total_paid = new Decimal(ownerBalance.total_paid).plus(payment.amount).toNumber()
    }
  })

  // Calculate Final Outstanding Balances
  const finalBalances = Array.from(balancesMap.values()).map(ob => {
    ob.outstanding_balance = new Decimal(ob.total_owed).minus(ob.total_paid).toNumber()
    return ob
  })

  return {
    balances: finalBalances,
    totalBudget: totalBudget.toNumber(),
    totalSqft: totalSqft.toNumber(),
    year: resolvedYear
  }
}
