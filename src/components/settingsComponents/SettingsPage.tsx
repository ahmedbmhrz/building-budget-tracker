'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Bell, Building, Check, Mail } from "lucide-react"

export function SettingsPage() {
  return (
    <div className="space-y-8 pb-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account settings and building preferences.</p>
      </div>

      {/* Profile Settings */}
      <Card className="border-none shadow-md">
        <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and contact info.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-600 font-semibold">Full Name</Label>
              <Input id="name" defaultValue="Admin User" className="rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-600 font-semibold">Email Address</Label>
              <Input id="email" type="email" defaultValue="admin@building.com" className="rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-600 font-semibold">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="rounded-lg focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-600 font-semibold">Role</Label>
              <Input id="role" defaultValue="Property Manager" disabled className="rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t border-slate-100 rounded-b-xl flex justify-end py-4">
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20">
            <Check className="h-4 w-4 mr-2" /> Save Profile
          </Button>
        </CardFooter>
      </Card>

      {/* Building Preferences */}
      <Card className="border-none shadow-md">
        <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
              <Building className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle>Building Preferences</CardTitle>
              <CardDescription>Global settings for the property calculations.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-slate-600 font-semibold">Primary Currency</Label>
              <select id="currency" className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalsqft" className="text-slate-600 font-semibold">Total Building SqFt (Override)</Label>
              <Input id="totalsqft" type="number" placeholder="Calculated automatically..." disabled className="rounded-lg bg-slate-50" />
              <p className="text-xs text-slate-400">Sum of all apartments. Contact support to override.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-none shadow-md">
        <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
              <Bell className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your email alerts and system warnings.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4">
              <Mail className="h-5 w-5 text-slate-400" />
              <div>
                <p className="font-medium text-slate-900">Budget Limit Warnings</p>
                <p className="text-sm text-slate-500">Email me when a category exceeds 80% of its budget.</p>
              </div>
            </div>
            {/* Toggle switch mockup */}
            <div className="w-11 h-6 bg-indigo-600 rounded-full flex items-center p-1 cursor-pointer transition-colors shadow-inner">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-5 transition-transform"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4">
              <Mail className="h-5 w-5 text-slate-400" />
              <div>
                <p className="font-medium text-slate-900">New Payment Receipts</p>
                <p className="text-sm text-slate-500">Email me when an owner uploads a payment receipt.</p>
              </div>
            </div>
            <div className="w-11 h-6 bg-slate-200 rounded-full flex items-center p-1 cursor-pointer transition-colors shadow-inner">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
