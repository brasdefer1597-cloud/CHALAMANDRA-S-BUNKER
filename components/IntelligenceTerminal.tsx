import React, { useState } from 'react';
import { Video, Image as ImageIcon, Map, Search, Brain, Zap, Loader2, Play } from 'lucide-react';
import { generateVideoVeo, generateImagePro, searchGrounding, mapsGrounding, analyzeThinking } from '../services/geminiService';

const IntelligenceTerminal: React.FC = () => {
    const [mode, setMode] = useState<'video' | 'image' | 'grounding' | 'thinking'>('thinking');
    const [input, setInput] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleAction = async () => {
        if (!input) return;
        setLoading(true);
        setResult(null);
        try {
            if (mode === 'thinking') {
                const res = await analyzeThinking(input);
                setResult({ text: res });
            } else if (mode === 'grounding') {
                const res = await searchGrounding(input);
                setResult(res);
            } else if (mode === 'video') {
                if (!(await window.aistudio.hasSelectedApiKey())) {
                    await window.aistudio.openSelectKey();
                }
                const res = await generateVideoVeo(input);
                setResult({ video: res });
            } else if (mode === 'image') {
                const res = await generateImagePro(input, '1K', '16:9');
                setResult({ image: res });
            }
        } catch (e: any) {
            setResult({ error: e.message });
        }
        setLoading(false);
    };

    return (
        <div className="bg-zinc-950 border border-fuchsia-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(217,70,239,0.1)]">
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: 'thinking', icon: Brain, label: 'Modo Pensamiento' },
                    { id: 'grounding', icon: Search, label: 'Rastreo Real' },
                    { id: 'image', icon: ImageIcon, label: 'Visual Pro' },
                    { id: 'video', icon: Video, label: 'Cinemática Veo' }
                ].map(m => (
                    <button
                        key={m.id}
                        onClick={() => setMode(m.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all shrink-0 ${
                            mode === m.id ? 'bg-fuchsia-600 border-fuchsia-400 text-white shadow-lg shadow-fuchsia-500/20' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                        }`}
                    >
                        <m.icon size={18} />
                        <span className="text-sm font-bold uppercase">{m.label}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ingresa directiva para ${mode}...`}
                    className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-fuchsia-100 placeholder-zinc-700 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
                />
                <button
                    onClick={handleAction}
                    disabled={loading}
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-fuchsia-900/20 transition-all active:scale-95"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
                    {loading ? 'PROCESANDO EN EL BÚNKER...' : 'EJECUTAR ORDEN'}
                </button>
            </div>

            {result && (
                <div className="mt-8 animate-fadeIn border-t border-zinc-800 pt-6">
                    {result.error && <div className="text-red-400 font-mono bg-red-950/20 p-4 rounded-lg border border-red-500/30">ERROR: {result.error}</div>}
                    {result.text && <div className="prose prose-invert max-w-none text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap">{result.text}</div>}
                    {result.links && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {result.links.map((l: any, i: number) => (
                                <a key={i} href={l.uri} target="_blank" rel="noreferrer" className="text-xs bg-zinc-800 hover:bg-zinc-700 text-fuchsia-400 px-3 py-1 rounded-full border border-fuchsia-500/20">
                                    {l.title}
                                </a>
                            ))}
                        </div>
                    )}
                    {result.image && <img src={result.image} alt="Generación" className="w-full rounded-xl border border-zinc-700 shadow-2xl mt-4" />}
                    {result.video && (
                        <video src={result.video} controls className="w-full rounded-xl border border-zinc-700 shadow-2xl mt-4" autoPlay loop />
                    )}
                </div>
            )}
        </div>
    );
};

export default IntelligenceTerminal;
