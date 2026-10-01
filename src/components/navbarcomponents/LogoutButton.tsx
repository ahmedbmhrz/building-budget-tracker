'use client'

import { useFormStatus } from 'react-dom'

export function LogoutButton() {
  const { pending } = useFormStatus()
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline transition-colors disabled:opacity-50"
    >
      {pending ? 'Logging out...' : 'Log out'}
    </button>
  )
}
