'use client'

import { addApartment } from "@/app/admin/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Home, Users, Edit2, UserPlus, Trash2 } from "lucide-react"

export function ApartmentsSetup({ initialApartments = [] }: { initialApartments?: any[] }) {
  const totalSqft = initialApartments.reduce((sum, apt) => sum + apt.sqft, 0)

  return (
    <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Apartments & Owners</h1>
          <p className="text-slate-500 mt-1">Manage building units and ownership distributions.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Add Form */}
        <Card className="col-span-1 h-fit border-none shadow-md">
          <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
            <CardTitle>Register Unit</CardTitle>
            <CardDescription>Add a new apartment to the building.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form action={addApartment} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-slate-600 font-semibold">Unit Number</Label>
                <div className="relative">
                  <Home className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input id="unit" name="unitNumber" placeholder="e.g., 101" required className="pl-9 rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sqft" className="text-slate-600 font-semibold">Square Footage (SqFt)</Label>
                <Input id="sqft" name="sqft" type="number" required placeholder="1200" className="rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 rounded-lg mt-4 h-11">
                <Plus className="h-4 w-4 mr-2" /> Register Apartment
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Directory Table */}
        <Card className="col-span-2 border-none shadow-md overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Building Directory</CardTitle>
              <CardDescription>All registered apartments and their respective owners.</CardDescription>
            </div>
            <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-none">
                  <TableHead className="font-semibold text-slate-600 pl-6">Unit</TableHead>
                  <TableHead className="font-semibold text-slate-600">SqFt</TableHead>
                  <TableHead className="font-semibold text-slate-600">Share %</TableHead>
                  <TableHead className="font-semibold text-slate-600">Owner(s)</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600 pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialApartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-slate-500">No apartments registered yet.</TableCell>
                  </TableRow>
                ) : initialApartments.map((apt) => {
                  const sharePercent = totalSqft > 0 ? ((apt.sqft / totalSqft) * 100).toFixed(1) : '0.0'
                  return (
                    <TableRow key={apt.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-900 pl-6">{apt.unit_number}</TableCell>
                      <TableCell className="text-slate-600">{apt.sqft.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          {sharePercent}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2 py-2">
                          {apt.apartment_owners && apt.apartment_owners.length > 0 ? apt.apartment_owners.map((ownerRow: any) => {
                            const name = ownerRow.profiles?.full_name || 'Unknown'
                            const initial = name.charAt(0).toUpperCase()
                            return (
                              <div key={ownerRow.id} className="flex items-center">
                                <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold mr-2">{initial}</div>
                                <span className="text-sm text-slate-700">{name} ({ownerRow.ownership_percentage}%)</span>
                              </div>
                            )
                          }) : <span className="text-sm text-slate-400 italic">No owners assigned</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6 align-top pt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors inline-flex items-center">
                              <UserPlus className="h-4 w-4 mr-1" /> Add Owner
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] border-none shadow-xl rounded-xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Assign Owner to Unit {apt.unit_number}</DialogTitle>
                              <DialogDescription>
                                Create a new account for the owner and assign them to this unit.
                              </DialogDescription>
                            </DialogHeader>
                            <form action={async (formData) => {
                              const { createAndAssignOwner } = await import('@/app/admin/actions')
                              formData.append('apartment_id', apt.id)
                              const result = await createAndAssignOwner(formData)
                              if (result?.error) alert(result.error) // Simple alert for now
                              else alert("Owner successfully created and assigned!")
                            }} className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label className="text-slate-600 font-semibold">Full Name</Label>
                                <Input name="full_name" required placeholder="John Doe" className="rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-600 font-semibold">Email</Label>
                                <Input name="email" type="email" required placeholder="john@example.com" className="rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-600 font-semibold">Temporary Password</Label>
                                <Input name="password" required type="text" placeholder="e.g., TempPass123!" className="rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-600 font-semibold">Phone (Optional)</Label>
                                <Input name="phone" type="tel" placeholder="+1 234 567 8900" className="rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-600 font-semibold">Ownership Share (%)</Label>
                                <Input name="percentage" type="number" required defaultValue="100" max="100" min="1" className="rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
                                <p className="text-xs text-slate-500">Set to 100% unless co-owning.</p>
                              </div>
                              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md mt-2 rounded-lg h-11">Create & Assign Owner</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
