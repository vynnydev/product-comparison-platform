import { SignUpForm } from "@/components/signup-form"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border-2 border-blue-200 rounded-full" />
          <div className="absolute bottom-40 right-20 w-24 h-24 border-2 border-blue-200 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-blue-200 rounded-full" />
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Bem-vindo ao
            <br />
            Cognitiva Analytics
          </h1>
          <p className="text-xl text-blue-100 max-w-md leading-relaxed">
            Cadastre-se para começar a monitorar e analisar seus equipamentos industriais, veículos e aeronaves com
            inteligência artificial preditiva.
          </p>
        </div>

        {/* Equipment Illustrations with improved colors */}
        <div className="relative z-10 flex items-end justify-center gap-6">
          {/* Factory */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-20 bg-blue-300/30 backdrop-blur-sm rounded-t-lg relative border border-blue-200/40">
              <div className="absolute top-2 left-2 right-2 grid grid-cols-2 gap-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full h-2 bg-blue-400/50 rounded-sm" />
                ))}
              </div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-4 bg-blue-200/40 rounded-t">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-100/50 rounded-full blur-sm animate-pulse" />
              </div>
            </div>
          </div>

          {/* Airplane */}
          <div className="flex flex-col items-center">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="drop-shadow-lg">
              <ellipse cx="40" cy="45" rx="8" ry="20" fill="rgba(147, 197, 253, 0.4)" />
              <rect x="15" y="40" width="50" height="8" rx="4" fill="rgba(191, 219, 254, 0.5)" />
              <path d="M 36 60 L 40 70 L 44 60 Z" fill="rgba(147, 197, 253, 0.4)" />
              <path d="M 35 65 L 40 72 L 45 65 Z" fill="rgba(191, 219, 254, 0.5)" />
              <circle cx="40" cy="30" r="5" fill="rgba(59, 130, 246, 0.5)" />
            </svg>
          </div>

          {/* Car */}
          <div className="flex flex-col items-center">
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none" className="drop-shadow-lg">
              <rect x="15" y="35" width="40" height="15" rx="4" fill="rgba(147, 197, 253, 0.4)" />
              <path d="M 25 35 L 30 25 L 45 25 L 50 35 Z" fill="rgba(191, 219, 254, 0.5)" />
              <rect x="28" y="27" width="7" height="7" rx="1" fill="rgba(59, 130, 246, 0.5)" />
              <rect x="38" y="27" width="7" height="7" rx="1" fill="rgba(59, 130, 246, 0.5)" />
              <circle
                cx="25"
                cy="50"
                r="5"
                fill="rgba(147, 197, 253, 0.5)"
                stroke="rgba(191, 219, 254, 0.7)"
                strokeWidth="2"
              />
              <circle
                cx="45"
                cy="50"
                r="5"
                fill="rgba(147, 197, 253, 0.5)"
                stroke="rgba(191, 219, 254, 0.7)"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Gears */}
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 border-4 border-blue-200/60 rounded-full flex items-center justify-center animate-spin-slow">
              <div className="w-3 h-3 bg-blue-300/70 rounded-full" />
            </div>
            <div className="w-7 h-7 border-3 border-blue-200/60 rounded-full flex items-center justify-center animate-spin-slow-reverse">
              <div className="w-2 h-2 bg-blue-300/70 rounded-full" />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 text-blue-100 text-sm">Cognitiva Analytics - Análise Preditiva v3.0</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
        <div className="w-full max-w-md">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}
