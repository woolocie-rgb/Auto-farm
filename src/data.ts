import { Product, Tutorial, DripEmail, ConversionMetric } from "./types";

export const PRODUCTS_DATA: Product[] = [
  {
    id: "pt-fruit-3days",
    name: "Key VIP Auto Mua Quả Trong Shop - Gói 3 Ngày",
    category: "game",
    price: 15000,
    originalPrice: 30000,
    commissionRate: 15,
    rating: 4.8,
    soldCount: 950,
    stockCount: 999,
    features: [
      "Bộ công cụ tự động mua quả trong Shop Play Together cực nhạy",
      "Chọn chính xác loại quả cần gom (Táo, Cam, Nho, Đào...)",
      "Auto treo máy đêm mua dọn kho quả rảnh tay 100%",
      "Tránh mua nhầm quả rác, tiết kiệm tối đa tiền xu sao"
    ],
    description: "Gói dùng thử 3 ngày cho phép trải nghiệm đầy đủ tính năng auto mua quả và cây trồng trong cửa hàng, giúp bạn làm nhiệm vụ hàng ngày cực nhanh.",
    instructions: "Bước 1: Tải file Buyplay Auto Fruit mới nhất.\nBước 2: Cóp Key Auto mua quả vừa nhận điền vào hộp thoại kích hoạt.\nBước 3: Mở game, đứng gần NPC bán quả rồi ấn nút kích hoạt Auto mua quả.",
    downloadUrl: "https://drive.google.com/drive/folders/play-together-cheat-secure"
  },
  {
    id: "pt-fruit-15days",
    name: "Key VIP Auto Mua Quả Trong Shop - Gói 15 Ngày",
    category: "game",
    price: 60000,
    originalPrice: 120000,
    commissionRate: 15,
    rating: 4.9,
    soldCount: 1840,
    stockCount: 999,
    features: [
      "Tốc độ mua quả siêu tốc, bỏ qua hoạt cảnh hội thoại NPC",
      "Tích hợp tự động mua hạt giống gieo trồng ngay tại vườn",
      "Cơ chế bẫy delay ngẫu nhiên lách quét chống gian lận",
      "Hỗ trợ chế độ duy trì mạng kết nối treo máy 24/7"
    ],
    description: "Giải pháp 15 ngày hiệu quả vượt trội cho nông dân gom số lượng lớn nguyên liệu nông sản sản xuất, giảm thiểu mệt mỏi căn chuột.",
    instructions: "Bước 1: Tải công cụ phụ trợ cài đặt trên điện thoại/giả lập.\nBước 2: Nhập Key Auto 15 ngày để xác minh bản quyền trực tuyến.\nBước 3: Tùy chỉnh danh sách quả ưu tiên mua rồi nhấn Start.",
    downloadUrl: "https://drive.google.com/drive/folders/play-together-cheat-secure"
  },
  {
    id: "pt-fruit-30days",
    name: "Key VIP Auto Mua Quả Trong Shop - Gói 30 Ngày",
    category: "game",
    price: 100000,
    originalPrice: 200000,
    commissionRate: 20,
    rating: 4.9,
    soldCount: 3120,
    stockCount: 999,
    features: [
      "Đầy đủ bộ tính năng VIP độc quyền mua dọn sạch shop",
      "Auto bypass hệ thống chống macro mới của Haegin",
      "Báo cáo thống kê số lượng quả đã mua trực tiếp ra Telegram",
      "Hỗ trợ tự động thanh lý dọn rương khi túi hành lý bị đầy"
    ],
    description: "Lựa chọn tiết kiệm hàng đầu dành cho các chủ trang trại lớn cày sao quy mô công nghiệp. Sở hữu công cụ bypass cao cấp nhất.",
    instructions: "Bước 1: Tải bộ cài Buyplay Auto Fruit Pro.\nBước 2: Bật Tool, chèn Key VIP Auto 30 ngày sấm sét mua từ Buyplay.\nBước 3: Bật các phím tắt chọn quả và bật rương thu hoạch tự động.",
    downloadUrl: "https://drive.google.com/drive/folders/play-together-cheat-secure"
  },
  {
    id: "pt-fruit-lifetime",
    name: "Key VIP Auto Mua Quả Trong Shop - Vĩnh Viễn",
    category: "game",
    price: 1200000,
    originalPrice: 3000000,
    commissionRate: 25,
    rating: 5.0,
    soldCount: 620,
    stockCount: 120,
    features: [
      "Sở hữu vĩnh viễn không giới hạn thời gian tất cả đặc quyền VIP",
      "Cập nhật miễn phí trọn đời theo từng phiên bản mới của game",
      "Đại quyền hỗ trợ cực cấp trực tiếp từ Admin/Developer",
      "Chống quét block tài khoản tuyệt đối với Token Bypass thông minh"
    ],
    description: "Phiên bản cao cấp nhất của Buyplay dành riêng cho các Game thủ VIP muốn làm chủ thị trường nông sản Play Together trọn đời.",
    instructions: "Bước 1: Down bộ cài đặc quyền VIP trọn đời.\nBước 2: Điền KEY AUTO Vĩnh Viễn chính gốc từ hệ thống.\nBước 3: Trải nghiệm công suất dọn shop mua quả đỉnh nhất không lo sập nguồn.",
    downloadUrl: "https://drive.google.com/drive/folders/play-together-cheat-secure"
  }
];

