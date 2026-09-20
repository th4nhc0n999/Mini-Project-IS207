import { Link } from "react-router-dom"
import { Calendar, Clock, AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MyBookingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Lịch Sử Đặt Khám Của Tôi
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Theo dõi trạng thái phiếu hẹn khám, mã đặt lịch và hủy lịch khi đang ở trạng thái chờ duyệt
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
          <Calendar className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">
          Danh Sách Lịch Hẹn (Placeholder)
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Tại đây người dùng có thể xem lại các lịch hẹn đã đặt, mã phiếu khám (code), bác sĩ khám, ngày giờ và tình trạng duyệt phiếu.
        </p>
        <div className="pt-2">
          <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white">
            <Link to="/doctors">
              Đặt thêm lịch khám mới
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
