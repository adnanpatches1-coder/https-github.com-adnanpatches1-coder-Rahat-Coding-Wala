import React from 'react';
import { Heart } from 'lucide-react';
import { Logo } from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-8 w-8 mr-2">
              <Logo className="w-full h-full" />
            </div>
            <span className="text-2xl font-bold text-white">Rahat Ai application</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="mb-2">Phone / WhatsApp: <a href="https://wa.me/923703210014" className="text-indigo-400 hover:text-indigo-300">03703210014</a></p>
            <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} Rahat Ai application. All rights reserved.</p>
            <p className="text-xs text-slate-600 mt-2 flex items-center justify-center md:justify-end">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> by Rehanallah
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;