import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Home,
    Download,
    FileText,
    Code,
    GitBranch,
    Wrench,
    BookOpen,
    Settings,
    Palette,
    Globe,
    Zap,
    Box,
    FileCode,
    Book,
    ChevronLeft,
    ChevronRight,
    GithubIcon,
    Command
} from 'lucide-react';
import { marked } from 'marked';
import Prism from 'prismjs';

// Importar linguagens Prism
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';

// Docs (Mantendo suas importações originais)
import gettingStartAuthMd from '../docs/auth/getting-started.md';
import installationAuthMd from '../docs/auth/installation.md';
import providersAuthMd from '../docs/auth/providers.md';
import sessionsAuthMd from '../docs/auth/session.md';
import customProvidersAuthMd from '../docs/auth/custom-providers.md';

import introductionMd from '../docs/gettingstarted/getting-started.md';
import installationMd from '../docs/gettingstarted/installation.md';
import projectStructureMd from '../docs/gettingstarted/project-structure.md';
import routingMd from '../docs/gettingstarted/routing.md';
import layoutMd from '../docs/gettingstarted/layout.md';
import rpcMd from '../docs/gettingstarted/rpc.md';
import middlewaresMd from '../docs/gettingstarted/middleware.md';
const sidebarConfig = {
    sections: [
        {
            id: 'nyte',
            title: "Nyte.js",
            items: [
                { id: "introduction", icon: "Home", label: "Introduction", file: introductionMd },
                { id: "installation", icon: "Download", label: "Installation", file: installationMd },
                { id: "project-structure", icon: "Box", label: "Project Structure", file: projectStructureMd },
                { id: "layout", icon: "Palette", label: "Layout System", file: layoutMd },
                { id: "routing", icon: "GitBranch", label: "Routing", file: routingMd },
                { id: "rpc", icon: "Globe", label: "RPC System", file: rpcMd },
                { id: "middlewares", icon: "Wrench", label: "Middlewares", file: middlewaresMd },

            ]
        },
        {
            id: 'nyte-auth',
            title: "Nyte Auth",
            items: [
                { id: 'introduction-auth', icon: 'Shield', label: 'Security Overview', file: gettingStartAuthMd },
                { id: 'installation-auth', icon: 'Download', label: 'Setup Auth', file: installationAuthMd },
                { id: "providers", icon: "Zap", label: "Providers", file: providersAuthMd },
                { id: "sessions", icon: "FileCode", label: "Sessions", file: sessionsAuthMd},
                { id: 'custom-providers', icon: 'Code', label: 'Custom Logic', file: customProvidersAuthMd },
            ]
        }
    ]
};

const iconMap: { [key: string]: any } = {
    Home, Download, FileText, Code, GitBranch, Wrench, BookOpen, Settings, Palette, Globe, Zap, Box, FileCode, Book
};

const generateId = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const renderer = new marked.Renderer();
renderer.heading = ({ text, depth }: any) => {
    const id = generateId(text);
    return `<h${depth} id="${id}" class="group flex items-center gap-2">
                ${text}
                <a href="#${id}" class="opacity-0 group-hover:opacity-100 text-cyan-500 transition-opacity">#</a>
            </h${depth}>`;
};

renderer.code = ({ text, lang }: any) => {
    const validLanguage = lang && Prism.languages[lang] ? lang : 'plaintext';
    const highlighted = Prism.highlight(text, Prism.languages[validLanguage], validLanguage);
    return `
        <div class="code-block my-8 group relative">
            <div class="code-header flex justify-between items-center px-4 py-2 bg-white/5 rounded-t-xl border-b border-white/5">
                <span class="text-[10px] uppercase tracking-widest text-cyan-500/70 font-bold">${lang || 'code'}</span>
                <button class="copy-button p-1 hover:text-cyan-400 transition-colors" onclick="navigator.clipboard.writeText(this.getAttribute('data-code'))" data-code="${text.replace(/"/g, '&quot;')}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
            </div>
            <pre class="language-${validLanguage} !bg-transparent !m-0 !p-6 overflow-x-auto"><code class="language-${validLanguage}">${highlighted}</code></pre>
        </div>
    `;
};

marked.setOptions({ renderer });

