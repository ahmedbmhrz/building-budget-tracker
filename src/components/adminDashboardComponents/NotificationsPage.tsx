import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileText, CheckCircle, Bell } from "lucide-react"

export function NotificationsPage() {
  return (
    <div className="space-y-8 pb-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notifications Center</h1>
        <p className="text-slate-500 mt-1">View your complete history of system alerts and messages.</p>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl flex flex-row items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <Bell className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>Your most recent alerts and system events.</CardDescription>
            </div>
          </div>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors px-4 py-2 hover:bg-indigo-50 rounded-lg">
            Mark all as read
          </button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {/* Notification 1 */}
            <div className="flex items-start p-6 hover:bg-slate-50 transition-colors bg-white">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mr-4 mt-0.5">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-slate-800">Budget Warning: Elevator</p>
                  <span className="text-xs font-medium text-slate-400">2 hours ago</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">The Elevator maintenance category has reached $19,000, which is 95% of its allocated $20,000 budget for the year 2026. Please monitor upcoming expenses carefully.</p>
              </div>
            </div>
            
            {/* Notification 2 */}
            <div className="flex items-start p-6 hover:bg-slate-50 transition-colors bg-white">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mr-4 mt-0.5">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-slate-800">New Receipt Uploaded</p>
                  <span className="text-xs font-medium text-slate-400">5 hours ago</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">Apt 102 (Alice) uploaded a payment receipt for October 2026. The payment is awaiting your approval.</p>
                <div className="mt-3">
                  <button className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">Review Receipt</button>
                </div>
              </div>
            </div>

            {/* Notification 3 */}
            <div className="flex items-start p-6 hover:bg-slate-50 transition-colors bg-white opacity-60">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mr-4 mt-0.5">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-slate-800">2026 Budget Locked</p>
                  <span className="text-xs font-medium text-slate-400">Yesterday</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">The 2026 annual budget was successfully saved and locked by Admin User. Calculations for owner shares have been distributed.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
