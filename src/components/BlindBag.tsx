import React, { useState } from "react";
import { Sparkles, Gift, Flame, PackageOpen, Coins, History, Check, Trophy } from "lucide-react";

interface BlindBagProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onAddKeyToHistory: (keyData: { productName: string; keyDelivered: string; price: number }) => void;
}

interface RewardItem {
  id: string;
  name: string;
  type: "key" | "money" | "spin" | "protect";
  value: string;
  chanceText: string;
  weight: number;
  color: string;
  icon: string;
  description: string;
}

const SPIN_COST = 49000;

const REWARDS_DATA: RewardItem[] = [
  { 
    id: "key15", 
    name: "Key VIP Auto 15 Ngày 🔑", 
    type: "key", 
    value: "15days", 
    chanceText: "50%", 
    weight: 50, 
    color: "bg-gradient-to-br from-emerald-500 to-teal-700 text-white", 
    icon: "🔑",
    description: "Kích hoạt 15 ngày cắm máy nông trại tự động bypass chống quét bảo mật"
  },
  { 
    id: "key30", 
    name: "Key VIP Auto 30 Ngày 👑", 
    type: "key", 
    value: "30days", 
    chanceText: "40%", 
    weight: 40, 
    color: "bg-gradient-to-br from-purple-500 to-purple-800 text-white", 
    icon: "👑",
    description: "Thần khí treo máy dọn dẹp NPC dọn dẹp tự động 30 ngày an toàn"
  },
  { 
    id: "key_lifetime", 
    name: "Key VIP Auto Vĩnh Viễn 🌌", 
    type: "key", 
    value: "lifetime", 
    chanceText: "0.1% — Đặc quyền siêu quý hiếm trọn đời", 
    weight: 0.1, 
    color: "bg-gradient-to-br from-amber-500 via-red-500 to-yellow-500 text-white border-yellow-300 animate-pulse", 
    icon: "🌌",
    description: "Đặc quyền siêu quý hiếm trọn đời bộ combo dọn đảo gieo hạt dọn NPC không giới hạn!"
  },
  { 
    id: "money50", 
    name: "Cộng Tài Khoản +50,000 VNĐ 💰", 
    type: "money", 
    value: "50000", 
    chanceText: "40%", 
    weight: 40, 
    color: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white", 
    icon: "💰",
    description: "Hệ thống tự động cộng trực tiếp +50,000đ khích lệ may mắn siêu đặc biệt"
  }
];

