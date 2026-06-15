import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Code, 
  ArrowLeft, 
  ShieldCheck, 
  Landmark,
  Check,
  X,
  RefreshCw,
  Cpu,
  Clock,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import SellerDashboard from "./SellerDashboard";
import APIAppIntegration from "./APIAppIntegration";
import { Order, User, Product } from "../types";
import { 
  getLocalDeposits, 
  saveLocalDeposits, 
  getLocalUsers, 
  saveLocalUsers,
  LocalDepositRecord 
} from "../utils/dbFallback";

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
  const [portalTab, setPortalTab] = useState<"seller" | "developer" | "deposits">("seller");
  const [depositsList, setDepositsList] = useState<LocalDepositRecord[]>([]);
  const [isLoadingDeposits, setIsLoadingDeposits] = useState(false);

  useEffect(() => {
    fetchDepositsList();
  }, [portalTab]);

  const fetchDepositsList = async () => {
    setIsLoadingDeposits(true);
    let done = false;
    try {
      const res = await fetch("/api/deposits");
      const data = await res.json();
      if (data.success) {
        setDepositsList(data.deposits);
        done = true;
      }
    } catch (err) {
      console.warn("API deposits fetch failed, using local offline records:", err);
    } finally {
      if (!done) {
        setDepositsList(getLocalDeposits());
      }
      setIsLoadingDeposits(false);
    }
  };

  const handleApproveDeposit = async (id: string, userPhoneOrEmail: string, amount: number) => {
    if (!window.confirm(`Bạn có chắc chắn muốn DUYỆT nạp ${amount.toLocaleString("vi-VN")} đ cho tài khoản ${userPhoneOrEmail}?`)) {
      return;
    }

    // Update Local fallback
    try {
      const localD = getLocalDeposits();
      const idx = localD.findIndex(d => d.id === id);
      if (idx !== -1 && localD[idx].status === "pending") {
        localD[idx].status = "approved";
        localD[idx].processedAt = new Date().toISOString();
        saveLocalDeposits(localD);

        const localUsers = getLocalUsers();
        const uIdx = localUsers.findIndex(u => u.phoneNumberOrEmail.trim().toLowerCase() === userPhoneOrEmail.trim().toLowerCase());
        if (uIdx !== -1) {
          localUsers[uIdx].balance += amount;
          saveLocalUsers(localUsers);
        }
      }
    } catch (err) {
      console.error("Local fallback approve deposit failed:", err);
    }

    // Update via live Node API
    try {
      const res = await fetch("/api/deposits/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      alert(data.message || "Duyệt cộng tiền thành công!");
    } catch (err) {
      console.warn("Node app approval failed, recorded inside offline store.", err);
      alert("Kết nối Node Server tạm gián đoạn. Giao dịch đã được duyệt offline trên trình duyệt!");
    } finally {
      fetchDepositsList();
    }
  };

  const handleRejectDeposit = async (id: string, userPhoneOrEmail: string, amount: number) => {
    if (!window.confirm(`Bạn có muốn HUỶ BỎ yêu cầu nạp ${amount.toLocaleString("vi-VN")} đ của tài khoản ${userPhoneOrEmail}?`)) {
      return;
    }

    // Update local fallback
    try {
      const localD = getLocalDeposits();
      const idx = localD.findIndex(d => d.id === id);
      if (idx !== -1 && localD[idx].status === "pending") {
        localD[idx].status = "rejected";
        localD[idx].processedAt = new Date().toISOString();
        saveLocalDeposits(localD);
      }
    } catch (e) {
      console.error(e);
    }

    // Node API
    try {
      const res = await fetch("/api/deposits/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      alert(data.message || "Đã từ chối lệnh nạp tiền!");
    } catch (err) {
      console.warn("Node API reject error:", err);
      alert("Đã từ chối giao dịch cục bộ thành công!");
    } finally {
      fetchDepositsList();
    }
  };

  const pendingCount = depositsList.filter(d => d.status === "pending").length;

  const handleGoToStore = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background visual accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* PORTAL HEADER */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 py-4 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          
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
          <div className="flex flex-wrap items-center justify-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setPortalTab("seller")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-xs transition-colors cursor-pointer ${
                portalTab === "seller"
                  ? "bg-slate-800 text-amber-400 border border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Bán Hàng & Kho Key</span>
            </button>

            <button
              onClick={() => setPortalTab("deposits")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-xs transition-colors cursor-pointer relative ${
                portalTab === "deposits"
                  ? "bg-slate-800 text-amber-400 border border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Duyệt Nạp Số Dư</span>
              {pendingCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full px-1.5 py-0.5 text-[8px] font-black animate-pulse border border-slate-950">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setPortalTab("developer")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-xs transition-colors cursor-pointer ${
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
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-8 flex items-start gap-3 text-left shadow-lg">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-wide leading-none">kiểm duyệt giao dịch tài chính</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              Quy trình đối soát số dư: Khách gửi đúng nội dung chuyển khoản, kiểm tra trong sao kê ZaloPay/Vietcombank đối soát với mã nạp đúng cú pháp rồi ấn <strong>"Duyệt nạp"</strong> để kích hoạt. Tuyệt đối không duyệt bừa bãi tránh gian lận doanh thu.
            </p>
          </div>
        </div>

        {portalTab === "seller" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-left shadow-xl animate-fade-in text-slate-100">
            <div className="border-b border-slate-800 pb-5 mb-6">
              <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest bg-amber-950 border border-amber-800/40 px-2.5 py-1 rounded-full inline-block">
                Seller Control Room
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                Bảng Điều Khiển Quản Lý Bán Hàng & Cặp Phát
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
        )}

        {portalTab === "deposits" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-left shadow-xl animate-fade-in">
            <div className="border-b border-slate-800 pb-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest bg-amber-950 border border-amber-800/40 px-2.5 py-1 rounded-full inline-block">
                  Finances & Credit Control
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                  Duyệt Lệnh Nạp Tiền Tài Khoản (Cộng Số Dư)
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Danh sách yêu cầu nạp tiền gửi lên bởi khách hàng. Lựa chọn Duyệt hoặc Từ chối thủ công sau khi đã kiểm tra tài khoản nhận thực tế.
                </p>
              </div>

              <button
                onClick={fetchDepositsList}
                disabled={isLoadingDeposits}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold p-2.5 rounded-xl text-xs transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoadingDeposits ? "animate-spin" : ""}`} />
                <span>{isLoadingDeposits ? "Đang tải..." : "Tải Lại Giao Dịch"}</span>
              </button>
            </div>

            {isLoadingDeposits && depositsList.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                <span>Đang kết nối cơ sở dữ liệu đối soát giao dịch...</span>
              </div>
            ) : depositsList.length === 0 ? (
              <div className="py-12 text-center text-slate-500 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/40">
                <p className="font-bold text-sm">Chưa có giao dịch nạp tiền nào được tạo!</p>
                <p className="text-xs text-slate-400 mt-1">Các yêu cầu nạp tiền từ MoMo hay Ngân Hàng của khách hàng sẽ gom hiển thị tại đây.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Stats cards for deposits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-black uppercase">Đang Chờ Duyệt (Pending)</div>
                      <div className="text-xl font-mono font-black text-amber-400 mt-1">{pendingCount} yêu cầu</div>
                    </div>
                    <Clock className="w-8 h-8 text-amber-500/30" />
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-black uppercase">Đã Duyệt nạp (Approved)</div>
                      <div className="text-xl font-mono font-black text-emerald-400 mt-1">
                        {depositsList.filter(d => d.status === "approved").length} giao dịch
                      </div>
                    </div>
                    <UserCheck className="w-8 h-8 text-emerald-500/30" />
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-black uppercase">Tổng Tiền Đã Duyệt</div>
                      <div className="text-xl font-mono font-black text-white mt-1">
                        {depositsList
                          .filter(d => d.status === "approved")
                          .reduce((sum, d) => sum + d.amount, 0)
                          .toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                    <Landmark className="w-8 h-8 text-slate-500/30" />
                  </div>
                </div>

                {/* Table list */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
                          <th className="py-3 px-4">Mã Nạp</th>
                          <th className="py-3 px-4">Tài Khoản</th>
                          <th className="py-3 px-4 text-right">Số Tiền</th>
                          <th className="py-3 px-4">Hình Thức</th>
                          <th className="py-3 px-4">Cú Pháp Ghi Chú (Memo)</th>
                          <th className="py-3 px-4 text-center">Trạng Thái</th>
                          <th className="py-3 px-4 text-center">Hành Động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {depositsList.map((dep) => (
                          <tr key={dep.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-black text-amber-400 select-all">
                              {dep.id}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-white max-w-[150px] truncate">
                              {dep.phoneNumberOrEmail}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-400 text-[13px]">
                              {dep.amount.toLocaleString("vi-VN")} đ
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                                dep.paymentMethod === "qr" 
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800" 
                                  : dep.paymentMethod === "momo" 
                                    ? "bg-rose-950 text-rose-400 border border-rose-800" 
                                    : "bg-slate-900 text-slate-400"
                              }`}>
                                {dep.paymentMethod === "qr" ? "VietQR" : dep.paymentMethod === "momo" ? "MoMo" : "Simulator"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                              {dep.memo}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {dep.status === "pending" && (
                                <span className="bg-amber-950 text-amber-400 border border-amber-800/60 px-2 py-1 rounded-full text-[9px] font-black uppercase inline-flex items-center gap-1 animate-pulse">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>Chờ Duyệt</span>
                                </span>
                              )}
                              {dep.status === "approved" && (
                                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-1 rounded-full text-[9px] font-black uppercase inline-flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5" />
                                  <span>Thành Công</span>
                                </span>
                              )}
                              {dep.status === "rejected" && (
                                <span className="bg-red-950 text-red-400 border border-red-800/40 px-2 py-1 rounded-full text-[9px] font-black uppercase inline-flex items-center gap-1">
                                  <X className="w-2.5 h-2.5" />
                                  <span>Đã Hủy</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {dep.status === "pending" ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleApproveDeposit(dep.id, dep.phoneNumberOrEmail, dep.amount)}
                                    className="bg-emerald-650 hover:bg-emerald-700 text-white font-black px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition-all cursor-pointer flex items-center gap-0.5"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Duyệt ✔</span>
                                  </button>
                                  <button
                                    onClick={() => handleRejectDeposit(dep.id, dep.phoneNumberOrEmail, dep.amount)}
                                    className="bg-red-650 hover:bg-red-700 text-white font-black px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition-all cursor-pointer flex items-center gap-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>Hủy ✖</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-bold">
                                  {dep.processedAt ? new Date(dep.processedAt).toLocaleString("vi-VN") : "Đã xử lý"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {portalTab === "developer" && (
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
            <span>Hệ thống trực tuyến an toàn. Được nâng cấp bảo mật với khóa nạp.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