export const TUTORIALS_DATA: Tutorial[] = [
  {
    id: "pt-tut-01",
    title: "Cách cấu hình thời gian delay auto mua quả tránh bị khóa nick Play Together",
    slug: "huong-dan-auto-mua-qua-play-together-an-toan",
    category: "Bảo Mật Auto",
    summary: "Bí quyết thiết lập độ trễ mua ngẫu nhiên từ 1.5s - 2.8s giúp tài khoản của bạn ẩn mình hoàn hảo trước hệ thống quét tự động của Haegin.",
    content: "## Làm thế nào để treo máy auto mua quả trong shop mà an toàn tuyệt đối?\nHệ thống giám sát của Play Together liên tục theo dõi tốc độ giao dịch với NPC bách hóa nông trại. Khi bạn thực hiện hành động mua quả liên tục ở tốc độ miligiây, hệ thống cảnh báo sẽ đánh dấu tài khoản của bạn ngay lập tức.\n\n### 🔧 Các thông số cấu hình khuyên dùng cho Tool Buyplay:\n1. **Thiết lập độ trễ ngẫu nhiên (Random Delay)**: Hãy chỉnh khoảng trễ từ 1.5 giây đến 3 giây giữa mỗi thao tác click mua quả.\n2. **Tích hợp di chuyển nhẹ ngẫu nhiên**: Tool hỗ trợ tự động nhích nhẹ nhân vật xung quanh quầy NPC sau mỗi 10 lượt mua để giả lập hành vi người chơi bận rộn.\n3. **Ngắt nghỉ thông minh**: Cứ sau 15-20 phút hoạt động, hãy thiết lập cho Tool nghỉ ngơi tự động khoảng 2-3 phút.",
    readTime: "3 phút đọc",
    views: 3240,
    hasAffiliateDisclosure: false
  },
  {
    id: "pt-tut-02",
    title: "Hướng dẫn tối ưu dọn hòm thư và bán quả kiếm tiền sao nhanh nhất",
    slug: "cach-ban-qua-kiem-tien-sao-play-together",
    category: "Kinh Nghiệm Cày Vàng",
    summary: "Cơ chế phối trộn mua quả giá rẻ và bán lại làm nhiệm vụ sự kiện hoặc gieo hạt giống cao cấp tối ưu hóa tiền sao thu được 300%.",
    content: "## Chuyển hóa quả khô, hạt giống thành tiền sao Play Together\nChỉ gom quả trong shop là chưa đủ, bạn cần lập kế hoạch tái đầu tư hoặc bán đúng sự kiện của nông trại.\n\n### ⚡ Cách phối hợp Auto Mua Quả với gieo hạt:\n- **Gom sỉ các loại quả nhiệm vụ**: Tập trung gom Táo và Cam vào khung giờ sáng sớm để đón đầu nhiệm vụ của cư dân thị trấn.\n- **Lọc hạt giống**: Auto mua hạt giống dâu tây chất lượng cao để gieo trồng gặt hái quả hiếm.\n- **Lời khuyên**: Luôn kích hoạt Key dọn shop chính chủ tại Buyplay để phần mềm cập nhật chính xác bảng giá biến động trong NPC.",
    readTime: "4 phút đọc",
    views: 2150,
    hasAffiliateDisclosure: false
  }
];

export const DRIP_EMAILS_DATA: DripEmail[] = [
  {
    id: "email-1",
    step: 1,
    triggerEvent: "Mua Key thành công",
    delayText: "Tức thì sau 1-5 giây",
    subject: "🔑 [Buyplay] Gửi Tự Động Mã Key Tool Auto Mua Quả Play Together - Đơn hàng #{ORDER_ID}",
    body: `Chào bạn {BUYER_EMAIL},

Hệ thống giao key tự động 24/7 của Buyplay đã xử lý thành công đơn hàng số #{ORDER_ID} của bạn!

Dưới đây là thông tin chi tiết về Key kích hoạt Tool Auto Mua Quả Play Together:

▶️ SẢN PHẨM: {PRODUCT_NAME}
🔑 MÃ KEY AUTO CHI TIẾT: {KEY_DELIVERED}
🔽 LINK TẢI PHẦN MỀM CHÍNH THỨC: {DOWNLOAD_URL}

📌 HƯỚNG DẪN KÍCH HOẠT NHANH:
{INSTRUCTIONS}

Hỗ trợ kỹ thuật 24/7 trực tiếp qua Telegram/Zalo Admin Buyplay. Bảo hành 1-đổi-1 cho mọi trường hợp Key lỗi.

Cám ơn bạn đã tin tưởng dịch vụ tại Buyplay!`,
    purpose: "Bàn giao Key Auto lập tức cho khách hàng ngay sau khi chuyển khoản thành công."
  }
];

export const CONVERSION_METRICS_DATA: ConversionMetric[] = [
  { date: "06-05", clicks: 120, signups: 15, sales: 5, conversionRate: 33.3, revenue: 450000, commissions: 67500 },
  { date: "06-06", clicks: 210, signups: 35, sales: 12, conversionRate: 34.2, revenue: 380000, commissions: 57000 },
  { date: "06-07", clicks: 180, signups: 28, sales: 10, conversionRate: 35.7, revenue: 650000, commissions: 97500 },
  { date: "06-08", clicks: 310, signups: 45, sales: 18, conversionRate: 40.0, revenue: 1200000, commissions: 180000 },
  { date: "06-09", clicks: 420, signups: 65, sales: 25, conversionRate: 38.4, revenue: 1550000, commissions: 232500 },
  { date: "06-10", clicks: 550, signups: 92, sales: 38, conversionRate: 41.3, revenue: 2900000, commissions: 435000 },
  { date: "Hôm nay", clicks: 380, signups: 58, sales: 24, conversionRate: 41.4, revenue: 1850000, commissions: 277500 },
];
