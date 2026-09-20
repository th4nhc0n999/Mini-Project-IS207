import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  LogIn, 
  ShieldCheck, 
  Stethoscope, 
  ArrowRight,
  UserCheck
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    identifier: "nguyenvana@gmail.com",
    password: "password123",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleQuickLogin = (role) => {
    if (role === "admin") {
      login("admin@medsi.vn", "admin123", "admin")
      navigate("/admin/bookings")
    } else {
      login("nguyenvana@gmail.com", "password123", "patient")
      navigate("/")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      const res = login(formData.identifier, formData.password)
      setIsSubmitting(false)
      if (res.user.role === "admin") {
        navigate("/admin/bookings")
      } else {
        navigate("/")
      }
    }, 500)
  }

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50/60 via-slate-50 to-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand identity header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white shadow-lg shadow-sky-500/25 mb-1">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Đăng nhập Med<span className="text-sky-600">Si</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Hệ thống đặt lịch khám bệnh trực tuyến và quản lý hồ sơ y tế thông minh
          </p>
        </div>

        {/* Quick 1-Click Login Box for Testing */}
        <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-sm space-y-2.5">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-sky-600" />
            <span>Đăng nhập nhanh (Test & Demo):</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("patient")}
              className="border-sky-200 hover:bg-sky-50 text-sky-800 text-xs font-semibold h-9"
            >
              🩺 Bệnh nhân demo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("admin")}
              className="border-amber-200 hover:bg-amber-50 text-amber-800 text-xs font-semibold h-9"
            >
              🛡️ Admin demo
            </Button>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-medical border-slate-200/90 bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold text-slate-800">
              Tài khoản cá nhân
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Nhập email/SĐT và mật khẩu để tiếp tục
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field 1: Identifier (Email/Phone) */}
              <div className="space-y-1.5">
                <Label htmlFor="identifier" className="text-xs font-semibold text-slate-700">
                  Email hoặc Số điện thoại <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="vd: nguyenvana@gmail.com hoặc admin@medsi.vn"
                    className="pl-10 h-11 text-sm bg-slate-50/50 border-slate-200 focus-visible:bg-white focus-visible:ring-sky-500"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                    Mật khẩu <span className="text-rose-500">*</span>
                  </Label>
                  <a
                    href="#forgot-password"
                    onClick={(e) => { e.preventDefault(); alert("Mật khẩu thử nghiệm: bất kỳ chuỗi ký tự nào.") }}
                    className="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu của bạn"
                    className="pl-10 pr-10 h-11 text-sm bg-slate-50/50 border-slate-200 focus-visible:bg-white focus-visible:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-xs text-slate-600 cursor-pointer select-none">
                  Ghi nhớ đăng nhập trên thiết bị này
                </label>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-md shadow-sky-600/20 text-sm mt-2 transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xác thực...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Đăng nhập
                  </span>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-0 border-t border-slate-100 mt-2">
            <div className="text-center text-xs text-slate-600 pt-3">
              Bạn chưa có tài khoản MedSi?{" "}
              <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-0.5">
                Đăng ký ngay
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Security & Confidentiality Trust Box */}
        <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/80 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Bảo mật thông tin bệnh án tuyệt đối
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            MedSi tuân thủ nghiêm ngặt quy chuẩn bảo mật y tế số và mã hóa thông tin sức khỏe cá nhân theo quy định của Bộ Y Tế.
          </p>
        </div>
      </div>
    </div>
  )
}
