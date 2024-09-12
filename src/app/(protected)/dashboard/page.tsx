"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
// import Quill from "quill"; // Import QuillJS
import "quill/dist/quill.snow.css"; // Quill styles
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loaderAnimation from "../../../../public/loader.json";

import dynamic from "next/dynamic"; // Dynamically import components
// const QuillNoSSRWrapper = dynamic(() => import("quill"), { ssr: false });

const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          setError("User not authenticated");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/getDocuments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();
        setDocuments(data.documents);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError("Failed to fetch documents");
      }
    };

    fetchDocuments();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 0.5 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <Lottie
            animationData={loaderAnimation}
            loop={true}
            style={{ width: 500, height: 500 }}
          />
        </motion.div>
        <p className="mt-4 text-lg font-semibold text-gray-700">
          Loading your documents, hang tight!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Documents</h1>

      {error && <p className="text-red-500">{error}</p>}

      {documents.length === 0 && !error ? (
        <p>No documents found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {" "}
          {documents.map((document: any) => (
            <DocumentCard key={document._id} document={document} />
          ))}
        </div>
      )}
    </div>
  );
};

const DocumentCard = ({ document }: { document: any }) => {
  const quillRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (quillRef.current) {
  //     const quill = new Quill(quillRef.current, {
  //       readOnly: true,
  //       theme: "bubble",
  //     });

  //     if (document.data && document.data.ops) {
  //       quill.setContents(document.data.ops);
  //     }
  //   }
  // }, [document]);

  useEffect(() => {
    if (typeof window !== "undefined" && quillRef.current) {
      // Dynamically import Quill on the client side
      import("quill").then((Quill) => {
        // Ensure quillRef.current is not null
        if (quillRef.current) {
          const quill = new Quill.default(quillRef.current, {
            readOnly: true,
            theme: "bubble",
          });

          // Set the document content if available
          if (document.data && document.data.ops) {
            quill.setContents(document.data.ops);
          }
        }
      });
    }
  }, [document]);

  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white">
      <Link href={`/document/${document._id}`}>
        <div className="h-48 mb-4 bg-gray-100 flex justify-center items-center text-gray-500">
          <div
            ref={quillRef}
            className="w-full h-full overflow-hidden"
            style={{ maxHeight: "150px" }}
          ></div>
        </div>
      </Link>
      <div>
        <Link
          href={`/document/${document._id}`}
          className="text-blue-600 hover:underline text-lg font-medium block"
        >
          {document.title ? document.title : `Document ID: ${document._id}`}
        </Link>
        <p className="text-gray-500 text-sm">
          Last updated: {new Date(document.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
