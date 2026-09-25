'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Play, Pause, RotateCcw, Sparkles, Binary, CheckCircle2 } from 'lucide-react';
import { bitArrayToAscii, bitBreakdown } from '@/lib/algorithms/asciiEncoder';
import { sounds } from '@/lib/audio/soundEffects';

export default function BitAnimationView({ onSelectChar }) {
  // 8 bits: index 0 (128) to index 7 (1)
  const [bits, setBits] = useState([0, 1, 0, 0, 0, 0, 0, 1]); // Default 65 ('A')
  const [animatingBitIndex, setAnimatingBitIndex] = useState(-1);
  const [isAutoAnimating, setIsAutoAnimating] = useState(false);

  const asciiVal = bitArrayToAscii(bits);
  const char = String.fromCharCode(asciiVal);
  const breakdown = bitBreakdown(asciiVal);

  // Toggle individual bit
  const handleToggleBit = (index) => {
    const newBits = [...bits];
    const newState = newBits[index] === 1 ? 0 : 1;
    newBits[index] = newState;
    sounds.playBitToggle(newState === 1);
    setBits(newBits);
  };

  // Play bit-by-bit sequence animation (0 → 1 → 0 → ...)
  useEffect(() => {
    let timer;
    if (isAutoAnimating) {
      timer = setInterval(() => {
        setAnimatingBitIndex((prev) => {
          if (prev >= 7) {
            setIsAutoAnimating(false);
            return -1;
          }
          const nextIdx = prev + 1;
          sounds.playParticleScan();
          return nextIdx;
        });
      }, 400);
    }
    return () => clearInterval(timer);
  }, [isAutoAnimating]);

  const triggerBitAnimation = () => {
    sounds.playClick();
    setAnimatingBitIndex(0);
    setIsAutoAnimating(true);
  };

  const loadPreset = (presetChar) => {
    sounds.playClick();
    const code = presetChar.charCodeAt(0);
    const binStr = code.toString(2).padStart(8, '0');
    setBits(binStr.split('').map(b => parseInt(b, 10)));
  };

  return (
    <div className="space-y-6 font-mono text-zinc-100">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 mb-1">
              <Cpu className="w-4 h-4" />
              <span>INTERACTIVE BIT-BY-BIT EVALUATION & FLIPPER</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              8-Bit Positional Evaluation Engine
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Toggle any bit to see the ASCII decimal sum & character update live in real-time.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={triggerBitAnimation}
              disabled={isAutoAnimating}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>ANIMATE BITS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Quick Loader Buttons */}
      <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center overflow-x-auto space-x-2">
        <span className="text-xs text-zinc-400 shrink-0 font-semibold mr-2">
          LOAD PRESETS:
        </span>
        {['A', 'Z', 'a', 'z', '0', '9', '!', '@', '#', ' '].map((pChar) => (
          <button
            key={pChar}
            onClick={() => loadPreset(pChar)}
            className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 hover:text-emerald-400 text-xs font-bold transition-all shrink-0"
          >
            '{pChar === ' ' ? '␣' : pChar}'
          </button>
        ))}
      </div>

      {/* Main Interactive Bit Evaluator Grid */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-6">
        {/* Bit Positional Headers */}
        <div className="grid grid-cols-8 gap-2 text-center">
          {breakdown.bitWeights.map((weight, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-xs font-bold text-emerald-400 mb-1">
                2<sup>{7 - idx}</sup>
              </span>
              <span className="text-xs text-zinc-400 font-semibold">
                {weight}
              </span>
            </div>
          ))}
        </div>

        {/* Down Arrow Indicators */}
        <div className="grid grid-cols-8 gap-2 text-center text-zinc-600 text-sm">
          {breakdown.bitWeights.map((_, idx) => (
            <div key={idx}>↓</div>
          ))}
        </div>

        {/* Interactive Bit Buttons */}
        <div className="grid grid-cols-8 gap-2">
          {bits.map((bitVal, idx) => {
            const isBitActive = bitVal === 1;
            const isScanning = animatingBitIndex === idx;

            return (
              <button
                key={idx}
                onClick={() => handleToggleBit(idx)}
                className={`py-4 sm:py-6 rounded-xl border text-xl sm:text-2xl font-black transition-all transform duration-200 relative group ${
                  isScanning 
                    ? 'ring-4 ring-amber-400 border-amber-400 scale-105'
                    : isBitActive
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-lg shadow-emerald-500/30 scale-[1.02]'
                      : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {bitVal}
                <span className="absolute bottom-1 right-1 text-[9px] opacity-40 font-mono">
                  b{7 - idx}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bit Sequence String Indicator */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs">
            <Binary className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-400">BIT STREAM:</span>
            <span className="font-bold text-amber-400 text-sm tracking-widest">
              {bits.join('')}
            </span>
          </div>

          <div className="text-xs text-zinc-400">
            Click any bit button above to toggle 0 ↔ 1
          </div>
        </div>

        {/* Live Calculation Formula Card */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-emerald-500/30 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Active Bit Weights Sum */}
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 block font-semibold">
              ACTIVE WEIGHTS SUM:
            </span>
            <div className="text-sm font-bold text-emerald-400 truncate">
              {breakdown.activeWeights.length > 0 ? breakdown.activeWeights.join(' + ') : '0'}
            </div>
          </div>

          {/* Decimal Result */}
          <div className="space-y-1 md:border-x border-zinc-800 md:px-6">
            <span className="text-xs text-zinc-400 block font-semibold">
              DECIMAL ASCII VALUE:
            </span>
            <div className="text-2xl font-bold text-zinc-100">
              = {asciiVal}
            </div>
          </div>

          {/* Character Output */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-400 block font-semibold">
                CHARACTER OUTPUT:
              </span>
              <div className="text-2xl font-extrabold text-emerald-400">
                '{char === ' ' ? '␣' : char}'
              </div>
            </div>

            <button
              onClick={() => onSelectChar(asciiVal)}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all border border-zinc-700"
            >
              Inspect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