export default function NyteDocs({ params }: any) {
    const pageId = params?.value2 || 'introduction';
    const [activeSection, setActiveSection] = useState(pageId);
    const [htmlContent, setHtmlContent] = useState('');
    const [headings, setHeadings] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Flatten all pages once
    const allPages = useMemo(() => sidebarConfig.sections.flatMap(section => section.items), []);

    // Global search results (title + content)
    const searchResults = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return [] as Array<{ id: string; label: string; sectionId: string; snippet?: string }>;

        const makeSnippet = (text: string) => {
            const normalized = text.replace(/\s+/g, ' ');
            const idx = normalized.toLowerCase().indexOf(q);
            if (idx === -1) return undefined;
            const start = Math.max(0, idx - 60);
            const end = Math.min(normalized.length, idx + q.length + 60);
            const prefix = start > 0 ? '…' : '';
            const suffix = end < normalized.length ? '…' : '';
            return `${prefix}${normalized.slice(start, end)}${suffix}`;
        };

        const takeTop = (arr: any[], max: number) => arr.slice(0, max);

        const results = allPages
            .map((page) => {
                const section = sidebarConfig.sections.find(s => s.items.some(i => i.id === page.id));
                const sectionId = section?.id ?? 'nyte';

                const labelHit = page.label?.toLowerCase().includes(q);
                const fileText = typeof page.file === 'string' ? page.file : '';
                const contentHit = fileText.toLowerCase().includes(q);

                if (!labelHit && !contentHit) return null;

                // Score label matches higher than content matches
                const score = (labelHit ? 2 : 0) + (contentHit ? 1 : 0);

                return {
                    id: page.id,
                    label: page.label,
                    sectionId,
                    score,
                    snippet: contentHit ? makeSnippet(fileText) : undefined
                };
            })
            .filter(Boolean)
            .sort((a: any, b: any) => b.score - a.score);

        return takeTop(results as any, 8);
    }, [allPages, searchQuery]);

    // Função para obter página anterior e próxima
    const getAllPages = () => {
        return sidebarConfig.sections.flatMap(section => section.items);
    };
    const getNavigationPages = (currentId: string) => {
        const allPages = getAllPages();
        const currentIndex = allPages.findIndex(page => page.id === currentId);

        return {
            previous: currentIndex > 0 ? allPages[currentIndex - 1] : null,
            next: currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null
        };
    };

    useEffect(() => {
        const currentItem = sidebarConfig.sections.flatMap(s => s.items).find(i => i.id === activeSection);
        if (currentItem?.file) {
            setHtmlContent(marked.parse(currentItem.file) as string);
            const headingRegex = /^(#{1,3})\s+(.+)$/gm;
            const matches = [...currentItem.file.matchAll(headingRegex)];
            setHeadings(matches.map(m => ({ id: generateId(m[2]), text: m[2], level: m[1].length })));
            setTimeout(() => Prism.highlightAll(), 0);
        }
    }, [activeSection]);

    const navigateToPage = (itemId: string) => {
        // Find which section this item belongs to
        const section = sidebarConfig.sections.find(s =>
            s.items.some(item => item.id === itemId)
        );

        if (section) {
            const newUrl = `/${section.id}/${itemId}`;
            window.history.pushState({}, '', newUrl);
            setActiveSection(itemId);
        }
        setSearchQuery('');
    };

    return (
        <div className="h-screen overflow-hidden bg-[#030712] text-slate-300 selection:bg-cyan-500/30">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full" />
            </div>

            <div className="flex relative z-10 h-full min-w-0">
                {/* Sidebar Glass */}
                <aside
                    className="w-80 min-w-80 max-w-80 h-screen sticky top-0 hidden lg:flex flex-col bg-white/[0.02] backdrop-blur-xl border-r border-white/[0.05] flex-none overflow-hidden"
                    style={{ flex: '0 0 20rem' }}
                >
                    <div className="p-8 flex items-center gap-4">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-cyan-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                            <img src="https://i.imgur.com/zUTrtM5.png" alt="Nyte" className="w-10 h-10 relative z-10 rounded-lg object-contain" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tighter">Nyte<span className="text-cyan-400">.js</span></span>
                    </div>

                    <nav className="flex-1 px-4 py-2 overflow-y-auto custom-scrollbar">
                        {sidebarConfig.sections.map((section, idx) => (
                            <div key={idx} className="mb-8">
                                <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
                                    {section.title}
                                </h3>
                                <div className="space-y-1">
                                    {section.items.map((item) => {
                                        const Icon = iconMap[item.icon] || FileText;
                                        const isActive = activeSection === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => navigateToPage(item.id)}
                                                className={`w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                                                    isActive
                                                        ? 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20 shadow-[0_0_20px_-5px_rgba(34,211,238,0.2)]'
                                                        : 'hover:bg-white/[0.03] text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                <Icon size={18} className={isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400 transition-colors'} />
                                                <span className="text-sm font-medium tracking-wide truncate">{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area (the ONLY scroll container lives inside) */}
                <main className="flex-1 h-full min-w-0 overflow-hidden">
                    <div className="flex flex-col h-full min-w-0">
                        {/* Floating Header */}
                        <header className="h-20 flex-none sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-md px-8 flex items-center justify-between border-b border-white/[0.05]">
                            <div className="max-w-2xl w-full relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search documentation..."
                                    className="w-full bg-white/[0.03] border-none ring-1 ring-white/10 rounded-full pl-12 pr-12 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500/40 transition-all outline-none shadow-inner"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />

                                {/* Search Results Dropdown */}
                                {searchQuery.trim().length > 0 && (
                                    <div className="absolute left-0 right-0 mt-3 rounded-2xl overflow-hidden border border-white/10 bg-[#0b1220]/95 backdrop-blur-xl shadow-2xl">
                                        {searchResults.length === 0 ? (
                                            <div className="p-4 text-sm text-slate-400">
                                                No results for <span className="text-white font-semibold">"{searchQuery.trim()}"</span>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-white/5">
                                                {searchResults.map((r) => (
                                                    <button
                                                        key={`${r.sectionId}:${r.id}`}
                                                        className="w-full text-left p-4 hover:bg-white/[0.03] transition-colors"
                                                        onClick={() => navigateToPage(r.id)}
                                                    >
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="text-sm font-semibold text-white truncate">{r.label}</div>
                                                            <div className="text-[10px] uppercase tracking-widest text-slate-500 flex-none">{r.sectionId}</div>
                                                        </div>
                                                        {r.snippet ? (
                                                            <div className="mt-2 text-xs text-slate-400 line-clamp-2">{r.snippet}</div>
                                                        ) : null}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-500"><Command size={10} /></kbd>
                                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-500">K</kbd>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-slate-400">
                                <a href="https://github.com/murillo-frazao-cunha/nyte" className="hover:text-cyan-400 transition-colors"><GithubIcon size={20} /></a>
                                <div className="h-4 w-px bg-white/10" />
                            </div>
                        </header>

                        {/* Scrollable Content (vertical + horizontal if needed) */}
                        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar">
                            <div className="max-w-[1000px] mx-auto px-8 py-16 min-w-0">
                                <article className="markdown-content prose prose-invert prose-cyan max-w-none custom-scrollbar">
                                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                                </article>

                                {/* Navigation Footer */}
                                <footer className="mt-24 pt-12 border-t border-white/[0.05] grid grid-cols-2 gap-8">
                                    {/* Previous */}
                                    {getNavigationPages(activeSection).previous ? (
                                        <button onClick={() => navigateToPage(getNavigationPages(activeSection).previous!.id)} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-cyan-500/30 transition-all text-left group">
                                            <span className="text-xs text-slate-500 flex items-center gap-2 mb-2"><ChevronLeft size={14} /> Previous</span>
                                            <div className="text-white font-bold group-hover:text-cyan-400 transition-colors">{getNavigationPages(activeSection).previous!.label}</div>
                                        </button>
                                    ) : (
                                        <div className="flex-1 max-w-xs"></div>
                                    )}

                                    {/* Next */}
                                    {getNavigationPages(activeSection).next ? (
                                        <button onClick={() => navigateToPage(getNavigationPages(activeSection).next!.id)} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-cyan-500/30 transition-all text-right group">
                                            <span className="text-xs text-slate-500 flex items-center justify-end gap-2 mb-2">Next <ChevronRight size={14} /></span>
                                            <div className="text-white font-bold group-hover:text-cyan-400 transition-colors">{getNavigationPages(activeSection).next!.label}</div>
                                        </button>
                                    ) : (
                                        <div className="flex-1 max-w-xs"></div>
                                    )}
                                </footer>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right TOC Glass */}
                <aside className="w-72 min-w-72 max-w-72 h-screen sticky top-0 hidden xl:block bg-transparent flex-none overflow-hidden custom-scrollbar">
                    <div className="h-full p-10 overflow-y-auto custom-scrollbar">
                        <div className="space-y-8 custom-scrollbar">
                            <div>
                                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6 border-l-2 border-cyan-500 pl-4">On this page</h4>
                                <div className="space-y-4">
                                    {headings.map((h, i) => (
                                        <a
                                            key={i}
                                            href={`#${h.id}`}
                                            className={`block text-sm transition-colors hover:text-cyan-400 ${h.level > 1 ? 'ml-4 text-slate-500' : 'text-slate-400 font-medium'}`}
                                        >
                                            {h.text}
                                        </a>
                                    ))}
                                </div>
                            </div>


                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

