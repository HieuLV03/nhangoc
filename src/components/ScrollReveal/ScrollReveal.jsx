"use client";

import { motion } from "framer-motion";

export default function ScrollReveal({
  children,
  delay = 0,
  y = 40,
  scale = 0.96,
}) {

  return (

    <motion.div

      initial={{
        opacity: 0,
        y,
        scale,
      }}


      whileInView={{
        opacity:1,
        y:0,
        scale:1,
      }}


      viewport={{
        once:true,
        amount:0.15,
      }}


      transition={{

        duration:0.8,

        delay,

        ease:[0.22,1,0.36,1],

      }}

    >

      {children}

    </motion.div>

  );

}