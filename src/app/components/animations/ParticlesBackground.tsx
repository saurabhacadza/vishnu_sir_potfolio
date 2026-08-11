'use client'

import React, { useEffect, useState } from 'react'

// soft blobs (bigger now)
const SHAPES = [
  { w: 340, h: 340, top: '6%', left: '4%', blur: 45, opacity: 0.22 },
  { w: 420, h: 420, top: '20%', left: '68%', blur: 60, opacity: 0.2 },
  { w: 320, h: 320, top: '54%', left: '10%', blur: 40, opacity: 0.16 },
  { w: 380, h: 380, top: '68%', left: '70%', blur: 60, opacity: 0.14 },
  { w: 260, h: 260, top: '38%', left: '40%', blur: 36, opacity: 0.12 },
]

// maths symbols drifting
const MATH_SYMBOLS = [
  { text: '∫', top: '14%', left: '16%', dur: 22 },
  { text: 'π', top: '30%', left: '78%', dur: 26 },
  { text: 'Σ', top: '58%', left: '8%', dur: 24 },
  { text: 'dx', top: '68%', left: '46%', dur: 28 },
  { text: 'lim', top: '42%', left: '60%', dur: 30 },
]

// chemistry orbitals (small)
const CHEM_POINTS = [
  { top: '16%', left: '52%', size: 70 },
  { top: '46%', left: '26%', size: 60 },
  { top: '62%', left: '78%', size: 72 },
]

// physics wave bars
const PHYSICS_BARS = [
  { top: '10%', left: '-12%', width: '38%', delay: 0 },
  { top: '46%', left: '-6%', width: '32%', delay: 4 },
  { top: '78%', left: '-10%', width: '44%', delay: 7 },
]

// mechanics / pulleys
const PULLEYS = [
  { top: '24%', left: '10%', delay: 0 },
  { top: '65%', left: '64%', delay: 3 },
]

// bigger chemistry atom clusters
const ATOM_CLUSTERS = [
  { top: '12%', left: '84%' },
  { top: '74%', left: '6%' },
]

export default function ParticlesBackground() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="rw-bg-layer" aria-hidden>
      {/* soft blobs */}
      {SHAPES.map((shape, index) => (
        <div
          key={`blob-${index}`}
          className="rw-bg-shape"
          style={{
            top: shape.top,
            left: shape.left,
            width: shape.w,
            height: shape.h,
            opacity: shape.opacity,
            filter: `blur(${shape.blur}px)`,
            animationDelay: `${index * 2}s`,
          }}
        />
      ))}

      {/* maths symbols */}
      {MATH_SYMBOLS.map((symbol, index) => (
        <div
          key={`math-${index}`}
          className="rw-math-symbol"
          style={{ top: symbol.top, left: symbol.left, animationDuration: `${symbol.dur}s` }}
        >
          {symbol.text}
        </div>
      ))}

      {/* chemistry orbitals */}
      {CHEM_POINTS.map((chem, index) => (
        <div
          key={`chem-${index}`}
          className="rw-chem-orbit"
          style={{ top: chem.top, left: chem.left, width: chem.size, height: chem.size }}
        >
          <span className="rw-chem-core" />
          <span className="rw-chem-electron" />
        </div>
      ))}

      {/* physics waves */}
      {PHYSICS_BARS.map((bar, index) => (
        <div
          key={`phys-${index}`}
          className="rw-physics-wave"
          style={{ top: bar.top, left: bar.left, width: bar.width, animationDelay: `${bar.delay}s` }}
        />
      ))}

      {/* mechanics pulleys */}
      {PULLEYS.map((pulley, index) => (
        <div
          key={`pulley-${index}`}
          className="rw-phys-pulley"
          style={{ top: pulley.top, left: pulley.left, animationDelay: `${pulley.delay}s` }}
        >
          <span className="rw-phys-wheel" />
          <span className="rw-phys-rope" />
          <span className="rw-phys-weight" />
        </div>
      ))}

      {/* chemistry atom clusters */}
      {ATOM_CLUSTERS.map((cluster, index) => (
        <div
          key={`atom-${index}`}
          className="rw-chem-atom-cluster"
          style={{ top: cluster.top, left: cluster.left }}
        >
          <span className="chem-node chem-node--1" />
          <span className="chem-node chem-node--2" />
          <span className="chem-node chem-node--3" />
          <span className="chem-bond chem-bond--1" />
          <span className="chem-bond chem-bond--2" />
        </div>
      ))}
    </div>
  )
}
