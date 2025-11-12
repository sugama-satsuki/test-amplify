import React from "react"
import { useGroups } from "../hooks/useGroups"

export function RequireGroup({
  anyOf,
  fallback = null,
  children,
}: {
  anyOf: string[]
  fallback?: React.ReactNode
  children: React.ReactNode
}) {
  const { isIn, loading } = useGroups()
  if (loading) { return null; }
  return isIn(...anyOf) ? <>{children}</> : <>{fallback}</>
}
