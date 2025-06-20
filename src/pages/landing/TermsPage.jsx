import Layout from "../../components/layouts/Layout";

const TermsPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8">
            Terms of Service
          </h1>

          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                By accessing and using AthitiPRO ("the Service"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use
                this service.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Description of Service
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                AthitiPRO provides AI-powered tools for travel agencies,
                including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Lead generation and management</li>
                <li>Content creation and marketing tools</li>
                <li>Customer targeting and segmentation</li>
                <li>Travel planning assistance</li>
                <li>AI-powered customer support</li>
                <li>Document processing and help</li>
                <li>WhatsApp Business integration</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. User Account and Registration
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                To access certain features of the Service, you must register for
                an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information</li>
                <li>Keep your password confidential and secure</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Acceptable Use Policy
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Spam or send unsolicited communications</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper working of the Service</li>
                <li>
                  Use the Service for any fraudulent or illegal activities
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. WhatsApp Business Terms
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>When using our WhatsApp Business integration, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Comply with WhatsApp Business Platform policies</li>
                <li>Obtain proper consent for messaging customers</li>
                <li>
                  Use business accounts for legitimate business purposes only
                </li>
                <li>Maintain accurate business information and verification</li>
                <li>Respect customer privacy and communication preferences</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Payment Terms
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>For paid services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fees are charged in advance on a subscription basis</li>
                <li>All fees are non-refundable unless otherwise stated</li>
                <li>We may change our fees with 30 days notice</li>
                <li>You're responsible for all taxes and fees</li>
                <li>Service may be suspended for non-payment</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Intellectual Property
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The Service and its original content, features, and
                functionality are owned by AthitiPRO and are protected by
                international copyright, trademark, patent, trade secret, and
                other intellectual property laws.
              </p>
              <p>
                You retain ownership of content you create using our tools, but
                grant us a license to use, store, and process such content to
                provide the Service.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Privacy and Data Protection
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs your use of the Service, to
                understand our practices.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Disclaimers and Limitation of Liability
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.
                TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL
                WARRANTIES AND LIMIT OUR LIABILITY FOR ANY DAMAGES ARISING FROM
                YOUR USE OF THE SERVICE.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Termination
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We may terminate or suspend your account and access to the
                Service immediately, without prior notice, for conduct that we
                believe violates these Terms or is harmful to other users, us,
                or third parties.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Changes to Terms
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We reserve the right to modify these terms at any time. We will
                notify users of any material changes via email or through the
                Service.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Contact Information
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Email:</strong> legal@athitipro.com
                </p>
                <p>
                  <strong>Address:</strong> AthitiPRO Legal Department
                </p>
                <p>
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;
