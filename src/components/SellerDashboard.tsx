import React, { useState, useMemo } from "react";
import { Order, Product } from "../types";
import { 
  DollarSign, Calendar, TrendingUp, Search, PlusCircle, FileSpreadsheet, 
  Trash2, ShieldCheck, Gamepad2, ArrowUpRight, BarChart3, Clock, Sparkles
} from "lucide-react";

interface SellerDashboardProps {
  orders: Order[];
  onAddSimulatedOrder: (newOrder: Order) => void;
  products: Product[];
}

export default function SellerDashboard({ orders, onAddSimulatedOrder, products }: SellerDashboardProps) {
  // Local active detail tab: 'day' | 'month' | 'year'
  const [timeFilter, setTimeFilter] = useState<"day" | "month" | "year">("day");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom states for the manual order generator
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<"banking" | "momo">("banking");
  const [customDateOffset, setCustomDateOffset] = useState<"today" | "prev-days" | "prev-months">("today");

  // SEED HISTORIC SELLER DATA (to display years/months/days before)
  // This ensures there is a rich set of transactions even if the user hasn't made real purchases in the preview.
  const [historicOrders, setHistoricOrders] = useState<Order[]>([
    {
      id: "BP948210",
      productId: "pt-fruit-15days",
      productName: "Key VIP Auto Mua Quả Trong Shop - Gói 15 Ngày",
      price: 60000,
      keyDelivered: "BUYPLAY-VIP-15DAYS-90XZP-LLK19",
      status: "success",
      timestamp: "10:30 " + new Date().toLocaleDateString("vi-VN"), // Today
      buyerEmail: "game thủ cày sao hăng say <nongdanpro@gmail.com>",
      paymentMethod: "momo",
    },
    {
      id: "BP948211",
      productId: "pt-fruit-30days",
      productName: "Key VIP Auto Mua Quả Trong Shop - Gói 30 Ngày",
      price: 100000,
      keyDelivered: "BUYPLAY-VIP-30DAYS-88PPO-HJL77",
      status: "success",
      timestamp: "08:15 " + new Date().toLocaleDateString("vi-VN"), // Today
      buyerEmail: "tiệm trà sữa kaia <milktea2026@gmail.com>",
      paymentMethod: "banking",
    },
    {
      id: "BP927315",
      productId: "pt-fruit-lifetime",
      productName: "Key VIP Auto Mua Quả Trong Shop - Vĩnh Viễn",
      price: 1200000,
      keyDelivered: "BUYPLAY-VIP-LIFETIME-A99ZZ-WWQ12",
      status: "success",
      timestamp: "14:20 10/06/2026", // Yesterday
      buyerEmail: "kols top 1 youtube <nongdanvjp@gmail.com>",
      paymentMethod: "banking",
    },
    {
      id: "BP927110",
      productId: "pt-fruit-30days",
      productName: "Key VIP Auto Mua Quả Trong Shop - Gói 30 Ngày",
      price: 100000,
      keyDelivered: "BUYPLAY-VIP-30DAYS-ZXZX-1299P",
      status: "success",
      timestamp: "09:05 09/06/2026", // 2 days ago
      buyerEmail: "cô ba dọn vườn <coba33@gmail.com>",
      paymentMethod: "momo",
    },
    {
      id: "BP887212",
      productId: "pt-fruit-30days",
      productName: "Key VIP Auto Mua Quả Trong Shop - Gói 30 Ngày",
      price: 100000,
      keyDelivered: "BUYPLAY-VIP-30DAYS-FGDG-88776",
      status: "success",
      timestamp: "18:40 28/05/2026", // Last Month (May)
      buyerEmail: "clb chăm nông sỉ <nongnghiep-play@yahoo.com>",
      paymentMethod: "banking",
    },
    {
      id: "BP882199",
      productId: "pt-fruit-lifetime",
      productName: "Key VIP Auto Mua Quả Trong Shop - Vĩnh Viễn",
      price: 1200000,
      keyDelivered: "BUYPLAY-VIP-LIFETIME-FFTY-UUII9",
      status: "success",
      timestamp: "21:10 15/05/2026", // Last Month (May)
      buyerEmail: "chủ tiệm cá kaia <fish_seller@gmail.com>",
      paymentMethod: "banking",
    },
    {
      id: "BP110294",
      productId: "pt-fruit-lifetime",
      productName: "Key VIP Auto Mua Quả Trong Shop - Vĩnh Viễn",
      price: 1200000,
      keyDelivered: "BUYPLAY-VIP-LIFETIME-KJKJ-PPQQ8",
      status: "success",
      timestamp: "11:30 12/01/2026", // Previous Month (January)
      buyerEmail: "gamer_pro_viet@gmail.com",
      paymentMethod: "banking",
    }
  ]);

  // Merge runtime orders from App component with historic database orders
  const allOrders = useMemo(() => {
    return [...orders, ...historicOrders];
  }, [orders, historicOrders]);

  // CALCULATE REVENUES GROUPED BY: DAY (TODAY), MONTH (THIS MONTH), YEAR (THIS YEAR)
  // Current real-world context dates
  const todayStr = new Date().toLocaleDateString("vi-VN");
  const thisMonthStr = "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getFullYear(); // e.g. "/06/2026"
  const thisYearStr = "/" + new Date().getFullYear().toString(); // e.g. "/2026"

  // REVENUE SUMS FOR DAY, MONTH, YEAR
  const dayRevenue = useMemo(() => {
    return allOrders
      .filter(o => o.status === "success" && o.timestamp.includes(todayStr))
      .reduce((sum, o) => sum + o.price, 0);
  }, [allOrders, todayStr]);

  const monthRevenue = useMemo(() => {
    return allOrders
      .filter(o => o.status === "success" && o.timestamp.includes(thisMonthStr))
      .reduce((sum, o) => sum + o.price, 0);
  }, [allOrders, thisMonthStr]);

  const yearRevenue = useMemo(() => {
    return allOrders
      .filter(o => o.status === "success" && o.timestamp.includes(thisYearStr))
      .reduce((sum, o) => sum + o.price, 0);
  }, [allOrders, thisYearStr]);

  const totalAllTimeRevenue = useMemo(() => {
    return allOrders
      .filter(o => o.status === "success")
      .reduce((sum, o) => sum + o.price, 0);
  }, [allOrders]);

  // COUNT ORDERS GROUPED
  const dayOrdersCount = useMemo(() => {
    return allOrders.filter(o => o.status === "success" && o.timestamp.includes(todayStr)).length;
  }, [allOrders, todayStr]);

  const monthOrdersCount = useMemo(() => {
    return allOrders.filter(o => o.status === "success" && o.timestamp.includes(thisMonthStr)).length;
  }, [allOrders, thisMonthStr]);

  const yearOrdersCount = useMemo(() => {
    return allOrders.filter(o => o.status === "success" && o.timestamp.includes(thisYearStr)).length;
  }, [allOrders, thisYearStr]);

  // Filtered orders listed in the detailed transaction box
  const visibleAndFilteredOrders = useMemo(() => {
    let list = [...allOrders];

    // Filter by time tab
    if (timeFilter === "day") {
      list = list.filter(o => o.timestamp.includes(todayStr));
    } else if (timeFilter === "month") {
      list = list.filter(o => o.timestamp.includes(thisMonthStr));
    } else if (timeFilter === "year") {
      list = list.filter(o => o.timestamp.includes(thisYearStr));
    }

    // Filter by search text
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.buyerEmail.toLowerCase().includes(q) || 
        o.productName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allOrders, timeFilter, searchQuery, todayStr, thisMonthStr, thisYearStr]);

  // Helper: Create a manual custom order to simulate seller's backoffice receipts
  const handleCreateSimulatedOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail) {
      alert("Vui lòng điền Email khách hàng!");
      return;
    }

    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    // Build specialized timestamp based on simulated date offset selection
    let customTimestamp = "";
    const randHours = Math.floor(8 + Math.random() * 12).toString().padStart(2, '0');
    const randMins = Math.floor(10 + Math.random() * 45).toString().padStart(2, '0');

    if (customDateOffset === "today") {
      customTimestamp = `${randHours}:${randMins} ${new Date().toLocaleDateString("vi-VN")}`;
    } else if (customDateOffset === "prev-days") {
      // Simulate yesterday or 3 days ago
      const dayOffset = Math.floor(1 + Math.random() * 5);
      const d = new Date();
      d.setDate(d.getDate() - dayOffset);
      customTimestamp = `${randHours}:${randMins} ${d.toLocaleDateString("vi-VN")}`;
    } else {
      // Simulate months ago (e.g. Month 1, 2)
      const d = new Date();
      d.setMonth(d.getMonth() - 2);
      customTimestamp = `${randHours}:${randMins} ${d.toLocaleDateString("vi-VN")}`;
    }

    const newTxId = "BP" + Math.floor(100000 + Math.random() * 900000);
    const randomKey = `BUYPLAY-VIP-${prod.id.split("-")[2].toUpperCase()}-${Math.random().toString(36).substring(3, 8).toUpperCase()}-${Math.random().toString(36).substring(4, 9).toUpperCase()}`;

    const newOrd: Order = {
      id: newTxId,
      productId: prod.id,
      productName: prod.name,
      price: prod.price,
      keyDelivered: randomKey,
      status: "success",
      timestamp: customTimestamp,
      buyerEmail: buyerEmail,
      paymentMethod: selectedMethod,
    };

    // If offset is today, send to runtime state in App so it syncs instantly everywhere
    if (customDateOffset === "today") {
      onAddSimulatedOrder(newOrd);
    } else {
      // Otherwise prepend to our local historic simulation array
      setHistoricOrders(prev => [newOrd, ...prev]);
    }

    // Reset fields
    setBuyerEmail("");
    alert(`Đã nạp giả lập 1 đơn hàng mới (${prod.name} - ${prod.price.toLocaleString()}đ) vào cơ sở dữ liệu bán hàng thành công!`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm(`Bạn muốn hủy bản ghi đơn hàng #${orderId} khỏi hòm thư lưu trữ người bán chứ?`)) {
      setHistoricOrders(prev => prev.filter(o => o.id !== orderId));
      alert("Đã xóa bản ghi lưu trữ.");
    }
  };

  // Monthly Breakdown Data for Visual graph in Year mode
  const monthlyRevenueBreakdown = useMemo(() => {
    // Standard mock data representing this year's seasonal variation (Jan - Dec)
    const year = new Date().getFullYear();
    const months = [
      { num: "01", name: "Tháng 1", val: 3200000 },
      { num: "02", name: "Tháng 2", val: 5600000 },
      { num: "03", name: "Tháng 3", val: 4100000 },
      { num: "04", name: "Tháng 4", val: 2300000 },
      { num: "05", name: "Tháng 5", val: 7800000 },
      { num: "06", name: "Tháng 6", val: monthRevenue }, // Matches live this month total
      { num: "07", name: "Tháng 7", val: 0 },
      { num: "08", name: "Tháng 8", val: 0 },
      { num: "09", name: "Tháng 9", val: 0 },
      { num: "10", name: "Tháng 10", val: 0 },
      { num: "11", name: "Tháng 11", val: 0 },
      { num: "12", name: "Tháng 12", val: 0 },
    ];
    return months;
  }, [monthRevenue]);

  const maxMonthValue = useMemo(() => {
    const vals = monthlyRevenueBreakdown.map(m => m.val);
    return Math.max(...vals, 1000000);
  }, [monthlyRevenueBreakdown]);


  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      
      {/* SECTION BANNER - Visual Highlighting the Seller Backoffice */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-teal-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-teal-900/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[9px] bg-emerald-500/35 border border-emerald-400/40 px-3 py-1 rounded-full uppercase font-black tracking-widest text-emerald-250 text-emerald-200">
              TRÌNH QUẢN TRỊ VIÊN BÁN KEY
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-emerald-300" />
              <span>Giao Diện Monitor Người Bán (Seller Console)</span>
            </h2>
            <p className="text-xs text-emerald-100/90 max-w-2xl font-medium leading-relaxed">
              Trang riêng dành cho chủ shop điều khiển. Giúp kiểm quét dòng tiền khách thanh toán mua Key tự động treo máy dọn shop nông trại trong game. Kiểm soát doanh số đa chiều theo thời khoảng <strong>Ngày, Tháng, Năm</strong>.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center sm:text-left">
            <span className="text-[10px] text-emerald-200 block font-bold leading-none uppercase">Doanh thu trọn đời shop</span>
            <div className="text-2xl font-black font-mono tracking-tight mt-1 text-white">
              {totalAllTimeRevenue.toLocaleString("vi-VN")} đ
            </div>
            <span className="text-[9px] text-emerald-300 block mt-0.5">Thời gian thực, tự đối soát ngân hàng</span>
          </div>
        </div>
      </div>

      {/* THREE FOCUS CHANNELS GRID: DAY, MONTH, YEAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: DAY (HÔM NAY) */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-200/20 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">QUẢN LÝ THEO NGÀY</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">{todayStr}</span>
          </div>

          <span className="text-xs text-slate-400 block font-bold leading-none">Doanh Thu Trong Ngày:</span>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight mt-1">
            {dayRevenue.toLocaleString("vi-VN")}đ
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
            <div className="text-[11px] text-slate-450 text-slate-505 font-medium text-slate-500">
              Tổng số giao dịch: <strong className="text-slate-800 font-mono font-bold">{dayOrdersCount} đơn</strong>
            </div>
            <button
              onClick={() => {
                setTimeFilter("day");
                document.getElementById("tx-tabbed-box")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-[10.5px] font-black text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-0.5"
            >
              Xem chi tiết lẻ
            </button>
          </div>
        </div>

        {/* CARD 2: MONTH (THÁNG NÀY) */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-200/20 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">THỐNG KÊ THÁNG NÀY</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">06/2026</span>
          </div>

          <span className="text-xs text-slate-400 block font-bold leading-none">Doanh Thu Trong Tháng:</span>
          <div className="text-3xl font-black text-emerald-600 font-mono tracking-tight mt-1">
            {monthRevenue.toLocaleString("vi-VN")}đ
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium leading-none">
              Số lượng key bán ra: <strong className="text-slate-800 font-mono font-bold">{monthOrdersCount} đơn</strong>
            </div>
            <button
              onClick={() => {
                setTimeFilter("month");
                document.getElementById("tx-tabbed-box")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-[10.5px] font-black text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Xem tóm tắt
            </button>
          </div>
        </div>

        {/* CARD 3: YEAR (NĂM NAY) */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-200/20 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">PHÂN TÍCH NĂM</span>
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-mono">Năm 2026</span>
          </div>

          <span className="text-xs text-slate-400 block font-bold leading-none">Doanh Thu Khách Mua Hằng Năm:</span>
          <div className="text-3xl font-black text-amber-600 font-mono tracking-tight mt-1">
            {yearRevenue.toLocaleString("vi-VN")}đ
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium">
              Vượt kế hoạch: <strong className="text-emerald-600 font-bold font-mono">115.8%</strong>
            </div>
            <button
              onClick={() => {
                setTimeFilter("year");
                document.getElementById("tx-tabbed-box")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-[10.5px] font-black text-amber-600 hover:text-amber-700 hover:underline"
            >
              Vẽ biểu đồ năm
            </button>
          </div>
        </div>

      </div>

      {/* MONETARY DETAILED AND ANALYTICS ZONE GROUPED BY DATE TAB */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="tx-tabbed-box">
        
        {/* LEFT COLUMN (7 COLS): TABBED TRANSACTIONS LOGS */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            
            {/* Header selection of Day / Month / Year */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  <span>Sách Kê Giao Dịch Thu Tiền Khách</span>
                </h3>
                <p className="text-[10px] text-slate-450 text-slate-400 mt-0.5">Dòng tiền thực thu nhận từ khách mua VIP Key Play Together Auto Mua Quả</p>
              </div>

              {/* Day/Month/Year filters */}
              <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 shrink-0">
                {[
                  { id: "day", label: "Theo Ngày" },
                  { id: "month", label: "Theo Tháng" },
                  { id: "year", label: "Theo Năm" },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTimeFilter(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${
                      timeFilter === t.id
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* IF TIME FILTER == YEAR, SHOW A BEAUTIFUL ANNUAL PROGRESS BAR GRAPH FOR DAY-TO-DAY MONTHLY RECEIPTS */}
            {timeFilter === "year" && (
              <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <h4 className="text-[11px] font-extrabold uppercase text-slate-600 tracking-wider mb-3">
                  Biểu đồ phân rã doanh số 12 Tháng của Năm 2026
                </h4>
                <div className="space-y-2.5">
                  {monthlyRevenueBreakdown.map((m, idx) => {
                    const pct = maxMonthValue > 0 ? (m.val / maxMonthValue) * 100 : 0;
                    return (
                      <div key={idx} className="flex items-center text-xs">
                        <span className="w-16 font-semibold text-slate-550 text-slate-500 text-left">{m.name}</span>
                        <div className="flex-grow h-3 bg-slate-200 rounded-full overflow-hidden mx-3 relative">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-24 text-right font-mono font-bold text-slate-800">
                          {m.val > 0 ? `${m.val.toLocaleString()} đ` : "Chưa phát sinh"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SEARCH AND FILTER FIELD */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm giao dịch chi tiết theo mã đơn, email người mua hoặc tên gói..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-2 pl-10 pr-4 text-xs text-slate-800 outline-none transition-all"
              />
            </div>

            {/* TRANSACTIONS LOG TABLE */}
            <div className="overflow-x-auto min-h-[250px]">
              {visibleAndFilteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-xs">
                  Không tìm thấy lịch sử tiền khách mua ở khoảng này khớp bộ lọc của bạn.
                </div>
              ) : (
                <table className="w-full text-xs text-left text-slate-600">
                  <thead className="text-[10px] text-slate-400 uppercase font-bold border-b border-slate-100">
                    <tr>
                      <th className="py-2.5">Mã Đơn Cash-in</th>
                      <th>Gói Auto</th>
                      <th>Số Tiền Nhận</th>
                      <th>Khách Hàng Mua</th>
                      <th>Cấp Key</th>
                      <th className="text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                    {visibleAndFilteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/70">
                        <td className="py-3 font-semibold text-emerald-600">#{ord.id}</td>
                        <td className="font-sans text-slate-800 font-bold truncate max-w-[120px]" title={ord.productName}>
                          {ord.productName.replace("Key VIP Auto Mua Quả Trong Shop - ", "")}
                        </td>
                        <td className="text-emerald-600 font-extrabold font-mono text-[11px]">
                          {(ord.price).toLocaleString("vi-VN")} đ
                        </td>
                        <td className="font-sans text-slate-500 truncate max-w-[150px]" title={ord.buyerEmail}>
                          {ord.buyerEmail}
                        </td>
                        <td className="text-slate-500 text-[10px] truncate max-w-[100px]" title={ord.keyDelivered}>
                          {ord.keyDelivered}
                        </td>
                        <td className="text-right text-slate-400 font-sans">
                          <button
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer"
                            title="Xóa log lưu trữ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <span className="text-[10.5px] text-slate-400 italic">
              Hiển thị: <strong>{visibleAndFilteredOrders.length} dòng</strong> giao dịch đã tìm lọc.
            </span>
            
            <button
              onClick={() => {
                alert("Báo cáo tài chính chi tiết kết xuất dưới dạng CSV/Excel giả định đã tải thành công về thiết bị!");
              }}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-extrabold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Xuất Báo Cáo Tài Chính</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN (5 COLS): LIVE CASH-IN EMULATOR FOR DEMO & TESTING */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="border-b border-slate-200 pb-3">
              <span className="text-[9px] bg-amber-100 border border-amber-205 text-amber-800 font-bold uppercase rounded-full px-2.5 py-0.5">
                MÔ PHỎNG NẠP TIỀN
              </span>
              <h3 className="text-xs sm:text-sm font-black text-slate-800 mt-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>Nạp Giả Lập Tiền Khách Mua VIP</span>
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 max-w-sm leading-normal">
                Công cụ thử nghiệm chuyên dụng: Bật mô phỏng một khách mới nạp tiền qua hệ thống. <strong>Số dư Day/Month/Year ở bảng trái sẽ tăng tiền lập tức!</strong>
              </p>
            </div>

            <form onSubmit={handleCreateSimulatedOrder} className="space-y-3.5 text-xs text-slate-705">
              
              {/* Product selector */}
              <div>
                <label className="block text-[10.5px] font-extrabold text-slate-650 uppercase mb-1">
                  1. Gói Key Khách Mua
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-2.5 outline-none font-bold text-slate-700 shadow-sm"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name.replace("Key VIP Auto Mua Quả Trong Shop - ", "")} ({p.price.toLocaleString("vi-VN")} đ)
                    </option>
                  ))}
                </select>
              </div>

              {/* Email purchaser */}
              <div>
                <label className="block text-[10.5px] font-extrabold text-slate-650 uppercase mb-1">
                  2. Email / SĐT Khách Giả Định
                </label>
                <input
                  type="text"
                  required
                  placeholder="vi dụ: khachhangvip@gmail.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded-xl py-2 px-3 outline-none text-slate-700 shadow-sm font-mono"
                />
              </div>

              {/* Method choice */}
              <div>
                <label className="block text-[10.5px] font-extrabold text-slate-650 uppercase mb-1">
                  3. Hình Thức Thanh Toán
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "banking", name: "MB Bank ATM" },
                    { id: "momo", name: "Ví MoMo" },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedMethod(item.id as any)}
                      className={`py-1.5 rounded-lg border text-center transition-all cursor-pointer font-bold text-[10.5px] ${
                        selectedMethod === item.id 
                          ? "bg-slate-900 text-white border-slate-900" 
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time simulated offset */}
              <div>
                <label className="block text-[10.5px] font-extrabold text-slate-650 uppercase mb-1">
                  4. Thời Điểm Khơi Tạo Thống Kê
                </label>
                <div className="flex flex-col gap-1.5 bg-white border border-slate-200 p-2.5 rounded-xl text-[11px] font-medium">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="offset" 
                      checked={customDateOffset === "today"} 
                      onChange={() => setCustomDateOffset("today")}
                      className="accent-emerald-500"
                    />
                    <span>Hôm nay (Tính vào Doanh thu Ngày/Tháng/Năm)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="offset" 
                      checked={customDateOffset === "prev-days"} 
                      onChange={() => setCustomDateOffset("prev-days")}
                      className="accent-emerald-500"
                    />
                    <span>Cách đây ít ngày (Tính vào Tháng/Năm)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="offset" 
                      checked={customDateOffset === "prev-months"} 
                      onChange={() => setCustomDateOffset("prev-months")}
                      className="accent-emerald-500"
                    />
                    <span>Cách đây 2 tháng (Chuyển dòng tiền sang Năm)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-slate-905" />
                <span>NẠP LỆNH GIẢ LẬP GIAO DỊCH &rarr;</span>
              </button>

            </form>
          </div>

          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-450 leading-relaxed text-slate-400 italic">
            💡 Lưu ý: Trình giả lập này hoàn tất chuỗi thao tác online, cấp phát mã key, gửi thư giả lập tới khách chỉ qua vài lượt click chuột rảnh rỗi.
          </div>
        </div>

      </div>

    </div>
  );
}
