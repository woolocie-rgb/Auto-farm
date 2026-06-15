import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Code, 
  ArrowLeft, 
  ShieldCheck, 
  Key, 
  HelpCircle,
  LogOut,
  RefreshCw,
  Cpu
} from "lucide-react";
import SellerDashboard from "./SellerDashboard";
import APIAppIntegration from "./APIAppIntegration";
import { Order, User, Product } from "../types";

interface AdminPortalProps {
  orders: Order[];
  onAddSimulatedOrder: (order: Order) => void;
  products: Product[];
  currentUser: User;
  onLogout: () => void;
}

export default function AdminPortal({
  orders,
  onAddSimulatedOrder,
  products,
  currentUser,
  onLogout
}: AdminPortalProps) {
  const [portalTab, setPortalTab] = useState<"seller" | "developer">("seller");

  const handleGoToStore = () => {
    // Navigate back to storefront
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background visual accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* PORTAL HEADER */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 py-4 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Portal Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm uppercase tracking-wider text-amber-400">
                  SYSTEM ADMINISTRATION
                </span>
                <span className="text-[9px] uppercase font-black text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.5 rounded animate-pulse">
                  SECURE NODE
                </span>
              </div>
              <h1 className="text-base font-black text-white leading-none mt-0.5 tracking-tight">
                Cổng Đối Tác & Quản Trị Buyplay Store
              </h1>
            </div>
          </div>

          {/* Tab selectors inside Header */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setPortalTab("seller")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-black text-xs transition-colors cursor-pointer ${
                portalTab === "seller"
                  ? "bg-slate-800 text-amber-400 border border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Bán Hàng & Kho Key</span>
            </button>
            <button
              onClick={() => setPortalTab("developer")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-black text-xs transition-colors cursor-pointer ${
                portalTab === "developer"
                  ? "bg-slate-800 text-amber-400 border border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Tích Hợp API Python</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGoToStore}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all cursor-pointer text-slate-200 hover:scale-[1.02]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay Lại Shop</span>
            </button>
          </div>

        </div>
      </header>

      {/* MAIN PORTAL SPACE */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Anti-Scam Security Notice */}
        <div className="bg-slate-900 border border-slate-800 p-4.5 rounded-2xl mb-8 flex items-start gap-3.5 text-left shadow-lg">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-wide">Cảnh báo bảo mật hệ thống</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Trang web quản trị này được thiết kế tách biệt hoàn toàn dành riêng cho Chủ cửa hàng (Seller) và Lập trình viên API (Developer). Không có bất cứ liên kết công khai nào từ trang web bán hàng của khách tới đây. Kiểm soát chặt chẽ các thông số giao dịch, không tiết lộ đường liên kết quản lý này ra công chúng.
            </p>
          </div>
        </div>

        {portalTab === "seller" ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-left shadow-xl animate-fade-in text-slate-100">
            <div className="border-b border-slate-800 pb-5 mb-6">
              <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest bg-amber-950 border border-amber-800/40 px-2.5 py-1 rounded-full inline-block">
                Seller Control Room
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                Bảng Điều Khiển Quản Lý Bán Hàng & Cấp Phát
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Kiểm duyệt lượng doanh số, đơn hàng giả lập, phân tích biểu đồ lợi nhuận, và cấu hình danh mục chìa khóa game an toàn.
              </p>
            </div>
            
            <div className="text-slate-800 bg-white p-6 rounded-2xl">
              <SellerDashboard
                orders={orders}
                onAddSimulatedOrder={onAddSimulatedOrder}
                products={products}
              />
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-left shadow-xl animate-fade-in">
            <div className="border-b border-slate-800 pb-5 mb-6">
              <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest bg-amber-950 border border-amber-800/40 px-2.5 py-1 rounded-full inline-block">
                Developer Integration Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                Trung Tâm Tài Liệu & API Khóa HWID Python
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Tài liệu tích hợp code Python, thư viện kiểm tra KEY thời gian thực, cơ chế khóa máy (Hardware Lock HWID ID) tối tân.
              </p>
            </div>
            
            <div className="text-slate-800 bg-white p-6 rounded-2xl">
              <APIAppIntegration />
            </div>
          </div>
        )}

      </main>

      {/* PORTAL FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-slate-500 text-[11px] font-semibold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <p>© {new Date().getFullYear()} Buyplay Store Admin Portal. Bản quyền bảo mật 256-bit.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Hệ thống trực tuyến an toàn. Đứng lớp bởi Affitor AI.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
