'use client';

import React, { useState, useEffect } from 'react';
import { Gamepad2, Flame, Award, Timer, CheckCircle, XCircle, RotateCcw, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuestion, calculateQuestionScore, DIFFICULTY_LEVELS } from '@/lib/algorithms/asciiChallenge';
import { sounds } from '@/lib/audio/soundEffects';

export default function ChallengeGameView() {
  const [difficulty, setDifficulty] = useState('EASY');
  const [gameState, setGameState] = useState('IDLE'); // IDLE, PLAYING, FINISHED
  const [questionCount, setQuestionCount] = useState(0); // Max 10 questions per round
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);

  // Start game round
  const startGame = (selectedDiff = difficulty) => {
    sounds.playClick();
    setDifficulty(selectedDiff);
    setGameState('PLAYING');
    setQuestionCount(1);
    setScore(0);
    setStreak(0);
    const q = generateQuestion(selectedDiff);
    setCurrentQuestion(q);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(DIFFICULTY_LEVELS[selectedDiff].timeSeconds);
  };

  // Timer Countdown Effect
  useEffect(() => {
    let timer;
    if (gameState === 'PLAYING' && !isAnswered && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered && gameState === 'PLAYING') {
      // Time out! Count as wrong answer
      handleSelectOption(null);
    }
    return () => clearInterval(timer);
  }, [gameState, isAnswered, timeLeft]);

  // Handle Option Selection
  const handleSelectOption = (option) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswer(option);

    const isCorrect = option === currentQuestion.correctAnswer;

    if (isCorrect) {
      sounds.playSuccess();
      const points = calculateQuestionScore(true, timeLeft, streak);
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
    } else {
      sounds.playError();
      setStreak(0);
    }
  };

  // Move to next question or finish game
  const nextQuestion = () => {
    sounds.playClick();
    if (questionCount >= 10) {
      setGameState('FINISHED');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setQuestionCount((prev) => prev + 1);
      const q = generateQuestion(difficulty);
      setCurrentQuestion(q);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(DIFFICULTY_LEVELS[difficulty].timeSeconds);
    }
  };

  return (
    <div className="space-y-6 font-mono text-zinc-100">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 mb-1">
              <Gamepad2 className="w-4 h-4" />
              <span>ASCII ENCODING CHALLENGE MODE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Test Your ASCII & Bit Knowledge
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Answer 10 fast-paced questions, build up streak multipliers, and top the leaderboard.
            </p>
          </div>

          {/* Difficulty Selector */}
          <div className="flex items-center space-x-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
            {['EASY', 'MEDIUM', 'HARD'].map((diffKey) => (
              <button
                key={diffKey}
                onClick={() => {
                  if (gameState === 'PLAYING') {
                    if (window.confirm('Restart game with new difficulty?')) {
                      startGame(diffKey);
                    }
                  } else {
                    setDifficulty(diffKey);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  difficulty === diffKey 
                    ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {diffKey}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Game Idle State Screen */}
      {gameState === 'IDLE' && (
        <div className="p-12 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
            <Gamepad2 className="w-10 h-10" />
          </div>

          <div className="max-w-md space-y-2">
            <h3 className="text-2xl font-bold text-zinc-100">
              Ready for the ASCII Quiz?
            </h3>
            <p className="text-xs text-zinc-400">
              Selected Difficulty: <span className="text-emerald-400 font-bold">{difficulty}</span> ({DIFFICULTY_LEVELS[difficulty].timeSeconds} seconds per question).
            </p>
          </div>

          <button
            onClick={() => startGame(difficulty)}
            className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-sm shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all"
          >
            START CHALLENGE MODE
          </button>
        </div>
      )}

      {/* Active Game Playing State */}
      {gameState === 'PLAYING' && currentQuestion && (
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-6">
          {/* Header Scorebar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Question Counter */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Question</span>
              <span className="text-sm font-bold text-emerald-400">{questionCount} / 10</span>
            </div>

            {/* Timer */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 flex items-center space-x-1">
                <Timer className="w-3.5 h-3.5 text-amber-400" />
                <span>Timer</span>
              </span>
              <span className={`text-sm font-bold ${timeLeft <= 3 ? 'text-red-400 animate-ping' : 'text-amber-400'}`}>
                {timeLeft}s
              </span>
            </div>

            {/* Streak */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Streak</span>
              </span>
              <span className="text-sm font-bold text-orange-400">🔥 {streak}</span>
            </div>

            {/* Score */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>Score</span>
              </span>
              <span className="text-sm font-bold text-cyan-400">{score}</span>
            </div>
          </div>

          {/* Question Card Display */}
          <div className="p-6 sm:p-8 rounded-xl bg-zinc-950 border border-emerald-500/30 text-center space-y-4">
            <span className="px-3 py-1 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              {currentQuestion.type.replace(/_/g, ' ')}
            </span>

            <h3 className="text-lg sm:text-xl font-bold text-zinc-100 max-w-xl mx-auto">
              {currentQuestion.questionText}
            </h3>

            <div className="inline-block px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-2xl font-extrabold text-emerald-400 shadow-inner">
              {currentQuestion.promptText}
            </div>
          </div>

          {/* Multiple Choice Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;

              let btnClasses = 'bg-zinc-950 border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 text-zinc-200';

              if (isAnswered) {
                if (isCorrect) {
                  btnClasses = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-extrabold shadow-lg shadow-emerald-500/20';
                } else if (isSelected && !isCorrect) {
                  btnClasses = 'bg-red-500/20 border-red-500 text-red-300';
                } else {
                  btnClasses = 'bg-zinc-950 border-zinc-900 opacity-40';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 rounded-xl border text-base font-bold transition-all flex items-center justify-between ${btnClasses}`}
                >
                  <span className="truncate">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Answered */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold flex items-center space-x-1.5 ${selectedAnswer === currentQuestion.correctAnswer ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>CORRECT ANSWER!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>INCORRECT</span>
                    </>
                  )}
                </span>

                <button
                  onClick={nextQuestion}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                >
                  <span>{questionCount >= 10 ? 'VIEW RESULTS' : 'NEXT QUESTION'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-zinc-300">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Finished Game Summary Screen */}
      {gameState === 'FINISHED' && (
        <div className="p-8 sm:p-12 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 shadow-2xl shadow-emerald-500/30">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
              CHALLENGE COMPLETED!
            </h3>
            <p className="text-xs text-zinc-400">
              Difficulty: <span className="text-emerald-400 font-bold">{difficulty}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-xs text-zinc-400 block">FINAL SCORE</span>
              <span className="text-2xl font-black text-emerald-400">{score}</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-xs text-zinc-400 block">BEST STREAK</span>
              <span className="text-2xl font-black text-orange-400">🔥 {streak}</span>
            </div>
          </div>

          <button
            onClick={() => startGame(difficulty)}
            className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-sm shadow-xl shadow-emerald-500/30 transition-all flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      )}
    </div>
  );
}
