import React from "react"
import ContentLoader from "react-content-loader" 
import { motion } from 'framer-motion';

const TwoFALoader = (props) => (
  <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 10 }}
  transition={{
    duration: 0.5,
    ease: "easeInOut"
  }}>
  <div className="card hoverable">
    <div className="card-content">
      <ContentLoader 
        speed={2}
        width={"100%"}
        height={"100%"}
        viewBox="0 0 400 100"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="100" y="10" rx="7" ry="7" width="300" height="32" /> 
        <rect x="100" y="50" rx="7" ry="7" width="300" height="22" /> 
        <rect x="0" y="0" rx="7" ry="7" width="90" height="90" />
      </ContentLoader>
    </div>
  </div>
  </motion.div>
)

export default TwoFALoader