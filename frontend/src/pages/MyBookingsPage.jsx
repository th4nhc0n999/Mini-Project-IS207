import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Search,
  Printer,
  RotateCcw
} from "lucide-react"
import { 
  getStoredBookings, 
  saveBookings, 
  getStoredSlots, 
  saveSlots, 
  formatCurrency, 
  formatDateVN 
} from "@/lib/mockData"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState(() => getStoredBookings())
  const [activeTab, setActiveTab] = useState("all") // all | pending | confirmed | completed | cancelled
  const [cancellingBooking, setCancellingBooking] = useState(null)
  const [cancelReason, setCancelReason] = useState("")

  // Filter by active tab
  const filteredBookings = useMemo(() => {
    if (activeTab === "all") return bookings
    return bookings.filter((b) => b.status === activeTab)
  }, [bookings, activeTab])

  // Status counts
  const counts = useMemo(() => {
    return {
      all: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    }
  }, [bookings])

  // Handle Cancel Booking
  const handleConfirmCancel = () => {
    if (!cancellingBooking) return

    const updated = bookings.map((b) => {
      if (b.id === cancellingBooking.id) {
        return {
          ...b,
          status: "cancelled",
          cancel_reason: cancelReason || "Bệnh nhân yêu cầu hủy",
          cancelled_at: new Date().toISOString(),
        }
      }
      return b
    })

    setBookings(updated)
    saveBookings(updated)

    // Free slot booked_count
    const allSlots = getStoredSlots()
    const updatedSlots = allSlots.map((s) => {
      if (s.id === cancellingBooking.slot_id && s.booked_count > 0) {
        return {
          ...s,
          booked_count: s.booked_count - 1,
          status: "available",
        }
      }
      return s
    })
    saveSlots(updatedSlots)

    setCancellingBooking(null)
    setCancelReason("")
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning" className="gap-1 font-semibold"><Clock className="w-3 h-3" /> Chờ Duyệt</Badge>
      case "confirmed":
        return <Badge variant="success" className="gap-1 font-semibold"><CheckCircle2 className="w-3 h-3" /> Đã Xác Nhận</Badge>
      case "completed":
        return <Badge variant="purple" className="gap-1 font-semibold"><CheckCircle2 className="w-3 h-3" /> Đã Hoàn Thành</Badge>
      case "cancelled":
        return <Badge variant="danger" className="gap-1 font-semibold"><XCircle className="w-3 h-3" /> Đã Hủy</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                Hồ Sơ Y Tế Cá Nhân
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Lịch Sử Đặt Khám Của Tôi
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Theo dõi trạng thái phiếu hẹn, mã khám và quản lý lịch tái khám một cách tiện lợi.
              </p>
            </div>

            <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white shadow-sm font-semibold">
              <Link to="/doctors" className="flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4" />
                <span>Đặt Lịch Khám Mới</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Tất cả ({counts.all})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "pending"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white text-amber-800 hover:bg-amber-50 border border-amber-200"
            }`}
          >
            Chờ duyệt ({counts.pending})
          </button>
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "confirmed"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200"
            }`}
          >
            Đã xác nhận ({counts.confirmed})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "completed"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-white text-purple-800 hover:bg-purple-50 border border-purple-200"
            }`}
          >
            Đã hoàn thành ({counts.completed})
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "cancelled"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white text-rose-800 hover:bg-rose-50 border border-rose-200"
            }`}
          >
            Đã hủy ({counts.cancelled})
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Chưa có lịch hẹn nào</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {activeTab === "all"
                  ? "Bạn chưa thực hiện đặt lịch khám nào trên hệ thống MedSi."
                  : `Không có phiếu khám nào ở trạng thái ${activeTab}.`}
              </p>
            </div>
            <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white font-semibold">
              <Link to="/doctors">
                <Search className="w-4 h-4 mr-1.5" />
                Khám phá Bác sĩ & Đặt lịch
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const canCancel = b.status === "pending" || b.status === "confirmed"

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm p-5 transition-all space-y-4"
                >
                  {/* Top Bar: Code, Status & Date */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        {b.code}
                      </span>
                      {getStatusBadge(b.status)}
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ngày tạo: {formatDateVN(b.created_at?.split("T")[0])}</span>
                    </div>
                  </div>

                  {/* Main Grid Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Col 1: Doctor / Hospital */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Bác sĩ / Cơ sở khám
                      </span>
                      <p className="font-bold text-slate-900 text-sm">
                        {b.doctor_name || b.hospital_name}
                      </p>
                      <p className="text-sky-700 font-medium">
                        Chuyên khoa: {b.specialty_name || b.exam_type_name}
                      </p>
                      <p className="text-slate-500 text-[11px] truncate">
                        {b.hospital_name}
                      </p>
                    </div>

                    {/* Col 2: Appointment Time & Patient */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Thời gian & Người đi khám
                      </span>
                      <div className="flex items-center gap-1.5 text-sky-700 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{b.start_time} - {b.end_time}, ngày {formatDateVN(b.work_date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold">{b.patient_name}</span>
                        <span className="text-slate-400">({b.relationship})</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">SĐT: {b.patient_phone}</p>
                    </div>

                    {/* Col 3: Fee & Payment */}
                    <div className="space-y-1.5 md:text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Tổng tiền & Thanh toán
                      </span>
                      <p className="text-base font-black text-sky-600">
                        {formatCurrency(b.payment?.total_amount || 420000)}
                      </p>
                      <div className="flex items-center md:justify-end gap-1.5">
                        <span className="text-[11px] text-slate-500">
                          {b.payment?.method === "cash" ? "Tại CSYT" : b.payment?.method?.toUpperCase()}:
                        </span>
                        <Badge
                          variant={b.payment?.status === "paid" ? "success" : "warning"}
                          className="text-[10px] py-0"
                        >
                          {b.payment?.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Symptoms & Notes preview */}
                  {b.symptoms && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
                      <span className="font-bold text-slate-800">Triệu chứng: </span>
                      {b.symptoms}
                      {b.note && <span className="text-slate-500 ml-2">({b.note})</span>}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                    <div className="text-[11px] text-slate-400">
                      {b.status === "confirmed" && "✅ Vui lòng có mặt trước 15 phút tại quầy tiếp đón"}
                      {b.status === "pending" && "⏳ Đang chờ nhân viên y tế kiểm tra và xác nhận"}
                      {b.status === "completed" && "🎉 Ca khám đã hoàn tất thành công"}
                      {b.status === "cancelled" && "❌ Phiếu khám đã được hủy"}
                    </div>

                    <div className="flex items-center gap-2">
                      {canCancel && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCancellingBooking(b)}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 text-xs h-8"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Hủy lịch hẹn
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.print()}
                        className="text-slate-600 hover:text-slate-900 text-xs h-8"
                      >
                        <Printer className="w-3.5 h-3.5 mr-1" />
                        In phiếu
                      </Button>

                      {b.status === "completed" && (
                        <Button asChild size="sm" className="bg-sky-600 text-white text-xs h-8">
                          <Link to={`/doctors/${b.doctor_id || 1}`}>
                            <RotateCcw className="w-3.5 h-3.5 mr-1" />
                            Đặt tái khám
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* CANCEL BOOKING MODAL */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Xác Nhận Hủy Lịch Hẹn</h3>
                <p className="text-xs text-slate-500">Mã phiếu: {cancellingBooking.code}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Bạn có chắc chắn muốn hủy lịch khám với <strong>{cancellingBooking.doctor_name}</strong> vào ngày <strong>{formatDateVN(cancellingBooking.work_date)}</strong>? Khung giờ này sẽ được giải phóng cho bệnh nhân khác.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Lý do hủy lịch:</label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ví dụ: Có lịch bận đột xuất, đã hết triệu chứng..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancellingBooking(null)}
              >
                Không hủy
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmCancel}
              >
                Xác nhận hủy lịch
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
