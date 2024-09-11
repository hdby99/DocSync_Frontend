"use client";
import React, { useState, useEffect } from "react";
import Avatar from "boring-avatars";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // Assuming Shadcn's Card component
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Shadcn input

interface User {
  name: string;
  email: string;
  createdAt: string; // Profile creation date
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState(""); // For password change
  const [message, setMessage] = useState(""); // For success and error messages

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) {
      setError("User ID not found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach the JWT token
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch user data. Status code: ${response.status}`
          );
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handlePasswordChange = async () => {
    // Validate password
    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/user/${userId}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach the JWT token
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const res = await response.json();

      if (!response.ok) {
        // Handle server-side error
        throw new Error(res.message || "Failed to update password.");
      }

      // On successful password update
      setMessage("Password updated successfully.");
    } catch (err) {
      setMessage(
        (err as Error).message || "Error changing password, please retry."
      );
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-8">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-8">No user data found.</div>;
  }

  // Format the createdAt date
  const formattedCreationDate = new Date(user.createdAt).toLocaleDateString();

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{ height: "90vh" }}
    >
      <Card className="w-full max-w-xs md:max-w-md lg:max-w-lg p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Profile Page</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {/* Boring Avatar for the user */}
          <Avatar
            size={80}
            name={user.name}
            variant="beam"
            colors={["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#6A0572"]}
          />

          {/* Name and Edit Button */}
          <div className="flex items-center mt-4 space-x-2">
            <h2 className="text-xl">Name: {user.name}</h2>
          </div>

          <p className="text-gray-600 mt-2">Email: {user.email}</p>

          {/* Change Password Section */}
          <div className="w-full mt-6">
            <h3 className="text-lg font-semibold mb-2">Change Password</h3>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {message && (
              <p
                className={`text-sm mt-2 ${
                  message.startsWith("Password updated")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
            <Button onClick={handlePasswordChange} className="mt-4 w-full">
              Update Password
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-400">
            Profile created on: {formattedCreationDate}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;
