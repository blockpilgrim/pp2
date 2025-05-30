'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HomePage() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-2 sm:p-4 lg:p-6 bg-background text-foreground font-sans">
      <main className="container mx-auto" role="main">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 mt-6 mb-12 lg:mt-8 lg:mb-16 px-4">
          {/* Copy Container */}
          <div className="lg:flex-1 lg:basis-2/5 xl:basis-1/3 text-center lg:text-left order-2 lg:order-1 max-w-xl">
            <h1 className="text-[36px] sm:text-[40px] font-extrabold text-[color:var(--nav-background)] leading-tight">
              Portal POC Showcase
              <br />
              <span style={{ color: '#535E66' }}>(Work In Progress)</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground">
            This tech demo shows what our chosen stack can do. It's not meant to be a complete prototype (yet), but a foundation of tested components and patterns. Explore the various proof-of-concept modules to see the tech stack in action and get a feel for the tools we'll use to build the full partner portal.
            </p>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">3... 2... 1...</p>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground flex items-center justify-center lg:justify-start">
              Let's go!!!
              <Image
                src="/rocket-emoji.jpg"
                alt="Rocket emoji"
                width={25}
                height={25}
                className="ml-2"
              />
            </p>
          </div>

          {/* Image Holder */}
          <div
            className={`img-holder order-1 lg:order-2 relative mt-8 lg:mt-0 w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] flex-shrink-0 ${ // Added flex-shrink-0
              isAnimated ? 'animate' : ''
            }`}
          >
            <span className="border-animation-span"></span>
            <Image
              id="rocket-img"
              src="/child-with-rocket.png"
              alt="Child with rocket"
              width={350}
              height={350}
              className="object-contain w-full h-full" // Initial opacity/transform handled by .img-holder img in globals.css
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}