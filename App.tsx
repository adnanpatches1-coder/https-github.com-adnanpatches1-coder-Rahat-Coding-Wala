import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChatSection from './components/ChatSection';
import HairStylerSection from './components/HairStylerSection';
import ImageGenSection from './components/ImageGenSection';
import WallpaperSection from './components/WallpaperSection';
import BusinessNameGenerator from './components/BusinessNameGenerator';
import MapSection from './components/MapSection';
import BookSection from './components/BookSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ChatSection />
        <HairStylerSection />
        <ImageGenSection />
        <WallpaperSection />
        <BusinessNameGenerator />
        <MapSection />
        <BookSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;