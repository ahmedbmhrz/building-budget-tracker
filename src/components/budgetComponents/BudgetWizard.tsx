'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Calendar, DollarSign, Calculator, AlertCircle, CheckCircle2 } from "lucide-react"
import { saveBudget } from "@/app/admin/actions"

export function BudgetWizard() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Dynamic Summary State
  const [targetTotal, setTargetTotal] = useState(120000)
  const [year, setYear] = useState(2026)
  const [allocated, setAllocated] = useState(120000)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    const result = await saveBudget(formData)
    
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
  }

  function handleFormChange(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    
    const newYear = parseInt(formData.get('year') as string) || 2026
    const newTotal = parseFloat(formData.get('total') as string) || 0
    
    setYear(newYear)
    setTargetTotal(newTotal)

    let sum = 0
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('cat_') && value) {
        sum += parseFloat(value as string) || 0
      }
    }
    setAllocated(sum)
  }

  const remaining = targetTotal - allocated
  const isBalanced = remaining === 0

  return (
    <form action={handleSubmit} onChange={handleFormChange} className="space-y-8 pb-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Annual Budget Setup</h1>
          <p className="text-slate-500 mt-1">Configure the total budget and distribute allocations for the year.</p>
        </div>
        <Button type="submit" disabled={!isBalanced} className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 h-11 px-6 disabled:opacity-50 disabled:cursor-not-allowed">
          <Save className="h-4 w-4 mr-2" /> Save & Lock Budget
        </Button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg flex items-center shadow-sm">
          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center shadow-sm">
          <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0" />
          <p className="text-sm font-medium">Budget successfully saved and locked for the year!</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
              <CardTitle>General Information</CardTitle>
              <CardDescription>Core parameters for the new budget cycle.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
              <div className="space-y-2">
                <Label htmlFor="year" className="text-slate-600 font-semibold">Budget Year</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input id="year" name="year" type="number" defaultValue="2026" required className="pl-9 rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total" className="text-slate-600 font-semibold">Total Annual Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input id="total" name="total" type="number" step="0.01" defaultValue="120000" required className="pl-9 rounded-lg font-semibold text-slate-900 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
              <CardTitle>Category Allocations</CardTitle>
              <CardDescription>Distribute the total budget across required maintenance categories.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-slate-600">Keeper Salary</Label>
                  <div className="relative"><span className="absolute left-3 top-2.5 text-slate-500">$</span><Input name="cat_Keeper Salary" type="number" defaultValue="30000" required className="pl-7 rounded-lg" /></div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600">Elevator Maintenance</Label>
                  <div className="relative"><span className="absolute left-3 top-2.5 text-slate-500">$</span><Input name="cat_Elevator" type="number" defaultValue="20000" required className="pl-7 rounded-lg" /></div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600">Electricity</Label>
                  <div className="relative"><span className="absolute left-3 top-2.5 text-slate-500">$</span><Input name="cat_Electricity" type="number" defaultValue="20000" required className="pl-7 rounded-lg" /></div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600">Cleaning</Label>
                  <div className="relative"><span className="absolute left-3 top-2.5 text-slate-500">$</span><Input name="cat_Cleaning" type="number" defaultValue="15000" required className="pl-7 rounded-lg" /></div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600">Security</Label>
                  <div className="relative"><span className="absolute left-3 top-2.5 text-slate-500">$</span><Input name="cat_Security" type="number" defaultValue="15000" required className="pl-7 rounded-lg" /></div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600">Repairs & Misc</Label>
                  <div className="relative"><span className="absolute left-3 top-2.5 text-slate-500">$</span><Input name="cat_Repairs" type="number" defaultValue="20000" required className="pl-7 rounded-lg" /></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card className={`border-none shadow-md text-white transition-colors duration-500 ${isBalanced ? 'bg-indigo-600' : 'bg-slate-700'}`}>
            <CardHeader className="pb-2">
              <CardTitle className={`flex items-center ${isBalanced ? 'text-indigo-100' : 'text-slate-200'}`}>
                <Calculator className="h-5 w-5 mr-2" />
                Budget Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mt-2">${(targetTotal / 1000).toFixed(0)}k</div>
              <p className={`mt-1 text-sm ${isBalanced ? 'text-indigo-200' : 'text-slate-300'}`}>Total Budget for {year}</p>
              
              <div className="mt-8 space-y-4">
                <div className={`flex justify-between items-center text-sm border-b pb-2 ${isBalanced ? 'border-indigo-500/50' : 'border-slate-600'}`}>
                  <span className={isBalanced ? 'text-indigo-100' : 'text-slate-300'}>Allocated</span>
                  <span className="font-semibold">${allocated.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className={`flex justify-between items-center text-sm border-b pb-2 ${isBalanced ? 'border-indigo-500/50' : 'border-slate-600'}`}>
                  <span className={isBalanced ? 'text-indigo-100' : 'text-slate-300'}>Remaining</span>
                  <span className={`font-semibold ${remaining === 0 ? 'text-emerald-300' : remaining < 0 ? 'text-rose-300' : 'text-amber-300'}`}>
                    ${Math.abs(remaining).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    {remaining < 0 && ' (Over)'}
                  </span>
                </div>
              </div>

              <div className={`mt-8 rounded-lg p-4 text-sm text-center border ${
                isBalanced 
                  ? 'bg-indigo-700/50 text-indigo-100 border-indigo-500/30' 
                  : remaining < 0 
                    ? 'bg-rose-500/20 text-rose-200 border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-200 border-amber-500/30'
              }`}>
                {isBalanced 
                  ? 'Perfectly balanced! You can now save and lock this budget.'
                  : remaining < 0
                    ? 'You have allocated more than your total budget.'
                    : 'You still have funds left to allocate.'
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
