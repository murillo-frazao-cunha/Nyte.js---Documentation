import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Zap,
    Shield,
    Globe,
    Box,
    Wrench,
    Github,
    Search,
    X,
    Cpu,
    Layout,
    ArrowRight,
    Terminal, Palette, Wifi
} from 'lucide-react';
import { Link } from "nyte/react"
import { sidebarConfig } from './docs';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParallax } from '../hooks/useParallax';
import SearchModal from './SearchModal';
import type { SearchDoc } from '../lib/searchIndex';

const NyteLanding = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const reducedMotion = usePrefersReducedMotion();

    // Precompute particles for stable positions
    const particles = useMemo(
        () =>
            Array.from({ length: 60 }).map((_, i) => ({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                duration: 3 + Math.random() * 5,
                delay: i * 0.07,
                size: Math.random() < 0.12 ? 2 : 1,
                opacity: 0.15 + Math.random() * 0.45,
            })),
        []
    );

    useEffect(() => {
        const handleKeyDown = (e: { metaKey: any; ctrlKey: any; key: string; preventDefault: () => void; }) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const docsForSearch: SearchDoc[] = useMemo(() => {
        return sidebarConfig.sections.flatMap((section) =>
            section.items.map((item) => ({
                id: item.id,
                label: item.label,
                category: section.title,
                href: `/docs/${section.id}/${item.id}`,
                content: typeof (item as any).file === 'string' ? (item as any).file : '',
            }))
        );
    }, []);

    const GridBackground = () => {
        const orbARef = useRef<HTMLDivElement | null>(null);
        const orbBRef = useRef<HTMLDivElement | null>(null);

        useParallax(orbARef, !reducedMotion, { intensity: 42, axis: 'y', invert: true });
        useParallax(orbBRef, !reducedMotion, { intensity: 34, axis: 'y', invert: false });

        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                    linear-gradient(to right, rgba(56, 189, 248, 0.03) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(56, 189, 248, 0.03) 1px, transparent 1px)
                `,
                    backgroundSize: '80px 80px',
                    maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
                }} />

                <div ref={orbARef} className="absolute top-1/4 left-1/4 w-[680px] h-[680px] bg-gradient-to-r from-cyan-500/7 via-blue-500/5 to-transparent blur-[140px] rounded-full animate-pulse" />
                <div ref={orbBRef} className="absolute bottom-1/4 right-1/4 w-[560px] h-[560px] bg-gradient-to-l from-purple-500/7 via-pink-500/5 to-transparent blur-[130px] rounded-full animate-pulse delay-1000" />

                <div className="absolute inset-0">
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className="absolute bg-cyan-400 rounded-full nyte-particle"
                            style={{
                                left: `${p.left}%`,
                                top: `${p.top}%`,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                opacity: p.opacity,
                                animationDuration: `${p.duration}s`,
                                animationDelay: `${p.delay}s`,
                                filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.25))'
                            }}
                        />
                    ))}
                </div>

                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
            </div>
        );
    };

    const heroBadge = useScrollReveal({ threshold: 0.3, once: false });
    const heroTitle = useScrollReveal({ threshold: 0.25, once: false });
    const heroSubtitle = useScrollReveal({ threshold: 0.2, once: false });
    const heroButtons = useScrollReveal({ threshold: 0.2, once: false });
    const heroCmd = useScrollReveal({ threshold: 0.2, once: false });
    const featHeader = useScrollReveal({ threshold: 0.2, once: false });
    const featGrid = useScrollReveal({ threshold: 0.15, rootMargin: '0px 0px -5% 0px', once: false });
    const archHeader = useScrollReveal({ threshold: 0.2, once: false });
    const archGrid = useScrollReveal({ threshold: 0.15, rootMargin: '0px 0px -5% 0px', once: false });
    const footerReveal = useScrollReveal({ threshold: 0.2, rootMargin: '0px 0px 0px 0px', once: false });

    return (
        /* CORREÇÃO IMPORTANTE 1: Mudei overflow-hidden para overflow-x-hidden.
           Se deixar overflow-hidden aqui, o scroll vertical "morre" e o sticky para de funcionar. */
        <div className="min-h-screen bg-[#030712] text-slate-300 selection:bg-cyan-500/30 font-sans selection:text-white relative custom-scrollbar">
            <GridBackground/>

            <SearchModal
                open={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                docs={docsForSearch}
                placeholder="Search documentation..."
            />

            {/* CORREÇÃO IMPORTANTE 2: Sticky precisa de top-0 e z-index alto.
                Agora que o pai não tem overflow-hidden vertical, ele vai grudar. */}
            <nav className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#030712]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#030712]/75">
                <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
                    <div className="flex items-center gap-6">
                        <div className="relative group cursor-pointer">
                            <div className="absolute inset-0  opacity-20 group-hover:opacity-40 transition-opacity" />
                            <img src="https://i.imgur.com/zUTrtM5.png" alt="Nyte" className="relative w-8 h-8 rounded-lg shadow-2xl" />
                        </div>

                        <Link href="/docs" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Docs
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden md:flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-md px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:border-white/20 transition-all w-64 group"
                        >
                            <span className="flex-1 text-left">Search documentation...</span>
                            <div className="flex gap-1">
                                <kbd className="bg-black/20 border border-white/10 px-1.5 rounded text-[10px] font-mono group-hover:border-white/20 transition-colors">Ctrl</kbd>
                                <kbd className="bg-black/20 border border-white/10 px-1.5 rounded text-[10px] font-mono group-hover:border-white/20 transition-colors">K</kbd>
                            </div>
                        </button>

                        <a
                            href="https://github.com/murillo-frazao-cunha/nyte"
                            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Github size={20} />
                        </a>
                    </div>
                </div>
            </nav>

            {/* CORREÇÃO 3: Removi o mt-16 que tinha colocado antes, pois sticky ocupa espaço real no layout */}
            <section className="relative z-10 pt-10 pb-20 px-6 text-center mt-10 overflow-hidden">
                <h1
                    ref={heroTitle.ref as any}
                    {...heroTitle.props}
                    className="nyte-reveal nyte-reveal-up nyte-stagger text-2xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-snug md:leading-[1.1]"
                    style={{ ['--d' as any]: '90ms' }}
                >
                    The next-generation framework for the web
                </h1>


                <p
                    ref={heroSubtitle.ref as any}
                    {...heroSubtitle.props}
                    className="nyte-reveal nyte-reveal-up nyte-stagger max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed"
                    style={{ ['--d' as any]: '160ms' }}
                >
                    Built for developers who value speed and type-safety, Nyte.js lets you create
                    <span className="text-white font-semibold"> high-quality web applications</span> with seamless backend integration and built-in authentication.
                </p>

                <div ref={heroButtons.ref as any} {...heroButtons.props} className="nyte-reveal nyte-reveal-up nyte-stagger flex flex-col md:flex-row items-center justify-center gap-4 mb-8" style={{ ['--d' as any]: '230ms' }}>
                    <Link href="/docs/nyte/installation" className="nyte-tilt nyte-sheen w-full md:w-auto px-8 py-3.5 bg-white text-black rounded-lg font-bold hover:bg-slate-200 transition-all hover:-translate-y-1 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                        Get Started
                    </Link>
                    <Link href="/docs" className="nyte-tilt nyte-sheen w-full md:w-auto px-8 py-3.5 bg-white/[0.03] text-white border border-white/10 rounded-lg font-bold hover:bg-white/5 transition-all hover:-translate-y-1 backdrop-blur-sm">
                        Read the Docs
                    </Link>
                </div>

                <div className="w-fit mx-auto p-1 rounded-xl bg-gradient-to-b from-white/10 to-white/5 hover:to-blue-500/20 transition-all duration-500 nyte-tilt nyte-sheen">
                    <div ref={heroCmd.ref as any} {...heroCmd.props} className="nyte-reveal nyte-reveal-fade nyte-stagger relative max-w-md" style={{ ['--d' as any]: '230ms' }}>
                        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
                        <div className="relative flex items-center justify-between gap-3 px-5 py-3 bg-[#0b1221] border border-white/10 rounded-xl text-sm font-mono shadow-2xl nyte-sheen">
                            <span className="text-slate-500">$</span>
                            <span className="text-slate-300 flex-1 text-left ml-2">npx @nytejs/create-app@latest</span>
                            <button className="text-slate-500 hover:text-white transition-colors" title="Copy">
                                <Box size={14} />
                            </button>
                        </div>
                    </div>
                </div>

            </section>

            <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
                <div ref={featHeader.ref as any} {...featHeader.props} className="nyte-reveal nyte-reveal-up mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4 text-center">What's in Nyte.js?</h2>
                    <p className="text-slate-400 text-center max-w-2xl mx-auto">Everything you need to build great products on the web, packed into a cohesive framework.</p>
                </div>

                <div ref={featGrid.ref as any} {...featGrid.props} className="nyte-reveal nyte-reveal-up grid grid-cols-1 md:grid-cols-3 gap-5">

                    <div className="md:col-span-2 group relative p-1 rounded-xl bg-gradient-to-b from-white/10 to-white/5 hover:to-blue-500/20 transition-all duration-500 nyte-tilt nyte-sheen">
                        <div className="relative h-full bg-[#080c14] rounded-[10px] p-8 overflow-hidden border border-white/5 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                        <Globe size={28} />
                                    </div>
                                    <div className="text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest border border-cyan-500/20 px-2 py-1 rounded bg-cyan-950/30">Core</div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Native RPC System</h3>
                                <p className="text-slate-400 relative z-10 max-w-md mb-8">Direct server-to-client communication. Expose your backend logic specifically to your frontend with zero boilerplate.</p>
                            </div>


                            <div className="relative z-10 bg-[#030712] rounded-lg border border-white/10 p-4 font-mono text-xs text-slate-300 shadow-2xl group-hover:border-cyan-500/30 transition-colors">
                                <div className="flex justify-between text-slate-500 mb-3 pb-2 border-b border-white/5">
                                    <span>server/actions.ts</span>
                                    <span className="text-cyan-400">Server Side</span>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex gap-2"><span className="text-purple-400">import</span> {'{'} Expose {'}'} <span className="text-purple-400">from</span> <span className="text-green-400">"nyte/rpc"</span></div>
                                    <div className="h-2"></div>
                                    <div className="flex gap-2"><span className="text-purple-400">export function</span> <span className="text-blue-400">getUser</span>(id) {'{'}</div>
                                    <div className="pl-4 text-slate-400"><span className="text-purple-400">return</span> db.users.find(id)</div>
                                    <div className="flex gap-2">{'}'}</div>
                                    <div className="h-1"></div>
                                    <div className="flex "><span className="text-yellow-400">Expose</span>(getUser)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative p-1 rounded-xl bg-gradient-to-b from-white/10 to-white/5 hover:to-blue-500/20 transition-all duration-500 nyte-tilt nyte-sheen">
                        <div className="relative h-full bg-[#080c14] rounded-[10px] p-8 overflow-hidden border border-white/5 transition-all duration-500 flex flex-col">
                            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 w-fit mb-6 border border-blue-500/20">
                                <Shield size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Nyte Auth</h3>
                            <p className="text-slate-400 mb-6">Secure session management built-in. Protect your routes and data effortlessly.</p>

                            <div className="mt-auto relative z-10 bg-[#030712] rounded-lg border border-white/10 p-4 font-mono text-xs text-slate-300 shadow-xl group-hover:border-blue-500/30 transition-colors">
                                <div className="flex justify-between text-slate-500 mb-2">
                                    <span>profile.tsx</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        <span className="text-purple-400">import</span>
                                        {'{'} <span className="text-yellow-300">useSession</span> {'}'}
                                        <span className="text-purple-400">from</span>
                                        <span className="text-green-400">"@nytejs/auth"</span>
                                    </div>
                                    <div className="flex gap-2"><span className="text-purple-400">const</span> {'{'} user {'}'} = <span className="text-blue-400">useSession</span>()</div>
                                    <div className="text-slate-500 mt-1">// Auto-protected context</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {[
                        {
                            icon: Layout,
                            title: "Pattern Routing",
                            desc: "Flexible route matching with regex support. Not just file-system based.",
                            color: "text-purple-400",
                            bg: "bg-purple-500/10",
                            border: "hover:border-purple-500/30"
                        },
                        {
                            icon: Zap,
                            title: "Powered by Vite",
                            desc: "Lightning fast HMR and heavily optimized production builds.",
                            color: "text-yellow-400",
                            bg: "bg-yellow-500/10",
                            border: "hover:border-yellow-500/30"
                        },
                        {
                            icon: Wifi,
                            title: "Native WebSockets",
                            desc: "Real-time ready. Upgrade any route to a persistent connection.",
                            color: "text-emerald-400",
                            bg: "bg-emerald-500/10",
                            border: "hover:border-emerald-500/30"
                        }
                    ].map((item, idx) => (
                        <div key={idx} className={`group relative p-1 rounded-xl bg-gradient-to-b from-white/10 to-white/5 hover:to-white/10 transition-all duration-500 nyte-tilt nyte-sheen ${item.border}`} style={{ transitionDelay: `${idx * 50}ms` }}>
                            <div className="relative h-full bg-[#080c14] rounded-[10px] p-6 overflow-hidden border border-white/5">
                                <div className={`p-2.5 rounded-lg ${item.bg} ${item.color} w-fit mb-4`}>
                                    <item.icon size={24} />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
                <div ref={archHeader.ref as any} {...archHeader.props} className="nyte-reveal nyte-reveal-up flex flex-col items-center mb-16">
                    <h2 className="text-3xl font-bold text-white text-center">Built on a foundation of giants</h2>
                    <p className="text-slate-400 mt-4 text-center">We stand on the shoulders of the best tools in the ecosystem.</p>
                </div>

                <div ref={archGrid.ref as any} {...archGrid.props} className="nyte-reveal nyte-reveal-up grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group relative p-1 rounded-xl bg-gradient-to-b from-white/10 to-white/5 hover:to-yellow-500/20 transition-all duration-500 nyte-tilt nyte-sheen" >
                        <div className="relative h-full bg-[#080c14] rounded-[10px] p-8 overflow-hidden border border-white/5">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400">
                                        <Zap size={24} />
                                    </div>
                                    <span className="text-xs font-mono text-slate-500">v7.3.1</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Powered by Vite</h3>
                                <p className="text-sm text-slate-400 mb-6">Lightning fast HMR and optimized builds using Rollup. The best DX in class.</p>

                                <div className="bg-black/40 rounded-lg p-3 border border-white/5 font-mono text-xs text-slate-300">
                                    <div className="flex justify-between text-slate-500 mb-2">
                                        <span>builder.ts</span>
                                        <span className="text-yellow-400">Node API</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex gap-2"><span className="text-purple-400">import</span> {'{'} build {'}'} <span className="text-purple-400">from</span> <span className="text-green-400">'vite'</span></div>
                                        <div className="flex gap-2"><span className="text-purple-400">await</span> build({'{'}</div>
                                        <div className="pl-4 text-slate-400">root: <span className="text-green-400">'./src'</span>,</div>
                                        <div className="flex gap-2">{'}'})</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative p-1 rounded-xl bg-gradient-to-b from-white/10 to-white/5 hover:to-cyan-500/20 transition-all duration-500 nyte-tilt nyte-sheen" >
                        <div className="relative h-full bg-[#080c14] rounded-[10px] p-8 overflow-hidden border border-white/5">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
                                        <Box size={24} />
                                    </div>
                                    <span className="text-xs font-mono text-slate-500">React 19</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">React Client Components</h3>
                                <p className="text-sm text-slate-400 mb-6">Built for the future of React. Instant interactions, client-side rendering, and seamless Suspense.</p>

                                <div className="bg-black/40 rounded-lg p-3 border border-white/5 font-mono text-xs text-slate-300">
                                    <div className="flex justify-between text-slate-500 mb-2">
                                        <span>counter.tsx</span>
                                        <span className="text-cyan-400">Client</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex gap-2"><span className="text-blue-400">function</span> Counter() {'{'}</div>
                                        <div className="pl-4 flex gap-2"><span className="text-purple-400">const</span> [v, set] = useState(0)</div>
                                        <div className="flex gap-2">{'}'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative p-1 rounded-xl bg-gradient-to-b from-white/10 to-white/5 hover:to-pink-500/20 transition-all duration-500 nyte-tilt nyte-sheen" >
                        <div className="relative h-full bg-[#080c14] rounded-[10px] p-8 overflow-hidden border border-white/5">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-pink-500/10 rounded-lg text-pink-400">
                                        <Palette size={24} />
                                    </div>
                                    <span className="text-xs font-mono text-slate-500">v4.0</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Tailwind CSS</h3>
                                <p className="text-sm text-slate-400 mb-6">Utility-first framework for rapid UI development. Modern design system built-in.</p>

                                <div className="bg-black/40 rounded-lg p-3 border border-white/5 font-mono text-xs text-slate-300">
                                    <div className="flex justify-between text-slate-500 mb-2">
                                        <span>styles.css</span>
                                        <span className="text-pink-400">Zero Runtime</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex gap-2"><span className="text-purple-400">@theme</span> {'{'}</div>
                                        <div className="pl-4 text-slate-400">--color-primary: <span className="text-pink-400">#ec4899</span>;</div>
                                        <div className="flex gap-2">{'}'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="relative z-10 py-12 border-t border-white/5 px-6 bg-[#030712]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-white">Nyte.js</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        © Nyte.js {new Date().getFullYear()}  All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="https://github.com/murillo-frazao-cunha/nyte" className="flex items-center gap-2" target="_blank" rel="noreferrer">
                            <Github className="text-slate-500 hover:text-white cursor-pointer transition-colors" size={20} />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default NyteLanding;