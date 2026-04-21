import React, { useState } from 'react';
import { calculateBazi, BaziData } from './lib/baziUtils';
import { analyzeBazi } from './services/aiService';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, MapPin, Sparkles, ChevronRight, Hash, Wind, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [userName, setUserName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');
  const [birthLocation, setBirthLocation] = useState('');
  const [baziData, setBaziData] = useState<BaziData | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;

    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);
    const date = new Date(year, month - 1, day, hour, minute);

    const data = calculateBazi(date);
    setBaziData(data);
    setStep('result');
    
    setIsAnalyzing(true);
    const result = await analyzeBazi(data, userName);
    setAnalysis(result || '');
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-8 md:p-12 select-none selection:bg-ink selection:text-bg">
      <header className="flex justify-between items-start border-b border-black pb-8">
        <div className="flex flex-col">
          <h1 className="serif text-4xl md:text-5xl font-extralight tracking-tighter mb-1">命理 · 乾坤</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-40">Celestial Mechanics & Fate Analysis</p>
        </div>
        
        <AnimatePresence>
          {step === 'result' && baziData && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:flex gap-12 text-right"
            >
              <div className="flex flex-col">
                <span className="text-[10px] opacity-40 uppercase tracking-widest mb-1">Subject</span>
                <span className="serif text-lg">{userName || '无名氏'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] opacity-40 uppercase tracking-widest mb-1">Birth Date</span>
                <span className="mono text-lg">{birthDate.replace(/-/g, '.')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] opacity-40 uppercase tracking-widest mb-1">Location</span>
                <span className="serif text-lg">{birthLocation || '未知 · 地点'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] opacity-40 uppercase tracking-widest mb-1">System</span>
                <span className="serif text-lg">玄象 · v1.0</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 flex flex-col justify-center py-12">
        <AnimatePresence mode="wait">
          {step === 'input' ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-xl mx-auto w-full"
            >
              <div className="mb-16 text-center">
                <h2 className="serif italic text-3xl mb-4 font-light">生辰之始</h2>
                <div className="h-[1px] w-12 bg-black mx-auto mb-6 opacity-20"></div>
                <p className="text-ink/60 text-xs tracking-widest uppercase leading-relaxed">
                  Enter your origin point.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] uppercase opacity-40">Client Name / 姓名</label>
                  <input
                    type="text"
                    placeholder="请输入缘主姓名（选填）"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full text-lg serif border-b 0.5px border-ink/20 py-3 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] tracking-[0.3em] uppercase opacity-40">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full text-lg mono focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] tracking-[0.3em] uppercase opacity-40">Time of Birth</label>
                    <input
                      type="time"
                      required
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full text-lg mono focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] uppercase opacity-40">Birth Location</label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={birthLocation}
                    onChange={(e) => setBirthLocation(e.target.value)}
                    className="w-full text-lg serif border-b 0.5px border-ink/20 py-3 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="flex justify-center pt-8">
                  <button
                    type="submit"
                    className="group border border-ink/20 px-12 py-4 text-[10px] tracking-[0.4em] uppercase hover:bg-ink hover:text-white transition-all duration-500"
                  >
                    Analyze Fate
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              <div className="md:hidden mb-8 border-b border-black/5 pb-4">
                <button 
                  onClick={() => setStep('input')}
                  className="text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                >
                  ← Back to Input
                </button>
              </div>

              {/* 四柱排盘 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto w-full">
                {[
                  { label: '年柱 YEAR', data: baziData?.yearPillar },
                  { label: '月柱 MONTH', data: baziData?.monthPillar },
                  { label: '日柱 DAY', data: baziData?.dayPillar },
                  { label: '时柱 TIME', data: baziData?.hourPillar }
                ].reverse().map((pillar, i) => (
                  <div key={pillar.label} className="flex flex-col items-center border-l border-black/10 py-6 first:border-l-0 md:first:border-l last:border-r last:border-black/10">
                    <span className="text-[9px] opacity-30 mb-8 tracking-[0.5em] uppercase text-center">{pillar.label}</span>
                    <div className="serif text-6xl md:text-7xl font-bold leading-tight mb-2">{pillar.data?.heavenlyStem}</div>
                    <div className="serif text-6xl md:text-7xl font-bold leading-tight">{pillar.data?.earthlyBranch}</div>
                    <span className="text-[10px] mt-8 opacity-40 italic tracking-widest uppercase">Pillar {4-i}</span>
                  </div>
                ))}
              </div>

              {/* 解析面板 */}
              <div className="flex flex-col md:flex-row justify-center gap-12 lg:gap-24 px-4">
                <div className="flex flex-col gap-6 max-w-[320px] w-full">
                  <div className="flex justify-between items-baseline border-b border-black/5 pb-1">
                    <span className="serif italic text-xs opacity-60">格局与解析 / Pattern</span>
                    <span className="serif font-bold text-sm tracking-tighter">命运概论</span>
                  </div>
                  <div className="analysis-content">
                    {isAnalyzing ? (
                      <div className="space-y-3 opacity-20">
                        <div className="h-2 bg-black w-full animate-pulse"></div>
                        <div className="h-2 bg-black w-4/5 animate-pulse delay-75"></div>
                        <div className="h-2 bg-black w-3/4 animate-pulse delay-150"></div>
                      </div>
                    ) : (
                      <ReactMarkdown>{analysis ? analysis.split('\n\n')[0] : ''}</ReactMarkdown>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-6 max-w-[320px] w-full">
                  <div className="flex justify-between items-baseline border-b border-black/5 pb-1">
                    <span className="serif italic text-xs opacity-60">流年建议 / Insight</span>
                    <span className="serif font-bold text-sm tracking-tighter">岁运</span>
                  </div>
                  <div className="analysis-content">
                    {isAnalyzing ? (
                      <div className="space-y-3 opacity-20">
                        <div className="h-2 bg-black w-full animate-pulse"></div>
                        <div className="h-2 bg-black w-4/5 animate-pulse"></div>
                      </div>
                    ) : (
                      <ReactMarkdown>{analysis ? analysis.split('\n\n').slice(1).join('\n\n') : ''}</ReactMarkdown>
                    )}
                  </div>
                </div>

                <div className="hidden lg:flex flex-col gap-6 max-w-[200px] w-full">
                  <div className="flex justify-between items-baseline border-b border-black/5 pb-1">
                    <span className="serif italic text-xs opacity-60">五行比例 / Balance</span>
                    <span className="serif font-bold text-xs">Elements</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <div className="h-1 bg-black w-1/3 opacity-100"></div>
                    <div className="h-1 bg-black w-1/4 opacity-40"></div>
                    <div className="h-1 bg-black w-1/6 opacity-20"></div>
                    <div className="h-1 bg-black w-1/5 opacity-60"></div>
                    <div className="h-1 bg-black w-1/12 opacity-10"></div>
                  </div>
                  <p className="text-[10px] opacity-40 leading-relaxed uppercase tracking-tighter">
                    Geometric representation of energy balance.
                  </p>
                </div>
              </div>
              
              {step === 'result' && (
                <div className="flex justify-center pt-8">
                  <button 
                    onClick={() => setStep('input')}
                    className="text-[9px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 border-b border-transparent hover:border-black transition-all pb-1"
                  >
                    Recalculate
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="flex justify-between items-end border-t border-black/10 pt-8 mt-12">
        <div className="flex gap-12">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-widest opacity-40 mb-1">System Integrity</span>
            <span className="mono text-[9px] opacity-60">玄象_AESTHETIC_V1</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-widest opacity-40 mb-1">Analysis Mode</span>
            <span className="mono text-[9px] opacity-60">STOCHASTIC_FATE_LLM</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:block w-16 h-[1px] bg-black opacity-20"></div>
          <span className="serif italic text-xs opacity-60">万物皆有数，命运自有期</span>
        </div>
      </footer>
    </div>
  );
}

