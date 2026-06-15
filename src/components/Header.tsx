import React, { useState, useRef, useEffect } from "react";
import { 
  Key, 
  User as UserIcon, 
  LayoutDashboard, 
  HelpCircle, 
  BookOpen, 
  LogIn, 
  LogOut, 
  ChevronDown, 
  Sparkles, 
  Coins, 
  History, 
  UserCheck, 
  Gamepad, 
  ShoppingBag, 
  Gift 
} from "lucide-react";
import { User } from "../types";

interface HeaderProps {
  user: User;
  onOpenAuth: () => void;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: "user" | "seller";
  setViewMode: (mode: "user" | "seller") => void;
  onOpenTopUp: () => void;
  onOpenInfo: () => void;
}

export default function Header({ 
  user, 
  onOpenAuth, 
  onLogout, 
  activeTab, 
  setActiveTab,
  viewMode,
  setViewMode,
  onOpenTopUp,
  onOpenInfo
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabSelect = (tabId: string) => {
    setViewMode("user"); // switch back to user console on core navigation
    setActiveTab(tabId);
    setMenuOpen(false);
    setServicesDropdownOpen(false);
    setProfileDropdownOpen(false);

    if (tabId === "products") {
      setTimeout(() => {
        const doc = document.getElementById("products-section");
        if (doc) doc.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 text-slate-800 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 h-20 gap-3">
          
          {/* Logo & Branding - Custom designed vector inspired by Image 4 */}
          <div 
            onClick={() => handleTabSelect("products")}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            {/* Image 4 custom representation: Rounded square, AUTO text, Blue sky background, trolley image */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-slate-100 shadow-md overflow-hidden flex flex-col items-center justify-between p-1 group-hover:scale-105 transition-transform duration-200">
              {!logoError ? (
                <img 
                  src="/logo.png" 
                  onError={() => setLogoError(true)} 
                  className="absolute inset-0 w-full h-full object-cover z-20" 
                  referrerPolicy="no-referrer" 
                  alt="Shop Logo" 
                />
              ) : null}
              {/* Cloud back shape */}
              <div className="absolute top-1 left-2 w-7 h-3 bg-white/20 rounded-full blur-xs" />
              
              {/* AUTO Badge */}
              <div className="bg-amber-800/80 text-[10px] font-black text-amber-100 px-1.5 py-0.2 rounded-md tracking-wider shadow-sm uppercase z-10 scale-90 leading-none">
                AUTO
              </div>

              {/* Shopping Cart Icon representing Image 4 shopping girl trolley */}
              <div className="text-white z-10 translate-y-0.5">
                <ShoppingBag className="w-5 h-5 text-white drop-shadow" />
              </div>

              {/* "PLAY TOGETHER" ribbon styled tag at bottom */}
              <div className="bg-amber-900 text-white font-mono text-[7px] font-black w-full text-center py-0.5 uppercase tracking-tighter leading-none z-10 rounded-b-xl border-t border-white/10">
                PLAY TOGETHER
              </div>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent uppercase">
                  Buyplay Store
                </span>
                <span className="text-[8px] uppercase font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                  Fruit v2
                </span>
              </div>
              <p className="text-[9.5px] text-slate-400 font-bold hidden sm:block leading-none mt-0.5">
                Giải Pháp Cấp Key Auto Mua Quả Nông Sản Số 1 Kaia Island
              </p>
            </div>
          </div>

          {/* Desktop Navigation Menus */}
          <nav className="hidden md:flex items-center gap-1">
            {/* TRANG CHỦ */}
            <button
              onClick={() => handleTabSelect("products")}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === "products" && viewMode === "user"
                  ? "bg-emerald-50 text-emerald-750 text-emerald-600 border border-emerald-100 shadow-sm"
                  : "text-slate-650 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/20"
              }`}
            >
              Trang Chủ
            </button>

            {/* DỊCH VỤ KHÁC (Dropdown) */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  servicesDropdownOpen || ["affiliate", "blind-bag"].includes(activeTab)
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "text-slate-650 text-slate-500 hover:text-emerald-700 hover:bg-slate-50"
                }`}
              >
                <span>Dịch Vụ Khác</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fade-in text-left">
                  {/* Option 1: Hoa Hồng */}
                  <button
                    onClick={() => {
                      setViewMode("user"); // Show affiliate on main user modes too
                      setActiveTab("affiliate");
                      setServicesDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 text-left transition-colors cursor-pointer"
                  >
                    <Coins className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Hoa Hồng CTV</span>
                  </button>

                  {/* Option 2: Mua Key */}
                  <button
                    onClick={() => handleTabSelect("products")}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 text-left transition-colors cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Mua Key Auto VIP</span>
                  </button>

                  {/* Option 3: Bốc Túi Mù */}
                  <button
                    onClick={() => {
                      setViewMode("user");
                      setActiveTab("blind-bag");
                      setServicesDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-sm">🎁</span>
                    <span className="font-extrabold text-rose-600">Bốc Túi Mù May Mắn</span>
                  </button>
                </div>
              )}
            </div>

            {/* LỊCH SỬ MUA (Purchase History) */}
            <button
              onClick={() => handleTabSelect("purchase-history")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === "purchase-history"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm"
                  : "text-slate-650 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/25"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Lịch Sử Mua</span>
            </button>
          </nav>

          {/* Account Profile element (Boy winking avatar from Image 1, username & Red Balance display) */}
          <div className="flex items-center gap-3">
            {user.isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                {/* Image 1 inspired Profile Button layout with red balance with red underline */}
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-0 md:gap-3 bg-transparent md:bg-white hover:bg-slate-50 border-0 md:border md:border-slate-200 p-0 md:p-2 md:pr-4 rounded-full md:rounded-2xl shadow-none md:shadow-sm transition-all text-left group cursor-pointer"
                >
                  {/* Winking Boy Custom SVG Avatar representing Image 1 precisely */}
                  <div className="relative w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center overflow-hidden border border-emerald-300 shadow-sm shrink-0">
                    {!avatarError ? (
                      <img 
                        src="/avatar.png" 
                        onError={() => setAvatarError(true)} 
                        className="absolute inset-0 w-full h-full object-cover z-20" 
                        referrerPolicy="no-referrer" 
                        alt="User Profile" 
                      />
                    ) : null}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Sky-blue circle background is already the wrapper, render character */}
                      <g id="boy-character">
                        {/* Hoodie Collar (Grey) */}
                        <path d="M 30,85 L 70,85 L 60,100 L 40,100 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                        <circle cx="50" cy="94" r="3" fill="#ffffff" />
                        
                        {/* Neck */}
                        <rect x="44" y="65" width="12" height="15" fill="#fef08a" />
                        
                        {/* Yellow Head Face Shape fill */}
                        <circle cx="50" cy="48" r="26" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
                        
                        {/* Winking Boy Specs and Hair */}
                        {/* Hair block (dark brown hair spike) */}
                        <path d="M 26,38 C 26,24 38,20 50,22 C 62,20 74,24 74,38 C 65,30 55,32 50,35 C 45,32 35,30 26,38 Z" fill="#451a03" />
                        <path d="M 45,22 L 52,12 L 55,22 Z" fill="#451a03" /> {/* top head hair spike */}

                        {/* Eyebrows */}
                        <path d="M 34,35 Q 38,32 42,35" stroke="#451a03" strokeWidth="2" fill="none" />
                        <path d="M 58,35 Q 62,32 66,35" stroke="#451a03" strokeWidth="2" fill="none" />

                        {/* Big Thick Glasses Frame representing Image 1 */}
                        {/* Left frame */}
                        <rect x="30" y="38" width="16" height="12" rx="3" fill="none" stroke="#1e293b" strokeWidth="3.5" />
                        {/* Right frame */}
                        <rect x="54" y="38" width="16" height="12" rx="3" fill="none" stroke="#1e293b" strokeWidth="3.5" />
                        {/* Glass bridge */}
                        <line x1="46" y1="44" x2="54" y2="44" stroke="#1e293b" strokeWidth="3.5" />

                        {/* Eyes inside glasses - Left Eye: Regular open, Right Eye: Winking wink curve */}
                        {/* Left eye: Small dark dot */}
                        <circle cx="38" cy="44" r="2.5" fill="#1e293b" />
                        {/* Right eye: Winking curve */}
                        <path d="M 59,44 Q 62,47 65,44" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

                        {/* Cute Smile */}
                        <path d="M 46,60 Q 50,65 54,60" stroke="#ca8a04" strokeWidth="2" fill="none" />
                      </g>
                    </svg>
                  </div>

                  {/* Info Column containing Username and Red Underlined Balance like Image 1 */}
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs sm:text-[13px] font-black text-slate-800 leading-none group-hover:text-emerald-600 transition-colors">
                      {user.phoneNumberOrEmail.split("@")[0]}
                    </span>
                    <span className="text-red-500 text-xs sm:text-[13.5px] font-black font-mono leading-none mt-1 border-b-2 border-red-500 border-dashed w-max inline-block">
                      {user.balance.toLocaleString("vi-VN")} đ
                    </span>
                  </div>

                  {/* Dropdown Indicator */}
                  <ChevronDown className={`hidden md:block w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Profile actions Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2.5 z-50 animate-fade-in text-left">
                    {/* Mobile user details with red balance */}
                    <div className="block md:hidden px-4 py-3 bg-slate-50 border-b border-slate-100 rounded-t-2xl -mt-2.5 mb-2">
                      <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Tài khoản</p>
                      <p className="text-xs font-black text-slate-800 truncate">{user.phoneNumberOrEmail}</p>
                      
                      <div className="mt-2 pt-2 border-t border-slate-200/60">
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Số dư tài khoản</p>
                        <span className="text-red-500 text-sm font-black font-mono leading-none mt-1 border-b-2 border-red-500 border-dashed w-max inline-block">
                          {user.balance.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </div>

                    {/* Desktop user detail header */}
                    <div className="hidden md:block px-4 py-1.5 border-b border-slate-100 mb-1">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase">Tài khoản</p>
                      <p className="text-xs font-bold text-slate-700 truncate">{user.phoneNumberOrEmail}</p>
                    </div>

                    {/* MOBILE QUICK NAVIGATION MENU */}
                    <div className="md:hidden border-b border-slate-100 pb-1.5 mb-1.5 space-y-0.5">
                      <div className="px-4 py-1">
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Điều hướng menu</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          handleTabSelect("products");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-650 text-slate-650 hover:text-emerald-600 hover:bg-emerald-50 text-left transition-colors cursor-pointer"
                      >
                        <span className="text-sm shrink-0">🏠</span>
                        <span>Trang Chủ (Bảng Giá)</span>
                      </button>

                      <button
                        onClick={() => {
                          handleTabSelect("purchase-history");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-650 text-slate-650 hover:text-emerald-600 hover:bg-emerald-50 text-left transition-colors cursor-pointer"
                      >
                        <span className="text-sm shrink-0">🔑</span>
                        <span>Lịch Sử Mua Key VIP</span>
                      </button>

                      <button
                        onClick={() => {
                          handleTabSelect("blind-bag");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-650 text-slate-650 hover:text-emerald-600 hover:bg-emerald-50 text-left transition-colors cursor-pointer"
                      >
                        <span className="text-sm shrink-0">🎁</span>
                        <span className="text-rose-605 text-rose-600 font-black">Bốc Túi Mù May Mắn</span>
                      </button>

                      <button
                        onClick={() => {
                          handleTabSelect("affiliate");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-650 text-slate-650 hover:text-emerald-600 hover:bg-emerald-50 text-left transition-colors cursor-pointer"
                      >
                        <span className="text-sm shrink-0">💸</span>
                        <span>Hoa Hồng CTV</span>
                      </button>
                    </div>

                    {/* Common actions */}
                    <button
                      onClick={() => {
                        onOpenTopUp();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 text-left transition-colors cursor-pointer"
                    >
                      <span className="text-emerald-500 text-sm">🏧</span>
                      <span>Nạp tiền ATM</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenInfo();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 text-left transition-colors cursor-pointer"
                    >
                      <span className="text-emerald-500 text-sm">ℹ️</span>
                      <span>Thông Tin Dịch Vụ</span>
                    </button>

                    <div className="border-t border-slate-100 my-1.5" />

                    {/* Đăng Xuất */}
                    <button
                      onClick={() => {
                        onLogout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-extrabold text-rose-600 hover:bg-rose-50 text-left transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Đăng Xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white bg-emerald-500 hover:bg-emerald-600 text-xs font-black hover:scale-102 transition-all cursor-pointer shadow"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
            )}

            {/* Mobile burger toggle menu */}
            {!user.isLoggedIn && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none rounded-xl border border-slate-200 shrink-0"
              >
                <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-5 space-y-1 shadow-md animate-fade-in text-left">
          
          <div className="py-2 font-bold text-xxs uppercase text-slate-400 tracking-wider">Danh mục chính</div>
          <button
            onClick={() => handleTabSelect("products")}
            className="w-full text-left font-black text-xs text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-50 block"
          >
            Trang Chủ (Bảng Giá)
          </button>
          
          <div className="h-px bg-slate-100 my-1" />
          
          <div className="py-1 font-bold text-xxs uppercase text-slate-400 tracking-wider px-4">Dịch Vụ Khác</div>
          
          <button
            onClick={() => handleTabSelect("affiliate")}
            className="w-full text-left font-bold text-xs text-emerald-600 py-2.5 px-4 rounded-xl hover:bg-emerald-50 flex items-center gap-2"
          >
            💸 Hoa Hồng CTV
          </button>
          
          <button
            onClick={() => handleTabSelect("blind-bag")}
            className="w-full text-left font-bold text-xs text-rose-600 py-2.5 px-4 rounded-xl hover:bg-rose-50 flex items-center gap-2"
          >
            🎁 Bốc Túi Mù May Mắn
          </button>

          <button
            onClick={() => handleTabSelect("purchase-history")}
            className="w-full text-left font-bold text-xs text-slate-705 text-slate-700 py-2.5 px-4 rounded-xl hover:bg-slate-50 flex items-center gap-2"
          >
            🔑 Lịch Sử Giao Dịch
          </button>

          <div className="border-t border-slate-100 pt-3 mt-3">
            {user.isLoggedIn ? (
              <div className="space-y-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center text-xs">
                  <span className="text-slate-550 text-slate-550 font-medium">Số dư khả dụng:</span>
                  <span className="font-mono font-black text-red-550 text-red-650 text-red-650">{user.balance.toLocaleString("vi-VN")} đ</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onOpenTopUp();
                      setMenuOpen(false);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black py-2 rounded-xl text-center"
                  >
                    Nạp Tiền ATM
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMenuOpen(false);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-2 rounded-xl text-center"
                  >
                    Đăng Xuất
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMenuOpen(false);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black py-2.5 rounded-xl text-center"
              >
                Đăng Nhập / Đăng Ký
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
