'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building, LayoutDashboard, Receipt, Users, Wallet, LogOut, Settings, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Apartments', href: '/admin/apartments', icon: Building },
  { name: 'Owner Ledger', href: '/admin/owners', icon: Users },
  { name: 'Budget Setup', href: '/admin/budget', icon: Wallet },
  { name: 'Expenses', href: '/admin/expenses', icon: Receipt },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 bg-[#0f172a] text-slate-300 flex-col hidden md:flex h-full shadow-xl transition-all duration-300">
      <div className="h-20 flex items-center px-8 border-b border-slate-800 bg-[#0b1120]">
        <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
          <Building className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white text-lg tracking-tight">BudgetTracker</h1>
          <p className="text-xs text-slate-500 font-medium">Admin Portal</p>
        </div>
      </div>
      
      <div className="px-4 py-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Menu
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "hover:bg-slate-800/50 hover:text-white"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 mr-3 transition-colors duration-200",
                isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
              )} />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-[#0b1120]">
        <Link href="/admin/settings" className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Settings className="h-5 w-5 mr-3 text-slate-500" />
          Settings
        </Link>
        <button className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors mt-1">
          <LogOut className="h-5 w-5 mr-3 text-slate-500" />
          Log out
        </button>
      </div>
    </aside>
  )
}
