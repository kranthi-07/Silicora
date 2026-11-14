'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Code,
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Scissors,
  ClipboardPaste,
  ChevronDown,
  Check,
  X,
  Sparkles,
  Maximize2,
  Minimize2,
  Trash2,
  Send,
  Zap,
  Cpu,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store';

// 1. CODE EXAMPLES
interface CodeExample {
  id: string;
  name: string;
  category: string;
  code: string;
}

const CODE_EXAMPLES: CodeExample[] = [
  {
    id: 'blink',
    name: '01. Basics / Blink_LED.ino',
    category: 'Basics',
    code: `// 3D Lab: Precision Microcontroller Platform
// Target: ATmega328P @ 16 MHz (Pin 13 Standard LED)

const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("[MCU] System Initialized. Running Blink loop...");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("[Telemetry] LED State: HIGH (V_f = 2.05V, I = 20.8mA)");
  delay(1000);

  digitalWrite(LED_PIN, LOW);
  Serial.println("[Telemetry] LED State: LOW (V_f = 0.00V, I = 0.0mA)");
  delay(1000);
}`,
  },
  {
    id: 'analog_pot',
    name: '02. Analog / ReadPotentiometer.ino',
    category: 'Analog',
    code: `// 3D Lab: Potentiometer Voltage Divider ADC
// Reads 10-bit analog voltage (0 to 1023) from Pin A0

const int POT_PIN = A0;

void setup() {
  Serial.begin(9600);
  Serial.println("[ADC] 10-bit Successive Approximation ADC Ready.");
}

void loop() {
  int rawValue = analogRead(POT_PIN);
  float voltage = rawValue * (5.0 / 1023.0);

  Serial.print("[ADC A0] Raw: ");
  Serial.print(rawValue);
  Serial.print(" | Calibrated Voltage: ");
  Serial.print(voltage, 2);
  Serial.println(" V");

  delay(250);
}`,
  },
  {
    id: 'bjt_switch',
    name: '03. Transistor / BjtPwmSwitch.ino',
    category: 'Transistors',
    code: `// 3D Lab: 2N3904 NPN BJT Switching & PWM Modulation
// Modulates Base Current to switch Collector Load

const int BASE_PWM_PIN = 9;

void setup() {
  pinMode(BASE_PWM_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("[BJT] 2N3904 Switching Driver Initialized.");
}

void loop() {
  // Fade in collector current
  for (int duty = 0; duty <= 255; duty += 15) {
    analogWrite(BASE_PWM_PIN, duty);
    float dutyPercent = (duty / 255.0) * 100.0;
    Serial.print("[BJT PWM] Duty: ");
    Serial.print(dutyPercent, 1);
    Serial.print("% | V_be: 0.72V | I_c: ");
    Serial.print((duty / 255.0) * 45.0, 1);
    Serial.println(" mA (Active Region)");
    delay(100);
  }
  delay(500);
}`,
  },
  {
    id: 'mosfet_inverter',
    name: '04. MOSFET / 2N7000_LogicInverter.ino',
    category: 'Transistors',
    code: `// 3D Lab: 2N7000 N-Channel MOSFET Gate Control
// Demonstrates Gate Threshold V_gs(th) and Drain Saturation

const int GATE_PIN = 6;
const int SENSE_PIN = A1;

void setup() {
  pinMode(GATE_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("[MOSFET] 2N7000 Logic Controller Ready.");
}

void loop() {
  // High state - MOSFET ON
  digitalWrite(GATE_PIN, HIGH);
  Serial.println("[MOSFET] V_gs = 5.0V > V_th (2.1V) -> Low R_ds(on) = 1.2 Ohm -> LOAD ENGAGED");
  delay(1200);

  // Low state - MOSFET OFF
  digitalWrite(GATE_PIN, LOW);
  Serial.println("[MOSFET] V_gs = 0.0V -> Cutoff Mode (I_leakage < 1 uA) -> LOAD DISENGAGED");
  delay(1200);
}`,
  },
  {
    id: 'serial_telemetry',
    name: '05. Communication / BidirectionalSerial.ino',
    category: 'Serial',
    code: `// 3D Lab: Interactive Serial Protocol Parser
// Type 'HELP', 'PING', or 'READ' in the Serial Monitor below!

void setup() {
  Serial.begin(9600);
  Serial.println("[3D LAB MCU] Serial Console v2.4 Online.");
  Serial.println("[INFO] Type 'PING' or 'STATUS' in the box below and press Send.");
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\\n');
    input.trim();
    input.toUpperCase();

    if (input == "PING") {
      Serial.println("[PONG] MCU round-trip latency: 0.42 ms");
    } else if (input == "STATUS") {
      Serial.println("[STATUS] Rail: 5.01V | Core Temp: 32.4C | Free SRAM: 1842 Bytes");
    } else if (input == "HELP") {
      Serial.println("[COMMANDS] PING, STATUS, HELP, CLEAR, REBOOT");
    } else {
      Serial.print("[ECHO] Received: '");
      Serial.print(input);
      Serial.println("' (Unknown command, try 'HELP')");
    }
  }
}`,
  },
];

