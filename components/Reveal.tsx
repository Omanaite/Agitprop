"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
};

// Step-based motion to match the stop-motion brutalist spec.
export function Reveal({ children }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.2, ease: "linear" }}
    >
      {children}
    </motion.div>
  );
}
