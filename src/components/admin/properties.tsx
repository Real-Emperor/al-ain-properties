"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useI18n } from "@/i18n/provider"
import { AL_AIN_AREAS, PROPERTY_TYPES, LISTING_TYPES, formatPrice, getAreaByValue, getTypeByValue } from "@/lib/site-config"
import { Plus, Pencil, Trash2, Eye, Star } from "lucide-react"
import { toast } from "sonner"
import { PhotoUploader } from "./photo-uploader"

export function AdminProperties() {
  const { t, locale } = useI18n()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchProperties = async () => {
    const token = localStorage.getItem("admin_token")
    const res = await fetch("/api/admin/properties", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      setProperties(data.properties)
    }
    setLoading(false)
  }

  useEffect(() => { fetchProperties() }, [])

  const openNew = () => {
    setEditing({
      titleEn: "", titleAr: "",
      descriptionEn: "", descriptionAr: "",
      type: "villa", listingType: "rent", area: "al-jimi",
      addressEn: "", addressAr: "",
      latitude: "", longitude: "",
      price: "", bedrooms: 0, bathrooms: 0, sizeSqft: 0,
      furnished: false,
      photos: "", videoUrl: "",
      features: "",
      status: "active", featured: false,
    })
    setDialogOpen(true)
  }

  const openEdit = (p: any) => {
    // Convert photos/features back to text for editing
    let photosText = ""
    try { photosText = JSON.parse(p.photos || "[]").join("\n") } catch {}
    let featuresText = ""
    try { featuresText = JSON.parse(p.features || "[]").join("\n") } catch {}
    setEditing({
      ...p,
      latitude: p.latitude?.toString() || "",
      longitude: p.longitude?.toString() || "",
      price: p.price?.toString() || "",
      bedrooms: p.bedrooms || 0,
      bathrooms: p.bathrooms || 0,
      sizeSqft: p.sizeSqft || 0,
      photos: photosText,
      features: featuresText,
    })
    setDialogOpen(true)
  }

  const save = async () => {
    if (!editing) return
    const token = localStorage.getItem("admin_token")
    // Convert photos text to JSON array
    const photosArr = editing.photos.split("\n").map((s: string) => s.trim()).filter(Boolean)
    const featuresArr = editing.features.split("\n").map((s: string) => s.trim()).filter(Boolean)
    const payload = {
      ...editing,
      id: editing.id || undefined,
      photos: JSON.stringify(photosArr),
      features: JSON.stringify(featuresArr),
      price: Number(editing.price) || 0,
      bedrooms: Number(editing.bedrooms) || 0,
      bathrooms: Number(editing.bathrooms) || 0,
      sizeSqft: Number(editing.sizeSqft) || 0,
      latitude: editing.latitude ? Number(editing.latitude) : null,
      longitude: editing.longitude ? Number(editing.longitude) : null,
    }

    const res = await fetch("/api/admin/properties", {
      method: editing.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      toast.success(t("admin.property.saved"))
      setDialogOpen(false)
      fetchProperties()
    } else {
      toast.error("Failed to save")
    }
  }

  const remove = async (id: string) => {
    if (!confirm(t("admin.property.confirmDelete"))) return
    const token = localStorage.getItem("admin_token")
    const res = await fetch("/api/admin/properties", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      toast.success(t("admin.property.deleted"))
      fetchProperties()
    }
  }

  const toggleFeatured = async (p: any) => {
    const token = localStorage.getItem("admin_token")
    await fetch("/api/admin/properties", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: p.id, featured: !p.featured }),
    })
    fetchProperties()
  }

  if (loading) return <div className="text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("admin.dashboard.properties")}</h1>
        <Button onClick={openNew} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 dark:bg-[#c9a84c] dark:hover:bg-[#c9a84c]/90 dark:text-[#0a0f1e]">
          <Plus className="h-4 w-4 me-2" />
          {t("admin.property.addNew")}
        </Button>
      </div>

      {/* Properties list */}
      <div className="space-y-2">
        {properties.map(p => {
          const area = getAreaByValue(p.area)
          const type = getTypeByValue(p.type)
          const photos = (() => { try { return JSON.parse(p.photos || "[]") } catch { return [] } })()
          return (
            <Card key={p.id} className="p-3 flex items-center gap-3">
              <img
                src={photos[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&q=80"}
                alt={p.titleEn}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm line-clamp-1">
                  {locale === "ar" ? p.titleAr : p.titleEn}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap mt-1">
                  <span>{type?.icon} {locale === "ar" ? type?.labelAr : type?.labelEn}</span>
                  <span>•</span>
                  <span>{area ? (locale === "ar" ? area.labelAr : area.labelEn) : p.area}</span>
                  <span>•</span>
                  <span className="font-semibold text-[#1e3a8a] dark:text-[#c9a84c]">{formatPrice(p.price, locale)}</span>
                  <span>•</span>
                  <span><Eye className="h-3 w-3 inline" /> {p.views}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => toggleFeatured(p)} title="Toggle featured">
                  <Star className={`h-4 w-4 ${p.featured ? "fill-[#c9a84c] text-[#c9a84c]" : ""}`} />
                </Button>
                <Badge variant={p.status === "active" ? "default" : "secondary"} className="text-xs">
                  {p.status}
                </Badge>
                <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => remove(p.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Edit/Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? t("admin.property.editProperty") : t("admin.property.addNew")}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>{t("admin.property.titleEn")} *</Label>
                <Input value={editing.titleEn} onChange={e => setEditing({ ...editing, titleEn: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>{t("admin.property.titleAr")} *</Label>
                <Input value={editing.titleAr} onChange={e => setEditing({ ...editing, titleAr: e.target.value })} className="mt-1" dir="rtl" />
              </div>
              <div className="md:col-span-2">
                <Label>{t("admin.property.descriptionEn")}</Label>
                <Textarea value={editing.descriptionEn} onChange={e => setEditing({ ...editing, descriptionEn: e.target.value })} rows={3} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>{t("admin.property.descriptionAr")}</Label>
                <Textarea value={editing.descriptionAr} onChange={e => setEditing({ ...editing, descriptionAr: e.target.value })} rows={3} className="mt-1" dir="rtl" />
              </div>
              <div>
                <Label>{t("admin.property.type")}</Label>
                <Select value={editing.type} onValueChange={v => setEditing({ ...editing, type: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.icon} {locale === "ar" ? p.labelAr : p.labelEn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("admin.property.listingType")}</Label>
                <Select value={editing.listingType} onValueChange={v => setEditing({ ...editing, listingType: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LISTING_TYPES.map(l => (
                      <SelectItem key={l.value} value={l.value}>{locale === "ar" ? l.labelAr : l.labelEn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("admin.property.area")}</Label>
                <Select value={editing.area} onValueChange={v => setEditing({ ...editing, area: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {AL_AIN_AREAS.map(a => (
                      <SelectItem key={a.value} value={a.value}>{locale === "ar" ? a.labelAr : a.labelEn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("admin.property.price")} (AED) *</Label>
                <Input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: e.target.value })} className="mt-1" dir="ltr" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>{t("admin.property.bedrooms")}</Label>
                  <Input type="number" value={editing.bedrooms} onChange={e => setEditing({ ...editing, bedrooms: e.target.value })} className="mt-1" dir="ltr" />
                </div>
                <div>
                  <Label>{t("admin.property.bathrooms")}</Label>
                  <Input type="number" value={editing.bathrooms} onChange={e => setEditing({ ...editing, bathrooms: e.target.value })} className="mt-1" dir="ltr" />
                </div>
                <div>
                  <Label>{t("admin.property.sizeSqft")}</Label>
                  <Input type="number" value={editing.sizeSqft} onChange={e => setEditing({ ...editing, sizeSqft: e.target.value })} className="mt-1" dir="ltr" />
                </div>
              </div>
              <div>
                <Label>{t("admin.property.addressEn")}</Label>
                <Input value={editing.addressEn} onChange={e => setEditing({ ...editing, addressEn: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>{t("admin.property.addressAr")}</Label>
                <Input value={editing.addressAr} onChange={e => setEditing({ ...editing, addressAr: e.target.value })} className="mt-1" dir="rtl" />
              </div>
              <div>
                <Label>{t("admin.property.latitude")}</Label>
                <Input value={editing.latitude} onChange={e => setEditing({ ...editing, latitude: e.target.value })} className="mt-1" dir="ltr" />
              </div>
              <div>
                <Label>{t("admin.property.longitude")}</Label>
                <Input value={editing.longitude} onChange={e => setEditing({ ...editing, longitude: e.target.value })} className="mt-1" dir="ltr" />
              </div>
              <div className="md:col-span-2">
                <PhotoUploader
                  value={editing.photos}
                  onChange={(v) => setEditing({ ...editing, photos: v })}
                  label={t("admin.property.photos")}
                />
              </div>
              <div className="md:col-span-2">
                <Label>{t("admin.property.features")}</Label>
                <Textarea
                  value={editing.features}
                  onChange={e => setEditing({ ...editing, features: e.target.value })}
                  rows={3}
                  className="mt-1 text-xs"
                  placeholder="Maid Room&#10;Private Pool&#10;Covered Parking"
                />
              </div>
              <div>
                <Label>{t("admin.property.status")}</Label>
                <Select value={editing.status} onValueChange={v => setEditing({ ...editing, status: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={e => setEditing({ ...editing, featured: e.target.checked })}
                    className="h-4 w-4"
                  />
                  {t("admin.property.featured")}
                </label>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 dark:bg-[#c9a84c] dark:hover:bg-[#c9a84c]/90 dark:text-[#0a0f1e]">
              {t("admin.property.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
