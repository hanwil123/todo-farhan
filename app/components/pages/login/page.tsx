"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/context/auth-context";
import { FormField } from "../../molecules/form-field";
import { Button } from "../../atoms/button";
import { LoginInput } from "@/app/lib/validation/auth";
import { useAuthStore } from "@/app/lib/store/authStore";

export default function LoginPage() {
  const [formLogin, setFormLogin] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formLogin.email, formLogin.password);

      // if (!result) {
      //   setError("Invalid email or password");
      //   return;
      // }

      router.push("./dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            id="email"
            type="email"
            value={formLogin.email}
            onChange={(e) =>
              setFormLogin({ ...formLogin, email: e.target.value })
            }
            // required
            placeholder="your@email.com"
            label="Email"
            name="email"
          />

          <FormField
            id="password"
            type="password"
            value={formLogin.password}
            onChange={(e) =>
              setFormLogin({ ...formLogin, password: e.target.value })
            }
            // required
            placeholder="••••••••"
            label="Password"
            name="password"
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
