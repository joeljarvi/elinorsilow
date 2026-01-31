import { motion } from "framer-motion";

interface VDividerProps {
  loading?: boolean;
  className?: string;
}

export default function VDivider({ loading, className = "" }: VDividerProps) {
  return (
    <motion.hr
      initial={{ scaleY: 0 }}
      animate={{ scaleY: loading ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ transformOrigin: "top" }}
      className={`h-full w-px bg-foreground mx-0 my-0 ${className}`}
    />
  );
}
