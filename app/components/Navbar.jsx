"use client"

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import React, { useState } from "react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


  return (
    <nav className="bg-gray-800 py-4 px-6 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-teal-500">
          InkVote
        </a>
        <div className="hidden md:flex space-x-6">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            Home
          </a>
          <a
            href="#artists"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            Artists
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            About
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            Contact
          </a>
        </div>
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-white transition duration-300"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <a
            href="#"
            className="block text-gray-300 hover:text-white transition duration-300"
          >
            Home
          </a>
          <a
            href="#artists"
            className="block text-gray-300 hover:text-white transition duration-300"
          >
            Artists
          </a>
          <a
            href="#"
            className="block text-gray-300 hover:text-white transition duration-300"
          >
            About
          </a>
          <a
            href="#"
            className="block text-gray-300 hover:text-white transition duration-300"
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
