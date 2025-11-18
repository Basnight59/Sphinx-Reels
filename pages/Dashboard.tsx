import React from 'react';
import { Plus, Clock, MoreVertical, Play, FileVideo } from 'lucide-react';
import { Project } from '../types';
import { Link } from 'react-router-dom';

interface DashboardProps {
  projects: Project[];
  onCreateProject: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, onCreateProject }) => {
  return (
    <div className="h-full flex flex-col p-6 lg:p-10 overflow-y-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-muted mt-1">Manage your video projects and track rendering status.</p>
        </div>
        <button 
          onClick={onCreateProject}
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Recent Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <Link 
            to={`/project/${project.id}`} 
            key={project.id}
            className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1"
          >
            {/* Thumbnail */}
            <div className="aspect-[9/16] relative bg-secondary overflow-hidden">
              <img 
                src={project.thumbnail} 
                alt={project.name} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <div className="flex items-center gap-2 text-xs font-medium text-white bg-black/50 backdrop-blur-md px-2 py-1 rounded-md">
                  <Clock className="w-3 h-3" />
                  {new Date(project.lastModified).toLocaleDateString()}
                </div>
                {project.status === 'rendering' && (
                  <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md border border-yellow-400/20 animate-pulse">
                    Rendering...
                  </span>
                )}
                {project.status === 'draft' && (
                  <span className="text-xs font-bold text-muted bg-white/10 px-2 py-1 rounded-md border border-white/10">
                    Draft
                  </span>
                )}
              </div>
              
              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="w-5 h-5 ml-1" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-white line-clamp-1" title={project.name}>{project.name}</h3>
                <button className="text-muted hover:text-white p-1 rounded-md hover:bg-secondary transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted mt-1 flex items-center gap-1">
                <FileVideo className="w-3 h-3" />
                {project.scenes.length} scenes
              </p>
            </div>
          </Link>
        ))}
        
        {/* Create New Placeholder Card */}
        <button 
          onClick={onCreateProject}
          className="flex flex-col items-center justify-center aspect-[9/16] bg-secondary/30 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-secondary/50 transition-all group text-muted hover:text-primary"
        >
          <div className="w-14 h-14 rounded-full bg-secondary group-hover:bg-primary/20 flex items-center justify-center mb-3 transition-colors">
            <Plus className="w-7 h-7" />
          </div>
          <span className="font-medium">Create New</span>
        </button>
      </div>
    </div>
  );
};