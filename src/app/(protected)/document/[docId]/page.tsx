"use client";
import Editor from "@/components/Editor/Editor";
import { useParams } from "next/navigation";

const DocId = () => {
  const { docId } = useParams();

  return (
    <>
      <div className="p-4 overflow-y-hidden">
        <Editor documentId={docId as string} />
      </div>
    </>
  );
};

export default DocId;
