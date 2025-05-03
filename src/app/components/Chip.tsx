import { motion } from "framer-motion";

type ChipProps = {
  value: 1 | 5 | 10 | 25 | 100;
  size?: "sm" | "md" | "lg";
};

export default function Chip({ value, size = "md" }: ChipProps) {
  // Map chip values to colors
  const colorMap = {
    1: "chip-white",
    5: "chip-red",
    10: "chip-blue",
    25: "chip-green",
    100: "chip-black",
  };

  // Map size to dimensions
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <motion.div
      className={`chip ${colorMap[value]} ${sizeMap[size]} flex items-center justify-center text-center text-black font-bold relative`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ y: -5 }}
    >
      <span className="relative z-10">${value}</span>
    </motion.div>
  );
} 