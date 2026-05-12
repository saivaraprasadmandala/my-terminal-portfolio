"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Mail, RefreshCw } from "lucide-react";
import { ErrorBoundary } from "@/components/error-boundary";
import { aboutContent } from "@/data/about";
import { skillsContent } from "@/data/skills";
import { projectsContent } from "@/data/projects";
import { contactContent } from "@/data/contact";
import { educationContent } from "@/data/education";
import { achievementsContent } from "@/data/achievements";
import { experienceContent } from "@/data/experience";
import { useAudio } from "@/components/ui/terminal";

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

const MOVIE_QUOTES = [
  `$ git commit -m "feat: looking for someone who commits — not just to main"`,
  `"The first rule of my code: you do not push to main on a Friday."`,
  `> 404: Sleep not found. Fueling with 😉🌝`,
  `> "It works on my machine" is a valid architectural pattern.`,
  `$ rm -rf node_modules && npm install && pray`,
  `> Debugging: Being the detective where you are also the murderer.`,
  `> I don't always test my code, but when I do, it's in production.`,
  `$ sudo make me a frontend developer`,
  `> Started as a vibe coder, now I actually read the docs. Character development.`,
  `> Transitioning from "it works, don't touch it" to "let me understand why".`,
  `$ npm install vibes --save-dev && npm run actual-learning`,
];


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
  const [isProfileFlipped, setIsProfileFlipped] = useState(false);
  const [showFlipTooltip, setShowFlipTooltip] = useState(false);
  const [hasFlippedOnce, setHasFlippedOnce] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasFlippedOnce) {
        setShowFlipTooltip(true);
      }
    }, 5000); // Wait 5 seconds before showing tooltip
    return () => clearTimeout(timer);
  }, [hasFlippedOnce]);

  const handleProfileFlip = () => {
    setIsProfileFlipped(!isProfileFlipped);
    if (!hasFlippedOnce) {
      setHasFlippedOnce(true);
      setShowFlipTooltip(false);
    }
  };
  const { down, up } = useAudio(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);

  // Rotate quotes
  useEffect(() => {
    const id = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOVIE_QUOTES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
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
      education    - My education
      achievements - My achievements
      contact      - Get my contact info
      sudo         - Try it ;)
      clear        - Clear the terminal`,
    
    // TODO: move these to a separate file later, getting too big tbh
    about: () => aboutContent,
    experience: () => experienceContent,
    projects: () => projectsContent,
    skills: () => skillsContent,
    education: () => educationContent,
    achievements: () => achievementsContent,
    contact: () => contactContent,

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
  // FIXME: this is kind of slow on older devices if we add too many commands
  // might need a debounce helper here later down the line if performance tanks
  const fetchAutocompleteSuggestion = (input: string): string | null => {
    if (!input.trim()) return null;

    const available_cmds = Object.keys(commands);
    const m = available_cmds.filter((cmd) =>
      cmd.toLowerCase().startsWith(input.toLowerCase())
    );

    // Return the first match that's different from current input
    // hacky way to prevent it from suggesting the exact word we just typed
    return (
      m.find((match) => match.toLowerCase() !== input.toLowerCase()) ||
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


    const bootLines = [
      { text: "portfolio-os v2.0 | Booting consciousness...", delay: 0 },
      { text: "BIOS   B.E. CSE '25 degree authenticated .. ✓\n", delay: 600 },
      { text: "CPU    CMD > CTRL (Surviving all day) ..... ✓", delay: 900 },
      { text: "DISK   6 projects, 2 internships, 0 regrets ✓", delay: 1300 },
      { text: "GPU    Can render film debates for hours .. ✓\n", delay: 1700 },
    ];

    const welcomeText = `Welcome! Type a command below to explore.
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
        { type: "welcome", content: "svp@portfolio:~$ welcome" },
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
    }, 2100);
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
        content: `svp@portfolio:~$ ${cmd}`,
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
    down(e.key);
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

  const handleKeyUp = (e: React.KeyboardEvent) => {
    up(e.key);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentInput(value);

    // Get suggestion based on current input
    const newSuggestion = fetchAutocompleteSuggestion(value);
    setSuggestion(newSuggestion);

    // Reset history navigation
    setHistoryIndex(-1);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <ErrorBoundary>
    <div className="h-screen bg-background text-primary font-mono flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel - Profile */}
      <div className="w-full lg:w-[360px] xl:w-[420px] lg:h-full p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-border bg-background/50 backdrop-blur-sm shrink-0 flex flex-col justify-start">
        <div className="flex flex-row items-center gap-4 sm:gap-6 lg:flex-col lg:gap-0 lg:items-center">
          {/* Profile Image with 3D Flip */}
          <div 
            className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-48 lg:h-48 lg:mb-6 flex-shrink-0 cursor-pointer group"
            style={{ perspective: '1000px' }}
            onClick={handleProfileFlip}
          >
            {/* Tooltip */}
            {showFlipTooltip && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary/10 text-primary border border-primary/30 px-3 py-1 text-[10px] rounded animate-bounce z-20 backdrop-blur-sm pointer-events-none transition-opacity duration-300">
                flip to reveal 😉
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-primary/30"></div>
              </div>
            )}
            
            {/* 3D Inner Container */}
            <div 
              className="w-full h-full transition-transform duration-700 ease-out relative"
              style={{ 
                transformStyle: 'preserve-3d', 
                transform: isProfileFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front side: "no pfp" image */}
              <div 
                className="absolute inset-0 w-full h-full border border-primary/40 rounded-full overflow-hidden bg-white hacker-border-glow shadow-[0_0_15px_rgba(0,245,212,0.2)]"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <Image
                  src="/flip-profile-pic.png"
                  alt="No pfp because you'll fall in love"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Back side: Actual profile image */}
              <div 
                className="absolute inset-0 w-full h-full border border-primary/40 rounded-full overflow-hidden bg-background/50 hacker-border-glow shadow-[0_0_15px_rgba(0,245,212,0.2)]"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <Image
                  src="/profile-zoomed.png"
                  alt="Mandala Sai Vara Prasad"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Always-visible Flip Indicator Icon */}
            <div className="absolute bottom-0 right-0 lg:bottom-2 lg:right-2 bg-background border border-primary/40 rounded-full p-1.5 text-primary hacker-glow shadow-[0_0_10px_rgba(0,245,212,0.3)] z-30 pointer-events-none group-hover:scale-110 transition-transform">
              <RefreshCw size={14} className="opacity-80" />
            </div>
          </div>

          {/* Name & Titles */}
          <div className="flex-1 lg:w-full lg:text-center min-w-0">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-primary hacker-glow leading-tight">
              Sai Vara Prasad Mandala
            </h1>
            <p className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-widest mt-0.5 lg:mt-1">
              Frontend Developer
            </p>
            <div className="mt-2 flex flex-col gap-1 text-[10px] lg:text-[11px] text-muted-foreground/70 lg:items-center">
              <span>ex-StartDate Technologies <span className="opacity-60">— Frontend Dev</span></span>
              <span>ex-LoomyLabs <span className="opacity-60">— Frontend Intern</span></span>
            </div>

            {/* Mobile-only compact info */}
            <div className="flex lg:hidden flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[10px] text-muted-foreground opacity-80">
              <span className="flex items-center truncate">📍 Hyderabad</span>
              <span className="flex items-center text-[#00F5D4] drop-shadow-[0_0_8px_rgba(0,245,212,0.6)] truncate">🟢 Open to roles</span>
            </div>
          </div>
        </div>

        {/* Info Cards - Desktop Only */}
        <div className="hidden lg:flex flex-col text-center text-xs lg:text-xs text-muted-foreground w-full mt-6 gap-6">
          <div className="space-y-1.5 transition-all duration-300">
            <p>📍 Hyderabad, India</p>
            <p className="text-[#00F5D4] drop-shadow-[0_0_8px_rgba(0,245,212,0.6)]">🟢 Open to opportunities</p>
          </div>


          {/* Social Links */}
          <div>
            <div className="flex justify-center gap-5">
              <a href="https://github.com/saivaraprasadmandala" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors hover:drop-shadow-[0_0_8px_rgba(0,245,212,0.8)]" title="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/saivaraprasadmandala/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors hover:drop-shadow-[0_0_8px_rgba(0,245,212,0.8)]" title="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://x.com/msvp2k04" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors hover:drop-shadow-[0_0_8px_rgba(0,245,212,0.8)]" title="Twitter / X">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="mailto:mandalasaivaraprasad@gmail.com" className="text-muted-foreground hover:text-primary transition-colors hover:drop-shadow-[0_0_8px_rgba(0,245,212,0.8)]" title="Email">
                <Mail size={22} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Quote Info */}
          <div className="border border-border p-3 rounded-lg bg-background/20 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hacker-border-glow">
            <div className="text-muted-foreground text-xs font-mono leading-relaxed opacity-90 break-words">
              <div key={quoteIndex} className="line-fade-in inline">
                <span className="text-accent">{MOVIE_QUOTES[quoteIndex]}</span>
              </div>
              <span
                className={`ml-1 inline-block w-1.5 h-3 bg-accent align-middle transition-opacity duration-100 ${
                  cursorOn ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Terminal (Scrollable) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* MacOS Terminal Style Top Bar */}
        <div className="border-b border-border/50 px-4 py-3 bg-background/90 backdrop-blur-md flex-shrink-0 flex items-center shadow-sm z-10 relative">
          <div className="flex gap-2 w-16 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="flex-1 text-center text-[10px] sm:text-xs text-muted-foreground font-mono font-medium opacity-80 select-none overflow-hidden whitespace-nowrap truncate">
            svp@portfolio - zsh
          </div>
          <div className="w-16 shrink-0"></div>
        </div>



        {/* Mobile-only disclaimer */}
        <div className="lg:hidden px-3 py-1.5 bg-background border-b border-border text-center">
          <p className="text-[10px] text-muted-foreground">
            You're checking me out on a phone 😒? fair, but I look better on a widescreen 💻 😉
          </p>
        </div>

        {/* Terminal Content (Scrollable Area) */}
        <div
          ref={terminalRef}
          className="flex-1 p-3 lg:p-4 overflow-y-auto cursor-text bg-background scrollbar-thin scrollbar-thumb-primary scrollbar-track-background"
          onClick={focusInput}
        >
          {lines.map((line, index) => (
            <div key={index} className="mb-1 line-fade-in">
              {line.type === "command" && (
                <div className="text-accent break-all text-sm lg:text-base">{line.content}</div>
              )}
              {line.type === "output" && (
                <div className="text-foreground whitespace-pre-wrap leading-relaxed text-sm lg:text-base break-words">
                  {linkify(line.content)}
                </div>
              )}
              {line.type === "welcome" && (
                <div className="text-accent break-all text-sm lg:text-base">{line.content}</div>
              )}
            </div>
          ))}

          {/* Typing animation display */}
          {isTyping && typingText && (
            <div className="mb-1">
              <div className="text-foreground whitespace-pre-wrap leading-relaxed text-sm lg:text-base break-words">
                {typingText}<span className="typing-cursor">&nbsp;</span>
              </div>
            </div>
          )}

          {/* Current Input Line with Ghost Suggestion */}
          <div className="flex items-center mt-2 flex-wrap">
            <span className="text-accent mr-2 flex-shrink-0 text-sm lg:text-base">
              svp@portfolio:~$
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
                  <span className="invisible whitespace-pre">{currentInput}</span>
                  {/* Visible ghost remainder */}
                  <span className="text-accent opacity-50 whitespace-pre">
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
                onKeyUp={handleKeyUp}
                className="absolute inset-0 bg-transparent border-none outline-none text-primary font-mono text-sm lg:text-base w-full caret-transparent p-0 m-0 leading-6 lg:leading-7 h-full"
                style={{ zIndex: 2 }}
                autoFocus
              />
              {/* Blinking cursor - positioned using invisible text measurement */}
              <div
                className="absolute inset-0 pointer-events-none flex items-center p-0 m-0 leading-6 lg:leading-7"
                style={{ zIndex: 3 }}
                aria-hidden="true"
              >
                <span className="invisible whitespace-pre font-mono text-sm lg:text-base">{currentInput}</span>
                <span className="terminal-cursor text-primary text-sm lg:text-base">▌</span>
              </div>
            </div>
          </div>

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="border-t border-border p-2 text-xs text-muted-foreground flex justify-between bg-background flex-shrink-0">
          <div className="flex items-center space-x-2 lg:space-x-4 min-w-0 flex-1">
            <span className="truncate">svp@portfolio:~$</span>
            {suggestion && (
              <span 
                className="text-muted-foreground truncate cursor-pointer hover:text-primary transition-colors"
                onClick={(e) => { e.preventDefault(); acceptSuggestion(); focusInput(); }}
                title="Click to auto-complete"
              >
                <span className="hidden sm:inline">
                  💡 Press Tab, →, or click to complete "{suggestion}"
                </span>
                <span className="sm:hidden">💡 Tap here: {suggestion}</span>
              </span>
            )}
          </div>
          <div className="text-right flex-shrink-0 ml-2 flex items-center gap-1.5 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse"></span>
            <span className="hidden sm:inline">SESSION_ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}