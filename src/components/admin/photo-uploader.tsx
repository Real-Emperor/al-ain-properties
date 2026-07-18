"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Link as LinkIcon, Image as ImageIcon, Loader2 } from "lucide-react"
import { useI18n } from "@/i18n/provider"
import { toast } from "sonner"

interface PhotoUploaderProps {
  value: string // newline-separated URLs or base64 strings
  onChange: (value: string) => void
  label?: string
}

/**
 * Photo uploader that supports BOTH:
 * 1. File upload from device (converted to compressed base64, stored in DB)
 * 2. URL paste (for external images)
 *
 * Client-side image compression:
 * - Max width: 1200px (preserves aspect ratio)
 * - Format: JPEG
 * - Quality: 85%
 * - Typical size: 100-300KB per photo
 */
export function PhotoUploader({ value, onChange, label }: PhotoUploaderProps) {
  const { t, locale } = useI18n()
  const [uploading, setUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Parse current value into array
  const photos = value
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean)

  const updateValue = (newPhotos: string[]) => {
    onChange(newPhotos.join("\n"))
  }

  // Compress image client-side using canvas
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("File is not an image"))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Calculate new dimensions (max 1200px width, preserve aspect ratio)
          const MAX_WIDTH = 1200
          const MAX_HEIGHT = 900
          let width = img.width
          let height = img.height

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width)
            width = MAX_WIDTH
          }
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height)
            height = MAX_HEIGHT
          }

          // Create canvas and draw resized image
          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          if (!ctx) {
            reject(new Error("Canvas not supported"))
            return
          }

          // White background for PNGs with transparency
          ctx.fillStyle = "#FFFFFF"
          ctx.fillRect(0, 0, width, height)

          ctx.drawImage(img, 0, 0, width, height)

          // Convert to JPEG base64 at 85% quality
          const base64 = canvas.toDataURL("image/jpeg", 0.85)
          resolve(base64)
        }
        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newPhotos: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const compressed = await compressImage(file)
        newPhotos.push(compressed)
      } catch (error: any) {
        toast.error(`${file.name}: ${error.message}`)
      }
    }

    if (newPhotos.length > 0) {
      updateValue([...photos, ...newPhotos])
      toast.success(locale === "ar"
        ? `تم رفع ${newPhotos.length} صورة بنجاح`
        : `Uploaded ${newPhotos.length} photo(s) successfully`
      )
    }

    setUploading(false)
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const addUrl = () => {
    if (!urlValue.trim()) return
    if (!urlValue.startsWith("http://") && !urlValue.startsWith("https://")) {
      toast.error(locale === "ar" ? "يرجى إدخال رابط صحيح يبدأ بـ http" : "Please enter a valid URL starting with http")
      return
    }
    updateValue([...photos, urlValue.trim()])
    setUrlValue("")
    setShowUrlInput(false)
    toast.success(locale === "ar" ? "تمت إضافة الرابط" : "URL added")
  }

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    updateValue(newPhotos)
  }

  const movePhoto = (index: number, direction: "left" | "right") => {
    const newIndex = direction === "left" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= photos.length) return
    const newPhotos = [...photos]
    ;[newPhotos[index], newPhotos[newIndex]] = [newPhotos[newIndex], newPhotos[index]]
    updateValue(newPhotos)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label || t("admin.property.photos")}</Label>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="h-8 text-xs border-[#1e3a8a] dark:border-[#c9a84c] text-[#1e3a8a] dark:text-[#c9a84c]"
          >
            {uploading ? (
              <><Loader2 className="h-3 w-3 me-1 animate-spin" /> {locale === "ar" ? "جاري الرفع..." : "Uploading..."}</>
            ) : (
              <><Upload className="h-3 w-3 me-1" /> {locale === "ar" ? "رفع من الجهاز" : "Upload from Device"}</>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="h-8 text-xs"
          >
            <LinkIcon className="h-3 w-3 me-1" />
            {locale === "ar" ? "رابط" : "URL"}
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* URL input (toggle) */}
      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={urlValue}
            onChange={e => setUrlValue(e.target.value)}
            className="text-xs"
            dir="ltr"
          />
          <Button type="button" size="sm" onClick={addUrl} className="h-9">
            {locale === "ar" ? "إضافة" : "Add"}
          </Button>
        </div>
      )}

      {/* Photo preview grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {photos.map((photo, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted">
              <img
                src={photo}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7 rounded-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => removePhoto(i)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-6 w-6 rounded-full bg-white/90 hover:bg-white"
                    onClick={() => movePhoto(i, "left")}
                    disabled={i === 0}
                  >
                    ←
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-6 w-6 rounded-full bg-white/90 hover:bg-white"
                    onClick={() => movePhoto(i, "right")}
                    disabled={i === photos.length - 1}
                  >
                    →
                  </Button>
                </div>
              </div>
              {/* Cover badge */}
              {i === 0 && (
                <div className="absolute top-1 start-1 bg-[#c9a84c] text-[#1a1a1a] text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {locale === "ar" ? "غلاف" : "COVER"}
                </div>
              )}
              {/* Index number */}
              <div className="absolute bottom-1 end-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-[#c9a84c] transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground">
            {locale === "ar"
              ? "اضغط لرفع الصور من جهازك أو اسحب الملفات هنا"
              : "Click to upload photos from your device or drag files here"}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {locale === "ar" ? "JPG, PNG, WebP — حد أقصى 10 ميجابايت لكل صورة" : "JPG, PNG, WebP — max 10MB each"}
          </p>
        </div>
      )}

      {/* Help text */}
      <p className="text-[10px] text-muted-foreground">
        {locale === "ar"
          ? "💡 الصورة الأولى ستكون الصورة الرئيسية للعقار. يمكنك إعادة الترتيب بالأسهم."
          : "💡 The first photo will be the property's cover image. Reorder using the arrows."}
      </p>
    </div>
  )
}

