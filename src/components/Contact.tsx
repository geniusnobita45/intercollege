import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, Mail, MapPin, Phone, Route } from 'lucide-react';
import { college } from '../data/college';
import CollegeImage from './CollegeImage';

export default function Contact() {
  const [status, setStatus] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '');
    const phone = String(form.get('phone') ?? '');
    const message = String(form.get('message') ?? '');
    const body = `Name: ${name}\nPhone: ${phone}\n\n${message}`;
    window.location.href = `mailto:${college.email}?subject=${encodeURIComponent('Website enquiry for HLS Inter College')}&body=${encodeURIComponent(body)}`;
    setStatus('Your email application has been opened with the enquiry details.');
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="home-sv-contact-section">
      <div className="home-sv-contact-route" aria-hidden="true"><Route /></div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="home-sv-contact-shell">
          <div className="home-sv-contact-panel">
            <span className="home-sv-eyebrow home-sv-eyebrow--light">Contact the college</span>
            <h2 id="contact-title">Every enquiry has a clear next step.</h2>
            <p>Connect with the college office, plan a campus visit or begin an admission conversation.</p>

            <div className="home-sv-contact-stops">
              <a href={`tel:${college.phones[0].replace(/\s/g, '')}`}><span><Phone /></span><div><small>Call the college</small><strong>{college.phones.join(' · ')}</strong></div><ArrowRight /></a>
              <a href={`mailto:${college.email}`}><span><Mail /></span><div><small>Email</small><strong>{college.email}</strong></div><ArrowRight /></a>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(college.address)}`} target="_blank" rel="noreferrer"><span><MapPin /></span><div><small>Visit</small><strong>{college.address}</strong></div><ArrowRight /></a>
            </div>

            <form onSubmit={submit} className="home-sv-contact-form">
              <div>
                <label>Name<input required name="name" autoComplete="name" placeholder="Your name" /></label>
                <label>Phone<input required name="phone" inputMode="tel" autoComplete="tel" placeholder="Your phone number" /></label>
              </div>
              <label>Message<textarea required name="message" rows={4} placeholder="How can the college help?" /></label>
              <button type="submit">Prepare email enquiry <ArrowRight /></button>
              <p role="status" aria-live="polite">{status}</p>
            </form>
          </div>

          <div className="home-sv-contact-visual">
            <div className="home-sv-contact-image">
              <CollegeImage src={college.gallery[3].src} fallbackSrc={college.gallery[3].fallback} alt="HLS Inter College campus" className="h-full w-full object-cover" />
            </div>
            <div className="home-sv-contact-map-card">
              <span><MapPin /></span>
              <div><small>Find your way</small><strong>Devmanpur, Ghatampur</strong><p>Kanpur Nagar, Uttar Pradesh</p></div>
            </div>
            <div className="home-sv-contact-dots" aria-hidden="true"><i /><i /><i /><i /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
