'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, X, Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Instruction } from '@/lib/db/schema';

type Props = {
  title: string;
  servings: number;
  instructions: Instruction[];
};

type RecognitionLike = {
  start: () => void;
  stop: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => RecognitionLike;
    webkitSpeechRecognition?: new () => RecognitionLike;
  }
}

// Voice quality priority: neural/online voices > polished system voices > default.
// First match wins. Substrings case-insensitive against `voice.name`.
const PREFERRED_VOICE_PATTERNS = [
  // Apple neural / premium (iOS 17+, macOS Sonoma+)
  'Ava (Premium)', 'Ava (Enhanced)', 'Zoe (Premium)', 'Allison (Enhanced)',
  'Samantha (Enhanced)', 'Evan (Enhanced)', 'Tom (Enhanced)',
  // Microsoft Edge / Windows 11 online voices (highest quality)
  'Microsoft Aria Online', 'Microsoft Jenny Online', 'Microsoft Guy Online',
  'Microsoft Emma Online', 'Microsoft Ava Online', 'Microsoft Andrew Online',
  // Google Chrome / Android neural
  'Google US English', 'Google UK English Female', 'Google UK English Male',
  // Apple default polished
  'Samantha', 'Karen', 'Moira', 'Tessa', 'Daniel', 'Allison',
  // Generic neural keywords (in case browser exposes under different naming)
  'Natural', 'Neural', 'Premium', 'Enhanced', 'Online',
];

function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  // Prefer English voices first
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
  const pool = english.length > 0 ? english : voices;
  for (const pattern of PREFERRED_VOICE_PATTERNS) {
    const p = pattern.toLowerCase();
    const match = pool.find((v) => v.name.toLowerCase().includes(p));
    if (match) return match;
  }
  // Fall back to first non-default English voice
  return pool.find((v) => !v.default) ?? pool[0] ?? null;
}

const VOICE_PREF_KEY = 'recipecrave-voice-name';

