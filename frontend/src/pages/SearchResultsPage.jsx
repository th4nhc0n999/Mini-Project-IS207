import { Link } from "react-router-dom"
import { Search, Filter, Stethoscope, ChevronRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchResultsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Danh Sách Bác Sĩ & Bệnh Viện
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tìm kiếm và chọn lọc theo chuyên khoa, khu vực hoặc tên bác sĩ
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
          <Stethoscope className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">
          Màn hình Danh sách Bác sĩ / Bệnh viện (Placeholder)
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Trang này sẽ hiển thị kết quả tìm kiếm, bộ lọc chuyên khoa, phân trang và danh sách hồ sơ bác sĩ theo kế hoạch Sprint tiếp theo.
        </p>
        <div className="pt-2">
          <Button asChild variant="outline">
            <Link to="/doctors/1" className="flex items-center gap-1.5">
              <span>Xem trang mẫu: Chi tiết Bác sĩ #1</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
