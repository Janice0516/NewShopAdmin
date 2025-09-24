'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

export default function ProductFAQPage() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const faqSections: FAQSection[] = [
    {
      title: "Product Information",
      items: [
        {
          id: "product-1",
          question: "What are the major selling points of Xiaomi smartphones?",
          answer: "Xiaomi smartphones feature industry-leading processors like Snapdragon 8 Elite, advanced camera systems with Leica optics, high-resolution AMOLED displays with up to 120Hz refresh rates, fast charging technology up to 90W wired and 50W wireless, and comprehensive connectivity including 5G, Wi-Fi 7, and NFC capabilities."
        },
        {
          id: "product-2",
          question: "What series does Xiaomi offer?",
          answer: "Xiaomi offers multiple product series including the flagship Xiaomi series (Xiaomi 15, Xiaomi 14), the performance-focused Redmi series, the gaming-oriented POCO series, and various smart accessories like Smart Bands, earphones, and smart home devices."
        },
        {
          id: "product-3",
          question: "What colors are available for Xiaomi devices?",
          answer: "Xiaomi devices come in various premium colors including Midnight Black, Glacier Silver, Mystic Rose, Arctic Blue, Titan Gray, Jade Green, and special editions like Liquid Silver and Ceramic finishes."
        }
      ]
    },
    {
      title: "Display & Screen",
      items: [
        {
          id: "screen-1",
          question: "What display technology does Xiaomi use?",
          answer: "Xiaomi uses premium AMOLED displays with features like 2670×1200 resolution, 460 PPI pixel density, up to 120Hz refresh rate, 240Hz touch sampling rate, peak brightness up to 3200 nits, 12-bit color depth supporting 68.7 billion colors, and DCI-P3 color gamut coverage."
        },
        {
          id: "screen-2",
          question: "Does Xiaomi support Always-On Display (AOD)?",
          answer: "Yes, Xiaomi devices support colorful Always-On Display (AOD) functionality, allowing you to view time, notifications, and other information without fully waking the screen, helping to conserve battery life."
        },
        {
          id: "screen-3",
          question: "What screen protection does Xiaomi offer?",
          answer: "Xiaomi devices feature advanced screen protection including Xiaomi Shield Glass and Xiaomi Shield Glass 2.0, providing enhanced durability and resilience against drops and daily wear. The screens also include oleophobic coating for fingerprint resistance."
        }
      ]
    },
    {
      title: "Performance & Storage",
      items: [
        {
          id: "performance-1",
          question: "What processors do Xiaomi devices use?",
          answer: "Xiaomi devices are powered by flagship Qualcomm Snapdragon processors including the latest Snapdragon 8 Elite and Snapdragon 8 Gen 3, manufactured using advanced 3nm and 4nm processes for superior performance and power efficiency."
        },
        {
          id: "performance-2",
          question: "What storage options are available?",
          answer: "Xiaomi devices offer high-performance LPDDR5X RAM (up to 12GB) and UFS 4.0 storage (256GB/512GB options), providing fast app loading, smooth multitasking, and ample space for photos, videos, and applications."
        },
        {
          id: "performance-3",
          question: "Do Xiaomi devices support storage expansion?",
          answer: "Most current Xiaomi flagship devices do not support expandable storage via microSD cards, but offer generous internal storage options. The built-in storage uses fast UFS 4.0 technology for optimal performance."
        }
      ]
    },
    {
      title: "Camera & Photography",
      items: [
        {
          id: "camera-1",
          question: "What camera features do Xiaomi devices offer?",
          answer: "Xiaomi devices feature advanced camera systems including Leica-engineered optics, 50MP main sensors, telephoto and ultra-wide lenses, AI computational photography, Night mode, Portrait mode, Pro mode, 4K/8K video recording, and Dolby Vision support."
        },
        {
          id: "camera-2",
          question: "What video recording capabilities are supported?",
          answer: "Xiaomi devices support comprehensive video recording including 720P/1080P/4K at various frame rates (30fps/60fps/120fps), 8K recording at 30fps, slow-motion video up to 1920fps, and advanced features like Dolby Vision and cinematic modes."
        },
        {
          id: "camera-3",
          question: "What AI photography features are available?",
          answer: "Xiaomi devices include AI-powered features such as scene recognition, smart beauty modes, AI portrait enhancement, computational photography for improved low-light performance, and intelligent photo optimization for various shooting conditions."
        }
      ]
    },
    {
      title: "Battery & Charging",
      items: [
        {
          id: "battery-1",
          question: "What battery capacity do Xiaomi devices have?",
          answer: "Xiaomi devices feature large batteries ranging from 4610mAh to 5410mAh capacity, providing all-day usage for typical smartphone activities including gaming, photography, and multimedia consumption."
        },
        {
          id: "battery-2",
          question: "What fast charging technologies are supported?",
          answer: "Xiaomi devices support advanced charging including up to 90W wired HyperCharge (full charge in 31 minutes), 50W wireless charging, and support for multiple charging protocols including QC 4.0, PD 3.0, and PPS."
        },
        {
          id: "battery-3",
          question: "What charging accessories are included?",
          answer: "Xiaomi devices typically include high-wattage chargers in the box, supporting the device's maximum charging speed. The chargers are compatible with various charging standards for versatility with other devices."
        }
      ]
    },
    {
      title: "Connectivity & Network",
      items: [
        {
          id: "network-1",
          question: "What network connectivity is supported?",
          answer: "Xiaomi devices support comprehensive connectivity including 5G (SA/NSA), 4G LTE, Wi-Fi 7 (up to 5764 Mbps), Bluetooth 6.0, NFC for payments and file sharing, and dual SIM functionality with smart switching."
        },
        {
          id: "network-2",
          question: "What Wi-Fi features are available?",
          answer: "Xiaomi devices support Wi-Fi 7 with 2.4GHz and 5GHz bands, Wi-Fi 6E, Wi-Fi Direct, Wi-Fi Display, MU-MIMO technology, and advanced features like dual WLAN acceleration and simultaneous Wi-Fi and hotspot operation."
        },
        {
          id: "network-3",
          question: "What Bluetooth audio codecs are supported?",
          answer: "Xiaomi devices support high-quality Bluetooth audio codecs including SBC, AAC, aptX, aptX HD, aptX Adaptive, LDAC, LHDC (versions 1.0-5.0), and LC3 for superior wireless audio quality with compatible headphones."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-500">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/support" className="hover:text-orange-500">Support</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Product FAQ</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions - FAQ
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Find answers to common questions about Xiaomi products, features, and specifications. 
            Our comprehensive FAQ covers everything from product information to technical details.
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/support" 
            className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
          >
            ← Back to Support
          </Link>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Section Header */}
              <div className="bg-orange-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-orange-600">
                  {section.title}
                </h2>
              </div>

              {/* FAQ Items */}
              <div className="divide-y divide-gray-200">
                {section.items.map((item, itemIndex) => (
                  <div key={item.id} className="bg-white">
                    {/* Question */}
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-gray-900 pr-4">
                          <span className="text-orange-500 font-semibold mr-2">
                            Q{sectionIndex + 1}.{itemIndex + 1}:
                          </span>
                          {item.question}
                        </h3>
                        <div className="flex-shrink-0">
                          <svg
                            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                              expandedItems.has(item.id) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Answer */}
                    {expandedItems.has(item.id) && (
                      <div className="px-6 pb-4">
                        <div className="pl-8 border-l-2 border-orange-200">
                          <p className="text-gray-700 leading-relaxed">
                            <span className="text-orange-500 font-semibold mr-2">A:</span>
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-4">
            If you couldn't find the answer you're looking for, please don't hesitate to contact our support team.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/support"
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              Contact Support
            </Link>
            <Link
              href="/support/shipping"
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Shipping FAQ
            </Link>
            <Link
              href="/support/mi-points"
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Mi Points FAQ
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6">SUPPORT</h3>
              <ul className="space-y-3">
                <li><Link href="/support" className="text-sm text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/support/faq" className="text-sm text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/support/warranty" className="text-sm text-gray-300 hover:text-white transition-colors">Warranty</Link></li>
                <li><Link href="/support/repair" className="text-sm text-gray-300 hover:text-white transition-colors">Repair Services</Link></li>
                <li><Link href="/support/contact" className="text-sm text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Terms and Conditions */}
            <div>
              <h3 className="text-lg font-semibold mb-6">TERMS AND CONDITIONS</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-sm text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-sm text-gray-300 hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link href="/legal" className="text-sm text-gray-300 hover:text-white transition-colors">Legal Information</Link></li>
              </ul>
            </div>

            {/* Shop and Learn */}
            <div>
              <h3 className="text-lg font-semibold mb-6">SHOP AND LEARN</h3>
              <ul className="space-y-3">
                <li><Link href="/uk/store/phones" className="text-sm text-gray-300 hover:text-white transition-colors">Smartphones</Link></li>
                <li><Link href="/uk/store/tablets" className="text-sm text-gray-300 hover:text-white transition-colors">Tablets</Link></li>
                <li><Link href="/uk/store/laptops" className="text-sm text-gray-300 hover:text-white transition-colors">Laptops</Link></li>
                <li><Link href="/uk/store/accessories" className="text-sm text-gray-300 hover:text-white transition-colors">Accessories</Link></li>
                <li><Link href="/uk/store/smart-home" className="text-sm text-gray-300 hover:text-white transition-colors">Smart Home</Link></li>
              </ul>
            </div>

            {/* About Us */}
            <div>
              <h3 className="text-lg font-semibold mb-6">ABOUT US</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">Company</Link></li>
                <li><Link href="/careers" className="text-sm text-gray-300 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/news" className="text-sm text-gray-300 hover:text-white transition-colors">News</Link></li>
                <li><Link href="/investors" className="text-sm text-gray-300 hover:text-white transition-colors">Investors</Link></li>
                <li><Link href="/sustainability" className="text-sm text-gray-300 hover:text-white transition-colors">Sustainability</Link></li>
              </ul>
            </div>
          </div>

          {/* Social Media and Newsletter */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              {/* Social Media */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">Follow us:</span>
                <div className="flex space-x-3">
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </Link>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </Link>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017-.001z"/>
                    </svg>
                  </Link>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Newsletter */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <span className="text-sm text-gray-300">Subscribe to our newsletter:</span>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                  />
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-sm text-gray-400">
                © 2025 Xiaomi Technology UK Limited. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}