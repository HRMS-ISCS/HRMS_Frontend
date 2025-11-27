// src/components/AboutISCS.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import aiImage from "@/assets/aiimage.jpg";
import ai2Image from "@/assets/ai2image.jpg";

export default function AboutISCS() {
  const [displayedText, setDisplayedText] = useState('');
  const [currentSection, setCurrentSection] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const navigate = useNavigate();

  // Content sections to display
  const contentSections = [
    {
      text: "As a pioneer in digital transformation, we provide end-to-end IT solutions leveraging AI, cloud computing, and data analytics to empower our clients.",
      textClass: "text-xl text-gray-700 leading-relaxed max-w-3xl",
      showImage: false
    },
    {
      text: "Our global consulting team, with extensive domain experience, helps organizations achieve their goals from enterprise integration to customized digital solutions.",
      textClass: "text-xl text-gray-700 leading-relaxed max-w-3xl",
      showImage: true,
      imageSource: aiImage,
      imageAlt: "Digital Transformation Innovation"
    },
    {
      text: "We drive growth, efficiency, and resilience for our clients through innovative technology solutions.",
      textClass: "text-xl text-gray-700 leading-relaxed max-w-3xl",
      showImage: true,
      imageSource: ai2Image,
      imageAlt: "Future Technology Solutions"
    }
  ];

  // Typing animation effect
  useEffect(() => {
    if (currentSection >= contentSections.length) {
      // When all sections are displayed, transition to loading screen
      setTimeout(() => {
        handleTransition();
      }, 2000);
      return;
    }

    const section = contentSections[currentSection];
    const text = section.text;
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        // Move to next section after a pause
        setTimeout(() => {
          if (currentSection < contentSections.length - 1) {
            setCurrentSection(currentSection + 1);
            setDisplayedText('');
          }
        }, 1500);
      }
    }, 50); // Speed of typing
    
    return () => clearInterval(interval);
  }, [currentSection]);

  const handleSkip = () => {
    handleTransition();
  };

  const handleTransition = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      navigate('/loading');
    }, 500);
  };

  const currentContent = contentSections[currentSection] || {};
  const contentClass = currentContent.textClass;
  const shouldShowImage = currentContent.showImage;
  const currentImage = currentContent.imageSource;
  const imageAlt = currentContent.imageAlt;

  return (
    <div className={`min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100 to-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-yellow-100 to-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center space-y-8 px-8 transition-all duration-500 ${isFadingOut ? 'scale-95' : 'scale-100'} w-full`}>
        {/* ISCS Technologies Title with Gradient */}
        <div className="text-center mb-4">
          <h1 className="text-6xl font-bold">
            <span className="text-orange-500">ISCS</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600"> Technologies</span>
          </h1>
          <h2 className="text-2xl text-gray-800 mt-2">Innovative Strategic Consulting Services</h2>
        </div>

        {/* Content with optional image */}
        <div className={`flex ${shouldShowImage ? 'justify-between' : 'justify-center'} items-center w-full max-w-6xl`}>
          {/* Display the current section with typing effect */}
          {currentSection < contentSections.length && (
            <div className={`${shouldShowImage ? 'w-1/2 pr-8' : 'w-full'} text-center ${contentClass}`}>
              {displayedText}
              <span className="inline-block w-1 h-6 bg-gray-600 ml-1 animate-pulse"></span>
            </div>
          )}

          {/* Display image when needed */}
          {shouldShowImage && currentImage && (
            <div className="w-1/2 flex justify-center">
              <img 
                src={currentImage} 
                alt={imageAlt} 
                className="rounded-lg shadow-lg max-w-full h-auto"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}
        </div>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {/* Skip Button */}
          <button 
            onClick={handleSkip}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Skip
          </button>
          
          {/* Learn More Button - External Link */}
          <a 
            href="https://iscstech.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
              />
            </svg>
            Learn more about ISCS
          </a>
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

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}