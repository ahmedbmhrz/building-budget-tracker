'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { logExpense } from "@/app/admin/actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react"

export function ExpenseTracker({ initialExpenses = [] }: { initialExpenses?: any[] }) {
  return (
    <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Expense Tracker</h1>
          <p className="text-slate-500 mt-1">Log new maintenance bills and track previous expenditures.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Log Form */}
        <Card className="col-span-1 h-fit border-none shadow-md">
          <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
            <CardTitle>Log New Expense</CardTitle>
            <CardDescription>Record a building maintenance expense.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form action={logExpense} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-600 font-semibold">Category</Label>
                <select id="category" name="category" required className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                  <option value="Elevator">Elevator</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Repairs">Repairs</option>
                  <option value="Keeper Salary">Keeper Salary</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-slate-600 font-semibold">Amount ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <Input id="amount" name="amount" type="number" step="0.01" required placeholder="0.00" className="pl-7 rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-slate-600 font-semibold">Date</Label>
                <Input id="date" name="date" type="date" required className="rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc" className="text-slate-600 font-semibold">Description</Label>
                <Input id="desc" name="desc" placeholder="Brief details..." className="rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-slate-600 font-semibold">Receipt (Optional)</Label>
                <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-indigo-50/50 hover:border-indigo-400 transition-all cursor-pointer group">
                  <div className="h-10 w-10 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Click to upload</span>
                  <span className="text-xs text-slate-400 mt-1">PDF, JPG, or PNG (max 5MB)</span>
                </div>
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 rounded-lg mt-4 h-11">
                Submit Expense
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Ledger Table */}
        <Card className="col-span-2 border-none shadow-md overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle>Expense Ledger</CardTitle>
            <CardDescription>All recorded expenses for the current active budget.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-none">
                  <TableHead className="font-semibold text-slate-600 pl-6">Date</TableHead>
                  <TableHead className="font-semibold text-slate-600">Category</TableHead>
                  <TableHead className="font-semibold text-slate-600">Description</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-center">Receipt</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600 pr-6">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-slate-500">No expenses recorded yet.</TableCell>
                  </TableRow>
                ) : initialExpenses.map((expense) => {
                  return (
                    <TableRow key={expense.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-700 pl-6">{new Date(expense.expense_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/20">
                          {expense.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">{expense.description || '-'}</TableCell>
                      <TableCell className="text-center text-slate-300">-</TableCell>
                      <TableCell className="text-right font-medium pr-6">${expense.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <Button variant="outline" className="text-sm">Load More Expenses</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
