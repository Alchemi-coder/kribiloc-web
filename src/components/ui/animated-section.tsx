"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({ children, className = "", delay = 0 }: AnimatedSectionProps) {
  const ref = useRef(null);
  // Remove the negative margin so it triggers instantly when on screen,
  // even if it's at the very top of the page.
  const isInView = useInView(ref, { once: true, amount: "some" });
  
  // Failsafe: if for some reason IntersectionObserver fails, show content after a short delay
  const [failsafeVisible, setFailsafeVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setFailsafeVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const isVisible = isInView || failsafeVisible;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
