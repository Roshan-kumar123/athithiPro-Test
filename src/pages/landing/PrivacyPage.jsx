import Layout from "../../components/layouts/Layout";

const PrivacyPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>

          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Personal Information:</strong> When you create an
                account or use our services, we may collect personal information
                such as your name, email address, phone number, and business
                information.
              </p>
              <p>
                <strong>Usage Data:</strong> We collect information about how
                you use our platform, including features accessed, time spent on
                different sections, and interaction patterns.
              </p>
              <p>
                <strong>Communication Data:</strong> When you use our
                communication features, we may store message content, contact
                information, and communication preferences to provide our
                services.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and maintain our AI-powered travel agency tools</li>
                <li>Process transactions and manage your account</li>
                <li>
                  Send you technical notices, updates, and support messages
                </li>
                <li>Improve our services and develop new features</li>
                <li>Comply with legal obligations and protect our rights</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Information Sharing and Disclosure
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We do not sell, trade, or otherwise transfer your personal
                information to third parties except as described in this privacy
                policy:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With your explicit consent</li>
                <li>
                  To service providers who assist us in operating our platform
                </li>
                <li>When required by law or to protect our rights</li>
                <li>
                  In connection with a merger, acquisition, or sale of assets
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information</li>
                <li>Secure data centers and infrastructure</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Your Rights and Choices
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Object to processing of your personal information</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. WhatsApp Business Integration
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                When you connect your WhatsApp Business account through our
                platform, we may access and process:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Business profile information</li>
                <li>Message templates and content</li>
                <li>Contact lists and communication history</li>
                <li>Business verification documents</li>
              </ul>
              <p>
                This information is processed in accordance with Facebook's Data
                Policy and our commitment to protecting your privacy.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Cookies and Tracking Technologies
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We use cookies and similar tracking technologies to enhance your
                experience, analyze usage patterns, and improve our services.
                You can control cookie preferences through your browser
                settings.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Changes to This Privacy Policy
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new privacy policy on
                this page and updating the "Last updated" date.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Contact Us
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Email:</strong> privacy@athitipro.com
                </p>
                <p>
                  <strong>Address:</strong> AthitiPRO Privacy Office
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

export default PrivacyPage;
