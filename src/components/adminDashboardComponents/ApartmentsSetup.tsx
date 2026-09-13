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

export function ApartmentsSetup() {
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
                <TableRow className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-slate-900 pl-6">101</TableCell>
                  <TableCell className="text-slate-600">1,200</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                      12.5%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold mr-2">JD</div>
                      <span className="text-sm text-slate-700">John Doe (100%)</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors inline-flex items-center">
                          <Edit2 className="h-3 w-3 mr-1" /> Edit
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] border-none shadow-xl rounded-xl">
                        <DialogHeader>
                          <DialogTitle>Edit Unit 101</DialogTitle>
                          <DialogDescription>
                            Update the unit details and ownership parameters.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-5 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-unit-101" className="text-slate-600 font-semibold">Unit Number</Label>
                              <div className="relative">
                                <Home className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input id="edit-unit-101" defaultValue="101" className="pl-9 rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-sqft-101" className="text-slate-600 font-semibold">SqFt</Label>
                              <Input id="edit-sqft-101" type="number" defaultValue="1200" className="rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
                            </div>
                          </div>
                          
                          <div className="border-t border-slate-100 pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-slate-600 font-semibold">Registered Owners</Label>
                              <button className="text-xs text-indigo-600 flex items-center font-medium hover:underline">
                                <UserPlus className="h-3 w-3 mr-1" /> Add Owner
                              </button>
                            </div>
                            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                               <div className="flex items-center">
                                 <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold mr-2">JD</div>
                                 <span className="text-sm text-slate-700 font-medium">John Doe</span>
                               </div>
                               <div className="flex items-center space-x-2">
                                 <Input type="number" defaultValue="100" className="w-16 h-8 text-sm rounded-md" /> <span className="text-sm text-slate-500">%</span>
                                 <button className="text-rose-500 hover:text-rose-700 p-1"><Trash2 className="h-4 w-4" /></button>
                               </div>
                            </div>
                          </div>
                          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md mt-2 rounded-lg h-11">Save Changes</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                  <TableCell className="font-medium text-slate-900 pl-6">102</TableCell>
                  <TableCell className="text-slate-600">1,500</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                      15.6%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2 py-2">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold mr-2">A</div>
                        <span className="text-sm text-slate-700">Alice (50%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold mr-2">B</div>
                        <span className="text-sm text-slate-700">Bob (50%)</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6 align-top pt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors inline-flex items-center">
                          <Edit2 className="h-3 w-3 mr-1" /> Edit
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] border-none shadow-xl rounded-xl">
                        <DialogHeader>
                          <DialogTitle>Edit Unit 102</DialogTitle>
                          <DialogDescription>
                            Update the unit details and ownership parameters.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-5 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-unit-102" className="text-slate-600 font-semibold">Unit Number</Label>
                              <div className="relative">
                                <Home className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input id="edit-unit-102" defaultValue="102" className="pl-9 rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-sqft-102" className="text-slate-600 font-semibold">SqFt</Label>
                              <Input id="edit-sqft-102" type="number" defaultValue="1500" className="rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
                            </div>
                          </div>
                          
                          <div className="border-t border-slate-100 pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-slate-600 font-semibold">Registered Owners</Label>
                              <button className="text-xs text-indigo-600 flex items-center font-medium hover:underline">
                                <UserPlus className="h-3 w-3 mr-1" /> Add Owner
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                               <div className="flex items-center">
                                 <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold mr-2">A</div>
                                 <span className="text-sm text-slate-700 font-medium">Alice</span>
                               </div>
                               <div className="flex items-center space-x-2">
                                 <Input type="number" defaultValue="50" className="w-16 h-8 text-sm rounded-md" /> <span className="text-sm text-slate-500">%</span>
                                 <button className="text-rose-500 hover:text-rose-700 p-1"><Trash2 className="h-4 w-4" /></button>
                               </div>
                            </div>
                            
                            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                               <div className="flex items-center">
                                 <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold mr-2">B</div>
                                 <span className="text-sm text-slate-700 font-medium">Bob</span>
                               </div>
                               <div className="flex items-center space-x-2">
                                 <Input type="number" defaultValue="50" className="w-16 h-8 text-sm rounded-md" /> <span className="text-sm text-slate-500">%</span>
                                 <button className="text-rose-500 hover:text-rose-700 p-1"><Trash2 className="h-4 w-4" /></button>
                               </div>
                            </div>
                          </div>
                          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md mt-2 rounded-lg h-11">Save Changes</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
