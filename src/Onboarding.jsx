// src/Onboarding.jsx
// Shows only on first launch. Never again.
// Centred layout — nothing at top or bottom edges to avoid Telegram UI overlap.
// Each screen: full-bleed black, illustrated SVG artwork, headline, subtext, swipe/tap to advance.

import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'forge_onboarding_done_v1'

// ─── Slide data ───────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 'genesis',
    headline: 'A NEW WAVE\nIS FORMING',
    sub: 'Forge is the next chapter in crypto mining. Built on TON. Born in Telegram.',
    cta: 'BEGIN',
    accent: '#00c37b',
  },
  {
    id: 'mine',
    headline: 'MINE FRG\nRIGHT NOW',
    sub: 'No hardware. No electricity. Just tap — and your node starts earning FRG tokens around the clock.',
    cta: 'NEXT',
    accent: '#ffffff',
  },
  {
    id: 'halving',
    headline: 'RATE HALVES\nAS WE GROW',
    sub: 'Every time a user milestone is hit, the mining rate halves. Early miners lock in higher rates — forever.',
    cta: 'NEXT',
    accent: '#00c37b',
  },
  {
    id: 'network',
    headline: 'YOUR NETWORK\nIS YOUR WEALTH',
    sub: 'Invite others and earn 10% of everything they mine — passively, permanently, no cap.',
    cta: 'NEXT',
    accent: '#ffffff',
  },
  {
    id: 'launch',
    headline: 'GENESIS\nMINER',
    sub: 'You are early. The FRG rate is at its highest right now. Every minute you wait costs you.',
    cta: 'START MINING',
    accent: '#00c37b',
  },
]

// ─── SVG Artworks — one per slide ─────────────────────────────────────────────

