'use client';

import React, { useState, useMemo } from 'react';
import { Table, Search, Eye, Filter, Sparkles, Copy, Check } from 'lucide-react';
import { generateAsciiTable, searchAsciiTable, getCategoryStats } from '@/lib/algorithms/asciiExplorer';
import { sounds } from '@/lib/audio/soundEffects';

export default function AsciiExplorerView({ onSelectChar }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [copiedCode, setCopiedCode] = useState(null);

  const fullTable = useMemo(() => generateAsciiTable(), []);
  const categoryStats = useMemo(() => getCategoryStats(fullTable), [fullTable]);

  const filteredTable = useMemo(() => {
    return searchAsciiTable(fullTable, searchQuery, categoryFilter);
  }, [fullTable, searchQuery, categoryFilter]);

  const handleCopyRow = (item, e) => {
    e.stopPropagation();
    sounds.playClick();
    navigator.clipboard.writeText(`Char: ${item.char} | Dec: ${item.code} | Binary: ${item.binary} | Hex: ${item.hex}`);
    setCopiedCode(item.code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <div className="space-y-6 font-mono text-zinc-100">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 mb-1">
              <Table className="w-4 h-4" />
              <span>SEARCHABLE ASCII CHARACTER EXPLORER TABLE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Standard ASCII Lookup Matrix (0 - 127)
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Filter by character type, decimal value, binary stream, or hex code.
            </p>
          </div>

          <div className="text-xs text-zinc-400 font-bold bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800">
            SHOWING <span className="text-emerald-400">{filteredTable.length}</span> / {fullTable.length} CHARS
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Char (@, A), Dec (65), Binary (01000001), or Hex (41)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 text-xs font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {[
              { id: 'ALL', label: 'ALL', count: categoryStats.TOTAL },
              { id: 'CONTROL', label: 'CONTROL', count: categoryStats.CONTROL },
              { id: 'DIGITS', label: 'DIGITS', count: categoryStats.DIGITS },
              { id: 'UPPERCASE', label: 'UPPERCASE', count: categoryStats.UPPERCASE },
              { id: 'LOWERCASE', label: 'LOWERCASE', count: categoryStats.LOWERCASE },
              { id: 'SYMBOLS', label: 'SYMBOLS', count: categoryStats.SYMBOLS },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playClick();
                  setCategoryFilter(cat.id);
                }}
                className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                  categoryFilter === cat.id
                    ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ASCII Data Grid Table */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-[11px]">
                <th className="p-3 pl-6">Dec</th>
                <th className="p-3">Char</th>
                <th className="p-3">Symbol Name</th>
                <th className="p-3">Binary (8-bit)</th>
                <th className="p-3">Hex</th>
                <th className="p-3">Octal</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {filteredTable.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-500">
                    No ASCII characters matched query "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredTable.map((item) => (
                  <tr
                    key={item.code}
                    onClick={() => {
                      sounds.playClick();
                      onSelectChar(item.code);
                    }}
                    className="hover:bg-zinc-800/60 cursor-pointer transition-colors group"
                  >
                    <td className="p-3 pl-6 font-bold text-zinc-100">
                      {item.code}
                    </td>

                    <td className="p-3">
                      <span className="w-8 h-8 rounded-lg bg-zinc-950 border border-emerald-500/30 flex items-center justify-center font-bold text-sm text-emerald-400">
                        {item.charDisplay === ' ' ? '␣' : item.charDisplay}
                      </span>
                    </td>

                    <td className="p-3 text-zinc-300 font-semibold truncate max-w-[150px]">
                      {item.name}
                    </td>

                    <td className="p-3 font-bold text-amber-400 tracking-wider">
                      {item.binary}
                    </td>

                    <td className="p-3 font-bold text-cyan-400">
                      0x{item.hex}
                    </td>

                    <td className="p-3 text-zinc-400">
                      {item.octal}
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.category === 'UPPERCASE' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        item.category === 'LOWERCASE' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                        item.category === 'DIGITS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        item.category === 'CONTROL' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}>
                        {item.category}
                      </span>
                    </td>

                    <td className="p-3 text-right pr-6">
                      <button
                        onClick={(e) => handleCopyRow(item, e)}
                        className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 text-zinc-400 hover:text-emerald-400 transition-colors"
                        title="Copy Character Record"
                      >
                        {copiedCode === item.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
