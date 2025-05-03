import { motion, AnimatePresence } from "framer-motion";
import Chip from "./Chip";

type ChipStackProps = {
  totalValue: number;
};

export default function ChipStack({ totalValue }: ChipStackProps) {
  // Calculate how many of each chip we need
  const calculateChips = (value: number) => {
    const chips = {
      100: 0,
      25: 0,
      10: 0,
      5: 0,
      1: 0,
    };
    
    let remaining = value;
    
    if (remaining >= 100) {
      chips[100] = Math.min(5, Math.floor(remaining / 100));
      remaining -= chips[100] * 100;
    }
    
    if (remaining >= 25) {
      chips[25] = Math.min(4, Math.floor(remaining / 25));
      remaining -= chips[25] * 25;
    }
    
    if (remaining >= 10) {
      chips[10] = Math.min(3, Math.floor(remaining / 10));
      remaining -= chips[10] * 10;
    }
    
    if (remaining >= 5) {
      chips[5] = Math.min(2, Math.floor(remaining / 5));
      remaining -= chips[5] * 5;
    }
    
    chips[1] = Math.min(5, remaining);
    
    return chips;
  };

  const chips = calculateChips(totalValue);
  
  // Only show a representative stack, not every single chip
  return (
    <motion.div className="relative chip-stack flex flex-col items-center justify-center">
      <AnimatePresence>
        {chips[100] > 0 && (
          <motion.div 
            className="absolute chip-value-100"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
          >
            <Chip value={100} size="sm" />
            {chips[100] > 1 && (
              <span className="absolute -top-3 -right-3 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chips[100]}
              </span>
            )}
          </motion.div>
        )}
        
        {chips[25] > 0 && (
          <motion.div 
            className="absolute chip-value-25"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
          >
            <Chip value={25} size="sm" />
            {chips[25] > 1 && (
              <span className="absolute -top-3 -right-3 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chips[25]}
              </span>
            )}
          </motion.div>
        )}
        
        {chips[10] > 0 && (
          <motion.div 
            className="absolute chip-value-10"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
          >
            <Chip value={10} size="sm" />
            {chips[10] > 1 && (
              <span className="absolute -top-3 -right-3 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chips[10]}
              </span>
            )}
          </motion.div>
        )}
        
        {chips[5] > 0 && (
          <motion.div 
            className="absolute chip-value-5"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
          >
            <Chip value={5} size="sm" />
            {chips[5] > 1 && (
              <span className="absolute -top-3 -right-3 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chips[5]}
              </span>
            )}
          </motion.div>
        )}
        
        {chips[1] > 0 && (
          <motion.div 
            className="absolute chip-value-1"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
          >
            <Chip value={1} size="sm" />
            {chips[1] > 1 && (
              <span className="absolute -top-3 -right-3 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chips[1]}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 