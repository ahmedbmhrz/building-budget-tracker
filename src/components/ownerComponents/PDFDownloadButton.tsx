'use client'

import { useState, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { OwnerInvoiceDocument } from './OwnerInvoicePDF'
import { OwnerBalance } from "@/lib/calculations"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export function PDFDownloadButton({ owner, year }: { owner: OwnerBalance, year: number }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return <div className="h-8 w-8" /> // placeholder to prevent layout shift

  return (
    <PDFDownloadLink
      document={<OwnerInvoiceDocument owner={owner} year={year} />}
      fileName={`Invoice_${owner.full_name.replace(/\s+/g, '_')}_${year}.pdf`}
    >
      {/* @ts-ignore */}
      {({ blob, url, loading, error }) => (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 h-8 w-8 p-0"
          title="Download PDF Invoice"
          disabled={loading}
        >
          <FileText className="h-4 w-4" />
        </Button>
      )}
    </PDFDownloadLink>
  )
}
