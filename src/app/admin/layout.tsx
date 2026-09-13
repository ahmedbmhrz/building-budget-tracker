import { ReactNode } from "react"
import { AdminSidebar } from "@/components/navbarcomponents/AdminSidebar"
import { NotificationsDropdown } from "@/components/navbarcomponents/NotificationsDropdown"
import { Bell, Search } from "lucide-react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center bg-slate-100 px-4 py-2 rounded-full w-64 border border-slate-200/60 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
            <Search className="h-4 w-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center space-x-6">
             <NotificationsDropdown />
             <div className="h-8 w-px bg-slate-200"></div>
             <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">Admin User</div>
                  <div className="text-xs text-slate-500 font-medium">Property Manager</div>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-white">
                  AU
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