export default function BlindBag({ balance, onUpdateBalance, onAddKeyToHistory }: BlindBagProps) {
  const [gameState, setGameState] = useState<"idle" | "shaking" | "revealed">("idle");
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [history, setHistory] = useState<string[]>([
    "Khách hàng vừa xé trúng Key VIP 15 Ngày xịn đét",
    "Người chơi cộng 40.000đ ví từ túi mù kaia",
    "May mắn cực hạn nhặt được bảo toàn tính mạng"
  ]);

  const handleStartTear = () => {
    if (gameState === "shaking") return;

    if (balance < SPIN_COST) {
      alert(`Số dư tài khoản hiện tại của bạn không đủ để chơi túi mù (Yêu cầu ${SPIN_COST.toLocaleString()} VNĐ). Vui lòng nhấp vào 'Số dư' ở góc trên cùng bên phải để NẠP GIẢ LẬP hoàn toàn miễn phí cực nhanh!`);
      return;
    }

    // Deduct cost
    onUpdateBalance(balance - SPIN_COST);

    setGameState("shaking");
    setSelectedReward(null);

    // Roll reward based on weight
    const totalWeight = REWARDS_DATA.reduce((sum, item) => sum + item.weight, 0);
    const randomVal = Math.random() * totalWeight;

    let cumulative = 0;
    let winnerIndex = 0;

    for (let i = 0; i < REWARDS_DATA.length; i++) {
      cumulative += REWARDS_DATA[i].weight;
      if (randomVal <= cumulative) {
        winnerIndex = i;
        break;
      }
    }

    const winner = REWARDS_DATA[winnerIndex];

    // Shake for 1.8 seconds suspense, then reveal
    setTimeout(() => {
      setSelectedReward(winner);
      setGameState("revealed");

      // Distribute specific rewards
      if (winner.type === "money") {
        const valueNum = parseInt(winner.value);
        // Deduct 49000 already happened, so we add reward value back
        onUpdateBalance(balance - SPIN_COST + valueNum);
      } else if (winner.type === "spin") {
        // Spin refunds cost
        onUpdateBalance(balance);
      } else if (winner.type === "protect") {
        // Protect returns cost
        onUpdateBalance(balance - SPIN_COST + 49000);
      } else if (winner.type === "key") {
        let keyPrice = 60000;
        let randomKey = `BUYPLAY-VIP-15DAYS-${Math.random().toString(36).substring(3, 8).toUpperCase()}-${Math.random().toString(36).substring(4, 9).toUpperCase()}`;
        if (winner.value === "30days") {
          keyPrice = 100000;
          randomKey = `BUYPLAY-VIP-30DAYS-${Math.random().toString(36).substring(3, 8).toUpperCase()}-${Math.random().toString(36).substring(4, 9).toUpperCase()}`;
        } else if (winner.value === "lifetime") {
          keyPrice = 1200000;
          randomKey = `BUYPLAY-VIP-LIFETIME-${Math.random().toString(36).substring(3, 8).toUpperCase()}-${Math.random().toString(36).substring(4, 9).toUpperCase()}`;
        }

        onAddKeyToHistory({
          productName: `Vòng Quay Túi Mù: ${winner.name}`,
          keyDelivered: randomKey,
          price: keyPrice,
        });
      }

      // Log
      const nowStr = new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
      const newLog = `[${nowStr}] Bạn xé túi lấy: ${winner.name}`;
      setHistory(prev => [newLog, ...prev]);

    }, 1850);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto shadow-sm text-left">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes custom-shake {
          0% { transform: translate(2px, 1px) rotate(0deg); }
          10% { transform: translate(-1.5px, -2px) rotate(-3deg); }
          20% { transform: translate(-3px, 0px) rotate(3deg); }
          30% { transform: translate(0px, 2px) rotate(0deg); }
          40% { transform: translate(1.5px, -1px) rotate(2deg); }
          50% { transform: translate(-1.5px, 2.5px) rotate(-2deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(2px, 1.5px) rotate(-3deg); }
          80% { transform: translate(-1px, -1.5px) rotate(3deg); }
          90% { transform: translate(2px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-2deg); }
        }
        .animate-custom-shake {
          animation: custom-shake 0.22s infinite linear;
        }
      `}} />

      {/* HEADER SECTION */}
      <div className="border-b border-rose-100 pb-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] bg-rose-50 border border-rose-200 text-rose-600 px-3 py-1 rounded-full uppercase font-black tracking-widest flex items-center gap-1 w-max">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>Mini-Game Đảo Kaia Trực Tuyến</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
            🎁 Hộp Xé Túi Mù May Mắn Cực Hạn
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-semibold leading-relaxed">
            Hồi hộp từng giây phút mở bao bọc túi mù may rủi cực thú vị! Hãy bấm nút mua để lắc hộp rầm rộ tìm kiếm đặc quyền Key VIP hoặc nhận xu ví tiêu dùng ngay.
          </p>
        </div>

        {/* Current user Balance Display */}
        <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-2xl flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-sm">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] text-rose-600 uppercase font-black block leading-none">Số dư tiêu dùng:</span>
            <span className="text-base sm:text-lg font-black font-mono tracking-tight text-red-500">
              {balance.toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>
      </div>

      {/* DYNAMIC GAME BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* CENTER ELEMENT (8 COLS): PERFECT PICTURE STYLE BOX */}
        <div className="md:col-span-8 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-inner select-none relative min-h-[380px] overflow-hidden">
          
          {gameState === "idle" && (
            <div className="text-center space-y-6 animate-scale-up">
              
              {/* Pink envelope squircle frame as shown in screenshot */}
              <div className="w-24 h-24 bg-rose-55 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                <Gift className="w-11 h-11 text-rose-550 text-rose-550 text-rose-500" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">Học Viện Túi Mù Khép Kín</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-semibold leading-relaxed">
                  Nhấp nút <strong>GIÁ XÉ</strong> bên dưới để bắt đầu xé túi mù may mắn cực kỳ hồi hộp.
                </p>
              </div>

              <div>
                <button
                  onClick={handleStartTear}
                  className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-extrabold text-xs uppercase tracking-wider px-8 py-3 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  GIÁ XÉ: 49.000 VNĐ
                </button>
              </div>

            </div>
          )}

          {gameState === "shaking" && (
            <div className="text-center space-y-6 w-full animate-pulse">
              
              {/* Shaking envelope frame */}
              <div className="w-24 h-24 bg-rose-100 border border-rose-200 rounded-[2rem] flex items-center justify-center mx-auto animate-custom-shake shadow-md">
                <PackageOpen className="w-11 h-11 text-rose-600" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-black text-rose-700 tracking-tight animate-bounce">ĐANG LẮC LẮC TÚI MÙ...</h3>
                <p className="text-xs text-slate-450 font-semibold max-w-xs mx-auto leading-relaxed">
                  Bao nylon đang rung bần bật tìm kiếm đặc quyền may mắn... Khám phá điều tuyệt diệu tức thì!
                </p>
              </div>

              <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden mx-auto border border-slate-300">
                <div className="bg-rose-500 h-full w-full animate-pulse" />
              </div>

              <div>
                <button disabled className="bg-slate-200 border border-slate-300 text-slate-400 font-extrabold text-xs uppercase tracking-wider px-8 py-3 rounded-full cursor-not-allowed">
                  Đang mở báu...
                </button>
              </div>

            </div>
          )}

          {gameState === "revealed" && selectedReward && (
            <div className="text-center space-y-5 w-full animate-scale-up py-2">
              
              <div className="inline-flex items-center gap-1 text-[10px] bg-yellow-100 border border-yellow-250 text-amber-800 font-black px-4 py-1.5 rounded-full uppercase tracking-wider animate-bounce shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>BẤT NGỜ! XÉ BAO THÀNH CÔNG!</span>
              </div>

              {/* Display Prize Card */}
              <div className={`p-6 rounded-2xl border-2 border-white/20 max-w-xs mx-auto shadow-xl ${selectedReward.color}`}>
                <div className="text-4xl mb-2 filter drop-shadow">{selectedReward.icon}</div>
                <h3 className="text-sm sm:text-base font-black tracking-tight leading-snug">
                  {selectedReward.name}
                </h3>
                <p className="text-xs text-white/95 font-semibold mt-2.5 leading-relaxed">
                  {selectedReward.description}
                </p>
              </div>

              <div className="max-w-xs mx-auto">
                {selectedReward.type === "money" && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-[11px] font-bold leading-normal">
                    🎉 Hoàn hảo! Ví của bạn đã được tự động cộng thêm <span className="underline font-mono">{parseInt(selectedReward.value).toLocaleString()}đ</span> cực đỉnh!
                  </div>
                )}
                {selectedReward.type === "spin" && (
                  <div className="bg-cyan-50 border border-cyan-200 text-cyan-800 rounded-xl p-3 text-[11px] font-bold leading-normal">
                    🔄 Nhận thêm một lượt xé miễn phí hoàn phí bảo hiểm game {SPIN_COST.toLocaleString()}đ vào ví!
                  </div>
                )}
                {selectedReward.type === "protect" && (
                  <div className="bg-slate-100 border border-slate-200 text-slate-800 rounded-xl p-3 text-[11px] font-bold leading-normal">
                    🛡️ Bảo toàn ví tuyệt hảo! Đã trả ngược {SPIN_COST.toLocaleString()}đ phí chơi về số dư tài khoản của bạn!
                  </div>
                )}
                {selectedReward.type === "key" && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-805 text-emerald-800 rounded-xl p-3 text-[11px] font-bold leading-normal font-sans">
                    🔑 Mã key tự động kích hoạt đã cấp thẳng vào mục <strong>“Lịch sử mua key”</strong> ở trên cùng!
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setGameState("idle")}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3 px-8 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  Xé Tiếp Lượt Mới
                </button>
              </div>

            </div>
          )}

        </div>

        {/* SIDEBAR FOR HISTORICAL LOGS (4 COLS) */}
        <div className="md:col-span-4 flex flex-col justify-between">
          
          {/* REALTIME SYSTEM JOURNAL */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col h-full min-h-[380px]">
            <h4 className="font-extrabold text-slate-800 text-xs mb-4 flex items-center justify-between border-b border-rose-100 pb-3">
              <span className="flex items-center gap-1.5 text-rose-600 uppercase tracking-wider font-extrabold text-[11px]">
                <History className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: "12s" }} />
                <span>Nhật ký xé bọc trực tuyến</span>
              </span>
              <span className="text-[9px] bg-red-100 text-red-650 px-2 py-0.5 rounded-full text-red-600 font-mono font-black animate-pulse tracking-widest leading-none">LIVE</span>
            </h4>
            
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[310px] font-mono text-[10px] text-slate-500 pr-1 select-none">
              {history.map((log, idx) => (
                <div key={idx} className="bg-white border border-slate-100 p-2.5 rounded-xl text-left shadow-xs flex items-start gap-2.5 transition-all hover:bg-slate-50">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0 animate-pulse mt-1" />
                  <span className="text-slate-600 text-[10.5px] leading-snug font-semibold">{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
