import { motion } from "framer-motion";

export default function HDivider({ loading }: { loading?: boolean }) {
  return (
    <motion.hr
      initial={{ scaleX: 0 }}
      animate={{ scaleX: loading ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ transformOrigin: "left" }}
      className="border-inset border-foreground w-full"
    />
  );
}
