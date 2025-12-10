import React, { useState } from 'react';
import { Lightbulb, Briefcase, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { generateBusinessIdeas } from '../services/geminiService';

const BusinessNameGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setIdeas([]);

    try {
      const results = await generateBusinessIdeas(topic);
      setIdeas(results);
    } catch (error) {
      console.error("Failed to generate names", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="naming" className="py-20 bg-indigo-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4 flex justify-center items-center gap-2">
            <Briefcase className="text-yellow-400" /> AI Business Name Generator
          </h2>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
            Stuck on a name? Describe your business idea below and let AI brainstorm creative brand names and slogans for you.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleGenerate} className="relative">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-xl">
              <div className="pl-4 text-indigo-300">
                <Lightbulb className="h-6 w-6" />
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. A coffee shop that also sells rare books..."
                className="flex-1 bg-transparent border-none text-white placeholder-indigo-300 focus:outline-none focus:ring-0 text-lg py-3"
              />
              <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="bg-yellow-500 hover:bg-yellow-600 text-indigo-900 font-bold px-6 py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                Generate
              </button>
            </div>
          </form>
        </div>

        {ideas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
            {ideas.map((idea, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                    {idea.name}
                  </h3>
                  <button 
                    onClick={() => copyToClipboard(idea.name, index)}
                    className="text-indigo-300 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                    title="Copy Name"
                  >
                    {copiedIndex === index ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-indigo-200 text-sm italic border-t border-white/10 pt-3 mt-2">
                  "{idea.slogan}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessNameGenerator;