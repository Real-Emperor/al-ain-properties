"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useI18n } from "@/i18n/provider"
import { SITE_CONFIG } from "@/lib/site-config"
import { Building2, LogOut, LayoutDashboard, Building, MessageSquare, Calendar, Newspaper, Lock } from "lucide-react"
import { AdminOverview } from "@/components/admin/overview"
import { AdminProperties } from "@/components/admin/properties"
import { AdminInquiries } from "@/components/admin/inquiries"
import { AdminViewings } from "@/components/admin/viewings"
import { AdminNews } from "@/components/admin/news"
import { toast } from "sonner"

type AdminView = "overview" | "properties" | "inquiries" | "viewings" | "news"

export default function AdminPage() {
  const { t, locale } = useI18n()
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<AdminView>("overview")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
    if (token) setAuthed(true)
    setLoading(false)
  }, [])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.token) {
        localStorage.setItem("admin_token", data.token)
        localStorage.setItem("admin_user", JSON.stringify(data.user))
        setAuthed(true)
        toast.success(locale === "ar" ? "تم تسجيل الدخول" : "Login successful")
      } else {
        toast.error(data.error || t("admin.login.invalidCredentials"))
      }
    } catch {
      toast.error(locale === "ar" ? "فشل تسجيل الدخول" : "Login failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_user")
    setAuthed(false)
    setEmail("")
    setPassword("")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#1e3a8a] text-white mb-3">
              <Building2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold">{t("admin.login.title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("admin.login.subtitle")}</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <Label htmlFor="email">{t("admin.login.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="mt-1"
                dir="ltr"
              />
            </div>
            <div>
              <Label htmlFor="password">{t("admin.login.password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="mt-1"
                dir="ltr"
              />
            </div>
            <Button type="submit" className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 dark:bg-[#c9a84c] dark:hover:bg-[#c9a84c]/90 dark:text-[#0a0f1e]">
              <Lock className="h-4 w-4 me-2" />
              {t("admin.login.signIn")}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-muted-foreground hover:text-[#c9a84c]">
              ← {locale === "ar" ? "العودة للموقع" : "Back to website"}
            </a>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            <p className="font-semibold mb-1">{locale === "ar" ? "بيانات الدخول:" : "Admin credentials:"}</p>
            <p dir="ltr">Email: manager.mosa@alainproperties.ae</p>
            <p dir="ltr">Password: AlAin@Prop_2026!Secure</p>
            <p className="mt-1 italic">
              {locale === "ar"
                ? "(تم تدوير بيانات الدخول — تواصل معنا إذا نسيتها)"
                : "(Credentials have been rotated — contact us if forgotten)"}
            </p>
          </div>
        </Card>
      </div>
    )
  }

  const navItems: { value: AdminView; icon: any; label: string }[] = [
    { value: "overview", icon: LayoutDashboard, label: t("admin.dashboard.overview") },
    { value: "properties", icon: Building, label: t("admin.dashboard.properties") },
    { value: "inquiries", icon: MessageSquare, label: t("admin.dashboard.inquiries") },
    { value: "viewings", icon: Calendar, label: t("admin.dashboard.viewings") },
    { value: "news", icon: Newspaper, label: t("admin.dashboard.news") },
  ]

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-muted/20">
      {/* Sidebar */}
      <aside className="lg:w-64 bg-[#0a0f1e] text-white lg:min-h-screen p-4 lg:p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#1e3a8a]">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold">
              {locale === "ar" ? SITE_CONFIG.brandName.ar : SITE_CONFIG.brandName.en}
            </div>
            <div className="text-xs text-white/60">{t("admin.dashboard.title")}</div>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.value}
              onClick={() => setView(item.value)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                view === item.value
                  ? "bg-[#c9a84c] text-[#0a0f1e] font-semibold"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 space-y-2">
          <a href="/" target="_blank" className="block text-xs text-white/60 hover:text-white px-3 py-2">
            {locale === "ar" ? "↗ فتح الموقع" : "↗ Open website"}
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {t("admin.login.logout")}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        {view === "overview" && <AdminOverview onNavigate={setView} />}
        {view === "properties" && <AdminProperties />}
        {view === "inquiries" && <AdminInquiries />}
        {view === "viewings" && <AdminViewings />}
        {view === "news" && <AdminNews />}
      </main>
    </div>
  )
}