function ArtGenesis() {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      {/* Outer pulse rings */}
      <circle cx="160" cy="160" r="148" stroke="rgba(0,195,123,0.08)" strokeWidth="1"/>
      <circle cx="160" cy="160" r="128" stroke="rgba(0,195,123,0.12)" strokeWidth="0.8"/>
      <circle cx="160" cy="160" r="108" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
      <circle cx="160" cy="160" r="88" stroke="rgba(0,195,123,0.14)" strokeWidth="1"/>
      <circle cx="160" cy="160" r="68" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>
      {/* Rotating dashed ring */}
      <circle cx="160" cy="160" r="138" stroke="rgba(0,195,123,0.2)" strokeWidth="0.6" strokeDasharray="4 8">
        <animateTransform attributeName="transform" type="rotate" from="0 160 160" to="360 160 160" dur="18s" repeatCount="indefinite"/>
      </circle>
      {/* Icosahedron-like geometric core */}
      <polygon points="160,80 220,130 200,200 120,200 100,130" fill="rgba(0,195,123,0.07)" stroke="rgba(0,195,123,0.5)" strokeWidth="1"/>
      <polygon points="160,80 220,130 200,200 120,200 100,130" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" transform="rotate(36 160 160)"/>
      {/* Inner solid diamond */}
      <polygon points="160,110 190,155 160,200 130,155" fill="rgba(0,195,123,0.12)" stroke="#00c37b" strokeWidth="1.2"/>
      <polygon points="160,120 183,157 160,192 137,157" fill="rgba(0,0,0,0.5)" stroke="rgba(0,195,123,0.4)" strokeWidth="0.6"/>
      {/* Core glow */}
      <circle cx="160" cy="157" r="18" fill="rgba(0,195,123,0.15)"/>
      <circle cx="160" cy="157" r="10" fill="rgba(0,195,123,0.25)"/>
      <circle cx="160" cy="157" r="4" fill="#00c37b">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
      </circle>
      {/* Orbiting nodes */}
      {[0,72,144,216,288].map((deg,i)=>{
        const r=108, x=160+r*Math.cos((deg-90)*Math.PI/180), y=160+r*Math.sin((deg-90)*Math.PI/180)
        return <g key={i}>
          <circle cx={x} cy={y} r="4" fill={i%2===0?"#00c37b":"rgba(255,255,255,0.6)"} opacity="0.7"/>
          <line x1="160" y1="157" x2={x} y2={y} stroke="rgba(0,195,123,0.12)" strokeWidth="0.6"/>
        </g>
      })}
      {/* Floating particles */}
      {[[60,60],[260,90],[280,230],[50,250],[150,40],[240,160]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i%2===0?1.5:1} fill={i%3===0?"#00c37b":"rgba(255,255,255,0.4)"}>
          <animate attributeName="opacity" values={`${0.2+i*0.1};0.8;${0.2+i*0.1}`} dur={`${2.5+i*0.4}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      {/* FORGE word mark — ghost */}
      <text x="160" y="165" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="8" fill="rgba(0,195,123,0.35)" fontFamily="monospace">FORGE</text>
    </svg>
  )
}

function ArtMine() {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      {/* Grid floor */}
      {[0,1,2,3,4].map(i=>(
        <line key={`h${i}`} x1={60+i*50} y1="80" x2={60+i*50} y2="260" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
      ))}
      {[0,1,2,3].map(i=>(
        <line key={`v${i}`} x1="60" y1={80+i*60} x2="260" y2={80+i*60} stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
      ))}
      {/* Mining rig body */}
      <rect x="110" y="140" width="100" height="80" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"/>
      {/* Rig slots */}
      {[0,1,2].map(i=>(
        <rect key={i} x={118+i*28} y="150" width="20" height="12" rx="2" fill="rgba(0,195,123,0.15)" stroke="rgba(0,195,123,0.5)" strokeWidth="0.8">
          <animate attributeName="fill" values="rgba(0,195,123,0.1);rgba(0,195,123,0.35);rgba(0,195,123,0.1)" dur={`${1.2+i*0.3}s`} repeatCount="indefinite"/>
        </rect>
      ))}
      {/* Status LEDs */}
      {[0,1,2].map(i=>(
        <circle key={i} cx={128+i*28} cy="173" r="3" fill="#00c37b">
          <animate attributeName="opacity" values="0.4;1;0.4" dur={`${0.8+i*0.2}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      {/* Vent lines */}
      {[0,1,2,3].map(i=>(
        <line key={i} x1="118" y1={188+i*6} x2="145" y2={188+i*6} stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
      ))}
      {/* Heat exhaust waves */}
      <path d="M160 138 Q165 125 160 112 Q155 99 160 86" stroke="rgba(0,195,123,0.25)" strokeWidth="1" strokeLinecap="round" fill="none">
        <animate attributeName="opacity" values="0.1;0.5;0.1" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M175 138 Q182 124 177 110 Q172 96 178 82" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeLinecap="round" fill="none">
        <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2.4s" repeatCount="indefinite"/>
      </path>
      <path d="M145 138 Q138 124 143 110 Q148 96 142 82" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeLinecap="round" fill="none">
        <animate attributeName="opacity" values="0.1;0.4;0.1" dur="1.8s" repeatCount="indefinite"/>
      </path>
      {/* Floating FRG tokens */}
      {[[90,100],[230,120],[80,200],[245,190],[160,70]].map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="10" fill="rgba(0,195,123,0.1)" stroke="rgba(0,195,123,0.4)" strokeWidth="0.8"/>
          <text x={x} y={y+4} textAnchor="middle" fontSize="7" fill="rgba(0,195,123,0.8)" fontFamily="monospace" fontWeight="700">FRG</text>
          <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2+i*0.5}s`} repeatCount="indefinite"/>
        </g>
      ))}
      {/* Power cable */}
      <path d="M210 180 Q240 180 240 220 Q240 250 200 250 L120 250 Q80 250 80 220 Q80 190 110 180" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none"/>
      {/* Connection dot */}
      <circle cx="160" cy="250" r="3" fill="rgba(255,255,255,0.2)"/>
    </svg>
  )
}

function ArtHalving() {
  const bars = [1, 0.5, 0.25, 0.125, 0.0625]
  const colors = ['#00c37b','#5ec98a','#88d4a8','rgba(0,195,123,0.5)','rgba(0,195,123,0.25)']
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      {/* Chart background grid */}
      {[0,1,2,3].map(i=>(
        <line key={i} x1="60" y1={90+i*45} x2="270" y2={90+i*45} stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
      ))}
      {/* Step-down halving bars */}
      {bars.map((h,i)=>{
        const barH = h*160, x=70+i*42, y=270-barH
        return (
          <g key={i}>
            <rect x={x} y={y} width="32" height={barH} rx="3" fill={colors[i]} opacity="0.9"/>
            <rect x={x} y={y} width="32" height="6" rx="3" fill="rgba(255,255,255,0.3)"/>
            <text x={x+16} y={y-8} textAnchor="middle" fontSize="8" fill={colors[i]} fontFamily="monospace" fontWeight="700">
              {h >= 1 ? '1×' : h >= 0.5 ? '½×' : h >= 0.25 ? '¼×' : h >= 0.125 ? '⅛×' : '…'}
            </text>
          </g>
        )
      })}
      {/* Baseline */}
      <line x1="60" y1="270" x2="270" y2="270" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      {/* YOU ARE HERE arrow on bar 0 */}
      <line x1="86" y1="90" x2="86" y2="60" stroke="#00c37b" strokeWidth="1" strokeDasharray="3 2"/>
      <polygon points="86,58 82,66 90,66" fill="#00c37b"/>
      <text x="86" y="52" textAnchor="middle" fontSize="8" fill="#00c37b" fontFamily="monospace" fontWeight="700">NOW</text>
      {/* Epoch labels */}
      {['0','1K','10K','100K','1M'].map((l,i)=>(
        <text key={i} x={86+i*42} y="284" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="monospace">{l}</text>
      ))}
      <text x="165" y="300" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.18)" fontFamily="monospace" letterSpacing="2">TOTAL USERS</text>
      {/* Side label */}
      <text x="50" y="165" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.2)" fontFamily="monospace" transform="rotate(-90 50 165)" letterSpacing="2">RATE</text>
      {/* Glow on first bar */}
      <rect x="70" y="110" width="32" height="160" rx="3" fill="rgba(0,195,123,0.08)"/>
    </svg>
  )
}

function ArtNetwork() {
  const nodes = [
    {x:160,y:155,r:10,you:true},
    {x:100,y:105,r:7},{x:220,y:105,r:7},
    {x:70,y:175,r:6},{x:250,y:175,r:6},
    {x:110,y:230,r:5},{x:210,y:230,r:5},
    {x:55,y:125,r:4},{x:265,y:125,r:4},
    {x:160,y:70,r:5},
  ]
  const edges = [[0,1],[0,2],[0,9],[1,3],[1,7],[2,4],[2,8],[3,5],[4,6],[1,2]]
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      {/* Edges */}
      {edges.map(([a,b],i)=>(
        <line key={i}
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="rgba(0,195,123,0.18)" strokeWidth="0.8" strokeDasharray="3 4">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2+i*0.25}s`} repeatCount="indefinite"/>
        </line>
      ))}
      {/* Nodes */}
      {nodes.map((n,i)=>(
        <g key={i}>
          {n.you && <circle cx={n.x} cy={n.y} r="20" fill="rgba(0,195,123,0.08)">
            <animate attributeName="r" values="18;24;18" dur="2.5s" repeatCount="indefinite"/>
          </circle>}
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.you?"#00c37b":"rgba(255,255,255,0.7)"} opacity={n.you?1:0.6}/>
          {n.you && <text x={n.x} y={n.y+3} textAnchor="middle" fontSize="6" fill="#000" fontWeight="900" fontFamily="monospace">YOU</text>}
        </g>
      ))}
      {/* FRG flow arrows along two edges */}
      {[[160,155,100,105],[160,155,220,105]].map(([x1,y1,x2,y2],i)=>(
        <circle key={i} r="2.5" fill="#00c37b">
          <animateMotion dur={`${1.5+i*0.3}s`} repeatCount="indefinite" path={`M${x1},${y1} L${x2},${y2}`}/>
        </circle>
      ))}
      {/* 10% label on one edge */}
      <text x="130" y="118" fontSize="8" fill="rgba(0,195,123,0.7)" fontFamily="monospace" fontWeight="700">10%</text>
      <text x="178" y="118" fontSize="8" fill="rgba(0,195,123,0.7)" fontFamily="monospace" fontWeight="700">10%</text>
      {/* Outer halo */}
      <circle cx="160" cy="155" r="140" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2 6"/>
    </svg>
  )
}

