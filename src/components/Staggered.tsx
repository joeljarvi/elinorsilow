import { motion, AnimatePresence } from "framer-motion";

interface StaggeredProps<T> {
  items?: T[];
  renderItem?: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T) => string | number; // generic key accessor
  className?: string;
  delay?: number;
  loading?: boolean;
}

export default function Staggered<T>({
  items,
  renderItem,
  getKey,
  className = "",
  delay = 0.06,
  loading = false,
}: StaggeredProps<T>) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: delay } },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  if (!items || !renderItem) return null;

  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate={loading ? "hidden" : "show"}
      className={className}
    >
      <AnimatePresence>
        {items.map((data, i) => (
          <motion.li
            key={getKey ? getKey(data) : i}
            variants={item}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderItem(data, i)}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
