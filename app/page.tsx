"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ErrorBoundary } from "@/components/error-boundary";
import { aboutContent } from "@/data/about";
import { skillsContent } from "@/data/skills";
import { projectsContent } from "@/data/projects";
import { contactContent } from "@/data/contact";
import { educationContent } from "@/data/education";
import { achievementsContent } from "@/data/achievements";
import { experienceContent } from "@/data/experience";

interface TerminalLine {
  type: "command" | "output" | "welcome";
  content: string;
  timestamp?: string;
}

// Utility function to convert URLs in text to clickable links
function linkify(text: string) {
  const URL_PATTERN = /(https?:\/\/[^\s]+)/;

  return text.split("\n").flatMap((line, i, arr) => {
    const parts = line.split(URL_PATTERN).map((part, j) => {
      if (URL_PATTERN.test(part)) {
        return (
          <a
            key={`link-${i}-${j}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-400 hover:text-blue-300 break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });

    // Add <br /> between lines, but not after the last one
    return i < arr.length - 1
      ? [...parts, <br key={`br-${i}`} />]
      : parts;
  });
}

export default function TerminalPortfolio() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(true);
  const [typingText, setTypingText] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const soundEnabledRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Mechanical keyboard "thock" — two-component synthesis
  const playClick = useCallback(() => {
    if (!soundEnabledRef.current) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Slight random variation per keypress for natural feel
    const v = 0.9 + Math.random() * 0.2;

    // Component 1: Sharp click (filtered noise burst)
    const bufSize = Math.floor(ctx.sampleRate * 0.02);
    const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 8);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const hiPass = ctx.createBiquadFilter();
    hiPass.type = "highpass";
    hiPass.frequency.value = 2000;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06 * v, now);
    noise.connect(hiPass);
    hiPass.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.02);

    // Component 2: Low "thock" resonance
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150 * v, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.06);
    oscGain.gain.setValueAtTime(0.04 * v, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDate(now.toLocaleDateString());
      setTime(now.toLocaleTimeString());
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const commands = {
    help: () => `Available commands:
      help         - Show commands
      about        - Know more about me
      experience   - My work experience
      projects     - View my projects
      skills       - My technical skills
      contact      - Get my contact info
      education    - My education
      achievements - My achievements
      clear        - Clear the terminal
      sudo         - Try it ;)`,

    about: () => aboutContent,
    skills: () => skillsContent,
    projects: () => projectsContent,
    contact: () => contactContent,
    education: () => educationContent,
    achievements: () => achievementsContent,
    experience: () => experienceContent,

    sudo: () => `[sudo] password for saivaraprasadmandala: 
Sorry, try again.
[sudo] password for saivaraprasadmandala: 
Sorry, try again.
[sudo] password for saivaraprasadmandala: 
sudo: 3 incorrect password attempts

Nice try! 😆😅😉 But you don't have sudo access to my portfolio.`,

    clear: () => "CLEAR_TERMINAL",
  };

  // Function to get suggestion based on current input
  const getSuggestion = (input: string): string | null => {
    if (!input.trim()) return null;

    const availableCommands = Object.keys(commands);
    const matches = availableCommands.filter((cmd) =>
      cmd.toLowerCase().startsWith(input.toLowerCase())
    );

    // Return the first match that's different from current input
    return (
      matches.find((match) => match.toLowerCase() !== input.toLowerCase()) ||
      null
    );
  };

  // Function to accept suggestion
  const acceptSuggestion = () => {
    if (suggestion) {
      setCurrentInput(suggestion);
      setSuggestion(null);
    }
  };

  useEffect(() => {
    const movieQuotes = [
      `$ git commit -m "feat: looking for someone who commits — not just to main"`,
      `"The first rule of this terminal: you do not leave without typing a command."`,
      `"The first rule of my code: you do not push to main on a Friday."`,
      `"The first rule of this portfolio: you do not just scroll — you type."`,
    ];
    const randomQuote = movieQuotes[Math.floor(Math.random() * movieQuotes.length)];

    const now = new Date();
    const loginDate = now.toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });

    const bootLines = [
      { text: "portfolio-os v2.0 | Darwin ARM64", delay: 0 },
      { text: "(c) 2025 Sai Vara Prasad Mandala\n", delay: 200 },
      { text: "Running hardware diagnostics...\n", delay: 600 },
      { text: "CPU    Apple-flavored brain ........... ✓", delay: 900 },
      { text: "DISK   6 projects, 0 regrets .......... ✓", delay: 1300 },
      { text: "CODEC  Can debate films for hours ..... ✓\n", delay: 1700 },
      { text: "[  ★  ] Mounting /Users/saivaraprasad", delay: 2100 },
      { text: "[  ★  ] Starting Terminal.app", delay: 2400 },
      { text: "[  ★  ] Loading portfolio data", delay: 2700 },
      { text: "[  ★  ] System ready\n", delay: 3000 },
      { text: randomQuote + "\n", delay: 3400 },
      { text: `Last login: ${loginDate} on ttys000`, delay: 3800 },
    ];

    const welcomeText = `Welcome! Type 'help' to see available commands.
💡 Tip: Type a few letters and press Tab to auto-complete!`;

    setLines([]);
    setIsTyping(true);
    setTypingText("");

    const timeouts: NodeJS.Timeout[] = [];

    // Show boot lines one by one
    bootLines.forEach(({ text, delay }) => {
      const t = setTimeout(() => {
        setLines(prev => [...prev, { type: "output", content: text }]);
      }, delay);
      timeouts.push(t);
    });

    // After boot, show welcome with typing animation
    const welcomeTimeout = setTimeout(() => {
      setLines(prev => [
        ...prev,
        { type: "welcome", content: "saivaraprasadmandala@portfolio:~$ welcome" },
      ]);

      let charIndex = 0;
      setTypingText("");

      const typingInterval = setInterval(() => {
        if (charIndex < welcomeText.length) {
          setTypingText(welcomeText.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setTypingText("");
          setLines(prev => [
            ...prev,
            { type: "output", content: welcomeText },
          ]);
        }
      }, 20);

      timeouts.push(typingInterval as unknown as NodeJS.Timeout);
    }, 4200);
    timeouts.push(welcomeTimeout);

    return () => timeouts.forEach(t => clearTimeout(t));
  }, []);

  // Smooth scroll to bottom when new lines are added
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, typingText]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const timestamp = new Date().toLocaleTimeString();

    setLines((prev) => [
      ...prev,
      {
        type: "command",
        content: `saivaraprasadmandala@portfolio:~$ ${cmd}`,
        timestamp,
      },
    ]);

    if (trimmedCmd === "clear") {
      setLines([]);
      return;
    }

    if (commands[trimmedCmd as keyof typeof commands]) {
      const output = commands[trimmedCmd as keyof typeof commands]();
      if (output === "CLEAR_TERMINAL") {
        setLines([]);
      } else {
        setLines((prev) => [...prev, { type: "output", content: output }]);
      }
    } else if (trimmedCmd === "") {
      // Do nothing for empty command
    } else {
      setLines((prev) => [
        ...prev,
        {
          type: "output",
          content: `Command not found: ${cmd}. Type 'help' for available commands.`,
        },
      ]);
    }

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setSuggestion(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    playClick();
    if (e.key === "Enter") {
      handleCommand(currentInput);
      setCurrentInput("");
      setSuggestion(null);
    } else if (e.key === "Tab") {
      e.preventDefault();
      acceptSuggestion();
    } else if (e.key === "Escape") {
      setSuggestion(null);
    } else if (e.key === "ArrowRight" && suggestion) {
      e.preventDefault();
      acceptSuggestion();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
        setSuggestion(null);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
        setSuggestion(null);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentInput(value);

    // Get suggestion based on current input
    const newSuggestion = getSuggestion(value);
    setSuggestion(newSuggestion);

    // Reset history navigation
    setHistoryIndex(-1);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <ErrorBoundary>
    <div className="h-screen bg-[#2e3440] text-[#a3be8c] font-mono flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel - Profile (Fixed, No Scroll) */}
      <div className="w-full lg:w-1/3 xl:w-1/4 lg:h-full p-3 lg:p-6 border-b lg:border-b-0 lg:border-r border-[#b48ead] flex flex-col items-center bg-[#2e3440] shrink-0">
        {/* Header Section */}
        <div className="mb-3 lg:mb-4 text-center flex-shrink-0">
          <h1 className="text-lg lg:text-xl font-bold text-[#a3be8c] truncate">
            Sai Vara Prasad Mandala
          </h1>
          <p className="text-xs lg:text-sm text-[#b48ead]">
            Frontend Developer
          </p>
        </div>

        {/* Profile Image */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-48 lg:h-48 mb-2 lg:mb-6 border-2 border-[#b48ead] rounded-lg overflow-hidden bg-[#2e3440] flex-shrink-0">
          <Image
            src="/profile.jpeg"
            alt="Mandala Sai Vara Prasad"
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Cards - Scrollable on mobile, fixed on desktop */}
        <div className="text-center text-xs lg:text-xs text-[#b48ead] space-y-2 lg:space-y-3 flex-1 lg:flex-initial overflow-y-auto lg:overflow-visible w-full">
          {/* Location & Status */}
          <div className="border border-[#b48ead] p-2 lg:p-3 rounded bg-[#2e3440] bg-opacity-20">
            <p className="mb-1">📍 Hyderabad, India</p>
            <p className="mb-1">🎓 B.E. in CS (AI & ML) '25</p>
            <p className="mb-1">🟢 Open to opportunities</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Terminal (Scrollable) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header - Clickable Commands with Pipe Separators */}
        <div className="border-b border-[#b48ead] px-2 py-1.5 lg:px-3 lg:py-2 bg-[#2e3440] flex-shrink-0 overflow-x-auto">
          <div className="flex items-center whitespace-nowrap">
            {/* Sound toggle */}
            <button
              onClick={() => { setSoundEnabled(prev => !prev); inputRef.current?.focus(); }}
              className="px-1.5 py-0.5 lg:px-2 lg:py-1 text-xs lg:text-sm text-[#b48ead] border border-transparent rounded hover:border-[#b48ead] hover:bg-[#b48ead]/10 transition-all duration-150 cursor-pointer mr-1 flex-shrink-0"
              title={soundEnabled ? "Mute keypress sounds" : "Enable keypress sounds"}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
            <span className="text-[#b48ead] text-xs mx-0.5 select-none">│</span>
            {Object.keys(commands).map((cmd, index, arr) => (
              <span key={cmd} className="flex items-center">
                <button
                  onClick={() => handleCommand(cmd)}
                  className="px-1.5 py-0.5 lg:px-2 lg:py-1 text-xs lg:text-sm text-[#a3be8c] border border-transparent rounded hover:border-[#a3be8c] hover:bg-[#a3be8c]/10 active:bg-[#a3be8c]/20 transition-all duration-150 cursor-pointer"
                >
                  {cmd}
                </button>
                {index < arr.length - 1 && (
                  <span className="text-[#a3be8c] text-xs mx-0.5 select-none">|</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Mobile-only disclaimer */}
        <div className="lg:hidden px-3 py-1.5 bg-[#2e3440] border-b border-[#b48ead] text-center">
          <p className="text-[10px] text-[#d8dee9] opacity-70">
            you're checking me out on a phone 😒? fair, but I look better on a widescreen 💻 😉
          </p>
        </div>

        {/* Terminal Content (Scrollable Area) */}
        <div
          ref={terminalRef}
          className="flex-1 p-3 lg:p-4 overflow-y-auto cursor-text bg-[#2e3440] scrollbar-thin scrollbar-thumb-[#a3be8c] scrollbar-track-[#b48ead]"
          onClick={focusInput}
        >
          {lines.map((line, index) => (
            <div key={index} className="mb-1 line-fade-in">
              {line.type === "command" && (
                <div className="text-[#88c0d0] break-all">{line.content}</div>
              )}
              {line.type === "output" && (
                <div className="text-[#eceff4] whitespace-pre-wrap leading-relaxed text-sm lg:text-base break-words">
                  {linkify(line.content)}
                </div>
              )}
              {line.type === "welcome" && (
                <div className="text-[#88c0d0] break-all">{line.content}</div>
              )}
            </div>
          ))}

          {/* Typing animation display */}
          {isTyping && typingText && (
            <div className="mb-1">
              <div className="text-[#eceff4] whitespace-pre-wrap leading-relaxed text-sm lg:text-base break-words">
                {typingText}<span className="typing-cursor">&nbsp;</span>
              </div>
            </div>
          )}

          {/* Current Input Line with Ghost Suggestion */}
          <div className="flex items-center mt-2 flex-wrap">
            <span className="text-[#88c0d0] mr-2 flex-shrink-0 text-sm lg:text-base">
              saivaraprasadmandala@portfolio:~$
            </span>
            <div className="flex-1 min-w-0 relative h-6 lg:h-7">
              {/* Ghost Suggestion - full overlay behind input */}
              {suggestion && currentInput && suggestion.toLowerCase().startsWith(currentInput.toLowerCase()) && (
                <div
                  className="absolute inset-0 font-mono text-sm lg:text-base pointer-events-none whitespace-nowrap flex items-center p-0 m-0 leading-6 lg:leading-7"
                  style={{ zIndex: 1 }}
                  aria-hidden="true"
                >
                  {/* Invisible portion matching typed text */}
                  <span className="invisible">{currentInput}</span>
                  {/* Visible ghost remainder */}
                  <span className="text-[#88c0d0] opacity-50">
                    {suggestion.slice(currentInput.length)}
                  </span>
                </div>
              )}
              {/* User Input */}
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 bg-transparent border-none outline-none text-[#a3be8c] font-mono text-sm lg:text-base w-full caret-transparent p-0 m-0 leading-6 lg:leading-7 h-full"
                style={{ zIndex: 2 }}
                autoFocus
              />
              {/* Blinking cursor - positioned using invisible text measurement */}
              <div
                className="absolute inset-0 pointer-events-none flex items-center p-0 m-0 leading-6 lg:leading-7"
                style={{ zIndex: 3 }}
                aria-hidden="true"
              >
                <span className="invisible font-mono text-sm lg:text-base">{currentInput}</span>
                <span className="terminal-cursor text-[#a3be8c] text-sm lg:text-base">▌</span>
              </div>
            </div>
          </div>

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="border-t border-[#b48ead] p-2 text-xs text-[#b48ead] flex justify-between bg-[#2e3440] flex-shrink-0">
          <div className="flex items-center space-x-2 lg:space-x-4 min-w-0 flex-1">
            <span className="truncate">saivaraprasadmandala@portfolio:~$</span>
            {suggestion && (
              <span className="text-[#b48ead] truncate">
                <span className="hidden sm:inline">
                  💡 Press Tab or → to complete "{suggestion}"
                </span>
                <span className="sm:hidden">💡 Tab: {suggestion}</span>
              </span>
            )}
          </div>
          <span className="text-right flex-shrink-0 ml-2">
            <span className="hidden sm:inline">{date} </span>
            {time}
          </span>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}