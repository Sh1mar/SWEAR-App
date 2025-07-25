'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/redux/stores'
import { setUserEmail, setUserPassword } from '@/redux/auth/auth'

export default function StoreProvider({
  userEmail,
  userPassword,
  children
}: {
  userEmail: string
  userPassword: string
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
    storeRef.current.dispatch(setUserEmail(userEmail))
    storeRef.current.dispatch(setUserPassword(userPassword))
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}