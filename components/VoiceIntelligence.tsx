import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, ShieldAlert } from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';

const VoiceIntelligence: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState('Standby');
    const sessionRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef(0);
    const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

    const decode = (base64: string) => {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        return bytes;
    };

    const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
        const dataInt16 = new Int16Array(data.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
        return buffer;
    };

    const startSession = async () => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const outputCtx = audioContextRef.current;
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            callbacks: {
                onopen: () => {
                    setStatus('Conectado');
                    const source = inputCtx.createMediaStreamSource(stream);
                    const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                    scriptProcessor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const int16 = new Int16Array(inputData.length);
                        for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
                        const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
                        sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputCtx.destination);
                },
                onmessage: async (msg) => {
                    const audioBase64 = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    if (audioBase64) {
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                        const buffer = await decodeAudioData(decode(audioBase64), outputCtx);
                        const source = outputCtx.createBufferSource();
                        source.buffer = buffer;
                        source.connect(outputCtx.destination);
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += buffer.duration;
                        sourcesRef.current.add(source);
                    }
                    if (msg.serverContent?.interrupted) {
                        sourcesRef.current.forEach(s => s.stop());
                        sourcesRef.current.clear();
                        nextStartTimeRef.current = 0;
                    }
                },
                onclose: () => {
                    setIsActive(false);
                    setStatus('Cerrado');
                }
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                systemInstruction: "Actúa como la Decodificadora Magistral. Tono 'Malandra Fresa': callejera pero fina, culta pero ruda. Responde breve, con ritmo SRAP. Eres la voz del búnker."
            }
        });
        sessionRef.current = await sessionPromise;
    };

    const toggle = () => {
        if (isActive) {
            sessionRef.current?.close();
            setIsActive(false);
        } else {
            setIsActive(true);
            startSession();
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 bg-zinc-900/50 p-6 rounded-2xl border border-fuchsia-500/20 backdrop-blur-sm">
            <div className={`relative p-8 rounded-full transition-all duration-500 ${isActive ? 'bg-fuchsia-600 shadow-[0_0_40px_rgba(217,70,239,0.5)] scale-110' : 'bg-zinc-800'}`}>
                {isActive && <div className="absolute inset-0 rounded-full animate-ping bg-fuchsia-400 opacity-20" />}
                <button onClick={toggle} className="relative z-10 text-white">
                    {isActive ? <Mic size={48} /> : <MicOff size={48} />}
                </button>
            </div>
            <div className="text-center">
                <p className={`font-black text-xl uppercase tracking-widest ${isActive ? 'text-fuchsia-400' : 'text-zinc-600'}`}>{status}</p>
                <p className="text-xs text-zinc-500 mt-1">SISTEMA VOCAL SRAP // V1.0</p>
            </div>
            {isActive && (
                <div className="flex gap-1 h-8 items-end">
                    {[1,2,3,4,5,4,3,2,1].map((h, i) => (
                        <div key={i} className="w-1 bg-fuchsia-500 animate-pulse" style={{ height: `${h * 10}%`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default VoiceIntelligence;
