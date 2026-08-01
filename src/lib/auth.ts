import type { DegreeLevel } from "@/lib/regalia";

/**
 * Demo authentication + saved looks, persisted in localStorage.
 *
 * This is deliberately a thin, swappable layer: every consumer goes through
 * these functions, so replacing the storage calls with Supabase Auth and a
 * `saved_looks` table later does not touch any component code. Passwords are
 * salted and hashed with SHA-256 before storage, but this is still a demo,
 * not a production credential store, and the UI says so.
 */

const USERS_KEY = "go8.users";
const SESSION_KEY = "go8.session";
const LOOKS_PREFIX = "go8.looks:";

/** Fired on window whenever the session changes, so UI can re-sync. */
export const AUTH_EVENT = "go8:auth-changed";

export function announceAuthChange(): void {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

/** Subscribe to session changes (this tab and others). For useSyncExternalStore. */
export function subscribeToAuth(callback: () => void): () => void {
  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Raw session JSON; referentially stable between changes for snapshotting. */
export function getSessionRaw(): string | null {
  if (!storageAvailable()) return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export interface DemoUser {
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface Session {
  email: string;
  name: string;
}

export interface SavedLook {
  universityId: string;
  level: DegreeLevel;
  label: string;
  savedAt: string;
}

export type AuthResult = { ok: true; session: Session } | { ok: false; error: string };

function storageAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!storageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!storageAvailable()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function signUp(email: string, password: string, name: string): Promise<AuthResult> {
  const normalized = normalizeEmail(email);
  if (!validateEmail(normalized)) return { ok: false, error: "Enter a valid email address." };
  const passwordError = validatePassword(password);
  if (passwordError) return { ok: false, error: passwordError };
  const displayName = name.trim() || normalized.split("@")[0];

  const users = readJson<Record<string, DemoUser>>(USERS_KEY, {});
  if (users[normalized]) return { ok: false, error: "An account with this email already exists. Sign in instead." };

  const salt = Math.random().toString(36).slice(2, 12);
  users[normalized] = {
    email: normalized,
    name: displayName,
    passwordHash: await hashPassword(password, salt),
    salt,
    createdAt: new Date().toISOString(),
  };
  writeJson(USERS_KEY, users);

  const session: Session = { email: normalized, name: displayName };
  writeJson(SESSION_KEY, session);
  return { ok: true, session };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const normalized = normalizeEmail(email);
  const users = readJson<Record<string, DemoUser>>(USERS_KEY, {});
  const user = users[normalized];
  if (!user) return { ok: false, error: "No account found for this email. Create one first." };

  const hash = await hashPassword(password, user.salt);
  if (hash !== user.passwordHash) return { ok: false, error: "Incorrect password. Try again." };

  const session: Session = { email: user.email, name: user.name };
  writeJson(SESSION_KEY, session);
  return { ok: true, session };
}

export function getSession(): Session | null {
  return readJson<Session | null>(SESSION_KEY, null);
}

export function signOut(): void {
  if (!storageAvailable()) return;
  window.localStorage.removeItem(SESSION_KEY);
}

function looksKey(email: string): string {
  return `${LOOKS_PREFIX}${normalizeEmail(email)}`;
}

export function listLooks(email: string): SavedLook[] {
  return readJson<SavedLook[]>(looksKey(email), []);
}

export function saveLook(email: string, look: Omit<SavedLook, "savedAt">): SavedLook[] {
  const looks = listLooks(email).filter(
    (l) => !(l.universityId === look.universityId && l.level === look.level),
  );
  looks.unshift({ ...look, savedAt: new Date().toISOString() });
  writeJson(looksKey(email), looks);
  return looks;
}

export function removeLook(email: string, universityId: string, level: DegreeLevel): SavedLook[] {
  const looks = listLooks(email).filter(
    (l) => !(l.universityId === universityId && l.level === level),
  );
  writeJson(looksKey(email), looks);
  return looks;
}
