"use client";

import { ZoomIn } from "lucide-react";

interface SlipImageProps {
  src: string;
}

export default function SlipImage({ src }: SlipImageProps) {
  const handleOpenImage = () => {
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Verification Terminal - Digital Evidence</title>
            <style>
              body { 
                margin: 0; 
                background: #000; 
                display: flex; 
                flex-direction: column;
                align-items: center; 
                justify-content: center; 
                min-height: 100vh; 
                font-family: 'Inter', sans-serif; 
                color: white;
                overflow: hidden;
              }
              .container {
                position: relative;
                max-width: 90%;
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              img { 
                max-width: 100%; 
                max-height: 75vh; 
                border-radius: 20px; 
                box-shadow: 0 0 100px rgba(37, 99, 235, 0.2); 
                border: 1px solid #222;
                transition: transform 0.3s ease;
              }
              .controls {
                margin-top: 30px;
                display: flex;
                gap: 20px;
                align-items: center;
              }
              .close-btn {
                background: #ef4444;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 12px;
                font-weight: 900;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 2px;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
              }
              .close-btn:hover {
                background: #dc2626;
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(239, 68, 68, 0.4);
              }
              .close-btn:active {
                transform: translateY(0);
              }
              .header {
                position: absolute;
                top: -50px;
                left: 0;
                font-size: 10px;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 4px;
                color: #444;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">Evidence Secure-Link: Active</div>
              <img src="${src}" alt="Slip" />
              <div class="controls">
                <button class="close-btn" onclick="window.close()">Close Terminal</button>
              </div>
            </div>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="mt-2 group/slip">
      <p className="text-[7px] font-black uppercase text-zinc-600 mb-1 tracking-widest">Verification Slip</p>
      <div 
        onClick={handleOpenImage}
        className="relative w-24 h-16 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer shadow-lg hover:border-blue-500/50 transition-all"
      >
        <img 
          src={src} 
          alt="Payment Slip" 
          className="w-full h-full object-cover grayscale group-hover/slip:grayscale-0 transition-all duration-500 group-hover/slip:scale-110" 
        />
        <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover/slip:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <ZoomIn size={16} className="text-white" />
        </div>
      </div>
    </div>
  );
}
