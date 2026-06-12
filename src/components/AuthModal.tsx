import React, { useState, useEffect } from "react";
import { X, Lock, Mail, Phone, ShieldCheck, Sparkles, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { User } from "../types";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("phone");
  const [inputValue, setInputValue] = useState("0334410858");
  const [password, setPassword] = useState("Quocloc@21");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // OTP Timer countdown
  useEffect(() => {
    let interval: any;
    if (isOtpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsOtpSent(false);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, otpTimer]);

  const handleSendOtp = () => {
    if (!inputValue) {
      setError(
        authMethod === "email" ? "Vui lòng nhập Email chính xác!" : "Vui lòng nhập SĐT chính xác!"
      );
      return;
    }
    setError("");
    setIsLoading(true);

    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      setOtpTimer(60);
      setSuccess(`Mã OTP đã được gửi thử nghiệm đến ${inputValue}. Hãy điền mã: '123456'`);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!inputValue || !password) {
      setError("Vui lòng điền đầy đủ tài khoản & mật khẩu!");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải chứa ít nhất 6 ký tự!");
      return;
    }

    // OTP check if signup
    if (isSignUp && isOtpSent && otpCode !== "123456") {
      setError("Mã OTP không đúng! Nhập '123456' để vượt qua an toàn.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      const isAdminUser = inputValue === "0334410858" && password === "Quocloc@21";
      
      const loggedInUser: User = {
        phoneNumberOrEmail: inputValue,
        referralCode: "AFF-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
        referralEarnings: isSignUp ? 50000 : (isAdminUser ? 5000000 : 2450000), // Signup bonus 50K or existing affiliate balance
        isLoggedIn: true,
        isAdmin: isAdminUser,
        balance: isSignUp ? 100000 : (isAdminUser ? 850000 : 200000), // Give admin 850,000 VNĐ and general user 200,000 VNĐ initial balance for spinning!
      };

      onLoginSuccess(loggedInUser);
      setSuccess(
        isSignUp 
          ? "Đăng ký thành công! Bạn nhận được 50,000đ tiền thưởng quà chào mừng đại lý!" 
          : isAdminUser 
            ? "ĐĂNG NHẬP ADMIN THÀNH CÔNG! Chuyển hướng sang kho bối cảnh người bán..." 
            : "Đăng nhập thành công! Chào bạn quay lại cửa hàng."
      );
      
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Card - Bright layout */}
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl z-10 animate-scale-up text-left">
        <div className="h-2 w-full bg-gradient-to-r from-sky-450 via-indigo-600 to-amber-500 bg-sky-500" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-sky-50 border border-sky-100 text-sky-500 mb-2">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {isSignUp ? "Tạo Tài Khoản Đại Lý" : "Đăng Nhập Cổng OTP"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {isSignUp ? "Đăng ký dán link nhận ngay 50.000đ hoa hồng" : "Tham gia cộng đồng đại lý phát Key sấm sét Buyplay"}
            </p>
          </div>

          {/* Switch Tab */}
          <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-5 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("email");
                setInputValue("");
                setError("");
              }}
              className={`py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMethod === "email" ? "bg-white text-sky-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Phương án Email</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("phone");
                setInputValue("");
                setError("");
              }}
              className={`py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMethod === "phone" ? "bg-white text-sky-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Số Điện Thoại</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                {authMethod === "email" ? "Địa chỉ Email" : "Số điện thoại di động"}
              </label>
              <div className="relative">
                {authMethod === "email" ? (
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                ) : (
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                )}
                <input
                  type={authMethod === "email" ? "email" : "tel"}
                  required
                  placeholder={authMethod === "email" ? "tenban@gmail.com" : "09xxxxxxxx"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-850 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Mật khẩu tối thiểu 6 ký tự
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Nhập mật khẩu kiểm mật"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-850 outline-none transition-colors"
                />
              </div>
            </div>

            {/* OTP if SignUp */}
            {isSignUp && (
              <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-650">Nhập mã OTP xác minh</span>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isOtpSent || isLoading}
                    className="text-xs font-black text-sky-600 hover:text-sky-700 disabled:text-slate-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>{isOtpSent ? `Có hiệu lực (${otpTimer}s)` : "Gửi mã OTP"}</span>
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  disabled={!isOtpSent}
                  placeholder={isOtpSent ? "Điền mã OTP '123456'" : "Nhấp 'Gửi mã OTP' ở góc phải"}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-sky-500 disabled:bg-slate-100 disabled:text-slate-400 rounded-xl py-2 text-center text-sm font-bold tracking-widest outline-none shadow-inner"
                />
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="flex items-start gap-2 bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-3 px-4 rounded-xl text-sm transition-transform active:scale-[0.98] shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isLoading ? "Đang xử lý..." : isSignUp ? "Tôi Chấp Nhận & Tạo Tài Khoản" : "Đăng Nhập Ngay"}</span>
            </button>
          </form>

          {/* Alternative toggle link */}
          <div className="text-center mt-5 pt-4 border-t border-slate-200">
            <button
              type="button"
              className="text-xs text-slate-550 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              onClick={() => {
                setIsSignUp((prev) => !prev);
                setInputValue("");
                setPassword("");
                setOtpCode("");
                setIsOtpSent(false);
                setError("");
                setSuccess("");
              }}
            >
              {isSignUp ? (
                <span>Đã là người cũ đối tác? <strong className="text-sky-655 text-sky-600 font-extrabold hover:underline">Vào Đăng Nhập &rarr;</strong></span>
              ) : (
                <span>Độc giả chưa có tài khoản? <strong className="text-sky-655 text-sky-600 font-extrabold hover:underline">Tạo Đại Lý Ngay &rarr;</strong></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
