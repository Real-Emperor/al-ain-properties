"use client"

import { useState, useEffect } from "react"

interface AreaData {
  value: string
  labelEn: string
  labelAr: string
  coverImage: string | null
  isCustom: boolean
}

// Global cache for areas data — prevents duplicate /api/areas calls
// when multiple components on the same page need the same data.
let cachedAreas: AreaData[] | null = null
let fetchPromise: Promise<AreaData[]> | null = null

async function fetchAreas(): Promise<AreaData[]> {
  if (cachedAreas) return cachedAreas
  if (fetchPromise) return fetchPromise

  fetchPromise = fetch("/api/areas")
    .then(r => r.json())
    .then(data => {
      const areas = (data.areas || []) as AreaData[]
      cachedAreas = areas
      fetchPromise = null
      return areas
    })
    .catch(() => {
      fetchPromise = null
      return []
    })

  return fetchPromise
}

export function useAreas() {
  const [areas, setAreas] = useState<AreaData[]>(cachedAreas || [])

  useEffect(() => {
    if (cachedAreas) return
    fetchAreas().then(setAreas)
  }, [])

  return areas
}

// For components that only need area labels (no cover images)
export function useAreaLabels() {
  const areas = useAreas()
  return areas.map(a => ({ value: a.value, labelEn: a.labelEn, labelAr: a.labelAr }))
}
