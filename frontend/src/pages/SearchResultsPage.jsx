import { useState, useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { 
  Search, 
  MapPin, 
  Stethoscope, 
  Building2, 
  Star, 
  ChevronRight, 
  Award, 
  Phone,
  CheckCircle2,
  Calendar
} from "lucide-react"
import { 
  getStoredDoctors, 
  getStoredSpecialties, 
  getStoredHospitals,
  formatCurrency 
} from "@/lib/mockData"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isClinic = searchParams.get("type") === "hospital"

  const doctors = useMemo(() => getStoredDoctors(), [])
  const specialties = useMemo(() => getStoredSpecialties(), [])
  const hospitals = useMemo(() => getStoredHospitals(), [])

  // Filters state
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get("specialty") || "all")
  const [selectedCity, setSelectedCity] = useState("all")

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchSearch = 
        !searchTerm || 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.address.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchSpecialty = 
        selectedSpecialty === "all" || 
        doc.specialty_name === selectedSpecialty ||
        doc.specialty_id === Number(selectedSpecialty)

      const matchCity = 
        selectedCity === "all" || 
        doc.city.toLowerCase().includes(selectedCity.toLowerCase())

      return matchSearch && matchSpecialty && matchCity
    })
  }, [doctors, searchTerm, selectedSpecialty, selectedCity])

  // Filter hospitals
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hosp) => {
      const matchSearch = 
        !searchTerm || 
        hosp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hosp.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hosp.exam_types.some(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchCity = 
        selectedCity === "all" || 
        hosp.city.toLowerCase().includes(selectedCity.toLowerCase())

      return matchSearch && matchCity
    })
  }, [hospitals, searchTerm, selectedCity])

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-sky-800 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-sky-100 text-xs font-semibold mb-2">
                {isClinic ? <Building2 className="w-3.5 h-3.5" /> : <Stethoscope className="w-3.5 h-3.5" />}
                {isClinic ? "Mạng lưới Bệnh viện & Phòng khám" : "Danh mục Bác sĩ chuyên khoa"}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {isClinic ? "Tra cứu Phòng Khám & Bệnh Viện Uy Tín" : "Tìm & Đặt Khám Bác Sĩ Chuyên Khoa"}
              </h1>
              <p className="text-sm text-sky-100 mt-1 max-w-2xl">
                {isClinic 
                  ? "Đặt lịch xét nghiệm, khám tổng quát và điều trị tại các bệnh viện tuyến đầu không cần chờ đợi."
                  : "Đội ngũ chuyên gia, bác sĩ đầu ngành sẵn sàng tư vấn và thăm khám tận tâm."}
              </p>
            </div>

            {/* View Switcher Pill */}
            <div className="flex items-center bg-black/20 backdrop-blur-md p-1 rounded-xl border border-white/20">
              <button
                type="button"
                onClick={() => setSearchParams({ type: "doctor" })}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  !isClinic ? "bg-white text-sky-700 shadow-sm" : "text-sky-100 hover:text-white"
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Bác Sĩ</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchParams({ type: "hospital" })}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  isClinic ? "bg-white text-sky-700 shadow-sm" : "text-sky-100 hover:text-white"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Phòng Khám / BV</span>
              </button>
            </div>
          </div>

          {/* Search bar & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isClinic ? "Tìm tên bệnh viện, gói khám, địa chỉ..." : "Tìm tên bác sĩ, chuyên khoa, triệu chứng..."}
                className="pl-10 h-12 bg-white text-slate-900 border-0 shadow-md text-sm rounded-xl focus-visible:ring-2 focus-visible:ring-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* City Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full h-12 bg-white text-slate-800 text-sm font-medium rounded-xl px-3 border-0 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
              >
                <option value="all">📍 Toàn quốc (Tất cả khu vực)</option>
                <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
            </div>

            {/* Specialty Filter for Doctors */}
            {!isClinic && (
              <div className="md:col-span-3">
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full h-12 bg-white text-slate-800 text-sm font-medium rounded-xl px-3 border-0 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
                >
                  <option value="all">🩺 Tất cả chuyên khoa</option>
                  {specialties.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.doctorCount} BS)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Specialty Quick Chips (When viewing Doctors) */}
        {!isClinic && (
          <div className="mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedSpecialty("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSpecialty === "all"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Tất cả ({doctors.length})
              </button>
              {specialties.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSpecialty(s.name)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedSpecialty === s.name
                      ? "bg-sky-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count & Active Filters */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-slate-600">
            Tìm thấy <strong className="text-slate-900 font-bold">{isClinic ? filteredHospitals.length : filteredDoctors.length}</strong> {isClinic ? "cơ sở y tế" : "bác sĩ"} phù hợp
          </p>
          {(searchTerm || selectedSpecialty !== "all" || selectedCity !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedSpecialty("all")
                setSelectedCity("all")
              }}
              className="text-xs text-sky-600 hover:text-sky-800 font-medium underline"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>

        {/* DOCTORS VIEW */}
        {!isClinic && (
          <div className="space-y-4">
            {filteredDoctors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Không tìm thấy bác sĩ phù hợp</h3>
                <p className="text-xs text-slate-500">
                  Vui lòng thử tìm kiếm bằng từ khóa khác hoặc xóa bớt tiêu chí lọc chuyên khoa/khu vực.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedSpecialty("all")
                    setSelectedCity("all")
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 hover:shadow-medical transition-all p-5 flex flex-col justify-between group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Badge variant="info" className="text-[11px] font-semibold">
                            {doc.specialty_name}
                          </Badge>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            {doc.experience_years} năm KN
                          </span>
                        </div>

                        <Link to={`/doctors/${doc.id}`} className="block">
                          <h3 className="font-bold text-slate-900 text-base hover:text-sky-600 transition-colors truncate">
                            {doc.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                          {doc.title}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mt-2 text-xs">
                          <div className="flex items-center text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                            {doc.rating}
                          </div>
                          <span className="text-slate-400">({doc.reviews_count} đánh giá)</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 font-medium">{doc.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Workplace & Fee */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-1.5 text-xs text-slate-500 max-w-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{doc.address}</span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block leading-tight">Giá khám</span>
                          <strong className="text-sm font-bold text-sky-600">
                            {formatCurrency(doc.fee)}
                          </strong>
                        </div>
                        <Button asChild size="sm" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold">
                          <Link to={`/doctors/${doc.id}`} className="flex items-center gap-1">
                            <span>Đặt khám</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HOSPITALS / CLINICS VIEW */}
        {isClinic && (
          <div className="space-y-4">
            {filteredHospitals.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Không tìm thấy cơ sở y tế phù hợp</h3>
                <p className="text-xs text-slate-500">
                  Vui lòng thử tìm kiếm bằng tên bệnh viện khác.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCity("all")
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {filteredHospitals.map((hosp) => (
                  <div
                    key={hosp.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-medical transition-all p-5 flex flex-col md:flex-row gap-5"
                  >
                    {/* Hospital Image */}
                    <div className="md:w-64 h-48 rounded-xl overflow-hidden shrink-0 relative">
                      <img
                        src={hosp.image}
                        alt={hosp.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-slate-900/80 text-white text-[10px] backdrop-blur-sm">
                          📍 {hosp.city}
                        </Badge>
                      </div>
                    </div>

                    {/* Hospital Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-bold text-slate-900 text-lg hover:text-sky-600 transition-colors">
                            {hosp.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{hosp.rating}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{hosp.address}</span>
                        </p>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                          {hosp.description}
                        </p>

                        {/* Exam Types / Services preview */}
                        <div>
                          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Dịch vụ & Gói khám tiêu biểu:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {hosp.exam_types.map((exam) => (
                              <div
                                key={exam.id}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                              >
                                <span className="font-medium text-slate-800">{exam.name}</span>
                                <span className="font-bold text-sky-600">{formatCurrency(exam.price)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-sky-600" />
                          <span>Hotline: <strong className="text-slate-900 font-bold">{hosp.hotline}</strong></span>
                        </div>

                        <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-sm">
                          <Link to={`/doctors/1?hospitalId=${hosp.id}`} className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>Xem Lịch Khám & Đặt Chỗ</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
