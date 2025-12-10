import React from 'react';

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  pdfUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  timestamp: Date;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}