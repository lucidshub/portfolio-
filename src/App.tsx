import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "./components/Loader";
import { Nav } from "./components/Nav";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Learning } from "./pages/Learning";
import { Projects } from "./pages/Projects";
import { Contact } from "./pages/Contact";

const PAGES: Record<string, (props: { onNavigate: (p: string) => void }) => JSX.Element> = {
  home: Home,
  about: About,
  learning: Learning,
  projects: Projects,
  contact: Contact,
};

export default function App() {
  const [page, setPage] = useState("home");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLoading(false);
    } else {
      setTimeout(() => setLoading(false), 1400);
    }

    // Global soothing click sound
    let audioCtx: AudioContext | null = null;
    const playClickSound = () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") audioCtx.resume();
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      // Crisp, obvious click sound
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      // Faster attack, much higher gain
      gainNode.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.002);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    };

    window.addEventListener("click", playClickSound);
    return () => {
      window.removeEventListener("click", playClickSound);
    };
  }, []);

  const Active = PAGES[page] ?? Home;

  return (
    <>
      <Loader visible={loading} />
      <Nav active={page} onNavigate={setPage} />

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -28 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          <Active onNavigate={setPage} />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
