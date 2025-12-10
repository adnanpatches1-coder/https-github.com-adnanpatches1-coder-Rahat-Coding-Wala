import React, { useState } from 'react';
import { Menu, X, BookOpen, Phone, Palette, MessageSquare, Map, Monitor, Briefcase, Scissors } from 'lucide-react';
import { Logo } from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:grid md:grid-cols-3">
          
          {/* Left Section: Mobile Menu Button */}
          <div className="flex justify-start md:hidden z-20">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-indigo-600 focus:outline-none p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Left Section Desktop: Empty to balance grid */}
          <div className="hidden md:flex justify-start">
             {/* Optional: Add social icons or secondary nav here if needed */}
          </div>

          {/* Center Section: Logo and App Name - Perfectly Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:translate-x-0 md:col-start-2 md:row-start-1 flex justify-center items-center w-full md:w-auto pointer-events-none md:pointer-events-auto">
            <div className="flex items-center cursor-pointer group pointer-events-auto" onClick={() => scrollToSection('home')}>
              <div className="h-10 w-10 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                <Logo className="w-full h-full drop-shadow-md" />
              </div>
              <span className="hidden min-[380px]:block ml-2 text-lg sm:text-xl font-bold text-slate-800 tracking-tight group-hover:text-indigo-700 transition-colors whitespace-nowrap">
                Rahat Coding Wala
              </span>
            </div>
          </div>
          
          {/* Right Section: Desktop Links */}
          <div className="hidden md:flex justify-end items-center">
            <div className="flex space-x-1 lg:space-x-1 xl:space-x-2">
              <button onClick={() => scrollToSection('ai-chat')} className="text-slate-600 hover:text-indigo-600 px-2 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-50">Chat</button>
              <button onClick={() => scrollToSection('hair-stylist')} className="text-slate-600 hover:text-rose-600 px-2 py-2 rounded-md text-sm font-medium transition-colors hover:bg-rose-50 flex items-center gap-1"><Scissors className="h-3 w-3" />Barber</button>
              <button onClick={() => scrollToSection('graphics')} className="text-slate-600 hover:text-indigo-600 px-2 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-50">Studio</button>
              <button onClick={() => scrollToSection('wallpapers')} className="text-slate-600 hover:text-indigo-600 px-2 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-50">Wallpapers</button>
              <button onClick={() => scrollToSection('naming')} className="text-slate-600 hover:text-indigo-600 px-2 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-50">Names</button>
              <button onClick={() => scrollToSection('maps')} className="text-slate-600 hover:text-indigo-600 px-2 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-50">Maps</button>
              <button onClick={() => scrollToSection('books')} className="text-slate-600 hover:text-indigo-600 px-2 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-50">Books</button>
            </div>
          </div>

          {/* Mobile Right Spacer (to balance flex layout if needed, otherwise empty) */}
          <div className="w-10 md:hidden"></div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 absolute w-full left-0 shadow-xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <button onClick={() => scrollToSection('ai-chat')} className="flex items-center w-full text-left p-3 text-base font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <MessageSquare className="h-5 w-5 mr-3 text-indigo-500" /> AI Chat
            </button>
            <button onClick={() => scrollToSection('hair-stylist')} className="flex items-center w-full text-left p-3 text-base font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
              <Scissors className="h-5 w-5 mr-3 text-rose-500" /> AI Barber & Stylist
            </button>
            <button onClick={() => scrollToSection('graphics')} className="flex items-center w-full text-left p-3 text-base font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Palette className="h-5 w-5 mr-3 text-purple-500" /> AI Media Studio
            </button>
            <button onClick={() => scrollToSection('wallpapers')} className="flex items-center w-full text-left p-3 text-base font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Monitor className="h-5 w-5 mr-3 text-blue-500" /> Wallpapers
            </button>
            <button onClick={() => scrollToSection('naming')} className="flex items-center w-full text-left p-3 text-base font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Briefcase className="h-5 w-5 mr-3 text-yellow-500" /> Name Generator
            </button>
            <button onClick={() => scrollToSection('maps')} className="flex items-center w-full text-left p-3 text-base font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Map className="h-5 w-5 mr-3 text-emerald-600" /> AI Maps
            </button>
            <button onClick={() => scrollToSection('books')} className="flex items-center w-full text-left p-3 text-base font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <BookOpen className="h-5 w-5 mr-3 text-emerald-500" /> Rehanallah Books
            </button>
            <button onClick={() => scrollToSection('contact')} className="flex items-center w-full text-left p-3 text-base font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Phone className="h-5 w-5 mr-3 text-orange-500" /> Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;