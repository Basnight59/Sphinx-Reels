import React from 'react';
import { Template } from '../types';
import { Search, Filter } from 'lucide-react';

// Mock Templates
const TEMPLATES: Template[] = [
  { id: 't1', name: 'Viral Facts Dark', category: 'Educational', thumbnail: 'https://picsum.photos/seed/t1/300/500' },
  { id: 't2', name: 'Motivational Sunrise', category: 'Inspiration', thumbnail: 'https://picsum.photos/seed/t2/300/500' },
  { id: 't3', name: 'Reddit Stories', category: 'Storytime', thumbnail: 'https://picsum.photos/seed/t3/300/500' },
  { id: 't4', name: 'Tech Product Showcase', category: 'Promotional', thumbnail: 'https://picsum.photos/seed/t4/300/500' },
  { id: 't5', name: 'Podcast Clip', category: 'Social', thumbnail: 'https://picsum.photos/seed/t5/300/500' },
];

export const Templates: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-6 lg:p-10 overflow-y-auto">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold text-white">Templates</h1>
        <p className="text-muted">Start with a professionally designed template for your next reel.</p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input 
            type="text" 
            placeholder="Search templates..." 
            className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-white hover:bg-secondary transition-colors">
          <Filter className="w-4 h-4" />
          <span>All Categories</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {TEMPLATES.map(template => (
          <div key={template.id} className="group relative rounded-xl overflow-hidden aspect-[9/16] cursor-pointer border border-border hover:border-primary transition-all">
            <img 
              src={template.thumbnail} 
              alt={template.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
              <span className="text-xs font-semibold text-primary-hover uppercase tracking-wider mb-1 block">{template.category}</span>
              <h3 className="text-white font-bold text-lg leading-tight">{template.name}</h3>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <button className="bg-white text-black font-semibold px-6 py-2 rounded-full transform scale-90 group-hover:scale-100 transition-transform hover:bg-gray-100">
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};