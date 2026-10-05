"use client";

import { useEffect, useState } from "react";

export function GridOverlay() {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Activer/Désactiver la grille avec la touche 'G'
      if ((e.key === "g" || e.key === "G") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setIsOn((prev) => {
          const next = !prev;
          document.body.classList.toggle("grid-on", next);
          return next;
        });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Alignement optique : l'encre des glyphes sur la ligne, pas leur boîte
  useEffect(() => {
    const align = () => {
      const cvs = document.createElement("canvas");
      const ctx = cvs.getContext("2d");
      if (!ctx) return;
      
      const displayElements = document.querySelectorAll(".opt-align");
      displayElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.marginLeft = "0px";
        const cs = getComputedStyle(htmlEl);
        let ch = (htmlEl.textContent || "").trim().charAt(0);
        if (!ch) return;
        if (cs.textTransform === "uppercase") ch = ch.toUpperCase();
        
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        ctx.textAlign = "left";
        const abl = ctx.measureText(ch).actualBoundingBoxLeft;
        
        // Si l'encre dépasse à gauche, on décale la boîte pour que l'encre touche la ligne
        if (isFinite(abl)) {
            htmlEl.style.marginLeft = `${abl.toFixed(2)}px`;
        }
      });
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(align);
    } else {
      align();
    }
    
    let t: NodeJS.Timeout;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(align, 120);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="guides" aria-hidden="true">
      <div className="cols">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="col">
            <span>{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="rows" />
      <div className="mline l" />
      <div className="mline r" />
      
      <button 
        className={`fixed top-4 right-4 z-[200] flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-widest font-mono cursor-pointer border-none transition-colors ${isOn ? 'bg-[#e4002b] text-white' : 'bg-[#111315] text-white'}`}
        onClick={() => {
          setIsOn((prev) => {
            const next = !prev;
            document.body.classList.toggle("grid-on", next);
            return next;
          });
        }}
        aria-pressed={isOn}
        title="Appuyez sur G pour basculer"
      >
        <span className={`w-2 h-2 rounded-full ${isOn ? 'bg-white' : 'bg-[#555]'}`} />
        <span>{isOn ? 'Hide Grid' : 'Show Grid'}</span>
      </button>
    </div>
  );
}
