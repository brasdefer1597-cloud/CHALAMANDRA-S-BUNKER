import React, { useState, useEffect } from 'react';
import { Dices, Activity, Swords } from 'lucide-react';
import { simulateScenario } from '../services/geminiService';

const StrategySimulator: React.FC = () => {
  const [scenarioInput, setScenarioInput] = useState('');
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [displayedResult, setDisplayedResult] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  useEffect(() => {
    if (simulationResult) {
        setDisplayedResult('');
        let i = 0;
        const intervalId = setInterval(() => {
            i++;
            setDisplayedResult(simulationResult.substring(0, i));
            if (i >= simulationResult.length) {
                clearInterval(intervalId);
            }
        }, 15);
        return () => clearInterval(intervalId);
    }
  }, [simulationResult]);


  const handleSimulateScenario = async () => {
    if (isSimulating || !scenarioInput.trim()) return;

    setIsSimulating(true);
    setSimulationResult(null);
    setDisplayedResult('');
    setSimulationError(null);

    try {
      const resultText = await simulateScenario(scenarioInput);
      setSimulationResult(resultText);
    } catch (e: any) {
      setSimulationError(e.message || "Fallo en la simulación del escenario. Inténtalo de nuevo.");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 shadow-2xl space-y-6">
      <h3 className="text-3xl font-bold text-fuchsia-500 flex items-center gap-3">
        <Dices size={28} />
        Simulador de Escenarios Estratégicos
      </h3>
      <p className="text-gray-400">
        Introduce un movimiento o estrategia de alto nivel y la IA generará una respuesta táctica de las autoridades (la "Contra-Movida").
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={scenarioInput}
          onChange={(e) => setScenarioInput(e.target.value)}
          placeholder="Ej: Intentar corromper a la Torre de control fronterizo..."
          className="flex-grow p-3 rounded-lg bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:ring-amber-400 focus:border-amber-400 transition-colors"
        />
        <button
          onClick={handleSimulateScenario}
          disabled={isSimulating || !scenarioInput.trim()}
          className={`shrink-0 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold transition-all duration-300
            ${isSimulating || !scenarioInput.trim()
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-amber-400 text-gray-900 hover:bg-amber-300 shadow-md shadow-amber-400/30'
            }
          `}
        >
          {isSimulating ? <><Dices size={20} className="animate-spin" /> Simulando...</> : <><Activity size={20} /> Analizar Movida</>}
        </button>
      </div>

      {(simulationResult || simulationError || isSimulating) && (
        <div className={`mt-6 p-5 bg-gray-950 border rounded-lg shadow-inner transition-opacity duration-500 ${isSimulating ? 'border-fuchsia-500/50 animate-pulse' : 'border-fuchsia-500/50'}`}>
          <h4 className="text-lg font-bold text-fuchsia-400 mb-2 flex items-center gap-2"><Swords size={20} /> Resultado de Simulación (IA)</h4>
          {simulationError && <p className="text-red-400 font-medium">{simulationError}</p>}
          {isSimulating && !simulationResult && <p className="text-gray-400">Analizando vectores... por favor, espera.</p>}
          {displayedResult && <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: displayedResult.replace(/\n/g, '<br />') + (isSimulating ? '' : '<span class="blinking-cursor">▍</span>') }}></div>}
        </div>
      )}
    </div>
  );
};

export default StrategySimulator;
