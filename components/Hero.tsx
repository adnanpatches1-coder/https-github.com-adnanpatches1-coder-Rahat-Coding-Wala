import React from 'react';
import { ArrowRight, Sparkles, Crown, Code2, Terminal } from 'lucide-react';
import { Logo } from './Logo';

const Hero: React.FC = () => {
  const scrollToChat = () => {
    document.getElementById('ai-chat')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reusable Face Component for the Rahat Coding Wala Logo
  const RahatBrandFace = () => (
    <div className="w-full h-full bg-slate-950 border-[3px] border-yellow-500/40 flex flex-col items-center justify-center relative overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] group">
      {/* Tech/Matrix Background Effect */}
      <div className="absolute inset-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }}>
      </div>
      
      {/* Glowing Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center transform transition-transform hover:scale-110 duration-500 text-center px-1">
        {/* Icons */}
        <div className="flex gap-2 mb-2">
            <Crown className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" strokeWidth={2.5} />
        </div>

        {/* Text Stack */}
        <h2 className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 font-black text-2xl tracking-[0.2em] drop-shadow-sm uppercase leading-none mb-1" style={{ fontFamily: 'serif' }}>
          RAHAT
        </h2>
        
        <div className="bg-slate-900/90 px-3 py-1 rounded border border-cyan-500/50 my-1 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <h2 className="text-cyan-400 font-mono font-bold text-lg tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] uppercase leading-none flex items-center gap-1">
               <span className="text-cyan-600">&lt;</span>CODING<span className="text-cyan-600">/&gt;</span>
            </h2>
        </div>
        
        <h2 className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 font-black text-2xl tracking-[0.2em] drop-shadow-sm uppercase leading-none mt-1" style={{ fontFamily: 'serif' }}>
          WALA
        </h2>
      </div>
      
      {/* Corner Accents */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-cyan-500"></div>
      <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-cyan-500"></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-cyan-500"></div>
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-cyan-500"></div>
    </div>
  );

  return (
    <div id="home" className="relative pt-24 pb-12 md:pt-32 md:pb-24 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Text Content */}
          <div className="text-center md:text-left md:w-1/2">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6 animate-fade-in-up">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Welcome to the Future</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 animate-fade-in-up delay-100">
              Rahat Coding Wala <br />
              <span className="text-indigo-600">& Rehanallah Books</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto md:mx-0 text-xl text-slate-600 mb-8 animate-fade-in-up delay-200">
              Explore advanced AI solutions, learn to code with AI, and immerse yourself in the complete literary collection of Rehanallah.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 animate-fade-in-up delay-300">
              <button 
                onClick={scrollToChat}
                className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95 duration-200"
              >
                Try AI Chat <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button 
                onClick={() => document.getElementById('books')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex justify-center items-center px-8 py-3 border border-slate-300 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 md:text-lg shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 active:scale-95 duration-200"
              >
                Browse Books
              </button>
            </div>
          </div>

          {/* 3D Model Visualization */}
          <div className="md:w-1/2 flex justify-center perspective-1000 animate-fade-in-up delay-500">
            <div className="relative w-64 h-64 md:w-80 md:h-80 preserve-3d cube-spin">
              
              {/* Front Face */}
              <div className="cube-face" style={{ transform: 'rotateY(0deg) translateZ(128px)' }}>
                 <RahatBrandFace />
              </div>

              {/* Back Face */}
              <div className="cube-face" style={{ transform: 'rotateY(180deg) translateZ(128px)' }}>
                <RahatBrandFace />
              </div>

              {/* Right Face */}
              <div className="cube-face" style={{ transform: 'rotateY(90deg) translateZ(128px)' }}>
                <RahatBrandFace />
              </div>

              {/* Left Face */}
              <div className="cube-face" style={{ transform: 'rotateY(-90deg) translateZ(128px)' }}>
                <RahatBrandFace />
              </div>

              {/* Top Face */}
              <div className="cube-face" style={{ transform: 'rotateX(90deg) translateZ(128px)' }}>
                <RahatBrandFace />
              </div>

              {/* Bottom Face */}
              <div className="cube-face" style={{ transform: 'rotateX(-90deg) translateZ(128px)' }}>
                 <RahatBrandFace />
              </div>

            </div>
          </div>

        </div>
      </div>
      
      {/* Abstract background blobs */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 -ml-20 -mb-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob delay-500"></div>
    </div>
  );
};

export default Hero;