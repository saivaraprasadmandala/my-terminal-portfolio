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
  return text.split('\n').map((line, i) =>
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
  ).reduce((acc, curr, idx) => acc.concat(curr, <br key={`br-${idx}`} />), []).slice(0, -1);
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
      about    - Learn more about me
      projects - View my projects
      skills   - See my technical skills
      experience - View my work experience
      contact  - Get my contact information
      education - View my educational background
      achievements - View my achievements
      clear    - Clear the terminal
      sudo     - Try it and see what happens!`,

    about:
      () => 
`Hi 👋, I'm Jaini Sai Abhiram — a curious and driven technologist based in Hyderabad, India. I thrive on turning ideas into reality through clean, impactful code.

Currently, I'm working as a DevOps Engineer Intern at Copart India Technology Center, where I'm gaining hands-on experience in infrastructure automation and system reliability.
      
I hold a Bachelor's degree in Computer Science from Keshav Memorial Engineering College, affiliated with Osmania University.
      
Throughout my journey, I've explored mobile development, machine learning, AI, and deep learning — driven by a deep curiosity to understand the breadth of modern tech. This exploration eventually led me to find my true passion in web development, DevOps, and Web3 — areas where I continue to learn, build, and innovate.`,

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
• Drizzle (Basic)
• tRPC (Basic)

Databases:
• MongoDB (Intermediate)
• PostgreSQL (Basic)
• MySQL (Intermediate)

DevOps & Tools:
• Docker (Intermediate)
• AWS (Basics)
• CI/CD using github actions(Basics)
• Nginx for reverse proxy`,
    projects: () => `Recent Projects:

1. Interactify
   • Interactive web application
   • GitHub: https://github.com/saiabhiramjaini/Interactify
   • Live: https://interactify.abhiramverse.tech/

2. Punarnavah
   • Waste upcycling project (SIH 2023 Finalist)
   • GitHub: https://github.com/saiabhiramjaini/punarnavah
   • Live: https://punarnavah.abhiramverse.tech/

3. Tellus
   • Social media management platform
   • GitHub: https://github.com/saiabhiramjaini/tellus
   • Live: https://tellus.abhiramverse.tech/

4. PhisX Chrome Extension
   • Phishing detection extension
   • GitHub: https://github.com/saiabhiramjaini/PhisX-Chrome-Extension
   • Chrome Store: https://chromewebstore.google.com/detail/phisx/jnbmnebokpebcplhgcmgleinlmmplfal

5. OU Results Extractor
   • University results extraction tool
   • GitHub: https://github.com/saiabhiramjaini/ou-results-extractor
   • Live: https://ou-results-extractor.vercel.app/

6. Zerodha MCP
   • Trading platform integration
   • GitHub: https://github.com/saiabhiramjaini/Zerodha-MCP
   • Demo: https://www.youtube.com/watch?v=vM4YNmw0oMw

7. QrifyME
   • QR code generator and scanner mobile app
   • GitHub: https://github.com/saiabhiramjaini/QRify_ME
   • APK: https://drive.google.com/file/d/1KrCdgUeWulzSuOojyks1PtK5acpHuumN/view

8. Doc Summarization
   • Multiple document summarization and chatbot using LLAMA2
   • GitHub: https://github.com/saiabhiramjaini/Multiple-Document-summarization-and-chatbot-using-LLAMA2

9. Image Encryption
   • Image Encryption Algorithm Based On Genetic Central Dogma
   • GitHub: https://github.com/saiabhiramjaini/Image-Encryption-Algorithm-Based-On-Genetic-Central-Dogma
   • Live Demo: https://image-encryption-algorithm-based-on-genetic-central-dogma-ch.streamlit.app/
`,

    experience: () => `Work Experience (Latest First):

DevOps Engineer
Copart India Technology Center · Internship
Jul 2025 - Present · Hyderabad, Telangana, India · Hybrid

Full Stack Developer Intern
SiteUp · Internship
Mar 2025 - Jun 2025 · Remote
- Built the full-stack of the "iKnowBrains" project using Next.js, tRPC, and Drizzle ORM with a PostgreSQL database.
- Developed the backend for the "Scorely" project using Node.js and Prisma ORM with a PostgreSQL database.

Full Stack Developer
GrafixUI · Internship
Jul 2024 - Jul 2024 · Hyderabad, Telangana, India · Remote
- Developed the frontend for a web application named "Social Compass" that manages businesses on social media platforms.
- The UI includes various business-related analytics that help users manage their businesses online.
- Utilized ReactJS, TailwindCSS, Redux.

SMART INDIA HACKATHON 2023 - Finalist
- 36-hour hackathon by Government of India
- Built waste upcycling project "Resculpt"
- Tech Stack: ReactJS, TypeScript, NodeJS, ExpressJS, Prisma, PostgreSQL

Freelancer
- Website for Varun Reddy Foods (Sweet shop in Hyderabad) - MERN Stack
- E-commerce website for caps business - MERN Stack
- Multiple client projects with full-stack development
`,

    contact: () => `Get in Touch:

📧 Email: abhiramjaini28@gmail.com
💼 LinkedIn: https://www.linkedin.com/in/sai-abhiram-jaini/
🐱 GitHub: https://github.com/saiabhiramjaini
🐦 Twitter/X: https://x.com/Abhiram2k03
📄 Resume: https://drive.google.com/file/d/1xJDUdLQuW02MrR4jJJKYwN7iz9TwkUST/view?usp=sharing

