"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io, Socket } from "socket.io-client";
import Delta from "quill-delta";
import { Input } from "../ui/input";
import Chat from "./ChatTab";

interface EditorProps {
  documentId: string;
}

type RangeStatic = {
  index: number;
  length: number;
};

const Editor: React.FC<EditorProps> = ({ documentId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const userId = useRef(localStorage.getItem("userId") || "unknown"); // Retrieve userId from localStorage
  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("Untitled Document");

  useEffect(() => {
    const s = io("http://localhost:8000");
    setSocket(s);

    s.on("title-updated", (newTitle: string) => {
      setTitle(newTitle);
    });

    return () => {
      s.disconnect();
      s.off("title-updated", (newTitle: string) => {
        setTitle(newTitle);
      });
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document, title) => {
      quill.setContents(document);
      quill.enable();
      setTitle(title);
    });

    socket.emit("get-document", documentId, userId.current);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", documentId, quill.getContents());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill, documentId]);

  // Send text changes to the server
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handleTextChange = (
      delta: Delta,
      oldDelta: Delta,
      source: string
    ) => {
      if (source !== "user") return;
      socket.emit("send-change", delta, documentId);
    };

    quill.on("text-change", handleTextChange);

    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handleReceiveChange = (delta: Delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-change", handleReceiveChange);

    return () => {
      socket.off("receive-change", handleReceiveChange);
    };
  }, [socket, quill]);

  // Send cursor position to the server
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handleSelectionChange = (range: RangeStatic | null) => {
      if (range == null) return;
      socket.emit("send-cursor", { userId: userId.current, range, documentId });
    };

    quill.on("selection-change", handleSelectionChange);

    return () => {
      quill.off("selection-change", handleSelectionChange);
    };
  }, [socket, quill]);

  // Receive and render other users' cursors
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handleCursorReceive = ({
      userId: remoteUserId,
      range,
    }: {
      userId: string;
      range: RangeStatic;
    }) => {
      if (remoteUserId === userId.current) return;

      // Remove any existing cursor for this user
      document.querySelector(`.cursor-${remoteUserId}`)?.remove();

      // Create a new cursor element
      const cursor = document.createElement("div");
      cursor.className = `cursor cursor-${remoteUserId}`;
      cursor.style.position = "absolute";
      cursor.style.backgroundColor = "blue";
      cursor.style.height = "5px";
      cursor.style.width = "5px";
      cursor.style.zIndex = "10";

      setTimeout(() => {
        const bounds = quill.getBounds(range.index);
        cursor.style.left = `${bounds?.left}px`;
        cursor.style.top = `${bounds?.top}px`;

        const editorContainer = quill.container;
        editorContainer.appendChild(cursor);
      }, 0);
    };

    socket.on("receive-cursor", handleCursorReceive);

    const handleUserUpdate = (users: any[]) => {
      console.log("Users currently editing:", typeof users);
    };

    socket.on("update-users", handleUserUpdate);
    socket.once("user-disconnect", (remoteUserId: string) => {
      document.querySelector(`.cursor-${remoteUserId}`)?.remove();
    });

    return () => {
      socket.off("receive-cursor", handleCursorReceive);
      socket.off("update-users", handleUserUpdate);
    };
  }, [socket, quill]);

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ["clean"], // remove formatting button
  ];

  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, {
      modules: {
        toolbar: toolbarOptions,
      },
      theme: "snow",
    });
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  const handleTitleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (socket) {
      socket.emit("update-title", documentId, title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex h-screen overflow-x-hidden">
      <div className="flex-grow p-4 overflow-y-auto">
        {/* Centered Title */}
        <div className="flex justify-center mb-8">
          {isEditing ? (
            <Input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="text-4xl font-bold text-center border-none focus:outline-none focus:ring-0"
              autoFocus
            />
          ) : (
            <h1
              onClick={handleTitleClick}
              className="text-4xl font-bold text-center cursor-pointer"
            >
              {title}
            </h1>
          )}
        </div>

        <div className="container mx-auto" ref={wrapperRef}></div>
      </div>

      <div className="w-1/4 p-4 border-l h-full sticky top-0 overflow-x-auto">
        <Chat socket={socket} documentId={documentId} />
      </div>
    </div>
  );
};

export default Editor;
