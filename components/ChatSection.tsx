import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Camera, X, Image as ImageIcon, StopCircle, Mic, MicOff, Volume2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'As-salamu alaykum! I am the Rahat AI assistant. I can help you with questions about AI, coding, or Rehan Allahwala\'s books. You can speak to me, or show me pictures/questions using your camera!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Camera & Image State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup camera stream and speech on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // --- Camera Logic ---
  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      setAttachedImage(null); // Clear previous image if any
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please make sure you have allowed camera permissions.");
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

  const closeCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setAttachedImage(dataUrl);
        closeCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset value so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Voice Logic ---
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Default to English, could be changed
    recognition.interimResults = true;
    recognition.continuous = false;

    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.start();
  };

  const handleSpeak = (text: string, id: string) => {
    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Optional: Select a better voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha"));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onend = () => setSpeakingMessageId(null);
    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  // --- Chat Logic ---
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !attachedImage) || isLoading) return;

    // Use default text if only image is provided
    const textToSend = input.trim() || (attachedImage ? "Analyze this image" : "");

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      image: attachedImage || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const imageToSend = attachedImage;
    setAttachedImage(null); // Clear attachment immediately after sending
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(textToSend, imageToSend || undefined);
      
      const botMessageId = (Date.now() + 1).toString();
      const botMessage: ChatMessage = {
        id: botMessageId,
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to get response", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Sorry, something went wrong. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-chat" className="py-20 bg-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4 flex justify-center items-center gap-2">
            <Sparkles className="text-indigo-600" /> Rahat AI Assistant
          </h2>
          <p className="text-lg text-slate-600">
            Ask anything, solve problems with your camera, or chat about books.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl shadow-xl border border-slate-200 overflow-hidden h-[600px] flex flex-col animate-fade-in-up delay-200 relative">
          
          {/* Camera Overlay */}
          {isCameraOpen && (
            <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-8 flex items-center gap-8">
                <button 
                  onClick={closeCamera}
                  className="p-4 rounded-full bg-slate-800/50 text-white hover:bg-slate-700/50 backdrop-blur-sm transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
                <button 
                  onClick={captureImage}
                  className="p-5 rounded-full bg-white border-4 border-indigo-500 shadow-lg transform active:scale-90 transition-all"
                >
                  <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
                </button>
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-message-pop`}
              >
                <div
                  className={`flex max-w-[85%] md:max-w-[75%] ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  } items-start gap-2`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'
                  }`}>
                    {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                  </div>
                  
                  <div
                    className={`p-3 rounded-2xl flex flex-col gap-2 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {/* Render Image if exists */}
                    {msg.image && (
                      <img 
                        src={msg.image} 
                        alt="User upload" 
                        className="max-w-full rounded-lg shadow-sm border border-white/20 max-h-60 object-contain self-start bg-black/10" 
                      />
                    )}
                    
                    {msg.text && <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{msg.text}</p>}
                    
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-[10px] ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      
                      {/* Speak Button for AI Messages */}
                      {msg.role === 'model' && (
                        <button 
                          onClick={() => handleSpeak(msg.text, msg.id)}
                          className="ml-2 p-1 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-100"
                          title="Read Aloud"
                        >
                          {speakingMessageId === msg.id ? <StopCircle size={14} className="text-indigo-600 animate-pulse" /> : <Volume2 size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-message-pop">
                <div className="flex items-center gap-2 bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  <span className="text-slate-500 text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attachment Preview Area */}
          {attachedImage && !isCameraOpen && (
            <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center gap-2">
              <div className="relative group">
                <img 
                  src={attachedImage} 
                  alt="Preview" 
                  className="h-16 w-16 object-cover rounded-lg border border-slate-300 shadow-sm"
                />
                <button 
                  onClick={() => setAttachedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <span className="text-xs text-slate-500">Image attached</span>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleSend} className="flex gap-2 md:gap-3 items-end">
              
              {/* File Input (Hidden) */}
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Action Buttons */}
              <div className="flex gap-1 pb-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Upload Image"
                >
                  <ImageIcon className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={startCamera}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Take Photo"
                >
                  <Camera className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-100 text-red-600 animate-pulse' 
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  title="Voice Input"
                >
                  {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </button>
              </div>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening..." : (attachedImage ? "Add a caption..." : "Type or speak...")}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all mb-0.5"
                disabled={isLoading}
              />
              
              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !attachedImage)}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 md:px-6 py-3 rounded-xl transition-all transform active:scale-95 flex items-center justify-center mb-0.5"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;