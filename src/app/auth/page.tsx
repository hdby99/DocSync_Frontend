"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface FormData {
  name?: string;
  email: string;
  password: string;
}

const AuthPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up
  const [apiError, setApiError] = useState<string | null>(null); // Display errors
  const router = useRouter(); // Router to handle navigation after login/signup

  const onSubmit = async (data: FormData) => {
    setApiError(null); // Clear previous errors

    try {
      const url = isLogin
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Send form data to the backend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Authentication failed");
      }

      const { token, userId } = await response.json();
      localStorage.setItem("token", token); // Store the JWT token
      localStorage.setItem("userId", userId);

      // Redirect to a protected page (for example, the document page)
      router.push("/document");
    } catch (error: any) {
      setApiError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="bg-white text-black w-full max-w-md p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* Show API Error */}
        {apiError && (
          <p className="text-red-500 text-center mb-4">{apiError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <div className="mb-4">
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <Input
                type="text"
                id="name"
                className="mt-1 block w-full"
                {...register("name", {
                  required: !isLogin ? "Name is required" : false,
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof errors.name.message === "string"
                    ? errors.name.message
                    : ""}
                </p>
              )}
            </div>
          )}

          <div className="mb-4">
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              className="mt-1 block w-full"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {typeof errors.email.message === "string"
                  ? errors.email.message
                  : ""}
              </p>
            )}
          </div>

          <div className="mb-6">
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              type="password"
              id="password"
              className="mt-1 block w-full"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-blue-600"
            >
              {isLogin ? "Sign Up" : "Login"}
            </Button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
