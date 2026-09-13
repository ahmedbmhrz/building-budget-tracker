'use client'

import Link from "next/link"
import { Bell, AlertTriangle, FileText, CheckCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100 outline-none">
          <Bell className="h-5 w-5" />
          {/* Notification Badge */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-xl border-slate-100 mt-2 p-0 overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
          <span className="font-semibold text-slate-700">Notifications</span>
          <span className="text-xs text-indigo-600 font-medium cursor-pointer hover:underline">Mark all as read</span>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {/* Notification 1 */}
          <div className="flex items-start p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer bg-white">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mr-3 mt-0.5">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Budget Warning</p>
              <p className="text-xs text-slate-500 mt-0.5">Elevator maintenance has reached 95% of its allocated budget.</p>
              <p className="text-[10px] text-slate-400 mt-1">2 hours ago</p>
            </div>
          </div>
          
          {/* Notification 2 */}
          <div className="flex items-start p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer bg-white">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mr-3 mt-0.5">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">New Receipt Uploaded</p>
              <p className="text-xs text-slate-500 mt-0.5">Apt 102 (Alice) uploaded a payment receipt for Oct 2026.</p>
              <p className="text-[10px] text-slate-400 mt-1">5 hours ago</p>
            </div>
          </div>

          {/* Notification 3 */}
          <div className="flex items-start p-4 hover:bg-slate-50 transition-colors cursor-pointer bg-white opacity-60">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mr-3 mt-0.5">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Budget Locked</p>
              <p className="text-xs text-slate-500 mt-0.5">The 2026 annual budget was successfully saved and locked.</p>
              <p className="text-[10px] text-slate-400 mt-1">Yesterday</p>
            </div>
          </div>
        </div>
        
        <Link href="/admin/notifications">
          <div className="bg-slate-50 p-3 text-center border-t border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
            <span className="text-xs font-medium text-slate-600 hover:text-indigo-600">View all notifications</span>
          </div>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
