import React, { useState } from "react";
import { Order } from "../types";
import { Copy, Check, Ticket, Clock, Download, ExternalLink, RefreshCw, Key } from "lucide-react";

interface PurchaseHistoryProps {
  orders: Order[];
  currentUserEmail: string;
}

export default function PurchaseHistory({ orders, currentUserEmail }: PurchaseHistoryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter keys for the current user
  const userKeys = orders.filter(o => 
    o.status === "success" && 
    (o.buyerEmail.toLowerCase().includes(currentUserEmail.toLowerCase()) || currentUserEmail === "")
  );

  const handleCopyKey = (keyString: string, id: string) => {
    navigator.clipboard.writeText(keyString);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto shadow-sm text-left">
      
      {/* Tab head */}
      <div className="border-b border-emerald-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full uppercase font-black tracking-widest flex items-center gap-1 w-max">
            <Key className="w-3.5 h-3.5" />
            <span>Khu Vực Lưu Trữ Khách Hàng</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
            🔑 Lịch Sử Giao Dịch & Nhận Key Auto
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl font-medium">
            Lịch sử tự động bàn giao các VIP Key Auto Mua Quả đã kích hoạt trực tuyến hoặc nhận từ túi mù may mắn của tài khoản <strong className="text-emerald-600 font-mono font-bold">{currentUserEmail || "Khách vãng lai"}</strong>.
          </p>
        </div>

        <button 
          onClick={() => {
            alert("Đang kiểm tra và đồng bộ hóa hóa đơn thanh toán từ ngân hàng hoàn tất!");
          }}
          className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-extrabold text-[11px] py-1.5 px-3.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bấm Để Đối Soát Bank</span>
        </button>
      </div>

      {userKeys.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-150 text-slate-500 max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-100 border border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
            🎫
          </div>
          <div>
            <h3 className="font-bold text-slate-850 text-slate-800 text-sm">Chưa phát hiện giao dịch mua key</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mt-1">
              Hệ thống chưa tìm thấy Key Auto dọn shop Play Together nào thuộc về email của bạn. Hãy sang thẻ <strong>🎫 Bảng Giá Key VIP</strong> hoặc thử vận may bốc <strong>🎁 Túi mù</strong> để nhận Key tức thì!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[11px] text-amber-900 leading-relaxed font-semibold">
            🔔 <strong>Cách kích hoạt nhanh Key</strong>: Click vào nút <strong className="text-emerald-600 underline">Sao chép</strong> để lấy Mã Key VIP. Sau đó khởi chạy Client tool Auto Play Together Fruit, gắn mã Key vào góc kích hoạt và NPC bách hóa nông trại sẽ tự dộng gom quả siêu tốc bỏ qua hội thoại!
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {userKeys.map((item) => (
              <div 
                key={item.id} 
                className="bg-white hover:bg-slate-50/50 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors text-xs"
              >
                
                {/* Product details */}
                <div className="space-y-1.5 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-emerald-500 text-white font-mono font-bold px-2 py-0.5 rounded uppercase">
                      Đã Giao Key
                    </span>
                    <span className="text-xs font-black text-slate-905 text-slate-900 leading-none">
                      {item.productName.replace("Key VIP Auto Mua Quả Trong Shop - ", "")}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {item.timestamp}</span>
                    <span className="bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-mono font-bold">Mã #{item.id}</span>
                    <span className="text-emerald-600 font-bold font-mono">{(item.price).toLocaleString("vi-VN")} đ</span>
                  </div>
                </div>

                {/* Key value with clipboard actions */}
                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 border border-emerald-200/60 rounded-xl px-3 py-2.5 flex items-center justify-between gap-4 font-mono w-full sm:w-[320px] shadow-inner">
                    <div className="truncate font-black text-emerald-700 text-xs sm:text-[11px]" title={item.keyDelivered}>
                      {item.keyDelivered}
                    </div>
                    <button
                      onClick={() => handleCopyKey(item.keyDelivered, item.id)}
                      className="text-slate-500 hover:text-emerald-600 p-1 rounded-lg hover:bg-slate-200 select-none cursor-pointer border border-slate-200 bg-white shadow-sm flex-shrink-0"
                      title="Sao chép Key"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <a 
                    href="https://drive.google.com/drive/folders/play-together-cheat-secure" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200 rounded-xl text-slate-600 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                    title="Tải Tool Về Máy"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
