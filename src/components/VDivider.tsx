import { motion } from "framer-motion";

export default function VDivider({ loading }) {
  return (
    <motion.hr
      initial={{ scaleY: 0 }}
      animate={{ scaleY: loading ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ transformOrigin: "top" }}
      className=" fixed left-1/2 top-0 -translate-x-1/2 border-l border-black z-10 pointer-events-none h-screen"
    />
  );
}
