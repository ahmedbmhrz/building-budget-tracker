'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, CreditCard, Receipt, AlertCircle, Calendar, Download } from "lucide-react"
import { OwnerBalance } from "@/lib/calculations"
import { logPayment } from "@/app/admin/actions"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import * as XLSX from 'xlsx'
import { PDFDownloadButton } from "./PDFDownloadButton"

export function OwnerLedger({ 
  balances = [], 
  currentYear, 
  availableYears = [],
  error
}: { 
  balances: OwnerBalance[], 
  currentYear: number, 
  availableYears: number[],
  error?: string
}) {
  const [selectedOwner, setSelectedOwner] = useState<string>('')
  const router = useRouter()

  const handleExportExcel = () => {
    if (!balances || balances.length === 0) return

    const exportData = balances.map(owner => ({
      'Owner Name': owner.full_name,
      'Phone': owner.phone || 'N/A',
      'Units Owned': owner.units.map(u => `Unit ${u.unit_number} (${u.percentage}%)`).join(', '),
      'Total Share Due ($)': owner.total_owed,
      'Total Paid ($)': owner.total_paid,
      'Outstanding Balance ($)': owner.outstanding_balance
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, `Ledger ${currentYear}`)
    XLSX.writeFile(workbook, `Owner_Ledger_${currentYear}.xlsx`)
  }

  return (
    <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Owner Ledger</h1>
          <p className="text-slate-500 mt-1">Track apartment dues, ownership splits, and logged payments for a specific year.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <select 
              value={currentYear}
              onChange={(e) => {
                if (e.target.value) {
                  router.push(`/admin/owners?year=${e.target.value}`)
                } else {
                  router.push(`/admin/owners`)
                }
              }}
              className="h-10 pl-9 pr-8 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year} Budget Cycle</option>
              ))}
            </select>
          </div>

          <Button 
            variant="outline" 
            className="shadow-sm border-slate-200" 
            disabled={balances.length === 0}
            onClick={handleExportExcel}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={!!error} className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 disabled:opacity-50">
                <Plus className="h-4 w-4 mr-2" />
                Log Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-none shadow-xl rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-emerald-600" /> 
                  Record Payment
                </DialogTitle>
                <DialogDescription>
                  Log a maintenance fee payment received from an owner for the {currentYear} budget cycle.
                </DialogDescription>
              </DialogHeader>
              <form action={logPayment} className="grid gap-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="profile_id" className="text-slate-600 font-semibold">Owner</Label>
                  <select 
                    id="profile_id" 
                    name="profile_id" 
                    required 
                    value={selectedOwner}
                    onChange={(e) => setSelectedOwner(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="" disabled>Select an owner...</option>
                    {balances.map(b => (
                      <option key={b.profile_id} value={b.profile_id}>{b.full_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-slate-600 font-semibold">Amount Received ($)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                    <Input id="amount" name="amount" type="number" step="0.01" required placeholder="0.00" className="pl-7 rounded-lg focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-slate-600 font-semibold">Date Received</Label>
                  <Input id="date" name="date" type="date" required className="rounded-lg focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method" className="text-slate-600 font-semibold">Payment Method</Label>
                  <select id="method" name="method" required className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                  </select>
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md mt-2 rounded-lg h-11">Save Payment</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg flex items-center shadow-sm">
          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <Card className="border-none shadow-md">
          <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl pb-4">
            <CardTitle>Account Balances for {currentYear}</CardTitle>
            <CardDescription>Exact financial share calculated strictly by apartment square footage against the {currentYear} budget.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 bg-white">
                  <TableHead className="font-semibold text-slate-600 pl-6 py-4">Owner Name</TableHead>
                  <TableHead className="font-semibold text-slate-600">Apartments Owned</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">Total Share Due</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">Total Paid (in {currentYear})</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600 pr-6">Outstanding</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                      No owners found or no active budget.
                    </TableCell>
                  </TableRow>
                ) : (
                  balances.map((owner) => (
                    <TableRow key={owner.profile_id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="pl-6 py-4 font-medium text-slate-900">
                        {owner.full_name}
                        {owner.phone && <div className="text-xs text-slate-400 font-normal mt-0.5">{owner.phone}</div>}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {owner.units.map(u => (
                            <span key={u.unit_number} className="inline-flex items-center text-xs text-slate-600">
                              Unit {u.unit_number} <span className="text-slate-400 ml-1">({u.sqft} sqft{u.percentage < 100 ? `, ${u.percentage}% split` : ''})</span>
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-700">
                        ${owner.total_owed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-medium text-emerald-600">
                        ${owner.total_paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-semibold ${
                          owner.outstanding_balance <= 0 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          ${owner.outstanding_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </TableCell>
                      <TableCell className="pr-6">
                        <PDFDownloadButton owner={owner} year={currentYear} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
