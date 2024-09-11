"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkAuthentication();
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setLoggedIn(false);
      setDropdownOpen(false);

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      router.push("/auth");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          {/* Logo */}
          {/* Title */}
          <div className="text-2xl font-semibold text-gray-800 tracking-tight">
            <Link href="/">DocSync</Link>
          </div>
        </div>

        <nav className="flex space-x-6 items-center">
          {loggedIn ? (
            // Authenticated Navigation
            <>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Profile
              </Link>

              {/* Avatar with Dropdown */}
              <div className="relative">
                <Avatar
                  onClick={toggleDropdown}
                  className="cursor-pointer hover:ring-2 ring-blue-400 transition-all duration-200"
                >
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <Button
                      onClick={handleLogout}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Unauthenticated Navigation
            <>
              <Link
                href="/auth"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Login
              </Link>
              <Link href="/auth">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-200">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
