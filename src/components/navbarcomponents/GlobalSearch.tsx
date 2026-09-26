'use client'

import { useState, useEffect, useRef } from "react"
import { Search, Building, Users, Receipt, Loader2 } from "lucide-react"
import { globalSearch } from "@/app/admin/actions"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/lib/hooks" // We need a simple debounce hook

export function GlobalSearch() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{ owners: any[], apartments: any[], expenses: any[] }>({ owners: [], apartments: [], expenses: [] })
  
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    async function fetchResults() {
      if (debouncedQuery.length > 0) {
        setIsLoading(true)
        const res = await globalSearch(debouncedQuery)
        setResults(res)
        setIsLoading(false)
      } else {
        setResults({ owners: [], apartments: [], expenses: [] })
      }
    }
    fetchResults()
  }, [debouncedQuery])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const hasResults = results.owners.length > 0 || results.apartments.length > 0 || results.expenses.length > 0

  return (
    <div ref={searchRef} className="relative w-64">
      <div className="flex items-center bg-slate-100 px-4 py-2 rounded-full w-full border border-slate-200/60 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all z-50 relative">
        <Search className="h-4 w-4 text-slate-400 mr-2" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
        />
        {isLoading && <Loader2 className="h-4 w-4 text-indigo-500 animate-spin absolute right-4" />}
      </div>

      {isOpen && query.length > 0 && (
        <div className="absolute top-12 left-0 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {hasResults ? (
            <div className="py-2">
              {results.owners.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase">Owners</div>
                  {results.owners.map(o => (
                    <button 
                      key={o.id} 
                      onClick={() => { setIsOpen(false); setQuery(""); router.push('/admin/owners') }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center"
                    >
                      <Users className="h-4 w-4 text-slate-400 mr-3" />
                      <span className="text-sm font-medium text-slate-700">{o.full_name}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.apartments.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase">Apartments</div>
                  {results.apartments.map(a => (
                    <button 
                      key={a.id} 
                      onClick={() => { setIsOpen(false); setQuery(""); router.push('/admin/apartments') }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center"
                    >
                      <Building className="h-4 w-4 text-slate-400 mr-3" />
                      <span className="text-sm font-medium text-slate-700">Unit {a.unit_number}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.expenses.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase">Expenses</div>
                  {results.expenses.map(e => (
                    <button 
                      key={e.id} 
                      onClick={() => { setIsOpen(false); setQuery(""); router.push('/admin/expenses') }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center"
                    >
                      <Receipt className="h-4 w-4 text-slate-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-slate-700">{e.category}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]">{e.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              {isLoading ? 'Searching...' : 'No results found.'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
