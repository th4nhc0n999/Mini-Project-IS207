import { Link } from "react-router-dom"
import { UserPlus } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 w-full text-center">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Đăng Ký Tài Khoản</h1>
        <p className="text-sm text-slate-500">Đang chuẩn bị giao diện đăng ký...</p>
        <div className="pt-2 text-sm">
          <Link to="/login" className="text-sky-600 hover:underline">Đã có tài khoản? Đăng nhập</Link>
        </div>
      </div>
    </div>
  )
}
