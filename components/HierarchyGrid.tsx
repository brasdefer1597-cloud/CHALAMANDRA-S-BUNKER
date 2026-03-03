import React from 'react';
import { ChessPiece } from '../types';
import { iconMap } from '../mappings/iconMap';
import { LucideIcon } from 'lucide-react';

interface HierarchyGridProps {
  pieces: ChessPiece[];
  selectedPiece: ChessPiece;
  onSelectPiece: (piece: ChessPiece) => void;
  playClickSound: () => void;
}

const HierarchyGrid: React.FC<HierarchyGridProps> = ({ pieces, selectedPiece, onSelectPiece, playClickSound }) => {
  
  const handleSelect = (piece: ChessPiece) => {
    onSelectPiece(piece);
    playClickSound();
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {pieces.map((piece) => {
        const isSelected = selectedPiece.id === piece.id;
        const IconComponent = typeof piece.icon === 'string' ? iconMap[piece.icon] : piece.icon;
        
        if (!IconComponent) {
          console.warn(`Icon component not found for piece: ${piece.name}`);
          return null;
        }

        return (
          <button
            key={piece.id}
            onClick={() => handleSelect(piece)}
            className={`
              relative group p-4 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center h-40 transform
              ${isSelected 
                ? 'bg-zinc-800 border-fuchsia-500 scale-105 shadow-[0_0_30px_rgba(217,70,239,0.3)]' 
                : 'bg-zinc-900/50 border-zinc-800 hover:border-fuchsia-500/50 hover:bg-zinc-800/80 hover:scale-105 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)]'
              }
            `}
          >
            <div className="relative">
              {isSelected && (
                <div 
                  className="absolute -inset-3 rounded-full bg-fuchsia-500/20 blur-xl animate-pulse"
                  style={{ animationDuration: '3s' }}
                />
              )}
              <div className={`
                relative z-10 p-3 rounded-full bg-gray-950 transition-colors
                ${isSelected ? 'text-white' : piece.color}
              `}>
                <IconComponent size={32} />
              </div>
            </div>
            
            <div>
              <h3 className={`font-bold text-sm md:text-base ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                {piece.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                {piece.chessFunction.split(' ')[0]}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default HierarchyGrid;
