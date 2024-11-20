import { Vote } from "lucide-react";
import React from "react";

const HeroSection = () => {
  return (
    <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-purple-900 to-teal-900">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-7">
          Vote for Your Favorite Tattoo Artist
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 w-[90%] max-w-[1200px] text-center mx-auto">
          Discover amazing artists and show your support!
        </p>

        <a
          href="#artists"
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
        >
          View Artists
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
