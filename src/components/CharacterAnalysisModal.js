'use client';

import React from 'react';
import { X, Sparkles, Binary, Hash, Cpu, Copy, Check } from 'lucide-react';
import { bitBreakdown } from '@/lib/algorithms/asciiEncoder';
import { getFormattedCharLabel } from '@/lib/algorithms/asciiDecoder';
import { sounds } from '@/lib/audio/soundEffects';

export default function CharacterAnalysisModal({ charData, onClose }) {
  const [copiedField, setCopiedField] = React.useState(null);

  if (!charData) return null;

  const asciiVal = typeof charData === 'number' ? charData : (charData.ascii ?? charData.code ?? 65);
  const char = typeof charData === 'object' ? (charData.char ?? String.fromCharCode(asciiVal)) : String.fromCharCode(asciiVal);

  const breakdown = bitBreakdown(asciiVal);
  const hex = asciiVal.toString(16).toUpperCase().padStart(2, '0');
  const octal = asciiVal.toString(8).padStart(3, '0');
  const binary = asciiVal.toString(2).padStart(8, '0');

  const copyToClipboard = (text, fieldName) => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl shadow-emerald-500/10 overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-zinc-100 tracking-wider">
              CHARACTER ANALYSIS
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body */}
        <div className="p-6 space-y-6">
          {/* Main Hero Card */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-b from-zinc-800/80 to-zinc-900 border border-emerald-500/20 relative group">
            <div className="absolute top-3 right-3 flex items-center space-x-1">
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ASCII #{asciiVal}
              </span>
            </div>

            <div className="w-20 h-20 rounded-2xl bg-zinc-950 border border-emerald-500/40 flex items-center justify-center text-4xl font-bold text-emerald-400 shadow-inner shadow-emerald-500/20 my-2">
              {char === ' ' ? '␣' : char}
            </div>

            <div className="text-sm text-zinc-400 text-center mt-1">
              {getFormattedCharLabel(asciiVal)}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'ASCII Dec', val: asciiVal.toString(), icon: Hash },
              { label: 'Binary', val: binary, icon: Binary },
              { label: 'Hexadecimal', val: `0x${hex}`, icon: Cpu },
              { label: 'Octal', val: octal, icon: Sparkles },
            ].map((item, idx) => (
              <div 
                key={idx}
                onClick={() => copyToClipboard(item.val, item.label)}
                className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/40 cursor-pointer transition-all hover:scale-[1.02] group relative"
              >
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                  <span>{item.label}</span>
                  {copiedField === item.label ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                  )}
                </div>
                <div className="text-sm font-bold text-emerald-400 truncate">
                  {item.val}
                </div>
              </div>
            ))}
          </div>

          {/* Bit Breakdown Algorithm Box */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BIT EVALUATION ALGORITHM</span>
              </span>
              <span className="text-[10px] text-zinc-400">8-BIT POSITIONAL WEIGHTS</span>
            </div>

            {/* Bit Grid */}
            <div className="grid grid-cols-8 gap-1 text-center">
              {breakdown.bitWeights.map((weight, i) => {
                const isActive = breakdown.bits[i] === 1;
                return (
                  <div key={i} className="flex flex-col items-center space-y-1">
                    <span className="text-[10px] text-zinc-400">{weight}</span>
                    <div className="w-full py-1 font-bold text-xs text-zinc-400">
                      ↓
                    </div>
                    <div 
                      className={`w-full py-1.5 rounded-md font-bold text-xs border transition-all ${
                        isActive 
                          ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md shadow-emerald-500/30 font-extrabold'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {breakdown.bits[i]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Math Formula Result */}
            <div className="p-3 rounded-lg bg-zinc-900 border border-emerald-500/20 flex flex-col items-center text-center">
              <div className="text-xs text-zinc-400 mb-1">Decoded Sum Formula:</div>
              <div className="text-sm font-bold text-emerald-400 tracking-wide">
                {breakdown.mathEquation}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
