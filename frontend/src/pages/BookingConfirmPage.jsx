import { Link } from "react-router-dom"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BookingConfirmPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-6">
        <Link to="/doctors" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Xác Nhận Đặt Khám (Placeholder)
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Màn hình này cho phép bệnh nhân chọn hồ sơ bệnh nhân, nhập triệu chứng bệnh lý và xác nhận tạo lịch hẹn với cơ chế chống đặt trùng.
        </p>
        <div className="pt-2">
          <Button asChild variant="outline">
            <Link to="/my-bookings">
              Xem danh sách lịch hẹn của tôi
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
