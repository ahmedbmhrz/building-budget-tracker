'use client'

import { logExpense } from "@/app/admin/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, TrendingUp, DollarSign, Activity, CreditCard, ArrowUpRight } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

type AdminDashboardProps = {
  totalBudget?: number;
  totalExpenses?: number;
  totalCollected?: number;
  chartData?: any[];
  recentExpenses?: any[];
  currentYear?: number;
  availableYears?: number[];
}

export function AdminDashboard({ 
  totalBudget = 0, 
  totalExpenses = 0, 
  totalCollected = 0, 
  chartData = [], 
  recentExpenses = [],
  currentYear = new Date().getFullYear(),
  availableYears = []
}: AdminDashboardProps) {

  const outstanding = totalBudget - totalCollected;
  const expensePercentage = totalBudget > 0 ? ((totalExpenses / totalBudget) * 100).toFixed(1) : '0';
  const collectionRate = totalBudget > 0 ? ((totalCollected / totalBudget) * 100).toFixed(1) : '0';
  const router = useRouter();

  return (
    <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Monitor building finances and owner balances for {currentYear}.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {availableYears.length > 0 && (
            <div className="relative">
              <select 
                value={currentYear}
                onChange={(e) => {
                  if (e.target.value) {
                    router.push(`/admin?year=${e.target.value}`)
                  } else {
                    router.push(`/admin`)
                  }
                }}
                className="h-10 pl-4 pr-8 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year} Budget</option>
                ))}
              </select>
            </div>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20">
                <Plus className="h-4 w-4 mr-2" />
                Log Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-none shadow-xl rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-xl">Log New Expense</DialogTitle>
                <DialogDescription>
                  Record a maintenance expense. This will update the budget utilization immediately.
                </DialogDescription>
              </DialogHeader>
            <form action={logExpense} className="grid gap-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-600 font-semibold">Category</Label>
                <select id="category" name="category" required className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
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
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md mt-2 rounded-lg h-11">Submit Expense</Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Budget</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">${totalBudget.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            <div className="flex items-center mt-1 text-xs text-emerald-600 font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              Active Budget
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Expenses to Date</CardTitle>
            <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            <div className="flex items-center mt-1 text-xs text-rose-600 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {expensePercentage}% of budget used
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Collected</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">${totalCollected.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            <div className="flex items-center mt-1 text-xs text-emerald-600 font-medium">
              {collectionRate}% collection rate
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Outstanding</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">${outstanding.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            <div className="flex items-center mt-1 text-xs text-amber-600 font-medium">
              Pending owner payments
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Budget vs Expenses Chart */}
        <Card className="col-span-4 border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Budget Utilization</CardTitle>
            <CardDescription>Allocated vs Used amounts across major categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="category" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `$${value/1000}k`}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                    />
                    <Bar dataKey="allocated" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Allocated" />
                    <Bar dataKey="used" fill="#6366f1" radius={[4, 4, 0, 0]} name="Used" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <p>No active budget categories found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses Table */}
        <Card className="col-span-3 border-none shadow-md flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Recent Ledger Activity</CardTitle>
            <CardDescription>The latest logged maintenance expenses.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none">
                  <TableHead className="font-semibold text-slate-600">Category</TableHead>
                  <TableHead className="font-semibold text-slate-600">Desc</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-slate-400">
                      No expenses logged yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentExpenses.map((exp, idx) => (
                    <TableRow key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/20">
                          {exp.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm truncate max-w-[100px]">{exp.description || '-'}</TableCell>
                      <TableCell className="text-right font-medium text-slate-900">${Number(exp.amount).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="mt-auto pt-4 border-t border-slate-100">
              <Link href="/admin/expenses" className="block w-full">
                <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                  View All Expenses &rarr;
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  )
}
