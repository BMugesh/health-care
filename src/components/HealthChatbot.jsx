import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Heart } from 'lucide-react';
import { sendHealthMessage } from '../services/groqService';

/**
 * HealthChatbot Component
 * 
 * A floating chatbot that only answers health-related questions.
 * Features:
 * - Floating button with pulse animation
 * - Expandable chat window
 * - Message history
 * - Health-topic filtering
 * - Modern, responsive design
 */
export default function HealthChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '👋 Hello! I\'m your healthcare assistant. I can help answer questions about health, wellness, nutrition, fitness, and medical topics. How can I assist you today?'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');

        // Add user message to chat
        const newMessages = [
            ...messages,
            { role: 'user', content: userMessage }
        ];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // Prepare conversation history for API (exclude welcome message)
            const conversationHistory = newMessages
                .slice(1) // Skip the welcome message
                .map(msg => ({
                    role: msg.role,
                    content: msg.content
                }));

            // Get AI response
            const response = await sendHealthMessage(userMessage, conversationHistory);

            // Add AI response to chat
            setMessages([
                ...newMessages,
                { role: 'assistant', content: response }
            ]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content: `❌ ${error.message || 'Sorry, I encountered an error. Please try again.'}`
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Format message content to render bold text and proper formatting
    const formatMessage = (content) => {
        // Split by **text** pattern for bold
        const parts = content.split(/(\*\*.*?\*\*)/g);

        return parts.map((part, index) => {
            // Check if this part is bold (wrapped in **)
            if (part.startsWith('**') && part.endsWith('**')) {
                const boldText = part.slice(2, -2);
                return <strong key={index} className="font-semibold">{boldText}</strong>;
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">Health Assistant</h3>
                                <p className="text-emerald-100 text-xs">Ask me about health topics</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                                        : 'bg-white text-gray-800 shadow-md border border-gray-100'
                                        }`}
                                >
                                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                        {formatMessage(message.content)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask a health question..."
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                                aria-label="Send message"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            💡 I only answer health-related questions
                        </p>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group relative"
                aria-label="Open health chatbot"
            >
                {/* Pulse Animation */}
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>

                {/* Icon */}
                <div className="relative">
                    {isOpen ? (
                        <X className="w-7 h-7" />
                    ) : (
                        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                    )}
                </div>

                {/* Badge for "New" or notification */}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <Heart className="w-3 h-3 text-white" />
                    </div>
                )}
            </button>

            {/* Custom Animations */}
            <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}
