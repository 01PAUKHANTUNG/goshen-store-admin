import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../config.js';
import { toast } from 'react-toastify';

const ContactMessages = ({ token }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeReply, setActiveReply] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchMessages = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/contact/list', {}, { headers: { token } });
            if (response.data.success) {
                setMessages(response.data.messages);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const submitReply = async (id) => {
        if (!replyText.trim()) return toast.warning("Please enter a reply");
        setIsSubmitting(true);
        try {
            const response = await axios.post(backendUrl + '/api/contact/reply', { id, reply: replyText, status: 'replied' }, { headers: { token } });
            if (response.data.success) {
                toast.success("Reply sent successfully");
                setActiveReply(null);
                setReplyText('');
                fetchMessages();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            const response = await axios.post(backendUrl + '/api/contact/remove', { id }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchMessages();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [token]);

    return (
        <div className='p-8 bg-[#f8f9fa] min-h-screen'>
            <div className='max-w-7xl mx-auto'>

                <div className='mb-12'>
                    <h1 className='text-4xl font-black text-gray-900 tracking-tight mb-2'>Customer Inquiries</h1>
                    <p className='text-gray-500 font-medium'>Read and respond to community messages from the storefront.</p>
                </div>

                {loading ? (
                    <div className='py-20 flex justify-center'>
                        <div className='w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin'></div>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 gap-8'>
                        {messages.length === 0 ? (
                            <div className='bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center'>
                                <p className='text-xl text-gray-300 font-black uppercase tracking-widest'>No messages yet</p>
                            </div>
                        ) : messages.map((msg) => (
                            <div key={msg._id} className='bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-sm hover:shadow-xl transition-all duration-300'>
                                <div className='grid grid-cols-1 lg:grid-cols-12 gap-10'>

                                    <div className='lg:col-span-3'>
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${msg.status === 'replied' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {msg.status}
                                        </span>
                                        <h3 className='text-xl font-black text-gray-900 leading-tight mb-1'>{msg.name}</h3>
                                        <p className='text-sm text-gray-400 font-bold mb-4'>{msg.email}</p>
                                        <p className='text-[10px] font-black text-gray-300 uppercase tracking-widest'>
                                            {new Date(msg.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>

                                    <div className='lg:col-span-6 border-l border-gray-100 pl-10'>
                                        <div className='mb-6'>
                                            <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2'>Subject</p>
                                            <p className='text-lg font-black text-gray-900'>{msg.subject}</p>
                                        </div>
                                        <div>
                                            <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2'>Message</p>
                                            <p className='text-gray-600 font-medium leading-relaxed bg-gray-50 p-6 rounded-2xl'>{msg.message}</p>
                                        </div>

                                        {msg.reply && (
                                            <div className='mt-8 pt-8 border-t border-gray-50'>
                                                <p className='text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2'>Admin Reply</p>
                                                <p className='text-gray-900 font-bold italic bg-amber-50 p-6 rounded-2xl'>"{msg.reply}"</p>
                                            </div>
                                        )}

                                        {activeReply === msg._id && (
                                            <div className='mt-8 pt-8 border-t border-gray-50 animate-in fade-in slide-in-from-top-4'>
                                                <textarea
                                                    rows="4"
                                                    placeholder="Type your response here..."
                                                    className='w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl outline-none focus:border-black focus:bg-white transition-all font-bold'
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                ></textarea>
                                                <div className='flex gap-3 mt-4'>
                                                    <button
                                                        onClick={() => submitReply(msg._id)}
                                                        disabled={isSubmitting}
                                                        className={`flex-1 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                <span>Sending...</span>
                                                            </>
                                                        ) : (
                                                            'Send Response'
                                                        )}
                                                    </button>
                                                    <button onClick={() => setActiveReply(null)} className='px-8 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs'>Cancel</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className='lg:col-span-3 flex flex-col justify-start items-end'>
                                        {msg.status !== 'replied' && activeReply !== msg._id && (
                                            <button
                                                onClick={() => setActiveReply(msg._id)}
                                                className='px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all'
                                            >
                                                Reply Now
                                            </button>
                                        )}
                                        {msg.status === 'replied' && (
                                            <div className='flex flex-col items-end gap-4'>
                                                <div className='flex items-center gap-2'>
                                                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                                    <span className='text-[10px] font-black text-green-500 uppercase tracking-widest'>Responded</span>
                                                </div>
                                                <button
                                                    onClick={() => deleteMessage(msg._id)}
                                                    className='px-6 py-2 border-2 border-red-50 text-red-400 hover:bg-red-50 hover:border-red-100 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all'
                                                >
                                                    Delete Message
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ContactMessages;
