'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">MI</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">Xiaomi Store</span>
              </div>
            </Link>
            <Link 
              href="/" 
              className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Xiaomi Account User Agreement</h1>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
              Welcome to Xiaomi Account!
            </p>
            
            <p>
              This user agreement between you and Xiaomi Inc. and its affiliates (hereinafter referred to as "Xiaomi", "we", 
              "our", or "us") governs your creation and use of a Xiaomi Account. Please carefully read and fully 
              understand all the terms and conditions of this user agreement (hereinafter referred to as "this Agreement"), 
              especially those regarding service fees, applicable laws, dispute resolution, the exemption of Xiaomi from 
              liabilities or restrictions to its liabilities, and your rights and obligations. <strong>Those terms and conditions 
              are highlighted in bold for your convenience.</strong> Minors should read and agree to this Agreement under the 
              supervision of a legal guardian.
            </p>
            
            <p>
              <strong>Creating an account and using our services both constitute your agreement to accept and be bound by the 
              terms and conditions of this Agreement.</strong>
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction to Xiaomi Account</h2>
            
            <div className="space-y-4">
              <p>
                <strong>1.1</strong> Xiaomi authorizes you, through this Agreement, to create, sign in to, and use Xiaomi Account and its 
                related services. All Xiaomi Accounts are the property of Xiaomi, and you have the right to use your Xiaomi 
                Account as the account creator.
              </p>
              
              <p>
                <strong>1.2</strong> A Xiaomi Account gives you access to products and services provided by Xiaomi, including but not limited to 
                mi.com, GetApps, Xiaomi Cloud, Themes, and the IoT platform. You agree that when you use any specific service, 
                you accept and will be bound by the terms and conditions of both this Agreement and the relevant service 
                agreements of the specific service.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Creating and using an account</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Creating an account</h3>
            
            <div className="space-y-4">
              <p>
                <strong>2.1.1</strong> You must confirm that you are of the age of majority in the country or region in which you are located 
                before creating or using a Xiaomi Account.
              </p>
              
              <p>
                <strong>2.1.2</strong> You can create a Xiaomi Account by signing up. Go to the Xiaomi Account sign-up page, read and agree to 
                the Xiaomi Account User Agreement, and follow the on-screen prompts. <strong>You agree to provide true, 
                accurate, and complete information about yourself when you sign up.</strong> Xiaomi is not liable for any problems 
                caused by false or mistaken registration information or failure to update user information. You can 
                find and update your account details in your account settings. <strong>You should register your account using 
                your real identity.</strong> You will not be able to sign up for a Xiaomi Account if you include illegal or 
                inappropriate content in your profile, including your nickname and profile photo. If you include any false, 
                illegal, or inappropriate content in your profile, Xiaomi may correct the information within a limited 
                timeframe, or suspend or terminate your account without prior notice. After you fill in the 
                information as prompted on the registration page, read and agree to the terms of this Agreement, and complete 
                all the registration procedures, you may obtain a Xiaomi Account and become a Xiaomi user.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Using your account</h3>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>2.2.1</strong> <strong>You are responsible for all activity that happens on or through your account and the consequences 
                thereof,</strong> including but not limited to acceptance of service-specific terms, sharing and disclosure of 
                information, and the purchase of products and services.
              </p>
              
              <p className="text-gray-700">
                <strong>2.2.2</strong> Your Xiaomi Account is for you only. Your account information includes both your personal details as well 
                as Xiaomi business information. You may not directly or indirectly allow third parties to use your Xiaomi 
                Account or access information on your account without Xiaomi's consent. Xiaomi reserves the right to terminate 
                this user agreement or suspend access to our services if we reasonably believe, after examination following 
                policy violation procedures and standards, that your account security is in danger, or that Xiaomi's information 
                security may be compromised by the use of your account.
              </p>
              
              <p className="text-gray-700">
                <strong>2.2.3</strong> When you use a third-party account to sign in to Xiaomi services, your third-party account is linked with 
                your Xiaomi Account. We will use your information shared by third parties with your consent, such as the profile 
                photo of the linked third-party account. This Agreement applies to any and all usage of your Xiaomi Account.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.3 Accounts, passwords, and security</h3>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>2.3.1</strong> A Xiaomi Account includes an account name and password. An account name can be a Xiaomi Account ID or 
                phone number. <strong>You are entirely responsible for maintaining the confidentiality of the information you hold for 
                your account and updating your password regularly.</strong> If you lose or forget your account information, you 
                can recover it by following our account recovery steps. You'll be asked to provide the required information to 
                verify the account is yours. We won't be able to process your request if the info you provided is inaccurate, 
                invalid, or incomplete.
              </p>
              
              <p className="text-gray-700">
                <strong>2.3.2</strong> If you're using an account that was not created by you, you must obtain authorization from the account 
                creator before using it. If you use an account without proper authorization, you will be responsible for all 
                consequences arising from such use.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Privacy and Data Protection</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>3.1</strong> Xiaomi respects your privacy and is committed to protecting your personal information. Our collection, 
                use, and disclosure of your personal information is governed by our Privacy Policy, which is incorporated into 
                this Agreement by reference.
              </p>
              
              <p className="text-gray-700">
                <strong>3.2</strong> By creating and using a Xiaomi Account, you consent to the collection, use, and disclosure of your 
                personal information as described in our Privacy Policy.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Prohibited Uses</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>4.1</strong> You may not use your Xiaomi Account for any illegal, harmful, or unauthorized purposes, including but 
                not limited to:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Violating any applicable laws or regulations</li>
                <li>Infringing on the rights of others</li>
                <li>Distributing malware or other harmful software</li>
                <li>Engaging in fraudulent activities</li>
                <li>Harassing or threatening other users</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Termination</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>5.1</strong> You may terminate your Xiaomi Account at any time by following the account deletion process in your 
                account settings.
              </p>
              
              <p className="text-gray-700">
                <strong>5.2</strong> Xiaomi may suspend or terminate your account if you violate this Agreement or engage in prohibited 
                activities. We will provide notice when reasonably possible, but reserve the right to take immediate action 
                when necessary to protect our services or other users.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>6.1</strong> <strong>To the maximum extent permitted by applicable law, Xiaomi shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, 
                use, goodwill, or other intangible losses.</strong>
              </p>
              
              <p className="text-gray-700">
                <strong>6.2</strong> <strong>Xiaomi's total liability to you for all claims arising from or relating to this Agreement shall not 
                exceed the amount you have paid to Xiaomi in the twelve months preceding the claim.</strong>
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Changes to this Agreement</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>7.1</strong> Xiaomi may modify this Agreement from time to time. We will notify you of material changes by posting 
                the updated Agreement on our website or through other appropriate means.
              </p>
              
              <p className="text-gray-700">
                <strong>7.2</strong> Your continued use of your Xiaomi Account after the effective date of any changes constitutes your 
                acceptance of the modified Agreement.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Contact Information</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                If you have any questions about this Agreement or your Xiaomi Account, please contact us at:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Xiaomi Inc.</strong></p>
                <p className="text-gray-700">Email: support@xiaomi.com</p>
                <p className="text-gray-700">Website: www.mi.com</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xs">MI</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Xiaomi Store</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              © 2024 Xiaomi Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}