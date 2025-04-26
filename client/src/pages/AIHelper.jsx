import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { chat } from '../services/api';

const AIHelper = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await chat.askQuestion(input);
            const aiMessage = { text: response.data.answer, sender: 'ai' };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = {
                text: 'Sorry, there was an error processing your question.',
                sender: 'ai',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">AI Helper</h1>
                    
                    <div className="mt-8 bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="space-y-6">
                                {/* Chat Messages */}
                                <div className="h-96 overflow-y-auto p-4 space-y-4">
                                    {messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${
                                                message.sender === 'user'
                                                    ? 'justify-end'
                                                    : 'justify-start'
                                            }`}
                                        >
                                            <div
                                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                    message.sender === 'user'
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-200 text-gray-800'
                                                }`}
                                            >
                                                {message.text}
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                                                Thinking...
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Form */}
                                <form onSubmit={handleSubmit} className="mt-4">
                                    <div className="flex space-x-4">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Ask a question about your data..."
                                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            disabled={loading}
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading || !input.trim()}
                                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                                                loading || !input.trim()
                                                    ? 'bg-indigo-400 cursor-not-allowed'
                                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                        >
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AIHelper; 