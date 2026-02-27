import { motion } from "framer-motion";

export default function HDivider({
  loading,
  className = "",
  color = "border-foreground",
}: {
  loading?: boolean;
  className?: string;
  color?: string;
}) {
  return (
    <motion.hr
      initial={{ scaleX: 0 }}
      animate={{ scaleX: loading ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ transformOrigin: "left" }}
      className={`border-inset border-[0.5px] ${color} w-full my-0 ${className}`}
    />
  );
}
