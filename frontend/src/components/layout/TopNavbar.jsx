import React from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TopNavbar({ onMenuToggle }) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 flex items-center justify-between">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar - Center/Left Pill as in reference image */}
        <div className="relative w-72 sm:w-80 md:w-96">
          <input
            type="text"
            placeholder="Search skills, topics..."
            className="w-full pl-4 pr-10 py-2 rounded-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right User Controls */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Notification Bell with Badge '2' */}
        <button
          className="relative p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            2
          </span>
        </button>

        {/* User Avatar Circle and Name Dropdown */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-[#0a1128] text-white font-bold text-xs flex items-center justify-center tracking-wider shadow-xs">
            AV
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800">
            <span>Ayush Verma</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </Link>
      </div>
    </header>
  );
}
