import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { generateChatContent } from '../services/geminiService';
import { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', parts: [{ text: "Greetings. I am the Tactical Analyst. Which aspect of the strategy do you wish to analyze?" }] }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const playSound = useCallback((id: string) => {
        const audio = document.getElementById(id) as HTMLAudioElement;
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.error("Audio playback failed:", e));
        }
    }, []);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        playSound('audio-click');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if(isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) return;

        playSound('audio-click');
        const userMessage: ChatMessage = { role: 'user', parts: [{ text: trimmedInput }] };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            const modelResponseText = await generateChatContent(newMessages);
            const modelMessage: ChatMessage = { role: 'model', parts: [{ text: modelResponseText }] };
            setMessages(prevMessages => [...prevMessages, modelMessage]);
            playSound('audio-success');
        } catch (error: any) {
            const errorMessage: ChatMessage = { role: 'model', parts: [{ text: error.message || "An error occurred while processing your request." }] };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 bg-fuchsia-600 text-white p-4 rounded-full shadow-lg hover:bg-fuchsia-500 transition-transform transform hover:scale-110 z-50"
                aria-label="Open analysis chat"
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </button>

            <div className={`fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[600px] flex flex-col z-50 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl flex flex-col h-full">
                    <header className="flex items-center justify-between p-4 border-b border-gray-700 shrink-0">
                        <div className="flex items-center gap-3">
                            <Bot className="text-fuchsia-400" />
                            <h3 className="font-bold text-white">Tactical Analyst</h3>
                        </div>
                        <button onClick={toggleChat} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </header>

                    <div className="flex-1 p-4 overflow-y-auto scrollbar-hide space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0"><Bot size={20} className="text-fuchsia-400" /></div>}
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                    msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-lg'
                                        : 'bg-gray-800 text-gray-300 rounded-bl-lg'
                                }`}>
                                    {msg.parts[0].text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                             <div className="flex items-end gap-2 justify-start">
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0"><Bot size={20} className="text-fuchsia-400" /></div>
                                <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-gray-800 text-gray-300 rounded-bl-lg">
                                    <div className="flex gap-1.5 items-center py-1">
                                        <span className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                                        <span className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                        <span className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 shrink-0">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask something..."
                                className="flex-1 bg-gray-800 border border-gray-600 rounded-full py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
                                disabled={isLoading}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                            <button type="submit" disabled={isLoading || !inputValue.trim()} className="bg-fuchsia-600 text-white p-3 rounded-full hover:bg-fuchsia-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors shrink-0">
                                <Send size={20} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
