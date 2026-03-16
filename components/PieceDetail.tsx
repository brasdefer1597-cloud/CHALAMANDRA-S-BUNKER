import React, { useState, useEffect } from 'react';
import { ChessPiece } from '../types';
import { iconMap } from '../mappings/iconMap';
import { useTactical } from '../context/TacticalContext';

interface PieceDetailProps {
  piece: ChessPiece;
  playClickSound: () => void;
  playSuccessSound: () => void;
}

const PieceDetail: React.FC<PieceDetailProps> = ({ piece, playClickSound, playSuccessSound }) => {
  const { state: tacticalState, addAnalyzedPiece, setLastStrategy, addToHistory } = useTactical();
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    setGeneratedStrategy('');
    setGenerationError(null);
  }, [piece.id]);

  const handleGenerateCounterStrategy = async () => {
    if (isGenerating) return;
    
    playClickSound();
    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedStrategy('');
    
    try {
      const result = await generateCounterStrategy(piece, tacticalState);
      setGeneratedStrategy(result);
      setLastStrategy(result);
      addAnalyzedPiece(piece.name);
      addToHistory(`Analyzed ${piece.criminalRole} (${piece.name})`);
      playSuccessSound();
    } catch (e: any) {
      setGenerationError(e.message || "Failed to contact the AI engine. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- OPTIMIZATION --- 
  // All icons are now dynamically resolved from the central iconMap.
  // This removes conditional rendering logic and makes the component cleaner and easier to maintain.
  const Icon = iconMap[piece.icon];
  const DicesIcon = iconMap['Dices'];
  const StarIcon = iconMap['StarIcon'];
  const ArrowRightIcon = iconMap['ArrowRight'];
  const ShieldIcon = iconMap['Shield'];
  const ZapIcon = iconMap['Zap'];

  if (!Icon) {
    console.error(`Icon not found for key: ${piece.icon}`);
    return null; // or render a fallback UI
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden h-full flex flex-col animate-fadeIn">
      <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-4 animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <div className={`relative p-4 rounded-xl bg-gray-950 border border-gray-700 ${piece.color}`}>
                    <div className="absolute inset-0 rounded-xl bg-current opacity-20 blur-lg animate-pulse" style={{animationDuration: '4s'}}></div>
                    <div className="absolute top-1 right-1 w-2 h-2 bg-current rounded-full animate-soft-pulse shadow-[0_0_8px_currentColor]"></div>
                    <Icon size={40} className="relative z-10" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{piece.criminalRole}</h2>
                    <p className="text-fuchsia-400 font-medium flex items-center gap-2 mt-1">
                        <span className="text-gray-400">Archetype:</span> {piece.name}
                    </p>
                </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border animate-fadeIn ${
                piece.riskLevel === 'Critical' ? 'border-red-500 text-red-500 bg-red-500/10' :
                piece.riskLevel === 'High' ? 'border-orange-500 text-orange-500 bg-orange-500/10' :
                'border-green-500 text-green-500 bg-green-500/10'
            }`} style={{ animationDelay: '300ms' }}>
                RISK: {piece.riskLevel.toUpperCase()}
            </div>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-grow overflow-y-auto scrollbar-hide">
        <p className="text-lg text-gray-300 leading-relaxed animate-fadeIn" style={{ animationDelay: '400ms' }}>
            {piece.description}
        </p>

        <div className="pt-2 border-t border-gray-800 animate-fadeIn" style={{ animationDelay: '500ms' }}>
            <button
                onClick={handleGenerateCounterStrategy}
                disabled={isGenerating}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-all duration-300
                    ${isGenerating 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-fuchsia-600 text-white hover:bg-fuchsia-500 shadow-lg shadow-fuchsia-600/30'
                }`}
            >
                {isGenerating ? (
                    <>{DicesIcon && <DicesIcon size={20} className="animate-spin" />} Analyzing...</>
                ) : (
                    <>{StarIcon && <StarIcon size={20} />} Generate Counter-Strategy {ArrowRightIcon && <ArrowRightIcon size={20} />}</>
                )}
            </button>
        </div>

        {(generatedStrategy || generationError || isGenerating) && (
            <div className={`mt-6 p-4 bg-gray-950/50 border rounded-lg shadow-inner transition-all duration-300 ${isGenerating ? 'animate-pulse-border' : 'border-fuchsia-500/30'}`}>
                <h4 className="text-lg font-bold text-fuchsia-400 mb-2 flex items-center gap-2">
                    {ShieldIcon && <ShieldIcon size={20} />}
                    Neutralization Plan (AI Analysis)
                </h4>
                {isGenerating && !generatedStrategy && !generationError && <p className="text-gray-400 animate-pulse">Generating counter-strategy analysis... The system is correlating attack vectors.</p>}
                {generationError && <p className="text-red-400 font-medium">{generationError}</p>}
                {generatedStrategy && <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm prose prose-sm prose-invert max-w-none animate-fadeIn" dangerouslySetInnerHTML={{ __html: generatedStrategy.replace(/\n/g, '<br />') }}></div>}
            </div>
        )}

        <div className="grid grid-cols-1 gap-4 mt-4 animate-fadeIn" style={{ animationDelay: '600ms' }}>
            <div className="bg-gray-950 p-4 rounded-xl border-l-4 border-indigo-400">
                <div className="flex items-center gap-2 mb-2">
                    {ShieldIcon && <ShieldIcon size={18} className="text-indigo-400" />}
                    <h4 className="text-sm font-bold text-gray-400 uppercase">In Chess</h4>
                </div>
                <p className="text-gray-200">{piece.chessFunction}</p>
            </div>
            <div className="bg-gray-950 p-4 rounded-xl border-l-4 border-fuchsia-500">
                <div className="flex items-center gap-2 mb-2">
                    {ZapIcon && <ZapIcon size={18} className="text-fuchsia-500" />}
                    <h4 className="text-sm font-bold text-gray-400 uppercase">In Crime</h4>
                </div>
                <p className="text-gray-200">{piece.criminalFunction}</p>
            </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-end text-[10px] text-gray-600 font-mono uppercase animate-fadeIn" style={{ animationDelay: '700ms' }}>
            <div>ID: {piece.id.toUpperCase()}_SEQ_00{Math.floor(Math.random() * 99)}</div>
            <div>STATUS: ACTIVE</div>
        </div>
      </div>
    </div>
  );
};

export default PieceDetail;