import React from 'react';
import { Book } from '../types';
import { BookOpen, Download, Share2 } from 'lucide-react';

// Specific Rehan Allahwala books based on the request
const books: Book[] = [
  {
    id: 1,
    title: "AI Computer Communication Literacy - Book One",
    author: "Rehan Allahwala",
    description: "A comprehensive guide to AI, Computer, and Communication Literacy for the modern age. Version 0.2.",
    coverUrl: "https://placehold.co/400x600/facc15/020617?text=AI+COMPUTER\nCOMMUNICATION\nLITERACY\nBOOK+ONE",
    pdfUrl: "http://rehanschool.net/wp-content/uploads/2025/01/ACCL-book-version-0.2-1.pdf"
  },
  {
    id: 2,
    title: "Coding with AI - Book One",
    author: "Rehan Allahwala",
    description: "Learn to code with the help of Artificial Intelligence. Designed for ages 9+. Version 0.2.",
    coverUrl: "https://placehold.co/400x600/0f172a/f8fafc?text=CODING\nWITH+AI\nBOOK+ONE",
    pdfUrl: "http://rehanschool.net/wp-content/uploads/2025/04/CWI-BOOK-1-VERSION-0.2.pdf"
  },
  {
    id: 3,
    title: "Coding with AI - Book Two",
    author: "Rehan Allahwala",
    description: "The second volume in the Coding with AI series. Advanced concepts for young learners. Ages 9+. Version 0.3.",
    coverUrl: "https://placehold.co/400x600/f5d0fe/4a044e?text=CODING\nWITH+AI\nBOOK+TWO",
    pdfUrl: "http://rehanschool.net/wp-content/uploads/2025/04/CWI-BOOK-2-VERSION-0.3.pdf"
  },
  {
    id: 4,
    title: "Rehan School Level One - Work Book B",
    author: "Rehan Allahwala",
    description: "Official workbook for Rehan School Level One curriculum. Interactive learning for students. Version 0.2.",
    coverUrl: "https://placehold.co/400x600/eff6ff/1e3a8a?text=REHAN+SCHOOL\nLEVEL+ONE\nWORK+BOOK+B",
    pdfUrl: "http://rehanschool.net/wp-content/uploads/2025/02/Version-0.2-workbook-B-rehan-School.pdf"
  }
];

const BookSection: React.FC = () => {
  return (
    <section id="books" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4 flex justify-center items-center gap-2">
            <BookOpen className="text-indigo-600" /> Rehanallah Books
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Access the complete collection of educational resources and books by Rehan Allahwala.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <div key={book.id} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col transform hover:-translate-y-2">
              <div className="h-80 overflow-hidden relative bg-slate-200">
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 bg-white text-slate-900 px-6 py-2 rounded-full font-bold shadow-lg transition-all duration-300 flex items-center transform hover:scale-105">
                    <Download className="w-4 h-4 mr-2" /> Read Now
                  </a>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">{book.author}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{book.title}</h3>
                <p className="text-slate-600 mb-6 text-sm flex-1">{book.description}</p>
                <div className="flex gap-2 mt-auto">
                  <a 
                    href={book.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                  <button className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 hover:text-indigo-600">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookSection;