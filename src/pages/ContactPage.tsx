import { useState, FormEvent } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import InnerPageHero from '../components/InnerPageHero';
import NatureVerseScene from '../components/NatureVerseScene';
import StackingPage from '../components/stacking/StackingPage';
import FadeUp from '../components/motion/FadeUp';
import { college } from '../data/college';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({ name: '', phone: '', email: '', subject: 'General Enquiry', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const body = `Name: ${formValues.name}\nPhone: ${formValues.phone}\nEmail: ${formValues.email}\nSubject: ${formValues.subject}\n\nMessage:\n${formValues.message}`;
      window.location.href = `mailto:${college.email}?subject=${encodeURIComponent(`[Website Enquiry] ${formValues.subject}`)}&body=${encodeURIComponent(body)}`;
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <main id="main-content" className="inner-page-shell sv-page sv-page--contact">
      <div className="inner-page-bg-accents" aria-hidden="true" />
      <div className="pointer-events-none absolute right-10 top-36 h-96 w-96 rounded-full bg-teal-300/10 blur-3xl" aria-hidden="true" />

      <InnerPageHero
        eyebrow="Contact Us"
        title="We are here to answer your questions."
        description="Reach out to HLS Inter College for admissions, faculty guidance, campus visits, or general enquiries."
        crumbs={[{ label: 'Contact' }]}
        aside={
          <>
            <Clock className="h-8 w-8 text-orange-200/80" />
            <h2 className="mt-3 text-lg font-bold">Office Hours</h2>
            <p className="mt-2 text-sm leading-[1.7] text-teal-50/85">
              Monday to Saturday: 8:00 AM â€“ 3:00 PM (IST). Visiting hours for parents and guardians.
            </p>
          </>
        }
      />

      <StackingPage sections={[
        { id: 'contact-natureverse', theme: 'path' },
        { id: 'contact-details', theme: 'morning' },
        { id: 'contact-form-map', theme: 'canopy', interactive: true, forceFlow: true },      ]}>
        <NatureVerseScene variant="contact" />

      {/* Contact Info Cards */}
      <section className="sv-content-section sv-content-section--contact py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FadeUp delayMs={0}>
              <a
                href={`tel:${college.phones[0].replace(/\s/g, '')}`}
                className="group flex h-full flex-col justify-between rounded-[1.75rem] border border-white/80 bg-white/90 p-7 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/30"
              >
                <div>
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-primary shadow-sm group-hover:scale-105 transition-transform">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-text-dark">Phone Contacts</h3>
                  <p className="mt-2 text-sm font-semibold text-secondary">{college.phones.join(' Â· ')}</p>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-primary">Call Admission Desk â†’</p>
              </a>
            </FadeUp>

            <FadeUp delayMs={90}>
              <a
                href={`mailto:${college.email}`}
                className="group flex h-full flex-col justify-between rounded-[1.75rem] border border-white/80 bg-white/90 p-7 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/30"
              >
                <div>
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-secondary shadow-sm group-hover:scale-105 transition-transform">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-text-dark">Email Us</h3>
                  <p className="mt-2 text-sm font-semibold text-secondary break-all">{college.email}</p>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-primary">Send Direct Email â†’</p>
              </a>
            </FadeUp>

            <FadeUp delayMs={180}>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(college.address)}`}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col justify-between rounded-[1.75rem] border border-white/80 bg-white/90 p-7 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/30"
              >
                <div>
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm group-hover:scale-105 transition-transform">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-text-dark">Campus Location</h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-light">{college.address}</p>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-primary">Open Google Maps â†’</p>
              </a>
            </FadeUp>

            <FadeUp delayMs={270}>
              <div className="flex h-full flex-col justify-between rounded-[1.75rem] border border-white/80 bg-white/90 p-7 shadow-md backdrop-blur-md">
                <div>
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 shadow-sm">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-text-dark">Visiting Hours</h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-light">
                    Mon â€“ Sat: 8:00 AM â€“ 3:00 PM<br />
                    Sundays & Holidays: Closed
                  </p>
                </div>
                <p className="mt-4 text-xs font-semibold text-secondary">Devmanpur Â· Ghatampur</p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Form & Map Section */}
      <section className="sv-content-section sv-content-section--mint py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <FadeUp>
              <div className="glass-surface rounded-[2rem] border border-white/80 p-8 shadow-xl backdrop-blur-md">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Get in Touch</span>
                  <h2 className="mt-1 font-display text-2xl font-bold text-text-dark sm:text-3xl">
                    Send an Official Enquiry
                  </h2>
                </div>

                {submitted ? (
                  <div className="rounded-2xl bg-teal-50 border border-teal-100 p-6 text-center animate-fadeIn">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-secondary mb-3" />
                    <h3 className="font-display text-xl font-bold text-text-dark">Enquiry Prepared!</h3>
                    <p className="mt-2 text-sm text-text-light leading-relaxed">
                      Your default mail application has been launched with the enquiry details pre-filled.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-6 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-600"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-dark">
                        Your Full Name *
                        <input
                          required
                          name="name"
                          value={formValues.name}
                          onChange={handleChange}
                          placeholder="e.g. Ramesh Sharma"
                          className="form-control transition-all focus:ring-4 focus:ring-primary/20 focus:border-primary"
                        />
                      </label>

                      <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-dark">
                        Phone Number *
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formValues.phone}
                          onChange={handleChange}
                          placeholder="+91 9876543210"
                          className="form-control transition-all focus:ring-4 focus:ring-primary/20 focus:border-primary"
                        />
                      </label>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-dark">
                        Email Address
                        <input
                          type="email"
                          name="email"
                          value={formValues.email}
                          onChange={handleChange}
                          placeholder="name@example.com"
                          className="form-control transition-all focus:ring-4 focus:ring-primary/20 focus:border-primary"
                        />
                      </label>

                      <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-dark">
                        Enquiry Type
                        <select
                          name="subject"
                          value={formValues.subject}
                          onChange={handleChange}
                          className="form-control transition-all focus:ring-4 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="Admission Enquiry">Admission Enquiry</option>
                          <option value="Faculty / Subject Guidance">Faculty / Subject Guidance</option>
                          <option value="General Information">General Information</option>
                          <option value="Campus Visit Request">Campus Visit Request</option>
                        </select>
                      </label>
                    </div>

                    <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-dark">
                      Message details *
                      <textarea
                        required
                        rows={4}
                        name="message"
                        value={formValues.message}
                        onChange={handleChange}
                        placeholder="Write your question or request here..."
                        className="form-control resize-none transition-all focus:ring-4 focus:ring-primary/20 focus:border-primary"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-200/50 transition-all hover:bg-orange-600 disabled:opacity-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                    >
                      {loading ? 'Preparing Email...' : 'Send Enquiry via Email'} <Send className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            </FadeUp>

            {/* Map Reveal with Subtle Pulse Marker */}
            <FadeUp delayMs={150}>
              <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur-md h-full flex flex-col justify-between">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-teal-900/10 w-full">
                  <img
                    src="/images/hls-campus-gate.jpg"
                    alt="Map view of HLS Inter College Devmanpur"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Pulsing Marker */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="relative flex h-10 w-10 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-8 w-8 bg-primary text-white grid place-items-center shadow-lg">
                        <MapPin className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="mt-2 rounded-lg bg-black/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                      HLS Inter College Campus
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-orange-50/70 border border-orange-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Campus Location</p>
                  <p className="mt-1 text-sm font-semibold text-text-dark">{college.address}</p>
                  <p className="mt-1 text-xs text-text-light">Devmanpur is located near Ghatampur in Kanpur Nagar district, Uttar Pradesh.</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
      </StackingPage>
    </main>
  );
}

