import { useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { 
  Stethoscope, 
  Calendar, 
  User, 
  LogIn, 
  Menu, 
  X, 
  PhoneCall, 
  ShieldCheck, 
  Search,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: "Trang chủ", path: "/" },
    { name: "Bác sĩ & Phòng khám", path: "/doctors" },
    { name: "Lịch hẹn của tôi", path: "/my-bookings" },
  ]

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all shadow-sm">
      {/* Top Banner: Hotline & Working hours */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sky-400 font-medium">
              <PhoneCall className="w-3.5 h-3.5" />
              Tổng đài đặt khám: <strong className="text-white font-semibold">1900-2805</strong>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              Hỗ trợ 24/7 từ Thứ 2 — Chủ nhật
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1 text-emerald-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Bảo mật y tế & Đạt chuẩn BYT
            </span>
            <Link 
              to="/admin/bookings" 
              className="text-slate-400 hover:text-white transition-colors underline decoration-slate-600 underline-offset-2"
            >
              Cổng Quản Trị
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                Med<span className="text-sky-600">Si</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                Y tế thông minh
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? "text-sky-600 bg-sky-50 font-semibold"
                    : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="text-slate-700 hover:text-sky-600 hover:bg-sky-50">
              <Link to="/login" className="flex items-center gap-1.5">
                <LogIn className="w-4 h-4 text-slate-500" />
                <span>Đăng nhập</span>
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-sky-600 hover:bg-sky-700 text-white shadow-sm hover:shadow transition-all">
              <Link to="/register" className="flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4" />
                <span>Đăng ký</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-sky-600 bg-sky-50 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Button asChild variant="outline" className="w-full justify-center">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <LogIn className="w-4 h-4 mr-2" />
                Đăng nhập
              </Link>
            </Button>
            <Button asChild className="w-full justify-center bg-sky-600 hover:bg-sky-700 text-white">
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <User className="w-4 h-4 mr-2" />
                Đăng ký tài khoản
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
