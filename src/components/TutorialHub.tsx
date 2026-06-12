import React, { useState } from "react";
import { Tutorial, Product, User } from "../types";
import { TUTORIALS_DATA } from "../data";
import { 
  BookOpen, Eye, Clock, ShieldAlert, Sparkles, Plus, Check, 
  ArrowRight, Copy, RefreshCw, Send
} from "lucide-react";

interface TutorialHubProps {
  user: User;
  onOpenAuth: () => void;
  products: Product[];
}

export default function TutorialHub({ user, onOpenAuth, products }: TutorialHubProps) {
  const [tutorials, setTutorials] = useState<Tutorial[]>(TUTORIALS_DATA);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [activeTab, setActiveTab ] = useState<"browse" | "writer">("browse");

  // How-To Writer States
  const [targetProduct, setTargetProduct] = useState<Product>(products[0]);
  const [affiliateLink, setAffiliateLink] = useState(
    user.isLoggedIn ? `https://buyplay.com/ref=${user.referralCode}` : "https://buyplay.com/ref=AFF_TEMP"
  );
  const [tone, setTone] = useState("thuyet-phuc");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState("");
  const [copiedWriterText, setCopiedWriterText] = useState(false);

  React.useEffect(() => {
    if (user.isLoggedIn) {
      setAffiliateLink(`https://buyplay.com/ref=${user.referralCode}`);
    }
  }, [user]);

  const handleGenerateArticle = () => {
    setIsGenerating(true);
    setGeneratedResult("");

    setTimeout(() => {
      let intro = "";
      if (tone === "thuyet-phuc") {
        intro = `### 🎣 Bí Mật Câu Trọn Bộ Sưu Tập Cá Vương Miện Siêu To trong Play Together bằng ${targetProduct.name}\nNếu bạn đang chật vật bị đứt dây câu hoặc canh hụt bóng 5 mỏi mắt, ${targetProduct.name} chính là trợ thủ đắc lực không thể thiếu của bạn. Đột phá tỷ lệ câu dính bóng hiếm 100%!`;
      } else if (tone === "ky-thuat") {
        intro = `### ⚙️ Hướng dẫn cách cài đặt và cấu hình anti-ban Haegin với ${targetProduct.name}\nMột hướng dẫn chuyên môn chi tiết giúp bạn căn chỉnh thời gian giật cần ngẫu nhiên từ 1.5 - 2.8 giây, kèm thiết lập dịch chuyển và mô phỏng click như người thật để bảo vệ tài khoản Play Together của bạn vĩnh viễn khỏi mọi đợt quét.`;
      } else {
        intro = `### 🎁 Săn Giftcode Play Together & Giảm Giá Hot Bản Quyền của ${targetProduct.name}\nBật mí đợt tặng quà độc quyền dành cho quý game thủ ngày hôm nay tại Buyplay. Sở hữu ngay Key VIP chính chủ mướt mượt, sướng rơn!`;
      }

      const body = `
#### 📌 Các bước chuẩn bị và kích hoạt Key Auto sấm sét:
1. **Bước 1**: Truy cập tải trực tiếp phiên bản Cheat Tool chuẩn an toàn từ link của đại lý: [Bấm Để Tải Về Trực Tiếp 🔽](${affiliateLink})
2. **Bước 2**: Khởi động trò chơi Play Together kết hợp bật Tool lên.
3. **Bước 3**: Sao chép mã Key VIP đã mua tự động từ Buyplay dán vào hộp thoại kích hoạt trực tuyến.
4. **Bước 4**: Tận hưởng đặc quyền lọc bóng 5, auto câu cá vương miện giật cần hoàn hảo 24/7!

#### 🌟 Bản chất vip của ${targetProduct.name} có gì?
${targetProduct.features.map((f) => `- *${f}*`).join("\n")}

### 📢 LỜI KHUYÊN BẢO MẬT
Để tránh bị dính virus bẻ khóa hoặc lừa đảo mất tài khoản, bạn hãy luôn tải file chính thống trực tiếp từ liên kết phân phối ủy quyền: [MUA KEY AUTO BẢN QUYỀN TẠI BUYPLAY](${affiliateLink}).`;

      const finalContent = `${intro}\n${body}`;
      setGeneratedResult(finalContent);
      setIsGenerating(false);

      const titleToneStr = tone === "thuyet-phuc" ? "Bí kíp lọc cá hiếm" : tone === "ky-thuat" ? "Thông số lách ban" : "Săn mã voucher";
      const newTutorial: Tutorial = {
        id: "generated-" + Math.floor(Math.random() * 1000),
        title: `[Do bạn tạo] ${titleToneStr} Play Together với ${targetProduct.name}`,
        slug: "auto-generated-tutorial-" + targetProduct.id,
        category: "Đại lý cộng tác",
        summary: `Bài hướng dẫn cách ứng dụng và thiết lập thông số ${targetProduct.name} do máy tính tự động dệt giúp bạn đi seeding.`,
        content: finalContent,
        readTime: "3 phút đọc",
        views: 29,
        hasAffiliateDisclosure: true,
      };

      setTutorials((prev) => [newTutorial, ...prev]);
    }, 1800);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopiedWriterText(true);
    setTimeout(() => setCopiedWriterText(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto shadow-sm text-left">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-4">
        <div>
          <span className="text-sky-600 text-xs font-black uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Thư Viện Hướng Dẫn & Tài Liệu Hack Mod</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            Cẩm Nang Cài Đặt & Seeding Cộng Tác Viên
          </h3>
        </div>

        {/* Toggles */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => {
              setActiveTab("browse");
              setSelectedTutorial(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === "browse" ? "bg-white text-sky-600 shadow-sm" : "text-slate-550 text-slate-500 hover:text-slate-800"
            }`}
          >
            Đọc Hướng Dẫn
          </button>
          <button
            onClick={() => {
              setActiveTab("writer");
              setSelectedTutorial(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === "writer" ? "bg-white text-sky-600 shadow-sm" : "text-slate-550 text-slate-500 hover:text-slate-800"
            }`}
          >
            Viết Bài Seeding Tự Động
          </button>
        </div>
      </div>

      {/* READ BLOG MODE */}
      {activeTab === "browse" && (
        <div className="space-y-6">
          {selectedTutorial ? (
            /* Expended Tutorial View */
            <div className="space-y-4 animate-fade-in bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-250">
              {/* Back Link */}
              <button
                onClick={() => setSelectedTutorial(null)}
                className="text-xs text-slate-605 text-slate-600 hover:text-slate-900 flex items-center gap-1.5 mb-2 bg-white border border-slate-205 px-3 py-1.5 rounded-lg shadow-sm cursor-pointer font-bold"
              >
                &larr; Trở lại danh mục bài viết
              </button>

              <div className="space-y-2">
                <span className="inline-block text-[9px] text-sky-700 font-black uppercase px-2 py-0.5 rounded bg-sky-50 border border-sky-100">
                  {selectedTutorial.category}
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-tight">
                  {selectedTutorial.title}
                </h4>
                
                {/* Meta stats */}
                <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {selectedTutorial.views.toLocaleString()} lượt xem
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {selectedTutorial.readTime}
                  </span>
                </div>
              </div>

              {/* FTC Disclosure */}
              {selectedTutorial.hasAffiliateDisclosure && (
                <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-150 p-4 rounded-xl text-xs text-indigo-900">
                  <ShieldAlert className="w-4 h-4 text-indigo-650 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">
                    <strong>Tuyên bố minh bạch</strong>: Tài liệu có kết nối liên kết. Khi bạn chia sẻ hoặc sắm sửa mã Key thì ví hoa hồng đại lý sẽ tự động bổ sung số tiền tích tụ cho đối tác liên đới.
                  </p>
                </div>
              )}

              {/* Expanded Text */}
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line space-y-4 pt-4 border-t border-slate-200 font-sans font-medium">
                {selectedTutorial.content}
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedTutorial(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2 px-4 rounded-xl text-xs cursor-pointer"
                >
                  Đóng hướng dẫn & quay lại
                </button>
              </div>
            </div>
          ) : (
            /* Browse Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tutorials.map((tut) => (
                <div
                  key={tut.id}
                  onClick={() => setSelectedTutorial(tut)}
                  className="bg-white border border-slate-200 p-5 rounded-2xl cursor-pointer hover:border-sky-305 hover:shadow-md hover:bg-slate-50/50 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-black text-sky-700 bg-sky-50 border border-sky-100 py-0.5 px-2 rounded">
                        {tut.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {tut.readTime}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-2">
                      {tut.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {tut.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-400" /> {tut.views.toLocaleString()} đã đọc
                    </span>
                    <span className="text-xs text-sky-600 font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Đọc Bài <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AUTOMATIC WRITER SECTION */}
      {activeTab === "writer" && (
        <div className="space-y-6 text-left">
          <div className="bg-slate-100 p-5 sm:p-6 border border-slate-200 rounded-2xl space-y-4">
            <h4 className="text-xs font-black text-sky-700 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>Cấu Hình Bài Viết Seeding Play Together</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Thiết lập điền link đại lý của bạn, hệ thống AI của Buyplay sẽ đính kèm rương giảm giá, kịch bản lọc cá vương miện mượt mà phù hợp rải lên Facebook/Zalo để kéo khách.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Product */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">Gói Key Cần Bán</label>
                <select
                  value={targetProduct.id}
                  onChange={(e) => {
                    const prod = products.find((p) => p.id === e.target.value);
                    if (prod) setTargetProduct(prod);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 outline-none font-bold shadow-sm"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id} className="bg-white text-slate-800">{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Referral placement input */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">Link Giới Thiệu Của Bạn</label>
                <input
                  type="text"
                  value={affiliateLink}
                  onChange={(e) => setAffiliateLink(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-sky-600 outline-none font-mono font-bold shadow-sm"
                  placeholder="https://buyplay.com/ref=code"
                />
              </div>

              {/* Tone style */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">Văn Phong Bài Viết</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-600 outline-none shadow-sm"
                >
                  <option value="thuyet-phuc">Cuốn hút, tập trung câu cá hiếm</option>
                  <option value="ky-thuat">Chuyên sâu kỹ thuật, anti-ban 100%</option>
                  <option value="voucher">Tặng giftcode, kích hoạt sấm sét</option>
                </select>
              </div>
            </div>

            {/* Run button */}
            <button
              onClick={handleGenerateArticle}
              disabled={isGenerating}
              className="w-full bg-sky-505 bg-sky-500 hover:bg-sky-600 text-white font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Trình tạo Buyplay AI đang dệt kịch bản câu cá...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Sáng Tạo Bài Seeding Chuẩn SEO &rarr;</span>
                </>
              )}
            </button>
          </div>

          {/* Render Outcome */}
          {generatedResult && (
            <div className="bg-slate-50 border border-slate-250 p-6 rounded-2xl space-y-4 animate-fade-in text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-emerald-700 text-xs font-black flex items-center gap-1">
                  <Check className="w-4 h-4" /> Bản nháp Seeding sính ngoại dán link thành công
                </span>
                
                <button
                  onClick={handleCopyText}
                  className="text-xs bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 py-1.5 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm font-bold"
                >
                  <span>{copiedWriterText ? "Đã sao chép!" : "Sao chép bài viết"}</span>
                </button>
              </div>

              <div className="bg-white p-4 rounded-xl text-slate-705 text-slate-700 text-xs font-mono max-h-72 overflow-y-auto whitespace-pre-line leading-relaxed border border-slate-200 shadow-inner">
                {generatedResult}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
