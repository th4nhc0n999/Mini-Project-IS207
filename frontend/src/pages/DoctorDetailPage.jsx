import { useParams, Link } from "react-router-dom"
import { Calendar, User, Clock, ArrowLeft, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DoctorDetailPage() {
  const { id } = useParams()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-6">
        <Link to="/doctors" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách bác sĩ
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Chi Tiết Bác Sĩ & Đặt Lịch Khám (ID: {id || "1"})
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Trang hiển thị thông tin học vị, tiểu sử, phòng khám, bảng chọn khung giờ khám còn trống (Slots) và nút tiến hành xác nhận đặt khám.
        </p>
        <div className="pt-2">
          <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white">
            <Link to="/booking/confirm">
              Tiến hành xác nhận đặt hẹn
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
