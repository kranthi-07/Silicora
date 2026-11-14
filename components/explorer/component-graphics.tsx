'use client';

import React from 'react';

interface GraphicProps {
  className?: string;
}

interface PhysicalIllustrationProps extends GraphicProps {
  componentId: string;
}

interface SchematicSymbolProps extends GraphicProps {
  symbolType?: string;
}

/**
 * Realistic Physical Component Illustration (High-fidelity vector SVG)
 * Shows real-world physical packaging, lead lengths, color codes, and pin indicators.
 */
export function ComponentPhysicalIllustration({ componentId, className = 'w-full h-full' }: PhysicalIllustrationProps) {
  switch (componentId) {
    // 1. Axial Resistor 10k (Brown, Black, Orange, Gold)
    case 'pass_res_10k':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* Wire Leads */}
          <line x1="10" y1="40" x2="45" y2="40" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
          <line x1="115" y1="40" x2="150" y2="40" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
          {/* Resistor Body with curved bulbous ends */}
          <path
            d="M 45 32 C 45 28, 52 26, 56 26 L 104 26 C 108 26, 115 28, 115 32 L 115 48 C 115 52, 108 54, 104 54 L 56 54 C 52 54, 45 52, 45 48 Z"
            fill="#D9B78B"
            stroke="#8C6D46"
            strokeWidth="1.5"
          />
          {/* Subtle Top Highlight */}
          <path d="M 52 30 L 108 30" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
          {/* 4 Color Bands for 10k: Brown (1), Black (0), Orange (x1k), Gold (+/-5%) */}
          <rect x="58" y="26" width="5" height="28" fill="#78350F" rx="1" />
          <rect x="70" y="26" width="5" height="28" fill="#0F172A" rx="1" />
          <rect x="82" y="26" width="5" height="28" fill="#EA580C" rx="1" />
          <rect x="100" y="26" width="5" height="28" fill="#F59E0B" rx="1" />
        </svg>
      );

    // 2. Potentiometer 10k Rotary
    case 'pass_pot_10k':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* Metal Casing */}
          <circle cx="80" cy="38" r="26" fill="#334155" stroke="#64748B" strokeWidth="2" />
          {/* Knurled Shaft */}
          <circle cx="80" cy="38" r="14" fill="#64748B" stroke="#94A3B8" strokeWidth="2" />
          <line x1="80" y1="28" x2="80" y2="34" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          {/* 3 Terminals (Pins 1, 2 Wiper, 3) */}
          <rect x="62" y="64" width="6" height="14" fill="#94A3B8" rx="1" />
          <rect x="77" y="64" width="6" height="14" fill="#38BDF8" rx="1" />
          <rect x="92" y="64" width="6" height="14" fill="#94A3B8" rx="1" />
        </svg>
      );

    // 3. Electrolytic Capacitor 470uF 25V (Blue can, white negative stripe)
    case 'pass_cap_elec_470u':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* Wire Leads: Long Anode (+), Short Cathode (-) */}
          <line x1="72" y1="58" x2="72" y2="78" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="88" y1="58" x2="88" y2="72" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round" />
          {/* Aluminum Body (Cylindrical Can) */}
          <rect x="58" y="10" width="44" height="48" rx="4" fill="#1D4ED8" stroke="#1E3A8A" strokeWidth="1.5" />
          {/* Top Cross-Score Vent Emboss */}
          <ellipse cx="80" cy="14" rx="20" ry="4" fill="#2563EB" />
          <line x1="74" y1="14" x2="86" y2="14" stroke="#1E3A8A" strokeWidth="1" />
          <line x1="80" y1="12" x2="80" y2="16" stroke="#1E3A8A" strokeWidth="1" />
          {/* White Polarity Negative Stripe on Right Side with "-" Markings */}
          <rect x="86" y="10" width="16" height="48" rx="2" fill="#E2E8F0" />
          <text x="94" y="22" fill="#1E293B" fontSize="9" fontWeight="bold" textAnchor="middle">-</text>
          <text x="94" y="34" fill="#1E293B" fontSize="9" fontWeight="bold" textAnchor="middle">-</text>
          <text x="94" y="46" fill="#1E293B" fontSize="9" fontWeight="bold" textAnchor="middle">-</text>
          {/* Text Marking */}
          <text x="71" y="32" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="monospace">470µF</text>
          <text x="71" y="42" fill="#93C5FD" fontSize="7" fontFamily="monospace">25V</text>
        </svg>
      );

    // 4. Ceramic Disc Capacitor 100nF (0.1uF "104")
    case 'pass_cap_cer_100n':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* Two Thin Radial Wire Leads */}
          <line x1="72" y1="46" x2="72" y2="76" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="88" y1="46" x2="88" y2="76" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          {/* Orange-Yellow Ceramic Disc */}
          <circle cx="80" cy="30" r="20" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          {/* Markings */}
          <text x="80" y="30" fill="#FEF3C7" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">104</text>
          <text x="80" y="40" fill="#FDE68A" fontSize="7" textAnchor="middle" fontFamily="monospace">50V</text>
        </svg>
      );

    // 5. 5mm Red Diffused LED
    case 'opto_led_red_5mm':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* Leads: Longer Anode (+) on Left, Shorter Cathode (-) on Right with Flat Rim */}
          <line x1="74" y1="56" x2="74" y2="78" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <line x1="86" y1="56" x2="86" y2="70" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          {/* Plastic Flange Rim (Cathode side on right has flattened notch) */}
          <path d="M 66 52 L 91 52 L 91 56 L 66 56 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
          {/* Bullet/Dome Epoxy Lens */}
          <path
            d="M 68 52 L 68 28 C 68 14, 92 14, 92 28 L 92 52 Z"
            fill="url(#ledRedGlow)"
            stroke="#B91C1C"
            strokeWidth="1.5"
          />
          {/* Internal Anvil & Post Leadframe */}
          <path d="M 74 52 L 74 36 L 79 36" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 86 52 L 86 33 L 81 33 L 81 38 Z" fill="#FCA5A5" stroke="#F87171" strokeWidth="0.8" />
          {/* Highlight Specular Arc */}
          <path d="M 72 24 C 74 18, 80 16, 84 17" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
          <defs>
            <radialGradient id="ledRedGlow" cx="0.5" cy="0.4" r="0.6">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </radialGradient>
          </defs>
        </svg>
      );

    // 6. 1N4148 Fast Diode (Orange Glass DO-35 bead with black cathode ring)
    case 'semi_diode_1n4148':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* Axial Leads */}
          <line x1="15" y1="40" x2="60" y2="40" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="40" x2="145" y2="40" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          {/* Glass Bead Body */}
          <rect x="60" y="30" width="40" height="20" rx="6" fill="#FB923C" stroke="#C2410C" strokeWidth="1.5" fillOpacity="0.85" />
          {/* Internal Semiconductor Die & Whisker */}
          <rect x="74" y="37" width="5" height="6" fill="#475569" />
          <line x1="60" y1="40" x2="74" y2="40" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Black Cathode Band on Right Side */}
          <rect x="88" y="30" width="6" height="20" fill="#0F172A" />
        </svg>
      );

    // 7. 1N4007 1A 1000V Power Rectifier Diode (Black DO-41 cylinder with silver band)
    case 'semi_diode_1n4007':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* Heavy Axial Leads */}
          <line x1="15" y1="40" x2="55" y2="40" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          <line x1="105" y1="40" x2="145" y2="40" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          {/* Black Plastic Molded Cylinder */}
          <rect x="55" y="27" width="50" height="26" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
          {/* Silver Cathode Band */}
          <rect x="91" y="27" width="8" height="26" fill="#CBD5E1" />
          {/* Laser Marking */}
          <text x="73" y="43" fill="#94A3B8" fontSize="8" fontWeight="bold" fontFamily="monospace">1N4007</text>
        </svg>
      );

    // 8. 2N3904 NPN BJT (Black TO-92 flat face)
    case 'semi_bjt_2n3904':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* 3 Straight Pins (1 Emitter, 2 Base, 3 Collector) */}
          <line x1="68" y1="52" x2="68" y2="76" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="52" x2="80" y2="76" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <line x1="92" y1="52" x2="92" y2="76" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          {/* TO-92 Body (D-shaped flat front) */}
          <path d="M 64 52 L 96 52 C 104 52, 106 32, 96 16 C 88 8, 72 8, 64 16 C 54 32, 56 52, 64 52 Z" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          <rect x="62" y="22" width="36" height="30" fill="#1E293B" rx="2" />
          {/* Printed Label */}
          <text x="80" y="36" fill="#F8FAFC" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">2N3904</text>
          <text x="80" y="46" fill="#94A3B8" fontSize="6" textAnchor="middle" fontFamily="monospace">E  B  C</text>
        </svg>
      );

    // 9. 2N7000 N-Channel MOSFET (TO-92)
    case 'semi_mosfet_2n7000':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* 3 Pins (1 Source, 2 Gate, 3 Drain) */}
          <line x1="68" y1="52" x2="68" y2="76" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="52" x2="80" y2="76" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <line x1="92" y1="52" x2="92" y2="76" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          {/* TO-92 Body */}
          <path d="M 64 52 L 96 52 C 104 52, 106 32, 96 16 C 88 8, 72 8, 64 16 C 54 32, 56 52, 64 52 Z" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          <rect x="62" y="22" width="36" height="30" fill="#1E293B" rx="2" />
          <text x="80" y="36" fill="#F8FAFC" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">2N7000</text>
          <text x="80" y="46" fill="#94A3B8" fontSize="6" textAnchor="middle" fontFamily="monospace">S  G  D</text>
        </svg>
      );

    // 10. NE555 Precision Timer IC (DIP-8 Package with top notch and pin 1 dot)
    case 'ic_timer_ne555':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* 8 Gull-wing / Dual-In-Line Through-Hole Pins */}
          <line x1="48" y1="20" x2="56" y2="20" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="48" y1="32" x2="56" y2="32" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="48" y1="44" x2="56" y2="44" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="48" y1="56" x2="56" y2="56" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="104" y1="20" x2="112" y2="20" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="104" y1="32" x2="112" y2="32" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="104" y1="44" x2="112" y2="44" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="104" y1="56" x2="112" y2="56" stroke="#CBD5E1" strokeWidth="3" />
          {/* Black DIP-8 Molded Epoxy Body */}
          <rect x="56" y="12" width="48" height="52" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
          {/* Top Alignment Notch */}
          <path d="M 74 12 C 74 16, 86 16, 86 12 Z" fill="#0F172A" />
          {/* Pin 1 Index Dot */}
          <circle cx="64" cy="20" r="2.5" fill="#334155" />
          {/* White Laser Marking */}
          <text x="80" y="38" fill="#F8FAFC" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">NE555P</text>
          <text x="80" y="48" fill="#64748B" fontSize="6" textAnchor="middle" fontFamily="monospace">TI 24K</text>
        </svg>
      );

    // 11. LM358 Dual Op-Amp (DIP-8)
    case 'opamp_lm358':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* 8 Through-Hole Pins */}
          <line x1="48" y1="20" x2="56" y2="20" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="48" y1="32" x2="56" y2="32" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="48" y1="44" x2="56" y2="44" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="48" y1="56" x2="56" y2="56" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="104" y1="20" x2="112" y2="20" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="104" y1="32" x2="112" y2="32" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="104" y1="44" x2="112" y2="44" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="104" y1="56" x2="112" y2="56" stroke="#CBD5E1" strokeWidth="3" />
          <rect x="56" y="12" width="48" height="52" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
          <path d="M 74 12 C 74 16, 86 16, 86 12 Z" fill="#0F172A" />
          <circle cx="64" cy="20" r="2.5" fill="#334155" />
          <text x="80" y="38" fill="#F8FAFC" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">LM358N</text>
          <text x="80" y="48" fill="#64748B" fontSize="6" textAnchor="middle" fontFamily="monospace">TI OPAMP</text>
        </svg>
      );

    // 12. 100uH Toroidal Inductor (Ferrite donut with copper windings)
    case 'pass_ind_toroid_100u':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* Wire Leads */}
          <line x1="70" y1="56" x2="70" y2="76" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
          <line x1="90" y1="56" x2="90" y2="76" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
          {/* Yellow/Green Ferrite Toroid Core Ring */}
          <circle cx="80" cy="35" r="24" fill="#047857" stroke="#065F46" strokeWidth="2" />
          <circle cx="80" cy="35" r="11" fill="#090B0E" stroke="#065F46" strokeWidth="1.5" />
          {/* Copper Magnet Wire Windings */}
          <path d="M 64 22 L 72 48" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 74 16 L 80 49" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 86 16 L 86 49" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 96 22 L 90 48" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
          {/* Copper Gleam Highlight */}
          <circle cx="80" cy="35" r="23" stroke="#FDE68A" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="4 6" />
        </svg>
      );

    // 13. Push Button Tactile Switch (6x6mm)
    case 'sw_tact_6mm':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* 4 Metal Legs */}
          <line x1="56" y1="28" x2="50" y2="28" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="56" y1="48" x2="50" y2="48" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="104" y1="28" x2="110" y2="28" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="104" y1="48" x2="110" y2="48" stroke="#CBD5E1" strokeWidth="3" />
          {/* Silver Metal Shield Top */}
          <rect x="56" y="20" width="48" height="38" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
          {/* 4 Corner Rivets */}
          <circle cx="61" cy="25" r="1.5" fill="#475569" />
          <circle cx="99" cy="25" r="1.5" fill="#475569" />
          <circle cx="61" cy="53" r="1.5" fill="#475569" />
          <circle cx="99" cy="53" r="1.5" fill="#475569" />
          {/* Round Black Tactile Button Center */}
          <circle cx="80" cy="39" r="11" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />
        </svg>
      );

    // 14. LDR Photoresistor (CdS)
    case 'sensor_ldr_5mm':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* 2 Wire Leads */}
          <line x1="74" y1="54" x2="74" y2="76" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <line x1="86" y1="54" x2="86" y2="76" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          {/* Ceramic Disc Head */}
          <circle cx="80" cy="34" r="20" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
          {/* Red/Orange CdS Squiggly Photoconductive Track */}
          <path
            d="M 68 28 C 74 24, 86 24, 92 28 C 92 34, 68 34, 68 40 C 74 44, 86 44, 92 40"
            stroke="#DC2626"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );

    // 15. Active Piezo Buzzer 5V
    case 'out_buzzer_5v':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* 2 Wire Leads (+ Long, - Short) */}
          <line x1="70" y1="56" x2="70" y2="76" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <line x1="90" y1="56" x2="90" y2="70" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          {/* Cylindrical Plastic Top */}
          <circle cx="80" cy="34" r="22" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          {/* Sound Port Hole */}
          <circle cx="80" cy="34" r="5" fill="#020617" stroke="#1E293B" strokeWidth="1" />
          {/* Red Polarity '+' Indicator */}
          <text x="66" y="26" fill="#EF4444" fontSize="12" fontWeight="bold">+</text>
        </svg>
      );

    // 16. LM35 Precision Temperature Sensor (TO-92)
    case 'sensor_temp_lm35':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* 3 Leads */}
          <line x1="68" y1="46" x2="68" y2="76" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="46" x2="80" y2="76" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="92" y1="46" x2="92" y2="76" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          {/* TO-92 Body */}
          <path d="M 60 46 L 100 46 L 100 24 C 100 16, 60 16, 60 24 Z" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
          <text x="80" y="36" fill="#38BDF8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">LM35</text>
        </svg>
      );

    // 17. Raspberry Pi Pico (RP2040)
    case 'board_raspberry_pi_pico':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* Green PCB Body */}
          <rect x="52" y="8" width="56" height="64" rx="4" fill="#047857" stroke="#065F46" strokeWidth="1.5" />
          {/* Micro-USB Port */}
          <rect x="71" y="4" width="18" height="8" rx="1.5" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
          {/* RP2040 MCU Square Chip */}
          <rect x="71" y="28" width="18" height="18" rx="2" fill="#334155" stroke="#475569" strokeWidth="1" />
          <text x="80" y="39" fill="#F1F5F9" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">RP2040</text>
          {/* Castellated Pins on Left & Right */}
          {[-20, -12, -4, 4, 12, 20].map((y, i) => (
            <g key={i}>
              <circle cx="56" cy={40 + y} r="2" fill="#F59E0B" />
              <circle cx="104" cy={40 + y} r="2" fill="#F59E0B" />
            </g>
          ))}
        </svg>
      );

    // 18. Arduino Uno R3
    case 'board_arduino_uno':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* Classic Arduino Blue PCB */}
          <rect x="42" y="10" width="76" height="60" rx="4" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
          {/* Silver USB-B Jack */}
          <rect x="36" y="16" width="14" height="18" rx="2" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
          {/* Black Barrel Jack */}
          <rect x="36" y="44" width="16" height="18" rx="2" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />
          {/* ATmega328P DIP-28 Chip */}
          <rect x="68" y="40" width="34" height="12" rx="1" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />
          <text x="85" y="49" fill="#94A3B8" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">ATmega328P</text>
          {/* Female Header Strips */}
          <rect x="58" y="14" width="52" height="6" fill="#0F172A" rx="1" />
          <rect x="58" y="60" width="52" height="6" fill="#0F172A" rx="1" />
        </svg>
      );

    // 19. 9V Alkaline Battery (6F22)
    case 'power_battery_9v':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* 9V Rectangular Prismatic Body */}
          <rect x="58" y="18" width="44" height="56" rx="4" fill="#1E1B24" stroke="#383344" strokeWidth="1.5" />
          {/* Gold Insulating Top Plate */}
          <rect x="60" y="14" width="40" height="4" rx="1" fill="#D97706" />
          {/* Positive Male Stud (+) */}
          <circle cx="70" cy="9" r="4" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
          {/* Negative Female Octagonal Socket (-) */}
          <rect x="85" y="6" width="10" height="7" rx="1" fill="#94A3B8" stroke="#64748B" strokeWidth="1" />
          {/* Label Text */}
          <rect x="63" y="36" width="34" height="16" rx="2" fill="#F06543" />
          <text x="80" y="47" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">9V</text>
        </svg>
      );

    // 20. AA / AAA Battery Holder Pack with Switch
    case 'power_battery_aa_pack':
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          {/* Black Molded Battery Tray */}
          <rect x="46" y="12" width="68" height="58" rx="4" fill="#18181B" stroke="#27272A" strokeWidth="1.5" />
          {/* Cylindrical AA Cell */}
          <rect x="52" y="18" width="38" height="46" rx="3" fill="#B45309" stroke="#92400E" strokeWidth="1" />
          <rect x="52" y="32" width="38" height="18" fill="#1C1917" />
          <text x="71" y="44" fill="#F59E0B" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">AA 1.5V</text>
          {/* Positive Pip */}
          <rect x="66" y="14" width="10" height="4" rx="1" fill="#FBBF24" />
          {/* User Toggle ON/OFF Switch */}
          <rect x="94" y="24" width="14" height="24" rx="2" fill="#09090B" stroke="#3F3F46" strokeWidth="1" />
          <rect x="96" y="26" width="10" height="10" rx="1" fill="#EF4444" />
          <text x="101" y="44" fill="#A1A1AA" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">ON</text>
          {/* Red & Black Leads */}
          <line x1="56" y1="12" x2="56" y2="4" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="86" y1="12" x2="86" y2="4" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // Default Fallback: Generic IC with notch
    default:
      return (
        <svg viewBox="0 0 160 80" className={className} fill="none">
          <rect x="56" y="20" width="48" height="40" rx="3" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
          <path d="M 74 20 C 74 24, 86 24, 86 20 Z" fill="#0F172A" />
          <text x="80" y="44" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PART</text>
        </svg>
      );
  }
}

