import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { Templates } from './pages/Templates';
import { Login } from './pages/Login';
import { Project } from './types';

// Mock Initial Data
const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Motivational Quote #42',
    thumbnail: 'https://picsum.photos/seed/1/300/500',
    lastModified: new Date().toISOString(),
    status: 'draft',
    scenes: []
  },
  {
    id: '2',
    name: 'Tech News Daily',
    thumbnail: 'https://picsum.photos/seed/2/300/500',
    lastModified: new Date(Date.now() - 86400000).toISOString(),
    status: 'rendering',
    scenes: []
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  const handleLogin = () => setIsAuthenticated(true);
  
  const createProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: 'Untitled Project',
      thumbnail: 'https://picsum.photos/300/500', // Placeholder
      lastModified: new Date().toISOString(),
      status: 'draft',
      scenes: [
        {
          id: 's1',
          text: 'Welcome to your new video.',
          image: 'https://picsum.photos/seed/new/1080/1920',
          duration: 5
        }
      ]
    };
    setProjects([newProject, ...projects]);
    window.location.hash = `/project/${newProject.id}`;
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        
        <Route path="/" element={isAuthenticated ? <Layout><Dashboard projects={projects} onCreateProject={createProject} /></Layout> : <Navigate to="/login" />} />
        
        <Route path="/templates" element={isAuthenticated ? <Layout><Templates /></Layout> : <Navigate to="/login" />} />
        
        <Route path="/project/:id" element={isAuthenticated ? <Layout><Editor projects={projects} onUpdateProject={updateProject} /></Layout> : <Navigate to="/login" />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;