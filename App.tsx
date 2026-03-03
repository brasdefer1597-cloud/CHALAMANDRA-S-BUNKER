
import React, { useState, useEffect } from 'react';
import DashboardHeader from './components/DashboardHeader';
import HierarchyGrid from './components/HierarchyGrid';
import PieceDetail from './components/PieceDetail';
import StrategySection from './components/StrategySection';
import Chatbot from './components/Chatbot';
import StrategySimulator from './components/StrategySimulator';
import IntelligenceTerminal from './components/IntelligenceTerminal';
import VoiceIntelligence from './components/VoiceIntelligence';
import { CHESS_PIECES, STRATEGIES, REALITY_CHECKS } from './constants/appData';
import { ChessPiece } from './types';
// FIX: Added ShieldAlert to imports
import { Info, AlertTriangle, Terminal, Mic, ShieldAlert } from 'lucide-react';
import { useAudio } from './hooks/useAudio';

function App() {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'strategy' | 'terminal'>('hierarchy');
  const [selectedPiece, setSelectedPiece] = useState<ChessPiece>(CHESS_PIECES[0]);
  const [isLoading, setIsLoading] = useState(true);
  const { playHoverSound, playClickSound, playSuccessSound } = useAudio();

  useEffect(() => {
    const loader = document.getElementById('loader');
    const timer = setTimeout(() => {
      if (loader) {
        loader.classList.add('hiding');
        setTimeout(() => {
          setIsLoading(false);
          loader.classList.add('hidden');
        }, 800);
      } else {
        setIsLoading(false);
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-200 font-sans selection:bg-fuchsia-500 selection:text-white animate-fadeIn overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 z-[60]" />
      <DashboardHeader playHoverSound={playHoverSound} playClickSound={playClickSound} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        <div className="mb-12 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-black uppercase tracking-[0.2em] mb-6">
            <ShieldAlert size={14} />
            Acceso Nivel Élite // SRAP PROTOCOL
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight italic">
            EL BÚNKER DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-lime-400 animate-glitch">CHALAMANDRA</span>
          </h2>
          <p className="text-zinc-400 text-xl font-light max-w-2xl mx-auto border-l-2 border-fuchsia-500 pl-6 text-left italic">
            "En la calle mandan los peones, en el búnker manda la visión. Aquí no jugamos ajedrez, decodificamos el destino."
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
                { id: 'hierarchy', label: 'La Jerarquía', icon: Info },
                { id: 'strategy', label: 'Estrategia', icon: AlertTriangle },
                { id: 'terminal', label: 'Terminal Inteligencia', icon: Terminal }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); playClickSound(); }}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black uppercase tracking-widest transition-all duration-300 border-2 ${
                        activeTab === tab.id 
                        ? 'bg-fuchsia-600 border-fuchsia-400 text-white shadow-[0_0_30px_rgba(217,70,239,0.3)] -translate-y-1' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                >
                    <tab.icon size={18} />
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3">
                {activeTab === 'hierarchy' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[700px] animate-fadeIn">
                        <div className="lg:col-span-5">
                            <HierarchyGrid pieces={CHESS_PIECES} selectedPiece={selectedPiece} onSelectPiece={setSelectedPiece} playClickSound={playClickSound} />
                        </div>
                        <div className="lg:col-span-7">
                            <PieceDetail key={selectedPiece.id} piece={selectedPiece} playClickSound={playClickSound} playSuccessSound={playSuccessSound} />
                        </div>
                    </div>
                )}

                {activeTab === 'strategy' && (
                    <div className="space-y-12 animate-fadeIn">
                        <StrategySimulator />
                        <StrategySection strategies={STRATEGIES} realityChecks={REALITY_CHECKS} playClickSound={playClickSound} />
                    </div>
                )}

                {activeTab === 'terminal' && <IntelligenceTerminal />}
            </div>

            <div className="xl:col-span-1 space-y-8">
                <VoiceIntelligence />
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                    <h4 className="text-fuchsia-400 font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
                        <Info size={16} /> Estado del Sistema
                    </h4>
                    <ul className="space-y-3 text-xs font-mono text-zinc-500">
                        <li className="flex justify-between border-b border-zinc-800 pb-1"><span>LATENCIA IA:</span> <span className="text-lime-400">OPTIMIZADO</span></li>
                        <li className="flex justify-between border-b border-zinc-800 pb-1"><span>VOZ SRAP:</span> <span className="text-lime-400">ONLINE</span></li>
                        <li className="flex justify-between border-b border-zinc-800 pb-1"><span>VEO ENGINE:</span> <span className="text-fuchsia-400">CARGADO</span></li>
                        <li className="flex justify-between"><span>UBICACIÓN:</span> <span className="text-white">CIFRADO</span></li>
                    </ul>
                </div>
            </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-zinc-900 py-12 bg-black/40">
        <div className="max-w-7xl mx-auto px-8 text-center">
            <p className="text-zinc-600 text-xs font-mono tracking-widest">
                DISEÑADO POR CHALAMANDRA MAGISTRAL // ELITE ARCHITECTURE // 2025
            </p>
        </div>
      </footer>
      
      <Chatbot />
    </div>
  );
}

export default App;