/**
 * IEEE Standard Schematic Circuit Symbol (ANSI / IEEE 315)
 * Essential for beginners to recognize the part in circuit diagrams.
 */
export function ComponentSchematicSymbol({ symbolType, className = 'w-full h-full' }: SchematicSymbolProps) {
  switch (symbolType) {
    // Resistor: Classic US Zig-Zag
    case 'resistor':
      return (
        <svg viewBox="0 0 160 60" className={className} fill="none">
          <line x1="15" y1="30" x2="40" y2="30" stroke="#58A6FF" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M 40 30 L 46 16 L 58 44 L 70 16 L 82 44 L 94 16 L 106 44 L 118 16 L 124 30"
            stroke="#58A6FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="124" y1="30" x2="145" y2="30" stroke="#58A6FF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // Potentiometer: Resistor with center wiper arrow
    case 'potentiometer':
      return (
        <svg viewBox="0 0 160 60" className={className} fill="none">
          <line x1="15" y1="30" x2="40" y2="30" stroke="#58A6FF" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M 40 30 L 46 16 L 58 44 L 70 16 L 82 44 L 94 16 L 106 44 L 118 16 L 124 30"
            stroke="#58A6FF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line x1="124" y1="30" x2="145" y2="30" stroke="#58A6FF" strokeWidth="2.5" strokeLinecap="round" />
          {/* Wiper Arrow */}
          <line x1="82" y1="56" x2="82" y2="40" stroke="#F59E0B" strokeWidth="2.5" markerEnd="url(#arrowWiper)" />
          <defs>
            <marker id="arrowWiper" viewBox="0 0 10 10" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 6 L 5 0 L 10 6 z" fill="#F59E0B" />
            </marker>
          </defs>
        </svg>
      );

    // Polarized Capacitor (Electrolytic): Flat plate (+) and Curved plate (-)
    case 'polarized_capacitor':
      return (
        <svg viewBox="0 0 160 60" className={className} fill="none">
          <line x1="20" y1="30" x2="72" y2="30" stroke="#58A6FF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="72" y1="12" x2="72" y2="48" stroke="#58A6FF" strokeWidth="3" strokeLinecap="round" />
          <path d="M 88 12 C 84 20, 84 40, 88 48" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" fill="none" />
          <line x1="86" y1="30" x2="140" y2="30" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <text x="62" y="22" fill="#58A6FF" fontSize="12" fontWeight="bold">+</text>
        </svg>
      );

    // Non-Polarized Ceramic Capacitor: Two parallel straight plates
    case 'capacitor':
      return (
        <svg viewBox="0 0 160 60" className={className} fill="none">
          <line x1="20" y1="30" x2="74" y2="30" stroke="#58A6FF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="74" y1="14" x2="74" y2="46" stroke="#58A6FF" strokeWidth="3" strokeLinecap="round" />
          <line x1="86" y1="14" x2="86" y2="46" stroke="#58A6FF" strokeWidth="3" strokeLinecap="round" />
          <line x1="86" y1="30" x2="140" y2="30" stroke="#58A6FF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // LED: Diode triangle with bar + two outward light rays
    case 'led':
      return (
        <svg viewBox="0 0 160 60" className={className} fill="none">
          <line x1="20" y1="30" x2="65" y2="30" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          {/* Anode Triangle */}
          <polygon points="65,16 65,44 92,30" fill="#EF4444" stroke="#EF4444" strokeWidth="1.5" />
          {/* Cathode Bar */}
          <line x1="92" y1="14" x2="92" y2="46" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="92" y1="30" x2="140" y2="30" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Emitted Light Rays */}
          <line x1="86" y1="16" x2="102" y2="4" stroke="#F87171" strokeWidth="2" markerEnd="url(#arrowRay)" />
          <line x1="94" y1="22" x2="110" y2="10" stroke="#F87171" strokeWidth="2" markerEnd="url(#arrowRay)" />
          <defs>
            <marker id="arrowRay" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#F87171" />
            </marker>
          </defs>
        </svg>
      );

    // Diode: Triangle with vertical cathode bar
    case 'diode':
      return (
        <svg viewBox="0 0 160 60" className={className} fill="none">
          <line x1="20" y1="30" x2="65" y2="30" stroke="#58A6FF" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="65,16 65,44 95,30" fill="#58A6FF" stroke="#58A6FF" strokeWidth="1.5" />
          <line x1="95" y1="14" x2="95" y2="46" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="95" y1="30" x2="140" y2="30" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // NPN BJT Transistor: Circle with Base, Collector, and Emitter with outward arrow
    case 'bjt_npn':
      return (
        <svg viewBox="0 0 160 60" className={className} fill="none">
          <circle cx="80" cy="30" r="22" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Base Lead & Vertical Bar */}
          <line x1="30" y1="30" x2="68" y2="30" stroke="#58A6FF" strokeWidth="2.5" />
          <line x1="68" y1="18" x2="68" y2="42" stroke="#58A6FF" strokeWidth="3" strokeLinecap="round" />
          {/* Collector */}
          <line x1="68" y1="23" x2="94" y2="10" stroke="#58A6FF" strokeWidth="2.5" />
          <line x1="94" y1="10" x2="130" y2="10" stroke="#58A6FF" strokeWidth="2" />
          {/* Emitter with Outward Arrow */}
          <line x1="68" y1="37" x2="94" y2="50" stroke="#58A6FF" strokeWidth="2.5" />
          <line x1="94" y1="50" x2="130" y2="50" stroke="#58A6FF" strokeWidth="2" />
          <polygon points="85,42 94,50 82,48" fill="#58A6FF" />
          {/* Terminal Labels */}
          <text x="24" y="34" fill="#94A3B8" fontSize="9" fontWeight="bold">B</text>
          <text x="134" y="14" fill="#94A3B8" fontSize="9" fontWeight="bold">C</text>
          <text x="134" y="54" fill="#94A3B8" fontSize="9" fontWeight="bold">E</text>
        </svg>
      );

    // N-Channel MOSFET: Gate, Drain, and Source with inward arrow
    case 'mosfet_n':
      return (
        <svg viewBox="0 0 160 60" className={className} fill="none">
          <circle cx="80" cy="30" r="22" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Gate Terminal & Insulated Bar */}
          <line x1="30" y1="36" x2="64" y2="36" stroke="#58A6FF" strokeWidth="2.5" />
          <line x1="64" y1="18" x2="64" y2="42" stroke="#58A6FF" strokeWidth="3" />
          {/* Channel Segments */}
          <line x1="72" y1="18" x2="72" y2="24" stroke="#58A6FF" strokeWidth="3" />
          <line x1="72" y1="27" x2="72" y2="33" stroke="#58A6FF" strokeWidth="3" />
          <line x1="72" y1="36" x2="72" y2="42" stroke="#58A6FF" strokeWidth="3" />
          {/* Drain Line */}
          <line x1="72" y1="21" x2="94" y2="21" stroke="#58A6FF" strokeWidth="2" />
          <line x1="94" y1="21" x2="94" y2="10" stroke="#58A6FF" strokeWidth="2" />
          <line x1="94" y1="10" x2="130" y2="10" stroke="#58A6FF" strokeWidth="2" />
          {/* Source Line with Inward Arrow */}
          <line x1="72" y1="39" x2="94" y2="39" stroke="#58A6FF" strokeWidth="2" />
          <line x1="94" y1="39" x2="94" y2="50" stroke="#58A6FF" strokeWidth="2" />
          <line x1="94" y1="50" x2="130" y2="50" stroke="#58A6FF" strokeWidth="2" />
          <polygon points="80,39 88,35 88,43" fill="#58A6FF" />
          <text x="24" y="39" fill="#94A3B8" fontSize="9" fontWeight="bold">G</text>
          <text x="134" y="14" fill="#94A3B8" fontSize="9" fontWeight="bold">D</text>
          <text x="134" y="54" fill="#94A3B8" fontSize="9" fontWeight="bold">S</text>
        </svg>
      );

    // Inductor: 4 Loops
    case 'inductor':
      return (
        <svg viewBox="0 0 160 60" className={className} fill="none">
          <line x1="20" y1="35" x2="44" y2="35" stroke="#10B981" strokeWidth="2.5" />
          <path d="M 44 35 C 44 18, 62 18, 62 35" stroke="#10B981" strokeWidth="2.5" fill="none" />
          <path d="M 62 35 C 62 18, 80 18, 80 35" stroke="#10B981" strokeWidth="2.5" fill="none" />
          <path d="M 80 35 C 80 18, 98 18, 98 35" stroke="#10B981" strokeWidth="2.5" fill="none" />
          <path d="M 98 35 C 98 18, 116 18, 116 35" stroke="#10B981" strokeWidth="2.5" fill="none" />
          <line x1="116" y1="35" x2="140" y2="35" stroke="#10B981" strokeWidth="2.5" />
        </svg>
      );

    // Operational Amplifier: Triangle with inputs and output
    case 'opamp':
      return (
        <svg viewBox="0 0 160 60" className={className} fill="none">
          <polygon points="50,10 50,50 110,30" stroke="#38BDF8" strokeWidth="2.5" fill="rgba(56, 189, 248, 0.08)" />
          {/* Inverting (-) Input */}
          <line x1="20" y1="20" x2="50" y2="20" stroke="#58A6FF" strokeWidth="2.5" />
          <text x="56" y="24" fill="#58A6FF" fontSize="12" fontWeight="bold">-</text>
          {/* Non-Inverting (+) Input */}
          <line x1="20" y1="40" x2="50" y2="40" stroke="#58A6FF" strokeWidth="2.5" />
          <text x="55" y="44" fill="#58A6FF" fontSize="12" fontWeight="bold">+</text>
          {/* Output */}
          <line x1="110" y1="30" x2="140" y2="30" stroke="#38BDF8" strokeWidth="2.5" />
        </svg>
      );

    // Default: Generic Box with Leads
    default:
      return (
        <svg viewBox="0 0 160 60" className={className} fill="none">
          <line x1="20" y1="30" x2="50" y2="30" stroke="#58A6FF" strokeWidth="2.5" />
          <rect x="50" y="15" width="60" height="30" rx="3" stroke="#58A6FF" strokeWidth="2" fill="rgba(88, 166, 255, 0.08)" />
          <line x1="110" y1="30" x2="140" y2="30" stroke="#58A6FF" strokeWidth="2.5" />
          <text x="80" y="34" fill="#58A6FF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PART</text>
        </svg>
      );
  }
}
