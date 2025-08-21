
import React from "react";
import { ArrowLeft, GraduationCap } from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - matches dashboard style */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button 
                className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#E49B0F] rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">UNI360</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Simple header without gradient */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <div className="mt-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
              Last updated: 18 December 2023
            </span>
          </div>
        </div>
      </div>

      {/* Content - matches dashboard card style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="bg-white rounded-xl shadow-sm border p-6 lg:p-8">
          <div className="prose prose-gray max-w-none">
            <div className="mb-8">
              <p className="text-gray-600 text-lg leading-relaxed">
                This Privacy Policy outlines the types of personal information we collect, how we use it, and the choices you have regarding your information.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">1</span>
                Information We Collect
              </h2>
              
              <div className="ml-11 space-y-6">
                <div className="border-l-2 border-gray-200 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1.1 Personal Information</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We may collect personal information, such as names, contact details, and other relevant details, when you voluntarily provide it to us through our website, forms, or in communication with our team.
                  </p>
                </div>

                <div className="border-l-2 border-gray-200 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1.2 Payment Information</h3>
                  <p className="text-gray-600 leading-relaxed">
                    When making payments for our services, we may collect payment details such as credit card information. This information is securely processed, and we do not store payment details on our servers.
                  </p>
                </div>

                <div className="border-l-2 border-gray-200 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1.3 Cookies and Tracking</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our website may use cookies and similar tracking technologies to enhance user experience, analyze trends, and administer the website. You can control the use of cookies through your browser settings.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">2</span>
                How We Use Your Information
              </h2>
              
              <div className="ml-11 space-y-6">
                <div className="border-l-2 border-gray-200 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 Providing Services</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We use the information you provide to deliver our visa consulting services, process applications, and communicate with you about your visa or related matters.
                  </p>
                </div>

                <div className="border-l-2 border-gray-200 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 Communication</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We may use your contact information to send you updates, newsletters, and relevant information about our services. You can opt out of these communications at any time.
                  </p>
                </div>

                <div className="border-l-2 border-gray-200 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">2.3 Improving Our Services</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We may use aggregated and anonymized data to analyze trends and improve our services. This information does not identify individual users.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">3</span>
                Sharing Your Information
              </h2>
              
              <div className="ml-11 space-y-6">
                <div className="border-l-2 border-gray-200 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Third-Party Service Providers</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We may share your information with trusted third-party service providers who assist us in delivering our services, processing payments, or analyzing website performance.
                  </p>
                </div>

                <div className="border-l-2 border-gray-200 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Legal Requirements</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We may disclose your information if required to do so by law or in response to legal requests.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">4</span>
                Security
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 leading-relaxed mb-4">
                  We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no data transmission over the internet can be guaranteed to be completely secure.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">5</span>
                Your Choices
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#E49B0F] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Access and correct your personal information
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#E49B0F] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Opt out of receiving marketing communications
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#E49B0F] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Request the deletion of your personal information, subject to legal requirements
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">6</span>
                Contact Us
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions or concerns about our Privacy Policy or the handling of your personal information, please contact us at{' '}
                  <a 
                    href="mailto:support@uni360degree.com" 
                    className="text-[#E49B0F] hover:text-[#D97706] underline font-semibold transition-colors"
                  >
                    support@uni360degree.com
                  </a>
                  .
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">7</span>
                Changes to the Privacy Policy
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may update our Privacy Policy to reflect changes in our practices or applicable laws. The updated policy will be posted on our website.
                </p>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-0">
                    This Privacy Policy was last updated on <strong>18 December 2023</strong>.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;