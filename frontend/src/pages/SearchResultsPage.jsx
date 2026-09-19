import { Link, useSearchParams } from "react-router-dom"
import { Search, Filter, Stethoscope, Building2, ChevronRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const isClinic = searchParams.get("type") === "hospital"

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {isClinic ? "Danh Sách Phòng Khám & Cơ Sở Y Tế" : "Danh Sách Bác Sĩ Chuyên Khoa"}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isClinic 
            ? "Tìm kiếm bệnh viện, phòng khám đa khoa uy tín và các gói khám sức khỏe" 
            : "Tìm kiếm và chọn lọc theo chuyên khoa, kinh nghiệm hoặc tên bác sĩ"}
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto transition-transform duration-300">
          {isClinic ? <Building2 className="w-7 h-7" /> : <Stethoscope className="w-7 h-7" />}
        </div>
        <h2 className="text-lg font-bold text-slate-800">
          {isClinic ? "Đang chọn xem: Phòng Khám & Bệnh Viện" : "Đang chọn xem: Bác Sĩ Chuyên Khoa"}
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Trang hiển thị danh sách {isClinic ? "phòng khám & cơ sở y tế" : "bác sĩ"} kèm bộ lọc chuyên khoa, lịch khám và thông tin chi tiết.
        </p>
        <div className="pt-2">
          <Button asChild variant="outline">
            <Link to="/doctors/1" className="flex items-center gap-1.5">
              <span>Xem trang mẫu: Chi tiết {isClinic ? "Cơ sở y tế #1" : "Bác sĩ #1"}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
