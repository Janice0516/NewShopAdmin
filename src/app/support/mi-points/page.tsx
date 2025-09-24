'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ClosableBanner from '@/components/ClosableBanner';
import DynamicSpacer from '@/components/DynamicSpacer';
import '@/styles/navbar.css';

const MiPointsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ClosableBanner>
        🎉 Double Mi Points Event - Earn twice the rewards on selected products!
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
          <span className="text-gray-900">Mi Points</span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-normal text-black mb-8">Mi Points</h1>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Section 1: Earning Mi Points */}
          <section>
            <h2 className="text-xl font-medium text-black mb-6 border-b border-gray-200 pb-2">
              1. Earning Mi Points
            </h2>
            
            <div className="space-y-8">
              {/* Q1 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q1: How can I earn Mi Points?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> Currently you can earn Mi Points in the following ways:</p>
                  <p className="mb-2">A. Collecting the welcome offer for new users from the Mi Points Center: 50 Mi Points. Every new user can collect the welcome offer once after signing up.</p>
                  <p className="mb-2">B. Collecting Mi Points for downloading the app from the Mi Points Center: 50 Mi Points. Every user who has downloaded the app can collect the Mi Points once.</p>
                  <p className="mb-2">C. Shopping: Every pound spent earns you one Mi Point. The actual spent amount is the total amount as stipulated on the invoice (including any handling and shipping costs). Should the total amount include any decimal amount, the earned Mi Points will be rounded up if the decimal amount is equal or higher than ,50 and rounded down if the decimal amount is equal or lower than ,49.</p>
                  <p className="mb-2">D. Product Review Posting: You can earn Mi Points for a published product review. Mi Points are only awarded once for a review on the same product in an order. Therefore, you cannot earn more Mi Points by deleting and reposting your review. The Mi Points received will be withdrawn if the review is deleted.</p>
                  <p className="mb-2">
                    <a href="https://ams.buy.mi.com/uk/user/points-center" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                      Click here to get more information: https://ams.buy.mi.com/uk/user/points-center
                    </a>
                  </p>
                  <p>E. Collecting fuel from the Points Center: Each fuel collected is worth 2 Mi Points — earn 50 extra Mi Points when you collect fuel for seven days in a row.</p>
                </div>
              </div>

              {/* Q2 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q2: When will the Mi Points earned be paid out to my account?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-3"><strong>Answer:</strong></p>
                  <p className="mb-3"><strong>Shopping:</strong> After the product you purchased is signed, the system will automatically accumulate points for your consumption. Users accept that Xiaomi has the right to deduct its Mi Points at any time if the user returns/rejects the purchased product or if there is any violation of the law and this policy.</p>
                  
                  <p className="mb-2"><strong>New Users Registration & download Mi Store App</strong></p>
                  <p className="mb-2">If you have completed the first registration on Mi.com/uk or downloaded the Mi Store APP for the first time, you can go to the Points Center to collect the corresponding reward points.</p>
                  <p className="mb-3">
                    <a href="https://buy.mi.com/uk/user/points-center" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                      Click here to collect your Mi Points: https://buy.mi.com/uk/user/points-center
                    </a>
                  </p>
                  
                  <p className="mb-2"><strong>Share product link/ Sign&Sign Continuous / Comment /Other activities</strong></p>
                  <p className="mb-2">If you have completed the tasks above, the reward Mi Points will be automatically issued to your Mi account, you can go to the Points Center to check your Mi Points.</p>
                  <p>
                    <a href="https://buy.mi.com/uk/user/points-center" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                      Click here to check your Mi Points: https://buy.mi.com/uk/user/points-center
                    </a>
                  </p>
                </div>
              </div>

              {/* Q3 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q3: When can I earn double Mi Points?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p><strong>Answer:</strong> From time to time, we offer products participating in the double Mi Points activities. You can see the products participating in the double Mi Points activities in the Mi Points Center. You can earn double Mi Points by purchasing these products during the double Mi Points activities.</p>
                </div>
              </div>

              {/* Q4 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q4: Will the Mi Points earned be deducted if I return the products in the order?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p><strong>Answer:</strong> If all the products in the order are returned, we will deduct all the Mi Points paid out to your account upon the successful delivery of the order. If part of the products in the order are returned, we will deduct the Mi Points corresponding to the products returned and the Mi Points corresponding to the part of the shipping fee shared by the products.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Using Mi Points */}
          <section>
            <h2 className="text-xl font-medium text-black mb-6 border-b border-gray-200 pb-2">
              2. Using Mi Points
            </h2>
            
            <div className="space-y-8">
              {/* Q5 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q5: How can I use my Mi Points?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> Currently you can use Mi Points in the following ways:</p>
                  <p className="mb-2">A. Using Mi Points to redeem coupons. You can see the list of available coupons in the Mi Points Center. You can see the value, required points for redemption, conditions of use and validity period of each coupon.</p>
                  <p>B. If your Mi Points balance is at least 1000, you can use Mi Points to offset your order amount when placing orders. When placing orders, you can directly use Mi Points to offset the order amount you should pay. Mi Points offset: 100 Mi Points = €1/£1</p>
                </div>
              </div>

              {/* Q6 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q6: Are there any conditions for using Mi Points to offset the order amount?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2"><strong>Answer:</strong> Conditions of using Mi Points to offset order amount:</p>
                  <p className="mb-2">A. Mi Points can only be redeemed when the available Mi Points balance is at least 1000.</p>
                  <p>B. No less than €0.1 of each order may be offset. No more than 20% of the order total may be offset. Mi Points may not be used to offset shipping fees.</p>
                </div>
              </div>

              {/* Q7 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q7: Can Mi Points be returned once they have been used to redeem coupons?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p><strong>Answer:</strong> Mi Points cannot be returned once they have been used to redeem coupons, regardless of whether the coupon redeemed with points is used within the validity period of the coupon, the points will not be returned once redeemed. Coupons cannot be returned after order payments once they have been used. Please think carefully before redeeming.</p>
                </div>
              </div>

              {/* Q8 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q8: If I used Mi Points to offset the order amount when placing an order and then the order was canceled or the payment failed, will the Mi Points be returned?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p><strong>Answer:</strong> In this case, your Mi Points will be returned to your account in 4 hours after the order has been canceled. If the Mi Points expire in whole or in part at the time of refund, the expired Mi Points will not be returned.</p>
                </div>
              </div>

              {/* Q9 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q9: If I used Mi Points to offset the order amount when placing an order and then the order was rejected or returned, will the Mi Points be returned?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p><strong>Answer:</strong> In this case, your Mi Points will be returned to your account in 4 hours after we start processing your refund. If you request to refund part of the order, the Mi Points used for the refunded products will be returned. If the Mi Points expire in whole or in part at the time of refund, the expired Mi Points will not be returned.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Validity Period of Points */}
          <section>
            <h2 className="text-xl font-medium text-black mb-6 border-b border-gray-200 pb-2">
              3. Validity Period of Points
            </h2>
            
            <div className="space-y-8">
              {/* Q10 */}
              <div>
                <h3 className="text-base font-medium text-black mb-3">
                  Q10: How long are the Mi Points valid for?
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p><strong>Answer:</strong> Any amount of Mi Points older than 12 months after credit shall be forfeited on the next 1st day of the month after the Mi Points became older than 12 months, unless a longer expiry period has been published by the Operator. The date and amount of the lapsed Mi Points shall be indicated via push and/or message in the Mi Point Center on the 1st day every month. For example, Mi Points earned in January 2022 will be cleared on February 1, 2023, and push and/or message shall be given on January 1, 2023.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/support" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/support/warranty" className="text-gray-300 hover:text-white transition-colors">Warranty</Link></li>
                <li><Link href="/support/repair" className="text-gray-300 hover:text-white transition-colors">Repair Services</Link></li>
                <li><Link href="/support/mi-points" className="text-gray-300 hover:text-white transition-colors">Mi Points FAQ</Link></li>
              </ul>
            </div>

            {/* Shop */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><Link href="/products/phones" className="text-gray-300 hover:text-white transition-colors">Smartphones</Link></li>
                <li><Link href="/products/laptops" className="text-gray-300 hover:text-white transition-colors">Laptops</Link></li>
                <li><Link href="/products/tablets" className="text-gray-300 hover:text-white transition-colors">Tablets</Link></li>
                <li><Link href="/products/accessories" className="text-gray-300 hover:text-white transition-colors">Accessories</Link></li>
              </ul>
            </div>

            {/* Retail Store */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Retail Store</h3>
              <ul className="space-y-2">
                <li><Link href="/stores" className="text-gray-300 hover:text-white transition-colors">Mi Store</Link></li>
                <li><Link href="/stores/authorized" className="text-gray-300 hover:text-white transition-colors">Authorized Store</Link></li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">Xiaomi</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">User Agreement</Link></li>
                <li><Link href="/integrity" className="text-gray-300 hover:text-white transition-colors">Integrity & Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                Copyright © 2024 Xiaomi. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/facebook" className="text-gray-400 hover:text-white transition-colors">Facebook</Link>
                <Link href="/twitter" className="text-gray-400 hover:text-white transition-colors">Twitter</Link>
                <Link href="/instagram" className="text-gray-400 hover:text-white transition-colors">Instagram</Link>
                <Link href="/youtube" className="text-gray-400 hover:text-white transition-colors">YouTube</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MiPointsPage;