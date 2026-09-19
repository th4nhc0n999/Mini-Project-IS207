import { Link } from "react-router-dom"
import { Search, Calendar, UserCheck, Shield, ChevronRight, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50 py-16 lg:py-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold tracking-wide uppercase">
              <Stethoscope className="w-4 h-4 text-sky-600" />
              Nền tảng Y tế Số MedSi (YouMed Prototype)
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Đặt lịch khám bệnh <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-500">
                nhanh chóng & dễ dàng
              </span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Chủ động chọn bác sĩ chuyên khoa giỏi, bệnh viện uy tín và khung giờ khám mong muốn. Không còn cảnh xếp hàng bốc số chờ đợi mệt mỏi.
            </p>

            {/* Quick Actions */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-600/25 px-8 font-semibold">
                <Link to="/doctors">
                  <Search className="w-5 h-5 mr-2" />
                  Tìm bác sĩ & Đặt khám ngay
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                <Link to="/my-bookings">
                  <Calendar className="w-5 h-5 mr-2 text-sky-600" />
                  Tra cứu lịch hẹn
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-medical transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Bác sĩ chuyên khoa đầu ngành</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Thông tin chuyên môn, số năm kinh nghiệm, học hàm học vị minh bạch, rõ ràng.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-medical transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Chọn khung giờ theo ý muốn</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Xem trực tiếp các slot khám còn trống theo ngày, xác nhận tức thì không sợ trùng lịch.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-medical transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Bảo mật hồ sơ bệnh án</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Thông tin sức khỏe cá nhân và lịch sử khám bệnh được lưu trữ mã hóa tuyệt đối an toàn.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
