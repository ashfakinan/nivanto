import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Send } from 'lucide-react';
import { CustomerLayout } from '../components/Layout';
import { SEED_SERVICES } from '../data/seedData';
import {
  submitInquiry,
  subscribePublicServices,
} from '../lib/firestoreService';
import type { ServiceItem } from '../types/nivanto';

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';

  const [services, setServices] = useState<ServiceItem[]>(
    SEED_SERVICES.map((s, i) => ({ ...s, id: `seed_svc_${i + 1}` }))
  );

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(initialService || 'Business Website Build (One-Time)');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const unsub = subscribePublicServices((items) => {
      setServices(items);
      if (!initialService && items.length > 0) {
        setService((prev) => prev || items[0].title);
      }
    });
    return () => unsub();
  }, [initialService]);

  useEffect(() => {
    if (initialService) {
      setService(initialService);
    }
  }, [initialService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, phone or WhatsApp number, and message.');
      return;
    }

    if (phone.trim().length < 5) {
      setErrorMsg('Please enter a valid phone or WhatsApp number.');
      return;
    }

    setSubmitting(true);
    try {
      await submitInquiry({
        name: name.trim(),
        business_name: businessName.trim(),
        phone: phone.trim(),
        service: service.trim() || 'General Inquiry',
        message: message.trim(),
      });
      setSubmitted(true);
      setName('');
      setBusinessName('');
      setPhone('');
      setMessage('');
    } catch {
      setErrorMsg(
        'Could not submit your inquiry right now. Please check your connection or message us directly on WhatsApp.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomerLayout>
      {/* Header */}
      <section className="bg-[#1C2440] text-white py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 space-y-4">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#E8900A]">
            Contact Nivanto
          </p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white text-balance">
            Start a clear, honest conversation
          </h1>
          <p className="text-base text-white/65 max-w-2xl leading-relaxed">
            Share what your business is building. We will reply within 24 hours with a practical plan — no jargon, no pressure.
          </p>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Guidance Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-[22px] bg-white border border-[#E5E1D8] p-7 space-y-4">
              <h2 className="font-display font-bold text-xl text-[#1C2440]">
                Prefer instant messaging?
              </h2>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Reach us directly on WhatsApp for quick questions about readymade templates, rent-first plans, or custom builds.
              </p>
              <a
                href="https://wa.me/8801720266825?text=Hi%20Nivanto%2C%20I%27d%20like%20to%20discuss%20a%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-[14px] bg-[#E8900A] text-white text-sm font-semibold hover:bg-[#d38108] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>

            <div className="rounded-[22px] bg-[#EDEAE4]/70 border border-[#E5E1D8] p-7 space-y-3">
              <h3 className="font-display font-bold text-base text-[#1C2440]">
                What happens next
              </h3>
              <ol className="space-y-2.5 text-sm text-[#6B7280] list-decimal list-inside">
                <li>We review your business category and goals.</li>
                <li>We share a relevant live demo or clear pricing breakdown.</li>
                <li>Once approved, your website or brand kit ships fast.</li>
              </ol>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-[24px] bg-white border border-[#E5E1D8] p-7 sm:p-10">
              {submitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h2 className="font-display font-extrabold text-2xl text-[#1C2440]">
                    Inquiry received
                  </h2>
                  <p className="text-sm text-[#6B7280] max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Nivanto. Our team has logged your inquiry and will get back to you on your phone or WhatsApp shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 px-5 py-2.5 rounded-[12px] bg-[#2B5FAA] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold text-[#1C2440] mb-2"
                      >
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        maxLength={120}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Tariq Rahman"
                        className="w-full px-4 py-3 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm text-[#1C2440] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#2B5FAA]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-business"
                        className="block text-xs font-semibold text-[#1C2440] mb-2"
                      >
                        Business Name
                      </label>
                      <input
                        id="contact-business"
                        type="text"
                        maxLength={160}
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Vastra Atelier"
                        className="w-full px-4 py-3 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm text-[#1C2440] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#2B5FAA]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-semibold text-[#1C2440] mb-2"
                      >
                        Phone / WhatsApp *
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        maxLength={40}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+880 1XXX-XXXXXX"
                        className="w-full px-4 py-3 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm text-[#1C2440] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#2B5FAA]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-service"
                        className="block text-xs font-semibold text-[#1C2440] mb-2"
                      >
                        Service Interested In
                      </label>
                      <select
                        id="contact-service"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-4 py-3 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm text-[#1C2440] focus:outline-none focus:border-[#2B5FAA]"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title} ({s.wing})
                          </option>
                        ))}
                        <option value="Readymade Website Template">
                          Readymade Website Template
                        </option>
                        <option value="Custom Ecosystem Bundle">
                          Custom Ecosystem Bundle
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-[#1C2440] mb-2"
                    >
                      Tell us about your project *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      maxLength={2000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What does your business sell, and what do you want to achieve first?"
                      className="w-full px-4 py-3 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm text-[#1C2440] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#2B5FAA] resize-y"
                    />
                  </div>

                  {errorMsg && (
                    <p
                      role="alert"
                      className="text-sm text-[#DC2626] bg-[#DC2626]/5 border border-[#DC2626]/20 rounded-[12px] px-4 py-3"
                    >
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-[14px] bg-[#2B5FAA] text-white text-sm font-semibold hover:opacity-95 disabled:opacity-60 transition-opacity"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Sending Inquiry...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
