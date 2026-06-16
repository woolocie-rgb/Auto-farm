// Centralized Bank Configuration for VietQR / MoMo payments
// Adjust these values to match your SePay linked bank account to make auto top-up work correctly.

export const BANK_CONFIG = {
  // 1. BANK DETAILS (VIETQR)
  // Find your bank ID (e.g. "vietcombank", "mbbank", "techcombank", "acb", "bidv", "vietinbank"...)
  bankId: "vietinbank", 
  
  // Your real bank account number linked to SePay
  accountNumber: "108867589378", 

  // Account owner name in ALL CAPS (No accent letters for QR API safety)
  accountName: "PHAM THI MY HANH", 
  
  // Display name in Vietnamese with accents
  accountNameVi: "PHẠM THỊ MỸ HẠNH",
  
  // Bank display brand name
  bankDisplayName: "VIETINBANK",
};
