import { Link } from "react-router-dom"
import { ClipboardList, LayoutDashboard, Database, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminBookingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="inline-block px-2.5 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            Phân hệ Quản Trị (Admin)
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Quản Lý Danh Sách Lịch Hẹn Khám
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Duyệt (confirmed), từ chối (rejected), hoặc theo dõi trạng thái hoàn thành ca khám của bệnh nhân
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link to="/admin/catalog">
              <Database className="w-4 h-4 mr-2" />
              Quản lý danh mục
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ClipboardList className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">
          Admin Bookings Dashboard (Placeholder)
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Trang quản trị cho phép xem toàn bộ danh sách phiếu khám của hệ thống, lọc theo trạng thái (pending/confirmed/cancelled) và thực hiện duyệt ca khám.
        </p>
      </div>
    </div>
  )
}
