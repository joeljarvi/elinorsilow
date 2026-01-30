import { motion } from "framer-motion";

export default function VDivider({ loading }: { loading?: boolean }) {
  return (
    <motion.hr
      initial={{ scaleY: 0 }}
      animate={{ scaleY: loading ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ transformOrigin: "top" }}
      className="h-full w-px bg-foreground mx-0"
    />
  );
}
