import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button"; // Assuming Shadcn Button component
import { Input } from "@/components/ui/input"; // Assuming Shadcn Input component

const ChatTab: React.FC<{ socket: Socket | null; documentId: string }> = ({
  socket,
  documentId,
}) => {
  const [messages, setMessages] = useState<
    Array<{
      userId: string;
      userName: string;
      message: string;
      timestamp: string;
    }>
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for the chat container

  useEffect(() => {
    if (!socket) return;

    socket.emit("load-chat", documentId);

    socket.on("load-chats", (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on("receive-chat", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off("load-chats");
      socket.off("receive-chat");
    };
  }, [socket, documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !socket) return;

    const messageData = {
      userId: localStorage.getItem("userId"),
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send-chat", { ...messageData, documentId });
    setNewMessage(""); // Clear the input field
  };

  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  return (
    <div className="chat-section border-l p-4 w-80 sticky top-0">
      <h2 className="font-semibold text-lg mb-4">Chat</h2>
      <div
        className="chat-messages h-96 overflow-y-auto mb-4 bg-gray-50 p-2 rounded-lg"
        ref={chatContainerRef}
      >
        {messages?.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.userName}</strong>: {msg.message}{" "}
            <span className="text-sm text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-grow"
        />
        <Button onClick={handleSendMessage} className="bg-blue-500">
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatTab;
