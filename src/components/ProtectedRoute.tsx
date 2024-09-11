"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number;
  // Add other properties if needed
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/auth");
        return;
      }

      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000; // Convert to seconds

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          router.replace("/auth");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        localStorage.removeItem("token");
        router.replace("/auth");
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
