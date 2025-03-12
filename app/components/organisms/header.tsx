"use client";

import { useAuthStore } from "@/app/lib/store/authStore";
import { Button } from "../atoms/button";
// import { useAuth } from "../../context/auth-context";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/");

  }

  return (
    <header className="border-b bg-gray-800 text-white">
      <div className="container mx-auto py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          HanTodo
        </Link>

        {user && isLoggedIn && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-white">
              {user.email} ({user.role})
            </span>

            <Button variant="outline" size="sm" onClick={() => handleLogout()}>
              Sign Out
            </Button>
          </div>
        )}

        {!user && !isLoggedIn && pathname !== "/components/pages/login" && (
          <Link href="/components/pages/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
