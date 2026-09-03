'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-12 lg:px-10">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B8975A]">Client Care</p>
        <h1 className="mt-2 font-serif text-4xl font-normal text-[#1C1C1C] sm:text-5xl">
          Book an Appointment
        </h1>
        <div className="mx-auto mt-3 h-[1px] w-12 bg-[#B8975A]" />
        <p className="mt-3 text-xs text-[#777]">
          Connect with a jewellery specialist for private viewings, custom designs, or heirloom resetting.
        </p>
      </div>

      <div className="mt-12 rounded-sm border border-[#E5DDD0] bg-white p-8 md:p-12">
        {submitted ? (
          <div className="py-12 text-center">
            <h2 className="font-serif text-3xl text-[#1A3A2A]">Thank You</h2>
            <p className="mt-2 text-xs text-[#777]">
              Your request has been received. Our concierge team will reach out within 24 hours to confirm your appointment details.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 rounded-sm border border-[#1A3A2A] px-6 py-2.5 text-xs uppercase tracking-widest text-[#1A3A2A]"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#444]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Aisha Al Mansoori"
                  className="mt-1 w-full rounded-sm border border-[#E5DDD0] px-4 py-2.5 text-sm text-[#1C1C1C] outline-none focus:border-[#1A3A2A]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#444]">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+971 50 123 4567"
                  className="mt-1 w-full rounded-sm border border-[#E5DDD0] px-4 py-2.5 text-sm text-[#1C1C1C] outline-none focus:border-[#1A3A2A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#444]">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="aisha@example.com"
                  className="mt-1 w-full rounded-sm border border-[#E5DDD0] px-4 py-2.5 text-sm text-[#1C1C1C] outline-none focus:border-[#1A3A2A]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#444]">
                  Preferred Boutique
                </label>
                <select className="mt-1 w-full rounded-sm border border-[#E5DDD0] px-4 py-2.5 text-sm text-[#1C1C1C] outline-none focus:border-[#1A3A2A]">
                  <option>Gold Souk, Deira (Dubai)</option>
                  <option>Meena Bazaar, Bur Dubai</option>
                  <option>Dubai Marina Mall</option>
                  <option>Mall of the Emirates</option>
                  <option>Madinat Zayed (Abu Dhabi)</option>
                  <option>Yas Mall (Abu Dhabi)</option>
                  <option>Al Zahra Street (Sharjah)</option>
                  <option>Ajman City Centre</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#444]">
                Interest / Message
              </label>
              <textarea
                rows={4}
                placeholder="Bridal suite matching, heirloom resetting, custom engraving..."
                className="mt-1 w-full rounded-sm border border-[#E5DDD0] p-4 text-sm text-[#1C1C1C] outline-none focus:border-[#1A3A2A]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-sm bg-[#1A3A2A] py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-white hover:bg-[#2D5A3D]"
            >
              Request Private Appointment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