function ArtLaunch() {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      {/* Deep space background rings */}
      {[150,120,90,60,35].map((r,i)=>(
        <circle key={i} cx="160" cy="150" r={r}
          stroke={i===0?"rgba(0,195,123,0.06)":i===2?"rgba(0,195,123,0.1)":"rgba(255,255,255,0.04)"}
          strokeWidth={i===2?"1.2":"0.7"}/>
      ))}
      {/* Rotating outer dashes */}
      <circle cx="160" cy="150" r="145" stroke="rgba(0,195,123,0.15)" strokeWidth="0.6" strokeDasharray="3 12">
        <animateTransform attributeName="transform" type="rotate" from="0 160 150" to="360 160 150" dur="20s" repeatCount="indefinite"/>
      </circle>
      {/* Badge shape — octagon */}
      <polygon
        points="160,60 200,75 220,115 215,160 190,195 130,195 105,160 100,115 120,75"
        fill="rgba(0,195,123,0.08)" stroke="#00c37b" strokeWidth="1.5"/>
      <polygon
        points="160,70 196,83 214,120 210,161 188,192 132,192 110,161 106,120 124,83"
        fill="none" stroke="rgba(0,195,123,0.25)" strokeWidth="0.6"/>
      {/* Inner star */}
      <polygon points="160,88 167,110 190,110 172,124 179,146 160,132 141,146 148,124 130,110 153,110"
        fill="rgba(0,195,123,0.15)" stroke="#00c37b" strokeWidth="1">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
      </polygon>
      {/* GENESIS text inside badge */}
      <text x="160" y="174" textAnchor="middle" fontSize="8" fontWeight="800" letterSpacing="3"
        fill="rgba(0,195,123,0.7)" fontFamily="monospace">GENESIS</text>
      {/* Rank badge top-right */}
      <circle cx="218" cy="82" r="16" fill="rgba(0,0,0,0.8)" stroke="#00c37b" strokeWidth="1"/>
      <text x="218" y="79" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.5)" fontFamily="monospace">#</text>
      <text x="218" y="89" textAnchor="middle" fontSize="9" fontWeight="800" fill="#00c37b" fontFamily="monospace">001</text>
      {/* Floating sparkles */}
      {[[80,80],[250,190],[90,210],[240,80],[160,250]].map(([x,y],i)=>(
        <g key={i}>
          <line x1={x} y1={y-5} x2={x} y2={y+5} stroke={i%2===0?"#00c37b":"rgba(255,255,255,0.5)"} strokeWidth="1" strokeLinecap="round">
            <animate attributeName="opacity" values="0;1;0" dur={`${1.5+i*0.4}s`} repeatCount="indefinite" begin={`${i*0.3}s`}/>
          </line>
          <line x1={x-5} y1={y} x2={x+5} y2={y} stroke={i%2===0?"#00c37b":"rgba(255,255,255,0.5)"} strokeWidth="1" strokeLinecap="round">
            <animate attributeName="opacity" values="0;1;0" dur={`${1.5+i*0.4}s`} repeatCount="indefinite" begin={`${i*0.3}s`}/>
          </line>
        </g>
      ))}
      {/* Glow pulse from badge */}
      <circle cx="160" cy="130" r="50" fill="rgba(0,195,123,0.04)">
        <animate attributeName="r" values="44;56;44" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite"/>
      </circle>
    </svg>
  )
}

