import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scissors, Sparkles, Loader2, X, Upload, UserCheck, RefreshCw, Wand2, Download } from 'lucide-react';
import { sendMessageToGemini, editImageWithPrompt } from '../services/geminiService';

const HairStylerSection: React.FC = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Tab State: 'analysis' for text advice, 'visualize' for image generation
  const [activeTab, setActiveTab] = useState<'analysis' | 'visualize'>('analysis');
  
  // Analysis State
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Visualize State
  const [visualizePrompt, setVisualizePrompt] = useState('');
  const [generatedLook, setGeneratedLook] = useState<string | null>(null);
  const [isGeneratingLook, setIsGeneratingLook] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      setCapturedImage(null);
      setAnalysis(null);
      setGeneratedLook(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please allow camera permissions.");
      setIsCameraOpen(false);
    }
  };

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally for a mirror effect
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
        stopCameraStream();
        setIsCameraOpen(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setAnalysis(null);
        setGeneratedLook(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeHair = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setAnalysis(null);

    const prompt = `You are an expert Professional Hair Stylist and Barber. 
    Analyze this photo of the user.
    1. **Face Shape**: Identify the person's face shape (e.g., Oval, Round, Square, etc.).
    2. **Hair Texture**: Briefly describe their current hair type.
    3. **Recommendations**: Suggest 3 specific, trendy hairstyles/haircuts that would look best on this specific face shape.
    4. **Barber Instructions**: Give short technical instructions on how to cut this hair (e.g., "Fade on sides, textured top").
    
    Keep the tone stylish, encouraging, and helpful. Output in clean Markdown.`;

    try {
      const result = await sendMessageToGemini(prompt, capturedImage);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      setAnalysis("Sorry, I couldn't analyze the image right now. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateNewLook = async () => {
    if (!capturedImage || !visualizePrompt.trim()) return;
    
    setIsGeneratingLook(true);
    setGeneratedLook(null);
    
    try {
      const result = await editImageWithPrompt(capturedImage, visualizePrompt);
      if (result) {
        setGeneratedLook(result);
      } else {
        alert("Could not generate image. Please try a different prompt.");
      }
    } catch (error) {
       console.error(error);
       alert("Something went wrong with the image generation.");
    } finally {
      setIsGeneratingLook(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setAnalysis(null);
    setGeneratedLook(null);
    setIsCameraOpen(false);
    setVisualizePrompt('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section id="hair-stylist" className="py-20 bg-gradient-to-br from-rose-50 to-orange-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4 flex justify-center items-center gap-2">
            <Scissors className="text-rose-500" /> AI Smart Barber
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Not sure which haircut suits you? Take a selfie to get professional advice, or visualize a completely new hairstyle instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side: Camera/Image Area */}
          <div className="flex flex-col items-center sticky top-24">
            <div className="relative w-full max-w-md aspect-[3/4] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 group">
              
              {isCameraOpen ? (
                <>
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-20">
                     <button onClick={() => { stopCameraStream(); setIsCameraOpen(false); }} className="p-3 bg-red-500/80 text-white rounded-full backdrop-blur-sm">
                       <X className="w-6 h-6" />
                     </button>
                     <button onClick={captureImage} className="p-4 bg-white border-4 border-rose-500 rounded-full shadow-lg transform active:scale-95 transition-transform">
                       <div className="w-4 h-4 bg-rose-500 rounded-full"></div>
                     </button>
                  </div>
                </>
              ) : capturedImage ? (
                <>
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={reset} className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-medium hover:bg-white/30 transition-colors flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" /> Retake
                    </button>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-100">
                  <UserCheck className="w-16 h-16 mb-4 text-slate-300" />
                  <p className="mb-6">Take a selfie to start</p>
                  <div className="flex flex-col gap-3 w-full max-w-xs">
                    <button onClick={startCamera} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                      <Camera className="w-5 h-5" /> Open Camera
                    </button>
                    <div className="relative">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden" 
                      />
                      <button onClick={() => fileInputRef.current?.click()} className="w-full bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                        <Upload className="w-5 h-5" /> Upload Photo
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          {/* Right Side: Results Area with Tabs */}
          <div className="w-full h-full min-h-[400px] flex flex-col">
            
            {/* Tabs */}
            <div className="flex p-1 bg-slate-200/50 rounded-xl mb-6 self-center sm:self-start">
               <button 
                 onClick={() => setActiveTab('analysis')}
                 className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'analysis' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 Get Advice
               </button>
               <button 
                 onClick={() => setActiveTab('visualize')}
                 className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'visualize' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <Wand2 className="w-4 h-4" /> Try On Hairstyles
               </button>
            </div>

            {/* TAB CONTENT: Analysis */}
            {activeTab === 'analysis' && (
              <div className="flex-1 animate-fade-in">
                {isAnalyzing ? (
                  <div className="h-64 flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/50 shadow-sm animate-pulse">
                    <Loader2 className="w-12 h-12 text-rose-500 animate-spin mb-4" />
                    <p className="text-xl font-medium text-slate-700">Analyzing Face Shape...</p>
                    <p className="text-slate-500 mt-2">Checking latest trends for you</p>
                  </div>
                ) : analysis ? (
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-rose-100">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                      <div className="p-3 bg-rose-100 rounded-full text-rose-600">
                        <Scissors className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Your Personal Style Report</h3>
                        <p className="text-sm text-slate-500">AI Generated Recommendations</p>
                      </div>
                    </div>
                    <div className="prose prose-rose prose-sm sm:prose-base max-w-none text-slate-700">
                      <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/40 border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center h-full flex flex-col items-center justify-center min-h-[300px]">
                     <Sparkles className="w-12 h-12 text-slate-300 mb-4" />
                     <p className="text-slate-500 font-medium">Take a photo and click below to get advice.</p>
                     
                     <button 
                       onClick={analyzeHair}
                       disabled={!capturedImage}
                       className="mt-6 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg px-8 py-3 rounded-xl font-bold shadow-lg shadow-rose-500/30 transform hover:-translate-y-1 transition-all flex items-center gap-2"
                     >
                       <Sparkles className="w-5 h-5" /> Analyze Face Shape
                     </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Visualize */}
            {activeTab === 'visualize' && (
              <div className="flex-1 animate-fade-in flex flex-col">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">What hairstyle do you want to try?</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={visualizePrompt}
                      onChange={(e) => setVisualizePrompt(e.target.value)}
                      placeholder="e.g. Short Fade, Long Curly Hair, Blue Punk Mohawk..."
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <button 
                      onClick={generateNewLook}
                      disabled={!capturedImage || !visualizePrompt.trim() || isGeneratingLook}
                      className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center min-w-[100px]"
                    >
                      {isGeneratingLook ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate'}
                    </button>
                  </div>
                  {!capturedImage && <p className="text-xs text-red-400 mt-2">* Please upload or take a photo first.</p>}
                </div>

                {/* Result Display */}
                {generatedLook ? (
                  <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group">
                    <img src={generatedLook} alt="New Look" className="w-full h-auto object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                      <p className="text-white font-bold text-lg mb-2">Your New Look: {visualizePrompt}</p>
                      <a 
                        href={generatedLook} 
                        download={`rahat-barber-style-${Date.now()}.png`}
                        className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg font-bold self-start hover:bg-slate-200 transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download Image
                      </a>
                    </div>
                  </div>
                ) : isGeneratingLook ? (
                   <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center p-8 bg-slate-100 rounded-3xl animate-pulse">
                      <Loader2 className="w-12 h-12 text-rose-500 animate-spin mb-4" />
                      <p className="text-lg font-bold text-slate-600">Generating new look...</p>
                      <p className="text-sm text-slate-500">Applying "{visualizePrompt}" to your photo.</p>
                   </div>
                ) : (
                   <div className="flex-1 min-h-[300px] bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center text-center p-8">
                      <Wand2 className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-slate-500">Enter a hairstyle name above and click Generate to see the magic!</p>
                   </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};

export default HairStylerSection;