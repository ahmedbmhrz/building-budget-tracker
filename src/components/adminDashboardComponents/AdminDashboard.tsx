'use client'

import { logExpense } from "@/app/admin/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, TrendingUp, DollarSign, Activity, CreditCard, ArrowUpRight } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const chartData = [
  { category: "Keeper", allocated: 30000, used: 25000 },
  { category: "Elevator", allocated: 20000, used: 19000 },
  { category: "Electric", allocated: 20000, used: 9000 },
  { category: "Cleaning", allocated: 15000, used: 12000 },
  { category: "Security", allocated: 15000, used: 15000 },
  { category: "Repairs", allocated: 20000, used: 5000 },
]

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

export function AdminDashboard() {
  return (
    <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Monitor building finances and owner balances for 2026.</p>
        </div>
        
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
            <div className="text-3xl font-bold text-slate-800">$120,000</div>
            <div className="flex items-center mt-1 text-xs text-emerald-600 font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% from last year
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
            <div className="text-3xl font-bold text-slate-800">$45,231</div>
            <div className="flex items-center mt-1 text-xs text-rose-600 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              37.6% of budget used
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
            <div className="text-3xl font-bold text-slate-800">$89,400</div>
            <div className="flex items-center mt-1 text-xs text-emerald-600 font-medium">
              74.5% collection rate
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
            <div className="text-3xl font-bold text-slate-800">$30,600</div>
            <div className="flex items-center mt-1 text-xs text-amber-600 font-medium">
              Across 12 apartments
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
                  />
                  <Bar dataKey="allocated" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Allocated" />
                  <Bar dataKey="used" fill="#6366f1" radius={[4, 4, 0, 0]} name="Used" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses Table */}
        <Card className="col-span-3 border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Recent Ledger Activity</CardTitle>
            <CardDescription>The latest logged maintenance expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none">
                  <TableHead className="font-semibold text-slate-600">Category</TableHead>
                  <TableHead className="font-semibold text-slate-600">Desc</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20">
                      Elevator
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">Monthly contract</TableCell>
                  <TableCell className="text-right font-medium text-slate-900">$450.00</TableCell>
                </TableRow>
                <TableRow className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20">
                      Electric
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">Common areas</TableCell>
                  <TableCell className="text-right font-medium text-slate-900">$845.20</TableCell>
                </TableRow>
                <TableRow className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                      Repairs
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">Main entrance lock</TableCell>
                  <TableCell className="text-right font-medium text-slate-900">$120.00</TableCell>
                </TableRow>
                <TableRow className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      Cleaning
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">Weekly service</TableCell>
                  <TableCell className="text-right font-medium text-slate-900">$300.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-4 pt-4 border-t border-slate-100">
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
