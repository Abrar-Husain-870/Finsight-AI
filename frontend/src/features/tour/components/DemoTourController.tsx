import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Sparkles,
  Info,
  Zap,
  CheckCircle2,
  RotateCcw,
  Minimize2,
  Maximize2,
  Compass,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { DEMO_TOUR_STEPS, useDemoTourStore, TourStep } from '../demoTourStore.js';
import { cn } from '../../../lib/utils.js';

export function DemoTourController() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isActive,
    isPlaying,
    isPaused,
    isCompleted,
    isMinimized,
    currentStepIndex,
    stepProgress,
    playbackSpeed,
    startTour,
    pauseTour,
    resumeTour,
    togglePlayPause,
    nextStep,
    prevStep,
    goToStep,
    stopTour,
    restartTour,
    setMinimized,
    setPlaybackSpeed,
    setStepProgress,
  } = useDemoTourStore();

  const currentStep: TourStep = (DEMO_TOUR_STEPS[currentStepIndex] ?? DEMO_TOUR_STEPS[0]) as TourStep;
  const stepDuration = (currentStep.durationMs || 9500) / playbackSpeed;

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const elapsedBeforePauseRef = useRef<number>(0);

  // Sync route whenever active step changes
  useEffect(() => {
    if (!isActive) return;
    if (location.pathname !== currentStep.route) {
      navigate(currentStep.route);
    }
  }, [isActive, currentStep.route, location.pathname, navigate]);

  // Handle timer progression and auto-advance
  useEffect(() => {
    if (!isActive || !isPlaying || isPaused || isCompleted) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    startTimeRef.current = Date.now() - elapsedBeforePauseRef.current;

    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(100, (elapsed / stepDuration) * 100);

      setStepProgress(progress);

      if (progress >= 100) {
        elapsedBeforePauseRef.current = 0;
        nextStep();
      }
    }, 50);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, isPlaying, isPaused, isCompleted, currentStepIndex, stepDuration, nextStep, setStepProgress]);

  // Reset elapsed when step changes
  useEffect(() => {
    elapsedBeforePauseRef.current = 0;
    setStepProgress(0);
  }, [currentStepIndex, setStepProgress]);

  // Pause tracking when paused
  const handleTogglePlayPause = useCallback(() => {
    if (isPlaying) {
      // Pausing: save current elapsed time
      elapsedBeforePauseRef.current = Date.now() - startTimeRef.current;
      pauseTour();
    } else {
      // Resuming
      resumeTour();
    }
  }, [isPlaying, pauseTour, resumeTour]);

  // Global keyboard shortcuts (Space to toggle, Esc to exit, Arrows to step)
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        elapsedBeforePauseRef.current = 0;
        nextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        elapsedBeforePauseRef.current = 0;
        prevStep();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        stopTour();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, handleTogglePlayPause, nextStep, prevStep, stopTour]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 pointer-events-none flex flex-col items-center justify-end px-3 sm:px-6">
      <AnimatePresence mode="wait">
        {/* COMPLETED CARD MODAL */}
        {isCompleted ? (
          <motion.div
            key="tour-completed-card"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="pointer-events-auto w-full max-w-lg rounded-3xl bg-[var(--color-bg-primary)]/95 border border-emerald-500/40 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl text-[var(--color-text-primary)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[var(--chart-2)] to-emerald-400" />
            
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Tour Complete
                  </span>
                  <h3 className="text-xl font-extrabold tracking-tight mt-1 text-[var(--color-text-primary)]">
                    All Core Features Showcased
                  </h3>
                </div>
              </div>
              <button
                onClick={stopTour}
                className="p-1.5 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6 font-medium">
              You've completed the interactive automated walkthrough of FinSight AI! All 10 deterministic features, behavioral rating analytics, stress tests, and real-time cash velocity modules are active in this workspace.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={restartTour}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)]/80 text-[var(--color-text-primary)] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Replay Tour
              </button>
              <button
                onClick={stopTour}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                Explore Workspace Freely
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : isMinimized ? (
          /* MINIMIZED FLOATING PILL */
          <motion.div
            key="tour-minimized-pill"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="pointer-events-auto rounded-full bg-[var(--color-bg-primary)]/90 border border-[var(--color-border-primary)] shadow-xl backdrop-blur-xl px-4 py-2 flex items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[var(--color-text-primary)] truncate max-w-[200px]">
                {currentStep.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-[var(--color-border-primary)] pl-2">
              <button
                onClick={handleTogglePlayPause}
                className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] transition-colors"
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              </button>
              <button
                onClick={() => setMinimized(false)}
                className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] transition-colors"
                title="Expand Showcase"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={stopTour}
                className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
                title="Exit Tour (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* FULL FLOATING SHOWCASE & PLAYBACK CONTROLLER */
          <motion.div
            key="tour-full-controller"
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="pointer-events-auto w-full max-w-2xl rounded-3xl bg-[var(--color-bg-primary)]/95 border border-[var(--color-border-primary)] shadow-2xl backdrop-blur-2xl text-[var(--color-text-primary)] overflow-hidden flex flex-col relative"
          >
            {/* Top Running Step Timer Progress Bar */}
            <div className="w-full h-1.5 bg-[var(--color-bg-secondary)] overflow-hidden relative">
              <motion.div
                className={cn(
                  'h-full transition-all duration-75',
                  isPaused ? 'bg-amber-500' : 'bg-emerald-500'
                )}
                style={{ width: `${stepProgress}%` }}
              />
            </div>

            {/* Showcase Header & Feature Explanation Content */}
            <div className="p-4 sm:p-5 flex flex-col gap-3">
              {/* Top Row: Step Index Chip + Badge + Window Controls */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] tabular-nums shrink-0">
                    Step {currentStepIndex + 1} of {DEMO_TOUR_STEPS.length}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--chart-2)]/10 text-[var(--chart-2)] border border-[var(--chart-2)]/20 truncate">
                    {currentStep.badge}
                  </span>
                  {isPaused && (
                    <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Paused
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setMinimized(true)}
                    className="p-1 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
                    title="Minimize Showcase"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={stopTour}
                    className="p-1 rounded-lg text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Exit Demo (Esc)"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Feature Title and Subtitle */}
              <div>
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-[var(--color-text-primary)] leading-snug">
                  {currentStep.title}
                </h3>
                <p className="text-[11px] font-semibold text-[var(--color-text-secondary)] mt-0.5">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* What It Is & What It Does Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {/* What It Is */}
                <div className="p-3 rounded-2xl bg-[var(--color-bg-secondary)]/60 border border-[var(--color-border-primary)]/60 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                    <Compass className="h-3.5 w-3.5 text-[var(--chart-2)] shrink-0" />
                    <span>What It Is</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-medium">
                    {currentStep.whatItIs}
                  </p>
                </div>

                {/* What It Does */}
                <div className="p-3 rounded-2xl bg-[var(--color-bg-secondary)]/60 border border-[var(--color-border-primary)]/60 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <Zap className="h-3.5 w-3.5 shrink-0" />
                    <span>What It Does</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-medium">
                    {currentStep.whatItDoes}
                  </p>
                </div>
              </div>

              {/* Key Highlights Tags Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="text-[10px] font-bold text-[var(--color-text-secondary)] mr-1">
                  Highlights:
                </span>
                {currentStep.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] shadow-2xs"
                  >
                    ✓ {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Playback Media Controls Bar */}
            <div className="px-4 py-3 bg-[var(--color-bg-secondary)]/80 border-t border-[var(--color-border-primary)] flex items-center justify-between gap-3">
              {/* Left: Step dots navigation */}
              <div className="hidden sm:flex items-center gap-1">
                {DEMO_TOUR_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      elapsedBeforePauseRef.current = 0;
                      goToStep(idx);
                    }}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300 cursor-pointer',
                      idx === currentStepIndex
                        ? 'w-6 bg-emerald-500'
                        : 'w-2 bg-[var(--color-border-primary)] hover:bg-[var(--color-text-secondary)]'
                    )}
                    title={`Jump to ${step.title}`}
                  />
                ))}
              </div>

              {/* Center: Playback Media Buttons */}
              <div className="flex items-center gap-2 mx-auto sm:mx-0">
                {/* Previous Step */}
                <button
                  onClick={() => {
                    elapsedBeforePauseRef.current = 0;
                    prevStep();
                  }}
                  disabled={currentStepIndex === 0}
                  className="p-2 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                  title="Previous Feature (Left Arrow)"
                >
                  <SkipBack className="h-4 w-4" />
                </button>

                {/* Play / Pause Toggle Button */}
                <button
                  onClick={handleTogglePlayPause}
                  className={cn(
                    'py-2 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer',
                    isPlaying
                      ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] hover:opacity-90'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  )}
                  title={isPlaying ? 'Pause Playback (Space)' : 'Resume Playback (Space)'}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      <span>Resume</span>
                    </>
                  )}
                </button>

                {/* Next Step */}
                <button
                  onClick={() => {
                    elapsedBeforePauseRef.current = 0;
                    nextStep();
                  }}
                  disabled={currentStepIndex === DEMO_TOUR_STEPS.length - 1}
                  className="p-2 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                  title="Next Feature (Right Arrow)"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>

              {/* Right: Playback Speed Toggle & Status */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-[var(--color-text-secondary)] hidden sm:inline">
                  Speed:
                </span>
                {[1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={cn(
                      'text-[10.5px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer',
                      playbackSpeed === s
                        ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] border-[var(--color-text-primary)] shadow-2xs'
                        : 'bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border-[var(--color-border-primary)] hover:text-[var(--color-text-primary)]'
                    )}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DemoTourController;
