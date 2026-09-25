'use client';

import React from 'react';
import { 
  Zap, 
  Binary, 
  Cpu, 
  Gamepad2, 
  Lock, 
  Table, 
  Paintbrush, 
  Code2, 
  Volume2, 
  VolumeX, 
  Terminal
} from 'lucide-react';
import { sounds } from '@/lib/audio/soundEffects';

export default function Navbar({ activeTab, setActiveTab, muted, setMuted }) {
  const navItems = [
    { id: 'pipeline', label: 'Pipeline', icon: Zap },
    { id: 'bit-anim', label: 'Bit Animation', icon: Cpu },
    { id: 'challenge', label: 'Challenge Game', icon: Gamepad2 },
    { id: 'secret', label: 'Secret Message', icon: Lock },
    { id: 'explorer', label: 'ASCII Explorer', icon: Table },
    { id: 'art', label: 'ASCII Art', icon: Paintbrush },
    { id: 'algorithm', label: 'DSA Algorithm', icon: Code2 },
  ];

  const handleMuteToggle = () => {
    const isMuted = sounds.toggleMute();
    setMuted(isMuted);
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('pipeline')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-lg text-zinc-100 tracking-wider">
                  ASCII<span className="text-emerald-400">LAB</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono hidden sm:block">
                Encode • Decode • Visualize
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-zinc-900/90 p-1.5 rounded-xl border border-zinc-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : 'text-emerald-400/80'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Audio Sound FX Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMuteToggle}
              title={muted ? 'Unmute Cyber SFX' : 'Mute Cyber SFX'}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
            >
              {muted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 space-x-2 bg-zinc-900/90 border-t border-zinc-800/60 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(item.id);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 bg-zinc-800/50 border border-zinc-700/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
