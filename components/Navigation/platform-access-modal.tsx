"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlatformAccessSection } from "./platform-access-section"

interface PlatformAccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PlatformAccessModal({ isOpen, onClose }: PlatformAccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal Content */}
          <div className="min-h-screen px-4 text-center">
            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            
            <motion.div
              className="inline-block w-full max-w-7xl p-0 my-8 text-left align-middle transition-all transform bg-navy-dark rounded-2xl shadow-2xl border border-gold/30 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Close Button */}
              <div className="absolute top-6 right-6 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gold hover:text-gold-light hover:bg-gold/10 rounded-full w-10 h-10 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Platform Access Section */}
              <div className="max-h-[90vh] overflow-y-auto">
                <PlatformAccessSection />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}