"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import collaborationAnimation from "../../../../public/collaboration.json";

const Documents = () => {
  const router = useRouter();
  const handleRedirect = () => {
    const docId = uuidv4();
    console.log("redirecting", docId);
    router.push(`/document/${docId}`);
  };

  return (
    <div
      className="flex flex-col items-center justify-center p-8 bg-white overflow-hidden"
      style={{ height: "90vh" }}
    >
      {/* Animation Section */}
      <motion.div
        className="w-full max-w-lg mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Lottie animationData={collaborationAnimation} loop={true} />
      </motion.div>

      <div className="max-w-3xl text-left space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Collaborative Editing & Real-Time Chat
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Our platform allows you to experience seamless document collaboration,
          where multiple users can edit the same document simultaneously. Stay
          connected with our real-time chat feature, allowing for instant
          communication while editing.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed">
          Make document collaboration easy and efficient with built-in tools for
          managing content and team interactions, all in one place.
        </p>
      </div>

      <div className="mt-8">
        <Button
          onClick={handleRedirect}
          className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Documents;
