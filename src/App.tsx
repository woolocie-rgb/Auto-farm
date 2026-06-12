import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductSection from "./components/ProductSection";
import CommissionCalculator from "./components/CommissionCalculator";
import TutorialHub from "./components/TutorialHub";
import ConversionBoard from "./components/ConversionBoard";
import SellerDashboard from "./components/SellerDashboard";
import AuthModal from "./components/AuthModal";
import BlindBag from "./components/BlindBag";
import PurchaseHistory from "./components/PurchaseHistory";
import TopUpModal from "./components/TopUpModal";
import APIAppIntegration from "./components/APIAppIntegration";
import { PRODUCTS_DATA } from "./data";
import { User, Order } from "./types";
import { ShieldCheck, Heart, Sparkles, Star, Info, X } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab ] = useState<string>("products");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  
  // Dual-mode console tracker
  const [viewMode, setViewMode] = useState<"user" | "seller">("user");
  
  // Custom pre-populated orders for intuitive testing experience
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "O-9184",
      productId: "pt-fruit-30days",
      productName: "Key VIP Auto Mua Quả Trong Shop - Gói 30 Ngày",
      price: 100000,
      keyDelivered: "BUYPLAY-VIP-30DAYS-AJKX91",
      status: "success",
      timestamp: "2026-06-10 18:30:22",
      buyerEmail: "woolocie@gmail.com",
      paymentMethod: "banking",
    },
    {
      id: "O-8212",
      productId: "pt-fruit-3days",
      productName: "Key VIP Auto Mua Quả Trong Shop - Gói 3 Ngày",
      price: 15000,
      keyDelivered: "BUYPLAY-VIP-3DAYS-KLZX82",
      status: "success",
      timestamp: "2026-06-11 02:15:10",
      buyerEmail: "woolocie@gmail.com",
      paymentMethod: "momo",
    }
  ]);

  // Default logged-in user with VNĐ budget balance
  const [user, setUser] = useState<User>({
    phoneNumberOrEmail: "woolocie@gmail.com",
    referralCode: "AFF-WOOLO",
    referralEarnings: 2450000,
    isLoggedIn: true,
    balance: 0, // start with 0 VNĐ as requested in Image 1
  });

  const handleOpenAuth = () => {
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    setUser({
      phoneNumberOrEmail: "",
      referralEarnings: 0,
      isLoggedIn: false,
      balance: 0,
    });
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser({
      ...loggedInUser,
      balance: loggedInUser.balance ?? 0,
    });
    if (loggedInUser.isAdmin) {
      setViewMode("seller");
      setActiveTab("sales-mgmt");
    }
  };

  const handleUpdateBalance = (newBalance: number) => {
    setUser(prev => ({ ...prev, balance: newBalance }));
  };

  const handleAddKeyToHistory = (keyData: { productName: string; keyDelivered: string; price: number }) => {
    const randomId = "O-" + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: randomId,
      productId: "lucky-bag",
      productName: keyData.productName,
      price: keyData.price,
      keyDelivered: keyData.keyDelivered,
      status: "success",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      buyerEmail: user.phoneNumberOrEmail || "woolocie@gmail.com",
      paymentMethod: "banking",
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Synchronize to full-stack backend HWID lock database
    let tier = "15days";
    if (keyData.productName.includes("30 Ngày") || keyData.productName.includes("30")) {
      tier = "30days";
    } else if (keyData.productName.includes("Vĩnh Viễn") || keyData.productName.includes("lifetime") || keyData.productName.includes("SIÊU TÚI")) {
      tier = "lifetime";
    }
    fetch("/api/keys/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: keyData.keyDelivered,
        tier,
        buyerEmail: user.phoneNumberOrEmail || "woolocie@gmail.com"
      })
    }).catch(err => console.error("Error sending key to server:", err));
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    
    // Synchronize to full-stack backend HWID lock database
    let tier = "15days";
    if (newOrder.productId.includes("30") || newOrder.productName.includes("30")) {
      tier = "30days";
    } else if (newOrder.productId.includes("3day") || newOrder.productName.includes("3")) {
      tier = "3days";
    } else if (newOrder.productId.includes("lifetime") || newOrder.productName.includes("Vĩnh")) {
      tier = "lifetime";
    }
    
    fetch("/api/keys/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: newOrder.keyDelivered,
        tier,
        buyerEmail: newOrder.buyerEmail || user.phoneNumberOrEmail || "woolocie@gmail.com"
      })
    }).catch(err => console.error("Error sending key to server:", err));
    
    // Add referral earnings if the buyer used affiliate
    if (newOrder.referralCommissionAmount) {
      setUser((prev) => {
        if (prev.isLoggedIn) {
          return {
            ...prev,
            referralEarnings: prev.referralEarnings + (newOrder.referralCommissionAmount || 0),
          };
        }
        return prev;
      });
    }
  };

  const handleAddSimulatedOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleExploreKeys = () => {
    setViewMode("user");
    setActiveTab("products");
    setTimeout(() => {
      const doc = document.getElementById("products-section");
      if (doc) {
        doc.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleJoinAffiliate = () => {
    setViewMode("seller");
    setActiveTab("sales-mgmt");
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      
      {/* Playful Theme Ambient Soft Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[45%] left-[-100px] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 1. HEADER */}
      <Header
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenTopUp={() => setIsTopUpOpen(true)}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      {/* 2. MAIN LAYOUT AND CORE TABS */}
      <main className="flex-grow">
        
        {/* VIEWMODE 1: USER CONSOLE */}
        {viewMode === "user" && (
          <div className="space-y-12 pb-16">
            
            {/* TAB: PRODUCTS (TRANG CHỦ / MUA KEY) */}
            {activeTab === "products" && (
              <>
                <Hero
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onExploreKeys={handleExploreKeys}
                  onJoinAffiliate={handleJoinAffiliate}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
                
                <ProductSection
                  products={PRODUCTS_DATA}
                  searchQuery={searchQuery}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  user={user}
                  onOpenAuth={handleOpenAuth}
                  onOrderCompleted={handleOrderCompleted}
                  onUpdateBalance={handleUpdateBalance}
                />

                {/* Hiển thị mục Xé túi mù ra ngoài trang chủ và đặt cách chơi là vòng quay may mắn */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 border-t border-slate-100" id="lucky-wheel-section">
                  <BlindBag
                    balance={user.balance}
                    onUpdateBalance={handleUpdateBalance}
                    onAddKeyToHistory={handleAddKeyToHistory}
                  />
                </div>
              </>
            )}

            {/* TAB: BLIND-BAG (BỐC TÚI MÙ) */}
            {activeTab === "blind-bag" && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <BlindBag
                  balance={user.balance}
                  onUpdateBalance={handleUpdateBalance}
                  onAddKeyToHistory={handleAddKeyToHistory}
                />
              </div>
            )}

            {/* TAB: PURCHASE SPECIFIC HISTORY (LỊCH SỬ MUA) */}
            {activeTab === "purchase-history" && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <PurchaseHistory
                  orders={orders}
                  currentUserEmail={user.phoneNumberOrEmail}
                />
              </div>
            )}

            {/* TAB: KẾT NỐI API PYTHON */}
            {activeTab === "api-integration" && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <APIAppIntegration />
              </div>
            )}

            {/* TAB: EXPOSED AFFILIATE (HOA HỒNG CTV ON USER VIEW) */}
            {activeTab === "affiliate" && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-left">
                <div className="border-b border-emerald-200 pb-6">
                  <span className="text-emerald-750 text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full w-max">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cổng tiếp thị chia sẻ hoa hồng v2.5</span>
                  </span>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    Không Gian Đối Tác Tiếp Thị Liên Kết
                  </h1>
                  <p className="text-slate-500 text-sm mt-1 max-w-2xl font-medium leading-relaxed">
                    Nhập mã đối tác của bạn và giới thiệu phần mềm cho người chơi khác ở đảo Kaia để kiếm Hoa hồng chiết khấu cực ưu đãi, thanh toán rút nhanh tức tốc!
                  </p>
                </div>

                <ConversionBoard
                  user={user}
                  onOpenAuth={handleOpenAuth}
                  orders={orders}
                />
              </div>
            )}
            
          </div>
        )}

        {/* VIEWMODE 2: SELLER CONSOLE */}
        {viewMode === "seller" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            
            {activeTab === "sales-mgmt" && (
              <SellerDashboard
                orders={orders}
                onAddSimulatedOrder={handleAddSimulatedOrder}
                products={PRODUCTS_DATA}
              />
            )}

            {activeTab === "affiliate" && (
              <div className="space-y-12 text-left">
                <div className="border-b border-emerald-200 pb-6">
                  <span className="text-emerald-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full w-max">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Không gian đối tác Buyplay v2.5</span>
                  </span>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    Không Gian Đối Tác Tiếp Thị Liên Kết
                  </h1>
                  <p className="text-slate-500 text-sm mt-1 max-w-2xl font-medium leading-relaxed font-semibold">
                    Nơi quản lý giới thiệu nhận hoa hồng cực cao khi cộng tác phân phối Key Auto Mua Quả Play Together. Xem báo cáo lượt click, doanh số và hoa hồng tức tốc.
                  </p>
                </div>

                <ConversionBoard
                  user={user}
                  onOpenAuth={handleOpenAuth}
                  orders={orders}
                  isSeller={true}
                />

                <CommissionCalculator
                  products={PRODUCTS_DATA}
                  user={user}
                  onOpenAuth={handleOpenAuth}
                />
              </div>
            )}

          </div>
        )}
      </main>

      {/* 3. FOOTER & COMPLIANCE DISCLOSURE */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-10 mt-auto text-left relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-200">
            {/* Brand Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black text-base shadow shadow-emerald-500/10">
                  BP
                </div>
                <span className="font-extrabold text-slate-900 tracking-wider">BUYPLAY STORE</span>
              </div>
              <p className="text-[11px] leading-relaxed font-semibold text-slate-500">
                Cổng phân phối Key Auto Mua Quả trong Shop Play Together tự động, bảo mật và cực nhạy. Hệ thống phục vụ 24/7 tức tốc qua VietQR và MoMo.
              </p>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-3">Tìm nhanh các mục</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
                <button onClick={() => { setViewMode("user"); setActiveTab("products"); }} className="text-left text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer">🎫 Bảng Giá Key</button>
                <button onClick={() => { setViewMode("seller"); setActiveTab("sales-mgmt"); }} className="text-left text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer">📊 Quản Trị Seller</button>
                <button onClick={() => { setViewMode("user"); setActiveTab("blind-bag"); }} className="text-left text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer">🎁 Chơi Bốc Túi Mù</button>
                <button onClick={() => setIsAuthOpen(true)} className="text-left text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer">🔓 Kích Hoạt OTP</button>
              </div>
            </div>

            {/* Guarantee badge */}
            <div>
              <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-3">Thông điệp cốt lõi Buyplay</h4>
              <p className="text-[11px] leading-relaxed font-semibold">
                Sản phẩm của chúng tôi luôn đi đầu về cơ chế Bypass bảo mật chống quét khóa tài khoản Play Together cao cấp từ Haegin. Bảo hành một đổi một trọn thời hạn.
              </p>
            </div>
          </div>

          {/* FTC Disclosure text for general compliance */}
          <div className="pt-8 text-center space-y-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-[10.5px] text-slate-500 leading-relaxed text-left max-w-4xl mx-auto">
              🟢 <strong>Công bố bảo mật & chính sách hoạt động tự động</strong>: Toàn bộ quá trình quét ngân hàng MB Bank/Momo và giao Key tại Shop Buyplay được tích hợp API tự động 24/7/365. Hệ thống hoàn tất kiểm tra và gửi mã Key kích hoạt lên màn hình cùng SMS hòm thư của bạn tức thì ngay khi tài khoản ngân hàng nhận tiền chuyển khoản thành công.
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
              <p>© {new Date().getFullYear()} Buyplay Store. Phát triển dành riêng cho cộng đồng Play Together.</p>
              <div className="flex items-center gap-1 font-semibold text-slate-400">
                <span>Thiết lập cho</span>
                <span className="font-extrabold text-emerald-500">Buyplay</span>
                <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" />
                <span>bởi robot Affitor AI.</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 4. MODALS AND DRAWERS CONTAINER */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {isTopUpOpen && (
        <TopUpModal
          onClose={() => setIsTopUpOpen(false)}
          onAddFunds={(amount) => handleUpdateBalance(user.balance + amount)}
        />
      )}

      {isInfoOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div onClick={() => setIsInfoOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-slate-200 p-6 animate-scale-up">
              <button onClick={() => setIsInfoOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full cursor-pointer">
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <Info className="w-6 h-6" />
                <h3 className="font-black text-lg text-slate-900">Thông Tin Dịch Vụ Buyplay</h3>
              </div>
              
              <div className="space-y-3.5 text-xs text-slate-600 text-left">
                <p>🚀 <strong>Phiên Bản Phần Mềm</strong>: Buyplay Auto Fruit Client v2.55 Build 901 chính thức.</p>
                <p>📋 <strong>Tính năng chính</strong>: Bỏ qua hội thoại NPC ở cửa hàng nông sản, mua tự động tất cả loại quả tròn, bí ngô, dưa hấu, cà rốt gieo hạt gieo trồng.</p>
                <p>🔒 <strong>Cơ chế bảo mật</strong>: Nhích nhẹ tọa độ ngẫu nhiên dẹp tình trạng nghi ngờ từ server Haegin, hoàn toàn yên tâm cắm máy xuyên màn đêm.</p>
                <p>📞 <strong>Sự cố & hoàn tiền</strong>: Liên hệ CSKH qua Zalo/SDT: <span className="font-bold underline text-emerald-600 font-mono">0334410858</span> gặp Admin Woolocie để được giải quyết tức tốc 24/7.</p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setIsInfoOpen(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer"
                >
                  Xác nhận & Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
