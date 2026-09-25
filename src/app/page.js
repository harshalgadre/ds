'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import EncoderPipelineView from '@/components/EncoderPipelineView';
import BitAnimationView from '@/components/BitAnimationView';
import ChallengeGameView from '@/components/ChallengeGameView';
import SecretMessageView from '@/components/SecretMessageView';
import AsciiExplorerView from '@/components/AsciiExplorerView';
import AsciiArtView from '@/components/AsciiArtView';
import AlgorithmTracerView from '@/components/AlgorithmTracerView';
import CharacterAnalysisModal from '@/components/CharacterAnalysisModal';
import { Terminal, Github, Cpu, Zap, Shield, Sparkles } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [muted, setMuted] = useState(false);
  const [selectedCharData, setSelectedCharData] = useState(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono flex flex-col selection:bg-emerald-500 selection:text-zinc-950">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        muted={muted}
        setMuted={setMuted}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'pipeline' && (
          <EncoderPipelineView onSelectChar={(char) => setSelectedCharData(char)} />
        )}

        {activeTab === 'bit-anim' && (
          <BitAnimationView onSelectChar={(char) => setSelectedCharData(char)} />
        )}

        {activeTab === 'challenge' && (
          <ChallengeGameView />
        )}

        {activeTab === 'secret' && (
          <SecretMessageView />
        )}

        {activeTab === 'explorer' && (
          <AsciiExplorerView onSelectChar={(char) => setSelectedCharData(char)} />
        )}

        {activeTab === 'art' && (
          <AsciiArtView />
        )}

        {activeTab === 'algorithm' && (
          <AlgorithmTracerView />
        )}
      </main>

      {/* Character Analysis Inspector Modal */}
      {selectedCharData !== null && (
        <CharacterAnalysisModal
          charData={selectedCharData}
          onClose={() => setSelectedCharData(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-900/50 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-zinc-300">ASCII LAB</span>
            <span>— Interactive Character Encoding & Visualization Platform</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-zinc-600">Built for Data Structures & Algorithms (DSA)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