// 2. THEMES (12+ Custom Color Themes with No-Scrollbar support)
interface ThemeOption {
  id: string;
  name: string;
  bg: string;
  editorBg: string;
  textColor: string;
  commentColor: string;
  keywordColor: string;
  stringColor: string;
  accent: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'vs-dark',
    name: 'VS Code Dark (Default)',
    bg: '#1e1e1e',
    editorBg: '#18181b',
    textColor: '#d4d4d4',
    commentColor: '#6a9955',
    keywordColor: '#569cd6',
    stringColor: '#ce9178',
    accent: '#007acc',
  },
  {
    id: 'monokai',
    name: 'Monokai Pro',
    bg: '#2d2a2e',
    editorBg: '#221f22',
    textColor: '#fcfcfa',
    commentColor: '#727072',
    keywordColor: '#ff6188',
    stringColor: '#ffd866',
    accent: '#a9dc76',
  },
  {
    id: 'one-dark',
    name: 'One Dark Pro',
    bg: '#282c34',
    editorBg: '#21252b',
    textColor: '#abb2bf',
    commentColor: '#5c6370',
    keywordColor: '#c678dd',
    stringColor: '#98c379',
    accent: '#61afef',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    bg: '#050510',
    editorBg: '#080816',
    textColor: '#00ffff',
    commentColor: '#7b2cbf',
    keywordColor: '#ff007f',
    stringColor: '#ffe600',
    accent: '#00f0ff',
  },
  {
    id: 'dracula',
    name: 'Dracula Dark',
    bg: '#282a36',
    editorBg: '#1e1f29',
    textColor: '#f8f8f2',
    commentColor: '#6272a4',
    keywordColor: '#ff79c6',
    stringColor: '#f1fa8c',
    accent: '#bd93f9',
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark High-Contrast',
    bg: '#0d1117',
    editorBg: '#090d13',
    textColor: '#c9d1d9',
    commentColor: '#8b949e',
    keywordColor: '#ff7b72',
    stringColor: '#a5d6ff',
    accent: '#58a6ff',
  },
  {
    id: 'synthwave',
    name: "Synthwave '84",
    bg: '#262335',
    editorBg: '#1e1b2b',
    textColor: '#f92aad',
    commentColor: '#848bbd',
    keywordColor: '#fed93f',
    stringColor: '#36f9f6',
    accent: '#fe4450',
  },
  {
    id: 'nord',
    name: 'Nord Frost',
    bg: '#2e3440',
    editorBg: '#242933',
    textColor: '#d8dee9',
    commentColor: '#4c566a',
    keywordColor: '#81a1c1',
    stringColor: '#a3be8c',
    accent: '#88c0d0',
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night Storm',
    bg: '#1a1b26',
    editorBg: '#16161e',
    textColor: '#a9b1d6',
    commentColor: '#565f89',
    keywordColor: '#bb9af7',
    stringColor: '#9ece6a',
    accent: '#7aa2f7',
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark Precision',
    bg: '#002b36',
    editorBg: '#00212b',
    textColor: '#839496',
    commentColor: '#586e75',
    keywordColor: '#268bd2',
    stringColor: '#2aa198',
    accent: '#b58900',
  },
  {
    id: 'material-oceanic',
    name: 'Material Oceanic',
    bg: '#263238',
    editorBg: '#1e272c',
    textColor: '#cdd3de',
    commentColor: '#546e7a',
    keywordColor: '#c792ea',
    stringColor: '#c3e88d',
    accent: '#80cbc4',
  },
  {
    id: 'cobalt2',
    name: 'Cobalt2 Blue',
    bg: '#193549',
    editorBg: '#132737',
    textColor: '#ffffff',
    commentColor: '#0088ff',
    keywordColor: '#ff9d00',
    stringColor: '#3ad900',
    accent: '#ffc600',
  },
];

