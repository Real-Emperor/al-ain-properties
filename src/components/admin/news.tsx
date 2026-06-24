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
import { NEWS_CATEGORIES } from "@/lib/site-config"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"
import { SinglePhotoUploader } from "./photo-uploader"

export function AdminNews() {
  const { t, locale } = useI18n()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchArticles = async () => {
    const token = localStorage.getItem("admin_token")
    const res = await fetch("/api/admin/news", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setArticles((await res.json()).articles)
    setLoading(false)
  }

  useEffect(() => { fetchArticles() }, [])

  const openNew = () => {
    setEditing({
      titleEn: "", titleAr: "",
      excerptEn: "", excerptAr: "",
      contentEn: "", contentAr: "",
      category: "Al Ain Property News",
      coverImage: "",
      status: "published",
    })
    setDialogOpen(true)
  }

  const openEdit = (a: any) => {
    setEditing({ ...a })
    setDialogOpen(true)
  }

  const save = async () => {
    if (!editing) return
    const token = localStorage.getItem("admin_token")
    const res = await fetch("/api/admin/news", {
      method: editing.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(editing),
    })
    if (res.ok) {
      toast.success(t("admin.news.saved"))
      setDialogOpen(false)
      fetchArticles()
    } else {
      toast.error("Failed to save")
    }
  }

  const remove = async (id: string) => {
    if (!confirm(t("admin.news.confirmDelete"))) return
    const token = localStorage.getItem("admin_token")
    const res = await fetch("/api/admin/news", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      toast.success(t("admin.news.deleted"))
      fetchArticles()
    }
  }

  if (loading) return <div className="text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("admin.dashboard.news")}</h1>
        <Button onClick={openNew} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 dark:bg-[#c9a84c] dark:hover:bg-[#c9a84c]/90 dark:text-[#0a0f1e]">
          <Plus className="h-4 w-4 me-2" />
          {t("admin.news.addNew")}
        </Button>
      </div>

      <div className="space-y-2">
        {articles.map(a => (
          <Card key={a.id} className="p-3 flex items-center gap-3">
            <img
              src={a.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80"}
              alt={a.titleEn}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm line-clamp-1">
                {locale === "ar" ? a.titleAr : a.titleEn}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap mt-1">
                <Badge variant="outline" className="text-xs">{a.category}</Badge>
                <span><Eye className="h-3 w-3 inline" /> {a.views}</span>
                <span>{new Date(a.publishedAt).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-AE")}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant={a.status === "published" ? "default" : "secondary"} className="text-xs">
                {a.status}
              </Badge>
              <Button size="icon" variant="ghost" onClick={() => openEdit(a)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => remove(a.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? t("admin.news.editArticle") : t("admin.news.addNew")}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>{t("admin.news.titleEn")} *</Label>
                <Input value={editing.titleEn} onChange={e => setEditing({ ...editing, titleEn: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>{t("admin.news.titleAr")} *</Label>
                <Input value={editing.titleAr} onChange={e => setEditing({ ...editing, titleAr: e.target.value })} className="mt-1" dir="rtl" />
              </div>
              <div>
                <Label>{t("admin.news.excerptEn")}</Label>
                <Textarea value={editing.excerptEn} onChange={e => setEditing({ ...editing, excerptEn: e.target.value })} rows={2} className="mt-1" />
              </div>
              <div>
                <Label>{t("admin.news.excerptAr")}</Label>
                <Textarea value={editing.excerptAr} onChange={e => setEditing({ ...editing, excerptAr: e.target.value })} rows={2} className="mt-1" dir="rtl" />
              </div>
              <div className="md:col-span-2">
                <Label>{t("admin.news.contentEn")}</Label>
                <Textarea value={editing.contentEn} onChange={e => setEditing({ ...editing, contentEn: e.target.value })} rows={8} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>{t("admin.news.contentAr")}</Label>
                <Textarea value={editing.contentAr} onChange={e => setEditing({ ...editing, contentAr: e.target.value })} rows={8} className="mt-1" dir="rtl" />
              </div>
              <div>
                <Label>{t("admin.news.category")}</Label>
                <Select value={editing.category} onValueChange={v => setEditing({ ...editing, category: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {NEWS_CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{locale === "ar" ? c.labelAr : c.labelEn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("admin.news.status")}</Label>
                <Select value={editing.status} onValueChange={v => setEditing({ ...editing, status: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>{t("admin.news.coverImage")}</Label>
                <SinglePhotoUploader
                  value={editing.coverImage || ""}
                  onChange={(v) => setEditing({ ...editing, coverImage: v })}
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 dark:bg-[#c9a84c] dark:hover:bg-[#c9a84c]/90 dark:text-[#0a0f1e]">
              {t("admin.news.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
