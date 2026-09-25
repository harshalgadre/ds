'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Paintbrush, Copy, Check, Upload, Image as ImageIcon, Sparkles, Type } from 'lucide-react';
import { generateTextAsciiArt, convertImagePixelsToAscii } from '@/lib/algorithms/asciiArtGenerator';
import { sounds } from '@/lib/audio/soundEffects';

export default function AsciiArtView() {
  const [mode, setMode] = useState('TEXT'); // TEXT | IMAGE
  const [inputText, setInputText] = useState('HELLO');
  const [copied, setCopied] = useState(false);

  // Image state
  const [imageSrc, setImageSrc] = useState(null);
  const [asciiImageOutput, setAsciiImageOutput] = useState('');
  const [densityCharset, setDensityCharset] = useState('@#S%?*+;:,. ');
  const [asciiWidth, setAsciiWidth] = useState(60);

  const canvasRef = useRef(null);

  const asciiTextBanner = generateTextAsciiArt(inputText);

  const handleCopy = (textToCopy) => {
    sounds.playClick();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Process image to ASCII on canvas
  useEffect(() => {
    if (mode === 'IMAGE' && imageSrc) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Scale aspect ratio
        const aspect = img.height / img.width;
        const width = asciiWidth;
        const height = Math.floor(width * aspect * 0.55); // Character aspect height ratio multiplier

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);

        const art = convertImagePixelsToAscii(imageData.data, width, height, densityCharset);
        setAsciiImageOutput(art);
      };
      img.src = imageSrc;
    }
  }, [mode, imageSrc, densityCharset, asciiWidth]);

  // Load sample default image
  const loadSampleImage = () => {
    sounds.playClick();
    // Generate a simple test icon on canvas
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(50, 50, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#09090b';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('A', 38, 62);

    setImageSrc(canvas.toDataURL());
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      sounds.playClick();
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 font-mono text-zinc-100">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 mb-1">
              <Paintbrush className="w-4 h-4" />
              <span>ASCII ART & IMAGE CONVERTER GENERATOR</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              ASCII Art Studio
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Generate block letters or map image luminance pixels to ASCII density characters.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => {
                sounds.playClick();
                setMode('TEXT');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                mode === 'TEXT'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text Banner</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setMode('IMAGE');
                if (!imageSrc) loadSampleImage();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                mode === 'IMAGE'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image to ASCII</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Text Banner */}
      {mode === 'TEXT' && (
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-zinc-400">INPUT BANNER TEXT (MAX 8 CHARS):</label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value.slice(0, 8))}
              placeholder="e.g. HELLO..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 text-lg font-bold tracking-widest focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>GENERATED BLOCK BANNER:</span>
              <button
                onClick={() => handleCopy(asciiTextBanner)}
                className="flex items-center space-x-1 text-emerald-400 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Banner!' : 'Copy ASCII Art'}</span>
              </button>
            </div>

            <div className="p-6 rounded-xl bg-zinc-950 border border-emerald-500/30 overflow-x-auto">
              <pre className="text-emerald-400 font-bold text-xs leading-none whitespace-pre tracking-normal">
                {asciiTextBanner}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Image to ASCII Art */}
      {mode === 'IMAGE' && (
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-6">
          <canvas ref={canvasRef} className="hidden" />

          {/* Image Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 block">UPLOAD IMAGE:</label>
              <label className="w-full py-2.5 px-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 cursor-pointer flex items-center justify-center space-x-2 text-xs font-bold text-emerald-400 transition-all">
                <Upload className="w-4 h-4" />
                <span>Upload Custom Image</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 block">CHAR DENSITY PRESET:</label>
              <select
                value={densityCharset}
                onChange={(e) => setDensityCharset(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-950 text-xs text-zinc-300 border border-zinc-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="@#S%?*+;:,. ">Standard Gradient (@#S%?*+;:,. )</option>
                <option value="█▓▒░ ">Blocks Gradient (█▓▒░ )</option>
                <option value="#$-=:. ">High Contrast (#$-=:. )</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 block">RESOLUTION WIDTH: {asciiWidth}px</label>
              <input
                type="range"
                min={30}
                max={100}
                value={asciiWidth}
                onChange={(e) => setAsciiWidth(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-zinc-950"
              />
            </div>
          </div>

          {/* Output ASCII Image Canvas Render */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>GENERATED IMAGE DENSITY GRID:</span>
              <button
                onClick={() => handleCopy(asciiImageOutput)}
                className="flex items-center space-x-1 text-emerald-400 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Art'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 overflow-x-auto max-h-[500px]">
              <pre className="text-emerald-400 font-bold text-[8px] leading-[0.8] whitespace-pre tracking-tighter">
                {asciiImageOutput || 'Processing image matrix...'}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
