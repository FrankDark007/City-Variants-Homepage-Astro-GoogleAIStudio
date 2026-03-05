/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogPanel, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Bars3Icon, XMarkIcon, BuildingOffice2Icon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { get, set } from 'idb-keyval';
import { GeminiService } from './services/geminiService';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  FingerPrintIcon,
  LockClosedIcon,
  ServerIcon,
} from '@heroicons/react/20/solid'
import { 
  Droplets, 
  Flame, 
  Wind, 
  ShieldCheck, 
  Clock, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Users, 
  Award, 
  Handshake,
  ArrowRight,
  IdCard,
  Mail,
  MapPin,
  Building2,
  Map
} from 'lucide-react';

// --- Mock Data ---

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
]

const featuresList = [
  {
    name: 'Push to deploy.',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'SSL certificates.',
    description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
    icon: LockClosedIcon,
  },
  {
    name: 'Simple queues.',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Advanced security.',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.',
    icon: FingerPrintIcon,
  },
  {
    name: 'Powerful API.',
    description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
    icon: Cog6ToothIcon,
  },
  {
    name: 'Database backups.',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.',
    icon: ServerIcon,
  },
]

const cityData = {
  name: "McLean",
  phone: "(703) 555-0123",
  address: "1234 Restoration Way, McLean, VA 22101",
  serviceArea: ["McLean", "Tysons", "Great Falls", "Arlington", "Falls Church"]
};

const blogPosts = [
  {
    id: 1,
    title: "What to Do in the First 24 Hours of Water Damage",
    excerpt: "Immediate steps you can take to minimize damage before the professionals arrive.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    date: "Oct 12, 2023"
  },
  {
    id: 2,
    title: "The Hidden Dangers of Mold After a Flood",
    excerpt: "Why mold remediation is critical even if the area looks dry to the naked eye.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c295944b?auto=format&fit=crop&q=80&w=800",
    date: "Oct 5, 2023"
  },
  {
    id: 3,
    title: "Navigating Insurance Claims for Water Damage",
    excerpt: "A guide to working with your insurance adjuster for a smooth restoration process.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    date: "Sep 28, 2023"
  }
];

const faqs = [
  {
    question: "How quickly can you respond to an emergency?",
    answer: "We offer 24/7 emergency response and typically arrive on-site within 60 minutes for calls in our primary service areas."
  },
  {
    question: "Do you work directly with insurance companies?",
    answer: "Yes, we handle the entire insurance process for you, including direct billing and documentation required by all major carriers."
  },
  {
    question: "Are your technicians certified?",
    answer: "All our technicians are IICRC certified and undergo regular training to stay current with the latest restoration technologies."
  },
  {
    question: "Is mold remediation included in water damage services?",
    answer: "We assess for mold during every water damage call. If mold is found, we provide professional remediation services following industry standards."
  },
  {
    question: "What areas in Northern Virginia do you serve?",
    answer: "We serve all of Northern Virginia, including McLean, Arlington, Alexandria, Fairfax, and Loudoun counties."
  },
  {
    question: "Can you help with fire and smoke damage too?",
    answer: "Absolutely. We provide comprehensive fire and smoke damage restoration, including soot removal and odor neutralization."
  }
];

// --- Components ---