Feel free to reach out for collaboration opportunities!`,

    education: () => `Educational Background:

🎓 Bachelor of Engineering in Computer Science
   Keshav Memorial Engineering College (Osmania University)
   CGPA: 8.0/10
   2021 - 2025
   Hyderabad, India

🏫 Intermediate
   Keshav Smarak Junior College (TSBIE)
   Percentage: 97.8%
   2019 - 2021
   Hyderabad, India

🏫 Class X
   Gowtham Model School (Dilsukhnagar)
   CGPA: 9.7/10
   2019
   Hyderabad, India
`,

    achievements: () => `Achievements:

🏆 SMART INDIA HACKATHON - 2023
   • Finalists in Smart India Hackathon - 2023, conducted by Government of India.
   • Built a waste upcycling project "Resculpt".
   • Certificate: https://drive.google.com/file/d/1tBYlxePgsKYMScXd0KgNiFl65A5ZXrGZ/view?usp=sharing

🚀 IDE Bootcamp - 2024
   • Participated in Innovation Design and Entrepreneurship (IDE) Bootcamp.
   • Delivered a compelling pitch for a business idea before a panel of jury members, garnering invaluable feedback.
   • Certificate: https://drive.google.com/file/d/1F-w0FBbm0NNsS8jO-k_WV0wHrkgah1sG/view?usp=sharing
`,

    sudo: () => `[sudo] password for abhiram: 
Sorry, try again.
[sudo] password for abhiram: 
Sorry, try again.
[sudo] password for abhiram: 
sudo: 3 incorrect password attempts

Nice try! 😄 But you don't have sudo access to my portfolio.`,

    clear: () => "CLEAR_TERMINAL",
  };

  useEffect(() => {
    const welcomeMessage = `Welcome to my interactive portfolio terminal! haha!
Type 'help' to see available commands.`;

    setLines([
      { type: "welcome", content: "abhiram@portfolio:~$ welcome" },
      {
        type: "output",
        content: `Hi, I'm Jaini Sai Abhiram, a Full Stack Developer & DevOps Engineer.`,
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
        content: `abhiram@portfolio:~$ ${cmd}`,
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
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(currentInput);
      setCurrentInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="h-screen bg-black text-green-400 font-mono flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel - Profile (Fixed, No Scroll) */}
      <div className="w-full lg:w-1/3 xl:w-1/4 h-1/3 lg:h-full p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-green-800 flex flex-col items-center bg-black overflow-hidden">
        {/* Header Section */}
        <div className="mb-3 lg:mb-4 text-center flex-shrink-0">
          <h1 className="text-lg lg:text-xl font-bold text-green-300 truncate">
            Jaini Sai Abhiram
          </h1>
          <p className="text-xs lg:text-sm text-green-600">
            Tech Enthusiatic
          </p>
        </div>

        {/* Profile Image */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 mb-3 lg:mb-6 border-2 border-green-800 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
          <Image
            src="/profile.png"
            alt="Jaini Sai Abhiram"
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Cards - Scrollable on mobile, fixed on desktop */}
        <div className="text-center text-xs lg:text-xs text-green-600 space-y-2 lg:space-y-3 flex-1 lg:flex-initial overflow-y-auto lg:overflow-visible w-full">
          {/* Location & Status */}
          <div className="border border-green-800 p-2 lg:p-3 rounded bg-gray-900 bg-opacity-20">
          <p className="mb-1">🧳 DevOps Engineer Intern @Copart</p>
            <p className="mb-1">📍 Hyderabad, India</p>
            <p className="mb-1">🎓 Computer Science Student</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Terminal (Scrollable) */}
      <div className="flex-1 flex flex-col h-2/3 lg:h-full overflow-hidden">
        {/* Header - Commands */}
        <div className="border-b border-green-800 p-2 lg:p-3 text-xs lg:text-sm bg-black flex-shrink-0 overflow-x-auto">
          <div className="whitespace-nowrap">
            <span className="text-green-300">
              help | about | projects | skills | experience | contact |
              education | achievements | sudo | clear
            </span>
          </div>
        </div>

        {/* Terminal Content (Scrollable Area) */}
        <div
          ref={terminalRef}
          className="flex-1 p-3 lg:p-4 overflow-y-auto cursor-text bg-black scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-900"
          onClick={focusInput}
        >
          {lines.map((line, index) => (
            <div key={index} className="mb-1">
              {line.type === "command" && (
                <div className="text-blue-400 break-all">{line.content}</div>
              )}
              {line.type === "output" && (
                <div className="text-white whitespace-pre-wrap leading-relaxed text-sm lg:text-base break-words">
                  {linkify(line.content)}
                </div>
              )}
              {line.type === "welcome" && (
                <div className="text-blue-400 break-all">{line.content}</div>
              )}
            </div>
          ))}

          {/* Current Input Line */}
          <div className="flex items-center mt-2">
            <span className="text-blue-400 mr-2 flex-shrink-0 text-sm lg:text-base">
              abhiram@portfolio:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none text-green-400 flex-1 font-mono text-sm lg:text-base min-w-0"
              autoFocus
            />
            <span className="animate-pulse text-green-400 flex-shrink-0">
              █
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-green-800 p-2 text-xs text-green-600 flex justify-between bg-black flex-shrink-0">
          <span className="truncate">abhiram@portfolio:~$</span>
          <span className="text-right flex-shrink-0 ml-2">
            <span className="hidden sm:inline">{date} </span>
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}
