import React from 'react';
import Link from 'next/link';

export default function BridalPage() {
  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <section className="relative h-[62vh] min-h-[420px] w-full overflow-hidden bg-[#1A3A2A] text-white">
        <img
          src="/images/occasion_bridal.jpg"
          alt="Noor Bridal Suite"
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex items-end p-8 lg:p-16 bg-gradient-to-t from-black/80 via-transparent to-transparent">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D4B57A]">Noor Bridal</p>
            <h1 className="mt-2 font-serif text-4xl font-light leading-tight sm:text-5xl md:text-6xl">
              For the day it all matches
            </h1>
            <p className="mt-3 text-xs text-white/80 sm:text-sm">
              Bridal suites in 22K gold, emerald and diamond, matched as one and fitted in a private viewing room in Dubai.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#B8975A]">How it works</p>
          <h2 className="mt-2 font-serif text-3xl font-normal text-[#1C1C1C] sm:text-4xl">
            The Bridal Appointment
          </h2>
          <div className="mx-auto mt-3 h-[1px] w-12 bg-[#B8975A]" />
          <p className="mt-3 text-xs text-[#777]">
            Three unhurried steps, from first sketch to final fitting.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Consultation',
              desc: 'A private room, your outfit swatches, and two hours with a senior stylist.',
            },
            {
              step: '02',
              title: 'Matching',
              desc: 'Stones are matched for tone, saturation and clarity across every piece in the suite.',
            },
            {
              step: '03',
              title: 'Fitting',
              desc: 'Sizing, drape and weight adjusted three weeks before the date.',
            },
          ].map((item) => (
            <div key={item.step} className="border-t border-[#B8975A] pt-6">
              <span className="font-serif text-3xl text-[#1A3A2A]">{item.step}</span>
              <h3 className="mt-2 font-serif text-2xl text-[#1C1C1C]">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#777]">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="inline-block rounded-sm bg-[#1A3A2A] px-10 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-white hover:bg-[#2D5A3D]"
          >
            Book an appointment
          </Link>
        </div>
      </section>

      {/* Heirloom Resetting Banner */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid overflow-hidden rounded-sm bg-[#1A3A2A] text-white lg:grid-cols-2">
          <img
            src="/images/hero_bg.jpg"
            alt="Heirloom resetting"
            className="h-full min-h-[340px] w-full object-cover"
          />
          <div className="flex flex-col justify-center p-8 lg:p-16">
            <h2 className="font-serif text-3xl font-light sm:text-4xl">Heirloom resetting</h2>
            <div className="mt-3 h-[1px] w-12 bg-[#B8975A]" />
            <p className="mt-4 text-xs font-light leading-relaxed text-white/80 sm:text-sm">
              Bring your mother's stones. We document, clean and reset them into a suite designed around your outfit — with the original gold credited back to you.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-block rounded-sm border border-white/40 px-8 py-3 text-xs uppercase tracking-widest text-white hover:bg-white/10"
              >
                Inquire about resetting
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
