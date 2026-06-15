import React, { useState, useEffect } from "react";
import { Gamepad, Code, Terminal, Clipboard, Check, Play, ShieldAlert, Cpu, Layers, RefreshCw, Key } from "lucide-react";

interface KeyRecord {
  key: string;
  tier: string;
  hwid: string | null;
  createdAt: string;
  expiresAt: string | null;
  buyerEmail: string;
}

export default function APIAppIntegration() {
  const [copiedPython, setCopiedPython] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  
  // Tester States
  const [testKey, setTestKey] = useState("BUYPLAY-VIP-30DAYS-AJKX91");
  const [testHwid, setTestHwid] = useState("COMP-UUID-709A-412C-B2FA");
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Live admin list
  const [keysList, setKeysList] = useState<KeyRecord[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);

  const fetchKeysList = async () => {
    setIsLoadingKeys(true);
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      if (data.success) {
        setKeysList(data.keys);
      }
    } catch (err) {
      console.error("Error fetching live keys:", err);
    } finally {
      setIsLoadingKeys(false);
    }
  };

  useEffect(() => {
    fetchKeysList();
  }, []);

  const handleCopyPython = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopiedPython(true);
    setTimeout(() => setCopiedPython(false), 2000);
  };

  const handleCopyEndpoint = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 1500);
  };

  const handleRunVerifyTest = async () => {
    setIsTesting(true);
    setTestResponse(null);
    try {
      const response = await fetch("/api/keys/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: testKey, hwid: testHwid })
      });
      const data = await response.json();
      setTestResponse({
        status: response.status,
        data
      });
      // Refresh the database status
      fetchKeysList();
    } catch (error: any) {
      setTestResponse({
        status: 500,
        data: { success: false, message: "Không thể kết nối đến server. Vui lòng kiểm tra server Node.js!", error: error.message }
      });
    } finally {
      setIsTesting(false);
    }
  };

  const hostUrl = typeof window !== "undefined" ? window.location.origin : "https://duata-cua-ban.com";

  const pythonCode = `import requests
import subprocess
import sys
import os

# API Server URL (Lấy domain website của bạn)
API_BASE_URL = "${hostUrl}"

def get_windows_hwid():
    """
    Lấy Hardware ID (HWID) duy nhất của máy tính chạy Windows để khóa Key.
    Hàm này đọc Windows MachineGuid từ Registry, không yêu cầu quyền Admin.
    """
    try:
        if sys.platform == "win32":
            import winreg
            registry_key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Microsoft\\Cryptography")
            value, _ = winreg.QueryValueEx(registry_key, "MachineGuid")
            winreg.CloseKey(registry_key)
            return str(value).strip()
        else:
            # Fallback cho Mac / Linux khi test máy ảo
            import uuid
            return f"NON-WINDOWS-{uuid.getnode()}"
    except Exception as e:
        # Fallback sơ cua nếu có lỗi bất ngờ
        return "DEFAULT-MOCK-SYSTEM-HWID"

def verify_and_lock_license_key(key):
    """
    Gửi Request POST đến server website Buyplay Store để xác minh và khóa Key
    """
    url = f"{API_BASE_URL}/api/keys/verify"
    hwid = get_windows_hwid()
    
    payload = {
        "key": key.strip(),
        "hwid": hwid
    }
    
    print(f"[*] Đang kết nối đến server để xác minh Key...")
    print(f"[*] Mã phần cứng của máy bạn (HWID): {hwid}")
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("success"):
            print("\\n[+] KÍCH HOẠT THÀNH CÔNG!")
            print(f"[+] Hạn sử dụng: {data.get('expiresAt')}")
            print(f"[+] Loại gói: {data.get('tier')}")
            return True
        else:
            print("\\n[-] KÍCH HOẠT THẤT BẠI!")
            print(f"[-] Thông báo từ Server: {data.get('message')}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"\\n[!] Lỗi kết nối đến Server API: {e}")
        return False

if __name__ == "__main__":
    print("==================================================")
    print("  TRÌNH KHỞI ĐỘNG TOOL AUTO PLAY TOGETHER BYPASS  ")
    print("==================================================")
    
    # Nhập key hoặc lưu key trong file cấu hình local để khỏi nhập tiện lợi
    config_file = "license.txt"
    user_key = ""
    
    if os.path.exists(config_file):
        with open(config_file, "r") as f:
            user_key = f.read().strip()
            
    if not user_key:
        user_key = input("👉 Vui lòng nhập KEY VIP của bạn: ").strip()
        
    if verify_and_lock_license_key(user_key):
        # Lưu key lại cho lần khởi động sau không cần nhập lại
        with open(config_file, "w") as f:
            f.write(user_key)
            
        print("\\n👉 [OK] Cấp quyền chạy Auto thành công! Đang tải mã Python chính...")
        # CHỖ NÀY LÀ NƠI CHẠY CODE AUTO CHÍNH CỦA BẠN TRÊN WINDOWS!
        # ...
    else:
        print("\\n❌ Key không hợp lệ hoặc đã bị khóa trên máy khách. Hãy mua key mới!")
        input("\\nBấm Enter để thoát...")
`;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto shadow-sm text-left animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="border-b border-amber-100 pb-5 mb-8">
        <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-600 px-3 py-1 rounded-full uppercase font-black tracking-widest flex items-center gap-1 w-max">
          <Terminal className="w-3.5 h-3.5" />
          <span>Tài Liệu API & Hướng Dẫn Kỹ Thuật</span>
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
          🎮 Tích Hợp Python Auto & Khóa Key HWID
        </h2>
        <p className="text-xs text-slate-500 mt-1.5 max-w-3xl font-semibold leading-relaxed">
          Tìm hiểu mô hình đồng bộ hóa bọc key tự động trên trang web nhằm phân phối bản quyền cho tool Windows Auto của bạn. Giải pháp khóa HWID bảo vệ key chỉ dùng được trên duy nhất 1 máy tính cho khách hàng mua sắm.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* EXPLANATION & INTERACTIVE TESTER (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* THE PRINCIPLE */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-500" />
              <span>Nguyên Lý Khóa Cứng HWID (Hardware ID)</span>
            </h3>
            <p className="text-[11.5px] text-slate-600 leading-relaxed font-semibold">
              Khi khách hàng mua Key từ trang web, hệ thống ghi nhận mã key đó vào DB và gán trạng thái <span className="text-emerald-600">Chưa kích hoạt (HWID = NULL)</span>. 
            </p>
            <ul className="text-[11px] text-slate-500 list-disc list-inside space-y-1.5 font-semibold">
              <li>Khi mở Tool Python trên Windows lần đầu, Tool lấy mã GUID phần cứng rồi gọi API.</li>
              <li>Server thấy HWID của key trống =&gt; Gán cứng HWID máy đó vào Key, kích hoạt thành công!</li>
              <li>Các lần sau mở Tool, Server kiểm tra nếu HWID gửi lên khớp với HWID đã lưu =&gt; Cho phép chạy.</li>
              <li>Nếu gửi sai HWID (sử dụng trên máy khác) =&gt; Server trả về lỗi từ chối, chặn mở Tool!</li>
            </ul>
          </div>

          {/* INTERNAL ENDPOINTS */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              📌 Địa Chỉ Endpoint Xác Thực (REST API URL)
            </h3>
            
            <div className="space-y-2">
              <div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black mr-2 font-mono">POST</span>
                <span className="text-[11.5px] font-mono text-slate-700 select-all font-semibold">{hostUrl}/api/keys/verify</span>
              </div>
              <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed">
                Body định dạng JSON bắt buộc: <code className="bg-slate-200 px-1 rounded text-slate-700">{"{ \"key\": \"MÃ-KEY\", \"hwid\": \"MÃ-PC-GUID\" }"}</code>
              </p>
            </div>
          </div>

          {/* INTERACTIVE TESTER SIMULATOR */}
          <div className="bg-slate-900 text-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-md font-sans">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="text-amber-400 uppercase tracking-wider font-extrabold text-[10.5px] flex items-center gap-1.5 animate-pulse">
                <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Trình Giả Lập Gửi Request Từ Python</span>
              </span>
              <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono font-black border border-slate-700">SANDBOX</span>
            </div>

            <p className="text-[10.5px] text-slate-400 font-semibold leading-normal">
              Kiểm nghiệm live API xác thực từ website tức thì. Nhập một Key (đã mua hoặc lấy trong lịch sử) kèm một mã giả lập máy và bấm gửi để xem server phản hồi JSON:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Mã Key Bản Quyền</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔑</span>
                  <input
                    type="text"
                    value={testKey}
                    onChange={(e) => setTestKey(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-xl py-2 pl-8 pr-3 text-xs text-amber-100 outline-none font-mono"
                    placeholder="BUYPLAY-VIP-..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Mã phần cứng (Fake HWID)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 text-xs">💻</span>
                  <input
                    type="text"
                    value={testHwid}
                    onChange={(e) => setTestHwid(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-xl py-2 pl-8 pr-3 text-xs text-amber-100 outline-none font-mono"
                    placeholder="MÃ-HWID-MÁY-CỦA-BẠN"
                  />
                </div>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={handleRunVerifyTest}
                disabled={isTesting}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 text-slate-950 font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>ĐANG TRUY VẤN SERVER API...</span>
                  </>
                ) : (
                  <>
                    <Terminal className="w-3.5 h-3.5" />
                    <span>GỬI POST REQUEST XÁC THỰC</span>
                  </>
                )}
              </button>
            </div>

            {testResponse && (
              <div className="space-y-1.5 animate-scale-up text-left">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>MÃ PHẢN HỒI HTTP:</span>
                  <span className={`font-black uppercase px-2 py-0.5 rounded ${testResponse.status === 200 ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>
                    STATUS {testResponse.status}
                  </span>
                </div>
                <pre className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl font-mono text-[10.5px] text-green-400 overflow-x-auto select-all max-h-[160px] leading-relaxed">
                  {JSON.stringify(testResponse.data, null, 2)}
                </pre>
              </div>
            )}
          </div>

        </div>

        {/* HIGH QUALITY PYTHON COPY CARD (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2.5">
              <h3 className="font-extrabold text-slate-850 text-xs text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Code className="w-4 h-4 text-emerald-500" />
                <span>Source Code Python Auto Client</span>
              </h3>
              <button
                onClick={handleCopyPython}
                className="text-[10px] font-black text-emerald-600 bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-1 cursor-pointer transition-all"
              >
                {copiedPython ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500">Đã chép!</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3 h-3" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10.5px] text-slate-405 text-slate-500 font-semibold mb-2 leading-relaxed">
              Dán đoạn script mẫu này vào đầu file Tool Python của bạn trên máy khách. Nó sẽ tự lấy GUID phần cứng Windows, kiểm tra Key xem đã hết hạn hay bị lỗi trùng ở máy khác không:
            </p>

            <div className="relative font-mono text-[9px] bg-slate-950 text-slate-350 text-slate-350 p-3.5 rounded-xl border border-slate-850 overflow-x-auto select-all leading-normal max-h-[300px] mb-4">
              <pre className="text-slate-300">{pythonCode}</pre>
            </div>

            <div className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-100 p-3 rounded-xl font-bold leading-normal">
              💡 <strong>Lợi thế cực đỉnh</strong>: File cơ sở dữ liệu trên server là <code className="bg-emerald-100 px-1 rounded text-emerald-800 font-mono">keys.db.json</code>. Bạn có thể dễ dàng sao lưu hoặc reset/xóa HWID cho bất kỳ key nào chỉ cần sửa nội dung record đó trên server.
            </div>
          </div>

          {/* SECURE DIRECT DATABASE AUDITING VISUALIZATION */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-black text-rose-700 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-4 h-4 text-rose-500" />
                <span>Kiểm Kiểm CSDL Live (Server Key List)</span>
              </h3>
              <button
                onClick={fetchKeysList}
                disabled={isLoadingKeys}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors"
                title="Làm mới CSDL"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingKeys ? "animate-spin" : ""}`} />
              </button>
            </div>

            {isLoadingKeys ? (
              <p className="text-[10.5px] text-slate-450 font-semibold animate-pulse text-center">Đang nạp bảng dữ liệu trực tuyến...</p>
            ) : keysList.length === 0 ? (
              <p className="text-[10.5px] text-slate-400 text-center font-medium">Chưa có mã key nào lưu trên server. Bạn hãy thử mua hoặc quay túi mù để ghi nhận key.</p>
            ) : (
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                {keysList.map((k, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-2.5 rounded-xl text-left shadow-xs space-y-1 select-all hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] font-black text-slate-800 tracking-tighter truncate max-w-[120px]">{k.key}</span>
                      <span className="text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded uppercase">{k.tier}</span>
                    </div>
                    <div className="flex items-center justify-between text-[8px] font-mono text-slate-400">
                      <span className="truncate max-w-[110px]">HWID: <strong className={k.hwid ? "text-amber-600 uppercase font-black" : "text-slate-300 font-bold"}>{k.hwid || "Trống (Chưa khóa)"}</strong></span>
                      <span>Hạn: {k.expiresAt ? new Date(k.expiresAt).toLocaleDateString("vi-VN") : "Trọn đời"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