export function VoiceCookMode({ title, servings, instructions }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const wakeLockRef = useRef<{ release: () => void } | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSupported('speechSynthesis' in window);
    if (!('speechSynthesis' in window)) return;
    // Voices load asynchronously — pick after `voiceschanged`.
    const refresh = () => {
      const voices = window.speechSynthesis.getVoices();
      const english = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
      setAvailableVoices(english.length > 0 ? english : voices);
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(VOICE_PREF_KEY) : null;
      const savedMatch = saved ? voices.find((v) => v.name === saved) : null;
      const picked = savedMatch ?? pickBestVoice(voices);
      voiceRef.current = picked;
      if (picked) setSelectedVoiceName(picked.name);
    };
    refresh();
    window.speechSynthesis.addEventListener('voiceschanged', refresh);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', refresh);
  }, []);

  function changeVoice(name: string) {
    const match = availableVoices.find((v) => v.name === name);
    if (!match) return;
    voiceRef.current = match;
    setSelectedVoiceName(name);
    if (typeof localStorage !== 'undefined') localStorage.setItem(VOICE_PREF_KEY, name);
    // Preview the chosen voice
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const preview = new SpeechSynthesisUtterance("Hello, I'll be your cooking assistant today.");
      preview.voice = match;
      preview.rate = 0.92;
      preview.pitch = 1.02;
      window.speechSynthesis.speak(preview);
    }
  }

  // Wake lock to keep screen on while cooking
  useEffect(() => {
    if (!open) return;
    const nav = typeof navigator !== 'undefined' ? navigator : null;
    if (!nav || !('wakeLock' in nav)) return;
    (async () => {
      try {
        const wakeLock = (nav as unknown as { wakeLock: { request: (type: string) => Promise<{ release: () => void }> } }).wakeLock;
        wakeLockRef.current = await wakeLock.request('screen');
      } catch {
        // user denied or unsupported, silently skip
      }
    })();
    return () => {
      wakeLockRef.current?.release?.();
      wakeLockRef.current = null;
    };
  }, [open]);

  function speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    // Soften phrasing for natural delivery: insert micro-pauses + lowercase 'Step N.'
    const natural = text
      .replace(/\bStep (\d+)\.\s*/i, 'Step $1, ')
      .replace(/\.\s+/g, '. ')
      .replace(/—/g, ',')
      .replace(/\bmin\b/g, 'minutes')
      .replace(/\btsp\b/g, 'teaspoon')
      .replace(/\btbsp\b/g, 'tablespoon');
    const utter = new SpeechSynthesisUtterance(natural);
    if (voiceRef.current) utter.voice = voiceRef.current;
    // Warmer, slower delivery — matches culinary-instructor cadence.
    utter.rate = 0.92;
    utter.pitch = 1.02;
    utter.volume = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }

  function stopSpeak() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }

  function goTo(idx: number) {
    const clamped = Math.max(0, Math.min(instructions.length - 1, idx));
    setStep(clamped);
    const text = instructions[clamped]?.text;
    if (text) speak(`Step ${clamped + 1}. ${text}`);
  }

  function next() { goTo(step + 1); }
  function prev() { goTo(step - 1); }
  function repeat() {
    const text = instructions[step]?.text;
    if (text) speak(`Step ${step + 1}. ${text}`);
  }

  function handleVoiceCommand(transcript: string) {
    const t = transcript.toLowerCase().trim();
    if (/(^|\s)(next|continue|advance|forward)\b/.test(t)) next();
    else if (/(^|\s)(back|previous|go back)\b/.test(t)) prev();
    else if (/(^|\s)(repeat|again|say again|one more time)\b/.test(t)) repeat();
    else if (/(^|\s)(pause|stop|wait)\b/.test(t)) stopSpeak();
    else if (/(^|\s)(start|begin|read)\b/.test(t)) repeat();
  }

  function toggleListening() {
    if (typeof window === 'undefined') return;
    const Recog = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recog) {
      alert('Voice commands are not supported in this browser. Use buttons or upgrade to Chrome/Edge.');
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const r = new Recog();
    r.continuous = true;
    r.interimResults = false;
    r.lang = 'en-US';
    r.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      const transcript = last?.[0]?.transcript ?? '';
      if (transcript) handleVoiceCommand(transcript);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    r.start();
    recognitionRef.current = r;
    setListening(true);
  }

  function openMode() {
    setStep(0);
    setOpen(true);
    setTimeout(() => {
      const first = instructions[0]?.text;
      if (first) speak(`Starting ${title}. Step 1. ${first}`);
    }, 250);
  }

  function closeMode() {
    stopSpeak();
    recognitionRef.current?.stop();
    setListening(false);
    setOpen(false);
  }

  if (!supported) {
    return (
      <Button variant="outline" size="sm" disabled title="Voice mode needs a modern browser">
        <Mic className="mr-1.5 h-4 w-4" /> Voice mode unavailable
      </Button>
    );
  }

  return (
    <>
      <Button variant="default" size="sm" onClick={openMode} id="cook">
        <Mic className="mr-1.5 h-4 w-4" /> Start Voice Cook
      </Button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Voice cook mode for ${title}`}
          className="fixed inset-0 z-50 flex flex-col bg-cream-100"
        >
          <div className="container flex h-16 items-center justify-between gap-3 border-b border-ink/10">
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wider text-terracotta-500">Voice Cook</p>
              <p className="truncate font-serif text-lg">{title}</p>
            </div>
            {availableVoices.length > 0 ? (
              <label className="hidden items-center gap-1.5 text-xs text-ink-muted sm:flex">
                <Volume2 className="h-3.5 w-3.5" aria-hidden />
                <select
                  value={selectedVoiceName}
                  onChange={(e) => changeVoice(e.target.value)}
                  className="max-w-[180px] rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-xs focus-ring"
                  aria-label="Choose voice"
                >
                  {availableVoices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name.length > 28 ? v.name.slice(0, 28) + '…' : v.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <button
              type="button"
              onClick={closeMode}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-muted shadow-sm focus-ring"
              aria-label="Exit voice cook mode"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="container flex flex-1 flex-col items-center justify-center py-8 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-ink-subtle">
              Step {step + 1} of {instructions.length} · {servings} servings
            </p>
            <p className="mt-6 max-w-2xl font-serif text-3xl leading-tight text-ink sm:text-4xl">
              {instructions[step]?.text}
            </p>
            {instructions[step]?.timerMin ? (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-4 py-2 text-sm text-terracotta-700">
                ⏱ {instructions[step]?.timerMin} minute timer suggested
              </p>
            ) : null}
          </div>

          <div className="border-t border-ink/10 bg-white py-5">
            <div className="container flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" size="lg" onClick={prev} disabled={step === 0}>
                <ChevronLeft className="mr-1 h-5 w-5" /> Back
              </Button>
              <Button variant="outline" size="lg" onClick={repeat}>
                <RotateCcw className="mr-1 h-5 w-5" /> Repeat
              </Button>
              {speaking ? (
                <Button variant="outline" size="lg" onClick={stopSpeak}>
                  <Pause className="mr-1 h-5 w-5" /> Pause
                </Button>
              ) : (
                <Button variant="outline" size="lg" onClick={repeat}>
                  <Play className="mr-1 h-5 w-5" /> Play
                </Button>
              )}
              <Button
                variant={listening ? 'secondary' : 'default'}
                size="lg"
                onClick={toggleListening}
                aria-pressed={listening}
              >
                {listening ? (
                  <>
                    <Volume2 className="mr-1 h-5 w-5 animate-pulse" /> Listening… (say next / back / repeat)
                  </>
                ) : (
                  <>
                    <MicOff className="mr-1 h-5 w-5" /> Tap to enable voice commands
                  </>
                )}
              </Button>
              <Button variant="default" size="lg" onClick={next} disabled={step === instructions.length - 1}>
                Next <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-ink-subtle">
              Commands: &ldquo;next&rdquo; · &ldquo;back&rdquo; · &ldquo;repeat&rdquo; · &ldquo;pause&rdquo;
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
