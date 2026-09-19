import { Link } from "react-router-dom"
import { AlertTriangle, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mt-2">Không tìm thấy trang</h2>
        <p className="text-sm text-slate-500 mt-2">
          Đường dẫn bạn yêu cầu không tồn tại hoặc đã được di chuyển trong hệ thống MedSi.
        </p>
      </div>
      <div>
        <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white">
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Về trang chủ
          </Link>
        </Button>
      </div>
    </div>
  )
}
