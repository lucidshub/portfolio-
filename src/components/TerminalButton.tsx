"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import IsometricButton from "./ui/isometric-button";

const CHAR_DELAY = 90;
const START_DELAY = 800;

let ctx: AudioContext | null = null;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function playClick() {
  try {
    const c = getCtx();
    const now = c.currentTime;

    // soft thock body
    const osc = c.createOscillator();
    const oscGain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
    oscGain.gain.setValueAtTime(0.2, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(oscGain).connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.1);

    // warm bottom resonance
    const osc2 = c.createOscillator();
    const osc2Gain = c.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(250, now + 0.005);
    osc2.frequency.exponentialRampToValueAtTime(80, now + 0.12);
    osc2Gain.gain.setValueAtTime(0.12, now + 0.005);
    osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc2.connect(osc2Gain).connect(c.destination);
    osc2.start(now + 0.005);
    osc2.stop(now + 0.14);

    // gentle top tick
    const osc3 = c.createOscillator();
    const osc3Gain = c.createGain();
    osc3.type = "triangle";
    osc3.frequency.setValueAtTime(1800, now);
    osc3.frequency.exponentialRampToValueAtTime(600, now + 0.025);
    osc3Gain.gain.setValueAtTime(0.06, now);
    osc3Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc3.connect(osc3Gain).connect(c.destination);
    osc3.start(now);
    osc3.stop(now + 0.035);
  } catch {}
}

export default function TerminalButton({ onOpen, text = "terminal" }: { onOpen?: () => void; text?: string }) {
  const [displayed, setDisplayed] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    // Reset typing effect when text changes
    setTypingDone(false);
    setDisplayed("");
    indexRef.current = 0;

    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        indexRef.current++;
        if (indexRef.current <= text.length) {
          setDisplayed(text.slice(0, indexRef.current));
        } else {
          setTypingDone(true);
          clearInterval(interval);
        }
      }, CHAR_DELAY);
      return () => clearInterval(interval);
    }, START_DELAY);
    return () => clearTimeout(startTimer);
  }, [text]);

  const handleClick = useCallback(() => {
    playClick();
    onOpen?.();
  }, [onOpen]);

  const label = typingDone ? text : `${displayed}\u2582`;

  return (
    <IsometricButton
      label={label}
      showText={true}
      colors={{
        fill: "#0c1a2e",
        textColor: "#7ab8f5",
        hoverTextColor: "#ffffff",
      }}
      prism={{
        color: "#3876ba",
        float: 8,
        intensity: 120,
        thickness: 15,
        hoverFloat: 7,
      }}
      icon={{
        side: "left",
        size: 20,
        type: "symbol",
        color: "#7ab8f5",
        hoverColor: "#ffffff",
        symbol: ">_",
        padding: 0,
        rounded: 0,
      }}
      addIcon={true}
      padding="15px 30px"
      rounded={40}
      camera={{ tilt: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 14, mass: 1 }}
      onClick={handleClick}
    />
  );
}
