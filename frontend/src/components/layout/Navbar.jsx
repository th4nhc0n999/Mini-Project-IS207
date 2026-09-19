import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { 
  Stethoscope, 
  Calendar, 
  User, 
  LogIn, 
  Menu, 
  X, 
  PhoneCall, 
  ShieldCheck, 
  Clock,
  Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Determine active doctor/clinic toggle
  const currentType = searchParams.get("type") || "doctor"
  const isDoctorOrClinicRoute = location.pathname.startsWith("/doctors")
  
  // Local state for instant visual feedback on click before route transition
  const [activeToggle, setActiveToggle] = useState(
    isDoctorOrClinicRoute && currentType === "hospital" ? "clinic" : "doctor"
  )

  useEffect(() => {
    if (isDoctorOrClinicRoute) {
      setActiveToggle(currentType === "hospital" ? "clinic" : "doctor")
    }
  }, [location.pathname, currentType, isDoctorOrClinicRoute])

  const handleToggle = (type) => {
    setActiveToggle(type)
    if (type === "clinic") {
      navigate("/doctors?type=hospital")
    } else {
      navigate("/doctors?type=doctor")
    }
  }

  const isHomeActive = location.pathname === "/"
  const isMyBookingsActive = location.pathname.startsWith("/my-bookings")

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
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* 1. Trang chủ */}
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isHomeActive
                  ? "text-sky-600 bg-sky-50 font-semibold"
                  : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
              }`}
            >
              Trang chủ
            </Link>

            {/* 2. Toggle Switch: Bác sĩ <-> Phòng khám */}
            <div className="relative flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner h-10 w-[240px]">
              {/* Smooth Animated Sliding Pill Background */}
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm border border-slate-200/60 transition-transform duration-300 ease-out pointer-events-none ${
                  activeToggle === "clinic" ? "translate-x-[114px]" : "translate-x-0"
                }`}
                style={{ left: "4px" }}
              />

              {/* Toggle Option 1: Bác sĩ */}
              <button
                type="button"
                onClick={() => handleToggle("doctor")}
                className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 h-full text-xs font-semibold rounded-lg transition-colors duration-200 cursor-pointer ${
                  activeToggle === "doctor" && isDoctorOrClinicRoute
                    ? "text-sky-600"
                    : activeToggle === "doctor"
                    ? "text-slate-800"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Stethoscope className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeToggle === "doctor" ? "scale-110 text-sky-600" : "text-slate-400"
                }`} />
                <span>Bác sĩ</span>
              </button>

              {/* Toggle Option 2: Phòng khám */}
              <button
                type="button"
                onClick={() => handleToggle("clinic")}
                className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 h-full text-xs font-semibold rounded-lg transition-colors duration-200 cursor-pointer ${
                  activeToggle === "clinic" && isDoctorOrClinicRoute
                    ? "text-sky-600"
                    : activeToggle === "clinic"
                    ? "text-slate-800"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Building2 className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeToggle === "clinic" ? "scale-110 text-sky-600" : "text-slate-400"
                }`} />
                <span>Phòng khám</span>
              </button>
            </div>

            {/* 3. Lịch hẹn của tôi */}
            <Link
              to="/my-bookings"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isMyBookingsActive
                  ? "text-sky-600 bg-sky-50 font-semibold"
                  : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
              }`}
            >
              Lịch hẹn của tôi
            </Link>
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
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                isHomeActive ? "text-sky-600 bg-sky-50 font-semibold" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Trang chủ
            </Link>

            {/* Mobile Segmented Toggle */}
            <div className="py-2 px-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tìm kiếm theo</p>
              <div className="relative flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-inner h-11 w-full">
                <div 
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm border border-slate-200/70 transition-transform duration-300 ease-out pointer-events-none ${
                    activeToggle === "clinic" ? "translate-x-[calc(100%+0px)]" : "translate-x-0"
                  }`}
                  style={{ left: "4px" }}
                />
                <button
                  type="button"
                  onClick={() => {
                    handleToggle("doctor")
                    setMobileMenuOpen(false)
                  }}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 h-full text-sm font-semibold rounded-lg transition-colors duration-200 ${
                    activeToggle === "doctor" ? "text-sky-600" : "text-slate-600"
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-sky-600" />
                  <span>Bác sĩ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleToggle("clinic")
                    setMobileMenuOpen(false)
                  }}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 h-full text-sm font-semibold rounded-lg transition-colors duration-200 ${
                    activeToggle === "clinic" ? "text-sky-600" : "text-slate-600"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <span>Phòng khám</span>
                </button>
              </div>
            </div>

            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                isMyBookingsActive ? "text-sky-600 bg-sky-50 font-semibold" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Lịch hẹn của tôi
            </Link>
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
