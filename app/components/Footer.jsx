import { Instagram } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-center py-8">
      <p className="mb-4">Follow us for more tattoo inspiration</p>
      <a
        href="#"
        className="inline-block bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full transition duration-300"
      >
        <Instagram/>
      </a>
    </footer>
  );
};

export default Footer;
