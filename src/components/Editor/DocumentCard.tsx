import React, { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Quill from "quill"; // Import QuillJS
import "quill/dist/quill.bubble.css"; // Import Quill's bubble theme

const DocumentCard = ({ document }: { document: any }) => {
  const quillRef = useRef<HTMLDivElement>(null); // Use ref to attach Quill to the div

  // Use useCallback to initialize Quill when the ref is available
  const initializeQuill = useCallback(() => {
    if (quillRef.current) {
      // Clear any previous content inside the quillRef
      quillRef.current.innerHTML = "";

      // Initialize Quill with readOnly and bubble theme
      const quill = new Quill(quillRef.current, {
        readOnly: true,
        theme: "bubble",
      });

      // Set the content of the document if available
      if (document.data && document.data.ops) {
        quill.setContents(document.data.ops);
      }
    }
  }, [document]);

  // Call initializeQuill after the component mounts or when the document changes
  useEffect(() => {
    initializeQuill();
  }, [initializeQuill]);

  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white">
      <Link href={`/document/${document._id}`}>
        <div className="h-48 mb-4 bg-gray-100 flex justify-center items-center text-gray-500">
          {/* Render the quillRef div directly and attach Quill to it */}
          <div
            className="w-full h-full overflow-hidden"
            ref={quillRef}
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

export default DocumentCard;
