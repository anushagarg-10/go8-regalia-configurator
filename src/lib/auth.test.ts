/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  getSession,
  listLooks,
  removeLook,
  saveLook,
  signIn,
  signOut,
  signUp,
  validateEmail,
  validatePassword,
} from "@/lib/auth";

beforeEach(() => {
  window.localStorage.clear();
});

describe("validateEmail", () => {
  it("accepts normal addresses and rejects junk", () => {
    expect(validateEmail("grad@uni.edu.au")).toBe(true);
    expect(validateEmail("  grad@uni.edu.au  ")).toBe(true);
    expect(validateEmail("not-an-email")).toBe(false);
    expect(validateEmail("a@b")).toBe(false);
    expect(validateEmail("")).toBe(false);
  });
});

describe("validatePassword", () => {
  it("requires at least 8 characters", () => {
    expect(validatePassword("short")).toMatch(/8 characters/);
    expect(validatePassword("longenough")).toBeNull();
  });
});

describe("sign up and sign in", () => {
  it("creates an account, starts a session, and signs back in", async () => {
    const signup = await signUp("Grad@Uni.edu.au", "password123", "Grad");
    expect(signup.ok).toBe(true);
    expect(getSession()?.email).toBe("grad@uni.edu.au");

    signOut();
    expect(getSession()).toBeNull();

    const signin = await signIn("grad@uni.edu.au", "password123");
    expect(signin.ok).toBe(true);
    expect(getSession()?.name).toBe("Grad");
  });

  it("rejects duplicate signups, unknown users, and wrong passwords", async () => {
    await signUp("grad@uni.edu.au", "password123", "Grad");

    const dup = await signUp("grad@uni.edu.au", "password456", "Again");
    expect(dup.ok).toBe(false);

    const missing = await signIn("nobody@uni.edu.au", "password123");
    expect(missing.ok).toBe(false);

    const wrong = await signIn("grad@uni.edu.au", "wrongpassword");
    expect(wrong.ok).toBe(false);
    expect(getSession()?.email).toBe("grad@uni.edu.au"); // still the signup session
  });

  it("rejects invalid emails and short passwords", async () => {
    expect((await signUp("bad", "password123", "X")).ok).toBe(false);
    expect((await signUp("ok@uni.edu.au", "tiny", "X")).ok).toBe(false);
  });

  it("does not store the plaintext password", async () => {
    await signUp("grad@uni.edu.au", "password123", "Grad");
    expect(window.localStorage.getItem("go8.users")).not.toContain("password123");
  });
});

describe("saved looks", () => {
  it("saves, dedupes, lists, and removes looks per user", () => {
    saveLook("grad@uni.edu.au", { universityId: "monash", level: "bachelor", label: "Monash Bachelor" });
    saveLook("grad@uni.edu.au", { universityId: "anu", level: "phd", label: "ANU PhD" });
    // Saving the same combination again replaces rather than duplicates.
    saveLook("grad@uni.edu.au", { universityId: "monash", level: "bachelor", label: "Monash Bachelor" });

    const looks = listLooks("grad@uni.edu.au");
    expect(looks).toHaveLength(2);
    expect(looks[0].universityId).toBe("monash");

    expect(listLooks("other@uni.edu.au")).toHaveLength(0);

    const remaining = removeLook("grad@uni.edu.au", "monash", "bachelor");
    expect(remaining).toHaveLength(1);
    expect(remaining[0].universityId).toBe("anu");
  });
});
