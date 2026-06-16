import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// Local database path for storing generated keys, bound HWIDs, and expiration dates
const KEYS_FILE = path.join(process.cwd(), "keys.db.json");

interface KeyRecord {
  key: string;
  tier: string;          // "15days" | "30days" | "lifetime"
  hwid: string | null;   // NULL if not activated yet. Holds the client PC HWID once activated.
  createdAt: string;
  expiresAt: string | null; // null for lifetime, ISO string for others
  buyerEmail: string;
}

// Ensure the local database exists and has some initial data for testing
function loadKeys(): KeyRecord[] {
  try {
    if (fs.existsSync(KEYS_FILE)) {
      const content = fs.readFileSync(KEYS_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error reading keys file, resetting:", error);
  }

  // Pre-populate with default keys used in frontend state for immediate testing
  const defaultKeys: KeyRecord[] = [
    {
      key: "BUYPLAY-VIP-30DAYS-AJKX91",
      tier: "30days",
      hwid: null,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      buyerEmail: "woolocie@gmail.com"
    },
    {
      key: "BUYPLAY-VIP-3DAYS-KLZX82",
      tier: "3days",
      hwid: "MOCK-HWID-WINDOWS-10-PC",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 65 * 1000).toISOString(),
      buyerEmail: "woolocie@gmail.com"
    }
  ];

  fs.writeFileSync(KEYS_FILE, JSON.stringify(defaultKeys, null, 2), "utf-8");
  return defaultKeys;
}

function saveKeys(keys: KeyRecord[]) {
  try {
    fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save keys to disk:", error);
  }
}

// User persistent database path and types
const USERS_FILE = path.join(process.cwd(), "users.db.json");

interface UserRecord {
  phoneNumberOrEmail: string;
  password?: string;
  referralCode: string;
  referralEarnings: number;
  balance: number;
  isAdmin: boolean;
  referredBy?: string;
}

function loadUsers(): UserRecord[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error reading users file, resetting:", error);
  }

  // Pre-populate with default users for testing
  const defaultUsers: UserRecord[] = [
    {
      phoneNumberOrEmail: "woolocie@gmail.com",
      password: "Quocloc@21",
      referralCode: "AFF-WOOLO",
      referralEarnings: 2450000,
      balance: 150000, // seed some initial balance to test
      isAdmin: true
    },
    {
      phoneNumberOrEmail: "0344920065",
      password: "Quocloc@21",
      referralCode: "AFF-HANH",
      referralEarnings: 5000000,
      balance: 850000,
      isAdmin: true
    }
  ];

  fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), "utf-8");
  return defaultUsers;
}

function saveUsers(users: UserRecord[]) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save users to disk:", error);
  }
}

// Deposit requests backend store and tracking
const DEPOSITS_FILE = path.join(process.cwd(), "deposits.db.json");

interface DepositRecord {
  id: string;
  phoneNumberOrEmail: string;
  amount: number;
  paymentMethod: string;
  memo: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  processedAt: string | null;
}