const ARTWORKS = [ArtGenesis, ArtMine, ArtHalving, ArtNetwork, ArtLaunch]

// ─── Dot indicator ────────────────────────────────────────────────────────────
function Dots({ total, current }) {
  return (
    <div style={{display:'flex',gap:6,alignItems:'center',justifyContent:'center'}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{
          height:4, borderRadius:2,
          width: i===current ? 20 : 4,
          background: i===current ? '#00c37b' : 'rgba(255,255,255,0.18)',
          transition:'all 0.35s cubic-bezier(.4,0,.2,1)',
        }}/>
      ))}
    </div>
  )
}

// ─── Main Onboarding component ───────────────────────────────────────────────
export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [direction, setDirection] = useState(1) // 1=forward, -1=back
  const [visible, setVisible] = useState(false)
  const touchStart = useRef(null)
  const slide = SLIDES[step]
  const Art = ARTWORKS[step]

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  const advance = () => {
    if (exiting) return
    if (step < SLIDES.length - 1) {
      setDirection(1)
      setExiting(true)
      setTimeout(() => { setStep(s => s+1); setExiting(false) }, 280)
    } else {
      finish()
    }
  }

  const finish = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    // Fade out whole screen
    setVisible(false)
    setTimeout(() => onDone(), 400)
  }

  // Swipe support
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return
    const dx = touchStart.current - e.changedTouches[0].clientX
    touchStart.current = null
    if (dx > 40) advance()               // swipe left = next
    if (dx < -40 && step > 0) {          // swipe right = back
      setDirection(-1)
      setExiting(true)
      setTimeout(() => { setStep(s => s-1); setExiting(false) }, 280)
    }
  }

  const tx = exiting
    ? (direction > 0 ? 'translateX(-6%) scale(0.97)' : 'translateX(6%) scale(0.97)')
    : 'translateX(0) scale(1)'

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'#000',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        opacity: visible ? 1 : 0,
        transition:'opacity 0.4s ease',
        userSelect:'none', WebkitUserSelect:'none',
        overflowY:'hidden',
      }}
    >
      {/* Noise grain overlay */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none', zIndex:0,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        backgroundSize:'200px 200px', opacity:0.4,
      }}/>

      {/* Skip — top right, subtle */}
      {step < SLIDES.length - 1 && (
        <button onClick={finish} style={{
          position:'absolute', top:'max(50px, 14vh)', right:24,
          background:'none', border:'none', cursor:'pointer',
          fontSize:11, color:'rgba(255,255,255,0.22)', letterSpacing:'0.1em',
          fontFamily:'monospace', padding:'6px 10px', zIndex:10,
        }}>SKIP</button>
      )}

      {/* Centre content — constrained so nothing bleeds into Telegram header/bar */}
      <div style={{
        width:'100%', maxWidth:360,
        padding:'0 28px',
        display:'flex', flexDirection:'column',
        alignItems:'center',
        gap:0,
        transform: tx,
        opacity: exiting ? 0 : 1,
        transition:'transform 0.28s cubic-bezier(.4,0,.2,1), opacity 0.22s ease',
        zIndex:1,
      }}>

        {/* Step counter */}
        <div style={{
          fontSize:9, letterSpacing:'0.18em', color:'rgba(255,255,255,0.2)',
          fontFamily:'monospace', fontWeight:700, marginBottom:20,
          alignSelf:'flex-start',
        }}>
          {String(step+1).padStart(2,'0')} / {String(SLIDES.length).padStart(2,'0')}
        </div>

        {/* Artwork */}
        <div style={{
          width:'min(260px, 72vw)', height:'min(260px, 72vw)',
          marginBottom:28, position:'relative', flexShrink:0,
        }}>
          {/* Subtle radial glow behind artwork */}
          <div style={{
            position:'absolute', inset:'-20%',
            background:`radial-gradient(circle, ${slide.accent}14 0%, transparent 70%)`,
            pointerEvents:'none',
          }}/>
          <Art/>
        </div>

        {/* Headline */}
        <div style={{
          fontSize:'clamp(26px,8vw,34px)',
          fontWeight:900,
          lineHeight:1.1,
          letterSpacing:'-0.03em',
          color:'#fff',
          fontFamily:"'SF Pro Display', 'Helvetica Neue', sans-serif",
          textAlign:'center',
          marginBottom:14,
          whiteSpace:'pre-line',
        }}>
          {slide.headline}
        </div>

        {/* Accent underline */}
        <div style={{
          width:32, height:2, borderRadius:1,
          background:slide.accent, marginBottom:18,
          transition:'background 0.4s',
        }}/>

        {/* Sub text */}
        <div style={{
          fontSize:14, lineHeight:1.65,
          color:'rgba(255,255,255,0.48)',
          textAlign:'center',
          fontFamily:"'SF Pro Text', 'Helvetica Neue', sans-serif",
          maxWidth:300,
          marginBottom:36,
        }}>
          {slide.sub}
        </div>

        {/* Dot indicators */}
        <div style={{marginBottom:28}}>
          <Dots total={SLIDES.length} current={step}/>
        </div>

        {/* CTA button */}
        <button
          onClick={advance}
          style={{
            width:'100%', maxWidth:280,
            padding:'16px 24px',
            borderRadius:14,
            border:'none',
            cursor:'pointer',
            fontSize:13,
            fontWeight:800,
            letterSpacing:'0.1em',
            fontFamily:'monospace',
            transition:'all 0.18s',
            position:'relative',
            overflow:'hidden',
            background: step === SLIDES.length - 1
              ? `linear-gradient(135deg, #007a4c, #009e62, #00b36e)`
              : 'transparent',
            color: step === SLIDES.length - 1 ? 'rgba(0,0,0,0.75)' : slide.accent,
            border: step === SLIDES.length - 1 ? 'none' : `1px solid ${slide.accent}44`,
          }}
        >
          {/* Shimmer on final CTA */}
          {step === SLIDES.length - 1 && (
            <div style={{
              position:'absolute', inset:0,
              background:'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.12) 50%,transparent 65%)',
              animation:'ob-shimmer 2.2s ease infinite',
            }}/>
          )}
          <span style={{position:'relative', zIndex:1}}>{slide.cta}</span>
        </button>

      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes ob-shimmer {
          0%   { transform: translateX(-100%) }
          100% { transform: translateX(200%) }
        }
      `}</style>
    </div>
  )
}

// ─── Hook: useOnboarding ──────────────────────────────────────────────────────
// Use this in App.jsx to gate the onboarding
export function useOnboarding() {
  const [show, setShow] = useState(false) // don't read localStorage on init
  
  const checkOnboarding = (isNewUser) => {
    if (isNewUser) {
      // New user in DB — always show onboarding and clear old flag
      localStorage.removeItem(STORAGE_KEY)
      setShow(true)
    } else {
      // Existing user — only show if they never finished it on this device
      setShow(!localStorage.getItem(STORAGE_KEY))
    }
  }

  const done = () => setShow(false)

  return { showOnboarding: show, onboardingDone: done, checkOnboarding }
}