// src/pages/userPage/ContactPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Hero */}
      <div
        className="relative h-80 bg-cover bg-center rounded-3xl mb-16 flex items-center justify-center text-white text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('/bgImg (2).jpg')`,
        }}
      >
        <div>
          <h1 className="text-5xl font-bold mb-4">Say Hello!</h1>
          <p className="text-xl">We'd love to hear from you</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <form>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  className="w-full px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
                <input
                  type="tel"
                  placeholder="Contact Number"
                  className="w-full px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  rows={6}
                  placeholder="Enter Your Message"
                  className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-5 rounded-full hover:shadow-lg transition"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-10">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Vendors</h3>
              <p className="text-gray-700 leading-relaxed">
                If you are a registered vendor or a business looking to promote your brand on our portal, please send in your queries at{' '}
                <a href="mailto:vendors@eventX.com" className="text-green-600 font-medium">
                  vendors@eventX.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Marketing Collaborations</h3>
              <p className="text-gray-700 leading-relaxed">
                For brand collaborations — sponsored content, social media activations etc., please write in to{' '}
                <a href="mailto:partnerships@eventX.com" className="text-green-600 font-medium">
                  partnerships@eventX.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Wedding Submissions</h3>
              <p className="text-gray-700 leading-relaxed">
                EventX features weddings across cultures, styles and budgets. To submit your wedding, kindly email us 15–20 photos at{' '}
                <a href="mailto:submissions@eventX.com" className="text-green-600 font-medium">
                  submissions@eventX.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Careers</h3>
              <p className="text-gray-700 leading-relaxed">
                We are a team of passionate young minds looking to reinvent the event space. Please check our careers page for current openings and email us at{' '}
                <a href="mailto:hr@eventX.com" className="text-green-600 font-medium">
                  hr@eventX.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Customers</h3>
              <p className="text-gray-700 leading-relaxed">
                We love to hear from our precious users. For any feedback or queries simply write in to{' '}
                <a href="mailto:info@eventX.com" className="text-green-600 font-medium">
                  info@eventX.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-20 bg-gradient-to-r from-green-900 to-green-700 rounded-3xl p-12 text-white text-center">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            <img
              src="/heroBg.jpg"
              alt="Host Your Event"
              className="rounded-2xl shadow-2xl"
            />
            <div>
              <h2 className="text-4xl font-bold mb-6">Host Your Event</h2>
              <p> classCreate, manage, and promote your event in minutes.</p>
              <Link
                to="/organizer/create-event"
                className="inline-block mt-8 bg-white text-green-600 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition text-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;