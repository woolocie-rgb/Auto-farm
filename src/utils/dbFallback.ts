import { User } from "../types";

export interface LocalUserRecord {
  phoneNumberOrEmail: string;
  password?: string;
  referralCode: string;
  referralEarnings: number;
  balance: number;
  isAdmin: boolean;
}

export interface LocalKeyRecord {
  key: string;
  tier: string;
  hwid: string | null;
  createdAt: string;
  expiresAt: string | null;
  buyerEmail: string;
}

export function initLocalDB() {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem("local_users_db")) {
    const defaultUsers: LocalUserRecord[] = [
      {
        phoneNumberOrEmail: "woolocie@gmail.com",
        password: "Quocloc@21",
        referralCode: "AFF-WOOLO",
        referralEarnings: 2450000,
        balance: 10000000,
        isAdmin: true
      },
      {
        phoneNumberOrEmail: "0334410858",
        password: "Quocloc@21",
        referralCode: "AFF-LOC",
        referralEarnings: 5000000,
        balance: 10000000,
        isAdmin: true
      }
    ];
    localStorage.setItem("local_users_db", JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem("local_keys_db")) {
    const defaultKeys: LocalKeyRecord[] = [
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
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        buyerEmail: "woolocie@gmail.com"
      }
    ];
    localStorage.setItem("local_keys_db", JSON.stringify(defaultKeys));
  }
}

export function getLocalUsers(): LocalUserRecord[] {
  initLocalDB();
  const raw = localStorage.getItem("local_users_db");
  return raw ? JSON.parse(raw) : [];
}

export function saveLocalUsers(users: LocalUserRecord[]) {
  localStorage.setItem("local_users_db", JSON.stringify(users));
}

export function getLocalKeys(): LocalKeyRecord[] {
  initLocalDB();
  const raw = localStorage.getItem("local_keys_db");
  return raw ? JSON.parse(raw) : [];
}

export function saveLocalKeys(keys: LocalKeyRecord[]) {
  localStorage.setItem("local_keys_db", JSON.stringify(keys));
}
