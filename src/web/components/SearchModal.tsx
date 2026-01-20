import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Globe, Search, X } from 'lucide-react';
import type { SearchDoc, SearchHit } from '../lib/searchIndex';
import { searchDocs } from '../lib/searchIndex';
import {Link} from "nyte/react";

export type SearchModalProps = {
    open: boolean;
    onClose: () => void;
    docs: SearchDoc[];
    placeholder?: string;
    /** Optional initial query when opening */
    initialQuery?: string;
};

export default function SearchModal({
    open,
    onClose,
    docs,
    placeholder = 'Search documentation...',
    initialQuery = '',
}: SearchModalProps) {
    const [query, setQuery] = useState(initialQuery);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!open) return;
        setQuery(initialQuery);
        // focus after paint
        setTimeout(() => inputRef.current?.focus(), 0);
    }, [open, initialQuery]);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    const results: SearchHit[] = useMemo(() => {
        if (!query.trim()) return [];
        return searchDocs(docs, query, 10);
    }, [docs, query]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-[#0b1221] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center px-4 py-3 border-b border-white/5">
                    <Search className="w-5 h-5 text-slate-500 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 h-6"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors">
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {results.length > 0 ? (
                        <div className="space-y-1">
                            {results.map((r) => (
                                <Link
                                    key={r.href}
                                    href={r.href}
                                    className="block px-3 py-3 rounded-lg hover:bg-white/5 group cursor-pointer transition-colors"
                                    onClick={onClose}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400 group-hover:text-cyan-300 transition-colors flex-none">
                                                <Globe size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-white font-medium text-sm truncate">{r.label}</div>
                                                {r.category ? <div className="text-xs text-slate-500">{r.category}</div> : null}
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors flex-none" />
                                    </div>
                                    {r.snippet ? (
                                        <div className="mt-2 text-xs text-slate-500 line-clamp-2">
                                            {r.snippet}
                                        </div>
                                    ) : null}
                                </Link>
                            ))}
                        </div>
                    ) : query.trim() ? (
                        <div className="py-8 text-center text-slate-500 text-sm">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <p className="text-slate-500 text-sm mb-2">Type to search docs...</p>
                            <div className="flex justify-center gap-2">
                                <span className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-slate-400">RPC</span>
                                <span className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-slate-400">Auth</span>
                                <span className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-slate-400">Routing</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-4 py-2 border-t border-white/5 bg-white/[0.02] flex justify-between items-center text-xs text-slate-500">
                    <span>Navigation</span>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1">
                            <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">esc</kbd> to close
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
