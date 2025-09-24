"use client";

import { useState } from "react";
import Link from 'next/link';
import { Search, Phone, Mail, MessageCircle, FileText, Smartphone, Headphones, Wifi, Shield, Truck, CreditCard, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from '@/components/Navbar';
import ClosableBanner from '@/components/ClosableBanner';
import DynamicSpacer from '@/components/DynamicSpacer';
import "../../styles/support.css";
import '@/styles/navbar.css';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Simulate search results
      const mockResults = [
        { title: "How to reset my Xiaomi device", category: "Device Setup", type: "FAQ" },
        { title: "Warranty information", category: "Warranty", type: "Guide" },
        { title: "Software update issues", category: "Software", type: "Troubleshooting" },
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(mockResults);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  // Toggle FAQ expansion
  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Simulate category filtering
    console.log(`Selected category: ${categoryId}`);
  };

  const supportCategories = [
    {
      id: "devices",
      title: "Devices & Products",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Get help with your Xiaomi devices",
      topics: ["Setup & Installation", "Troubleshooting", "Software Updates", "Hardware Issues"]
    },
    {
      id: "orders",
      title: "Orders & Delivery",
      icon: <Truck className="w-6 h-6" />,
      description: "Track orders and delivery information",
      topics: ["Order Status", "Delivery Options", "Shipping Information", "Order Changes"]
    },
    {
      id: "payments",
      title: "Payments & Billing",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Payment methods and billing support",
      topics: ["Payment Methods", "Billing Issues", "Refunds", "PayPal Credit"]
    },
    {
      id: "warranty",
      title: "Warranty & Returns",
      icon: <Shield className="w-6 h-6" />,
      description: "Warranty information and return policy",
      topics: ["Warranty Coverage", "Return Process", "Repair Services", "Replacement"]
    },
    {
      id: "account",
      title: "Account & Profile",
      icon: <FileText className="w-6 h-6" />,
      description: "Manage your Mi account settings",
      topics: ["Account Settings", "Profile Management", "Privacy Settings", "Data Protection"]
    },
    {
      id: "connectivity",
      title: "Connectivity & Network",
      icon: <Wifi className="w-6 h-6" />,
      description: "Network and connectivity issues",
      topics: ["Wi-Fi Setup", "Bluetooth Pairing", "Network Troubleshooting", "Smart Home Connection"]
    }
  ];

  const quickActions = [
    {
      title: "Track Your Order",
      description: "Check the status of your recent orders",
      icon: <Truck className="w-8 h-8" />,
      action: "track-order"
    },
    {
      title: "Start a Return",
      description: "Begin the return process for your item",
      icon: <RotateCcw className="w-8 h-8" />,
      action: "start-return"
    },
    {
      title: "Contact Support",
      description: "Get in touch with our support team",
      icon: <Headphones className="w-8 h-8" />,
      action: "contact-support"
    },
    {
      title: "Live Chat",
      description: "Chat with our support representatives",
      icon: <MessageCircle className="w-8 h-8" />,
      action: "live-chat"
    }
  ];

  const contactMethods = [
    {
      method: "Phone Support",
      description: "Speak directly with our support team",
      icon: <Phone className="w-6 h-6" />,
      details: "Available Mon-Fri, 9AM-6PM GMT",
      action: "Call Now"
    },
    {
      method: "Email Support",
      description: "Send us your questions via email",
      icon: <Mail className="w-6 h-6" />,
      details: "Response within 24 hours",
      action: "Send Email"
    },
    {
      method: "Live Chat",
      description: "Chat with us in real-time",
      icon: <MessageCircle className="w-6 h-6" />,
      details: "Available 24/7",
      action: "Start Chat"
    }
  ];

  const faqItems = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your Mi account and visiting the 'My Orders' section. You'll receive tracking information via email once your order ships."
    },
    {
      question: "What is the warranty period for Xiaomi products?",
      answer: "Most Xiaomi products come with a 2-year manufacturer warranty. Specific warranty terms may vary by product category."
    },
    {
      question: "How do I return a product?",
      answer: "You can return products within 14 days of delivery. Visit the 'Returns' section in your account or contact our support team to initiate a return."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards, PayPal, PayPal Credit, and PayPal Pay in 3. All payments are processed securely."
    },
    {
      question: "How do I update my device software?",
      answer: "Go to Settings > About phone > System update on your device. Make sure you're connected to Wi-Fi and have sufficient battery before updating."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* 为固定导航栏添加顶部间距 */}
      <div className="pt-16">
        {/* Top Promotional Banner */}
        <ClosableBanner 
          className="bg-orange-500 text-white text-center py-2 text-sm"
          storageKey="promotional-banner"
        >
          <p>
            <strong>Free shipping</strong> on orders over £50 | 
            <strong> 30-day returns</strong> | 
            <strong> Official warranty</strong>
          </p>
        </ClosableBanner>

        {/* Dynamic Spacer */}
        <DynamicSpacer />

        <div className="support-page min-h-screen bg-gray-50">
          {/* Hero Section */}
          <div className="support-hero text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="support-hero-content text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  How can we help you?
                </h1>
                <p className="text-xl mb-8 opacity-90">
                  Find answers, get support, and explore our help resources
                </p>
                
                {/* Search Bar */}
                <div className="support-search-container">
                  <div className="relative">
                <Search className="support-search-icon w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help topics, products, or issues..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="support-search-input"
                />
                {/* Search Results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map((result, index) => (
                      <div key={index} className="search-result-item">
                        <div className="search-result-title">{result.title}</div>
                        <div className="search-result-meta">
                          {result.category} • {result.type}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="quick-action-card"
            >
              <div className="quick-action-icon">{action.icon}</div>
              <h3 className="quick-action-title">{action.title}</h3>
              <p className="quick-action-description">{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Categories */}
      <div className="support-categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            {supportCategories.map((category) => (
              <div
                key={category.id}
                className="category-card"
                onClick={() => handleCategorySelect(category.id)}
              >
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-title">{category.title}</h3>
                <p className="category-description">{category.description}</p>
                <ul className="category-topics">
                  {category.topics.map((topic, index) => (
                    <li key={index} className="category-topic">
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="contact-methods">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Get in Touch</h2>
          <div className="contact-grid">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="contact-card"
              >
                <div className="contact-icon">{method.icon}</div>
                <h3 className="contact-method-title">{method.method}</h3>
                <p className="contact-method-description">{method.description}</p>
                <p className="contact-method-details">{method.details}</p>
                <button className="contact-action-btn">
                  {method.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <div className="faq-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list space-y-6">
            {faqItems.map((faq, index) => (
              <div
                key={index}
                className="faq-item"
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question-container">
                  <h3 className="faq-question">{faq.question}</h3>
                  {expandedFAQ === index ? (
                    <ChevronUp className="faq-chevron" />
                  ) : (
                    <ChevronDown className="faq-chevron" />
                  )}
                </div>
                {expandedFAQ === index && (
                  <p className="faq-answer">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="footer-cta">
        <div className="footer-cta-content max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="footer-cta-title">Still need help?</h2>
          <p className="footer-cta-description">
            Our support team is here to assist you with any questions or concerns
          </p>
          <div className="footer-cta-buttons">
            <button className="footer-cta-btn-primary">
              Contact Support
            </button>
            <button className="footer-cta-btn-secondary">
              Browse Help Center
            </button>
          </div>
        </div>
      </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Support Section */}
              <div>
                <h5 className="text-lg font-semibold mb-6 text-white">SUPPORT</h5>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li><Link href="/support/faq" className="hover:text-white transition-colors">Product FAQ</Link></li>
                <li><Link href="/support/mi-points" className="hover:text-white transition-colors">Mi Points FAQ</Link></li>
                <li><Link href="/support/shipping" className="hover:text-white transition-colors">Shipping FAQ</Link></li>
                  <li><Link href="/support/product" className="hover:text-white transition-colors">Product FAQ</Link></li>
                  <li><Link href="/support/trade-in" className="hover:text-white transition-colors">Trade-in</Link></li>
                  <li><Link href="/support/coupon" className="hover:text-white transition-colors">Coupon Code</Link></li>
                  <li><Link href="/support/exclusive" className="hover:text-white transition-colors">Exclusive Services</Link></li>
                  <li><Link href="/support/imei" className="hover:text-white transition-colors">IMEI Redemption</Link></li>
                  <li><Link href="/support/student" className="hover:text-white transition-colors">Student Discounts</Link></li>
                  <li><Link href="/support/financial" className="hover:text-white transition-colors">Financial Initial Disclosure</Link></li>
                  <li><Link href="/support/where-to-buy" className="hover:text-white transition-colors">Where to Buy</Link></li>
                  <li><Link href="/support/security" className="hover:text-white transition-colors">Product Security and Telecommunications infrastructure</Link></li>
                  <li><Link href="/support/manuals" className="hover:text-white transition-colors">Product User Manuals</Link></li>
                </ul>
              </div>

              {/* Terms and Conditions Section */}
              <div>
                <h5 className="text-lg font-semibold mb-6 text-white">TERMS AND CONDITIONS</h5>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li><Link href="/terms/tc" className="hover:text-white transition-colors">T&C</Link></li>
                  <li><Link href="/terms/financing" className="hover:text-white transition-colors">Financing Complaints</Link></li>
                  <li><Link href="/terms/uk-declaration" className="hover:text-white transition-colors">UK Declaration of Conformity</Link></li>
                  <li><Link href="/terms/scooter-safety" className="hover:text-white transition-colors">Scooter Safety Notice</Link></li>
                  <li><Link href="/terms/google-benefits" className="hover:text-white transition-colors">T&C of Google One Benefits</Link></li>
                </ul>
              </div>

              {/* Shop and Learn Section */}
              <div>
                <h5 className="text-lg font-semibold mb-6 text-white">SHOP AND LEARN</h5>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
                  <li><Link href="/products/xiaomi-series" className="hover:text-white transition-colors">Xiaomi Series</Link></li>
                  <li><Link href="/products/redmi-series" className="hover:text-white transition-colors">Redmi Series</Link></li>
                  <li><Link href="/products/poco" className="hover:text-white transition-colors">POCO</Link></li>
                  <li><Link href="/products/smart-home" className="hover:text-white transition-colors">Smart Home</Link></li>
                  <li><Link href="/products/lifestyle" className="hover:text-white transition-colors">Lifestyle</Link></li>
                  <li><Link href="/business" className="hover:text-white transition-colors">Xiaomi for Business</Link></li>
                  <li><Link href="/hyperos" className="hover:text-white transition-colors">HyperOS</Link></li>
                  <li><Link href="/news" className="hover:text-white transition-colors">Xiaomi News</Link></li>
                  <li><Link href="/coupons" className="hover:text-white transition-colors">New User Coupons</Link></li>
                  <li><Link href="/student-discounts" className="hover:text-white transition-colors">Student Discounts</Link></li>
                </ul>
              </div>

              {/* About Us and Newsletter Section */}
              <div>
                <h5 className="text-lg font-semibold mb-6 text-white">ABOUT US</h5>
                <ul className="space-y-3 text-sm text-gray-300 mb-8">
                  <li><Link href="/about/xiaomi" className="hover:text-white transition-colors">Xiaomi</Link></li>
                  <li><Link href="/about/leadership" className="hover:text-white transition-colors">Leadership Team</Link></li>
                  <li><Link href="/about/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/about/integrity" className="hover:text-white transition-colors">Integrity & Compliance</Link></li>
                  <li><Link href="/about/accessibility" className="hover:text-white transition-colors">Xiaomi Accessibility</Link></li>
                  <li><Link href="/about/trust" className="hover:text-white transition-colors">Trust Centre</Link></li>
                </ul>

                {/* Follow Xiaomi */}
                <div className="mb-8">
                  <h6 className="text-base font-semibold mb-4 text-white">Follow Xiaomi</h6>
                  <div className="flex space-x-4">
                    <Link href="https://facebook.com/xiaomi" className="text-gray-300 hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </Link>
                    <Link href="https://twitter.com/xiaomi" className="text-gray-300 hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </Link>
                    <Link href="https://instagram.com/xiaomi" className="text-gray-300 hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323C6.001 8.198 7.152 7.708 8.449 7.708s2.448.49 3.323 1.416c.876.875 1.366 2.026 1.366 3.323s-.49 2.448-1.366 3.323c-.875.807-2.026 1.218-3.323 1.218zm7.718-9.092c-.876 0-1.635-.759-1.635-1.635s.759-1.635 1.635-1.635 1.635.759 1.635 1.635-.759 1.635-1.635 1.635zm0 0"/>
                      </svg>
                    </Link>
                    <Link href="https://tiktok.com/@xiaomi" className="text-gray-300 hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Newsletter */}
                <div>
                  <h6 className="text-base font-semibold mb-4 text-white">Enter your email address to subscribe to our newsletters</h6>
                  <div className="flex gap-2 mb-6">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 text-sm"
                    />
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* App Download */}
                  <div className="border border-gray-600 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h6 className="text-white font-semibold text-sm">Get the Xiaomi Store App</h6>
                        <p className="text-gray-400 text-xs">Scan for up-to-date info and a better shopping experience</p>
                      </div>
                    </div>
                  </div>

                  {/* Google Play Download */}
                  <Link href="https://play.google.com/store/apps/details?id=com.xiaomi.shop" className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    Download on Google Play
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-700 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                  <p>Copyright © 2010 - 2025 Xiaomi. All Rights Reserved</p>
                  <Link href="/cookie-settings" className="hover:text-white transition-colors">Cookie settings</Link>
                  <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
                  <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>United Kingdom / English</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}