import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Download, Loader2, Palette, Video, Film, Key } from 'lucide-react';
import { generateImage, generateVideo } from '../services/geminiService';

type MediaType = 'image' | 'video';

const ImageGenSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MediaType>('image');
  
  // Separate states for prompts to persist content when switching tabs
  const [imagePrompt, setImagePrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  
  const [generatedMedia, setGeneratedMedia] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openKeySelection = async () => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.aistudio) {
        try {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        } catch (e) {
        console.error("Failed to open key dialog", e);
        }
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine which prompt to use based on the active tab
    const currentPrompt = activeTab === 'image' ? imagePrompt : videoPrompt;
    
    if (!currentPrompt.trim()) return;

    // Check for API Key if using Video (Veo)
    if (activeTab === 'video') {
       // @ts-ignore
       if (typeof window !== 'undefined' && window.aistudio) {
         try {
           // @ts-ignore
           const hasKey = await window.aistudio.hasSelectedApiKey();
           if (!hasKey) {
             await openKeySelection();
             // We don't return here, we attempt generation. 
             // If they didn't select, the API call will fail and be caught below.
           }
         } catch (err) {
           console.warn("API Key selection check failed", err);
         }
       }
    }

    setIsLoading(true);
    setError(null);
    setGeneratedMedia(null);

    try {
      let result: string | null = null;
      
      if (activeTab === 'image') {
        result = await generateImage(currentPrompt);
      } else {
        result = await generateVideo(currentPrompt);
      }

      if (result) {
        setGeneratedMedia(result);
      } else {
        setError(`Failed to generate ${activeTab}. Please try a different prompt.`);
      }
    } catch (err: any) {
      console.warn("Generation error caught:", err);
      
      let errorMessage = err.message || String(err);
      
      // Handle Veo specific key error: "Requested entity was not found" means the project doesn't have access or key is invalid
      // This often requires a paid project key.
      const isVeoError = errorMessage.includes("VeoModelError") || 
                         errorMessage.includes("Requested entity was not found") || 
                         errorMessage.includes("404") || 
                         errorMessage.includes("NOT_FOUND") ||
                         errorMessage.includes("Authorization failed");

      if (isVeoError) {
         setError("Billing Required: To use the 3D Video Maker, you must select an API Key linked to a Google Cloud Project with billing enabled.");
         
         // Trigger the key selection dialog again automatically
         await openKeySelection();
      } else {
        setError(errorMessage || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="graphics" className="py-20 bg-slate-900 text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4 flex justify-center items-center gap-2">
            <Palette className="text-purple-400" /> AI Media Studio
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Create stunning visuals with AI. Generate high-quality images or incredible 3D videos from simple text descriptions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10 animate-fade-in-up delay-100">
          <div className="bg-slate-800 p-1 rounded-xl flex shadow-lg border border-slate-700">
            <button
              onClick={() => { setActiveTab('image'); setGeneratedMedia(null); setError(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'image' 
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <ImageIcon className="h-4 w-4" /> Image Gen
            </button>
            <button
              onClick={() => { setActiveTab('video'); setGeneratedMedia(null); setError(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'video' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Video className="h-4 w-4" /> 3D Video Maker
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Input Section */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl animate-fade-in-up delay-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              {activeTab === 'image' ? (
                <><Sparkles className="h-5 w-5 text-yellow-400" /> Create New Graphic</>
              ) : (
                <><Film className="h-5 w-5 text-pink-400" /> Create 3D Video</>
              )}
            </h3>
            
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {activeTab === 'image' ? 'Describe your Image' : 'Describe your 3D Video'}
                </label>
                
                {activeTab === 'image' ? (
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="E.g., A futuristic city in Pakistan with flying cars and neon lights..."
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none text-white placeholder-slate-500 transition-all resize-none"
                  ></textarea>
                ) : (
                  <textarea
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder="E.g., A neon hologram of a cat driving at top speed..."
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none text-white placeholder-slate-500 transition-all resize-none"
                  ></textarea>
                )}
                
                {activeTab === 'video' && (
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <Key className="h-3 w-3" /> Requires a paid API key from Google Cloud.
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading || (activeTab === 'image' ? !imagePrompt.trim() : !videoPrompt.trim())}
                className={`w-full font-bold py-4 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  activeTab === 'image'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> 
                    {activeTab === 'image' ? 'Generating Art...' : 'Rendering Video...'}
                  </>
                ) : (
                  <>
                    {activeTab === 'image' ? <Sparkles className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                    {activeTab === 'image' ? 'Generate Graphic' : 'Generate 3D Video'}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 shadow-2xl min-h-[400px] flex items-center justify-center animate-fade-in-up delay-300 relative group">
            {generatedMedia ? (
              <div className="relative w-full h-full flex flex-col items-center">
                {activeTab === 'image' ? (
                  <img 
                    src={generatedMedia} 
                    alt="AI Generated" 
                    className="rounded-lg shadow-lg max-h-[500px] w-full object-contain"
                  />
                ) : (
                  <video 
                    controls 
                    autoPlay 
                    loop
                    className="rounded-lg shadow-lg max-h-[500px] w-full"
                    src={generatedMedia}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                
                <a 
                  href={generatedMedia} 
                  download={`rahat-ai-${activeTab}-${Date.now()}.${activeTab === 'image' ? 'png' : 'mp4'}`}
                  className="absolute bottom-4 right-4 bg-white text-slate-900 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-slate-200 transition-colors"
                >
                  <Download className="h-4 w-4" /> Download
                </a>
              </div>
            ) : (
              <div className="text-center text-slate-500 p-8 w-full">
                {error ? (
                  <div className="text-red-200 bg-red-900/30 p-6 rounded-xl border border-red-800/50 max-w-md mx-auto">
                    <p className="font-semibold mb-2">Generation Failed</p>
                    <p className="text-sm opacity-90 mb-4">{error}</p>
                    
                    {/* Add manual retry button for auth errors */}
                    {(error.includes("Billing") || error.includes("Authorization") || error.includes("API Key")) && (
                      <button 
                        onClick={openKeySelection}
                        className="bg-white text-red-900 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2 mx-auto"
                      >
                         <Key className="h-4 w-4" /> Select Paid API Key
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-700/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                      {activeTab === 'image' ? (
                        <ImageIcon className="h-10 w-10 opacity-50" />
                      ) : (
                         <Video className="h-10 w-10 opacity-50" />
                      )}
                    </div>
                    <p className="text-lg font-medium">Your masterpiece will appear here</p>
                    <p className="text-sm mt-2 opacity-60">Enter a prompt and hit generate to see the magic happen</p>
                  </>
                )}
              </div>
            )}
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20">
                <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
                <p className="text-purple-300 font-medium animate-pulse text-lg">
                  {activeTab === 'image' ? 'Creating your graphic...' : 'Rendering 3D Video...'}
                </p>
                {activeTab === 'video' && (
                  <p className="text-slate-400 text-sm mt-2">This usually takes about a minute</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGenSection;