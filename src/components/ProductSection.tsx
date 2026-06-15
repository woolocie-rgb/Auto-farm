import React, { useState, useEffect } from "react";
import { Product, User, Order } from "../types";
import { PRODUCTS_DATA, DRIP_EMAILS_DATA } from "../data";
import { 
  Zap, Copy, Star, ShoppingCart, ShieldCheck, Mail, 
  QrCode, Download, RefreshCw, Send, CheckCircle2, ChevronRight, Check, CheckCircle
} from "lucide-react";

interface ProductSectionProps {
  products: Product[];
  searchQuery: string;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  user: User;
  onOpenAuth: () => void;
  onOrderCompleted: (order: Order) => void;
  onUpdateBalance: (newBalance: number) => void;
}

export default function ProductSection({
  products,
  searchQuery,
  activeCategory,
  setActiveCategory,
  user,
  onOpenAuth,
  onOrderCompleted,
  onUpdateBalance,
}: ProductSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [buyerContact, setBuyerContact] = useState("");
  const [paymentOption, setPaymentOption] = useState<"banking" | "momo" | "balance">("banking");
  const [paymentStep, setPaymentStep] = useState<"details" | "scanning" | "success">("details");
  const [tempDeliveredKey, setTempDeliveredKey] = useState("");
  const [copiedText, setCopiedText] = useState(false);
  const [sentEmailSimStatus, setSentEmailSimStatus] = useState(false);
  const [simulatedTxId, setSimulatedTxId] = useState("");
  const [simulatingPayment, setSimulatingPayment] = useState(false);

  // Filter products by category (fish, class, teleport) and searchQuery
  const filteredProducts = products.filter((p) => {
    // If activeCategory is fish, we check if it has "câu cá"
    // If class, we check if "lớp học" or "trả lời"
    // If teleport, we check if "dịch chuyển" or "tốc độ"
    let matchesCategory = true;
    if (activeCategory === "fish") {
      matchesCategory = p.features.some(f => f.toLowerCase().includes("câu cá") || f.toLowerCase().includes("cá"));
    } else if (activeCategory === "class") {
      matchesCategory = p.features.some(f => f.toLowerCase().includes("học") || f.toLowerCase().includes("trả lời") || f.toLowerCase().includes("thi"));
    } else if (activeCategory === "teleport") {
      matchesCategory = p.features.some(f => f.toLowerCase().includes("dịch chuyển") || f.toLowerCase().includes("tốc độ") || f.toLowerCase().includes(" bypass"));
    }

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenBuyModal = (prod: Product) => {
    setSelectedProduct(prod);
    setBuyerContact(user.isLoggedIn ? user.phoneNumberOrEmail : "");
    setPaymentStep("details");
    setTempDeliveredKey("");
    setSentEmailSimStatus(false);
    setSimulatingPayment(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleInitQR = () => {
    if (!buyerContact) {
      alert("Vui lòng nhập Email hoặc SĐT của bạn để nhận Key và hướng dẫn!");
      return;
    }

    if (paymentOption === "balance") {
      if (!user.isLoggedIn) {
        alert("Vui lòng đăng nhập tài khoản của bạn để sử dụng số dư thanh toán!");
        onOpenAuth();
        return;
      }
      if (user.balance < selectedProduct!.price) {
        alert(`Số dư hiện tại của bạn không đủ để thanh toán sản phẩm này!\nYêu cầu: ${selectedProduct!.price.toLocaleString("vi-VN")} đ\nSố dư của bạn: ${user.balance.toLocaleString("vi-VN")} đ\n\nHướng dẫn: Bạn hãy nhấp vào Số dư ở góc trên cùng để NẠP GIẢ LẬP hoàn toàn miễn phí cực nhanh!`);
        return;
      }

      // Deduct balance
      onUpdateBalance(user.balance - selectedProduct!.price);

      // Trigger success immediately
      setTimeout(() => {
        handleManualConfirmSuccess();
      }, 300);
      return;
    }

    setPaymentStep("scanning");

    // Automatically trigger simulated success verify after 3 seconds, or let the user click
    setSimulatingPayment(true);
  };

  const handleManualConfirmSuccess = () => {
    if (!selectedProduct) return;
    setSimulatingPayment(false);
    
    // Generate high fidelity cheat key
    const randomPart1 = Math.random().toString(36).substring(3, 8).toUpperCase();
    const randomPart2 = Math.random().toString(36).substring(4, 9).toUpperCase();
    const generatedKey = `BUYPLAY-VIP-${selectedProduct.id.split("-")[1].toUpperCase()}-${randomPart1}-${randomPart2}`;
    
    const newTxId = "BP" + Math.floor(100000 + Math.random() * 900000);
    setSimulatedTxId(newTxId);
    setTempDeliveredKey(generatedKey);
    setPaymentStep("success");

    // Fire success call-back
    const newOrder: Order = {
      id: newTxId,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      price: selectedProduct.price,
      keyDelivered: generatedKey,
      status: "success",
      timestamp: new Date().toLocaleTimeString("vi-VN") + " " + new Date().toLocaleDateString("vi-VN"),
      buyerEmail: buyerContact,
      paymentMethod: paymentOption,
    };
    onOrderCompleted(newOrder);
  };

  // Simulating the automatic payment hook if simulatingPayment is true
  useEffect(() => {
    let timeout: any;
    if (simulatingPayment && paymentStep === "scanning") {
      timeout = setTimeout(() => {
        handleManualConfirmSuccess();
      }, 3500); // 3.5 seconds auto-success simulator
    }
    return () => clearTimeout(timeout);
  }, [simulatingPayment, paymentStep]);

  return (
    <div className="bg-white text-slate-800 py-12" id="products-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="mb-8 pb-4 border-b border-slate-100 text-left">
          <div>
            <div className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Giao Key Tự Động Uy Tín Sau 5 Giây</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Bảng Gói VIP Key Play Together
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Vui lòng chọn thời hạn Key phù hợp với nhu cầu cày cuốc ngôi sao của quý khách.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
            <p className="text-slate-505 text-slate-500 text-sm">Không tìm thấy gói Key nào chứa tính năng &ldquo;<span className="text-emerald-600 font-bold">{searchQuery}</span>&rdquo;.</p>
            <button
              onClick={() => {
                setActiveCategory("all");
              }}
              className="mt-4 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer"
            >
              Xem toàn bộ các gói
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
              const isLifetime = p.id === "pt-lifetime";
              const isBestSeller = p.id === "pt-30days";

              return (
                <div
                  key={p.id}
                  id={`product-card-${p.id}`}
                  className={`bg-white border text-left rounded-3xl p-5 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                    isBestSeller 
                      ? "ring-2 ring-emerald-500 border-emerald-400 shadow-md shadow-emerald-500/5" 
                      : isLifetime 
                        ? "border-amber-300 bg-gradient-to-b from-amber-50/20 to-white" 
                        : "border-slate-200 shadow-sm"
                  }`}
                >
                  {/* Ribbons / Badges */}
                  {isBestSeller && (
                    <span className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                      MUA NHIỀU NHẤT ⭐
                    </span>
                  )}
                  {isLifetime && (
                    <span className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                      SIÊU VIP 👑
                    </span>
                  )}

                  <div>
                    {/* Badge */}
                    <span className={`inline-block text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full border mb-3 ${
                      isLifetime 
                        ? "bg-amber-100 text-amber-800 border-amber-205" 
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      {p.id === "pt-3days" ? "Trải nghiệm" : p.id === "pt-15days" ? "Bán chuyên" : p.id === "pt-30days" ? "Chuyên nghiệp" : "Trọn đời"}
                    </span>

                    {/* Product Name */}
                    <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {p.name}
                    </h3>

                    {/* rating */}
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 pb-3 border-b border-slate-100">
                      <div className="flex text-amber-400">
                        {"★".repeat(Math.round(p.rating))}
                      </div>
                      <span className="font-bold text-slate-700">({p.rating})</span>
                      <span>•</span>
                      <span>Đã bán: <strong className="text-slate-800 font-mono font-bold">{p.soldCount} keys</strong></span>
                    </div>
                  </div>

                  {/* Pricing and Buying Action Button */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 line-through font-mono">
                          {p.originalPrice.toLocaleString("vi-VN")} đ
                        </span>
                        <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.2 rounded">
                          -{discountPercent}%
                        </span>
                      </div>
                      <div className="text-2xl font-black text-slate-900 font-mono tracking-tight mt-0.5">
                        {p.price.toLocaleString("vi-VN")} đ
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenBuyModal(p)}
                      id={`buy-btn-${p.id}`}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm hover:shadow-md ${
                        isLifetime 
                          ? "bg-amber-500 hover:bg-amber-600 text-white" 
                          : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Mua Key Tự Động</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAYMENT / CHECKOUT MODAL POPUP */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" onClick={() => setSelectedProduct(null)} />
            
            <div className="relative w-full max-w-lg bg-white border border-slate-250 rounded-3xl overflow-hidden shadow-2xl z-10 animate-scale-up text-left">
              <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-amber-500 bg-emerald-500" />
              
              {/* Modal Header */}
              <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500 animate-spin" />
                    <span>Cổng Giao Key Tự Động - Buyplay</span>
                  </h3>
                  <p className="text-xs text-slate-500">Chuyển tiền nhận Key ngay lập tức không cần quản trị duyệt</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-all cursor-pointer text-xs font-bold font-sans"
                >
                  ✕
                </button>
              </div>

              {/* STEP 1: CONFIGURE EMAIL & CHOOSE PAYMENT METHOD */}
              {paymentStep === "details" && (
                <div className="p-6 space-y-4">
                  {/* Selected Product Banner */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block mb-0.5">SẢN PHẨM SẼ MUA</span>
                      <h4 className="text-xs font-black text-slate-800">{selectedProduct.name}</h4>
                      <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Danh mục: Play Together VIP Cheat
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-slate-800 font-mono">{selectedProduct.price.toLocaleString("vi-VN")} đ</div>
                      <span className="text-[10px] text-slate-400 line-through font-mono">{(selectedProduct.originalPrice).toLocaleString("vi-VN")} đ</span>
                    </div>
                  </div>

                  {/* Customer Information Form */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                        Địa chỉ Email nhận Key (Bắt buộc) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="dien-email-cua-ban@gmail.com"
                          value={buyerContact}
                          onChange={(e) => setBuyerContact(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Hệ thống sẽ đồng thời gửi tệp tin Auto Mod và video hướng dẫn lách chống khóa ban acc đến Hòm Thư này.</p>
                    </div>

                    {/* Choose Payment Options */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Hình thức Chuyển Tiền Auto Duyệt</span>
                        {paymentOption === "balance" && user.isLoggedIn && (
                          <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Ví khả dụng: {user.balance.toLocaleString("vi-VN")} đ
                          </span>
                        )}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: "banking", name: "ATM / Vietcombank QR", label: "Tự động duyệt 24/7" },
                          { id: "momo", name: "Ví điện tử MoMo Auto", label: "Thanh toán sấm sét 24/7" },
                          { 
                            id: "balance", 
                            name: "Số Dư Tài Khoản", 
                            label: user.isLoggedIn 
                              ? `${user.balance.toLocaleString("vi-VN")} đ` 
                              : "Đăng nhập thanh toán" 
                          },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPaymentOption(opt.id as any)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              paymentOption === opt.id
                                ? "bg-emerald-50 border-emerald-450 text-emerald-950 ring-2 ring-emerald-300/35"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <span className="block text-xs font-black text-slate-800 leading-snug flex items-center gap-1">
                              {opt.id === "balance" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
                              <span>{opt.name}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-1 font-semibold">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Anti-Scam Verification Banner */}
                  <div className="text-[10.5px] text-slate-500 bg-amber-50/50 px-3.5 py-3 rounded-xl border border-amber-200 leading-normal">
                    📌 <strong>Lưu ý quan trọng</strong>: {paymentOption === "balance" 
                      ? "Bạn đang sử dụng số dư tài khoản của mình. Hệ thống sẽ tự động trừ số dư và kích hoạt giao Key tức thời, không tốn bất kỳ phí giao dịch nào."
                      : "Web chỉ cung cấp key tự động khi bạn mua và hoàn thành chuyển khoản tiền thành công. Tránh ghi sai cú pháp nội dung để hệ thống kiểm quét được ngay lập tức."}
                  </div>

                  {/* Submit Button to initiate transfer */}
                  <button
                    onClick={handleInitQR}
                    className={`w-full font-black py-3 rounded-xl text-center text-sm shadow-md transition-all cursor-pointer active:scale-95 ${
                      paymentOption === "balance"
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                    }`}
                  >
                    {paymentOption === "balance"
                      ? `Thanh Toán Bằng Số Dư • ${selectedProduct.price.toLocaleString("vi-VN")} đ`
                      : `Tiến Hành Chuyển Khoản • ${selectedProduct.price.toLocaleString("vi-VN")} đ`}
                  </button>
                </div>
              )}


              {/* STEP 2: VIETQR / MOMO GENERATION & AUTO RECEIPT CHECKER */}
              {paymentStep === "scanning" && (
                <div className="p-6 space-y-5">
                  <div className="text-center space-y-1">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                      paymentOption === "momo"
                        ? "text-rose-700 bg-rose-50 border border-rose-200"
                        : "text-emerald-700 bg-emerald-50 border border-emerald-200"
                    }`}>
                      Chờ Thanh Toán Chuyển Khoản
                    </span>
                    <h4 className="text-base font-black text-slate-800 mt-1">
                      {paymentOption === "momo"
                        ? "Quét Mã Chuyển Khoản Qua Ứng Dụng MoMo"
                        : "Quét Mã Chuyển Khoản Bằng Ứng Dụng Ngân Hàng"}
                    </h4>
                  </div>

                  {/* Main Grid: QR Left, details Right */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {/* Visual QR Simulator */}
                    <div className="relative bg-white p-2 rounded-2xl shadow-inner border border-slate-300/60 w-44 h-44 mx-auto flex items-center justify-center overflow-hidden">
                      {paymentOption === "momo" ? (
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2%7C99%7C0334410858%7CTRAN%20HUYNH%20QUOC%20LOC%7Cwoolocie%40gmail.com%7C0%7C0%7C${selectedProduct.price}%7CBP%20${selectedProduct.price}`}
                          alt="MoMo QR Code Chuyển Khoản"
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <img 
                          src={`https://img.vietqr.io/image/vietcombank-0181003622756-compact2.png?amount=${selectedProduct.price}&addInfo=BP%20${selectedProduct.price}&accountName=TRAN%20HUYNH%20QUOC%20LOC`}
                          alt="VietQR Chuyển Khoản"
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      
                      {/* Laser scanning bar effect */}
                      <div className={`absolute left-2 right-2 h-0.5 animate-bounce shadow ${
                        paymentOption === "momo" ? "bg-rose-500" : "bg-emerald-500"
                      }`} style={{ top: "10%" }} />
                    </div>

                    {/* Bank Details */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold leading-none uppercase">NHÀ THỤ HƯỞNG</span>
                        <span className={`font-extrabold ${paymentOption === "momo" ? "text-rose-700" : "text-emerald-700"}`}>
                          {paymentOption === "momo" ? "VÍ ĐIỆN TỬ MOMO" : "VIETCOMBANK (Ngân Hàng Ngoại Thương)"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold leading-none uppercase">
                          {paymentOption === "momo" ? "SỐ ĐIỆN THOẠI" : "SỐ TÀI KHOẢN"}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono font-black text-slate-900 bg-white border px-1.5 py-0.5 rounded text-[11px]">
                            {paymentOption === "momo" ? "0334410858" : "0181003622756"}
                          </span>
                          <button 
                            onClick={() => handleCopy(paymentOption === "momo" ? "0334410858" : "0181003622756")} 
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold leading-none uppercase">TÊN TÀI KHOẢN</span>
                        <span className="font-extrabold text-slate-800 uppercase">TRẦN HUỲNH QUỐC LỘC</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold leading-none uppercase">SỐ TIỀN CẦN CHUYỂN</span>
                        <span className={`font-mono font-black border px-1.5 py-0.5 rounded text-[12px] ${
                          paymentOption === "momo" 
                            ? "text-rose-600 bg-rose-50 border-rose-100" 
                            : "text-emerald-600 bg-emerald-50 border-emerald-100"
                        }`}>
                          {selectedProduct.price.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-rose-600 block font-bold leading-none uppercase">NỘI DUNG CHUYỂN KHOẢN (GHI CHÚ)</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono font-black text-red-650 text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-xs select-all">
                            BP {selectedProduct.price}
                          </span>
                          <button 
                            onClick={() => handleCopy(`BP ${selectedProduct.price}`)} 
                            className="text-red-500 hover:text-red-600 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Checking Bar */}
                  <div className={`p-3.5 rounded-xl space-y-1.5 text-center border ${
                    paymentOption === "momo" 
                      ? "bg-rose-50/50 border-rose-100" 
                      : "bg-emerald-50 border-emerald-100"
                  }`}>
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className={`w-3.5 h-3.5 animate-spin ${paymentOption === "momo" ? "text-rose-600" : "text-emerald-600"}`} />
                      <span className={`text-xs font-black ${paymentOption === "momo" ? "text-rose-900" : "text-emerald-900"}`}>
                        Đang quét giao dịch liên tục...
                      </span>
                    </div>
                    <p className={`text-[10px] max-w-sm mx-auto ${paymentOption === "momo" ? "text-rose-700/80" : "text-emerald-700/80"}`}>
                      Hệ thống đang tự giao tiếp đối soát giao dịch thời gian thực. Đơn hàng của quý khách sẽ tự động kích hoạt & cấp phát Key tức tốc ngay khi biến động số dư thành công.
                    </p>
                  </div>

                  {/* Simulation Helpers to help developer and tester confirm transfer instantly */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <p className="text-[10px] text-slate-400 text-center italic">Bạn đang thử nghiệm? Hệ thống có tính năng kiểm tra giả lập chuyển khoản ngay sau 3 giây hoặc click vào nút vàng bên dưới để thanh toán thành công lập tức:</p>
                    <button
                      onClick={handleManualConfirmSuccess}
                      className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-black py-2.5 rounded-xl cursor-pointer shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4 fill-slate-900 text-amber-300" />
                      <span>XÁC NHẬN CHUYỂN KHOẢN THÀNH CÔNG (GIẢ LẬP NHẬN TIỀN)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: TRANSACTION SUCCESS & DELIVERED KEYS */}
              {paymentStep === "success" && (
                <div className="p-6 space-y-4">
                  <div className="text-center space-y-1">
                    <div className="inline-flex py-1 px-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-full gap-1 items-center mx-auto mb-2 animate-bounce">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Xác Nhận Thành Công! Chuyển Khoản Đã Nhận</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-905 text-slate-950">Đã Phát Key Khách Hàng #{simulatedTxId}</h4>
                    <p className="text-xs text-slate-500 font-semibold">Tự động đối soát và phát Key thành công. Xin cảm ơn sự tin tưởng của bạn!</p>
                  </div>

                  {/* KEY DELIVERED DISPLAY BOX */}
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl relative">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-emerald-800 font-black tracking-wider uppercase">🔑 MÃ KEY PLAY TOGETHER CỦA BẠN</span>
                      <span className="text-[9px] bg-emerald-200 border border-emerald-300 text-emerald-900 px-2 py-0.5 rounded-full font-bold">KÍCH HOẠT OK</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-emerald-200 p-3 rounded-xl mt-2">
                      <code className="text-xs sm:text-sm font-mono text-emerald-800 break-all select-all flex-grow font-black">
                        {tempDeliveredKey}
                      </code>
                      <button
                        onClick={() => handleCopy(tempDeliveredKey)}
                        className="text-slate-400 hover:text-emerald-700 p-2 rounded-lg hover:bg-slate-50 transition-colors flex-shrink-0 cursor-pointer border border-slate-200 bg-white"
                        title="Sao chép Key"
                      >
                        {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* DOWNLOAD DIRECT LINK */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-slate-409 text-slate-500 uppercase block font-extrabold leading-none">Liên Kết Tải Game Hack Mod VIP</span>
                      <span className="text-xs text-slate-700 mt-1 font-bold block truncate max-w-[250px]">{selectedProduct.downloadUrl}</span>
                    </div>
                    <a
                      href={selectedProduct.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 px-3.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-black shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Tải Bản Mod</span>
                    </a>
                  </div>

                  {/* HIGH FIDELITY EMAIL DISCLOSURE LOGS */}
                  <div className="border border-slate-200 bg-slate-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-bold text-slate-700">Mẫu SMS / Email Xác Nhận Tự Động</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-bold bg-white border border-slate-300 px-2 py-0.5 rounded-full uppercase">ĐÃ GỬI</span>
                    </div>
                    
                    <p className="text-[10px] text-slate-500 leading-relaxed mb-2">
                      Hệ thống tự động phát thư tới email khách hàng <strong className="text-slate-800">{buyerContact}</strong> kèm cách cấu hình anti-ban:
                    </p>

                    <div className="bg-white rounded-xl p-3 border border-slate-200 font-mono text-[10px] text-slate-600 max-h-36 overflow-y-auto space-y-1 select-none">
                      <p className="text-slate-500 font-bold border-b border-slate-100 pb-1 mb-1">
                        Từ: Buyplay Auto Admin &lt;keys@buyplay.com&gt; <br />
                        Tới: {buyerContact} <br />
                        Tiêu đề: {DRIP_EMAILS_DATA[0].subject.replace("{ORDER_ID}", simulatedTxId).replace("[Buyplay]", "🔑 [Buyplay]")}
                      </p>
                      <div className="whitespace-pre-line text-slate-500 text-[9.5px] leading-relaxed pt-1">
                        {DRIP_EMAILS_DATA[0].body
                          .replace("{BUYER_EMAIL}", buyerContact)
                          .replace("{PRODUCT_NAME}", selectedProduct.name)
                          .replace("{KEY_DELIVERED}", tempDeliveredKey)
                          .replace("{DOWNLOAD_URL}", selectedProduct.downloadUrl)
                          .replace("{INSTRUCTIONS}", selectedProduct.instructions)
                        }
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSentEmailSimStatus(true)}
                      className="mt-3.5 w-full border border-slate-205 border-slate-200 hover:border-emerald-300 text-slate-505 text-slate-500 hover:text-emerald-600 font-bold py-2 rounded-xl text-center text-xs transition-colors cursor-pointer bg-white"
                    >
                      <span>{sentEmailSimStatus ? "Mã Email Xác Thực Đã Kiểm Tra Gửi Lại ✓" : "Bấm giả lập gửi kèm file bypass sang hòm thư phụ"}</span>
                    </button>
                  </div>

                  {/* Finish button */}
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 text-center rounded-xl text-xs cursor-pointer transition-all active:scale-[0.98]"
                  >
                    Hoàn Tất, Tiếp Tục Xem Cửa Hàng
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
