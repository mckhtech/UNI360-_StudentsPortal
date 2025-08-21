import React from "react";
import { ArrowLeft, GraduationCap } from "lucide-react";

const TermsOfService: React.FC = () => {
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
            Terms of Use
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Please read these terms carefully before using our website and services.
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
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="text-gray-700 mb-0">
                Welcome to UNI360°. By accessing and using our website, you agree to comply with and be bound by the following terms and conditions. If you do not agree with these terms, please refrain from using our website.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">2</span>
                Services Description
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 leading-relaxed mb-4">
                  UNI360° provides visa consulting services. The information on the Site is for general informational purposes only and does not constitute professional advice. We reserve the right to modify or discontinue any aspect of the services without notice.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">3</span>
                User Responsibilities
              </h2>
              <div className="ml-11">
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#E49B0F] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    You agree to provide accurate and complete information when using our services
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#E49B0F] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    You are responsible for maintaining the confidentiality of your account credentials
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#E49B0F] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    You must not engage in any activity that interferes with or disrupts the Site's functionality
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">4</span>
                Intellectual Property
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 leading-relaxed mb-4">
                  The content, trademarks, logos, and other materials on the Site are owned by UNI360° and protected by intellectual property laws. You may not reproduce, distribute, or display any portion of the Site without our prior written consent.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">5</span>
                Privacy Policy
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our Privacy Policy outlines how we collect, use, and safeguard your personal information. By using the Site, you consent to the practices described in the Privacy Policy.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">6</span>
                Limitation of Liability
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 leading-relaxed mb-4">
                  UNI360° is not liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to or use of the Site. This limitation applies to the fullest extent permitted by applicable law.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">7</span>
                Governing Law
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 leading-relaxed mb-4">
                  These Terms of Use are governed by and construed in accordance with the laws of Vadodara. Any legal action arising out of or relating to these terms shall be filed only in the courts located in Vadodara, and you consent to the exclusive jurisdiction of such courts.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">8</span>
                Termination
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 leading-relaxed mb-4">
                  We reserve the right to terminate or suspend your access to the Site, with or without notice, for any reason, including a breach of these terms.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">9</span>
                Contact Information
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions or concerns about these Terms of Use, please contact us at{' '}
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
                <span className="w-8 h-8 bg-[#E49B0F] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">10</span>
                Entire Agreement
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 leading-relaxed mb-4">
                  These Terms of Use constitute the entire agreement between you and UNI360° regarding your use of the Site, superseding any prior agreements.
                </p>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-0">
                    This Terms of Use was last updated on <strong>18 December 2023</strong>.
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

export default TermsOfService;