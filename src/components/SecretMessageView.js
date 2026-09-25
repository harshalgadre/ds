'use client';

import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check, Sparkles, HelpCircle, Eye, RefreshCw, Key } from 'lucide-react';
import { encodeSecretMessage, decodeSecretMessage, ENCODING_FORMATS, PUZZLE_LIST } from '@/lib/algorithms/secretMessage';
import { sounds } from '@/lib/audio/soundEffects';

export default function SecretMessageView() {
  const [activeSubtab, setActiveSubtab] = useState('ENCODER'); // ENCODER | PUZZLE
  const [format, setFormat] = useState(ENCODING_FORMATS.BINARY);

  // Encoder state
  const [secretText, setSecretText] = useState('MEET AT 5');
  const [copied, setCopied] = useState(false);

  // Decoder state
  const [decodeInput, setDecodeInput] = useState('01001101 01000101 01000101 01010100 00100000 01000001 01010100 00100000 00110101');

  // Puzzle state
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [userSolution, setUserSolution] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [puzzleStatus, setPuzzleStatus] = useState(null); // null, CORRECT, INCORRECT

  const encodedOutput = encodeSecretMessage(secretText, format);
  const decodedOutput = decodeSecretMessage(decodeInput, format);

  const currentPuzzle = PUZZLE_LIST[puzzleIndex];

  const handleCopy = () => {
    sounds.playClick();
    navigator.clipboard.writeText(encodedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckPuzzle = () => {
    sounds.playClick();
    if (userSolution.trim().toLowerCase() === currentPuzzle.solution.toLowerCase()) {
      sounds.playSuccess();
      setPuzzleStatus('CORRECT');
    } else {
      sounds.playError();
      setPuzzleStatus('INCORRECT');
    }
  };

  const nextPuzzle = () => {
    sounds.playClick();
    setPuzzleIndex((prev) => (prev + 1) % PUZZLE_LIST.length);
    setUserSolution('');
    setShowHint(false);
    setPuzzleStatus(null);
  };

  return (
    <div className="space-y-6 font-mono text-zinc-100">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 mb-1">
              <Lock className="w-4 h-4" />
              <span>ASCII ENCODED SECRET MESSAGES & PUZZLES</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Secret Message Lab
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Convert plain text into ASCII binary streams or decode incoming transmissions.
            </p>
          </div>

          {/* Subtab Selector */}
          <div className="flex items-center space-x-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveSubtab('ENCODER');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubtab === 'ENCODER'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Encode & Decode Tool
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveSubtab('PUZZLE');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubtab === 'PUZZLE'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              🕵️ "Decode This" Puzzles
            </button>
          </div>
        </div>
      </div>

      {/* Subtab 1: Encoder & Decoder Tool */}
      {activeSubtab === 'ENCODER' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ENCODER CARD */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <Lock className="w-4 h-4" />
                <span>SECRET MESSAGE ENCODER</span>
              </span>

              {/* Format Picker */}
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="px-2 py-1 rounded-lg bg-zinc-950 text-xs text-zinc-300 border border-zinc-800 focus:outline-none focus:border-emerald-500"
              >
                <option value={ENCODING_FORMATS.BINARY}>Binary (0100...)</option>
                <option value={ENCODING_FORMATS.HEX}>Hexadecimal (48 45...)</option>
                <option value={ENCODING_FORMATS.DECIMAL}>Decimal ASCII (72 69...)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400">ENTER YOUR SECRET MESSAGE:</label>
              <input
                type="text"
                value={secretText}
                onChange={(e) => setSecretText(e.target.value)}
                placeholder="e.g. MEET AT 5..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 text-sm font-bold tracking-wider focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Encoded Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>ENCODED STREAM:</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-emerald-400 hover:underline text-[11px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Encoded Message'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 text-amber-400 font-bold text-xs break-all min-h-[100px] leading-relaxed shadow-inner">
                {encodedOutput || 'Type text above...'}
              </div>
            </div>
          </div>

          {/* DECODER CARD */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold text-cyan-400 flex items-center space-x-1.5">
                <Unlock className="w-4 h-4" />
                <span>DECODE INCOMING TRANSMISSION</span>
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400">PASTE ENCODED STREAM:</label>
              <textarea
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                rows={3}
                placeholder="Paste binary or hex stream here..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-400 text-xs font-bold tracking-wider focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {/* Decoded Recovered Text Box */}
            <div className="space-y-2">
              <span className="text-xs text-zinc-400 block">RECOVERED ORIGINAL MESSAGE:</span>
              <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-500/30 text-emerald-400 font-extrabold text-base min-h-[100px] flex items-center justify-center text-center shadow-inner">
                {decodedOutput ? `"${decodedOutput}"` : 'No valid message decoded yet...'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: "Decode This" Puzzle Mode (Feature #6) */}
      {activeSubtab === 'PUZZLE' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold mr-2">
                PUZZLE #{puzzleIndex + 1} OF {PUZZLE_LIST.length}
              </span>
              <h3 className="text-lg font-bold text-zinc-100 inline-block">
                {currentPuzzle.title}
              </h3>
            </div>

            <button
              onClick={nextPuzzle}
              className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 text-zinc-400 hover:text-emerald-400 transition-all flex items-center space-x-1 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next Puzzle</span>
            </button>
          </div>

          {/* Encoded Message Box */}
          <div className="p-6 rounded-xl bg-zinc-950 border border-emerald-500/30 text-center space-y-3">
            <span className="text-xs text-zinc-400">WHAT DOES THIS MESSAGE SAY?</span>
            <div className="text-sm sm:text-base font-bold text-amber-400 tracking-widest break-all font-mono">
              {currentPuzzle.encoded}
            </div>
          </div>

          {/* Hint Toggle */}
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-amber-400 hover:underline flex items-center space-x-1"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
            </button>
          </div>

          {showHint && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              💡 Hint: {currentPuzzle.hint}
            </div>
          )}

          {/* Solution Input Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-zinc-400">TYPE DECODED SOLUTION:</label>
              <input
                type="text"
                value={userSolution}
                onChange={(e) => setUserSolution(e.target.value)}
                placeholder="Type text solution..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 text-base font-bold tracking-wider focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleCheckPuzzle}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all"
            >
              CHECK DECODED MESSAGE
            </button>
          </div>

          {/* Feedback status */}
          {puzzleStatus === 'CORRECT' && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-center font-bold animate-fadeIn">
              ✓ DECODED SUCCESSFULLY! "{currentPuzzle.solution}"
            </div>
          )}

          {puzzleStatus === 'INCORRECT' && (
            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500 text-red-300 text-center font-bold animate-fadeIn">
              ✗ Incorrect solution. Try decoding bit by bit!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
