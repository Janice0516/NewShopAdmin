'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ClosableBanner from '@/components/ClosableBanner';
import DynamicSpacer from '@/components/DynamicSpacer';
import '@/styles/navbar.css';

const ShippingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ClosableBanner>
        🚚 Free shipping on orders over £50 - Fast delivery across the UK!
      </ClosableBanner>
      <DynamicSpacer />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/support" className="hover:text-orange-600 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Support
          </Link>
          <span>/</span>
          <span className="text-gray-900">Shipping FAQ</span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-normal text-black mb-8">Shipping FAQ</h1>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Section 1: Shipping Policy */}
          <section>
            <h2 className="text-xl font-medium text-black mb-6 border-b border-gray-200 pb-2">
              1. Shipping Policy
            </h2>
            
            <div className="space-y-8">
              {/* Q1 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q1: What are your shipping options?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> We offer the following shipping options:</p>
                  <p className="mb-2">A. <strong>Standard Delivery:</strong> Free for orders over £50, otherwise £4.99. Delivery within 3-5 working days.</p>
                  <p className="mb-2">B. <strong>Express Delivery:</strong> £9.99 for all orders. Delivery within 1-2 working days.</p>
                  <p className="mb-2">C. <strong>Next Day Delivery:</strong> £14.99 for all orders. Order before 2PM for next working day delivery.</p>
                  <p>D. <strong>Click & Collect:</strong> Free collection from selected Mi Store locations. Ready for collection within 2-3 working days.</p>
                </div>
              </div>

              {/* Q2 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q2: Which countries do you ship to?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> Currently, we ship to the following locations:</p>
                  <p className="mb-2">A. <strong>United Kingdom:</strong> All standard shipping options available including England, Scotland, Wales, and Northern Ireland.</p>
                  <p className="mb-2">B. <strong>European Union:</strong> Standard international shipping available to all EU countries. Delivery time: 5-10 working days. Shipping cost: £19.99.</p>
                  <p>C. <strong>Other Countries:</strong> We are continuously expanding our shipping network. Please check our shipping calculator at checkout for availability and costs.</p>
                </div>
              </div>

              {/* Q3 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q3: How do you calculate shipping costs?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> Shipping costs are calculated based on:</p>
                  <p className="mb-2">A. <strong>Order Value:</strong> Free standard shipping for orders over £50 within the UK.</p>
                  <p className="mb-2">B. <strong>Delivery Speed:</strong> Express and next-day options have fixed rates regardless of order value.</p>
                  <p className="mb-2">C. <strong>Destination:</strong> International shipping rates vary by country and are calculated by weight and dimensions.</p>
                  <p>D. <strong>Product Size:</strong> Large items may incur additional handling fees, which will be clearly displayed at checkout.</p>
                </div>
              </div>

              {/* Q4 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q4: Do you offer free shipping?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> Yes, we offer free shipping in the following cases:</p>
                  <p className="mb-2">A. <strong>Standard Delivery:</strong> Free for all orders over £50 within the UK.</p>
                  <p className="mb-2">B. <strong>Click & Collect:</strong> Always free when collecting from Mi Store locations.</p>
                  <p>C. <strong>Promotional Periods:</strong> We occasionally offer free shipping promotions on all orders. Check our homepage for current offers.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Delivery Times */}
          <section>
            <h2 className="text-xl font-medium text-black mb-6 border-b border-gray-200 pb-2">
              2. Delivery Times
            </h2>
            
            <div className="space-y-8">
              {/* Q5 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q5: How long does delivery take?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> Delivery times depend on your chosen shipping method:</p>
                  <p className="mb-2">A. <strong>Standard Delivery:</strong> 3-5 working days from dispatch.</p>
                  <p className="mb-2">B. <strong>Express Delivery:</strong> 1-2 working days from dispatch.</p>
                  <p className="mb-2">C. <strong>Next Day Delivery:</strong> Next working day if ordered before 2PM.</p>
                  <p className="mb-2">D. <strong>International Shipping:</strong> 5-10 working days depending on destination.</p>
                  <p>Please note: Processing time is 1-2 working days before dispatch for all orders.</p>
                </div>
              </div>

              {/* Q6 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q6: When will my order be dispatched?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> Order processing and dispatch times:</p>
                  <p className="mb-2">A. <strong>In-Stock Items:</strong> Orders placed before 2PM on working days are typically dispatched the same day.</p>
                  <p className="mb-2">B. <strong>Pre-Order Items:</strong> Dispatched on or shortly after the official release date.</p>
                  <p className="mb-2">C. <strong>Custom/Personalized Items:</strong> Additional 3-5 working days for customization before dispatch.</p>
                  <p>D. <strong>Weekend Orders:</strong> Orders placed on weekends are processed on the next working day.</p>
                </div>
              </div>

              {/* Q7 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q7: Can I track my order?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> Yes, you can track your order through multiple methods:</p>
                  <p className="mb-2">A. <strong>Email Updates:</strong> You'll receive email notifications with tracking information once your order is dispatched.</p>
                  <p className="mb-2">B. <strong>SMS Notifications:</strong> Optional SMS updates on dispatch and delivery status.</p>
                  <p className="mb-2">C. <strong>Online Tracking:</strong> Use your order number and email to track on our website.</p>
                  <p>D. <strong>Carrier Tracking:</strong> Direct tracking through our delivery partners' websites using the provided tracking number.</p>
                </div>
              </div>

              {/* Q8 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q8: What if I'm not home for delivery?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> If you're not available for delivery:</p>
                  <p className="mb-2">A. <strong>Safe Place:</strong> You can specify a safe place for delivery during checkout.</p>
                  <p className="mb-2">B. <strong>Neighbor Delivery:</strong> Our couriers may leave packages with trusted neighbors.</p>
                  <p className="mb-2">C. <strong>Redelivery:</strong> Failed deliveries will be automatically rescheduled for the next working day.</p>
                  <p>D. <strong>Collection Point:</strong> Packages may be left at local collection points for pickup within 7 days.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Special Circumstances */}
          <section>
            <h2 className="text-xl font-medium text-black mb-6 border-b border-gray-200 pb-2">
              3. Special Circumstances
            </h2>
            
            <div className="space-y-8">
              {/* Q9 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q9: What happens if my package is damaged or lost?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> We take full responsibility for packages until they reach you:</p>
                  <p className="mb-2">A. <strong>Damaged Packages:</strong> Contact us within 48 hours of delivery with photos. We'll arrange a replacement or full refund.</p>
                  <p className="mb-2">B. <strong>Lost Packages:</strong> If tracking shows delivered but you haven't received it, we'll investigate and provide a replacement.</p>
                  <p className="mb-2">C. <strong>Insurance:</strong> All shipments are fully insured against loss or damage.</p>
                  <p>D. <strong>Claims Process:</strong> Our customer service team will handle all insurance claims on your behalf.</p>
                </div>
              </div>

              {/* Q10 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q10: Can I change my delivery address after placing an order?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> Address changes depend on order status:</p>
                  <p className="mb-2">A. <strong>Before Processing:</strong> Address can be changed free of charge by contacting customer service.</p>
                  <p className="mb-2">B. <strong>After Dispatch:</strong> Contact our courier partner directly using your tracking number to arrange delivery redirection (additional charges may apply).</p>
                  <p className="mb-2">C. <strong>International Orders:</strong> Address changes for international shipments may incur additional customs processing fees.</p>
                  <p>D. <strong>Same-Day Changes:</strong> For urgent address changes, call our customer service hotline for immediate assistance.</p>
                </div>
              </div>

              {/* Q11 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q11: Do you ship to PO Boxes or APO/FPO addresses?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> Shipping to special addresses:</p>
                  <p className="mb-2">A. <strong>PO Boxes:</strong> We can ship to UK PO Boxes using Royal Mail services only. Express delivery not available.</p>
                  <p className="mb-2">B. <strong>APO/FPO Addresses:</strong> Military addresses are supported with standard international shipping rates.</p>
                  <p className="mb-2">C. <strong>BFPO Addresses:</strong> British Forces Post Office addresses are treated as UK domestic shipping.</p>
                  <p>D. <strong>Restrictions:</strong> Some large items or products with lithium batteries may not be eligible for PO Box delivery.</p>
                </div>
              </div>

              {/* Q12 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q12: What are your holiday shipping policies?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> During holiday periods:</p>
                  <p className="mb-2">A. <strong>Extended Processing:</strong> Allow additional 1-2 days processing time during peak seasons (Black Friday, Christmas, etc.).</p>
                  <p className="mb-2">B. <strong>Cutoff Dates:</strong> Specific cutoff dates for Christmas delivery will be published on our website in November.</p>
                  <p className="mb-2">C. <strong>Limited Service:</strong> No deliveries on bank holidays. Service resumes the next working day.</p>
                  <p>D. <strong>Priority Processing:</strong> Express and next-day services may be prioritized during high-demand periods.</p>
                </div>
              </div>
            </div>
          </section>
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
                <li><Link href="/uk/store" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/uk/store/xiaomi-series" className="hover:text-white transition-colors">Xiaomi Series</Link></li>
                <li><Link href="/uk/store/redmi-series" className="hover:text-white transition-colors">Redmi Series</Link></li>
                <li><Link href="/uk/store/poco" className="hover:text-white transition-colors">POCO</Link></li>
                <li><Link href="/uk/store/smart-home" className="hover:text-white transition-colors">Smart Home</Link></li>
                <li><Link href="/uk/store/lifestyle" className="hover:text-white transition-colors">Lifestyle</Link></li>
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
  );
};

export default ShippingPage;