import React, { useState, useRef } from 'react';
import { Map, Search, MapPin, Navigation, Loader2, Mic, MicOff } from 'lucide-react';
import { searchMapLocations } from '../services/geminiService';

const MapSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ text: string; locations: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Use a ref to keep track of the recognition instance so we can stop it manually
  const recognitionRef = useRef<any>(null);

  const toggleVoiceSearch = () => {
    // If already listening, stop the current instance
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    // Enable interim results to show text AS the user speaks, rather than waiting for the end
    recognition.interimResults = true; 
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      // Map through results to get the full transcript
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
        
      setQuery(transcript);
    };

    recognition.onerror = (event: any) => {
      // 'aborted' is a normal state when user stops listening or switches tabs
      if (event.error === 'not-allowed') {
        alert("Microphone access blocked. Please allow microphone permissions in your browser settings.");
      } else if (event.error === 'no-speech') {
        // Did not hear anything, just stop quietly
      } else if (event.error !== 'aborted') {
        console.warn("Speech recognition error:", event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
      setIsListening(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResults(null);

    try {
      // Append Karachi context if not present, to bias results towards the requested city
      const prompt = query.toLowerCase().includes('karachi') 
        ? query 
        : `${query} in Karachi`;
        
      const data = await searchMapLocations(prompt);
      setResults(data);
    } catch (error) {
      console.error("Map search error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="maps" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4 flex justify-center items-center gap-2">
            <Map className="text-emerald-600" /> AI Map Explorer
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover places in Karachi with AI-powered 3D Maps Grounding. Find restaurants, landmarks, and more.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Search Bar */}
          <div className={`bg-white p-2 rounded-2xl shadow-lg border transition-colors duration-300 mb-8 animate-fade-in-up delay-100 flex items-center gap-2 ${isListening ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'}`}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isListening ? "Listening... speak now" : "Search e.g. 'Best Biryani in Karachi'..."}
              className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-slate-700 placeholder-slate-400 text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            />
            
            <button
              type="button"
              onClick={toggleVoiceSearch}
              className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center ${
                isListening 
                  ? 'bg-red-50 text-red-600 animate-pulse' 
                  : 'hover:bg-slate-100 text-slate-500 hover:text-indigo-600'
              }`}
              title={isListening ? "Stop Listening" : "Start Voice Search"}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>

            <button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Search className="h-6 w-6" />}
            </button>
          </div>

          {/* Results Area */}
          {results && (
            <div className="animate-fade-in-up">
              {/* AI Text Response */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{results.text}</p>
                  </div>
                </div>
              </div>

              {/* Map Cards Grid */}
              {results.locations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 px-2">Found Locations:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.locations.map((loc, idx) => (
                      <a
                        key={idx}
                        href={loc.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-1">
                              {loc.title}
                            </h4>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Map className="h-3 w-3" /> View on Google Maps
                            </span>
                          </div>
                          <div className="bg-slate-100 group-hover:bg-emerald-100 p-2 rounded-lg transition-colors">
                            <Navigation className="h-5 w-5 text-slate-400 group-hover:text-emerald-600" />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MapSection;