import { AnimatePresence, motion } from "motion/react";

interface Props {
  children: React.ReactNode;
}

const Fade: React.FC<Props> = ({ children }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: "-100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default Fade;
