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

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set up middleware to parse incoming JSON in requests
  app.use(express.json());

  // CORS support so external python requests and browsers can make calls safely
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // API 1: Fetch all keys (Admin & display purposes on the dashboard)
  app.get("/api/keys", (req, res) => {
    const keys = loadKeys();
    res.json({ success: true, keys });
  });

  // API 2: Create a newly purchased or won Key from the website
  app.post("/api/keys/create", (req, res) => {
    const { key, tier, buyerEmail } = req.body;

    if (!key || !tier) {
      return res.status(400).json({ success: false, message: "Missing required fields: key, tier" });
    }

    const keys = loadKeys();

    // Check if key already exists to prevent duplicate entries
    if (keys.some(k => k.key === key)) {
      return res.status(400).json({ success: false, message: "Key already registered on server!" });
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
