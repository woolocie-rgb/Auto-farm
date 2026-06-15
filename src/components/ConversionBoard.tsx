import React, { useState } from "react";
import { ConversionMetric, DripEmail, User, Order } from "../types";
import { CONVERSION_METRICS_DATA, DRIP_EMAILS_DATA } from "../data";
import { 
  BarChart3, Users, DollarSign, Mail, 
  ShieldCheck, ShoppingCart, Percent, Zap 
} from "lucide-react";

interface ConversionBoardProps {
  user: User;
  onOpenAuth: () => void;
  orders: Order[];
  isSeller?: boolean;
}

export default function ConversionBoard({ user, onOpenAuth, orders, isSeller = false }: ConversionBoardProps) {
  const [metrics] = useState<ConversionMetric[]>(CONVERSION_METRICS_DATA);
  const [dripSteps] = useState<DripEmail[]>(DRIP_EMAILS_DATA);
  const [selectedDripStep, setSelectedDripStep] = useState<DripEmail | null>(DRIP_EMAILS_DATA[0]);

  // Aggregate stats
  const totalClicks = metrics.reduce((sum, item) => sum + item.clicks, 0);
  const totalSignups = metrics.reduce((sum, item) => sum + item.signups, 0);
  const totalSales = metrics.reduce((sum, item) => sum + item.sales, 0);
  const totalRevenue = metrics.reduce((sum, item) => sum + item.revenue, 0);
  const totalCommissions = metrics.reduce((sum, item) => sum + item.commissions, 0);
  const averageCR = (totalSales / totalSignups * 100).toFixed(1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. KEY INDICATORS GRID - Light Themed Cards with Soft Sky Shadows */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Lượt Click Tìm Key", val: totalClicks.toLocaleString(), suffix: " lượt", icon: Users, color: "text-emerald-500 bg-emerald-50" },
          { label: "Đăng Ký Đã Kích Hoạt OTP", val: totalSignups.toLocaleString(), suffix: " user", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50/80" },
          { label: "Key Phát Tự Động Thành Công", val: totalSales.toLocaleString(), suffix: " đơn", icon: ShoppingCart, color: "text-emerald-500 bg-emerald-50" },
          { label: "Tỷ Lệ Chốt Key Tức Thì", val: averageCR, suffix: " %", icon: Percent, color: "text-amber-500 bg-amber-50" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between"
              id={`stat-card-${i}`}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1 rounded-lg ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-905 text-slate-900 font-mono tracking-tight">
                  {stat.val}
                  <span className="text-xs text-slate-400 font-sans font-normal ml-0.5">{stat.suffix}</span>
                </div>
              </div>
              <div className="text-[9px] text-slate-400 mt-2">Ghi nhận bởi bộ công cụ rà soát thời gian thực Buyplay v2.2</div>
            </div>
          );
        })}
      </div>

      {/* 2. REVENUE AND DISPATCH STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Affiliate Earning Card - Clean white with beautiful sky border */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full uppercase font-black tracking-widest">
                Ví Doanh Số Cộng Tác Viên
              </span>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 block font-medium">Doanh số cộng dồn (Gross):</span>
              <div className="text-lg font-bold text-slate-700 font-mono">
                {totalRevenue.toLocaleString("vi-VN")} đ
              </div>
            </div>

            <div className="space-y-1 mt-4">
              <span className="text-xs text-slate-500 block font-medium">Hoa hồng của tôi đã tích lũy:</span>
              <div className="text-3xl font-black text-emerald-600 font-mono tracking-tight">
                {totalCommissions.toLocaleString("vi-VN")} đ
              </div>
            </div>

            <p className="text-[10.5px] text-slate-500 leading-relaxed">
              Nhận ngay 15% - 25% hoa hồng từ link tiếp thị khi bạn giới thiệu các gamer Play Together khác sắm sửa Key kích hoạt Hack Mod của Buyplay.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            {user.isLoggedIn ? (
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[8px] text-slate-400 block uppercase font-bold">Mã của bạn</span>
                  <span className="text-xs text-emerald-600 font-mono font-bold tracking-wider">{user.referralCode}</span>
                </div>
                <button
                  type="button"
                  id="withdraw_commission_button"
                  onClick={() => alert("Yêu cầu rút hoa hồng đã được gửi! Hệ thống chuyển khoản tự động sẽ tất toán trong 3 phút sấm sét.")}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-1.5 px-3.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Rút Hoa Hồng
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                id="login_earnings_button"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 px-4 rounded-xl text-xs font-black transition-all text-center cursor-pointer shadow-sm"
              >
                Đăng nhập để xem & rút tiền về
              </button>
            )}
          </div>
        </div>

        {/* Custom Analytis Charts in Light Theme */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  <span>Biểu Đồ Theo Dõi Giao Dịch Key Phát Thành Công</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">So sánh số lượt nhấp tìm key (màu teal) so với tỷ lệ thanh toán nhận key thành công (màu lục)</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Real-time 7 ngày gần nhất</span>
            </div>

            {/* Custom Interactive SVG Graph in light colors */}
            <div className="relative h-48 w-full bg-slate-50/50 rounded-xl border border-slate-100 p-2">
              <svg className="w-full h-full" viewBox="0 0 700 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradientClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="gradientSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                  </linearGradient>
                </defs>

                {/* Line 1 filled: Clicks (Teal) */}
                <path
                  d="M 50,130 C 150,90 250,110 350,70 C 450,55 550,45 650,60 L 650,150 L 50,150 Z"
                  fill="url(#gradientClicks)"
                />
                <path
                  d="M 50,130 C 150,90 250,110 350,70 C 450,55 550,45 650,60"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Line 2 filled: Sales (Emerald Green) */}
                <path
                  d="M 50,150 C 150,145 250,142 350,135 C 450,120 550,115 650,110 L 650,150 L 50,150 Z"
                  fill="url(#gradientSales)"
                />
                <path
                  d="M 50,150 C 150,145 250,142 350,135 C 450,120 550,115 650,110"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Draw dots */}
                <circle cx="50" cy="130" r="4" fill="#0d9488" stroke="#fff" strokeWidth="1" />
                <circle cx="150" cy="90" r="4" fill="#0d9488" stroke="#fff" strokeWidth="1" />
                <circle cx="250" cy="110" r="4" fill="#0d9488" stroke="#fff" strokeWidth="1" />
                <circle cx="350" cy="70" r="4" fill="#0d9488" stroke="#fff" strokeWidth="1" />
                <circle cx="450" cy="55" r="4" fill="#0d9488" stroke="#fff" strokeWidth="1" />
                <circle cx="550" cy="45" r="4" fill="#0d9488" stroke="#fff" strokeWidth="1" />
                <circle cx="650" cy="60" r="4" fill="#0d9488" stroke="#fff" strokeWidth="1" />

                <circle cx="50" cy="150" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
                <circle cx="150" cy="145" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
                <circle cx="250" cy="142" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
                <circle cx="350" cy="135" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
                <circle cx="450" cy="120" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
                <circle cx="550" cy="115" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
                <circle cx="650" cy="110" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
              </svg>
            </div>

            {/* Labels */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-3 px-8">
              {metrics.map((m, idx) => (
                <span key={idx}>{m.date}</span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 block" />
              <span>Lượt bấm link / click tìm kiếm</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
              <span>Lượt mua và giao Key thành công</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC DISTRIBUTION EMAIL DRIP VISUALIZER */}
      {isSeller && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-4">
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                <Mail className="w-4.5 h-4.5 text-emerald-500" />
                <span>Hộp Kiểm Thư Thư Nhận Key Tự Động</span>
              </h4>
              <p className="text-[10px] text-slate-450 mt-1">Trình mô phỏng xem trước các bước thư mà hệ thống tự động bắn khi kích hoạt mua Key.</p>
            </div>

            <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              MAILER PIPELINE V2
            </span>
          </div>

          {/* Tab Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {dripSteps.map((step) => {
              const isSelected = selectedDripStep?.id === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedDripStep(step)}
                  className={`p-4 rounded-xl border cursor-pointer text-left transition-all ${
                    isSelected
                      ? "bg-emerald-50/50 border-emerald-400 border-emerald-500 shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono text-emerald-600 font-extrabold uppercase">
                      BƯỚC {step.step} - {step.delayText}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-emerald-500" : "bg-slate-300"}`} />
                  </div>
                  <h5 className="text-xs font-black text-slate-800 mt-1.5 truncate">{step.subject}</h5>
                  <p className="text-[9.5px] text-slate-500 mt-1 line-clamp-1">{step.purpose}</p>
                </div>
              );
            })}
          </div>

          {/* Browser simulation */}
          {selectedDripStep && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 animate-fade-in text-left">
              <div className="flex flex-wrap gap-4 text-xs font-sans text-slate-500 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-slate-400 font-semibold block">Sự kiện kích hoạt:</span>
                  <span className="text-slate-850 text-slate-805 text-slate-800 font-bold">{selectedDripStep.triggerEvent}</span>
                </div>
                <div className="border-l border-slate-200" />
                <div>
                  <span className="text-slate-400 font-semibold block">Tốc độ gửi thư:</span>
                  <span className="text-emerald-600 font-bold">{selectedDripStep.delayText}</span>
                </div>
                <div className="border-l border-slate-200" />
                <div>
                  <span className="text-slate-400 font-semibold block">Mục tiêu email:</span>
                  <span className="text-slate-700 font-bold">{selectedDripStep.purpose}</span>
                </div>
              </div>

              {/* Email View simulator box */}
              <div className="border border-slate-300 rounded-xl bg-white p-4 font-mono text-xs text-slate-700 space-y-2 select-all relative overflow-hidden shadow-inner">
                <div className="absolute top-2 right-2 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-[8.5px] font-sans font-bold text-slate-500">
                  MAILBOX LAYOUT
                </div>
                
                <div className="border-b border-slate-100 pb-2 space-y-1">
                  <p><span className="text-slate-400">Từ:</span> kyniem@buyplay.com</p>
                  <p><span className="text-slate-400">Tiêu đề:</span> <span className="text-slate-800 font-bold">{selectedDripStep.subject}</span></p>
                </div>

                <div className="pt-2 text-[10.5px] text-slate-600 leading-relaxed whitespace-pre-line select-text">
                  {selectedDripStep.body
                    .replace("{BUYER_EMAIL}", "cauchulonpt@gmail.com")
                    .replace("{PRODUCT_NAME}", "Key VIP Play Together Auto 30 Ngày")
                    .replace("{KEY_DELIVERED}", "BUYPLAY-VIP-30DAYS-90XZP-LLK19")
                    .replace("{DOWNLOAD_URL}", "https://drive.google.com/drive/folders/play-together-cheat-secure")
                    .replace("{INSTRUCTIONS}", "Tải bản Hack Mod của Buyplay, điền Key VIP được bàn giao để kích hoạt tức thì.")
                  }
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. RECENT ORDERS LISTING LOGS */}
      {orders.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h4 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Nhật ký đơn hàng vừa sắm tại Buyplay</span>
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="text-[10px] text-slate-400 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-2.5">Mã Giao Dịch</th>
                  <th>Kích hoạt gói VIP</th>
                  <th>Số Tiền Trực Tuyến</th>
                  <th>Danh Tính Nhận</th>
                  <th>Mã Key Được Cấp Phát</th>
                  <th className="text-right">Trạng Thái ATM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80">
                    <td className="py-3 font-semibold text-emerald-600">#{ord.id}</td>
                    <td className="font-sans text-slate-900 font-bold">{ord.productName}</td>
                    <td className="text-emerald-600 font-bold">{(ord.price).toLocaleString("vi-VN")} đ</td>
                    <td className="font-sans text-slate-500">{ord.buyerEmail}</td>
                    <td className="text-slate-800 text-[10.5px] select-all font-mono font-bold bg-slate-50 p-1 rounded border border-slate-100">{ord.keyDelivered}</td>
                    <td className="text-right">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5 text-[9px] font-sans font-extrabold uppercase">
                        {ord.status === "success" ? "THÀNH CÔNG" : ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
