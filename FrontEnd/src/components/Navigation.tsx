import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Settings, CreditCard, Menu, X } from "lucide-react";

const Navigation = ({ showCalendar, setShowCalendar }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/inquiry", label: "Inquiry ", icon: Calendar },
    { path: "/booking", label: "Book Event", icon: Calendar },
    { path: "/", label: "Dashboard", icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-beige-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-beige-400 to-beige-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-800 group-hover:text-beige-500 transition-colors">
              B21 Banquets
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(path)
                    ? "bg-beige-100 text-beige-600 shadow-sm"
                    : "text-gray-600 hover:text-beige-600 hover:bg-beige-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
            <button
              onClick={() => setShowCalendar((prev) => !prev)}
              className="flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium"
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-beige-600 hover:bg-beige-50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-beige-200">
            <div className="space-y-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(path)
                      ? "bg-beige-100 text-beige-600 shadow-sm"
                      : "text-gray-600 hover:text-beige-600 hover:bg-beige-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}

              {/* 👇 Add Calendar Toggle Here for Mobile View */}
              <button
                onClick={() => {
                  setShowCalendar((prev) => !prev);
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-beige-600 hover:bg-beige-50 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Calendar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
