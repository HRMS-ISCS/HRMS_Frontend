// src/auth/LoadingScreen.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getCurrentUser, hasValidToken } from "../api";

export default function LoadingScreen({ onLoadingComplete }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nameAnimationComplete, setNameAnimationComplete] = useState(false);
  const [displayedName, setDisplayedName] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch user data if we have a valid token
    const fetchUserData = async () => {
      // Check if we have a valid token before trying to fetch user data
      if (!hasValidToken()) {
        setLoading(false);
        handleTransition();
        return;
      }

      try {
        const user = await getCurrentUser();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // If we get an error fetching user data, don't keep trying
        // Just complete the loading process
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    return () => {};
  }, []);

  // Animate name letter by letter
  useEffect(() => {
    if (!loading && userData && userData.first_name) {
      const fullName = userData.first_name;
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex <= fullName.length) {
          setDisplayedName(fullName.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setNameAnimationComplete(true);
        }
      }, 100); // Adjust speed of letter appearance
      
      return () => clearInterval(interval);
    }
  }, [loading, userData]);

  // Handle transition when name animation completes
  useEffect(() => {
    if (nameAnimationComplete) {
      // Wait a moment after name animation completes before starting fade out
      const timer = setTimeout(() => {
        handleTransition();
      }, 1500); // Increased wait time to allow user to see their name
      
      return () => clearTimeout(timer);
    }
  }, [nameAnimationComplete]);

  // Handle the transition out
  const handleTransition = () => {
    setIsFadingOut(true);
    // Wait for fade out animation to complete before calling onLoadingComplete
    setTimeout(() => {
      onLoadingComplete();
      // Navigate to the appropriate dashboard based on user role
      if (userData) {
        if (userData.role === "employee") {
          navigate("/employees");
        } else {
          navigate("/dashboard");
        }
      }
    }, 500); // Match this with the fade-out animation duration
  };

  return (
    <div className={`min-h-screen bg-white flex items-center justify-center relative overflow-hidden transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100 to-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-yellow-100 to-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content - No Cards */}
      <div className={`relative z-10 flex flex-col items-center space-y-12 transition-all duration-500 ${isFadingOut ? 'scale-95' : 'scale-100'}`}>
        {/* Welcome Message with User Name - Letter by Letter Animation */}
        <div className="text-center space-y-6">
          {/* Name Display */}
          {!loading && userData && (
            <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
              <span className="text-6xl font-light text-gray-800 drop-shadow-lg" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                Hi,
              </span>
              <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 drop-shadow-lg tracking-wide">
                {displayedName}!
              </span>
            </div>
          )}
          
          {/* Full Name Display - No Avatar Card */}
          {!loading && userData && nameAnimationComplete && (
            <div className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-green-500 animate-float-in tracking-wide">
              {userData.first_name && userData.last_name 
                ? `${userData.first_name} ${userData.last_name}` 
                : userData.username || 'User'
              }
            </div>
          )}
          
          <p className="text-xl text-gray-600 animate-pulse flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Welcome to HRMS
          </p>
        </div>

        {/* Progress Bar - No Card */}
        <div className="w-96 h-3 bg-gray-200 rounded-full overflow-hidden animate-fade-in-delayed">
          <div className="h-full bg-gradient-to-r from-purple-600 via-blue-500 to-green-500 rounded-full animate-progress"></div>
        </div>

        {/* Loading Dots - No Card */}
        <div className="flex gap-4 animate-fade-in-delayed">
          <div className="w-5 h-5 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-5 h-5 bg-green-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Pacifico&family=Satisfy&display=swap');
        
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

        @keyframes float-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
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

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
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

        .animate-float-in {
          animation: float-in 1s ease-out forwards;
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

        .cursive-text {
          font-family: 'Dancing Script', 'Pacifico', 'Satisfy', cursive;
          background: linear-gradient(90deg, #8b5cf6, #ec4899, #3b82f6);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        .modern-text {
          background: linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
          letter-spacing: 0.05em;
          text-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}