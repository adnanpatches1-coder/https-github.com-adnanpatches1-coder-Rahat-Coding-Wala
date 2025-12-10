import React from 'react';
import { Download, Monitor, Sparkles, Gamepad2 } from 'lucide-react';

const wallpapers = [
  {
    id: 1,
    title: "Neon Cyber City",
    category: "Cyberpunk",
    url: "https://placehold.co/1920x1080/0f172a/38bdf8?text=Neon+Cyber+City",
    description: "High-tech urban landscape with neon aesthetic."
  },
  {
    id: 2,
    title: "Crimson Battle Station",
    category: "Gaming Setup",
    url: "https://placehold.co/1920x1080/450a0a/f87171?text=Crimson+Battle+Station",
    description: "Intense red themed gaming setup background."
  },
  {
    id: 3,
    title: "Emerald Glitch",
    category: "Abstract",
    url: "https://placehold.co/1920x1080/022c22/34d399?text=Emerald+Glitch",
    description: "Digital noise and glitch art in matrix green."
  },
  {
    id: 4,
    title: "Synthwave Sunset",
    category: "Retro",
    url: "https://placehold.co/1920x1080/4c1d95/c084fc?text=Synthwave+Sunset",
    description: "80s inspired retro futuristic sunset."
  },
  {
    id: 5,
    title: "Legacy Controller Art",
    category: "Minimalist",
    url: "https://placehold.co/1920x1080/000000/ffffff?text=Controller+Collage",
    description: "A creative composition of gaming icons forming a controller shape."
  },
  {
    id: 6,
    title: "Phantom Skull",
    category: "Dark Mode",
    url: "https://placehold.co/1920x1080/000000/6366f1?text=Skull+Emblem",
    description: "Stylized skull emblem with blue and purple gradient aesthetic."
  },
  {
    id: 7,
    title: "Strategic Homeland Division",
    category: "Logo Art",
    url: "https://placehold.co/1920x1080/000000/f97316?text=SHD+Tech+Logo",
    description: "Iconic orange glowing phoenix emblem on a dark tactical interface."
  },
  {
    id: 8,
    title: "Chromatic Spikes",
    category: "Abstract 3D",
    url: "https://placehold.co/1920x1080/09090b/60a5fa?text=Abstract+Crystal+Spikes",
    description: "Futuristic jagged crystal formation with blue and crimson lighting."
  }
];

const WallpaperSection: React.FC = () => {
  const scrollToGen = () => {
    const el = document.getElementById('graphics');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="wallpapers" className="py-20 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4 flex justify-center items-center gap-2">
            <Gamepad2 className="text-purple-500" /> Gamer Wallpapers
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Level up your screen with our curated high-resolution backgrounds. Download free or design your own unique style in the Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {wallpapers.map((wp, index) => (
            <div 
              key={wp.id} 
              className={`group relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl animate-fade-in-up delay-${(index % 4 + 1) * 100}`}
            >
              {/* Image Container */}
              <div className="aspect-video w-full overflow-hidden bg-slate-900">
                <img 
                  src={wp.url} 
                  alt={wp.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                />
              </div>

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 flex flex-col justify-end p-4 transition-all duration-300">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">{wp.title}</h3>
                      <p className="text-[10px] text-purple-400 font-medium mb-1">{wp.category}</p>
                    </div>
                    <a 
                      href={wp.url} 
                      download 
                      className="inline-flex items-center gap-1 bg-white text-slate-900 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-purple-50 transition-colors shadow-lg transform hover:scale-105 active:scale-95"
                    >
                      <Download className="h-3 w-3" /> Save
                    </a>
                  </div>
                  <p className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2 mt-1">
                     {wp.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 md:p-12 text-center border border-white/10 relative overflow-hidden animate-fade-in-up delay-500">
           <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
           <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-indigo-500 rounded-full filter blur-3xl opacity-20"></div>
           
           <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Want something unique?</h3>
           <p className="text-slate-300 mb-8 max-w-xl mx-auto relative z-10">
             Use our AI Media Studio to generate a custom wallpaper that matches your exact setup color scheme and style.
           </p>
           <button 
             onClick={scrollToGen} 
             className="relative z-10 inline-flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-xl font-medium"
           >
             <Sparkles className="mr-2 h-5 w-5" /> Open AI Studio
           </button>
        </div>
      </div>
    </section>
  );
};

export default WallpaperSection;