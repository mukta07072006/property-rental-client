'use client'

import React from 'react'
import { motion } from 'framer-motion'

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </motion.div>
    </div>
  )
}

export default Loading