const FAQAccordion = ({ items }: { items: typeof faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="border border-white/10 rounded-2xl overflow-hidden bg-gray-800/50"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <span className="font-medium text-white">{item.question}</span>
            {openIndex === index ? (
              <ChevronUp className="w-5 h-5 text-indigo-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

const GeneratedImage = ({ prompt, aspectRatio, className, fallback, onAuthError }: { prompt: string, aspectRatio: any, className?: string, fallback: string, onAuthError: () => void }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      const cacheKey = `gen_img_v3_${prompt.replace(/\s+/g, '_')}`;
      try {
        const cached = await get(cacheKey);
        if (cached) {
          setImageUrl(cached);
          return;
        }
      } catch (err) {
        console.error("Cache read error:", err);
      }

      setLoading(true);
      try {
        const url = await GeminiService.generateImage(prompt, aspectRatio);
        setImageUrl(url);
        try {
          await set(cacheKey, url);
        } catch (err) {
          console.error("Cache write error:", err);
        }
      } catch (err: any) {
        console.error(err);
        if (err.message === "AUTH_ERROR" || err.message === "API_KEY_MISSING") {
          onAuthError();
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [prompt, aspectRatio, onAuthError]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-800 animate-pulse flex items-center justify-center`}>
        <div className="text-indigo-400 text-xs font-mono">GENERATING...</div>
      </div>
    );
  }

  if (error || !imageUrl) {
    return <img src={fallback} alt={prompt} className={className} referrerPolicy="no-referrer" />;
  }

  return <img src={imageUrl} alt={prompt} className={className} referrerPolicy="no-referrer" />;
};

const GeneratedLogo = ({ company, className, fallback, onAuthError }: { company: string, className?: string, fallback: string, onAuthError: () => void }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      const cacheKey = `gen_logo_v2_${company.replace(/\s+/g, '_')}`;
      try {
        const cached = await get(cacheKey);
        if (cached) {
          setImageUrl(cached);
          return;
        }
      } catch (err) {
        console.error("Cache read error:", err);
      }

      setLoading(true);
      try {
        const url = await GeminiService.generateLogo(company);
        setImageUrl(url);
        try {
          await set(cacheKey, url);
        } catch (err) {
          console.error("Cache write error:", err);
        }
      } catch (err: any) {
        console.error(err);
        if (err.message === "AUTH_ERROR" || err.message === "API_KEY_MISSING") {
          onAuthError();
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [company, onAuthError]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-800/50 animate-pulse flex items-center justify-center rounded-lg`}>
        <div className="text-indigo-400 text-[10px] font-mono">GEN...</div>
      </div>
    );
  }

  if (error || !imageUrl) {
    return <img src={fallback} alt={company} className={className} referrerPolicy="no-referrer" />;
  }

  return <img src={imageUrl} alt={company} className={`${className} mix-blend-screen grayscale contrast-200 brightness-150`} referrerPolicy="no-referrer" />;
};

function CustomerAgreementModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-lg bg-[#232936] text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-[#0066ff] px-8 py-4">
                  <h3 className="text-lg font-semibold text-white">
                    24/7 Emergency Response
                  </h3>
                </div>

                {/* Form Body */}
                <div className="px-8 py-8">
                  <form className="space-y-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                          <span className="text-red-500 mr-1">*</span>FIRST NAME
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <IdCard className="h-5 w-5 text-gray-500" />
                          </div>
                          <input
                            type="text"
                            placeholder="First Name"
                            className="block w-full rounded-md border-0 bg-[#313846] py-3 pl-10 pr-3 text-white placeholder:text-gray-500 ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-inset focus:ring-[#0066ff] sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                          <span className="text-red-500 mr-1">*</span>LAST NAME
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Last Name"
                            className="block w-full rounded-md border-0 bg-[#313846] py-3 px-4 text-white placeholder:text-gray-500 ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-inset focus:ring-[#0066ff] sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                          <span className="text-red-500 mr-1">*</span>EMAIL ADDRESS
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Mail className="h-5 w-5 text-gray-500" />
                          </div>
                          <input
                            type="email"
                            placeholder="Email"
                            className="block w-full rounded-md border-0 bg-[#313846] py-3 pl-10 pr-3 text-white placeholder:text-gray-500 ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-inset focus:ring-[#0066ff] sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                          <span className="text-red-500 mr-1">*</span>PHONE NUMBER
                        </label>
                        <div className="relative flex rounded-md bg-[#313846] ring-1 ring-inset ring-white/5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#0066ff]">
                          <div className="flex items-center pl-3 pr-2 border-r border-gray-600">
                            <span className="text-lg mr-2">🇺🇸</span>
                            <span className="text-white text-sm">+1</span>
                          </div>
                          <div className="pointer-events-none absolute inset-y-0 left-[70px] flex items-center pl-3">
                            <Phone className="h-5 w-5 text-gray-500" />
                          </div>
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            className="block w-full rounded-r-md border-0 bg-transparent py-3 pl-12 pr-3 text-white placeholder:text-gray-500 focus:ring-0 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                          <span className="text-red-500 mr-1">*</span>ADDRESS LINE 1
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MapPin className="h-5 w-5 text-gray-500" />
                          </div>
                          <input
                            type="text"
                            placeholder="Address Line"
                            className="block w-full rounded-md border-0 bg-[#313846] py-3 pl-10 pr-3 text-white placeholder:text-gray-500 ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-inset focus:ring-[#0066ff] sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                          ADDRESS LINE 2
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Address Line 2"
                            className="block w-full rounded-md border-0 bg-[#313846] py-3 px-4 text-white placeholder:text-gray-500 ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-inset focus:ring-[#0066ff] sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 4 */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                          <span className="text-red-500 mr-1">*</span>CITY
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Building2 className="h-5 w-5 text-gray-500" />
                          </div>
                          <input
                            type="text"
                            placeholder="City Name"
                            className="block w-full rounded-md border-0 bg-[#313846] py-3 pl-10 pr-3 text-white placeholder:text-gray-500 ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-inset focus:ring-[#0066ff] sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                          <span className="text-red-500 mr-1">*</span>STATE
                        </label>
                        <div className="relative">
                          <select
                            className="block w-full appearance-none rounded-md border-0 bg-[#313846] py-3 pl-4 pr-10 text-gray-500 ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-inset focus:ring-[#0066ff] sm:text-sm sm:leading-6"
                            defaultValue=""
                          >
                            <option value="" disabled>Choose State...</option>
                            <option value="VA">Virginia</option>
                            <option value="MD">Maryland</option>
                            <option value="DC">Washington D.C.</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                          <span className="text-red-500 mr-1">*</span>ZIP CODE
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Map className="h-5 w-5 text-gray-500" />
                          </div>
                          <input
                            type="text"
                            placeholder="Zip Code"
                            className="block w-full rounded-md border-0 bg-[#313846] py-3 pl-10 pr-3 text-white placeholder:text-gray-500 ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-inset focus:ring-[#0066ff] sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="button"
                        className="group inline-flex items-center justify-center rounded-md bg-[#ff0000] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        onClick={() => setIsOpen(false)}
                      >
                        Submit
                        <span aria-hidden="true" className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-w-[24px] group-hover:ml-2 group-hover:opacity-100 group-hover:translate-x-1">
                          →
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      try {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } catch (err) {
        console.error("Error checking API key:", err);
        setHasApiKey(false);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      // After opening, we assume success or let the user try again if it fails
      setHasApiKey(true);
    } catch (err) {
      console.error("Error opening key selector:", err);
    }
  };

  const handleAuthError = () => {
    setHasApiKey(false);
    import('idb-keyval').then(({ clear }) => clear());
  };

  if (hasApiKey === null) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-white mb-4">API Key Required</h1>
          <p className="text-gray-400 mb-8">
            To generate high-quality restoration images using Gemini 3.1 Flash, you need to select a paid Google Cloud API key.
          </p>
          <button
            onClick={handleSelectKey}
            className="rounded-md bg-indigo-500 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-400 transition-all"
          >
            Select API Key
          </button>
          <p className="mt-4 text-sm text-gray-500 italic">
            Note: You must have billing enabled on your Google Cloud project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 selection:bg-indigo-500/30">
      
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-white">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" className="text-sm/6 font-semibold text-white">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-200"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <main>
        <div className="relative isolate">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-256 w-full mask-[radial-gradient(32rem_32rem_at_center,white,transparent)] stroke-white/10"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-800">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" width="100%" height="100%" strokeWidth={0} />
          </svg>
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 left-1/2 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          >
            <div
              style={{
                clipPath:
                  'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
              }}
              className="aspect-801/1036 w-200.25 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
            />
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pt-36 pb-32 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-5xl font-semibold tracking-tight text-pretty text-white sm:text-7xl">
                    We’re changing the way people connect
                  </h1>
                  <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:max-w-md sm:text-xl/8 lg:max-w-none">
                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt
                    amet fugiat veniam occaecat fugiat aliqua. Anim aute id magna aliqua ad ad non deserunt sunt.
                  </p>
                  <div className="mt-10 flex items-center gap-x-6">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="group inline-flex items-center justify-center rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer"
                    >
                      Request Services
                      <span aria-hidden="true" className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-w-[24px] group-hover:ml-2 group-hover:opacity-100 group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                    <a href="#" className="group text-sm/6 font-semibold text-white">
                      View services <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                    </a>
                  </div>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-0 xl:pt-80">
                    <div className="relative">
                      <GeneratedImage
                        prompt="Professional water damage restoration technician using a high-powered water extractor in a flooded modern basement"
                        aspectRatio="3:4"
                        fallback="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        className="aspect-2/3 w-full rounded-xl bg-gray-700/5 object-cover shadow-lg"
                        onAuthError={handleAuthError}
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10 ring-inset" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <GeneratedImage
                        prompt="A charred, fire-damaged living room being meticulously inspected by a restoration expert in professional gear"
                        aspectRatio="3:4"
                        fallback="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        className="aspect-2/3 w-full rounded-xl bg-gray-700/5 object-cover shadow-lg"
                        onAuthError={handleAuthError}
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10 ring-inset" />
                    </div>
                    <div className="relative">
                      <GeneratedImage
                        prompt="Close-up of professional mold remediation, a technician in a white hazmat suit cleaning a wall"
                        aspectRatio="3:4"
                        fallback="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80"
                        className="aspect-2/3 w-full rounded-xl bg-gray-700/5 object-cover shadow-lg"
                        onAuthError={handleAuthError}
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10 ring-inset" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <GeneratedImage
                        prompt="Storm damage restoration, a professional crew tarping a damaged roof of a luxury home during twilight"
                        aspectRatio="3:4"
                        fallback="https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80"
                        className="aspect-2/3 w-full rounded-xl bg-gray-700/5 object-cover shadow-lg"
                        onAuthError={handleAuthError}
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10 ring-inset" />
                    </div>
                    <div className="relative">
                      <GeneratedImage
                        prompt="Flood damage scene, a restoration truck parked in front of a beautiful house with receding flood waters"
                        aspectRatio="3:4"
                        fallback="https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        className="aspect-2/3 w-full rounded-xl bg-gray-700/5 object-cover shadow-lg"
                        onAuthError={handleAuthError}
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10 ring-inset" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 2. Logo Cloud */}
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-lg/8 font-semibold text-white">Trusted by major insurance providers</h2>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-6">
            <GeneratedLogo
              company="USAA"
              fallback="https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-white.svg"
              className="col-span-1 max-h-12 w-full object-contain"
              onAuthError={handleAuthError}
            />
            <GeneratedLogo
              company="State Farm"
              fallback="https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-white.svg"
              className="col-span-1 max-h-12 w-full object-contain"
              onAuthError={handleAuthError}
            />
            <GeneratedLogo
              company="Allstate"
              fallback="https://tailwindcss.com/plus-assets/img/logos/158x48/tuple-logo-white.svg"
              className="col-span-1 max-h-12 w-full object-contain"
              onAuthError={handleAuthError}
            />
            <GeneratedLogo
              company="Nationwide"
              fallback="https://tailwindcss.com/plus-assets/img/logos/158x48/savvycal-logo-white.svg"
              className="col-span-1 max-h-12 w-full object-contain"
              onAuthError={handleAuthError}
            />
            <GeneratedLogo
              company="Travelers"
              fallback="https://tailwindcss.com/plus-assets/img/logos/158x48/statamic-logo-white.svg"
              className="col-span-1 max-h-12 w-full object-contain"
              onAuthError={handleAuthError}
            />
            <GeneratedLogo
              company="CHUBB"
              fallback="https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-white.svg"
              className="col-span-1 max-h-12 w-full object-contain"
              onAuthError={handleAuthError}
            />
          </div>
        </div>
      </div>

      {/* 3. Features Section */}
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base/7 font-semibold text-indigo-400">Everything you need</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl sm:text-balance">
              No server? No problem.
            </p>
            <p className="mt-6 text-lg/8 text-gray-300">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste
              dolor cupiditate blanditiis.
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <img
              alt="App screenshot"
              src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
              width={2432}
              height={1442}
              className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-white/10"
              referrerPolicy="no-referrer"
            />
            <div aria-hidden="true" className="relative">
              <div className="absolute -inset-x-20 bottom-0 bg-linear-to-t from-gray-900 pt-[7%]" />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base/7 text-gray-400 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {featuresList.map((feature) => (
              <div key={feature.name} className="relative pl-9">
                <dt className="inline font-semibold text-white">
                  <feature.icon aria-hidden="true" className="absolute top-1 left-1 size-5 text-indigo-400" />
                  {feature.name}
                </dt>{' '}
                <dd className="inline">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* 4. Stats Section Replacement */}
      <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            aria-hidden="true"
            className="absolute top-0 left-[max(50%,25rem)] h-256 w-512 -translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-800"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-800/50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" width="100%" height="100%" strokeWidth={0} />
          </svg>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base/7 font-semibold text-indigo-400">Deploy faster</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">
                  A better workflow
                </h1>
                <p className="mt-6 text-xl/8 text-gray-300">
                  Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui, diam
                  eget aliquam. Quisque id at vitae feugiat egestas.
                </p>
              </div>
            </div>
          </div>
          <div className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
              className="w-3xl max-w-none rounded-xl bg-gray-800 shadow-xl ring-1 ring-white/10 sm:w-228"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base/7 text-gray-400 lg:max-w-lg">
                <p>
                  Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet
                  vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque
                  erat velit. Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris
                  semper sed amet vitae sed turpis id.
                </p>
                <ul role="list" className="mt-8 space-y-8 text-gray-400">
                  <li className="flex gap-x-3">
                    <CloudArrowUpIcon aria-hidden="true" className="mt-1 size-5 flex-none text-indigo-400" />
                    <span>
                      <strong className="font-semibold text-white">Push to deploy.</strong> Lorem ipsum, dolor sit amet
                      consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate
                      blanditiis ratione.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <LockClosedIcon aria-hidden="true" className="mt-1 size-5 flex-none text-indigo-400" />
                    <span>
                      <strong className="font-semibold text-white">SSL certificates.</strong> Anim aute id magna aliqua ad
                      ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <ServerIcon aria-hidden="true" className="mt-1 size-5 flex-none text-indigo-400" />
                    <span>
                      <strong className="font-semibold text-white">Database backups.</strong> Ac tincidunt sapien vehicula
                      erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.
                    </span>
                  </li>
                </ul>
                <p className="mt-8">
                  Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie auctor
                  fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices hac
                  adipiscing egestas. Iaculis convallis ac tempor et ut. Ac lorem vel integer orci.
                </p>
                <h2 className="mt-16 text-2xl font-bold tracking-tight text-white">No server? No problem.</h2>
                <p className="mt-6">
                  Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in. Convallis arcu ipsum urna nibh.
                  Pharetra, euismod vitae interdum mauris enim, consequat vulputate nibh. Maecenas pellentesque id sed
                  tellus mauris, ultrices mauris. Tincidunt enim cursus ridiculus mi. Pellentesque nam sed nullam sed diam
                  turpis ipsum eu a sed convallis diam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Testimonial Section */}
      <div className="bg-gray-900 pt-24 pb-16 sm:pt-32 sm:pb-24 xl:pb-32">
        <div className="bg-gray-800/50 pb-20 outline outline-white/5 sm:pb-24 xl:pb-0">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-8 gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:flex-row xl:items-stretch">
            <div className="-mt-8 w-full max-w-2xl xl:-mb-8 xl:w-96 xl:flex-none">
              <div className="relative aspect-2/1 h-full after:absolute after:inset-0 after:rounded-2xl after:inset-ring after:inset-ring-white/15 md:-mx-8 xl:mx-0 xl:aspect-auto">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80"
                  className="absolute inset-0 size-full rounded-2xl bg-gray-700 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
              <figure className="relative isolate pt-6 sm:pt-12">
                <svg
                  fill="none"
                  viewBox="0 0 162 128"
                  aria-hidden="true"
                  className="absolute top-0 left-0 -z-10 h-32 stroke-white/20"
                >
                  <path
                    d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
                    id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
                  />
                  <use x={86} href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" />
                </svg>
                <blockquote className="text-xl/8 font-semibold text-gray-100 sm:text-2xl/9">
                  <p>
                    Gravida quam mi erat tortor neque molestie. Auctor aliquet at porttitor a enim nunc suscipit tincidunt
                    nunc. Et non lorem tortor posuere. Nunc eu scelerisque interdum eget tellus non nibh scelerisque
                    bibendum.
                  </p>
                </blockquote>
                <figcaption className="mt-8 text-base">
                  <div className="font-semibold text-gray-100">Judith Black</div>
                  <div className="mt-1 text-gray-400">CEO of Workcation</div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Contact Section */}
      <div className="relative isolate bg-gray-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          <div className="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-900 ring-1 ring-white/10 lg:w-1/2">
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-white/10"
                >
                  <defs>
                    <pattern
                      x="100%"
                      y={-1}
                      id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                      width={200}
                      height={200}
                      patternUnits="userSpaceOnUse"
                    >
                      <path d="M130 200V.5M.5 .5H200" fill="none" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" strokeWidth={0} className="fill-gray-900" />
                  <svg x="100%" y={-1} className="overflow-visible fill-gray-800/20">
                    <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                  </svg>
                  <rect fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" width="100%" height="100%" strokeWidth={0} />
                </svg>
                <div
                  aria-hidden="true"
                  className="absolute top-[calc(100%-13rem)] -left-56 block transform-gpu blur-3xl lg:top-[calc(50%-7rem)] lg:left-[max(-14rem,calc(100%-59rem))]"
                >
                  <div
                    style={{
                      clipPath:
                        'polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)',
                    }}
                    className="aspect-1155/678 w-288.75 bg-linear-to-br from-[#80caff] to-[#4f46e5] opacity-20"
                  />
                </div>
              </div>
              <h2 className="text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">Get in touch</h2>
              <p className="mt-6 text-lg/8 text-gray-400">
                Proin volutpat consequat porttitor cras nullam gravida at. Orci molestie a eu arcu. Sed ut tincidunt
                integer elementum id sem. Arcu sed malesuada et magna.
              </p>
              <dl className="mt-10 space-y-4 text-base/7 text-gray-300">
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Address</span>
                    <BuildingOffice2Icon aria-hidden="true" className="h-7 w-6 text-gray-400" />
                  </dt>
                  <dd>
                    545 Mavis Island
                    <br />
                    Chicago, IL 99191
                  </dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Telephone</span>
                    <PhoneIcon aria-hidden="true" className="h-7 w-6 text-gray-400" />
                  </dt>
                  <dd>
                    <a href="tel:+1 (555) 234-5678" className="hover:text-white">
                      +1 (555) 234-5678
                    </a>
                  </dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Email</span>
                    <EnvelopeIcon aria-hidden="true" className="h-7 w-6 text-gray-400" />
                  </dt>
                  <dd>
                    <a href="mailto:hello@example.com" className="hover:text-white">
                      hello@example.com
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <form action="#" method="POST" className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="block text-sm/6 font-semibold text-white">
                    First name
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm/6 font-semibold text-white">
                    Last name
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm/6 font-semibold text-white">
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-white">
                    Phone number
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="phone-number"
                      name="phone-number"
                      type="tel"
                      autoComplete="tel"
                      className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm/6 font-semibold text-white">
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                      defaultValue={''}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Send message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <CustomerAgreementModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
}
