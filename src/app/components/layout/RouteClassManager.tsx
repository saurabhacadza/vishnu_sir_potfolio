'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function RouteClassManager() {
  const pathname = usePathname()

  useEffect(() => {
    const isDostRoute = pathname === '/dost' || pathname.startsWith('/dost/')
    document.body.classList.toggle('dost-route', isDostRoute)

    return () => {
      document.body.classList.remove('dost-route')
    }
  }, [pathname])

  return null
}
