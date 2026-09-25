'use client';

import React, { useState, useEffect } from 'react';
import { Code2, Play, Pause, SkipBack, SkipForward, RotateCcw, Cpu, Clock, HardDrive, Sparkles } from 'lucide-react';
import { ALGORITHM_DOCS, generateEncodingExecutionTrace } from '@/lib/algorithms/algorithmTracer';
import { sounds } from '@/lib/audio/soundEffects';

export default function AlgorithmTracerView() {
  const [selectedAlgoKey, setSelectedAlgoKey] = useState('ENCODING');
  const [sampleText, setSampleText] = useState('HI');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentDoc = ALGORITHM_DOCS[selectedAlgoKey] || ALGORITHM_DOCS.ENCODING;
  const traces = generateEncodingExecutionTrace(sampleText);
  const currentTrace = traces[currentStepIndex] || traces[0];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        sounds.playParticleScan();
        setCurrentStepIndex((prev) => {
          if (prev >= traces.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(timer);
  }, [isPlaying, traces.length]);

  const handleTogglePlay = () => {
    sounds.playClick();
    if (currentStepIndex >= traces.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    sounds.playClick();
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleStepForward = () => {
    sounds.playClick();
    if (currentStepIndex < traces.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleStepBack = () => {
    sounds.playClick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="space-y-6 font-mono text-zinc-100">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 mb-1">
              <Code2 className="w-4 h-4" />
              <span>DSA VIVA & PSEUDOCODE ALGORITHM VISUALIZER</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Algorithm Execution Tracer
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Step through actual algorithm loops and inspect memory data structures live.
            </p>
          </div>

          {/* Algorithm Picker */}
          <div className="flex items-center space-x-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
            {Object.keys(ALGORITHM_DOCS).map((key) => (
              <button
                key={key}
                onClick={() => {
                  sounds.playClick();
                  setSelectedAlgoKey(key);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedAlgoKey === key
                    ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {ALGORITHM_DOCS[key].title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Complexity Metadata Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block font-semibold">TIME COMPLEXITY</span>
            <span className="text-sm font-bold text-emerald-400">{currentDoc.timeComplexity}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block font-semibold">SPACE COMPLEXITY</span>
            <span className="text-sm font-bold text-cyan-400">{currentDoc.spaceComplexity}</span>
          </div>
        </div>
      </div>

      {/* Execution Step Controls Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-zinc-400 font-semibold">TEST INPUT:</span>
          <input
            type="text"
            value={sampleText}
            onChange={(e) => {
              setSampleText(e.target.value.slice(0, 6));
              setCurrentStepIndex(0);
            }}
            maxLength={6}
            className="px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400 text-xs font-bold w-24 text-center focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center space-x-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={handleStepBack}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 disabled:opacity-30"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'PAUSE' : 'STEP RUN'}</span>
          </button>

          <button
            onClick={handleStepForward}
            disabled={currentStepIndex >= traces.length - 1}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 disabled:opacity-30"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-zinc-400 font-bold">
          STEP <span className="text-emerald-400">{currentStepIndex + 1}</span> / {traces.length}
        </div>
      </div>

      {/* Main Grid: Pseudocode Panel vs Live Memory Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Formal Pseudocode Panel */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
              <Code2 className="w-4 h-4" />
              <span>ALGORITHM PSEUDOCODE</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs space-y-1 overflow-x-auto">
            {currentDoc.pseudocode.map((lineObj) => {
              const isHighlighted = currentTrace?.highlightLine === lineObj.line;
              return (
                <div
                  key={lineObj.line}
                  className={`px-3 py-1 rounded transition-colors flex items-center space-x-4 ${
                    isHighlighted
                      ? 'bg-emerald-500/20 border-l-4 border-emerald-400 text-emerald-300 font-bold'
                      : 'text-zinc-400 opacity-80'
                  }`}
                >
                  <span className="text-zinc-600 text-[10px] w-6 select-none">{lineObj.line}</span>
                  <span className="whitespace-pre">{lineObj.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Variable State Inspector */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-bold text-cyan-400 flex items-center space-x-1.5">
              <Cpu className="w-4 h-4" />
              <span>LIVE VARIABLE STATE INSPECTOR</span>
            </span>
          </div>

          {/* Current Step Explanation Box */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 space-y-2">
            <span className="text-[10px] text-emerald-400 font-bold block">STEP EXPLANATION:</span>
            <p className="text-xs text-zinc-200 font-semibold leading-relaxed">
              {currentTrace?.description}
            </p>
          </div>

          {/* Variable State Table */}
          <div className="space-y-2">
            <span className="text-[10px] text-zinc-400 block font-semibold">MEMORY REGISTERS:</span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">Loop Index (i)</span>
                <span className="font-bold text-emerald-400">{currentTrace?.variables?.i}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">Current Char</span>
                <span className="font-bold text-emerald-400">'{currentTrace?.variables?.currentChar}'</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">ASCII Code</span>
                <span className="font-bold text-amber-400">{currentTrace?.variables?.asciiCode}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">8-Bit Binary</span>
                <span className="font-bold text-amber-400">{currentTrace?.variables?.binaryStr}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">Hexadecimal</span>
                <span className="font-bold text-cyan-400">{currentTrace?.variables?.hexStr}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">Pipeline Length</span>
                <span className="font-bold text-cyan-400">{currentTrace?.variables?.pipelineLength} items</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