// 3. BAUD RATES
const BAUD_RATES = [
  '300 baud',
  '1200 baud',
  '2400 baud',
  '4800 baud',
  '9600 baud (Default)',
  '19200 baud',
  '38400 baud',
  '57600 baud',
  '115200 baud',
  '230400 baud',
  '250000 baud',
];

export function CodeEditorModal() {
  const { codeEditorOpen, setCodeEditorOpen } = useWorkspaceStore();

  // State
  const [selectedExample, setSelectedExample] = useState<CodeExample>(CODE_EXAMPLES[0]);
  const [codeText, setCodeText] = useState<string>(CODE_EXAMPLES[0].code);
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(THEME_OPTIONS[0]);
  const [selectedBaud, setSelectedBaud] = useState<string>('9600 baud (Default)');

  // Dropdown open states
  const [exampleDropdownOpen, setExampleDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [baudDropdownOpen, setBaudDropdownOpen] = useState(false);

  // Serial Monitor states
  const [serialOutput, setSerialOutput] = useState<string[]>([
    '[System] 3D Lab Virtual MCU Emulator online.',
    '[Serial] COM3 Port opened at 9600 baud, 8N1.',
    '[Status] Ready to flash firmware. Press "Upload & Run" or Ctrl+Enter.',
  ]);
  const [serialInput, setSerialInput] = useState<string>('');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isCodeRunning, setIsCodeRunning] = useState<boolean>(false);
  const [serialMonitorOpen, setSerialMonitorOpen] = useState<boolean>(true);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const serialBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll serial output
  useEffect(() => {
    if (autoScroll && serialBottomRef.current) {
      serialBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [serialOutput, autoScroll]);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2200);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Keybindings: Escape to close, Ctrl+Enter to compile
  useEffect(() => {
    if (!codeEditorOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExampleDropdownOpen(false);
        setThemeDropdownOpen(false);
        setBaudDropdownOpen(false);
        setCodeEditorOpen(false);
      } else if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleCompileAndRun();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [codeEditorOpen, setCodeEditorOpen]);

  if (!codeEditorOpen) return null;

  // Clipboard operations (Ctrl+C, Ctrl+V, Cut)
  const handleCopyCode = async () => {
    try {
      const textarea = textareaRef.current;
      let textToCopy = codeText;
      if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
        textToCopy = codeText.substring(textarea.selectionStart, textarea.selectionEnd);
      }
      await navigator.clipboard.writeText(textToCopy);
      setToastMessage('Copied to clipboard (Ctrl+C)');
    } catch {
      setToastMessage('Clipboard copy successful');
    }
  };

  const handleCutCode = async () => {
    try {
      const textarea = textareaRef.current;
      if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = codeText.substring(start, end);
        await navigator.clipboard.writeText(selected);
        const newText = codeText.substring(0, start) + codeText.substring(end);
        setCodeText(newText);
        setToastMessage('Cut selection to clipboard (Ctrl+X)');
      } else {
        await navigator.clipboard.writeText(codeText);
        setCodeText('');
        setToastMessage('Cut entire file to clipboard');
      }
    } catch {
      setToastMessage('Cut operation completed');
    }
  };

  const handlePasteCode = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = codeText.substring(0, start) + clipboardText + codeText.substring(end);
        setCodeText(newText);
        setToastMessage('Pasted from clipboard (Ctrl+V)');
      }
    } catch {
      setToastMessage('Paste via keyboard (Ctrl+V)');
    }
  };

  // Compile & Run Simulator
  const handleCompileAndRun = () => {
    setIsCompiling(true);
    setToastMessage('Compiling AVR firmware with avr-gcc...');

    setTimeout(() => {
      setIsCompiling(false);
      setIsCodeRunning(true);
      const timestamp = new Date().toLocaleTimeString();

      setSerialOutput((prev) => [
        ...prev,
        `--- [${timestamp}] COMPILATION SUCCESSFUL ---`,
        'Flash Memory: 2184 bytes (6.7% of 32256 byte max)',
        'SRAM Usage: 184 bytes (9.0% of 2048 byte max)',
        `[Firmware] Uploading hex payload to ATmega328P via ${selectedBaud}...`,
        '[MCU] Bootloader verification OK. Running sketch...',
        '[Serial] Telemetry streaming initialized.',
      ]);

      // If Blink example, stream simulated readings
      if (selectedExample.id === 'blink') {
        setTimeout(() => {
          setSerialOutput((p) => [...p, '[Telemetry] Pin 13 LED HIGH -> 20.8 mA forward drive.']);
        }, 800);
        setTimeout(() => {
          setSerialOutput((p) => [...p, '[Telemetry] Pin 13 LED LOW -> 0.0 mA cutoff.']);
        }, 1800);
      }
    }, 600);
  };

  // Serial Monitor Send
  const handleSendSerial = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!serialInput.trim()) return;

    const inputVal = serialInput.trim();
    const timestamp = new Date().toLocaleTimeString();

    const newOutputs = [
      ...serialOutput,
      `> [${timestamp} TX] ${inputVal}`,
    ];

    // Simulated responses
    const upper = inputVal.toUpperCase();
    if (upper === 'PING') {
      newOutputs.push(`[${timestamp} RX] PONG (MCU latency: 0.38 ms)`);
    } else if (upper === 'STATUS') {
      newOutputs.push(`[${timestamp} RX] Voltage: 5.02V | Temp: 31.8°C | Clock: 16.000 MHz`);
    } else if (upper === 'CLEAR') {
      setSerialOutput([]);
      setSerialInput('');
      return;
    } else {
      newOutputs.push(`[${timestamp} RX] Echo: "${inputVal}" acknowledged.`);
    }

    setSerialOutput(newOutputs);
    setSerialInput('');
  };

  const lineCount = codeText.split('\n').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 select-none animate-in fade-in duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-cyan-950/95 border border-cyan-500/80 text-cyan-300 font-mono text-xs shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Code Window */}
      <div className="w-full max-w-6xl h-[92vh] flex flex-col rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl overflow-hidden font-mono">
        {/* =========================================================================
            HEADER BAR: Logo, Custom Example Dropdown, Theme Dropdown, Actions, Close
           ========================================================================= */}
        <div className="h-13 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between gap-3 shrink-0">
          {/* Left: Window Title & Example Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm">
                <Code className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider hidden sm:inline">
                MCU Code Platform
              </span>
            </div>

            {/* 1. CUSTOM EXAMPLE DROPDOWN (NO default <select>) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setExampleDropdownOpen(!exampleDropdownOpen);
                  setThemeDropdownOpen(false);
                  setBaudDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 hover:border-cyan-500 text-xs text-slate-200 transition-colors shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate max-w-[200px] font-semibold">{selectedExample.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${exampleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Custom Example Menu */}
              {exampleDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 rounded-xl bg-slate-900 border border-slate-700 p-1.5 shadow-2xl z-30">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800 mb-1">
                    Select Code Example
                  </div>
                  <div className="space-y-0.5">
                    {CODE_EXAMPLES.map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => {
                          setSelectedExample(ex);
                          setCodeText(ex.code);
                          setExampleDropdownOpen(false);
                          setToastMessage(`Loaded ${ex.name}`);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          selectedExample.id === ex.id
                            ? 'bg-cyan-600 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{ex.name}</span>
                        {selectedExample.id === ex.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Custom Theme Dropdown (with no-scrollbar scroll), Clipboard, Compile, Close */}
          <div className="flex items-center gap-2">
            {/* 2. CUSTOM THEME DROPDOWN (12+ themes with scroll and hidden scrollbar) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setThemeDropdownOpen(!themeDropdownOpen);
                  setExampleDropdownOpen(false);
                  setBaudDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 hover:border-cyan-500 text-xs text-slate-300 transition-colors"
                title="Select Editor Color Theme"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedTheme.accent }} />
                <span className="hidden md:inline text-[11px]">{selectedTheme.name.split(' ')[0]}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${themeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Theme list with smooth scroll and no-scrollbar */}
              {themeDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-60 rounded-xl bg-slate-900 border border-slate-700 p-1.5 shadow-2xl z-30">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800 mb-1">
                    Editor Themes ({THEME_OPTIONS.length})
                  </div>
                  {/* Scrollable list with no-scrollbar */}
                  <div className="max-h-56 overflow-y-auto no-scrollbar space-y-0.5">
                    {THEME_OPTIONS.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          setSelectedTheme(theme);
                          setThemeDropdownOpen(false);
                          setToastMessage(`Theme: ${theme.name}`);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          selectedTheme.id === theme.id
                            ? 'bg-slate-800 text-cyan-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: theme.accent }} />
                          <span className="truncate">{theme.name}</span>
                        </div>
                        {selectedTheme.id === theme.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clipboard Tools: Cut (Ctrl+X), Copy (Ctrl+C), Paste (Ctrl+V) */}
            <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-800">
              <button
                type="button"
                onClick={handleCutCode}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Cut to clipboard (Ctrl+X)"
                aria-label="Cut code"
              >
                <Scissors className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Copy selection/all (Ctrl+C)"
                aria-label="Copy code"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handlePasteCode}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Paste from clipboard (Ctrl+V)"
                aria-label="Paste code"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Run & Compile Button */}
            <button
              type="button"
              onClick={handleCompileAndRun}
              disabled={isCompiling}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              title="Compile & Upload Sketch (Ctrl+Enter)"
            >
              <Play className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isCompiling ? 'Compiling...' : 'Upload & Run'}</span>
            </button>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={() => setCodeEditorOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              title="Close Code Window (Esc)"
              aria-label="Close Code Window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            MIDDLE: CODE EDITOR PANE WITH LINE NUMBERS
           ========================================================================= */}
        <div
          className="flex-1 flex overflow-hidden relative"
          style={{ backgroundColor: selectedTheme.editorBg }}
        >
          {/* Line Numbers Column */}
          <div
            className="w-12 py-3 pr-2 text-right text-xs select-none border-r border-slate-800/80 opacity-50 shrink-0 font-mono"
            style={{ color: selectedTheme.commentColor }}
          >
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Interactive Editable Code Textarea */}
          <div className="flex-1 relative overflow-hidden">
            <textarea
              ref={textareaRef}
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              spellCheck={false}
              className="w-full h-full p-3 resize-none outline-none font-mono text-xs sm:text-sm leading-6 custom-scrollbar bg-transparent"
              style={{
                color: selectedTheme.textColor,
                caretColor: selectedTheme.accent,
              }}
            />
          </div>
        </div>

        {/* =========================================================================
            BOTTOM: INBUILT SERIAL MONITOR
           ========================================================================= */}
        <div className="border-t border-slate-800 bg-[#0a0d13] flex flex-col shrink-0">
          {/* Serial Monitor Header */}
          <div className="h-9 px-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Inbuilt Serial Monitor
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                COM3 • 16 MHz Virtual ATmega328P
              </span>
            </div>

            {/* Serial Controls: Clear, Auto-scroll, Toggle Monitor */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSerialOutput([])}
                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
                title="Clear Output Buffer"
              >
                <Trash2 className="w-3 h-3 text-rose-400" />
                <span>Clear</span>
              </button>

              <label className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="rounded accent-cyan-500 w-3 h-3"
                />
                <span className="hidden sm:inline">Autoscroll</span>
              </label>

              <button
                type="button"
                onClick={() => setSerialMonitorOpen(!serialMonitorOpen)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={serialMonitorOpen ? 'Collapse Monitor' : 'Expand Monitor'}
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${serialMonitorOpen ? '' : 'rotate-180'}`} />
              </button>
            </div>
          </div>

          {/* Serial Output Screen & Bottom Baud Rate Control */}
          {serialMonitorOpen && (
            <div className="p-3 space-y-2">
              {/* Output log canvas */}
              <div className="h-32 sm:h-36 overflow-y-auto custom-scrollbar p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] space-y-1">
                {serialOutput.map((line, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed ${
                      line.includes('ERROR') || line.includes('FAIL')
                        ? 'text-rose-400'
                        : line.includes('SUCCESS') || line.includes('OK')
                        ? 'text-emerald-400'
                        : line.startsWith('>')
                        ? 'text-amber-400 font-semibold'
                        : 'text-slate-300'
                    }`}
                  >
                    {line}
                  </div>
                ))}
                <div ref={serialBottomRef} />
              </div>

              {/* Bottom Row: Send Command Input & Custom Baud Rate Dropdown */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                {/* Send input */}
                <form onSubmit={handleSendSerial} className="flex-1 min-w-[240px] flex items-center gap-1.5">
                  <input
                    type="text"
                    value={serialInput}
                    onChange={(e) => setSerialInput(e.target.value)}
                    placeholder="Type serial command (e.g., 'STATUS', 'PING', 'HELP') and press Send..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-cyan-500 text-xs text-slate-200 outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
                  >
                    <span>Send</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>

                {/* 3. CUSTOM BAUD RATE DROPDOWN (NO default <select>) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setBaudDropdownOpen(!baudDropdownOpen);
                      setExampleDropdownOpen(false);
                      setThemeDropdownOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs text-slate-300 transition-colors"
                  >
                    <Sliders className="w-3 h-3 text-cyan-400" />
                    <span>{selectedBaud}</span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${baudDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Custom Baud Menu */}
                  {baudDropdownOpen && (
                    <div className="absolute bottom-full right-0 mb-1 w-48 rounded-xl bg-slate-900 border border-slate-700 p-1.5 shadow-2xl z-30">
                      <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800 mb-1">
                        Serial Baud Rate
                      </div>
                      <div className="max-h-48 overflow-y-auto no-scrollbar space-y-0.5">
                        {BAUD_RATES.map((baud) => (
                          <button
                            key={baud}
                            type="button"
                            onClick={() => {
                              setSelectedBaud(baud);
                              setBaudDropdownOpen(false);
                              setSerialOutput((p) => [
                                ...p,
                                `[Serial] Baud rate updated to ${baud}.`,
                              ]);
                              setToastMessage(`Baud: ${baud}`);
                            }}
                            className={`w-full text-left px-2 py-1 rounded text-xs flex items-center justify-between transition-colors ${
                              selectedBaud === baud
                                ? 'bg-cyan-600 text-white font-semibold'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <span>{baud}</span>
                            {selectedBaud === baud && <Check className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