// ─── Single Photo Uploader (for cover images, single-image fields) ───

export function SinglePhotoUploader({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { locale } = useI18n()
  const [uploading, setUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("File is not an image"))
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const MAX_WIDTH = 1600
          const MAX_HEIGHT = 900
          let width = img.width
          let height = img.height
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width)
            width = MAX_WIDTH
          }
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height)
            height = MAX_HEIGHT
          }
          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          if (!ctx) { reject(new Error("Canvas not supported")); return }
          ctx.fillStyle = "#FFFFFF"
          ctx.fillRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL("image/jpeg", 0.85))
        }
        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const compressed = await compressImage(file)
      onChange(compressed)
      toast.success(locale === "ar" ? "تم رفع الصورة" : "Photo uploaded")
    } catch (error: any) {
      toast.error(error.message)
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const addUrl = () => {
    if (!urlValue.trim()) return
    if (!urlValue.startsWith("http://") && !urlValue.startsWith("https://")) {
      toast.error(locale === "ar" ? "يرجى إدخال رابط صحيح" : "Please enter a valid URL")
      return
    }
    onChange(urlValue.trim())
    setUrlValue("")
    setShowUrlInput(false)
  }

  return (
    <div className="space-y-2 mt-1">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-border bg-muted">
          <img src={value} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload className="h-3 w-3 me-1" /> {locale === "ar" ? "تغيير" : "Change"}
            </Button>
            <Button type="button" size="sm" variant="secondary" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => onChange("")}>
              <X className="h-3 w-3 me-1" /> {locale === "ar" ? "حذف" : "Remove"}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-[#c9a84c] transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" />
          ) : (
            <ImageIcon className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {locale === "ar" ? "اضغط لرفع صورة الغلاف" : "Click to upload cover image"}
          </p>
        </div>
      )}

      <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowUrlInput(!showUrlInput)}>
        <LinkIcon className="h-3 w-3 me-1" />
        {locale === "ar" ? "أو ألصق رابط" : "Or paste URL"}
      </Button>

      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://..."
            value={urlValue}
            onChange={e => setUrlValue(e.target.value)}
            className="text-xs"
            dir="ltr"
          />
          <Button type="button" size="sm" onClick={addUrl} className="h-9">
            {locale === "ar" ? "إضافة" : "Add"}
          </Button>
        </div>
      )}
    </div>
  )
}
