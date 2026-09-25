'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, Sparkles, Eye, Code, Binary, Zap, ArrowDown } from 'lucide-react';
import { encodeTextToPipeline } from '@/lib/algorithms/asciiEncoder';
import { sounds } from '@/lib/audio/soundEffects';

export default function EncoderPipelineView({ onSelectChar }) {
  const [inputText, setInputText] = useState('HELLO');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // 0: input, 1: split, 2: ascii, 3: binary, 4: hex
  const [activeCharIndex, setActiveCharIndex] = useState(0);
  const [speedMs, setSpeedMs] = useState(800);

  const pipelineData = encodeTextToPipeline(inputText);

  // Auto-play step animation effect
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        sounds.playParticleScan();
        setActiveStep((prevStep) => {
          if (prevStep >= 4) {
            setActiveCharIndex((prevChar) => {
              if (prevChar >= pipelineData.length - 1) {
                setIsPlaying(false);
                return 0;
              }
              return prevChar + 1;
            });
            return 1; // loop back to char split for next char
          }
          return prevStep + 1;
        });
      }, speedMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speedMs, pipelineData.length]);

  const togglePlay = () => {
    sounds.playClick();
    if (!isPlaying) {
      setActiveStep(1);
      setActiveCharIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    sounds.playClick();
    setIsPlaying(false);
    setActiveStep(0);
    setActiveCharIndex(0);
  };

  return (
    <div className="space-y-6 font-mono text-zinc-100">
      {/* Top Banner & Control Section */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 mb-1">
              <Zap className="w-4 h-4" />
              <span>INTERACTIVE CHARACTER ENCODING PIPELINE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Character → ASCII → Binary → Hex
            </h2>
          </div>

          {/* Animation Playback Controls */}
          <div className="flex items-center space-x-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
            <button
              onClick={togglePlay}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                isPlaying 
                  ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400' 
                  : 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSE ANIMATION' : 'PLAY ANIMATION'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              title="Reset Animation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <select
              value={speedMs}
              onChange={(e) => setSpeedMs(Number(e.target.value))}
              className="px-2 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 text-xs border border-zinc-800 focus:outline-none focus:border-emerald-500"
            >
              <option value={1200}>0.5x Speed</option>
              <option value={800}>1.0x Speed</option>
              <option value={400}>2.0x Speed</option>
            </select>
          </div>
        </div>

        {/* Input Text Box */}
        <div className="space-y-2">
          <label className="text-xs text-zinc-400 flex items-center justify-between">
            <span>INPUT TEXT TO ENCODE:</span>
            <span className="text-[10px] text-zinc-400">Click any character card to analyze</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value.slice(0, 16));
                setActiveStep(0);
              }}
              placeholder="Enter text (e.g. HELLO)..."
              maxLength={16}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 text-lg font-bold tracking-widest focus:outline-none focus:border-emerald-500/80 transition-all shadow-inner"
            />
            <span className="absolute right-4 top-3 text-xs text-zinc-400">
              {inputText.length}/16
            </span>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Architecture Graph (Feature #9) */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-3">
          <span className="flex items-center space-x-2 text-emerald-400 font-bold">
            <Code className="w-4 h-4" />
            <span>ENCODING PIPELINE DIAGRAM</span>
          </span>
          {isPlaying && (
            <span className="text-amber-400 animate-pulse font-semibold">
              ● SCANNING CHAR #{activeCharIndex + 1} ({pipelineData[activeCharIndex]?.char})
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { step: 0, name: '1. INPUT', val: inputText || 'Empty' },
            { step: 1, name: '2. CHAR SPLIT', val: pipelineData[activeCharIndex]?.displayChar || 'Char' },
            { step: 2, name: '3. ASCII DEC', val: pipelineData[activeCharIndex]?.ascii ?? 'Dec' },
            { step: 3, name: '4. BINARY', val: pipelineData[activeCharIndex]?.binary || 'Binary' },
            { step: 4, name: '5. HEX', val: `0x${pipelineData[activeCharIndex]?.hex || 'Hex'}` },
          ].map((item, idx) => {
            const isCurrent = activeStep === item.step;
            return (
              <div 
                key={idx}
                className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300 relative ${
                  isCurrent 
                    ? 'bg-emerald-500/10 border-emerald-400 text-emerald-300 scale-105 shadow-lg shadow-emerald-500/20' 
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-zinc-950 animate-bounce">
                    ACTIVE
                  </span>
                )}
                <span className="text-[10px] text-zinc-400 font-semibold mb-1">{item.name}</span>
                <span className="text-sm font-bold text-zinc-100 truncate w-full">
                  {item.val}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Transformation Table List (Feature #1) */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
        <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>STAGE-BY-STAGE CHARACTER TRANSFORMATION</span>
        </h3>

        {pipelineData.length === 0 ? (
          <div className="p-8 text-center text-zinc-400 text-sm border border-dashed border-zinc-800 rounded-xl">
            Type a word above to see the ASCII encoding transformation pipeline!
          </div>
        ) : (
          <div className="space-y-3">
            {pipelineData.map((item, index) => {
              const isSelected = activeCharIndex === index && isPlaying;
              return (
                <div
                  key={index}
                  onClick={() => {
                    sounds.playClick();
                    onSelectChar(item);
                  }}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 group ${
                    isSelected
                      ? 'bg-zinc-800/90 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.01]'
                      : 'bg-zinc-950/80 border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900'
                  }`}
                >
                  {/* Transformation Chain */}
                  <div className="flex items-center space-x-3 overflow-x-auto w-full sm:w-auto">
                    {/* Char */}
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-emerald-500/30 flex items-center justify-center font-bold text-lg text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                      {item.char === ' ' ? '␣' : item.char}
                    </div>

                    <ArrowRight className="w-4 h-4 text-zinc-400 shrink-0" />

                    {/* ASCII */}
                    <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs shrink-0">
                      <span className="text-[10px] text-zinc-400 block">ASCII</span>
                      <span className="font-bold text-zinc-100">{item.ascii}</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-zinc-400 shrink-0" />

                    {/* Binary */}
                    <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs shrink-0">
                      <span className="text-[10px] text-zinc-400 block">BINARY</span>
                      <span className="font-bold text-amber-400 tracking-wider">{item.binary}</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-zinc-400 shrink-0" />

                    {/* Hex */}
                    <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs shrink-0">
                      <span className="text-[10px] text-zinc-400 block">HEX</span>
                      <span className="font-bold text-cyan-400">0x{item.hex}</span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs text-emerald-400 group-hover:underline flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Analyze</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
