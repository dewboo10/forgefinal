// src/Preloader.jsx
// Animated SVG preloader — shown while the app fetches auth + balance from backend.
// Matches the app's exact visual DNA: pure black, #00c37b green, dot grid,
// concentric rings, miner figure, Inter font.
// Fades out cleanly when apiLoaded becomes true.

import { useState, useEffect } from 'react'

export default function Preloader({ visible }) {
  // Two-phase: visible=true shows it, visible=false triggers fade-out then unmount
  const [mounted, setMounted] = useState(true)
  const [opacity, setOpacity] = useState(1)
  // Status text cycles while loading
  const [statusIdx, setStatusIdx] = useState(0)

  const STATUS = [
    'CONNECTING TO NODE',
    'VALIDATING IDENTITY',
    'SYNCING BALANCE',
    'LOADING MINING RIG',
    'ALMOST READY',
  ]

  useEffect(() => {
    if (!visible) {
      // Fade out over 400ms then unmount
      setOpacity(0)
      const t = setTimeout(() => setMounted(false), 420)
      return () => clearTimeout(t)
    }
  }, [visible])

  useEffect(() => {
    if (!visible) return
    const t = setInterval(() => {
      setStatusIdx(i => (i + 1) % STATUS.length)
    }, 900)
    return () => clearInterval(t)
  }, [visible])

  if (!mounted) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity,
      transition: 'opacity 0.4s ease',
      pointerEvents: visible ? 'all' : 'none',
    }}>

      {/* ── Animated SVG artwork ─────────────────────────────────────────── */}
      <svg
        width="260" height="260"
        viewBox="0 0 260 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginBottom: 36 }}
      >
        {/* Dot grid — same as mine tab background */}
        {Array.from({ length: 13 }, (_, i) =>
          Array.from({ length: 13 }, (_, j) => (
            <circle
              key={`d${i}-${j}`}
              cx={i * 22 + 2} cy={j * 22 + 2} r="1"
              fill="rgba(255,255,255,0.055)"
            />
          ))
        )}

        {/* Outer slow-rotating dashed orbit */}
        <circle cx="130" cy="130" r="118" stroke="rgba(0,195,123,0.1)" strokeWidth="0.8" strokeDasharray="3 9">
          <animateTransform attributeName="transform" type="rotate"
            from="0 130 130" to="360 130 130" dur="22s" repeatCount="indefinite"/>
        </circle>

        {/* Mid counter-rotating ring */}
        <circle cx="130" cy="130" r="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" strokeDasharray="2 6">
          <animateTransform attributeName="transform" type="rotate"
            from="0 130 130" to="-360 130 130" dur="16s" repeatCount="indefinite"/>
        </circle>

        {/* Static concentric rings — same as balance section */}
        <circle cx="130" cy="130" r="84" stroke="rgba(0,195,123,0.08)"  strokeWidth="0.8"/>
        <circle cx="130" cy="130" r="66" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7"/>
        <circle cx="130" cy="130" r="48" stroke="rgba(0,195,123,0.10)"  strokeWidth="0.8"/>
        <circle cx="130" cy="130" r="32" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6"/>

        {/* Crosshair lines */}
        <line x1="14"  y1="130" x2="98"  y2="130" stroke="rgba(0,195,123,0.15)" strokeWidth="0.6"/>
        <line x1="162" y1="130" x2="246" y2="130" stroke="rgba(0,195,123,0.15)" strokeWidth="0.6"/>
        <line x1="130" y1="14"  x2="130" y2="98"  stroke="rgba(0,195,123,0.15)" strokeWidth="0.6"/>
        <line x1="130" y1="162" x2="130" y2="246" stroke="rgba(0,195,123,0.15)" strokeWidth="0.6"/>

        {/* 5 orbiting nodes on the 84px ring */}
        {[0, 72, 144, 216, 288].map((deg, i) => {
          const r = 84
          const rad = (deg - 90) * Math.PI / 180
          const x = 130 + r * Math.cos(rad)
          const y = 130 + r * Math.sin(rad)
          return (
            <g key={`n${i}`}>
              <circle cx={x} cy={y} r="3.5"
                fill={i % 2 === 0 ? '#00c37b' : 'rgba(255,255,255,0.5)'}
                opacity="0.8">
                <animate attributeName="opacity"
                  values={`0.3;1;0.3`}
                  dur={`${1.4 + i * 0.25}s`}
                  repeatCount="indefinite"/>
              </circle>
            </g>
          )
        })}

        {/* Miner helmet — simplified from the mine tab background art */}
        {/* Head */}
        <rect x="108" y="96"  width="44" height="40" rx="8"  fill="#181818"/>
        {/* Helmet ridge */}
        <rect x="111" y="90"  width="38" height="9"  rx="4"  fill="#202020"/>
        <rect x="120" y="85"  width="20" height="8"  rx="3"  fill="#1a1a1a"/>
        {/* Visor — the green accent */}
        <rect x="114" y="108" width="32" height="13" rx="3"  fill="#00c37b" opacity="0.15"/>
        <rect x="115" y="109" width="30" height="11" rx="2.5" fill="#00c37b" opacity="0.2"/>
        {/* Visor scan line — animates */}
        <rect x="117" y="111" width="26" height="3" rx="1" fill="#00c37b" opacity="0.55">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="1.4s" repeatCount="indefinite"/>
        </rect>
        <rect x="117" y="116" width="18" height="1.5" rx="0.75" fill="#00c37b" opacity="0.25"/>
        {/* Chin */}
        <rect x="116" y="121" width="28" height="8" rx="3" fill="#1e1e1e"/>
        {/* Neck */}
        <rect x="122" y="136" width="16" height="6" rx="2" fill="#141414"/>
        {/* Shoulders */}
        <rect x="86"  y="140" width="20" height="22" rx="6" fill="#181818"/>
        <rect x="154" y="140" width="20" height="22" rx="6" fill="#181818"/>
        {/* Body */}
        <rect x="98"  y="142" width="64" height="56" rx="7" fill="#161616"/>
        {/* Chest plate */}
        <rect x="105" y="149" width="50" height="36" rx="4" fill="#1c1c1c"/>
        {/* Circuit lines on chest */}
        <line x1="115" y1="155" x2="115" y2="177" stroke="#00c37b" strokeWidth="0.9" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.8s" repeatCount="indefinite"/>
        </line>
        <line x1="130" y1="152" x2="130" y2="180" stroke="#00c37b" strokeWidth="0.6" opacity="0.35">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.1s" repeatCount="indefinite"/>
        </line>
        <line x1="145" y1="155" x2="145" y2="177" stroke="#00c37b" strokeWidth="0.9" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite"/>
        </line>
        <line x1="115" y1="165" x2="145" y2="165" stroke="#00c37b" strokeWidth="0.6" opacity="0.3"/>
        {/* Pick-axe handle */}
        <line x1="166" y1="148" x2="204" y2="114"
          stroke="#1e1e1e" strokeWidth="7" strokeLinecap="round"/>
        <line x1="166" y1="148" x2="204" y2="114"
          stroke="#2a2a2a" strokeWidth="4" strokeLinecap="round"/>
        {/* Pick head */}
        <polygon points="204,114 216,102 220,116 208,122" fill="#2a2a2a"/>
        <polygon points="204,114 212,106 214,114"           fill="#333"/>
        {/* Spark at pick tip — animates */}
        <circle cx="212" cy="106" r="3" fill="#00c37b" opacity="0.7">
          <animate attributeName="r"       values="1;4;1"     dur="0.9s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;1;0.3" dur="0.9s" repeatCount="indefinite"/>
        </circle>
        <circle cx="218" cy="100" r="1.5" fill="#00c37b" opacity="0.5">
          <animate attributeName="opacity" values="0;1;0" dur="0.9s" begin="0.15s" repeatCount="indefinite"/>
        </circle>
        <circle cx="207" cy="110" r="1.2" fill="#fff"     opacity="0.4">
          <animate attributeName="opacity" values="0;0.8;0" dur="0.9s" begin="0.3s" repeatCount="indefinite"/>
        </circle>

        {/* Floating ore blocks */}
        <rect x="44" y="100" width="12" height="12" rx="2.5"
          fill="#1e1e1e" transform="rotate(-15 50 106)">
          <animateTransform attributeName="transform" type="translate"
            values="0,0; 0,-6; 0,0" dur="2.4s" additive="sum" repeatCount="indefinite"/>
        </rect>
        <circle cx="50" cy="104" r="2" fill="#00c37b" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2.4s" repeatCount="indefinite"/>
        </circle>

        <rect x="198" y="168" width="9" height="9" rx="2"
          fill="#1a1a1a" transform="rotate(20 202 172)">
          <animateTransform attributeName="transform" type="translate"
            values="0,0; 0,-5; 0,0" dur="2s" begin="0.6s" additive="sum" repeatCount="indefinite"/>
        </rect>
        <circle cx="202" cy="172" r="1.5" fill="#00c37b" opacity="0.35">
          <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2s" begin="0.6s" repeatCount="indefinite"/>
        </circle>

        <rect x="54" y="170" width="8" height="8" rx="2"
          fill="#1c1c1c" transform="rotate(10 58 174)">
          <animateTransform attributeName="transform" type="translate"
            values="0,0; 0,-4; 0,0" dur="1.8s" begin="1s" additive="sum" repeatCount="indefinite"/>
        </rect>

        {/* Core glow pulse behind miner */}
        <circle cx="130" cy="160" r="38" fill="rgba(0,195,123,0.04)">
          <animate attributeName="r"       values="34;44;34"    dur="2.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.8s" repeatCount="indefinite"/>
        </circle>

        {/* Ground shadow ellipse */}
        <ellipse cx="130" cy="200" rx="46" ry="5" fill="#00c37b" opacity="0.05"/>
      </svg>

      {/* ── FORGE wordmark ──────────────────────────────────────────────── */}
      <div style={{
        fontSize: 22, fontWeight: 900,
        letterSpacing: '0.22em',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif',
        marginBottom: 10,
      }}>
        FORGE
      </div>

      {/* ── Animated progress bar ───────────────────────────────────────── */}
      <div style={{
        width: 120, height: 2, borderRadius: 1,
        background: 'rgba(255,255,255,0.07)',
        marginBottom: 14, overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent, #00c37b, transparent)',
          animation: 'preloader-scan 1.4s ease infinite',
        }}/>
      </div>

      {/* ── Status text ─────────────────────────────────────────────────── */}
      <div style={{
        fontSize: 9,
        letterSpacing: '0.16em',
        color: 'rgba(0,195,123,0.55)',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 700,
        textTransform: 'uppercase',
        transition: 'opacity 0.3s',
        minHeight: 14,
      }}>
        {STATUS[statusIdx]}
      </div>

      {/* ── Keyframes ───────────────────────────────────────────────────── */}
      <style>{`
        @keyframes preloader-scan {
          0%   { transform: translateX(-100%) }
          100% { transform: translateX(200%) }
        }
      `}</style>
    </div>
  )
}
