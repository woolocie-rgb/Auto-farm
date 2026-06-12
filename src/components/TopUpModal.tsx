import React, { useState } from "react";
import { X, Sparkles, CreditCard, Landmark, Check, ShieldCheck, QrCode } from "lucide-react";

interface TopUpModalProps {
  onClose: () => void;
  onAddFunds: (amount: number) => void;
}

export default function TopUpModal({ onClose, onAddFunds }: TopUpModalProps) {
  const [amountOption, setAmountOption] = useState<number>(50000);
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "card" | "momo">("card");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successAmt, setSuccessAmt] = useState(0);

  const amountPresets = [20000, 50000, 100000, 200000, 500000];

  const handleSimulateTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFunds(amountOption);
    setSuccessAmt(amountOption);
    setIsSuccess(true);
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
          <div className="bg-gradient-to-r from-sky-600 to-indigo-700 py-5 px-6 text-white relative">
            <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <Landmark className="w-5 h-5 text-indigo-200 animate-pulse" />
              <span>Nạp Tiền Giả Lập Vào Tài Khoản</span>
            </h3>
            <p className="text-[10.5px] text-sky-100/90 font-medium leading-relaxed mt-1">
              Hệ thống mô phỏng thanh toán nhanh. Bạn có thể nạp thử tiền thật/thử nghiệm tức thì để nâng số dư của mình hoàn toàn miễn phí!
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
            ) : (
              <form onSubmit={handleSimulateTopUp} className="space-y-4 text-xs text-slate-700 text-left">
                
                {/* Switch view ATM QR vs Simulator Card vs MoMo */}
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-1.5 rounded-lg text-center font-bold text-[10px] cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    🚀 Simulator
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("qr")}
                    className={`py-1.5 rounded-lg text-center font-bold text-[10px] cursor-pointer transition-all ${
                      paymentMethod === "qr"
                        ? "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    🏧 VietQR
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

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    {/* Prest selectors */}
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
                                ? "bg-indigo-600 text-white border-indigo-650 shadow-md shadow-indigo-600/10"
                                : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"
                            }`}
                          >
                            {(val / 1000).toLocaleString()}k đ
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Simulation alert */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-[10.5px] text-indigo-900 font-semibold leading-relaxed">
                      🔥 <strong>Lợi thế test nhanh</strong>: Chọn mệnh giá ở trên rồi ấn nút nạp để biến hóa ví từ <strong className="text-red-650 text-red-600">0 đ</strong> lên tài chính dồi dào cày game tức thì!
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-705 bg-indigo-600 text-white font-black py-3 rounded-xl cursor-pointer shadow-lg shadow-indigo-600/15 transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Landmark className="w-4 h-4 text-indigo-200" />
                      <span>XÁC NHẬN NẠP LẬP TỨC &rarr;</span>
                    </button>
                  </div>
                )}

                {paymentMethod === "qr" && (
                  <div className="space-y-4 text-center py-2">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex flex-col items-center justify-center animate-fade-in">
                      {/* Dynamic VietQR API code representation */}
                      <div className="w-52 h-52 bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-1 shadow-sm relative overflow-hidden group">
                        <img 
                          src={`https://img.vietqr.io/image/vietcombank-0181003622756-compact2.png?amount=${amountOption}&addInfo=BP%20${amountOption}&accountName=TRAN%20HUYNH%20QUOC%20LOC`}
                          alt="VietQR Chuyển Khoản"
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="text-center mt-3">
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1 rounded-full border border-emerald-200 font-sans uppercase animate-pulse">
                          VIETCOMBANK / NAPAS 247
                        </span>
                        <div className="text-slate-800 font-black text-sm mt-2 font-mono tracking-wide">STK: 0181003622756</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Chủ tài khoản: TRẦN HUỲNH QUỐC LỘC</div>
                        <div className="text-[11px] text-indigo-700 font-black mt-1 font-mono">Số tiền: {amountOption.toLocaleString("vi-VN")} đ</div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[10.5px] text-amber-900 font-bold leading-normal text-left">
                      📋 <strong>Cú pháp nạp</strong>: Quét mã QR ở trên hoặc chuyển khoản thủ công với nội dung: <span className="font-mono text-indigo-700 underline text-xs">BP {amountOption}</span>. Hệ thống ngân hàng API tự động sẽ đối soát giao dịch và cộng tiền vào số dư của bạn sau 10 giây! (Bạn có thể dùng tab Simulator để nạp nhanh miễn phí tức thì).
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onAddFunds(amountOption);
                        setSuccessAmt(amountOption);
                        setIsSuccess(true);
                      }}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl cursor-pointer shadow-md transition-all active:scale-95"
                    >
                      BẤM VÀO ĐÂY SAU KHI ĐÃ CHUYỂN KHOẢN
                    </button>
                  </div>
                )}

                {paymentMethod === "momo" && (
                  <div className="space-y-4 text-center py-2 animate-fade-in">
                    <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-2xl flex flex-col items-center justify-center">
                      {/* MoMo QR generator via qrserver */}
                      <div className="w-52 h-52 bg-white border-2 border-rose-550 border-rose-500 rounded-2xl flex items-center justify-center p-1 shadow-sm relative overflow-hidden group">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2%7C99%7C0334410858%7CTRAN%20HUYNH%20QUOC%20LOC%7Cwoolocie%40gmail.com%7C0%7C0%7C${amountOption}%7CBP%20${amountOption}`}
                          alt="MoMo QR Code Chuyển Khoản"
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="text-center mt-3">
                        <span className="text-[10px] bg-rose-50 text-rose-700 font-extrabold px-3 py-1 rounded-full border border-rose-200 font-sans uppercase animate-pulse">
                          VÍ ĐIỆN TỬ MOMO
                        </span>
                        <div className="text-slate-800 font-black text-sm mt-2 font-mono tracking-wide">SĐT: 0334410858</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Chủ tài khoản: TRẦN HUỲNH QUỐC LỘC</div>
                        <div className="text-[11px] text-rose-750 text-rose-700 font-black mt-1 font-mono">Số tiền: {amountOption.toLocaleString("vi-VN")} đ</div>
                      </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-250 border-rose-200 p-3 rounded-xl text-[10.5px] text-rose-950 font-bold leading-normal text-left">
                      📋 <strong>Cú pháp nạp MoMo</strong>: Quét mã QR ở trên hoặc chuyển khoản thủ công tới Số Điện Thoại MoMo <span className="font-mono text-rose-700 underline text-xs font-black">0334410858</span> với nội dung ghi chú chính xác: <span className="font-mono text-indigo-700 underline text-xs font-black">BP {amountOption}</span> để được cộng tiền tự động siêu tốc!
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onAddFunds(amountOption);
                        setSuccessAmt(amountOption);
                        setIsSuccess(true);
                      }}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-2.5 rounded-xl cursor-pointer shadow-md transition-all active:scale-95 text-xs"
                    >
                      BẤM VÀO ĐÂY SAU KHI ĐÃ CHUYỂN KHOẢN MOMO
                    </button>
                  </div>
                )}

              </form>
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
