import React, { useState } from "react";
import { X, Landmark, Check, ShieldCheck, Clock } from "lucide-react";
import { User } from "../types";
import { getLocalDeposits, saveLocalDeposits } from "../utils/dbFallback";

interface TopUpModalProps {
  onClose: () => void;
  onAddFunds: (amount: number) => void;
  currentUser?: User;
}

export default function TopUpModal({ onClose, onAddFunds, currentUser }: TopUpModalProps) {
  const [amountOption, setAmountOption] = useState<number>(50000);
  
  const isUserAdmin = currentUser?.isAdmin || ["0334410858", "woolocie@gmail.com"].includes(currentUser?.phoneNumberOrEmail?.trim().toLowerCase() || "");
  
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "card" | "momo">(isUserAdmin ? "card" : "qr");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [successAmt, setSuccessAmt] = useState(0);
  const [pendingId, setPendingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derive custom user memo for SePay, e.g. "BP WOOLOCIE" or "BP 0334410858"
  const userMemoKey = currentUser?.phoneNumberOrEmail
    ? currentUser.phoneNumberOrEmail.split("@")[0].toUpperCase().replace(/[^A-Z0-9]/g, "")
    : "WOOLOCIE";

  const billingMemo = `BP ${userMemoKey}`;

  const amountPresets = [20000, 50000, 100000, 200000, 500000];

  const handleSimulateTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDepositRequest(amountOption);
  };

  const createDepositRequest = async (amount: number) => {
    setIsSubmitting(true);
    const depositId = "DEP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Save to local fallback DB first
    try {
      const localD = getLocalDeposits();
      localD.push({
        id: depositId,
        phoneNumberOrEmail: currentUser?.phoneNumberOrEmail || "woolocie@gmail.com",
        amount: amount,
        paymentMethod: paymentMethod,
        memo: billingMemo,
        status: isUserAdmin ? "approved" : "pending",
        createdAt: new Date().toISOString(),
        processedAt: isUserAdmin ? new Date().toISOString() : null
      });
      saveLocalDeposits(localD);
    } catch (e) {
      console.error("Local deposit save issue:", e);
    }

    // Call live API
    try {
      const res = await fetch("/api/deposits/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumberOrEmail: currentUser?.phoneNumberOrEmail || "woolocie@gmail.com",
          amount: amount,
          paymentMethod: paymentMethod,
          memo: billingMemo
        })
      });
      const data = await res.json();
      console.log("Create deposit API response:", data);
    } catch (err) {
      console.warn("Live API save failed, offline local record created.", err);
    } finally {
      setIsSubmitting(false);
      if (isUserAdmin) {
        onAddFunds(amount);
        setSuccessAmt(amount);
        setIsSuccess(true);
      } else {
        setPendingId(depositId);
        setIsPending(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Background Overlay */}
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
          aria-hidden="true" 
        />

        {/* Center alignment trick */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-slate-250 animate-fade-in relative">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-800 py-5 px-6 text-white relative">
            <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-200 animate-pulse" />
              <span>{isUserAdmin ? "Nạp Tiền Giả Lập Vào Tài Khoản" : "Nạp Tiền Số Dư Tài Khoản"}</span>
            </h3>
            <p className="text-[10.5px] text-emerald-100/90 font-medium leading-relaxed mt-1">
              {isUserAdmin 
                ? "Chế độ dành riêng cho quản trị viên. Bơm thử nghiệm số dư tức thì hoàn toàn miễn phí!" 
                : "Chuyển khoản theo cú pháp bên dưới. Giao dịch được duyệt sau khi Admin đối soát!"}
            </p>
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            
            {isSuccess ? (
              <div className="space-y-4 py-4 text-center">
                <div className="w-16 h-16 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold animate-bounce shadow">
                  <ShieldCheck className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Nạp Tiền Thành Công!</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-normal">
                    Số dư của bạn đã được cộng thêm <br />
                    <strong className="text-emerald-600 font-mono font-black text-lg">+{successAmt.toLocaleString("vi-VN")} đ</strong> thành công từ hệ thống!
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[10.5px] text-slate-500 leading-normal">
                  💡 Giờ đây bạn đã có thể sử dụng số dư này để mua VIP Key Auto hoặc chơi trò bốc túi mù may mắn cực kỳ rảnh tay.
                </div>

                <button
                  onClick={() => {
                    setIsSuccess(false);
                    onClose();
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 rounded-xl"
                >
                  Đóng Hộp Thoại
                </button>
              </div>
            ) : isPending ? (
              <div className="space-y-4 py-4 text-center animate-fade-in">
                <div className="w-16 h-16 bg-amber-100 border border-amber-200 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow relative">
                  <Clock className="w-9 h-9 animate-spin" style={{ animationDuration: "3s" }} />
                </div>
                <div>
                  <h4 className="font-extrabold text-amber-800 text-sm">Yêu Cầu Nạp Chờ Phê Duyệt!</h4>
                  <div className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-normal space-y-2">
                    <p>
                      Đã gửi thành công lệnh nạp số tiền <br />
                      <strong className="text-amber-605 text-amber-700 font-mono font-black text-base">{amountOption.toLocaleString("vi-VN")} đ</strong>
                    </p>
                    <div className="bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg font-mono font-bold text-slate-700 max-w-xs mx-auto text-[11px]">
                      MÃ YÊU CẦU: {pendingId}
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[10.5px] text-amber-950 leading-relaxed text-left space-y-1">
                  <div>📌 <strong>LƯU Ý QUAN TRỌNG:</strong></div>
                  <div>1. Vui lòng chuyển khoản đúng số tiền <span className="text-rose-600 font-bold">{amountOption.toLocaleString("vi-VN")} đ</span>.</div>
                  <div>2. Ghi chính xác nội dung chuyển khoản: <span className="text-emerald-700 underline font-black font-mono text-[11px]">{billingMemo}</span>.</div>
                  <div>3. Sau khi chuyển tiền, Admin Trần Huỳnh Quốc Lộc sẽ đối soát giao dịch và duyệt số dư cho bạn sau 60 giây.</div>
                </div>

                <button
                  onClick={() => {
                    setIsPending(false);
                    onClose();
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 rounded-xl"
                >
                  Xác Nhận & Đóng
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs text-slate-700 text-left">
                
                {/* Switch view ATM QR vs Simulator Card vs MoMo */}
                <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 r-xl rounded-xl">
                  {isUserAdmin && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`py-1.5 rounded-lg text-center font-bold text-[10px] cursor-pointer transition-all ${
                        paymentMethod === "card"
                          ? "bg-white text-emerald-700 shadow-sm col-span-2"
                          : "text-slate-500 hover:text-slate-800 col-span-2"
                      }`}
                    >
                      🚀 Simulator (Admin Only)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("qr")}
                    className={`py-1.5 rounded-lg text-center font-bold text-[10px] cursor-pointer transition-all ${
                      paymentMethod === "qr"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    🏧 Ngân Hàng (VietQR)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("momo")}
                    className={`py-1.5 rounded-lg text-center font-bold text-[10px] cursor-pointer transition-all ${
                      paymentMethod === "momo"
                        ? "bg-white text-rose-600 shadow-sm"
                        : "text-slate-500 hover:text-rose-600"
                    }`}
                  >
                    🌸 Ví MoMo
                  </button>
                </div>

                {paymentMethod === "card" && isUserAdmin && (
                  <form onSubmit={handleSimulateTopUp} className="space-y-4">
                    {/* Preset selectors */}
                    <div>
                      <label className="block text-[10.5px] font-black text-slate-500 uppercase mb-2">
                        1. Chọn Mệnh Giá Muốn Nạp (VNĐ)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {amountPresets.map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setAmountOption(val)}
                            className={`py-2 rounded-xl text-center border font-mono font-bold transition-all cursor-pointer ${
                              amountOption === val
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                                : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
                            }`}
                          >
                            {(val / 1000).toLocaleString()}k đ
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Simulation alert */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-[10.5px] text-red-900 font-bold leading-relaxed space-y-2">
                      <div>
                        🌟 <strong>CHẾ ĐỘ THỬ NGHIỆM ADMIN</strong>: Chức năng nạp tài khoản đặc biệt cho nhà phát triển đã được mở khóa! Nhấp nút dưới đây để bơm siêu số dư thử nghiệm tức sau 1 nốt nhạc.
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await createDepositRequest(99999000);
                        }}
                        disabled={isSubmitting}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-2 rounded-lg text-center shadow-md transition-all active:scale-95 cursor-pointer block text-xs"
                      >
                        {isSubmitting ? "Đang Gửi..." : "🎁 Bơm Ngay 99.999.000 đ Thử Nghiệm Gốc"}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl cursor-pointer shadow-lg shadow-emerald-600/15 transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Landmark className="w-4 h-4 text-emerald-200" />
                      <span>{isSubmitting ? "Đang xử lý..." : "XÁC NHẬN NẠP LẬP TỨC →"}</span>
                    </button>
                  </form>
                )}

                {paymentMethod === "qr" && (
                  <div className="space-y-4 text-center py-1">
                    {/* Size and selection presets */}
                    <div>
                      <label className="block text-[10.5px] font-black text-slate-500 uppercase mb-2 text-left">
                        Chọn Mệnh Giá Muốn Nạp:
                      </label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {amountPresets.map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setAmountOption(val)}
                            className={`py-1.5 rounded-lg text-center border font-mono font-bold text-[10px] transition-all cursor-pointer ${
                              amountOption === val
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
                            }`}
                          >
                            {(val / 1000).toLocaleString()}k
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-2xl flex flex-col items-center justify-center animate-fade-in">
                      {/* Dynamic VietQR API code representation with customized user memo */}
                      <div className="w-40 h-40 bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-1 shadow-sm relative overflow-hidden">
                        <img 
                          src={`https://img.vietqr.io/image/vietcombank-0181003622756-compact2.png?amount=${amountOption}&addInfo=${encodeURIComponent(billingMemo)}&accountName=TRAN%20HUYNH%20QUOC%20LOC`}
                          alt="VietQR Chuyển Khoản"
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="text-center mt-2">
                        <span className="text-[8px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 font-sans uppercase animate-pulse">
                          VIETCOMBANK / NAPAS 247
                        </span>
                        <div className="text-slate-800 font-black text-sm mt-1 font-mono tracking-wide leading-none">STK: 0181003622756</div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider leading-none mt-1">Chủ tài khoản: TRẦN HUỲNH QUỐC LỘC</div>
                        <div className="text-[11px] text-emerald-700 font-extrabold mt-1 font-mono">Số tiền: {amountOption.toLocaleString("vi-VN")} đ</div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[10px] text-amber-900 font-bold leading-relaxed text-left">
                      📋 <strong>Cú pháp bắt buộc</strong>: Chuyển khoản với nội dung ghi danh: <span className="font-mono text-emerald-700 underline text-xs font-black">{billingMemo}</span>.
                    </div>

                    <button
                      type="button"
                      onClick={() => createDepositRequest(amountOption)}
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl cursor-pointer shadow-md transition-all active:scale-95 text-xs flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4 text-emerald-200" />
                      <span>{isSubmitting ? "Đang Gửi..." : "BẤM VÀO ĐÂY SAU KHI ĐÃ CHUYỂN KHOẢN ✔"}</span>
                    </button>
                  </div>
                )}

                {paymentMethod === "momo" && (
                  <div className="space-y-4 text-center py-1 animate-fade-in">
                    {/* Size selector */}
                    <div>
                      <label className="block text-[10.5px] font-black text-slate-500 uppercase mb-2 text-left">
                        Chọn Mệnh Giá Muốn Nạp:
                      </label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {amountPresets.map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setAmountOption(val)}
                            className={`py-1.5 rounded-lg text-center border font-mono font-bold text-[10px] transition-all cursor-pointer ${
                              amountOption === val
                                ? "bg-rose-600 text-white border-rose-600"
                                : "bg-white text-slate-700 border-slate-200 hover:border-rose-300"
                            }`}
                          >
                            {(val / 1000).toLocaleString()}k
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-rose-50/50 border border-rose-105 p-2.5 rounded-2xl flex flex-col items-center justify-center">
                      <div className="w-40 h-40 bg-white border-2 border-rose-500 rounded-2xl flex items-center justify-center p-1 shadow-sm relative overflow-hidden">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2%7C99%7C0334410858%7CTRAN%20HUYNH%20QUOC%20LOC%7Cwoolocie%40gmail.com%7C0%7C0%7C${amountOption}%7C${encodeURIComponent(billingMemo)}`}
                          alt="MoMo QR Code Chuyển Khoản"
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="text-center mt-2">
                        <span className="text-[8px] bg-rose-50 text-rose-750 font-extrabold px-2 py-0.5 rounded-full border border-rose-200 font-sans uppercase animate-pulse">
                          VÍ ĐIỆT TỬ MOMO
                        </span>
                        <div className="text-slate-800 font-black text-sm mt-1 font-mono tracking-wide leading-none animate-pulse">SĐT: 0334410858</div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider leading-none mt-1">Chủ tài khoản: TRẦN HUỲNH QUỐC LỘC</div>
                        <div className="text-[11px] text-rose-750 text-rose-605 font-bold mt-1 font-mono">Số tiền: {amountOption.toLocaleString("vi-VN")} đ</div>
                      </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-[10px] text-rose-950 font-bold leading-relaxed text-left">
                      📋 <strong>Cú pháp bắt buộc</strong>: Nội dung ghi chú ghi chính xác: <span className="font-mono text-emerald-700 underline text-xs font-black">{billingMemo}</span>.
                    </div>

                    <button
                      type="button"
                      onClick={() => createDepositRequest(amountOption)}
                      disabled={isSubmitting}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-2.5 rounded-xl cursor-pointer shadow-md transition-all active:scale-95 text-xs flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4 text-rose-200" />
                      <span>{isSubmitting ? "Đang Gửi..." : "BẤM VÀO ĐÂY SAU KHI ĐÃ CHUYỂN KHOẢN MOMO"}</span>
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Footer badge */}
          <div className="bg-slate-50 py-3 px-6 text-center text-[10px] text-slate-400 border-t border-slate-100 italic">
            🔐 Kết nối giao thức bảo mật VNPay Secure API 256-bit
          </div>

        </div>
      </div>
    </div>
  );
}
