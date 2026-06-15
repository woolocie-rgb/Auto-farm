import React, { useState } from "react";
import { Product, User } from "../types";
import { 
  DollarSign, Percent, Users, ShoppingBag, Award, ArrowRight
} from "lucide-react";

interface CommissionCalculatorProps {
  user: User;
  onOpenAuth: () => void;
  products: Product[];
}

export default function CommissionCalculator({ user, onOpenAuth, products }: CommissionCalculatorProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [traffic, setTraffic] = useState(10000); // visitors
  const [ctr, setCtr] = useState(5); // % of visitors who click
  const [conversionRate, setConversionRate] = useState(3); // % of clicks that buy
  const [commissionRate, setCommissionRate] = useState(selectedProduct.commissionRate);

  // Sync commission rate when product changes
  const handleProductChange = (prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setSelectedProduct(prod);
      setCommissionRate(prod.commissionRate);
    }
  };

  // Math Calculations
  const calculatedClicks = Math.round(traffic * (ctr / 100));
  const calculatedSales = Math.round(calculatedClicks * (conversionRate / 100));
  const estimatedRevenue = calculatedSales * selectedProduct.price;
  const estimatedCommissions = Math.round(estimatedRevenue * (commissionRate / 100));

  const getFeasibilityText = () => {
    if (conversionRate < 2) return { text: "Thấp - Cần thêm bài đánh giá Mod game", color: "text-amber-600 bg-amber-50" };
    if (conversionRate >= 2 && conversionRate < 5) return { text: "Khả thi cao (Cộng đồng lướt câu cá đông đảo)", color: "text-emerald-700 bg-emerald-50" };
    return { text: "Tuyệt đỉnh (Dành cho KOLs Youtube/TikTok)", color: "text-emerald-700 bg-emerald-50" };
  };

  const feasibility = getFeasibilityText();

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm relative overflow-hidden">
      {/* Visual background gradient glow circle */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
      
      {/* Title */}
      <div className="pb-6 border-b border-slate-100 text-left">
        <span className="text-emerald-600 text-xs font-black uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
          <Award className="w-4 h-4" />
          <span>Công Cụ Mở Rộng Cho Đại Lý Buyplay</span>
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Máy Tính Nhẩm Doanh Thu Ước Tính & Hoa Hồng
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Tự do kéo các thanh trượt điều chỉnh lượng khách ghé thăm blog/TikTok để định lượng số tiền hoa hồng thụ động dồi dào gặt hái được hàng tháng cùng diễn đàn Hack Play Together Buyplay.
        </p>
      </div>

      {/* Main Grid: Inputs vs Output Display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 text-left">
        
        {/* Sliders Inputs - Left (7 cols) */}
        <div className="md:col-span-7 space-y-5">
          {/* Product chooser input */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Chọn Gói Key tiếp thị giới thiệu
            </label>
            <select
              value={selectedProduct.id}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-2.5 px-3 text-xs text-slate-800 outline-none font-bold transition-all"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-slate-800">
                  {p.name} - Giá: {p.price.toLocaleString("vi-VN")}đ (Hoa hồng: {p.commissionRate}%)
                </option>
              ))}
            </select>
          </div>

          {/* Traffic slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
              <span>2. Traffic xem bài viết review / tháng</span>
              <span className="text-emerald-600 font-mono text-sm font-black">{traffic.toLocaleString()} lượt</span>
            </div>
            <input
              type="range"
              min="500"
              max="100000"
              step="500"
              value={traffic}
              onChange={(e) => setTraffic(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              (Số lượt game thủ tò mò lướt qua video TikTok hoặc bài viết review tool câu cá của bạn)
            </span>
          </div>

          {/* CTR Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
              <span>3. Tỷ lệ bấm vào link tiếp thị (CTR)</span>
              <span className="text-emerald-600 font-mono text-sm font-black">{ctr}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={ctr}
              onChange={(e) => setCtr(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              (Bình quân từ 3% - 10% nếu bạn làm video hướng dấn câu được cá mập siêu to)
            </span>
          </div>

          {/* Conversion rate slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
              <span>4. Tỷ lệ game thủ chốt mua Key thành công (CR)</span>
              <span className="text-emerald-600 font-mono text-sm font-black">{conversionRate}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              (Thực tế tỷ lệ chốt Key câu cá là cực kì cao do tính cuốn hút cày sao cực mạnh)
            </span>
          </div>

          {/* Custom Commission Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
              <span>5. Thiết lập tỷ lệ hoa hồng đại lý</span>
              <span className="text-emerald-600 font-mono text-sm font-black">{commissionRate}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              step="1"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              (Hỗ trợ tăng thưởng % chiếc khấu đối với các CTV tạo doanh thu uy tín đều đặn)
            </span>
          </div>
        </div>

        {/* Live Calculation Outcomes - Right (5 cols) */}
        <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest">
              Dự báo ước tính thu nhập
            </h4>

            {/* Calculations Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-xs text-slate-500 flex items-center gap-1 font-sans">
                  <Users className="w-3.5 h-3.5" /> Số lượt nhấp:
                </span>
                <span className="text-xs font-bold text-slate-800 font-mono">{calculatedClicks} clicks</span>
              </div>
              
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-xs text-slate-500 flex items-center gap-1 font-sans">
                  <ShoppingBag className="w-3.5 h-3.5" /> Thành công:
                </span>
                <span className="text-xs font-bold text-slate-800 font-mono">{calculatedSales} đơn hàng</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-xs text-slate-500 flex items-center gap-1 font-sans">
                  <DollarSign className="w-3.5 h-3.5" /> Tổng doanh số:
                </span>
                <span className="text-xs font-bold text-slate-700 font-mono">
                  {estimatedRevenue.toLocaleString("vi-VN")} đ
                </span>
              </div>

              <div className="flex justify-between pb-1 items-center">
                <span className="text-xs text-slate-500">Độ khả thi:</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${feasibility.color}`}>
                  {feasibility.text}
                </span>
              </div>
            </div>

            {/* BIG COMMISSION HIGHLIGHT */}
            <div className="bg-emerald-500 text-white p-4 rounded-xl text-center mt-3 shadow-md">
              <span className="text-[10px] text-emerald-100 uppercase font-black block tracking-widest">
                Hoa Hồng Ước Tính Nhận Nhẹ
              </span>
              <div className="text-2xl font-black font-mono tracking-tight mt-1">
                + {estimatedCommissions.toLocaleString("vi-VN")} đ
              </div>
              <p className="text-[9.5px] text-emerald-100/80 mt-1 leading-normal">
                Quyết toán tự động trực tiếp qua MBBank/VietQR tức thì cực nhanh trong 3 phút.
              </p>
            </div>
          </div>

          {/* Action */}
          <div className="mt-5">
            {user.isLoggedIn ? (
              <div className="bg-white rounded-xl p-3 border border-slate-200 text-center space-y-1">
                <span className="text-[9px] text-slate-400 block font-bold leading-none">MÃ AFFILIATE CÁ NHÂN CỦA BẠN</span>
                <strong className="text-emerald-600 text-xs tracking-widest font-mono block uppercase">
                  {user.referralCode}
                </strong>
                <p className="text-[9px] text-slate-500 leading-normal">Nhận ngay mức hoa hồng vĩnh viễn {commissionRate}% khi giới thiệu đại lý.</p>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition-transform active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Nhận mã đối tác của tôi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
