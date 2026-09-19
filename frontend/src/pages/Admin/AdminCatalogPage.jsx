import { Link } from "react-router-dom"
import { Database, Stethoscope, Clock, Layers, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminCatalogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="inline-block px-2.5 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            Phân hệ Quản Trị (Admin)
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Quản Lý Danh Mục & Khung Giờ (Catalog CRUD)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            CRUD Chuyên khoa (Specialties), Bác sĩ (Doctors) và khởi tạo Khung giờ khám (Slots)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link to="/admin/bookings">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Xem danh sách lịch hẹn
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">Chuyên Khoa</h3>
          <p className="text-sm text-slate-500">Quản lý thêm, sửa, xóa danh mục chuyên khoa và ảnh đại diện</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">Hồ Sơ Bác Sĩ</h3>
          <p className="text-sm text-slate-500">Cấu hình thông tin bác sĩ, học vị, chuyên khoa phụ trách</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">Khung Giờ Khám (Slots)</h3>
          <p className="text-sm text-slate-500">Tạo slot khám theo ca sáng/chiều, gán sức chứa (capacity)</p>
        </div>
      </div>
    </div>
  )
}
