import React from 'react';
import { Menu, Share2, Shield } from 'lucide-react';

interface DashboardHeaderProps {
  playHoverSound: () => void;
  playClickSound: () => void;
}

import { useTactical } from '../context/TacticalContext';

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ playHoverSound, playClickSound }) => {
  const { isSynced } = useTactical();

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 group cursor-pointer" onMouseEnter={playHoverSound}>
            <div className="w-8 h-8 bg-fuchsia-500 rounded flex items-center justify-center text-white font-bold text-lg group-hover:animate-glitch shadow-lg shadow-fuchsia-500/20">
              <Shield size={18} fill="currentColor" />
            </div>
            <div className="group-hover:animate-glitch">
              <h1 className="text-xl font-bold tracking-tight text-white uppercase">
                DECOX <span className="text-amber-400">//</span> DOSSIER
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">
                CHALAMANDRA MAGISTRAL
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                <div className={`w-2 h-2 rounded-full ${isSynced ? 'bg-lime-400 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tighter">
                    {isSynced ? 'Bunker Sync: Active' : 'Bunker Sync: Offline'}
                </span>
             </div>
             <button onMouseEnter={playHoverSound} onClick={playClickSound} className="text-gray-400 hover:text-white transition-colors" title="Share Dossier">
               <Share2 size={20} />
             </button>
             <button onMouseEnter={playHoverSound} onClick={playClickSound} className="text-gray-400 hover:text-white transition-colors" title="Navigation Menu">
               <Menu size={24} />
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;