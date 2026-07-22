import { Facebook, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { college } from '../data/college';
import CollegeImage from './CollegeImage';

export default function Footer({ variant = 'landing' }: { variant?: 'landing' | 'inner' }) {
  return (
    <footer className={variant === 'inner' ? 'natureverse-footer relative z-10 bg-white' : 'natureverse-footer bg-white pt-20'}>
      {/* Campus gallery â€” only on landing page */}
      {variant === 'landing' && (
        <div className="mx-auto -mt-32 mb-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-secondary p-7 shadow-xl sm:p-10">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-100">Campus gallery</p>
              <h2 className="mt-2 font-bold text-white" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>A closer look at HLS Inter College</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {college.gallery.slice(0, 3).map((image) => (
                <div key={image.src} className="aspect-video overflow-hidden rounded-2xl bg-teal-900">
                  <CollegeImage src={image.src} fallbackSrc={image.fallback} alt={image.alt} className="h-full w-full object-cover opacity-85 transition duration-500 hover:scale-105 hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`pb-10 ${variant === 'landing' ? 'bg-[#fbf9fe] pt-24' : 'border-t border-gray-100 bg-[#fbf9fe] pt-14'}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-base font-extrabold text-white">HLS</div>
                <div className="text-xl font-bold text-text-dark">{college.name}</div>
              </div>
              <p className="mt-5 text-sm leading-[1.7] text-text-light">A co-educational college committed to quality, values and well-rounded student development in Devmanpur, Ghatampur.</p>
              <div className="mt-6 flex gap-3">
                <a aria-label="Facebook" href={college.facebook} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-white text-gray-500 shadow-sm transition hover:text-primary"><Facebook className="h-4 w-4" /></a>
                <a aria-label="YouTube" href={college.youtube} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-white text-gray-500 shadow-sm transition hover:text-primary"><Youtube className="h-4 w-4" /></a>
              </div>
            </div>
            <div>
              <h3 className="mb-5 text-lg font-bold text-text-dark">Quick Links</h3>
              <ul className="grid gap-3 text-sm font-medium text-text-light">
                <li><a href="/" className="transition hover:text-primary">Home</a></li>
                <li><a href="/#about" className="transition hover:text-primary">About</a></li>
                <li><a href="/#academics" className="transition hover:text-primary">Academics</a></li>
                <li><a href="/#events" className="transition hover:text-primary">Events</a></li>
                <li><a href="/registration" className="transition hover:text-primary">Online Registration</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-5 text-lg font-bold text-text-dark">College</h3>
              <ul className="grid gap-3 text-sm font-medium text-text-light">
                <li><a href="/teachers" className="transition hover:text-primary">Teachers</a></li>
                <li><a href="/#leadership" className="transition hover:text-primary">Leadership</a></li>
                <li><a href="/#contact" className="transition hover:text-primary">Contact</a></li>
                <li><a href={college.officialWebsite} target="_blank" rel="noreferrer" className="transition hover:text-primary">Current website</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-5 text-lg font-bold text-text-dark">Contact Info</h3>
              <ul className="grid gap-4 text-sm text-text-light">
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{college.address}</li>
                <li className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-primary" /><a href={`tel:${college.phones[0].replace(/\s/g, '')}`} className="transition hover:text-primary">{college.phones[0]}</a></li>
                <li className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-primary" /><a href={`mailto:${college.email}`} className="break-all transition hover:text-primary">{college.email}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-text-light">&copy; {new Date().getFullYear()} HLS Inter College. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

