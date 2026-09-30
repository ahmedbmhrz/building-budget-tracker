import { ReactNode } from "react"
import { AdminSidebar } from "@/components/navbarcomponents/AdminSidebar"
import { NotificationsDropdown } from "@/components/navbarcomponents/NotificationsDropdown"
import { GlobalSearch } from "@/components/navbarcomponents/GlobalSearch"
import { Bell } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { logout } from "@/app/login/actions"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch profile to get full name and role
  let fullName = "Unknown User"
  let role = "User"
  let initials = "U"
  
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
    if (profile) {
      fullName = profile.full_name || "Unknown User"
      role = profile.role === 'admin' ? "Property Manager" : "Apartment Owner"
      initials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <GlobalSearch />

          <div className="flex items-center space-x-6">
             <NotificationsDropdown />
             <div className="h-8 w-px bg-slate-200"></div>
             <div className="flex items-center space-x-3 group">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-700">{fullName}</div>
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-xs text-slate-500 font-medium">{role}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <form action={logout}>
                      <button type="submit" className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline transition-colors">
                        Log out
                      </button>
                    </form>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-white">
                  {initials}
                </div>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
