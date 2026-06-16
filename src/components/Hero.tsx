import React from "react";
import { Sparkles, Zap, ShieldCheck, Headphones, Gamepad2, Search, ArrowRight, Star, Heart } from "lucide-react";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExploreKeys: () => void;
  onJoinAffiliate: () => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export default function Hero({
  searchQuery,
  setSearchQuery,
  onExploreKeys,
  onJoinAffiliate,
  activeCategory,
  setActiveCategory,
}: HeroProps) {
  const [bannerError, setBannerError] = React.useState(false);

  const categories = [
    { id: "all", name: "⭐️ Tất cả gói VIP", count: 4 },
    { id: "fruit", name: "🍎 Auto Mua Quả Tròn Shop", count: 3 },
    { id: "seed", name: "🌱 Auto Mua Hạt Giống & Gieo Trồng", count: 1 },
  ];

  return (
    <section className="relative overflow-hidden bg-emerald-50/15 py-10 sm:py-16 border-b border-slate-100">
      {/* Background Ornaments - Soft emerald transparent accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Core Request: Remove Text Heading Image 3 and Replace with Image 2 Panel */}
        <div 
          className={`max-w-5xl mx-auto mb-10 overflow-hidden rounded-3xl shadow-xl bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100 relative select-none group ${
            !bannerError 
              ? "w-full" 
              : "border-4 border-emerald-300 min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-4 sm:p-6"
          }`}
          style={!bannerError ? { aspectRatio: "1024 / 576" } : undefined}
        >
          {!bannerError ? (
            <img 
              src="/banner.png" 
              onError={() => setBannerError(true)} 
              className="absolute inset-0 w-full h-full object-cover z-20 cursor-pointer hover:scale-[1.01] transition-transform duration-300"
              onClick={onExploreKeys}
              referrerPolicy="no-referrer"
              alt="Farm Banner"
            />
          ) : null}
          
          {/* Sunny Sky Background Decoration & Sun */}
          <div className="absolute top-10 right-16 w-16 h-16 bg-yellow-100/60 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -top-4 left-1/4 w-32 h-32 bg-sky-100/40 rounded-full blur-2xl pointer-events-none" />
          
          {/* Custom cartoon clouds wrapping around */}
          <div className="absolute top-12 left-8 bg-white/70 w-28 h-8 rounded-full blur-[1px] opacity-80" />
          <div className="absolute top-6 right-24 bg-white/60 w-36 h-10 rounded-full blur-sm opacity-90" />

          {/* BACKGROUND LANDSCAPE GARDEN ASSETS representing Orchard/Farm */}
          {/* Apple Tree Orchards (Left & Right - back layer) */}
          <div className="absolute bottom-16 -left-4 w-40 h-40 bg-emerald-600/80 rounded-full flex flex-wrap p-4 items-center gap-3 opacity-90 pointer-events-none">
            <span className="text-red-500 text-xs drop-shadow animate-pulse">🍎</span>
            <span className="text-red-500 text-xs drop-shadow">🍎</span>
            <span className="text-red-500 text-sm drop-shadow">🍎</span>
          </div>
          <div className="absolute bottom-20 -right-6 w-48 h-48 bg-emerald-600/70 rounded-full flex flex-wrap p-4 items-center gap-3 opacity-95 pointer-events-none">
            <span className="text-red-500 text-sm drop-shadow">🍎</span>
            <span className="text-yellow-550 text-amber-400 text-xs animate-bounce">🌽</span>
            <span className="text-red-550 text-red-600 text-xs drop-shadow">🍎</span>
          </div>

          {/* Fence illustration layer */}
          <div className="absolute bottom-12 left-0 right-0 h-4 bg-amber-950/20 border-y border-white/10 pointer-events-none" />
          
          {/* Ground patch with carrots and tomatoes icons growing */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-emerald-700/90 flex justify-around items-center px-4">
            <span className="text-xl animate-bounce duration-1000">🥕</span>
            <span className="text-xl">🍅</span>
            <span className="text-xl animate-pulse">🥕</span>
            <span className="text-xl">🍅</span>
            <span className="text-xl">🍅</span>
            <span className="text-xl animate-bounce duration-700">🥕</span>
          </div>

          {/* TOP INNER BAR: PLAY TOGETHER LOGO & SHOP BUYPLAY WOOD RIBBON */}
          <div className="flex items-start justify-between relative z-10 w-full">
            
            {/* Play Together Logo Badge (Red rectangular badge with white text, orange VNG icon) */}
            <div className="bg-red-600 border-2 border-white px-2.5 py-1.5 rounded-xl shadow-md rotate-[-4deg] flex flex-col items-center">
              <span className="font-extrabold text-[15px] sm:text-lg text-white font-sans tracking-tighter leading-none drop-shadow">
                PLAY
              </span>
              <div className="flex items-center gap-0.5">
                <span className="font-semibold text-[8px] sm:text-[9.5px] text-white bg-amber-500 px-1 py-0.2 rounded-md leading-none uppercase font-mono">
                  TOGETHER
                </span>
                <span className="text-[6px] text-white/90 bg-red-800 px-0.8 py-0.1 rounded font-black">VNG</span>
              </div>
            </div>

            {/* Shop Buyplay Wooden Ribbon Banner (Centered top right) */}
            <div className="relative shadow-lg transform rotate-[2deg] mr-2">
              <div className="absolute -inset-1 bg-yellow-950/30 rounded-full blur-xs" />
              {/* Main ribbon shape */}
              <div className="relative bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 border-3 border-amber-900 px-6 py-2 rounded-2xl flex items-center justify-center">
                {/* Visual wood nodes */}
                <div className="absolute left-2 w-1 h-1 bg-amber-900 rounded-full opacity-60" />
                <div className="absolute right-3 w-1.5 h-1.5 bg-amber-900 rounded-full opacity-40" />
                <span className="font-black text-sm sm:text-base text-amber-950 tracking-wide font-sans uppercase">
                  ⭐ SHOP BUYPLAY ⭐
                </span>
              </div>
            </div>

          </div>

          {/* MIDDLE ROW: HAPPY FARMER GIRL NPC & THE CENTRAL WOODEN SIGNBOARD "TỰ ĐỘNG MUA QUẢ" */}
          <div className="grid grid-cols-12 gap-2 relative z-10 w-full h-full my-auto items-center">
            
            {/* Left Col (4/12): Cute Farmer Girl (Pure CSS & Avatar details representing Image 2 girl precisely) */}
            <div className="col-span-4 flex justify-start items-center relative pl-2 h-40">
              
              {/* Left farm girl composite graphic avatar */}
              <div className="relative w-32 h-36 group-hover:scale-105 transition-transform duration-300">
                {/* Twin dark brown hair buns */}
                <div className="absolute -top-1 left-2 w-8 h-8 rounded-full bg-stone-900 border border-stone-850 shadow" />
                <div className="absolute -top-1 right-8 w-8 h-8 rounded-full bg-stone-900 border border-stone-850 shadow" />
                
                {/* Farmer hat (straw colored) optional overlay or hair fringe */}
                <div className="absolute top-4 left-5 w-24 h-24 rounded-full bg-stone-900 border border-stone-950" />
                
                {/* Face Container */}
                <div className="absolute top-8 left-9 w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-805 border-yellow-800 shadow-inner flex flex-col justify-between p-1">
                  
                  {/* Hair bangs overlay */}
                  <div className="absolute -top-1.5 left-0 right-0 h-4 bg-stone-900 rounded-b-xl" />

                  {/* Huge anime eyes (cute dark-brown eyes with white glow sparkles) */}
                  <div className="flex justify-between px-1.5 mt-3.5 relative z-10">
                    <div className="w-4.5 h-4.5 w-4 h-4 rounded-full bg-stone-950 flex items-center justify-center relative">
                      <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
                    </div>
                    <div className="w-4.5 h-4.5 w-4 h-4 rounded-full bg-stone-950 flex items-center justify-center relative">
                      <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
                    </div>
                  </div>

                  {/* Cute rosy blush cheeks and mouth */}
                  <div className="flex justify-between items-center px-2 mt-0.5 relative z-10">
                    <span className="w-2 h-1.5 bg-pink-400/60 rounded-full" />
                    {/* Smiling lips */}
                    <span className="w-3 h-2 border-b-2 border-red-500 rounded-full" />
                    <span className="w-2 h-1.5 bg-pink-400/60 rounded-full" />
                  </div>
                </div>

                {/* Overalls and Checkered green shirt underneath */}
                <div className="absolute bottom-1.5 left-8 w-18 w-20 h-20 bg-emerald-600 border-t-2 border-amber-900 rounded-full p-2 flex flex-col items-center">
                  {/* Brown overall straps */}
                  <div className="flex justify-between w-full px-2.5">
                    <div className="w-2.5 h-12 bg-amber-900 border-x border-amber-950" />
                    <div className="w-2.5 h-12 bg-amber-900 border-x border-amber-950" />
                  </div>
                  {/* Checkered print effect inside collar */}
                  <div className="absolute top-0 w-10 h-3.5 bg-emerald-500 border border-emerald-400 grid grid-cols-4" />
                </div>

                {/* Key detail string hanging from the overalls strap */}
                <div className="absolute bottom-6 left-12 bg-amber-400 p-0.5 rounded-full shadow border border-amber-600 text-[8px] font-black tracking-tighter z-20 animate-wiggle">
                  🔑 Key
                </div>

                {/* Waving hand gesturing toward the sign */}
                <div className="absolute top-12 right-2 w-8 h-6 bg-amber-100 border border-yellow-800 rounded-full flex items-center justify-center shadow-sm hover:rotate-6 cursor-pointer" title="Chào bạn!">
                  👋
                </div>
              </div>

            </div>

            {/* Right/Center Col (8/12): The Wooden Signboard "TỰ ĐỘNG MUA QUẢ" and Fruit Sack */}
            <div className="col-span-8 flex justify-center items-center">
              
              {/* Outer wooden board shadow */}
              <div 
                onClick={onExploreKeys}
                className="bg-amber-100 border-4 border-amber-950 px-6 py-4 rounded-3xl relative w-full max-w-[380px] text-center shadow-2xl hover:scale-[1.03] transition-transform duration-300 cursor-pointer text-slate-800 group"
              >
                {/* Wood grains detail background */}
                <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-yellow-900 via-amber-950 to-stone-900 rounded-2xl pointer-events-none" />

                {/* Structural elements: Two heavy wooden sign posts underneath */}
                <div className="absolute -bottom-8 left-12 w-4 h-8 bg-amber-950/80 rounded" />
                <div className="absolute -bottom-8 right-12 w-4 h-8 bg-amber-950/80 rounded" />

                {/* Sign Board Content Grid: Sack on Left, Large text on Right */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  
                  {/* Sack / Fruit Basket icon vector (3/12 cols) */}
                  <div className="col-span-4 flex flex-col items-center justify-center bg-amber-50 rounded-2xl p-2.5 border-2 border-amber-950 relative shadow-inner">
                    {/* Tiny visual fruits */}
                    <div className="flex gap-0.5 mb-1 text-base">
                      <span>🍎</span>
                      <span>🍇</span>
                      <span>🍋</span>
                    </div>
                    {/* Burlap Sack brown bottom */}
                    <div className="w-10 h-10 bg-amber-600 border-2 border-amber-950 rounded-b-xl rounded-t-lg shadow flex items-center justify-center font-black text-amber-100 italic text-[9px] leading-tight">
                      Sack
                    </div>
                    {/* Apple icon dropped on wood floor */}
                    <span className="absolute -bottom-2 -right-1.5 text-xs drop-shadow">🍎</span>
                  </div>

                  {/* Main Action Labels representing precise Image 2 typography */}
                  <div className="col-span-8 text-left space-y-1">
                    <div className="text-amber-900 border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase rounded w-max tracking-wide">
                      MÃ HOÁ BYPASS
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-amber-950 leading-tight tracking-tight uppercase">
                      Tự Động <br />
                      <span className="bg-gradient-to-r from-red-650 to-orange-650 from-red-600 to-orange-600 bg-clip-text text-transparent">
                        Mua Quả
                      </span>
                    </h3>
                    <p className="text-[10px] text-amber-800 font-extrabold leading-none">
                      Trong Shop Nông Trại 24/7
                    </p>
                  </div>

                </div>

                {/* Decorative golden star sparkles */}
                <Sparkles className="absolute -top-3 -right-3 w-7 h-7 text-amber-500 fill-amber-300 animate-spin" />
              </div>

            </div>

          </div>

          {/* BOTTOM INNER BAR CAPSULE: CSKH HELPLINE TELEPHONE */}
          <div className="flex justify-center relative z-20 w-full mt-4 sm:mt-1">
            <div className="bg-white border-2 border-amber-900 rounded-full px-5 py-2.5 flex items-center justify-center gap-2.5 shadow-md max-w-sm w-full">
              <div className="w-6 h-6 rounded-full bg-amber-105 bg-amber-100 flex items-center justify-center text-amber-950 shrink-0">
                <Headphones className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-xs sm:text-sm text-slate-800">
                CSKH: <span className="bg-amber-100 text-amber-900 font-mono px-2 py-0.5 rounded-md font-black">0344920065</span> Mỹ Hạnh
              </span>
            </div>
          </div>

        </div>

        {/* Platform Core Pillars Stats */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 px-4 sm:px-0">
          {[
            { label: "Giao Dịch Thành Công", val: "9,850+ Key", desc: "Phát trực tiếp online tức thì 100%", icon: Zap, color: "text-emerald-500 bg-emerald-50" },
            { label: "Tốc Độ Cấp Key", val: "Dưới 5 giây", desc: "Sau khi hệ thống nhận được tiền chuyển", icon: ShieldCheck, color: "text-teal-650 text-teal-600 bg-teal-50" },
            { label: "Bảo Mật Bypass", val: "Anti-Ban Tuyệt Đối", desc: "Mã hóa chống phát hiện Haegin", icon: Star, color: "text-amber-500 bg-amber-50" },
            { label: "Chăm Sóc Khách Hàng", val: "Hỗ Trợ 24/7 Zalo", desc: "Xử lý hỗ trợ điều chỉnh kịch bản", icon: Headphones, color: "text-rose-500 bg-rose-50" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-100 hover:border-emerald-300 transition-all shadow-sm hover:shadow-md p-5 rounded-2xl text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-500">{stat.label}</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{stat.val}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{stat.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
