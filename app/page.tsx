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
  const { down, up } = useAudio(true);

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
      { text: "Running hardware diagnostics...\n", delay: 600 },
      { text: "CPU    CMD > CTRL (Surviving all day) . ✓", delay: 900 },
      { text: "DISK   6 projects, 0 regrets .......... ✓", delay: 1300 },
      { text: "GPU    Can render film debates for hours. ✓\n", delay: 1700 },
      { text: randomQuote + "\n", delay: 2100 },
      { text: `Last login: ${loginDate} on ttys000`, delay: 2500 },
    ];

    const welcomeText = `Welcome! Type a command or click one from the top menu.
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
    }, 2900);
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
    <div className="h-screen bg-background text-primary font-mono flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel - Profile */}
      <div className="w-full lg:w-1/3 xl:w-1/4 lg:h-full p-3 lg:p-6 border-b lg:border-b-0 lg:border-r border-border bg-background/50 backdrop-blur-sm shrink-0 flex flex-col justify-center lg:justify-start">
        <div className="flex flex-row items-center gap-4 sm:gap-6 lg:flex-col lg:gap-0 lg:items-center">
          {/* Profile Image */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-48 lg:h-48 lg:mb-6 border border-primary/40 rounded-lg overflow-hidden bg-background/50 flex-shrink-0 hacker-border-glow">
            <Image
              src="/profile.jpeg"
              alt="Mandala Sai Vara Prasad"
              width={200}
              height={200}
              className="w-full h-full object-cover object-[center_10%]"
            />
          </div>

          {/* Name & Titles */}
          <div className="flex-1 lg:w-full lg:text-center min-w-0">
            <h1 className="text-sm sm:text-base lg:text-xl font-bold text-primary hacker-glow truncate">
              Sai Vara Prasad Mandala
            </h1>
            <p className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-widest mt-0.5 lg:mt-1">
              Frontend Developer
            </p>

            {/* Mobile-only compact info */}
            <div className="flex lg:hidden flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[10px] text-muted-foreground opacity-80">
              <span className="flex items-center truncate">📍 Hyderabad</span>
              <span className="flex items-center truncate">🎓 B.E. CS '25</span>
              <span className="flex items-center text-[#00F5D4] drop-shadow-[0_0_8px_rgba(0,245,212,0.6)] truncate">🟢 Open to roles</span>
            </div>
          </div>
        </div>

        {/* Info Cards - Desktop Only */}
        <div className="hidden lg:block text-center text-xs lg:text-xs text-muted-foreground space-y-3 mt-2 w-full">
          <div className="border border-border p-3 rounded-lg bg-background/20 backdrop-blur-sm transition-all duration-300 hover:border-primary/30">
            <p className="mb-1">📍 Hyderabad, India</p>
            <p className="mb-1">🎓 B.E. in CS (AI & ML) '25</p>
            <p className="mb-1 text-[#00F5D4] drop-shadow-[0_0_8px_rgba(0,245,212,0.6)]">🟢 Open to opportunities</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Terminal (Scrollable) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header - Clickable Commands with Bracket Affordance */}
        <div className="border-b border-border px-2 py-2 lg:px-3 lg:py-2 bg-background/80 backdrop-blur-md flex-shrink-0 overflow-x-auto">
          <div className="flex items-center whitespace-nowrap gap-2 lg:gap-3">
            {Object.keys(commands).map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleCommand(cmd)}
                className="px-2 py-1 text-xs lg:text-sm text-primary transition-all duration-300 cursor-pointer border-b border-transparent hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_10px_rgba(0,245,212,0.2)] rounded-sm opacity-80 hover:opacity-100"
              >
                [{cmd}]
              </button>
            ))}
          </div>
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
                <div className="text-accent break-all">{line.content}</div>
              )}
              {line.type === "output" && (
                <div className="text-foreground whitespace-pre-wrap leading-relaxed text-sm lg:text-base break-words">
                  {linkify(line.content)}
                </div>
              )}
              {line.type === "welcome" && (
                <div className="text-accent break-all">{line.content}</div>
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