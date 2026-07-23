"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/i18n/provider"
import { AL_AIN_AREAS } from "@/lib/site-config"
import { Upload, Trash2, Check, Image as ImageIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function AdminAreas() {
  const { locale } = useI18n()
  const [covers, setCovers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    fetchCovers()
  }, [])

  const fetchCovers = async () => {
    const token = localStorage.getItem("admin_token")
    const res = await fetch("/api/admin/areas", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      const map: Record<string, string> = {}
      for (const c of data.covers) {
        map[c.areaValue] = c.coverImage
      }
      setCovers(map)
    }
    setLoading(false)
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const SIZE = 600
          const canvas = document.createElement("canvas")
          canvas.width = SIZE
          canvas.height = SIZE
          const ctx = canvas.getContext("2d")
          if (!ctx) { reject(new Error("Canvas not supported")); return }

          // Center-crop to square
          const minDim = Math.min(img.width, img.height)
          const sx = (img.width - minDim) / 2
          const sy = (img.height - minDim) / 2
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, SIZE, SIZE)
          resolve(canvas.toDataURL("image/jpeg", 0.85))
        }
        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  }

  const handleUpload = async (areaValue: string, file: File) => {
    setUploading(areaValue)
    try {
      const compressed = await compressImage(file)
      const token = localStorage.getItem("admin_token")
      const res = await fetch("/api/admin/areas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ areaValue, coverImage: compressed }),
      })
      if (res.ok) {
        setCovers({ ...covers, [areaValue]: compressed })
        toast.success(locale === "ar" ? "تم رفع الصورة بنجاح" : "Photo uploaded successfully")
      } else {
        toast.error("Upload failed")
      }
    } catch (error: any) {
      toast.error(error.message)
    }
    setUploading(null)
  }

  const handleDelete = async (areaValue: string) => {
    const token = localStorage.getItem("admin_token")
    await fetch("/api/admin/areas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ areaValue }),
    })
    const newCovers = { ...covers }
    delete newCovers[areaValue]
    setCovers(newCovers)
    toast.success(locale === "ar" ? "تم حذف الصورة" : "Photo removed")
  }

  if (loading) return <div className="text-muted-foreground">Loading...</div>

  const sortedAreas = [...AL_AIN_AREAS].sort((a, b) => a.labelEn.localeCompare(b.labelEn))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-1">
          {locale === "ar" ? "صور المناطق" : "Area Photos"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {locale === "ar"
            ? "ارفع صورة مخصصة لكل منطقة. سيتم قص الصورة تلقائياً لتكون مربعة (600×600)."
            : "Upload a custom photo for each area. Images are automatically cropped to square (600×600)."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAreas.map(area => {
          const hasCover = !!covers[area.areaValue || area.value]
          const coverImage = covers[area.areaValue || area.value]
          const areaValue = area.value

          return (
            <Card key={areaValue} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm">
                    {locale === "ar" ? area.labelAr : area.labelEn}
                  </h3>
                  <p className="text-xs text-muted-foreground">{areaValue}</p>
                </div>
                {hasCover && (
                  <Badge className="bg-green-500/15 text-green-600 border-0">
                    <Check className="h-3 w-3 me-1" />
                    {locale === "ar" ? "مخصص" : "Custom"}
                  </Badge>
                )}
              </div>

              {/* Preview */}
              <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3 relative">
                {hasCover ? (
                  <img src={coverImage} alt={area.labelEn} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                {uploading === areaValue && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleUpload(areaValue, file)
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={uploading === areaValue}
                    asChild
                  >
                    <span>
                      <Upload className="h-3 w-3 me-1" />
                      {hasCover
                        ? (locale === "ar" ? "تغيير" : "Change")
                        : (locale === "ar" ? "رفع صورة" : "Upload Photo")}
                    </span>
                  </Button>
                </label>
                {hasCover && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => handleDelete(areaValue)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
