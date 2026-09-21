import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  ArrowLeft, 
  CheckCircle2, 
  User, 
  FileText, 
  CreditCard, 
  ShieldCheck, 
  Stethoscope, 
  Plus, 
  Check
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { 
  getStoredBookings, 
  saveBookings, 
  getStoredSlots, 
  saveSlots, 
  generateBookingCode, 
  formatCurrency, 
  formatDateVN 
} from "@/lib/mockData"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function BookingConfirmPage() {
  const { user, patientProfiles, addPatientProfile } = useAuth()

  // Load pending booking context from session lazily
  const [bookingContext] = useState(() => {
    const raw = sessionStorage.getItem("medsi_pending_booking")
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        // Fallback demo context
      }
    }
    return {
      booking_type: "doctor",
      doctor_id: 1,
      doctor_name: "BS. CKII Nguyễn Văn Hùng",
      doctor_title: "Bác sĩ Chuyên khoa II",
      specialty_name: "Tim Mạch",
      hospital_name: "Phòng khám MedSi Quận 1",
      slot_id: 2,
      work_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      start_time: "09:00",
      end_time: "10:00",
      exam_fee: 400000,
      service_fee: 20000,
    }
  })

  // Form states
  const [selectedProfileId, setSelectedProfileId] = useState(patientProfiles[0]?.id || 1)
  const [symptoms, setSymptoms] = useState("")
  const [note, setNote] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash") // cash | vnpay | momo
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdBooking, setCreatedBooking] = useState(null)

  // New Profile modal form state
  const [showNewProfileModal, setShowNewProfileModal] = useState(false)
  const [newProfileData, setNewProfileData] = useState({
    full_name: "",
    dob: "",
    gender: "male",
    phone: "",
    relationship: "Con",
  })

  const selectedProfile = patientProfiles.find(p => p.id === Number(selectedProfileId)) || patientProfiles[0]

  const totalAmount = (bookingContext?.exam_fee || 400000) + (bookingContext?.service_fee || 20000)

  // Handle Add Profile
  const handleCreateProfile = (e) => {
    e.preventDefault()
    if (!newProfileData.full_name) return
    const created = addPatientProfile(newProfileData)
    setSelectedProfileId(created.id)
    setShowNewProfileModal(false)
    setNewProfileData({ full_name: "", dob: "", gender: "male", phone: "", relationship: "Con" })
  }

  // Handle Submit Booking
  const handleConfirmBooking = (e) => {
    e.preventDefault()
    if (!symptoms.trim()) {
      alert("Vui lòng nhập mô tả triệu chứng hoặc lý do khám.")
      return
    }

    // Validate if slot is in the past (Fix BUG-BOOKING-01)
    if (bookingContext?.work_date && bookingContext?.start_time) {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const day = String(now.getDate()).padStart(2, "0")
      const todayStr = `${year}-${month}-${day}`
      const todayIso = now.toISOString().split("T")[0]

      const isPast =
        (bookingContext.work_date < todayStr && bookingContext.work_date < todayIso) ||
        ((bookingContext.work_date === todayStr || bookingContext.work_date === todayIso) &&
          bookingContext.start_time <= `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`)

      if (isPast) {
        alert("Khung giờ khám đã qua hạn đặt. Vui lòng quay lại để chọn khung giờ khác.")
        return
      }
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const code = generateBookingCode()
      const newBooking = {
        id: Date.now(),
        code: code,
        user_id: user?.id || 1,
        patient_profile_id: selectedProfile?.id || 1,
        patient_name: selectedProfile?.full_name || (user?.name || "Nguyễn Văn A"),
        patient_phone: selectedProfile?.phone || (user?.phone || "0901234567"),
        patient_gender: selectedProfile?.gender || "male",
        patient_dob: selectedProfile?.dob || "1992-06-15",
        relationship: selectedProfile?.relationship || "Bản thân",
        booking_type: bookingContext?.booking_type || "doctor",
        doctor_id: bookingContext?.doctor_id || 1,
        doctor_name: bookingContext?.doctor_name || "BS. CKII Nguyễn Văn Hùng",
        specialty_name: bookingContext?.specialty_name || "Tim Mạch",
        hospital_name: bookingContext?.hospital_name || "Phòng khám MedSi Quận 1",
        work_date: bookingContext?.work_date,
        start_time: bookingContext?.start_time,
        end_time: bookingContext?.end_time,
        slot_id: bookingContext?.slot_id,
        symptoms: symptoms,
        note: note,
        status: "pending",
        created_at: new Date().toISOString(),
        payment: {
          method: paymentMethod,
          exam_fee: bookingContext?.exam_fee || 400000,
          service_fee: bookingContext?.service_fee || 20000,
          total_amount: totalAmount,
          status: paymentMethod === "cash" ? "pending" : "paid",
          transaction_code: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
          paid_at: paymentMethod !== "cash" ? new Date().toISOString() : null,
        },
      }

      // 1. Save booking to store
      const currentBookings = getStoredBookings()
      saveBookings([newBooking, ...currentBookings])

      // 2. Increment booked_count of slot
      const allSlots = getStoredSlots()
      const updatedSlots = allSlots.map(s => {
        if (s.id === bookingContext?.slot_id) {
          const newCount = s.booked_count + 1
          return {
            ...s,
            booked_count: newCount,
            status: newCount >= s.capacity ? "full" : "available",
          }
        }
        return s
      })
      saveSlots(updatedSlots)

      sessionStorage.removeItem("medsi_pending_booking")
      setIsSubmitting(false)
      setCreatedBooking(newBooking)
    }, 700)
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Back Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            to={bookingContext?.doctor_id ? `/doctors/${bookingContext.doctor_id}` : "/doctors"}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Quay lại chọn khung giờ
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Bước 2: Xác nhận thông tin
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Xác Nhận Đặt Lịch Khám Bệnh
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Vui lòng kiểm tra kỹ thông tin người khám và thời gian trước khi xác nhận.
          </p>
        </div>

        <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Patient info & Symptoms */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Chọn Hồ sơ người khám */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-sky-600" />
                  <span>1. Thông tin người khám bệnh</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setShowNewProfileModal(true)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm hồ sơ mới</span>
                </button>
              </div>

              {/* Profiles list */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 block">
                  Chọn hồ sơ đã lưu:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {patientProfiles.map((p) => {
                    const isSelected = Number(selectedProfileId) === p.id
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProfileId(p.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs ${
                          isSelected
                            ? "bg-sky-50 border-sky-600 ring-2 ring-sky-500/20"
                            : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                          <span>{p.full_name}</span>
                          <Badge variant="secondary" className="text-[10px] py-0">
                            {p.relationship}
                          </Badge>
                        </div>
                        <div className="text-slate-500 space-y-0.5 text-[11px]">
                          <p>SĐT: {p.phone}</p>
                          <p>Ngày sinh: {formatDateVN(p.dob)} ({p.gender === "male" ? "Nam" : "Nữ"})</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 2. Lý do khám & Triệu chứng */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>2. Lý do khám & Triệu chứng bệnh lý</span>
              </h2>

              <div className="space-y-1.5">
                <Label htmlFor="symptoms" className="text-xs font-semibold text-slate-700">
                  Mô tả triệu chứng / Vấn đề sức khỏe cần khám <span className="text-rose-500">*</span>
                </Label>
                <textarea
                  id="symptoms"
                  required
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Ví dụ: Đau đầu kéo dài 3 ngày, sốt nhẹ vào buổi chiều, chóng mặt khi đứng lên..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="note" className="text-xs font-semibold text-slate-700">
                  Ghi chú thêm cho bác sĩ (nếu có)
                </Label>
                <Input
                  id="note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Có tiền sử dị ứng thuốc kháng sinh Penicillin, mang thai tuần thứ 12..."
                  className="h-10 text-xs bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-sky-500"
                />
              </div>
            </div>

            {/* 3. Phương thức thanh toán */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <CreditCard className="w-4 h-4 text-sky-600" />
                <span>3. Chọn hình thức thanh toán</span>
              </h2>

              <div className="space-y-2.5">
                {/* Cash */}
                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "cash" ? "bg-sky-50 border-sky-600 ring-2 ring-sky-500/20" : "border-slate-200 hover:bg-slate-50"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Thanh toán tại cơ sở y tế</p>
                      <p className="text-[11px] text-slate-500">Thanh toán tiền mặt hoặc quẹt thẻ khi đến khám</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">Tiền mặt / Thẻ</Badge>
                </label>

                {/* VNPAY */}
                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "vnpay" ? "bg-sky-50 border-sky-600 ring-2 ring-sky-500/20" : "border-slate-200 hover:bg-slate-50"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vnpay"
                      checked={paymentMethod === "vnpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Thanh toán qua VNPAY-QR</p>
                      <p className="text-[11px] text-slate-500">Quét mã QR qua ứng dụng ngân hàng hoặc ví VNPAY</p>
                    </div>
                  </div>
                  <Badge variant="info" className="text-[10px]">VNPAY-QR</Badge>
                </label>

                {/* Momo */}
                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "momo" ? "bg-sky-50 border-sky-600 ring-2 ring-sky-500/20" : "border-slate-200 hover:bg-slate-50"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="momo"
                      checked={paymentMethod === "momo"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Ví điện tử MoMo</p>
                      <p className="text-[11px] text-slate-500">Xác thực nhanh qua ứng dụng MoMo</p>
                    </div>
                  </div>
                  <Badge variant="purple" className="text-[10px]">MoMo e-Wallet</Badge>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: Booking Summary & Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 sticky top-24">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Tóm Tắt Lịch Khám & Chi Phí
              </h2>

              {/* Doctor / Hospital Details */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-slate-900 truncate">
                      {bookingContext?.doctor_name || "BS. CKII Nguyễn Văn Hùng"}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Chuyên khoa: <strong className="text-sky-700">{bookingContext?.specialty_name || "Tim Mạch"}</strong>
                    </p>
                    <p className="text-slate-500 text-[11px] truncate">
                      {bookingContext?.hospital_name}
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Ngày khám</span>
                    <strong className="text-slate-800 font-bold">
                      {formatDateVN(bookingContext?.work_date)}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Khung giờ</span>
                    <strong className="text-sky-600 font-bold">
                      {bookingContext?.start_time} - {bookingContext?.end_time}
                    </strong>
                  </div>
                </div>

                {/* Patient Summary */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Người đi khám</span>
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-800 font-bold">{selectedProfile?.full_name}</strong>
                    <span className="text-slate-500">SĐT: {selectedProfile?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Tiền khám chuyên gia:</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(bookingContext?.exam_fee || 400000)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Phí dịch vụ đặt lịch MedSi:</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(bookingContext?.service_fee || 20000)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Tổng cộng thanh toán:</span>
                  <strong className="text-lg font-black text-sky-600">
                    {formatCurrency(totalAmount)}
                  </strong>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-lg shadow-sky-600/25 text-sm transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang tạo phiếu khám & giữ slot...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Xác nhận đặt lịch ngay
                  </span>
                )}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cam kết đúng giờ, không xếp hàng bốc số</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* MODAL: SUCCESS BOOKING POPUP */}
      {createdBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-5 animate-in zoom-in-95 duration-200">
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Đặt Khám Thành Công!
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                Mã Phiếu: <span className="text-sky-600">{createdBooking.code}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Thông tin phiếu khám đã được gửi tới số điện thoại và lưu vào hồ sơ y tế của bạn.
              </p>
            </div>

            {/* Ticket Snapshot */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Người khám:</span>
                <strong className="text-slate-800">{createdBooking.patient_name}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Bác sĩ khám:</span>
                <strong className="text-slate-800">{createdBooking.doctor_name}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Thời gian:</span>
                <strong className="text-sky-700">
                  {createdBooking.start_time} - {createdBooking.end_time} ({formatDateVN(createdBooking.work_date)})
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trạng thái:</span>
                <Badge variant="warning" className="text-[10px]">Chờ xác nhận</Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button asChild className="w-full h-11 bg-sky-600 hover:bg-sky-700 text-white font-bold">
                <Link to="/my-bookings">
                  Xem trong Lịch hẹn của tôi &rarr;
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full text-slate-600 text-xs">
                <Link to="/">Quay về Trang chủ</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PATIENT PROFILE */}
      {showNewProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Thêm Hồ Sơ Bệnh Nhân Mới</h3>
              <button
                type="button"
                onClick={() => setShowNewProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Họ và tên <span className="text-rose-500">*</span></Label>
                <Input
                  required
                  placeholder="Nguyễn Văn B"
                  value={newProfileData.full_name}
                  onChange={(e) => setNewProfileData({ ...newProfileData, full_name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Ngày sinh</Label>
                  <Input
                    type="date"
                    required
                    value={newProfileData.dob}
                    onChange={(e) => setNewProfileData({ ...newProfileData, dob: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Giới tính</Label>
                  <select
                    value={newProfileData.gender}
                    onChange={(e) => setNewProfileData({ ...newProfileData, gender: e.target.value })}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-2 text-xs"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Số điện thoại</Label>
                  <Input
                    type="tel"
                    required
                    placeholder="0912345678"
                    value={newProfileData.phone}
                    onChange={(e) => setNewProfileData({ ...newProfileData, phone: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Quan hệ</Label>
                  <select
                    value={newProfileData.relationship}
                    onChange={(e) => setNewProfileData({ ...newProfileData, relationship: e.target.value })}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-2 text-xs"
                  >
                    <option value="Con">Con cái</option>
                    <option value="Vợ/Chồng">Vợ / Chồng</option>
                    <option value="Bố/Mẹ">Bố / Mẹ</option>
                    <option value="Người thân khác">Người thân khác</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewProfileModal(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" size="sm" className="bg-sky-600 text-white">
                  Lưu hồ sơ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
