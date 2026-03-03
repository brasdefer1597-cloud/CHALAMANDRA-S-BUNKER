import React, { useState } from 'react';
import { StrategyTactic } from '../types';

interface StrategySectionProps {
    strategies: StrategyTactic[];
    realityChecks: { title: string; content: string; icon: React.ElementType }[];
    playClickSound: () => void;
}

const StrategySection: React.FC<StrategySectionProps> = ({ strategies, realityChecks, playClickSound }) => {
  const [activeCheck, setActiveCheck] = useState<number | null>(null);

  const handleCheckClick = (index: number) => {
    playClickSound();
    setActiveCheck(activeCheck === index ? null : index);
  };
    
  return (
    <div className="space-y-12">
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center tracking-tight">Estrategias y Aperturas Ilegales</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {strategies.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 shadow-xl hover:shadow-fuchsia-500/10">
                <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-amber-400/20 text-amber-400 mr-4">
                        <Icon size={24} />
                    </div>
                    <h4 className="text-2xl font-extrabold text-amber-400">{s.title}</h4>
                </div>
                
                <div className="space-y-4 text-sm">
                    <div className="p-3 bg-gray-950 rounded-lg border-l-4 border-indigo-400/70">
                        <p className="text-gray-400 font-semibold mb-1 uppercase tracking-wider text-xs">Concepto Ajedrez</p>
                        <p className="text-gray-300">{s.chessConcept}</p>
                    </div>
                    <div className="p-3 bg-gray-950 rounded-lg border-l-4 border-fuchsia-500/70">
                        <p className="text-gray-400 font-semibold mb-1 uppercase tracking-wider text-xs">Concepto Criminal</p>
                        <p className="text-gray-300">{s.criminalConcept}</p>
                    </div>
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="text-3xl md:text-4xl font-bold text-white pt-8 mb-6 text-center tracking-tight border-t border-gray-800">
            Comprobaciones de Realidad (Reality Checks)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {realityChecks.map((r, index) => {
                const Icon = r.icon;
                const isActive = activeCheck === index;
                return (
                    <button 
                        key={index} 
                        onClick={() => handleCheckClick(index)}
                        className={`bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg text-left transition-all duration-300 hover:border-red-500/50 hover:shadow-red-500/10 ${isActive ? 'bg-gray-800/50' : ''}`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Icon size={20} className="text-red-500" />
                            <h4 className="text-lg font-bold text-white">{r.title}</h4>
                        </div>
                        {isActive ? (
                             <p className="text-gray-400 text-sm animate-flipIn">{r.content}</p>
                        ) : (
                             <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-4 opacity-70">Expandir análisis</p>
                        )}
                    </button>
                );
            })}
        </div>
    </div>
  );
};

export default StrategySection;