import { ApartmentsSetup } from "@/components/adminDashboardComponents/ApartmentsSetup"
import { createClient } from "@/lib/supabase/server"

export default async function ApartmentsPage() {
  const supabase = await createClient()

  // Fetch apartments with their owners
  const { data: apartments } = await supabase
    .from('apartments')
    .select(`
      id,
      unit_number,
      sqft,
      apartment_owners (
        id,
        ownership_percentage,
        profiles (
          id,
          full_name
        )
      )
    `)
    .order('unit_number', { ascending: true })

  return <ApartmentsSetup initialApartments={apartments || []} />
}
