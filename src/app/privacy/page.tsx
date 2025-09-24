import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-orange-500 font-semibold text-lg hover:text-orange-600">
            Xiaomi Store
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-lg max-w-none text-gray-900">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Xiaomi Account Privacy Policy</h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
            <p className="text-blue-800">
              <strong>Our Privacy Policy was updated on March 6, 2025.</strong><br />
              Please take a moment to familiarize yourself with our privacy practices and let us know if you have any questions.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <ul className="space-y-2 text-blue-600">
              <li><a href="#introduction" className="hover:underline">1. Introduction</a></li>
              <li><a href="#definition" className="hover:underline">2. Definition of personal information</a></li>
              <li><a href="#collection" className="hover:underline">3. What information we collect and how we use it</a></li>
              <li className="ml-4"><a href="#collection-personal" className="hover:underline">3.1 Collection of personal information</a></li>
              <li className="ml-4"><a href="#collection-third-party" className="hover:underline">3.2 Personal information collected from third parties</a></li>
              <li className="ml-4"><a href="#collection-non-personal" className="hover:underline">3.3 Non-personally identifiable information</a></li>
              <li><a href="#sharing" className="hover:underline">4. How we share your personal information with third parties</a></li>
              <li><a href="#legal-basis" className="hover:underline">5. The legal basis for processing your personal information</a></li>
              <li><a href="#retention" className="hover:underline">6. Retention period</a></li>
              <li><a href="#preferences" className="hover:underline">7. Managing your privacy preferences</a></li>
              <li><a href="#rights" className="hover:underline">8. Your data protection rights</a></li>
              <li><a href="#exercising-rights" className="hover:underline">9. Exercising your data protection rights and contacting us</a></li>
              <li><a href="#global-transfer" className="hover:underline">10. How your personal information is transferred globally</a></li>
              <li><a href="#obligation" className="hover:underline">11. Your obligation to provide personal information</a></li>
              <li><a href="#automated-processing" className="hover:underline">12. Automated processing of your personal information (including profiling)</a></li>
              <li><a href="#updates" className="hover:underline">13. How this Privacy Policy is updated</a></li>
            </ul>
          </div>

          {/* Section 1: Introduction */}
          <section id="introduction" className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="mb-4 text-gray-700">
              This product and related services are provided by <strong>Xiaomi Technology Netherlands B.V.</strong>, <strong>Xiaomi Technologies Singapore Pte. Ltd.</strong>, and/or our affiliated companies (hereinafter referred to as "Xiaomi", "we", "our", or "us") to allow you to create, sign in to, and manage your Xiaomi Account.
            </p>
            <p className="mb-4 text-gray-700">
              We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, transfer, protect, and process any information that you give us or that you allow third parties to provide to us when you use Xiaomi Account and related services. You may consult the privacy policies of the relevant products or services for terms and conditions regarding collection and use of personal information when you use other products or services while signed in to your Xiaomi Account. Additional information on our security mechanisms and policies on minors can be found on <a href="https://privacy.mi.com/all/languages/" className="text-blue-600 hover:underline">https://privacy.mi.com/all/languages/</a>.
            </p>
            <p className="mb-4 text-gray-700">
              Ultimately, what we want is the best for all our users. Should you have any questions about our data handling practices regarding personal information as summarized in this Privacy Policy, please contact us via <a href="https://privacy.mi.com/support" className="text-blue-600 hover:underline">https://privacy.mi.com/support</a> to address your specific concerns. We will be happy to hear from you.
            </p>
          </section>

          {/* Section 2: Definition */}
          <section id="definition" className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Definition of personal information</h2>
            <p className="mb-4 text-gray-700">
              For the purpose of this Privacy Policy, <strong>"personal information"</strong> means information that can be used to directly or indirectly identify an individual, either from that information alone or from that information combined with other information about that individual available to Xiaomi, unless otherwise specified by applicable law in your jurisdiction. "Personal information" includes identifying information such as name, contact information, ID number, location information, and online identifiers (such as Xiaomi Account ID). We will use your personal information strictly following this Privacy Policy.
            </p>
          </section>

          {/* Section 3: Collection */}
          <section id="collection" className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. What information we collect and how we use it</h2>
            
            <div id="collection-personal" className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Collection of personal information</h3>
              <p className="mb-4 text-gray-700">
                The purpose of collecting personal information is to provide you with products and/or services. To this end, we will process personal information for the following purposes:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Creating an account and signing in</h4>
                  <p className="text-gray-700">
                    When you create an account, you'll need to provide us with the region you live in and a phone number or email address. You'll be assigned a Xiaomi Account ID. Your account and password will be encrypted and stored to our servers. We strongly advise you not to share your password information to prevent theft of your Xiaomi Account by others.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Completing account information</h4>
                  <p className="text-gray-700">
                    While using various Xiaomi services, you may receive better service quality and user experience by adding basic information to your Xiaomi Account profile, including profile photo, nickname, and gender, as well as setting up a secret question for security purposes. If you choose not to provide this information, this will not affect your use of the basic services and features of Xiaomi Account.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Features required for account security</h4>
                  <p className="text-gray-700">
                    In order to enhance system security when you use our products and/or services, prevent phishing website fraud, and protect account security, we will verify your identity through SMS verification as well as secondary verification when necessary. To this end, we will collect SMS verification codes and secondary verification codes.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">IT and activity-related information</h4>
                  <p className="text-gray-700">
                    We will also collect your account creation/sign-in time, device-related information (such as IMEI/OAID (on Android Q), device model, and operating system version), and network information (such as the IP address generally used when signing in) in order to judge whether or not the account creation or sign-in environment is secure.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Survey participation</h4>
                  <p className="text-gray-700">
                    When you participate in surveys that we organize, the specific types of personal information you're asked to enter in each survey (e.g. age range, gender, country or region of residence, occupation, income range, etc.) will always be available for you to view when you open the survey. You can exit the survey at any time before submitting the survey if you no longer wish to participate. When providing personal information during a survey, you can select "Prefer not to say" or an equivalent answer.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Participation in promotional activities</h4>
                  <p className="text-gray-700">
                    If you participate in promotional activities organized by us, we may collect your personal information for the purpose of organizing and conducting promotional activities, including but not limited to your name, contact information, delivery address, and other information necessary for prize delivery.
                  </p>
                </div>
              </div>
            </div>

            <div id="collection-third-party" className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Personal information collected from third parties</h3>
              <p className="mb-4 text-gray-700">
                We may receive your personal information from third parties in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>When you use third-party services to sign in to your Xiaomi Account</li>
                <li>When you authorize third parties to share your information with us</li>
                <li>When we obtain information from publicly available sources</li>
              </ul>
            </div>

            <div id="collection-non-personal" className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Non-personally identifiable information</h3>
              <p className="text-gray-700">
                We may also collect and use non-personally identifiable information. This includes aggregated usage data, technical information about your device, and other information that cannot be used to identify you personally. This information helps us improve our services and understand how users interact with our products.
              </p>
            </div>
          </section>

          {/* Section 4: Sharing */}
          <section id="sharing" className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How we share your personal information with third parties</h2>
            <p className="mb-4 text-gray-700">
              We do not sell your personal information to third parties. We may share your personal information with third parties only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>With your consent:</strong> We will share your personal information with third parties when you have given us explicit consent to do so.</li>
              <li><strong>Service providers:</strong> We may share your information with trusted service providers who assist us in operating our services.</li>
              <li><strong>Legal requirements:</strong> We may disclose your information when required by law or to protect our rights and safety.</li>
              <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
            </ul>
          </section>

          {/* Section 5: Legal Basis */}
          <section id="legal-basis" className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. The legal basis for processing your personal information</h2>
            <p className="mb-4 text-gray-700">
              We process your personal information based on the following legal grounds:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Consent:</strong> When you have given us clear consent to process your personal information for specific purposes.</li>
              <li><strong>Contract performance:</strong> When processing is necessary to perform a contract with you or to take steps at your request before entering into a contract.</li>
              <li><strong>Legal obligations:</strong> When we need to process your information to comply with legal obligations.</li>
              <li><strong>Legitimate interests:</strong> When processing is necessary for our legitimate interests, provided these interests are not overridden by your rights and freedoms.</li>
            </ul>
          </section>

          {/* Section 6: Retention */}
          <section id="retention" className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Retention period</h2>
            <p className="mb-4 text-gray-700">
              We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When determining the retention period, we consider factors such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>The purpose for which we collected the information</li>
              <li>Legal and regulatory requirements</li>
              <li>The nature and sensitivity of the information</li>
              <li>Potential risks from unauthorized use or disclosure</li>
            </ul>
          </section>

          {/* Section 7: Privacy Preferences */}
          <section id="preferences" className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Managing your privacy preferences</h2>
            <p className="mb-4 text-gray-700">
              You can manage your privacy preferences through your Xiaomi Account settings. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Controlling what information is collected</li>
              <li>Managing communication preferences</li>
              <li>Setting data sharing preferences</li>
              <li>Configuring security settings</li>
            </ul>
          </section>

          {/* Section 8: Data Protection Rights */}
          <section id="rights" className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your data protection rights</h2>
            <p className="mb-4 text-gray-700">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Right of access:</strong> You can request copies of your personal information.</li>
              <li><strong>Right to rectification:</strong> You can request correction of inaccurate or incomplete information.</li>
              <li><strong>Right to erasure:</strong> You can request deletion of your personal information under certain circumstances.</li>
              <li><strong>Right to restrict processing:</strong> You can request limitation of how we process your information.</li>
              <li><strong>Right to data portability:</strong> You can request transfer of your information to another service provider.</li>
              <li><strong>Right to object:</strong> You can object to certain types of processing of your information.</li>
            </ul>
          </section>

          {/* Section 9: Exercising Rights */}
          <section id="exercising-rights" className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Exercising your data protection rights and contacting us</h2>
            <p className="mb-4 text-gray-700">
              To exercise your data protection rights or if you have any questions about this Privacy Policy, please contact us through:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Privacy support portal: <a href="https://privacy.mi.com/support" className="text-blue-600 hover:underline">https://privacy.mi.com/support</a></li>
              <li>Email: privacy@xiaomi.com</li>
              <li>Your Xiaomi Account settings page</li>
            </ul>
          </section>

          {/* Section 10: Global Transfer */}
          <section id="global-transfer" className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. How your personal information is transferred globally</h2>
            <p className="mb-4 text-gray-700">
              Xiaomi operates globally, and your personal information may be transferred to, stored, and processed in countries other than your own. We ensure that such transfers are conducted in accordance with applicable data protection laws and that appropriate safeguards are in place to protect your information.
            </p>
          </section>

          {/* Section 11: Obligation */}
          <section id="obligation" className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Your obligation to provide personal information</h2>
            <p className="mb-4 text-gray-700">
              In some cases, providing personal information is mandatory for us to provide you with our services. We will clearly indicate when information is required and explain the consequences of not providing such information.
            </p>
          </section>

          {/* Section 12: Automated Processing */}
          <section id="automated-processing" className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Automated processing of your personal information (including profiling)</h2>
            <p className="mb-4 text-gray-700">
              We may use automated processing, including profiling, to provide personalized services and improve user experience. You have the right to object to automated decision-making and request human intervention in certain circumstances.
            </p>
          </section>

          {/* Section 13: Updates */}
          <section id="updates" className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. How this Privacy Policy is updated</h2>
            <p className="mb-4 text-gray-700">
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes through appropriate channels and update the "last updated" date at the top of this policy.
            </p>
          </section>

          {/* Contact Information */}
          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Information</h3>
            <p className="mb-2 text-gray-700">
              <strong>Xiaomi Technology Netherlands B.V.</strong><br />
              Address: Prins Bernhardplein 200, 1097 JB Amsterdam, Netherlands
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Xiaomi Technologies Singapore Pte. Ltd.</strong><br />
              Address: 20 Collyer Quay, #09-01, Singapore 049319
            </p>
            <p className="text-gray-700">
              For privacy-related inquiries, please visit: <a href="https://privacy.mi.com/support" className="text-blue-600 hover:underline">https://privacy.mi.com/support</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2025 Xiaomi Corporation. All rights reserved.</p>
            <p className="text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}