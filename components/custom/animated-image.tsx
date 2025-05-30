'use client';

import NextImage from 'next/image';
import { useEffect, useState } from 'react';

interface AnimatedImageProps {
  src: string;
  alt: string;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({ src, alt }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 500); // Delay before starting animations
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative inline-block mt-8 w-[300px] h-[300px] sm:w-[350px] sm:h-[350px]">
      {/* Container for the image and its animated effects, matching image size */}
      <div className={`relative w-full h-full ${animate ? 'start-animation' : ''}`}>
        {/* Animated Border Part 1 (Top/Right) */}
        {animate && (
          <div
            className="absolute box-border border-transparent animate-borderIn z-0"
            // Initial style (size, position, border width/color) is set by keyframe 0%
          />
        )}

        {/* Animated Border Part 2 (Bottom/Left) */}
        {animate && (
          <div
            className="absolute box-border border-transparent animate-borderInTwo z-0"
            // Initial style (size, position, border width/color) is set by keyframe 0%
          />
        )}
        
        {/* Cover Element - animates on top of the image before image appears */}
        {animate && (
          <div className="absolute top-0 h-full bg-primary animate-coverOut z-[1]" />
        )}

        {/* The actual image */}
        <NextImage
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 300px, 350px"
          className={`object-cover transition-opacity duration-100 transform scale-100 ${
            animate ? 'opacity-100 animate-imageIn' : 'opacity-0'
          } relative z-[2]`} // Image itself needs to be above cover during reveal
        />
      </div>
    </div>
  );
};

export default AnimatedImage;
