import React, { useState } from 'react';
import { Video, Image as ImageIcon, Map, Search, Brain, Zap, Loader2, Play, Edit, Globe, FileText } from 'lucide-react';
import { generateVideoVeo, generateImagePro, searchGrounding, mapsGrounding, editImageFlash, analyzeMedia } from '../services/geminiService';
import { analyzeThinkingOpenAI } from '../services/openaiService';
import { useTactical } from '../context/TacticalContext';

const IntelligenceTerminal: React.FC = () => {
    const { addToHistory } = useTactical();
    const [mode, setMode] = useState<'video' | 'image' | 'grounding' | 'thinking' | 'maps' | 'edit' | 'document'>('thinking');
    const [input, setInput] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9'>('16:9');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<{ data: string, mimeType: string } | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFile({
                    data: (reader.result as string).split(',')[1],
                    mimeType: file.type
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAction = async () => {
        if (!input && mode !== 'edit' && mode !== 'document') return;
        setLoading(true);
        setResult(null);
        try {
            if (mode === 'thinking') {
                const res = await analyzeThinkingOpenAI(input);
                setResult({ text: res });
                addToHistory(`Thinking: ${input.substring(0, 20)}...`);
            } else if (mode === 'grounding') {
                const res = await searchGrounding(input);
                setResult(res);
                addToHistory(`Search: ${input.substring(0, 20)}...`);
            } else if (mode === 'maps') {
                const res = await mapsGrounding(input);
                setResult(res);
                addToHistory(`Maps: ${input.substring(0, 20)}...`);
            } else if (mode === 'video') {
                if (!(await window.aistudio.hasSelectedApiKey())) {
                    await window.aistudio.openSelectKey();
                }
                const res = await generateVideoVeo(input);
                setResult({ video: res });
                addToHistory(`Video: ${input.substring(0, 20)}...`);
            } else if (mode === 'image') {
                const res = await generateImagePro(input, '1K', aspectRatio);
                setResult({ image: res });
                addToHistory(`Image: ${input.substring(0, 20)}...`);
            } else if (mode === 'edit') {
                if (!selectedImage) throw new Error("Upload an image first.");
                const res = await editImageFlash(selectedImage, input);
                setResult({ image: res });
                addToHistory(`Edit: ${input.substring(0, 20)}...`);
            } else if (mode === 'document') {
                if (!selectedFile) throw new Error("Upload a document/image/video first.");
                const res = await analyzeMedia(selectedFile.data, selectedFile.mimeType, input || "Analyze this evidence.");
                setResult({ text: res });
                addToHistory(`Media Analysis: ${input.substring(0, 20)}...`);
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
                    { id: 'thinking', icon: Brain, label: 'Thinking Mode' },
                    { id: 'grounding', icon: Search, label: 'Real Tracking' },
                    { id: 'maps', icon: Globe, label: 'Safe Houses' },
                    { id: 'document', icon: FileText, label: 'Evidence Analysis' },
                    { id: 'image', icon: ImageIcon, label: 'Visual Pro' },
                    { id: 'edit', icon: Edit, label: 'Visual Recon' },
                    { id: 'video', icon: Video, label: 'Veo Cinematic' }
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
                {mode === 'image' && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(r => (
                            <button
                                key={r}
                                onClick={() => setAspectRatio(r as any)}
                                className={`px-3 py-1 text-xs rounded-md border transition-all ${aspectRatio === r ? 'bg-fuchsia-500 border-fuchsia-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                )}

                {mode === 'edit' && (
                    <div className="mb-4">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                        <label htmlFor="image-upload" className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl cursor-pointer hover:border-fuchsia-500/50 transition-all text-zinc-500 hover:text-fuchsia-400">
                            {selectedImage ? <img src={selectedImage} className="h-20 rounded-md" /> : <><ImageIcon size={24} /> Upload Target Image</>}
                        </label>
                    </div>
                )}

                {mode === 'document' && (
                    <div className="mb-4">
                        <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" id="file-upload" />
                        <label htmlFor="file-upload" className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl cursor-pointer hover:border-fuchsia-500/50 transition-all text-zinc-500 hover:text-fuchsia-400">
                            {selectedFile ? <span className="text-fuchsia-400 font-mono text-xs">FILE LOADED: {selectedFile.mimeType}</span> : <><FileText size={24} /> Upload Evidence (PDF/Image)</>}
                        </label>
                    </div>
                )}

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Enter directive for ${mode}...`}
                    className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-fuchsia-100 placeholder-zinc-700 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
                />
                <button
                    onClick={handleAction}
                    disabled={loading}
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-fuchsia-900/20 transition-all active:scale-95"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
                    {loading ? 'PROCESSING IN THE BUNKER...' : 'EXECUTE ORDER'}
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
                    {result.image && <img src={result.image} alt="Generation" className="w-full rounded-xl border border-zinc-700 shadow-2xl mt-4" />}
                    {result.video && (
                        <video src={result.video} controls className="w-full rounded-xl border border-zinc-700 shadow-2xl mt-4" autoPlay loop />
                    )}
                </div>
            )}
        </div>
    );
};

export default IntelligenceTerminal;
