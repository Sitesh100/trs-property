'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsappStrip = ({ phoneNumber = "917024144040", message = "Hello Team TRS, I would like to get a call back. I am looking for properties." }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Auto-show animation on mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="relative w-full z-10 animate-slide-down">
      <div className="relative overflow-hidden">
        {/* Animated gradient background - darker version */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#C6A256]/10 to-[#C6A256]/8 animate-gradient-x" />
        
        {/* Animated glow effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
        </div>

        {/* Content */}
        <div className="relative px-4 md:px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Left side - Message */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Animated WhatsApp icon */}
              <div 
                className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-pulse-slow"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <MessageCircle 
                  className={`w-5 h-5 text-white transition-transform duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`}
                />
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm md:text-base font-medium truncate">
                  Need help? Talk to our expert.
                </p>
              </div>
            </div>

            {/* Right side - CTA Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsAppClick}
                className="group relative px-4 md:px-6 py-2 bg-white rounded-full font-semibold text-[#492974] text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
              >
                {/* Button shimmer effect */}
                <div className="absolute cursor-pointer inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <span className="relative flex items-center gap-2">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-5 h-5 fill-current cursor-pointer transition-transform duration-300 group-hover:rotate-12"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span className="hidden md:inline cursor-pointer">WhatsApp</span>
                </span>
              </button>

              {/* Close button */}
              {/* <button
                onClick={() => setIsVisible(false)}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-white" />
              </button> */}
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>

      {/* Custom animations styles */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          50% {
            opacity: 0.9;
            box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default WhatsappStrip;
