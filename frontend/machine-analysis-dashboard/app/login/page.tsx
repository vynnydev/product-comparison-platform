import { LoginForm } from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - Cognitiva Analytics",
  description: "Plataforma de análise inteligente para equipamentos industriais, veículos e aeronaves",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern with lighter accent circles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border-2 border-blue-200 rounded-full" />
          <div className="absolute bottom-40 right-20 w-24 h-24 border-2 border-blue-200 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-blue-200 rounded-full" />
          <div className="absolute bottom-20 left-1/3 w-20 h-20 border-2 border-blue-200 rounded-full" />
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">Cognitiva Analytics</h1>
          <p className="text-xl text-blue-100 max-w-md leading-relaxed">
            Plataforma inteligente de análise preditiva para monitorar, diagnosticar e otimizar equipamentos
            industriais, veículos, aeronaves e maquinário em geral.
          </p>
        </div>

        {/* Equipment Illustrations - Enhanced with better colors */}
        <div className="relative z-10 flex items-end justify-center gap-8 pb-4">
          {/* Factory with Smokestacks */}
          <div className="flex flex-col items-center">
            <svg width="100" height="120" viewBox="0 0 100 120" fill="none" className="drop-shadow-2xl">
              {/* Main Building */}
              <rect x="20" y="60" width="60" height="60" rx="3" fill="rgba(147, 197, 253, 0.4)" />
              {/* Windows */}
              <g opacity="0.8">
                {[0, 1, 2].map((row) =>
                  [0, 1, 2, 3].map((col) => (
                    <rect
                      key={`${row}-${col}`}
                      x={28 + col * 12}
                      y={70 + row * 15}
                      width="8"
                      height="10"
                      rx="1"
                      fill="#93c5fd"
                      className="animate-pulse"
                      style={{ animationDelay: `${(row + col) * 0.2}s` }}
                    />
                  )),
                )}
              </g>
              {/* Smokestacks */}
              <rect x="30" y="35" width="8" height="28" rx="1" fill="rgba(191, 219, 254, 0.5)" />
              <rect x="50" y="40" width="8" height="23" rx="1" fill="rgba(191, 219, 254, 0.5)" />
              <rect x="62" y="45" width="8" height="18" rx="1" fill="rgba(191, 219, 254, 0.5)" />
              {/* Smoke */}
              <circle cx="34" cy="30" r="4" fill="rgba(224, 242, 254, 0.6)" className="animate-pulse" />
              <circle cx="36" cy="25" r="5" fill="rgba(224, 242, 254, 0.5)" className="animate-pulse" />
              <circle cx="54" cy="35" r="4" fill="rgba(224, 242, 254, 0.6)" className="animate-pulse" />
              <circle cx="66" cy="40" r="4" fill="rgba(224, 242, 254, 0.6)" className="animate-pulse" />
              {/* Door */}
              <rect x="45" y="100" width="12" height="20" rx="1" fill="rgba(59, 130, 246, 0.6)" />
            </svg>
          </div>

          {/* Commercial Airplane */}
          <div className="flex flex-col items-center">
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none" className="drop-shadow-2xl">
              {/* Fuselage */}
              <ellipse cx="55" cy="55" rx="12" ry="30" fill="rgba(147, 197, 253, 0.5)" />
              {/* Cockpit Windows */}
              <ellipse cx="55" cy="35" rx="6" ry="8" fill="rgba(59, 130, 246, 0.6)" />
              <circle cx="55" cy="32" r="3" fill="rgba(96, 165, 250, 0.7)" />
              {/* Main Wings */}
              <ellipse cx="55" cy="52" rx="45" ry="10" fill="rgba(191, 219, 254, 0.6)" />
              {/* Wing Details */}
              <ellipse cx="55" cy="52" rx="42" ry="7" fill="rgba(147, 197, 253, 0.4)" />
              {/* Tail Wing */}
              <path d="M 50 78 L 55 95 L 60 78 Z" fill="rgba(147, 197, 253, 0.5)" />
              {/* Vertical Stabilizer */}
              <path d="M 50 80 L 55 98 L 60 80 Z" fill="rgba(191, 219, 254, 0.6)" />
              {/* Engines */}
              <ellipse cx="35" cy="58" rx="5" ry="8" fill="rgba(147, 197, 253, 0.45)" />
              <ellipse cx="75" cy="58" rx="5" ry="8" fill="rgba(147, 197, 253, 0.45)" />
              <circle cx="35" cy="62" r="3" fill="rgba(59, 130, 246, 0.5)" />
              <circle cx="75" cy="62" r="3" fill="rgba(59, 130, 246, 0.5)" />
            </svg>
          </div>

          {/* Sports Car */}
          <div className="flex flex-col items-center">
            <svg width="95" height="90" viewBox="0 0 95 90" fill="none" className="drop-shadow-2xl">
              {/* Car Body */}
              <path
                d="M 15 50 L 20 45 L 30 40 L 40 38 L 55 38 L 65 40 L 75 45 L 80 50 L 80 60 L 15 60 Z"
                fill="rgba(147, 197, 253, 0.5)"
              />
              {/* Roof */}
              <path d="M 30 40 L 35 32 L 60 32 L 65 40 Z" fill="rgba(191, 219, 254, 0.6)" />
              {/* Windshield */}
              <path d="M 32 38 L 36 33 L 59 33 L 63 38 Z" fill="rgba(59, 130, 246, 0.6)" />
              {/* Side Windows */}
              <path d="M 34 40 L 36 36 L 45 36 L 45 40 Z" fill="rgba(59, 130, 246, 0.5)" />
              <path d="M 50 40 L 50 36 L 59 36 L 62 40 Z" fill="rgba(59, 130, 246, 0.5)" />
              {/* Wheels */}
              <circle
                cx="28"
                cy="60"
                r="8"
                fill="rgba(147, 197, 253, 0.6)"
                stroke="rgba(191, 219, 254, 0.8)"
                strokeWidth="2"
              />
              <circle cx="28" cy="60" r="5" fill="rgba(59, 130, 246, 0.6)" />
              <circle
                cx="67"
                cy="60"
                r="8"
                fill="rgba(147, 197, 253, 0.6)"
                stroke="rgba(191, 219, 254, 0.8)"
                strokeWidth="2"
              />
              <circle cx="67" cy="60" r="5" fill="rgba(59, 130, 246, 0.6)" />
              {/* Headlights */}
              <circle cx="75" cy="48" r="2" fill="rgba(254, 240, 138, 0.8)" className="animate-pulse" />
              <circle cx="75" cy="52" r="2" fill="rgba(254, 240, 138, 0.8)" className="animate-pulse" />
              {/* Ground Shadow */}
              <ellipse cx="47" cy="68" rx="35" ry="3" fill="rgba(0,0,0,0.2)" />
            </svg>
          </div>

          {/* Animated Gears */}
          <div className="flex flex-col items-center gap-3">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="animate-spin-slow drop-shadow-lg">
              <circle
                cx="25"
                cy="25"
                r="12"
                fill="rgba(147, 197, 253, 0.5)"
                stroke="rgba(191, 219, 254, 0.7)"
                strokeWidth="2"
              />
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <rect
                  key={angle}
                  x="23"
                  y="10"
                  width="4"
                  height="8"
                  rx="1"
                  fill="rgba(191, 219, 254, 0.7)"
                  style={{ transformOrigin: "25px 25px", transform: `rotate(${angle}deg)` }}
                />
              ))}
              <circle cx="25" cy="25" r="6" fill="rgba(59, 130, 246, 0.6)" />
            </svg>
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
              className="animate-spin-slow-reverse drop-shadow-lg"
              style={{ marginTop: "-10px", marginLeft: "20px" }}
            >
              <circle
                cx="17.5"
                cy="17.5"
                r="8"
                fill="rgba(147, 197, 253, 0.5)"
                stroke="rgba(191, 219, 254, 0.7)"
                strokeWidth="1.5"
              />
              {[0, 72, 144, 216, 288].map((angle) => (
                <rect
                  key={angle}
                  x="16"
                  y="7"
                  width="3"
                  height="6"
                  rx="1"
                  fill="rgba(191, 219, 254, 0.7)"
                  style={{ transformOrigin: "17.5px 17.5px", transform: `rotate(${angle}deg)` }}
                />
              ))}
              <circle cx="17.5" cy="17.5" r="4" fill="rgba(59, 130, 246, 0.6)" />
            </svg>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 text-blue-100 text-sm">Cognitiva Analytics - Análise Preditiva v3.0</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
