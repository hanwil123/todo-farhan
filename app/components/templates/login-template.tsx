"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { FormField } from "../molecules/form-field";
import { LoginInput } from "@/app/lib/validation/auth";
import { Button } from "../atoms/button";
// import { Input } from "../atoms/input";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const [formLogin, setFormLogin] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormLogin({
      ...formLogin,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const { error } = await signIn(formLogin.email, formLogin.password);

      if (error) {
        setErrors({ email: "Invalid email or password", password: "Invalid email or password" });
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setErrors({ email: "An error occurred. Please try again.", password: "An error occurred. Please try again." });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

        {errors && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
            {errors.email || errors.password}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            error={errors.email || ""}
          />
          <FormField
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            error={errors.password || ""}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
