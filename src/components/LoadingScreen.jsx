import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import iscsLogo from "@/assets/iscs-logo.png";

export default function LoadingScreen({ onLoadingComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 3000); 

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo Container with Animations */}
        <div className="relative">
          {/* Rotating Ring */}
          <div className="absolute inset-0 -m-4">
            <div className="w-full h-full border-4 border-transparent border-t-green-500 border-r-blue-500 rounded-full animate-spin"></div>
          </div>
          
          {/* Pulsing Ring */}
          <div className="absolute inset-0 -m-2">
            <div className="w-full h-full border-2 border-green-300 rounded-full animate-ping opacity-75"></div>
          </div>

          {/* Logo Box */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl ring-1 ring-gray-200 transform hover:scale-105 transition-transform duration-300 animate-fade-in">
            <div className="w-48 h-48 flex items-center justify-center relative overflow-hidden">
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              {/* ISCS Logo */}
              <div className="relative z-10 animate-float">
                <img
                  src={iscsLogo}
                  alt="ISCS Logo"
                  className="h-24 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-4 animate-fade-in-delayed">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            Loading Your Workspace
          </h2>
          <p className="text-gray-600 animate-pulse">
            Preparing your dashboard...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden animate-fade-in-delayed">
          <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-progress"></div>
        </div>

        {/* Loading Dots */}
        <div className="flex gap-2 animate-fade-in-delayed">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 3s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.6s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}