"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/i18n/provider"
import { AL_AIN_AREAS } from "@/lib/site-config"
import { Upload, Trash2, Check, Image as ImageIcon, Loader2, Eye, EyeOff, Plus, X } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"

interface AreaInfo {
  value: string
  labelEn: string
  labelAr: string
  coverImage: string | null
  hidden: boolean
  isCustom: boolean
}

export function AdminAreas() {
  const { locale } = useI18n()
  const [areas, setAreas] = useState<AreaInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newArea, setNewArea] = useState({ areaValue: "", labelEn: "", labelAr: "" })

  useEffect(() => { fetchAreas() }, [])

  const fetchAreas = async () => {
    const token = localStorage.getItem("admin_token")
    const res = await fetch("/api/admin/areas", { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      const data = await res.json()
      setAreas(data.areas)
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

  const handleUpload = async (area: AreaInfo, file: File) => {
    setUploading(area.value)
    try {
      const compressed = await compressImage(file)
      const token = localStorage.getItem("admin_token")
      const action = area.isCustom ? "uploadCustomCover" : "uploadCover"
      const res = await fetch("/api/admin/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action, areaValue: area.value, coverImage: compressed }),
      })
      if (res.ok) {
        setAreas(areas.map(a => a.value === area.value ? { ...a, coverImage: compressed } : a))
        toast.success(locale === "ar" ? "تم رفع الصورة" : "Photo uploaded")
      }
    } catch (e: any) { toast.error(e.message) }
    setUploading(null)
  }

  const handleDeleteCover = async (area: AreaInfo) => {
    const token = localStorage.getItem("admin_token")
    await fetch("/api/admin/areas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ areaValue: area.value, isCustom: area.isCustom }),
    })
    if (area.isCustom) {
      setAreas(areas.filter(a => a.value !== area.value))
      toast.success(locale === "ar" ? "تم حذف المنطقة" : "Area deleted")
    } else {
      setAreas(areas.map(a => a.value === area.value ? { ...a, coverImage: null } : a))
      toast.success(locale === "ar" ? "تم حذف الصورة" : "Photo removed")
    }
  }

  const handleToggleHidden = async (area: AreaInfo) => {
    const token = localStorage.getItem("admin_token")
    const res = await fetch("/api/admin/areas", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "toggleHidden", areaValue: area.value }),
    })
    if (res.ok) {
      const data = await res.json()
      setAreas(areas.map(a => a.value === area.value ? { ...a, hidden: data.hidden } : a))
      toast.success(data.hidden
        ? (locale === "ar" ? "تم إخفاء المنطقة" : "Area hidden")
        : (locale === "ar" ? "تم إظهار المنطقة" : "Area visible"))
    }
  }

  const handleAddCustom = async () => {
    if (!newArea.areaValue || !newArea.labelEn || !newArea.labelAr) {
      toast.error(locale === "ar" ? "يرجى ملء جميع الحقول" : "Please fill all fields")
      return
    }
    const token = localStorage.getItem("admin_token")
    const res = await fetch("/api/admin/areas", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        action: "addCustom",
        areaValue: newArea.areaValue.toLowerCase().replace(/\s+/g, "-"),
        labelEn: newArea.labelEn,
        labelAr: newArea.labelAr,
      }),
    })
    if (res.ok) {
      toast.success(locale === "ar" ? "تمت إضافة المنطقة" : "Area added")
      setShowAddDialog(false)
      setNewArea({ areaValue: "", labelEn: "", labelAr: "" })
      fetchAreas()
    }
  }

  if (loading) return <div className="text-muted-foreground">Loading...</div>

  // Sort: visible first, then by name
  const sortedAreas = [...areas].sort((a, b) => {
    if (a.hidden !== b.hidden) return a.hidden ? 1 : -1
    return a.labelEn.localeCompare(b.labelEn)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">{locale === "ar" ? "صور المناطق" : "Area Photos"}</h1>
          <p className="text-sm text-muted-foreground">
            {locale === "ar" ? "ارفع صوراً، أضف مناطق جديدة، أو أخفِ المناطق غير اللازمة" : "Upload photos, add new areas, or hide areas you don't need"}
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90">
          <Plus className="h-4 w-4 me-2" />
          {locale === "ar" ? "إضافة منطقة" : "Add Area"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAreas.map(area => (
          <Card key={area.value} className={`p-4 ${area.hidden ? "opacity-50" : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm">{locale === "ar" ? area.labelAr : area.labelEn}</h3>
                <p className="text-xs text-muted-foreground">{area.value}</p>
              </div>
              <div className="flex items-center gap-1">
                {area.isCustom && <Badge className="bg-blue-500/15 text-blue-600 border-0">Custom</Badge>}
                {area.coverImage && <Badge className="bg-green-500/15 text-green-600 border-0"><Check className="h-3 w-3 me-1" />Photo</Badge>}
                {area.hidden && <Badge className="bg-gray-500/15 text-gray-500 border-0">Hidden</Badge>}
              </div>
            </div>

            <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3 relative">
              {area.coverImage ? (
                <img src={area.coverImage} alt={area.labelEn} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
              {uploading === area.value && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>

            <div className="flex gap-1">
              <label className="flex-1">
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(area, f) }} />
                <Button type="button" variant="outline" size="sm" className="w-full" disabled={uploading === area.value} asChild>
                  <span><Upload className="h-3 w-3 me-1" />{area.coverImage ? (locale === "ar" ? "تغيير" : "Change") : (locale === "ar" ? "رفع" : "Upload")}</span>
                </Button>
              </label>
              {!area.isCustom && (
                <Button type="button" variant="ghost" size="sm" title={area.hidden ? "Show" : "Hide"} onClick={() => handleToggleHidden(area)}>
                  {area.hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
              )}
              {(area.coverImage || area.isCustom) && (
                <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteCover(area)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add Custom Area Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{locale === "ar" ? "إضافة منطقة جديدة" : "Add New Area"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div>
              <Label>{locale === "ar" ? "الاسم بالإنجليزية" : "English Name"}</Label>
              <Input value={newArea.labelEn} onChange={e => setNewArea({ ...newArea, labelEn: e.target.value })} placeholder="e.g. Al New Area" className="mt-1" />
            </div>
            <div>
              <Label>{locale === "ar" ? "الاسم بالعربية" : "Arabic Name"}</Label>
              <Input value={newArea.labelAr} onChange={e => setNewArea({ ...newArea, labelAr: e.target.value })} placeholder="مثال: منطقة جديدة" className="mt-1" dir="rtl" />
            </div>
            <div>
              <Label>{locale === "ar" ? "المعرف (إنجليزي)" : "Slug (English)"}</Label>
              <Input value={newArea.areaValue} onChange={e => setNewArea({ ...newArea, areaValue: e.target.value })} placeholder="e.g. al-new-area" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>{locale === "ar" ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={handleAddCustom} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90">{locale === "ar" ? "إضافة" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
