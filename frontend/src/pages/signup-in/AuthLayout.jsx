import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const isSignIn = location.pathname === "/signin";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      {/* Animated background gradients */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
          rotate: [0, 3, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
        className="absolute inset-0 filter blur-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-background to-primary/20" />
        <motion.div
          animate={{
            x: ["-25%", "25%", "-25%"],
            y: ["-15%", "15%", "-15%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-primary/30"
        />
      </motion.div>

      {/* Card wrapper with enhanced perspective */}
      <div className="relative w-full max-w-md perspective-1000">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-background/50 backdrop-blur-xl rounded-2xl"
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
