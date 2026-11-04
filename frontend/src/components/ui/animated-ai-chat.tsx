"use client";

import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Paperclip,
    Send,
    XIcon,
    Loader2,
    Command,
    Bot,
    User,
    TrendingDown,
    Activity,
    Target,
    Receipt,
    FileText,
    Maximize2,
    Minimize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import ReactMarkdown from "react-markdown";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

export function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

export interface CommandSuggestion {
    icon: React.ReactNode;
    label: string;
    description: string;
    prefix: string;
}

export interface ChatMessage {
    id?: string;
    role: "user" | "assistant" | "system" | string;
    content: string;
    createdAt?: Date | string;
}

export interface AnimatedAIChatProps {
    className?: string;
    messages?: ChatMessage[];
    onSendMessage?: (message: string) => void | Promise<void>;
    isStreaming?: boolean;
    streamContent?: string;
    placeholder?: string;
    suggestions?: CommandSuggestion[];
    title?: string;
    subtitle?: string;
    botName?: string;
    onAttachFile?: () => void;
    attachments?: string[];
    onRemoveAttachment?: (index: number) => void;
    disabled?: boolean;
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
    showFullscreenButton?: boolean;
}

export function AnimatedAIChat({
    className,
    messages: externalMessages,
    onSendMessage,
    isStreaming: externalIsStreaming,
    streamContent,
    placeholder = "Message FinSight Intelligence...",
    suggestions,
    title = "How can I help today?",
    subtitle = "I have full context of your recent cash flow, category velocity, goals, and health score.",
    botName = "FinSight",
    onAttachFile,
    attachments: externalAttachments,
    onRemoveAttachment: externalRemoveAttachment,
    disabled = false,
    isFullscreen: externalIsFullscreen,
    onToggleFullscreen,
    showFullscreenButton = true,
}: AnimatedAIChatProps = {}) {
    const isControlled = externalMessages !== undefined;
    const [internalMessages, setInternalMessages] = useState<ChatMessage[]>([]);
    const messages = isControlled ? externalMessages : internalMessages;

    const [value, setValue] = useState("");
    const [internalAttachments, setInternalAttachments] = useState<string[]>([]);
    const attachments = externalAttachments !== undefined ? externalAttachments : internalAttachments;

    const [internalIsTyping, setInternalIsTyping] = useState(false);
    const isTyping = externalIsStreaming !== undefined ? externalIsStreaming : internalIsTyping;

    const [internalFullscreen, setInternalFullscreen] = useState(false);
    const isFullscreen = externalIsFullscreen !== undefined ? externalIsFullscreen : internalFullscreen;

    const toggleFullscreen = () => {
        if (onToggleFullscreen) {
            onToggleFullscreen();
        } else {
            setInternalFullscreen(prev => !prev);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isFullscreen) {
                toggleFullscreen();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isFullscreen]);

    const [, startTransition] = useTransition();
    const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 300, y: 300 });
    const [inputFocused, setInputFocused] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const commandPaletteRef = useRef<HTMLDivElement>(null);
    const chatScrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 40,
        maxHeight: 120,
    });

    const defaultSuggestions: CommandSuggestion[] = [
        { 
            icon: <TrendingDown className="w-4 h-4 text-neutral-400 dark:text-neutral-300" />, 
            label: "Overspending", 
            description: "Where am I overspending?", 
            prefix: "/overspending" 
        },
        { 
            icon: <Activity className="w-4 h-4 text-neutral-400 dark:text-neutral-300" />, 
            label: "Health Score", 
            description: "How healthy are my finances?", 
            prefix: "/health" 
        },
        { 
            icon: <Target className="w-4 h-4 text-neutral-400 dark:text-neutral-300" />, 
            label: "Savings Plan", 
            description: "How can I save ₹10,000 in three months?", 
            prefix: "/savings" 
        },
        { 
            icon: <Receipt className="w-4 h-4 text-neutral-400 dark:text-neutral-300" />, 
            label: "Category Changes", 
            description: "What categories increased this month?", 
            prefix: "/trends" 
        },
    ];

    const commandSuggestions = suggestions || defaultSuggestions;

    // Track mouse coordinates locally relative to the chat container for strictly contained glow
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [messages, streamContent, isTyping]);

    useEffect(() => {
        if (value.startsWith('/') && !value.includes(' ')) {
            setShowCommandPalette(true);
            
            const matchingSuggestionIndex = commandSuggestions.findIndex(
                (cmd) => cmd.prefix.toLowerCase().startsWith(value.toLowerCase())
            );
            
            if (matchingSuggestionIndex >= 0) {
                setActiveSuggestion(matchingSuggestionIndex);
            } else {
                setActiveSuggestion(-1);
            }
        } else {
            setShowCommandPalette(false);
        }
    }, [value, commandSuggestions]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const commandButton = document.querySelector('[data-command-button]');
            
            if (commandPaletteRef.current && 
                !commandPaletteRef.current.contains(target) && 
                !commandButton?.contains(target)) {
                setShowCommandPalette(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (showCommandPalette) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev < commandSuggestions.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev > 0 ? prev - 1 : commandSuggestions.length - 1
                );
            } else if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault();
                if (activeSuggestion >= 0 && commandSuggestions[activeSuggestion]) {
                    const selectedCommand = commandSuggestions[activeSuggestion];
                    setValue(selectedCommand.description || `${selectedCommand.prefix} `);
                    setShowCommandPalette(false);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowCommandPalette(false);
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !disabled && !isTyping) {
                handleSendMessage();
            }
        }
    };

    const handleSendMessage = () => {
        if (!value.trim() || disabled || isTyping) return;
        let msg = value.trim();
        
        // If attachments exist, append context to message
        if (attachments.length > 0) {
            msg = `[Attached Statement / Files: ${attachments.join(", ")}]\n\n${msg}`;
            setInternalAttachments([]);
        }
        
        setValue("");
        adjustHeight(true);

        if (onSendMessage) {
            onSendMessage(msg);
        } else {
            startTransition(() => {
                setInternalMessages(prev => [...prev, { role: "user", content: msg }]);
                setInternalIsTyping(true);
                setTimeout(() => {
                    setInternalIsTyping(false);
                    setInternalMessages(prev => [
                        ...prev,
                        {
                            role: "assistant",
                            content: `Based on your deterministic analytics, here is the breakdown for: **"${msg}"**.\n\nYour cash flow and spending metrics have been analyzed against your historical average.`,
                        },
                    ]);
                }, 1200);
            });
        }
    };

    const handleAttachClick = () => {
        if (onAttachFile) {
            onAttachFile();
        } else {
            // Open native file picker from the device
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFiles: string[] = [];
        Array.from(files).forEach((file) => {
            const sizeKb = Math.round(file.size / 1024);
            const formattedSize = sizeKb > 1024 
                ? `${(sizeKb / 1024).toFixed(1)} MB` 
                : `${Math.max(1, sizeKb)} KB`;
            newFiles.push(`${file.name} (${formattedSize})`);
        });

        setInternalAttachments(prev => [...prev, ...newFiles]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeAttachment = (index: number) => {
        if (externalRemoveAttachment) {
            externalRemoveAttachment(index);
        } else {
            setInternalAttachments(prev => prev.filter((_, i) => i !== index));
        }
    };
    
    const selectCommandSuggestion = (index: number) => {
        const selectedCommand = commandSuggestions[index];
        if (!selectedCommand) return;
        
        setValue(selectedCommand.description || selectedCommand.prefix);
        setShowCommandPalette(false);
        textareaRef.current?.focus();
    };

    return (
        <div 
            ref={containerRef}
            className={cn("flex flex-col h-full w-full justify-between bg-transparent text-[var(--color-text-primary)] overflow-hidden relative", className)}
        >
            {/* Smooth Ambient Illumination (Dark Mode: Silky White Glow; Light Mode: Gentle neutral wash) */}
            <div 
                className="absolute inset-0 w-full h-full pointer-events-none z-0 dark:block hidden"
                style={{
                    background: `
                        radial-gradient(ellipse 75% 55% at 50% 18%, rgba(255, 255, 255, 0.065) 0%, rgba(255, 255, 255, 0.02) 45%, rgba(255, 255, 255, 0.003) 75%, transparent 100%),
                        radial-gradient(circle 600px at 85% 85%, rgba(255, 255, 255, 0.025) 0%, transparent 70%)
                    `,
                }}
            />
            <div 
                className="absolute inset-0 w-full h-full pointer-events-none z-0 dark:hidden block"
                style={{
                    background: `radial-gradient(ellipse 80% 60% at 50% 15%, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.5) 60%, transparent 100%)`,
                }}
            />

            {/* Mouse-Tracking Ambient White Spotlight (Only in dark mode for dynamic focus without interfering in light mode) */}
            {inputFocused && (
                <motion.div 
                    className="absolute w-[36rem] h-[36rem] rounded-full pointer-events-none z-0 dark:block hidden"
                    style={{
                        background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.015) 45%, transparent 70%)",
                    }}
                    animate={{
                        x: mousePosition.x - 288,
                        y: mousePosition.y - 288,
                    }}
                    transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 120,
                        mass: 0.6,
                    }}
                />
            )}

            {/* Hidden native device file input for paperclip upload */}
            <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept=".csv,.xlsx,.xls,.pdf,.txt,.json,.tsv"
                onChange={handleFileChange}
            />

            {/* Top Header / Action Bar */}
            {showFullscreenButton && (
                <div className="shrink-0 px-4 sm:px-6 pt-3 pb-2.5 flex items-center justify-between border-b border-neutral-200/70 dark:border-white/5 relative z-20">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                            {botName} Financial Coach
                        </span>
                        {isTyping && (
                            <span className="text-[11px] text-[var(--color-text-secondary)] font-normal flex items-center gap-1">
                                • <span className="animate-pulse">analyzing ledger...</span>
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        title={isFullscreen ? "Exit Full Screen (Esc)" : "Expand to Full Screen"}
                        aria-label={isFullscreen ? "Exit Full Screen" : "Expand to Full Screen"}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
                    >
                        {isFullscreen ? (
                            <>
                                <Minimize2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline text-xs">Exit Full Screen</span>
                            </>
                        ) : (
                            <>
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline text-xs">Full Screen</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Centered Content Wrapper (Full-Screen width constrained to max-w-4xl, normal 100% width) */}
            <div className={cn("flex-1 flex flex-col justify-between overflow-hidden relative z-10 w-full", isFullscreen && "max-w-4xl mx-auto")}>
                {/* Messages Scroll Area */}
                <div 
                    ref={chatScrollRef}
                className="flex-1 overflow-y-auto px-4 sm:px-6 pt-5 pb-3 space-y-5 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-800 relative z-10"
            >
                {/* Empty State Screen */}
                {messages.length === 0 && !streamContent && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 px-4 my-auto">
                        <div className="h-14 w-14 mb-4 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] dark:border-white/20 flex items-center justify-center shadow-md dark:shadow-xl dark:shadow-white/10 relative">
                            <Bot className="h-7 w-7 text-[var(--color-text-primary)]" />
                            <div className="absolute inset-0 rounded-2xl bg-black/5 dark:bg-white/15 filter blur-sm pointer-events-none animate-pulse" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
                            {title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-md mt-1.5 leading-relaxed">
                            {subtitle}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-xl">
                            {commandSuggestions.map((suggestion, index) => (
                                <button
                                    key={suggestion.prefix}
                                    type="button"
                                    onClick={() => selectCommandSuggestion(index)}
                                    className="p-3 text-left rounded-xl bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] hover:border-[var(--color-border-hover)] text-[var(--color-text-primary)] transition-all cursor-pointer flex items-center gap-3 group shadow-xs dark:bg-neutral-900/60 dark:border-neutral-800 dark:hover:border-white/40 dark:shadow-[0_0_20px_rgba(255,255,255,0.06)]"
                                >
                                    <span className="p-1.5 rounded-lg bg-[var(--color-bg-secondary)] group-hover:bg-[var(--color-text-primary)]/10 text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors shrink-0 dark:bg-neutral-800/80 dark:group-hover:bg-white/15 dark:group-hover:text-white">
                                        {suggestion.icon}
                                    </span>
                                    <div className="overflow-hidden">
                                        <div className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{suggestion.label}</div>
                                        <div className="text-[11px] text-[var(--color-text-secondary)] truncate">{suggestion.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Conversation List */}
                {messages.map((m, idx) => {
                    const isUser = m.role === "user";
                    return (
                        <div
                            key={m.id || `msg-${idx}`}
                            className={cn(
                                "flex gap-3 w-full",
                                isUser ? "justify-end" : "justify-start"
                            )}
                        >
                            {!isUser && (
                                <div className="w-6 h-6 flex items-center justify-center text-[var(--color-text-secondary)] shrink-0 mt-2">
                                    <Bot className="w-4 h-4" />
                                </div>
                            )}

                            {isUser ? (
                                <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[75%]">
                                    <div className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium text-sm px-5 py-3 rounded-2xl rounded-tr-xs shadow-md leading-relaxed whitespace-pre-wrap">
                                        {m.content}
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                        <User className="w-4 h-4" />
                                    </div>
                                </div>
                            ) : (
                                <div className="border border-[var(--color-border-primary)] dark:border-white/15 bg-[var(--color-bg-primary)] dark:bg-neutral-900/60 backdrop-blur-md rounded-2xl p-5 text-sm text-[var(--color-text-primary)] leading-relaxed shadow-sm dark:shadow-lg dark:shadow-black/40 max-w-[85%] sm:max-w-[80%]">
                                    <div className="prose dark:prose-invert prose-sm max-w-none text-[var(--color-text-primary)] prose-strong:text-[var(--color-text-primary)] prose-strong:font-semibold prose-headings:text-[var(--color-text-primary)] prose-p:text-[var(--color-text-primary)]">
                                        <ReactMarkdown>{m.content}</ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Live Assistant Streaming Row */}
                {isTyping && streamContent && (
                    <div className="flex gap-3 w-full justify-start">
                        <div className="w-6 h-6 flex items-center justify-center text-[var(--color-text-secondary)] shrink-0 mt-2">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="border border-[var(--color-border-primary)] dark:border-white/15 bg-[var(--color-bg-primary)] dark:bg-neutral-900/60 backdrop-blur-md rounded-2xl p-5 text-sm text-[var(--color-text-primary)] leading-relaxed shadow-sm dark:shadow-lg max-w-[85%] sm:max-w-[80%]">
                            <div className="prose dark:prose-invert prose-sm max-w-none text-[var(--color-text-primary)] prose-strong:text-[var(--color-text-primary)] prose-strong:font-semibold prose-headings:text-[var(--color-text-primary)] prose-p:text-[var(--color-text-primary)]">
                                <ReactMarkdown>{streamContent}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}

                {/* Thinking Dots (Waiting for first chunk) */}
                {isTyping && !streamContent && (
                    <div className="flex gap-3 w-full justify-start items-center">
                        <div className="w-6 h-6 flex items-center justify-center text-[var(--color-text-secondary)] shrink-0">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="border border-[var(--color-border-primary)] dark:border-white/15 bg-[var(--color-bg-primary)] dark:bg-neutral-900/80 backdrop-blur-md rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-[var(--color-text-secondary)] shadow-sm dark:shadow-lg dark:shadow-white/5">
                            <span>Thinking</span>
                            <TypingDots />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Docked Input Box with Focused Glow */}
            <div className="shrink-0 px-4 sm:px-6 pb-4 sm:pb-5 pt-2 relative z-20">
                {/* Command Palette Dropdown */}
                <AnimatePresence>
                    {showCommandPalette && (
                        <motion.div 
                            ref={commandPaletteRef}
                            className="absolute left-4 right-4 sm:left-6 sm:right-6 bottom-full mb-2 bg-[var(--color-bg-primary)] dark:bg-neutral-900/95 backdrop-blur-xl border border-[var(--color-border-primary)] dark:border-white/15 rounded-xl z-50 shadow-xl dark:shadow-2xl overflow-hidden"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            transition={{ duration: 0.15 }}
                        >
                            <div className="p-1.5">
                                <div className="px-3 py-1.5 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                                    Commands
                                </div>
                                {commandSuggestions.map((suggestion, index) => (
                                    <div
                                        key={suggestion.prefix}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer",
                                            activeSuggestion === index 
                                                ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" 
                                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]/60 hover:text-[var(--color-text-primary)]"
                                        )}
                                        onClick={() => selectCommandSuggestion(index)}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-5 h-5 flex items-center justify-center text-[var(--color-text-secondary)]">
                                                {suggestion.icon}
                                            </div>
                                            <div>
                                                <div className="font-medium text-[var(--color-text-primary)]">{suggestion.label}</div>
                                                <div className="text-[var(--color-text-secondary)] text-[11px]">{suggestion.description}</div>
                                            </div>
                                        </div>
                                        <div className="text-[var(--color-text-secondary)] text-[11px] font-mono">
                                            {suggestion.prefix}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Glowing Input Box Container (Dark: Silky White Glow; Light: Clean High-Contrast Ring) */}
                <div 
                    onClick={() => textareaRef.current?.focus()}
                    className={cn(
                        "relative bg-white dark:bg-neutral-900/90 backdrop-blur-xl border rounded-xl px-3.5 py-1.5 flex items-center gap-3 transition-all duration-300 cursor-text",
                        inputFocused 
                            ? "border-neutral-400 shadow-[0_0_20px_rgba(0,0,0,0.06)] dark:border-white/40 dark:shadow-[0_0_35px_rgba(255,255,255,0.18)]" 
                            : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 shadow-xs"
                    )}
                >
                    {/* Glowing Focus Ring Animation */}
                    <AnimatePresence>
                        {inputFocused && (
                            <motion.span 
                                className="absolute inset-0 rounded-xl pointer-events-none ring-2 ring-neutral-400/25 dark:ring-white/25 shadow-xs dark:shadow-[0_0_25px_rgba(255,255,255,0.15)]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Attachment trigger & slash command trigger */}
                    <div className="flex items-center gap-1 relative z-10" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            onClick={handleAttachClick}
                            className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Upload bank statement or document from device (.csv, .xlsx, .pdf, .json)"
                        >
                            <Paperclip className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            data-command-button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowCommandPalette(prev => !prev);
                            }}
                            className={cn(
                                "p-1.5 text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white rounded-lg transition-colors cursor-pointer",
                                showCommandPalette && "text-neutral-900 bg-neutral-100 dark:text-white dark:bg-neutral-800"
                            )}
                            title="Command palette (/)"
                        >
                            <Command className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            adjustHeight();
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        placeholder={placeholder}
                        disabled={disabled || isTyping}
                        className="flex-1 bg-transparent border-none text-[var(--color-text-primary)] text-sm focus:outline-none placeholder:text-[var(--color-text-secondary)] resize-none py-2 min-h-[38px] max-h-[120px] disabled:opacity-50 relative z-10 cursor-text"
                        style={{ overflowY: "auto" }}
                        rows={1}
                    />

                    {/* Send Button */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSendMessage();
                        }}
                        disabled={isTyping || !value.trim() || disabled}
                        className={cn(
                            "p-2 rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer relative z-10",
                            value.trim() && !isTyping && !disabled
                                ? "bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 dark:shadow-md dark:shadow-white/20"
                                : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500 opacity-60 cursor-not-allowed"
                        )}
                        aria-label="Send message"
                    >
                        {isTyping ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {/* Attachments preview from real device uploads */}
                {attachments.length > 0 && (
                    <div className="flex gap-2 flex-wrap pt-2 px-1">
                        {attachments.map((file, index) => (
                            <div
                                key={`${file}-${index}`}
                                className="flex items-center gap-2 text-xs bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] py-1 px-2.5 rounded-lg text-[var(--color-text-primary)] shadow-xs"
                            >
                                <FileText className="w-3.5 h-3.5 text-[var(--color-text-secondary)] shrink-0" />
                                <span className="font-medium max-w-[200px] truncate">{file}</span>
                                <button 
                                    type="button"
                                    onClick={() => removeAttachment(index)}
                                    className="text-[var(--color-text-secondary)] hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer ml-1"
                                    aria-label="Remove attachment"
                                    title="Remove file"
                                >
                                    <XIcon className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </div>
        </div>
    );
}

export function TypingDots() {
    return (
        <div className="flex items-center ml-1">
            {[1, 2, 3].map((dot) => (
                <span
                    key={dot}
                    className="w-1.5 h-1.5 bg-[var(--color-text-secondary)] rounded-full mx-0.5 animate-pulse"
                    style={{ animationDelay: `${dot * 0.2}s` }}
                />
            ))}
        </div>
    );
}

export default AnimatedAIChat;
