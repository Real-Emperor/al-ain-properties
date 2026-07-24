"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/i18n/provider"
import {
  Upload, Trash2, Check, Image as ImageIcon, Loader2,
  Eye, EyeOff, Plus, AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog"

interface AreaInfo {
  value: string
  labelEn: string
  labelAr: string
  coverImage: string | null
  hidden: boolean
  isCustom: boolean
  propertyCount: number
}

export function AdminAreas() {
  const { locale } = useI18n()
  const [areas, setAreas] = useState<AreaInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [addingArea, setAddingArea] = useState(false)
  const [newArea, setNewArea] = useState({ labelEn: "", labelAr: "" })

  // Confirmation dialog state for hide/delete with properties
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    type: "hide" | "delete" | null
    area: AreaInfo | null
    pendingHidden?: boolean
  }>({ open: false, type: null, area: null })

  useEffect(() => { fetchAreas() }, [])

  const fetchAreas = async () => {
    try {
      const token = localStorage.getItem("admin_token")
      const res = await fetch("/api/admin/areas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setAreas(data.areas || [])
      } else {
        toast.error(locale === "ar" ? "فشل تحميل المناطق" : "Failed to load areas")
      }
    } catch (e: any) {
      toast.error(e.message || "Network error")
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
      } else {
        toast.error(locale === "ar" ? "فشل رفع الصورة" : "Upload failed")
      }
    } catch (e: any) {
      toast.error(e.message)
    }
    setUploading(null)
  }

  // ─── Hide / Show toggle ───
  const handleToggleHidden = async (area: AreaInfo) => {
    // If the area has properties, show confirmation popup first
    if (area.propertyCount > 0) {
      setConfirmDialog({
        open: true,
        type: "hide",
        area,
        pendingHidden: !area.hidden,
      })
      return
    }
    await doToggleHidden(area)
  }

  const doToggleHidden = async (area: AreaInfo) => {
    try {
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
      } else {
        toast.error(locale === "ar" ? "فشل تحديث الحالة" : "Failed to update")
      }
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  // ─── Delete area ───
  const handleDelete = async (area: AreaInfo) => {
    // If the area has properties, show confirmation popup first
    if (area.propertyCount > 0) {
      setConfirmDialog({
        open: true,
        type: "delete",
        area,
      })
      return
    }
    // For built-in areas with no properties, just remove the cover photo (no confirmation needed)
    // For custom areas with no properties, ask for simple confirmation
    if (area.isCustom) {
      setConfirmDialog({
        open: true,
        type: "delete",
        area,
      })
      return
    }
    await doDelete(area)
  }

  const doDelete = async (area: AreaInfo) => {
    try {
      const token = localStorage.getItem("admin_token")
      const res = await fetch("/api/admin/areas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ areaValue: area.value, isCustom: area.isCustom }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        if (area.isCustom) {
          setAreas(areas.filter(a => a.value !== area.value))
          toast.success(locale === "ar" ? "تم حذف المنطقة نهائياً" : "Area permanently deleted")
        } else {
          setAreas(areas.map(a => a.value === area.value ? { ...a, coverImage: null } : a))
          toast.success(locale === "ar" ? "تم حذف الصورة" : "Photo removed")
        }
      } else if (res.status === 409) {
        // Area has properties — cannot delete
        toast.error(data.message || (locale === "ar"
          ? `لا يمكن الحذف: تحتوي المنطقة على ${data.propertyCount} عقار`
          : `Cannot delete: area has ${data.propertyCount} properties`))
      } else {
        toast.error(data.error || (locale === "ar" ? "فشل الحذف" : "Delete failed"))
      }
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  // ─── Add custom area ───
  const handleAddCustom = async () => {
    if (!newArea.labelEn.trim() || !newArea.labelAr.trim()) {
      toast.error(locale === "ar" ? "يرجى ملء جميع الحقول" : "Please fill all fields")
      return
    }
    setAddingArea(true)
    try {
      const token = localStorage.getItem("admin_token")
      const res = await fetch("/api/admin/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          action: "addCustom",
          labelEn: newArea.labelEn.trim(),
          labelAr: newArea.labelAr.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        toast.success(locale === "ar" ? "تمت إضافة المنطقة" : "Area added successfully")
        setShowAddDialog(false)
        setNewArea({ labelEn: "", labelAr: "" })
        await fetchAreas()
      } else {
        toast.error(data.error || (locale === "ar" ? "فشل إضافة المنطقة" : "Failed to add area"))
      }
    } catch (e: any) {
      toast.error(e.message)
    }
    setAddingArea(false)
  }

  // ─── Confirmation dialog actions ───
  const handleConfirmAction = async () => {
    const { type, area } = confirmDialog
    if (!area) return
    setConfirmDialog({ open: false, type: null, area: null })
    if (type === "hide") {
      await doToggleHidden(area)
    } else if (type === "delete") {
      await doDelete(area)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Sort: visible first, then by name (English by default)
  const sortedAreas = [...areas].sort((a, b) => {
    if (a.hidden !== b.hidden) return a.hidden ? 1 : -1
    return a.labelEn.localeCompare(b.labelEn)
  })

  const t = (en: string, ar: string) => locale === "ar" ? ar : en

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t("Area Photos", "صور المناطق")}</h1>
          <p className="text-sm text-muted-foreground">
            {t(
              "Upload photos, add new areas, hide, or delete areas",
              "ارفع صوراً، أضف مناطق جديدة، أخفِ أو احذف المناطق"
            )}
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90">
          <Plus className="h-4 w-4 me-2" />
          {t("Add Area", "إضافة منطقة")}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAreas.map(area => (
          <Card key={area.value} className={`p-4 ${area.hidden ? "opacity-50" : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate">
                  {locale === "ar" ? area.labelAr : area.labelEn}
                </h3>
                <p className="text-xs text-muted-foreground truncate">{area.value}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {area.isCustom && (
                  <Badge className="bg-blue-500/15 text-blue-600 border-0">{t("Custom", "مخصص")}</Badge>
                )}
                {area.propertyCount > 0 && (
                  <Badge className="bg-amber-500/15 text-amber-600 border-0">
                    {area.propertyCount} {t("props", "عقار")}
                  </Badge>
                )}
                {area.coverImage && (
                  <Badge className="bg-green-500/15 text-green-600 border-0">
                    <Check className="h-3 w-3 me-1" />{t("Photo", "صورة")}
                  </Badge>
                )}
                {area.hidden && (
                  <Badge className="bg-gray-500/15 text-gray-500 border-0">{t("Hidden", "مخفي")}</Badge>
                )}
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

            <div className="flex flex-wrap gap-1">
              <label className="flex-1 min-w-[80px]">
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(area, f) }} />
                <Button type="button" variant="outline" size="sm" className="w-full" disabled={uploading === area.value} asChild>
                  <span>
                    <Upload className="h-3 w-3 me-1" />
                    {area.coverImage ? (locale === "ar" ? "تغيير" : "Change") : (locale === "ar" ? "رفع" : "Upload")}
                  </span>
                </Button>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                title={area.hidden ? (locale === "ar" ? "إظهار" : "Show") : (locale === "ar" ? "إخفاء" : "Hide")}
                onClick={() => handleToggleHidden(area)}
              >
                {area.hidden ? <Eye className="h-3 w-3 me-1" /> : <EyeOff className="h-3 w-3 me-1" />}
                <span className="text-xs">{area.hidden ? (locale === "ar" ? "إظهار" : "Show") : (locale === "ar" ? "إخفاء" : "Hide")}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/50"
                title={area.isCustom
                  ? (locale === "ar" ? "حذف المنطقة نهائياً" : "Delete area permanently")
                  : (locale === "ar" ? "حذف الصورة وإعادة التعيين" : "Remove photo & reset")}
                onClick={() => handleDelete(area)}
              >
                <Trash2 className="h-3 w-3 me-1" />
                <span className="text-xs">{locale === "ar" ? "حذف" : "Delete"}</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Custom Area Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Add New Area", "إضافة منطقة جديدة")}</DialogTitle>
            <DialogDescription>
              {t(
                "The area identifier (slug) will be auto-generated from the English name.",
                "سيتم إنشاء معرف المنطقة تلقائياً من الاسم الإنجليزي."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div>
              <Label>{t("English Name", "الاسم بالإنجليزية")}</Label>
              <Input
                value={newArea.labelEn}
                onChange={e => setNewArea({ ...newArea, labelEn: e.target.value })}
                placeholder="e.g. Al New Area"
                className="mt-1"
                dir="ltr"
              />
            </div>
            <div>
              <Label>{t("Arabic Name", "الاسم بالعربية")}</Label>
              <Input
                value={newArea.labelAr}
                onChange={e => setNewArea({ ...newArea, labelAr: e.target.value })}
                placeholder="مثال: منطقة جديدة"
                className="mt-1"
                dir="rtl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={addingArea}>
              {t("Cancel", "إلغاء")}
            </Button>
            <Button
              onClick={handleAddCustom}
              className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90"
              disabled={addingArea || !newArea.labelEn.trim() || !newArea.labelAr.trim()}
            >
              {addingArea ? (
                <>
                  <Loader2 className="h-4 w-4 me-2 animate-spin" />
                  {t("Adding...", "جاري الإضافة...")}
                </>
              ) : (
                t("Add", "إضافة")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog (for hide/delete on areas with properties) */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => {
        if (!open) setConfirmDialog({ open: false, type: null, area: null })
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {confirmDialog.type === "delete"
                ? t("Confirm Delete", "تأكيد الحذف")
                : t("Confirm Hide", "تأكيد الإخفاء")}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.area && confirmDialog.area.propertyCount > 0 && (
                <>
                  {confirmDialog.type === "delete" ? (
                    <>
                      {t(
                        `This area "${confirmDialog.area.labelEn}" contains ${confirmDialog.area.propertyCount} propert${confirmDialog.area.propertyCount === 1 ? "y" : "ies"}. `,
                        `تحتوي منطقة "${confirmDialog.area.labelAr}" على ${confirmDialog.area.propertyCount} عقار. `
                      )}
                      {confirmDialog.area.isCustom ? (
                        t(
                          "Permanently deleting the area will not delete the properties, but they will no longer be associated with this area on the public listing. Are you sure you want to delete this area?",
                          "حذف المنطقة نهائياً لن يحذف العقارات، لكنها لن تظهر تحت هذه المنطقة في الموقع العام. هل أنت متأكد من حذف هذه المنطقة؟"
                        )
                      ) : (
                        t(
                          "Removing the cover photo will not affect the properties. Are you sure you want to continue?",
                          "إزالة الصورة لن يؤثر على العقارات. هل أنت متأكد من المتابعة؟"
                        )
                      )}
                    </>
                  ) : (
                    <>
                      {t(
                        `This area "${confirmDialog.area.labelEn}" contains ${confirmDialog.area.propertyCount} propert${confirmDialog.area.propertyCount === 1 ? "y" : "ies"}. `,
                        `تحتوي منطقة "${confirmDialog.area.labelAr}" على ${confirmDialog.area.propertyCount} عقار. `
                      )}
                      {confirmDialog.pendingHidden ? (
                        t(
                          "Hiding the area will remove it from the public website, but the properties will remain in the database. Are you sure you want to hide this area?",
                          "إخفاء المنطقة سيزيلها من الموقع العام، لكن العقارات ستبقى في قاعدة البيانات. هل أنت متأكد من إخفاء هذه المنطقة؟"
                        )
                      ) : (
                        t(
                          "Are you sure you want to make this area visible again?",
                          "هل أنت متأكد من إظهار هذه المنطقة مرة أخرى؟"
                        )
                      )}
                    </>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, type: null, area: null })}>
              {t("Cancel", "إلغاء")}
            </Button>
            <Button
              className={confirmDialog.type === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-[#1e3a8a] hover:bg-[#1e3a8a]/90"}
              onClick={handleConfirmAction}
            >
              {confirmDialog.type === "delete"
                ? (confirmDialog.area?.isCustom
                  ? t("Delete Permanently", "حذف نهائياً")
                  : t("Remove Photo", "إزالة الصورة"))
                : (confirmDialog.pendingHidden
                  ? t("Hide Area", "إخفاء المنطقة")
                  : t("Show Area", "إظهار المنطقة"))}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
