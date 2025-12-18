"use client";

import { useState, useEffect, } from "react";
import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Sparkles, Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0f]/60 backdrop-blur-2xl border-b border-white/5"
          : ""
      }`}
    >
      <nav className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="block">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-lg opacity-50" />
              
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Image
                  src="/icon.png"
                  alt="Project X logo"
                  width={132}
                  height={132}
                  className="-mr-1"
                />
                {/* <span className="text-xs px-2 py-0.5 rounded bg-purple-600 text-white">
                  AI
                </span> */}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span className="text-[10px] text-purple-400 font-medium">
                  Built for students. Designed for growth
                </span>
              </div>
            </div>
          </div>
          </Link>

        
          <div className="hidden md:flex items-center gap-8">
            <Link href="attendance-tracker" className="text-sm text-gray-400 hover:text-white">
              Attendance
            </Link>
            <Link href="placement" className="text-sm text-gray-400 hover:text-white">
              Placement
            </Link>
            <Link href="pricing" className="text-sm text-gray-400 hover:text-white">
              Pricing
            </Link>
            <UserButton/>
            {/* <button className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-50" />
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 rounded-xl text-sm font-medium">
                Get Started
              </div>
            </button> */}
          </div>

         
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
    </header>
  );
}
