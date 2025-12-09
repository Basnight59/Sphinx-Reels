import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutTemplate, Home, Settings, LogOut, Clapperboard } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/templates', icon: LayoutTemplate, label: 'Templates' },
    { path: '/admin', icon: Settings, label: 'Admin' },
  ];

  return (
    <div className="flex h-screen bg-background text-text font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-border flex flex-col bg-surface">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-border">
          <Clapperboard className="w-8 h-8 text-primary" />
          <span className="hidden lg:block ml-3 font-bold text-xl tracking-tight">Faceless AI</span>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-3 rounded-lg transition-colors group ${
                isActive(item.path) 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted hover:bg-secondary hover:text-white'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive(item.path) ? 'text-primary' : 'text-muted group-hover:text-white'}`} />
              <span className="hidden lg:block ml-3 font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button 
            onClick={() => window.location.reload()} 
            className="flex items-center w-full px-3 py-3 rounded-lg text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-6 h-6" />
            <span className="hidden lg:block ml-3 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        {children}
      </main>
    </div>
  );
};