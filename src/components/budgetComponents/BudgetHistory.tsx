import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { History, CheckCircle2, Clock } from "lucide-react"

export function BudgetHistory({ budgets }: { budgets: any[] }) {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Budget History</CardTitle>
          <CardDescription>All historical and upcoming building budgets.</CardDescription>
        </div>
        <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
          <History className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-none">
              <TableHead className="font-semibold text-slate-600 pl-6 py-4">Year</TableHead>
              <TableHead className="font-semibold text-slate-600">Total Amount</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-600 pr-6">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  No budgets have been created yet.
                </TableCell>
              </TableRow>
            ) : (
              budgets.map((budget) => (
                <TableRow key={budget.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 font-semibold text-slate-900 text-lg">
                    {budget.year}
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">
                    ${Number(budget.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    {budget.status === 'active' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/20">
                        <Clock className="w-3 h-3 mr-1" /> {budget.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6 text-sm text-slate-500">
                    {new Date(budget.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