function loadDeposits(): DepositRecord[] {
  try {
    if (fs.existsSync(DEPOSITS_FILE)) {
      const content = fs.readFileSync(DEPOSITS_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error reading deposits file, resetting:", error);
  }

  const defaultDeposits: DepositRecord[] = [
    {
      id: "DEP-A16BK9",
      phoneNumberOrEmail: "woolocie@gmail.com",
      amount: 200000,
      paymentMethod: "qr",
      memo: "BP WOOLOCIE",
      status: "approved",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "DEP-KLZ82X",
      phoneNumberOrEmail: "0344920065",
      amount: 500000,
      paymentMethod: "qr",
      memo: "BP 0344920065",
      status: "pending",
      createdAt: new Date().toISOString(),
      processedAt: null
    }
  ];

  fs.writeFileSync(DEPOSITS_FILE, JSON.stringify(defaultDeposits, null, 2), "utf-8");
  return defaultDeposits;
}

function saveDeposits(deposits: DepositRecord[]) {
  try {
    fs.writeFileSync(DEPOSITS_FILE, JSON.stringify(deposits, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save deposits to disk:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Set up middleware to parse incoming JSON in requests
  app.use(express.json());

  // CORS support so external python requests and browsers can make calls safely
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // API SePay Webhook
  app.post("/api/sepay/webhook", (req, res) => {
    console.log("[SePay] Received payment notification:", req.body);
    
    // Support SePay webhook activation ping/empty bodies checks
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(200).json({ success: true, message: "Webhook is alive and listening!" });
    }

    // SePay standard webhook variables
    const { id, transferType, transferAmount, content, gateway, transactionDate, referenceCode } = req.body;
    
    // Check if transfer is an inquiry / in-bound payment
    if (transferType && transferType !== "in") {
      return res.status(200).json({ success: true, message: "Ignore outgoing transaction" });
    }

    const amount = Number(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(200).json({ success: true, message: "Demo/verification request received. Webhook live!" });
    }

    if (!content) {
      return res.status(200).json({ success: true, message: "Verify request success - structure holds" });
    }

    // Prevent duplicate processing using SePay transaction ID or referenceCode
    const transactionId = id || referenceCode || `WEBHOOK-${Date.now()}`;
    const uniqueDepositId = `DEP-SE-${transactionId}`;
    const deposits = loadDeposits();

    if (deposits.some(d => d.id === uniqueDepositId)) {
      console.warn(`[SePay] Transaction ${transactionId} already processed previously.`);
      return res.status(200).json({ 
        success: true, 
        message: `Transaction ${transactionId} has already been processed and credited.` 
      });
    }

    // Process memo, e.g. "BP 0334410858" or "BP WOOLOCIE"
    const memo = content.toString().trim().toUpperCase();
    console.log(`[SePay] Parsing payment memo: "${memo}" for billing amount ${amount} đ`);

    const users = loadUsers();
    
    // Find a user where their phone/email clean characters match inside public transfer description 
    let matchedUserIndex = -1;
    for (let i = 0; i < users.length; i++) {
      const uEmailOrPhone = users[i].phoneNumberOrEmail.trim().toUpperCase();
      const cleanUserKey = uEmailOrPhone.replace(/[^A-Z0-9]/g, "");
      const cleanMemo = memo.replace(/[^A-Z0-9]/g, "");
      
      // Look for clean user key inside clean memo or vice versa
      if ((cleanMemo.includes(cleanUserKey) || cleanUserKey.includes(cleanMemo)) && cleanUserKey.length > 2) {
        matchedUserIndex = i;
        break;
      }

      // If email, look for prefix part before '@' in clean memo
      if (uEmailOrPhone.includes("@")) {
        const prefix = uEmailOrPhone.split("@")[0].replace(/[^A-Z0-9]/g, "");
        if (prefix.length >= 3 && cleanMemo.includes(prefix)) {
          matchedUserIndex = i;
          break;
        }
      }

      // If phone/numeric, check if phone digits are in clean memo
      const digitsOnly = uEmailOrPhone.replace(/[^0-9]/g, "");
      if (digitsOnly.length >= 8 && cleanMemo.includes(digitsOnly)) {
        matchedUserIndex = i;
        break;
      }
    }

    if (matchedUserIndex === -1) {
      console.warn(`[SePay] Unable to find any user registered under memo elements: "${memo}"`);
      return res.status(200).json({ 
        success: false, 
        message: `No active user matches the payment content "${memo}". Please check transaction details.`
      });
    }

    // Top up the balance on server database
    const matchedUser = users[matchedUserIndex];
    const oldBalance = matchedUser.balance;
    matchedUser.balance += amount;
    users[matchedUserIndex] = matchedUser;
    
    saveUsers(users);

    // Save and log the automated transaction in our deposit history for client visibility
    const newDeposit: DepositRecord = {
      id: uniqueDepositId,
      phoneNumberOrEmail: matchedUser.phoneNumberOrEmail,
      amount: amount,
      paymentMethod: gateway ? `SePay (${gateway})` : "SePay Auto",
      memo: memo,
      status: "approved",
      createdAt: transactionDate ? new Date(transactionDate).toISOString() : new Date().toISOString(),
      processedAt: new Date().toISOString()
    };
    deposits.push(newDeposit);
    saveDeposits(deposits);

    console.log(`[SePay] SUCCESS: User ${matchedUser.phoneNumberOrEmail} balance updated from ${oldBalance} -> ${matchedUser.balance} (+${amount})`);
    
    return res.status(200).json({ 
      success: true, 
      message: `Balance updated successfully for user ${matchedUser.phoneNumberOrEmail}`,
      user: matchedUser.phoneNumberOrEmail,
      creditedAmount: amount,
      newBalance: matchedUser.balance
    });
  });

  // User Endpoints
  // Deposit Endpoints for secure credit workflow
  app.get("/api/deposits", (req, res) => {
    try {
      const deposits = loadDeposits();
      res.json({ success: true, deposits });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  app.post("/api/deposits/create", (req, res) => {
    try {
      const { phoneNumberOrEmail, amount, paymentMethod, memo } = req.body;
      if (!phoneNumberOrEmail || !amount || !paymentMethod) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin nạp tiền" });
      }

      const deposits = loadDeposits();
      const id = "DEP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const isUserAdmin = ["0344920065", "woolocie@gmail.com"].includes(phoneNumberOrEmail.trim().toLowerCase());
      
      const newDeposit: DepositRecord = {
        id,
        phoneNumberOrEmail: phoneNumberOrEmail.trim(),
        amount: Number(amount),
        paymentMethod,
        memo: memo || `BP ${phoneNumberOrEmail.split("@")[0].toUpperCase().replace(/[^A-Z0-9]/g, "")}`,
        status: isUserAdmin ? "approved" : "pending",
        createdAt: new Date().toISOString(),
        processedAt: isUserAdmin ? new Date().toISOString() : null
      };

      // If requested by an admin, process balance injection immediately!
      if (isUserAdmin) {
        const users = loadUsers();
        const userIndex = users.findIndex(u => u.phoneNumberOrEmail.trim().toLowerCase() === phoneNumberOrEmail.trim().toLowerCase());
        if (userIndex !== -1) {
          users[userIndex].balance += Number(amount);
          saveUsers(users);
        }
      }

      deposits.push(newDeposit);
      saveDeposits(deposits);

      res.json({ 
        success: true, 
        message: isUserAdmin 
          ? "Đã cộng thử nghiệm trực tiếp cho Admin!" 
          : "Gửi yêu cầu nạp tiền chờ duyệt thành công!",
        deposit: newDeposit 
      });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  app.post("/api/deposits/approve", (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: "Thiếu ID yêu cầu" });
      }

      const deposits = loadDeposits();
      const depositIndex = deposits.findIndex(d => d.id === id);
      if (depositIndex === -1) {
        return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu nạp tiền" });
      }

      const deposit = deposits[depositIndex];
      if (deposit.status !== "pending") {
        return res.status(400).json({ success: false, message: "Yêu cầu này đã được xử lý từ trước!" });
      }

      // Update state
      deposit.status = "approved";
      deposit.processedAt = new Date().toISOString();
      deposits[depositIndex] = deposit;
      saveDeposits(deposits);

      // Increase user balance
      const users = loadUsers();
      const userIndex = users.findIndex(u => u.phoneNumberOrEmail.trim().toLowerCase() === deposit.phoneNumberOrEmail.trim().toLowerCase());
      if (userIndex !== -1) {
        users[userIndex].balance += deposit.amount;
        saveUsers(users);
      }

      res.json({ success: true, message: "Duyệt nạp tiền thành công! Đã cộng số dư cho người dùng." });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  app.post("/api/deposits/reject", (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: "Thiếu ID yêu cầu" });
      }

      const deposits = loadDeposits();
      const depositIndex = deposits.findIndex(d => d.id === id);
      if (depositIndex === -1) {
        return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu nạp tiền" });
      }

      const deposit = deposits[depositIndex];
      if (deposit.status !== "pending") {
        return res.status(400).json({ success: false, message: "Yêu cầu này đã được xử lý từ trước!" });
      }

      deposit.status = "rejected";
      deposit.processedAt = new Date().toISOString();
      deposits[depositIndex] = deposit;
      saveDeposits(deposits);

      res.json({ success: true, message: "Đã hủy bỏ yêu cầu nạp tiền!" });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  app.get("/api/users/get", (req, res) => {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ success: false, message: "Missing username param" });
    }
    const users = loadUsers();
    const user = users.find(u => u.phoneNumberOrEmail.trim().toLowerCase() === (username as string).trim().toLowerCase());
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  });

  app.post("/api/users/update-balance", (req, res) => {
    const { username, balance } = req.body;
    if (!username || balance === undefined) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.phoneNumberOrEmail.trim().toLowerCase() === (username as string).trim().toLowerCase());
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    users[userIndex].balance = Number(balance);
    saveUsers(users);
    res.json({ success: true, balance: users[userIndex].balance });
  });

  app.post("/api/users/login", (req, res) => {
    try {
      console.log("[SERVERAPI] POST /api/users/login called body:", req.body);
      const { username, password } = req.body;
      if (!username || !password) {
        console.warn("[SERVERAPI] Missing login username or password");
        return res.status(400).json({ success: false, message: "Vui lòng nhập tài khoản và mật khẩu" });
      }
      const users = loadUsers();
      const user = users.find(u => u.phoneNumberOrEmail.trim().toLowerCase() === username.trim().toLowerCase());
      if (!user) {
        console.warn(`[SERVERAPI] User not found: ${username}`);
        return res.status(404).json({ success: false, message: "Tài khoản không tồn tại trên hệ thống!" });
      }
      if (user.password !== password) {
        console.warn(`[SERVERAPI] Incorrect password for user: ${username}`);
        return res.status(401).json({ success: false, message: "Mật khẩu không chính xác!" });
      }
      console.log(`[SERVERAPI] Login successful for: ${username}`);
      return res.json({ success: true, user });
    } catch (apiErr: any) {
      console.error("[SERVERAPI] Error in POST /api/users/login:", apiErr);
      return res.status(500).json({ success: false, message: "Lỗi hệ thống đăng nhập: " + apiErr.message });
    }
  });

  app.post("/api/users/register", (req, res) => {
    try {
      console.log("[SERVERAPI] POST /api/users/register called body:", req.body);
      const { username, password, referredBy } = req.body;
      if (!username || !password) {
        console.warn("[SERVERAPI] Missing register username or password");
        return res.status(400).json({ success: false, message: "Thiếu tài khoản hoặc mật khẩu" });
      }
      const users = loadUsers();
      const exists = users.some(u => u.phoneNumberOrEmail.trim().toLowerCase() === username.trim().toLowerCase());
      if (exists) {
        console.warn(`[SERVERAPI] Registration user already exists: ${username}`);
        return res.status(400).json({ success: false, message: "Tài khoản/SĐT này đã tồn tại!" });
      }

      let validReferrerCode: string | undefined = undefined;
      if (referredBy && referredBy.trim()) {
        const matched = users.find(u => u.referralCode.trim().toLowerCase() === referredBy.trim().toLowerCase());
        if (!matched) {
          return res.status(400).json({ success: false, message: "Mã giới thiệu không tồn tại trên hệ thống!" });
        }
        validReferrerCode = matched.referralCode;
      }

      const newUser: UserRecord = {
        phoneNumberOrEmail: username,
        password: password,
        referralCode: "AFF-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
        referralEarnings: 0,
        balance: 100000, // 100k welcome test balance
        isAdmin: ["0344920065", "woolocie@gmail.com"].includes(username.trim().toLowerCase()) && password === "Quocloc@21",
        referredBy: validReferrerCode
      };

      users.push(newUser);
      saveUsers(users);
      console.log(`[SERVERAPI] Successfully registered new user: ${username}`);
      return res.json({ success: true, user: newUser });
    } catch (apiErr: any) {
      console.error("[SERVERAPI] Error in POST /api/users/register:", apiErr);
      return res.status(500).json({ success: false, message: "Lỗi hệ thống đăng ký: " + apiErr.message });
    }
  });

  // API 1: Fetch all keys (Admin & display purposes on the dashboard)
  app.get("/api/keys", (req, res) => {
    const keys = loadKeys();
    res.json({ success: true, keys });
  });

  // API 2: Create a newly purchased or won Key from the website
  app.post("/api/keys/create", (req, res) => {
    const { key, tier, buyerEmail, price } = req.body;

    if (!key || !tier) {
      return res.status(400).json({ success: false, message: "Missing required fields: key, tier" });
    }

    const keys = loadKeys();

    // Check if key already exists to prevent duplicate entries
    if (keys.some(k => k.key === key)) {
      return res.status(400).json({ success: false, message: "Key already registered on server!" });
    }

    // Process referral commission if any
    if (buyerEmail && price && Number(price) > 0) {
      const users = loadUsers();
      const buyer = users.find(u => u.phoneNumberOrEmail.trim().toLowerCase() === buyerEmail.trim().toLowerCase());
      if (buyer && buyer.referredBy) {
        const referrerIndex = users.findIndex(u => u.referralCode.trim().toLowerCase() === buyer.referredBy!.trim().toLowerCase());
        if (referrerIndex !== -1) {
          const commAmount = Math.round(Number(price) * 0.1);
          users[referrerIndex].referralEarnings += commAmount;
          users[referrerIndex].balance += commAmount;
          saveUsers(users);
          console.log(`[REFERRAL COMMISSION] Added ${commAmount} VNĐ (10% of ${price}) to referrer ${users[referrerIndex].phoneNumberOrEmail} (Code: ${buyer.referredBy}) because ${buyerEmail} bought a key`);
        }
      }
    }

    let durationMs = 0;
    if (tier === "15days" || tier.includes("15")) {
      durationMs = 15 * 24 * 60 * 60 * 1000;
    } else if (tier === "30days" || tier.includes("30")) {
      durationMs = 30 * 24 * 60 * 60 * 1000;
    } else if (tier === "3days" || tier.includes("3")) {
      durationMs = 3 * 24 * 60 * 60 * 1000;
    }

    const expiresAt = durationMs > 0 ? new Date(Date.now() + durationMs).toISOString() : null;

    const newKeyRecord: KeyRecord = {
      key,
      tier,
      hwid: null,
      createdAt: new Date().toISOString(),
      expiresAt,
      buyerEmail: buyerEmail || "anonymous@buyplay.com"
    };

    keys.push(newKeyRecord);
    saveKeys(keys);

    console.log(`[API] Created new key on server: ${key} (${tier}) for ${buyerEmail}`);
    res.json({ success: true, message: "Key created successfully on server database!", record: newKeyRecord });
  });

  // API 3: Verify the Key from the Python automation application & lock it to HWID
  app.post("/api/keys/verify", (req, res) => {
    const { key, hwid } = req.body;

    if (!key || !hwid) {
      return res.status(400).json({
        success: false,
        message: "Yêu cầu cung cấp đầy đủ 'key' và 'hwid' (Mã phần cứng máy tính)!"
      });
    }

    const keys = loadKeys();
    const foundIndex = keys.findIndex(k => k.key.trim() === key.trim());

    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Mã KEY không tồn tại trên hệ thống. Vui lòng kiểm tra lại!"
      });
    }

    const keyRecord = keys[foundIndex];

    // Check Expiration
    if (keyRecord.expiresAt) {
      const expiryDate = new Date(keyRecord.expiresAt);
      if (expiryDate.getTime() < Date.now()) {
        return res.status(403).json({
          success: false,
          message: `KEY này đã HẾT HẠN sử dụng vào ngày ${expiryDate.toLocaleString("vi-VN")}!`
        });
      }
    }

    // CHECK HWID BINDING (Lock 1 key to 1 PC)
    if (!keyRecord.hwid) {
      // First time activating: lock this key to the requester's HWID!
      keyRecord.hwid = hwid;
      keys[foundIndex] = keyRecord;
      saveKeys(keys);

      console.log(`[HWID-LOCK] Key ${key} first activation. Bound to computer HWID: ${hwid}`);
      return res.json({
        success: true,
        message: "Kích hoạt phần mềm thành công trên thiết bị hiện tại (Đã khóa HWID)!",
        tier: keyRecord.tier,
        expiresAt: keyRecord.expiresAt ? new Date(keyRecord.expiresAt).toLocaleString("vi-VN") : "Vĩnh viễn",
        hwid: keyRecord.hwid
      });
    }

    // Key has an existing HWID lock. Compare it!
    if (keyRecord.hwid.trim() === hwid.trim()) {
      return res.json({
        success: true,
        message: "Xác thực KEY thành công! Bạn đang sử dụng đúng thiết bị đăng ký.",
        tier: keyRecord.tier,
        expiresAt: keyRecord.expiresAt ? new Date(keyRecord.expiresAt).toLocaleString("vi-VN") : "Vĩnh viễn",
        hwid: keyRecord.hwid
      });
    } else {
      return res.status(403).json({
        success: false,
        message: `Lỗi: KEY này đã được kích hoạt và khóa bởi một máy tính khác!\n\nHWID đăng ký: ${keyRecord.hwid}\nHWID của bạn: ${hwid}\n\nVui lòng hệ Admin để xin reset HWID hoặc mua một KEY mới!`
      });
    }
  });

  // Handle Vite middleware integration for web asset serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully operational. Public site and REST APIs running on port ${PORT}`);
  });
}

startServer();
