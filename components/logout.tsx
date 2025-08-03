// logout.tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut(); // Clears session cookie
      router.push("/");           // Redirects to home
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}
