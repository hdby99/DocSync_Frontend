// components/Layout/MainHeader.tsx

import React from "react";
import { Button } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggle";

const MainHeader: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-200 shadow-md">
      {/* Logo and App Name */}
      <div className="flex items-center">
        {/* <img src="/images/logo.png" alt="Docs Logo" className="h-8 w-8 mr-3" /> */}
        <h1 className="text-xl font-semibold text-gray-800">Docs Clone</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex space-x-4">
        <Button className="bg-blue-500 text-white hover:bg-blue-600">
          Home
        </Button>
        <Button className="bg-blue-500 text-white hover:bg-blue-600">
          Dashboard
        </Button>
        <Button className="bg-blue-500 text-white hover:bg-blue-600">
          Profile
        </Button>
      </nav>
    </header>
  );
};

export default MainHeader;
