"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface TerminalLine {
  type: "command" | "output" | "welcome";
  content: string;
  timestamp?: string;
}

// Utility function to convert URLs in text to clickable links
function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text
    .split("\n")
    .map((line, i) =>
      line.split(urlRegex).map((part, j) => {
        if (urlRegex.test(part)) {
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
      })
    )
    .reduce((acc, curr, idx) => acc.concat(curr, <br key={`br-${idx}`} />), [])
    .slice(0, -1);
}

export default function TerminalPortfolio() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [suggestion, setSuggestion] = useState<string | null>(null);

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
      help     - Show available commands
      about    - Know more about me
      projects - View my projects
      skills   - See my technical skills
      contact  - Get my contact information
      education - View my educational background
      achievements - View my achievements
      clear    - Clear the terminal
      sudo     - Try it and see what happens!`,

    about: () =>
      `
Hi 👋, I'm Sai Vara Prasad Mandala — an adaptive developer from Hyderabad - India, passionate about building tech that makes life better. From 'enabling crowds to shape music together'  or 'transforming waste into opportunity', I love creating solutions that make a real-world difference.

(Wondering about ' ' rgt?? Let's just say my projects might surprise you 😉)

I hold a Bachelor's degree in Computer Science(AI & ML) from Keshav Memorial Engineering College, affiliated with Osmania University.
      
A passion for tech took me from mobile development to machine learning & AI. I found my niche in web development, where I constantly learn, build solutions, and innovate to create impactful experiences in the ever-evolving digital landscape.`,

    skills: () => `Technical Skills:

Programming Languages:
• Java (Intermediate)
• JavaScript (Intermediate)  
• TypeScript (Basic)

Tools:
• Postman
• Git & Github

Frontend Development:
• ReactJS (Intermediate)
• NextJS (Basic)
• TailwindCSS
• Shadcn/ui

Backend Development:
• NodeJS (Intermediate)
• ExpressJS (Intermediate)
• Prisma (Basic)

Databases:
• MongoDB (Intermediate)
• PostgreSQL (Basic)
• MySQL (Intermediate)`,

    projects: () => `Recent Projects:

1. Musivo - A Collaborative Music Platform
   • Where users can search Spotify songs, add to a shared queue, and vote for favorites. 
   • The most liked track plays next. 
   • Ideal for pubs,cafes, parties, and events with host-controlled playback.
   • GitHub: https://github.com/saivaraprasadmandala/Musivo
   • Live: https://musivo.builtforthis.tech/

2. Punarnavah - Transforming Waste into Oppurtunity (Selected for SIH IDE Bootcamp at NIT Goa)
   • A circular economy-driven platform linking households, artisans, and industries to promote waste reuse.
   • Enables artisans to source upcyclable materials, create upcycled products, and sell them online for income.
   • GitHub: https://github.com/saivaraprasadmandala/Punarnavah
   • Live: https://punarnavah.abhiramverse.tech/

3. Auditronix
   • Smart Contract auditing tool
   • GitHub: https://github.com/saivaraprasadmandala/auditronix-smart-contract-auditor
   • Live: https://auditronix-smart-contract-auditor.builtforthis.tech/

4. QrifyME
   • An event management system for real-time attendee tracking via location services
   • GitHub: https://github.com/saivaraprasadmandala/QRifyME
   • APK: https://drive.google.com/file/d/1KrCdgUeWulzSuOojyks1PtK5acpHuumN/view

5. DeepFake Detection
   • A DeepFake Detection Engine designed to identify the manipulated images
   • GitHub: https://github.com/saivaraprasadmandala/DeepFake-Detection
`,

    contact: () => `Get in Touch:

📧 Email: mandalasaivaraprasad@gmail.com
💼 LinkedIn: https://www.linkedin.com/in/saivaraprasadmandala/
🐱 GitHub: https://github.com/saivaraprasadmandala
🐦 Twitter/X: https://x.com/msvp2k04
📄 Resume: https://drive.google.com/file/d/1MHnMBnzMfdIbu_HVCMd5C3Q4KL-K1Wqh/view?usp=sharing

Feel free to reach out for collaboration opportunities!`,

    education: () => `Educational Background:

🎓 Bachelor of Engineering in Computer Science(AI & ML)
   Keshav Memorial Engineering College (Osmania University)
   CGPA: 7.7/10
   2021 - 2025
   Hyderabad, India

🏫 Intermediate
   Keshav Smarak Junior College (TSBIE)
   Percentage: 95.8%
   2019 - 2021
   Hyderabad, India

🏫 Class X
   Oxford Grammar High School (Himayathnagar)
   CGPA: 9.8/10
   2019
   Hyderabad, India
`,

    achievements: () => `Achievements:

🚀 SIH IDE Bootcamp - 2024
   • Participated in Innovation Design and Entrepreneurship (IDE) Bootcamp at NIT GOA organized by MIC, AICTE, and Wadhwani Foundation.
   • Delivered a compelling pitch with my team(Crafty Creators) for our business idea(Project Punarnavah) before a panel of jury members, garnering invaluable feedback.
   • Certificate: https://drive.google.com/file/d/15vfey1l3SPAV-Y4dNOlaJvvUpjw_-IAq/view?usp=sharing
   • Linkedln Post: https://www.linkedin.com/posts/saivaraprasadmandala_wadhwanifoundation-innovation-entrepreneurship-activity-7193283283072212992-o69N/

🏆 SMART INDIA HACKATHON - 2023
   • Finalists in Smart India Hackathon - 2023, conducted AICTE , MoE and Central Government of India.
   • Built a waste upcycling project "Resculpt"(Initial Version of Project Punarnavah).
   • Certificate: https://drive.google.com/file/d/16FvGZ8zWz3Bd7LN5Giuh9r_Uj3dXZsgi/view?usp=sharing
   • Linkedln Post: https://www.linkedin.com/posts/saivaraprasadmandala_sih2023-smartindiahackathon2023-kmec-activity-7145823852231602176-xlq3/
`,

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
    const welcomeMessage = `Welcome to my interactive portfolio terminal! haha!
    
Type 'help' to see available commands.
    
💡 Tip: Type a few letters and press Tab to auto-complete!`;

    setLines([
      {
        type: "welcome",
        content: "saivaraprasadmandala@portfolio:~$ welcome",
      },
      {
        type: "output",
        content: `Hi, I'm Sai Vara Prasad Mandala, a Frontend Developer.`,
      },
      { type: "output", content: "" },
      { type: "output", content: welcomeMessage },
    ]);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

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
    <div className="h-screen bg-[#2e3440] text-[#a3be8c] font-mono flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel - Profile (Fixed, No Scroll) */}
      <div className="w-full lg:w-1/3 xl:w-1/4 h-1/3 lg:h-full p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-[#b48ead] flex flex-col items-center bg-[#2e3440] overflow-hidden">
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
        <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 mb-3 lg:mb-6 border-2 border-[#b48ead] rounded-lg overflow-hidden bg-[#2e3440] flex-shrink-0">
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
            <p className="mb-1">🎓 Computer Science Student</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Terminal (Scrollable) */}
      <div className="flex-1 flex flex-col h-2/3 lg:h-full overflow-hidden">
        {/* Header - Commands */}
        <div className="border-b border-[#b48ead] p-2 lg:p-3 text-xs lg:text-sm bg-[#2e3440] flex-shrink-0 overflow-x-auto">
          <div className="whitespace-nowrap">
            <span className="text-[#a3be8c]">
              help | about | projects | skills | contact | education |
              achievements | sudo | clear
            </span>
          </div>
        </div>

        {/* Terminal Content (Scrollable Area) */}
        <div
          ref={terminalRef}
          className="flex-1 p-3 lg:p-4 overflow-y-auto cursor-text bg-[#2e3440] scrollbar-thin scrollbar-thumb-[#a3be8c] scrollbar-track-[#b48ead]"
          onClick={focusInput}
        >
          {lines.map((line, index) => (
            <div key={index} className="mb-1">
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

          {/* Current Input Line with Suggestion */}
          <div className="flex items-center mt-2">
            <span className="text-[#88c0d0] mr-2 flex-shrink-0 text-sm lg:text-base">
              saivaraprasadmandala@portfolio:~$
            </span>
            <div className="relative flex-1 min-w-0">
              {/* Background Suggestion (ghost text) */}
              {suggestion && suggestion.toLowerCase().startsWith(currentInput.toLowerCase()) && (
                <span
                  className="absolute left-0 top-0 text-[#e5f7ef] text-sm lg:text-base font-mono pointer-events-none select-none"
                  style={{
                    whiteSpace: 'pre',
                    zIndex: 1,
                  }}
                >
                  {suggestion.slice(currentInput.length)}
                </span>
              )}
              {/* User Input */}
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-[#a3be8c] font-mono text-sm lg:text-base w-full"
                style={{
                  position: "relative",
                  backgroundColor: "transparent",
                  zIndex: 2,
                  minWidth: "1ch",
                }}
                autoFocus
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#b48ead] p-2 text-xs text-[#b48ead] flex justify-between bg-[#2e3440] flex-shrink-0">
          <div className="flex items-center space-x-4">
            <span className="truncate">saivaraprasadmandala@portfolio:~$</span>
            {suggestion && (
              <span className="text-[#b48ead]">
                <span className="hidden sm:inline">
                  💡 Press Tab to complete "{suggestion}"
                </span>
                <span className="sm:hidden">💡 Tap suggestion to complete</span>
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
  );
}
