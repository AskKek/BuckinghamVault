"use client";

import React, { Fragment } from "react";
import { motion } from "framer-motion";
import { Vault, TrendingUp, Scale, Shield } from "lucide-react";

interface CoreService {
  title: string;
  icon: keyof typeof serviceIcons;
  description: string;
  features: string[];
}

interface CoreServicesProps {
  services: CoreService[];
}

const serviceIcons: Record<string, React.ElementType> = {
  Vault: Vault,
  TrendingUp: TrendingUp,
  Scale: Scale,
  Shield: Shield,
};

const CoreServicesSection: React.FC<CoreServicesProps> = ({ services }) => {
  return (
    <section id="services" className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <div className="space-y-6 md:space-y-0 md:flex md:justify-between md:items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center md:text-left"
          >
            <motion.h2
              className="text-4xl font-extrabold text-red-500 uppercase bg-gradient-to-r from-yellow-300 to-pink-500 inline-block text-transparent bg-clip-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Buckingham <span className="dark:text-white">Core Services</span>
            </motion.h2>
            <motion.p className="mt-4 max-w-md px-4">
              Discover the cornerstone services that underpin Buckingham's
              success.
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 md:mt-0 md:ml-4"
          >
            <a
              href="#contact-us"
              className="px-6 py-2 rounded-full border border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition duration-300"
            >
              Contact Us
            </a>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-12"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 dark:text-gray-400 rounded-xl py-6 px-8 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl text-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <div className="mb-4 text-red-500 group">
                {React.createElement(serviceIcons[service.icon], {
                  className:
                    "w-12 h-12 mx-auto text-red-500 group-hover:text-red-700 transition duration-300",
                })}
              </div>
              <motion.h3
                className="text-xl font-bold text-gray-800 dark:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {service.title}
              </motion.h3>
              <motion.p
                className="mt-2 text-sm text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {service.description}
              </motion.p>
              <motion.ul
                className="mt-4 space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
              >
                {service.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-red-500 shrink-0"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 4.293a1 1 0 00-1.414-1.414l-6 6a1 1 0 000 1.415l6 6a1 1 0 001.414-1.415l-6-6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CoreServicesSection;

// Sample Data for Core Services
const coreServicesData: CoreService[] = [
  {
    title: "Digital Asset Custody",
    icon: "Vault",
    description:
      "Our custody solutions, holding 15% of global digital assets, ensure the safety and privacy of your wealth.",
    features: [
      "Multi-jurisdictional vault locations",
      "Cold-storage with quantum-resistant encryption",
      "24/7 on-site surveillance and biometric access control",
      "Multi-party computation signers for institutional accounts",
    ],
  },
  {
    title: "Institutional Trading",
    icon: "TrendingUp",
    description:
      "Facilitate seamless OTC transactions for institutional clients with no market exposure impacts.",
    features: [
      "Customized spot & forward contracts",
      "Zero-market price slippage technology",
      "Exclusive access to liquidity providers",
      "Multi-asset class trading support (Bitcoin, Ethereum, stablecoins)",
    ],
  },
  {
    title: "Elite Wealth Management",
    icon: "Scale",
    description:
      "Comprehensive wealth optimization strategies for the ultra-affluent using advanced portfolio techniques.",
    features: [
      "Portfolio rebalancing with tax-loss harvesting",
      "Institutional-grade asset allocation models",
      "Private placement opportunities in digital assets",
      "Estate planning integration with blockchain inheritance",
    ],
  },
  {
    title: "Global Regulatory Compliance",
    icon: "Shield",
    description:
      "Our full-service compliance program ensures adherence to FATF guidelines across our global operations.",
    features: [
      "Multi-jurisdictional regulatory framework",
      "Automated sanctions screening with AI-powered analytics",
      "KYC/AML protocols meeting every jurisdiction's requirements",
      "Secure audit trails with immutable blockchain ledger",
    ],
  },
];
