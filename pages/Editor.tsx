import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, Save, Wand2, Image as ImageIcon, 
  Type, Clock, GripVertical, Trash2, Plus, PlayCircle, AlertCircle
} from 'lucide-react';
import { Project, Scene, AIScriptType } from '../types';
import { generateScenesFromTopic } from '../services/geminiService';

interface EditorProps {
  projects: Project[];
  onUpdateProject: (project: Project) => void;
}

export const Editor: React.FC<EditorProps> = ({ projects, onUpdateProject }) => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | undefined>(projects.find(p => p.id === id));
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
  
  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    if (project) {
      onUpdateProject(project);
      if (!activeSceneId && project.scenes.length > 0) {
        setActiveSceneId(project.scenes[0].id);
      }
    }
  }, [project]);

  if (!project) return <div className="p-10 text-center text-muted">Project not found</div>;

  const activeScene = project.scenes.find(s => s.id === activeSceneId);

  const handleSceneUpdate = (key: keyof Scene, value: any) => {
    if (!activeSceneId) return;
    setProject(prev => {
      if (!prev) return undefined;
      return {
        ...prev,
        scenes: prev.scenes.map(s => s.id === activeSceneId ? { ...s, [key]: value } : s)
      };
    });
  };

  const handleAddScene = () => {
    const newScene: Scene = {
      id: `s-${Date.now()}`,
      text: 'New scene text...',
      image: 'https://picsum.photos/seed/new/1080/1920',
      duration: 3
    };
    setProject(prev => prev ? { ...prev, scenes: [...prev.scenes, newScene] } : undefined);
    setActiveSceneId(newScene.id);
  };

  const handleDeleteScene = (sceneId: string) => {
    setProject(prev => {
      if (!prev) return undefined;
      const newScenes = prev.scenes.filter(s => s.id !== sceneId);
      if (activeSceneId === sceneId && newScenes.length > 0) {
        setActiveSceneId(newScenes[0].id);
      }
      return { ...prev, scenes: newScenes };
    });
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      // In a real app, we would let user pick the type. Hardcoded to MOTIVATIONAL for demo.
      const generatedScenes = await generateScenesFromTopic(aiPrompt, AIScriptType.MOTIVATIONAL);
      setProject(prev => prev ? { ...prev, scenes: [...prev.scenes, ...generatedScenes] } : undefined);
      setShowAiModal(false);
      setAiPrompt('');
      if (generatedScenes.length > 0) setActiveSceneId(generatedScenes[0].id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-surface z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-secondary rounded-full text-muted hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <input
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            className="bg-transparent text-white font-semibold text-lg focus:outline-none focus:border-b border-primary px-1"
          />
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAiModal(!showAiModal)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            <span className="hidden sm:inline">AI Magic</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save & Export</span>
          </button>
        </div>
      </header>

      {/* AI Modal Overlay */}
      {showAiModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              Generate Scenes with AI
            </h2>
            <p className="text-muted text-sm mb-4">
              Enter a topic and Gemini will generate a script and visuals for you.
            </p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., 5 benefits of drinking water..."
              className="w-full h-32 bg-secondary border border-border rounded-lg p-3 text-white focus:outline-none focus:border-primary mb-4 resize-none"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 text-muted hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleAIGenerate}
                disabled={isGenerating || !aiPrompt}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? 'Generating...' : 'Generate Scenes'}
                {isGenerating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Scene List (Timeline) */}
        <aside className="w-72 border-r border-border flex flex-col bg-background">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Scenes</h3>
            <span className="text-xs text-muted">{project.scenes.length} items</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {project.scenes.map((scene, index) => (
              <div 
                key={scene.id}
                onClick={() => setActiveSceneId(scene.id)}
                className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                  activeSceneId === scene.id 
                    ? 'bg-surface border-primary' 
                    : 'bg-surface/50 border-transparent hover:bg-surface hover:border-border'
                }`}
              >
                <div className="text-muted cursor-grab hover:text-white">
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="w-12 h-20 bg-secondary rounded overflow-hidden flex-shrink-0">
                  {scene.image && <img src={scene.image} className="w-full h-full object-cover" alt="scene thumb" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate font-medium">Scene {index + 1}</p>
                  <p className="text-xs text-muted truncate">{scene.text}</p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-muted">
                    <Clock className="w-3 h-3" />
                    {scene.duration}s
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteScene(scene.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-muted hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button 
              onClick={handleAddScene}
              className="w-full py-3 border border-dashed border-border rounded-lg text-muted hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Scene
            </button>
          </div>
        </aside>

        {/* Center: Preview Area */}
        <main className="flex-1 bg-[#0c0c0e] flex items-center justify-center p-8 overflow-hidden relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-secondary/80 backdrop-blur px-3 py-1 rounded-full text-xs text-white flex items-center gap-2">
               <AlertCircle className="w-3 h-3 text-yellow-400"/>
               Preview Mode
            </div>
            
            {activeScene ? (
                <div className="aspect-[9/16] h-full max-h-[80vh] bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-border ring-1 ring-white/5">
                    {/* Video/Image Layer */}
                    <img 
                        src={activeScene.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Text Layer Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <p className="text-white text-2xl font-bold text-center drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                            {activeScene.text}
                        </p>
                    </div>

                    {/* UI Overlays for Preview */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                            <PlayCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-muted flex flex-col items-center">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                        <PlayCircle className="w-8 h-8 text-muted" />
                    </div>
                    <p>Select or add a scene to start editing</p>
                </div>
            )}
        </main>

        {/* Right: Properties Panel */}
        <aside className="w-80 bg-surface border-l border-border flex flex-col overflow-y-auto">
          {activeScene ? (
            <div className="p-6 space-y-6">
               <div className="pb-4 border-b border-border">
                   <h3 className="font-bold text-white text-lg">Properties</h3>
                   <p className="text-xs text-muted">Editing Scene ID: {activeScene.id.slice(-6)}</p>
               </div>

               {/* Text Editing */}
               <div className="space-y-3">
                   <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                       <Type className="w-4 h-4 text-primary" />
                       Script / Text Overlay
                   </label>
                   <textarea
                       value={activeScene.text}
                       onChange={(e) => handleSceneUpdate('text', e.target.value)}
                       className="w-full h-24 bg-secondary border border-border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary resize-none"
                   />
               </div>

               {/* Duration */}
               <div className="space-y-3">
                   <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                       <Clock className="w-4 h-4 text-primary" />
                       Duration (seconds)
                   </label>
                   <div className="flex items-center gap-3">
                       <input
                           type="range"
                           min="1"
                           max="15"
                           step="0.5"
                           value={activeScene.duration}
                           onChange={(e) => handleSceneUpdate('duration', parseFloat(e.target.value))}
                           className="flex-1 accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                       />
                       <span className="w-12 text-center bg-secondary py-1 rounded text-sm font-mono">{activeScene.duration}s</span>
                   </div>
               </div>

               {/* Visuals */}
               <div className="space-y-3">
                   <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                       <ImageIcon className="w-4 h-4 text-primary" />
                       Background Visual
                   </label>
                   <div className="aspect-[9/16] bg-secondary rounded-lg overflow-hidden border border-border relative group">
                       <img src={activeScene.image} className="w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity" />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="bg-primary text-white px-3 py-1.5 rounded text-xs font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                               Change Image
                           </button>
                       </div>
                   </div>
                   <p className="text-xs text-muted">Supported: JPG, PNG, MP4</p>
               </div>
            </div>
          ) : (
              <div className="flex-1 flex items-center justify-center text-muted p-6 text-center text-sm">
                  Select a scene from the timeline to edit its properties.
              </div>
          )}
        </aside>
      </div>
    </div>
  );
};