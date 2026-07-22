import { FileText, Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { college } from '../data/college';

const links = [
  ['Home', '/'],
  ['About', '#about'],
  ['Academics', '#academics'],
  ['Teachers', '#teachers'],
  ['Events', '#events'],
  ['Gallery', '#gallery'],
  ['Contact', '#contact'],
] as const;

export default function Header({ activeRoute = 'home' }: { activeRoute?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = activeRoute === 'home';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isActiveLink = (href: string) => {
    if (href === '/') return activeRoute === 'home';
    const routeKey = href.replace(/^#\/?/, '').replace(/^\//, '');
    return activeRoute === routeKey;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isHome && !scrolled && !open
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-gray-100/80 bg-white/95 shadow-sm backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between">
          <a href="/" aria-label="HLS Inter College home" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-base font-extrabold text-white shadow-lg shadow-orange-200/60">HLS</div>
            <div>
              <div className={`text-lg font-bold leading-none sm:text-xl ${isHome && !scrolled && !open ? 'text-white' : 'text-text-dark'}`}>{college.name}</div>
              <div className={`mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${isHome && !scrolled && !open ? 'text-white/70' : 'text-text-light'}`}>Devmanpur Â· Ghatampur</div>
            </div>
          </a>

          <nav aria-label="Main navigation" className={`hidden items-center gap-1 lg:flex ${isHome && !scrolled ? 'text-white/90' : 'text-text-dark'}`}>
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                aria-current={isActiveLink(href) ? 'page' : undefined}
                className={`relative rounded-lg px-3.5 py-2 text-sm font-semibold transition hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
                  isActiveLink(href) ? 'text-primary font-bold' : ''
                }`}
              >
                {label}
                {isActiveLink(href) && (
                  <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary" aria-hidden="true" />
                )}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`tel:${college.phones[0].replace(/\s/g, '')}`}
              aria-label={`Call HLS Inter College at ${college.phones[0]}`}
              className={`grid h-10 w-10 place-items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/20 ${
                isHome && !scrolled
                  ? 'border-white/30 text-white hover:bg-white/10'
                  : 'border-gray-200 text-secondary hover:border-secondary hover:bg-teal-50'
              }`}
            >
              <Phone className="h-4.5 w-4.5" />
            </a>
            <a href="/registration" className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200/50 transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25">
              <FileText className="h-4 w-4" /> Apply Online
            </a>
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setOpen((value) => !value)}
            className={`rounded-xl p-2.5 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 lg:hidden ${
              isHome && !scrolled && !open
                ? 'text-white hover:bg-white/10'
                : 'text-gray-700 hover:bg-orange-50 hover:text-primary'
            }`}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={`${
          open ? 'grid' : 'hidden'
        } max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-gray-100 bg-white px-4 py-4 shadow-xl lg:hidden`}
      >
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={isActiveLink(href) ? 'page' : undefined}
            className={`rounded-xl px-4 py-3 font-semibold transition hover:bg-orange-50 hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
              isActiveLink(href) ? 'bg-orange-50/50 text-primary font-bold' : 'text-text-dark'
            }`}
          >
            {label}
          </a>
        ))}
        <a href="/registration" onClick={() => setOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
          <FileText className="h-4 w-4" /> Apply Online
        </a>
        <a href={`tel:${college.phones[0].replace(/\s/g, '')}`} className="mt-3 flex items-center justify-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-secondary">
          <Phone className="h-4 w-4" /> {college.phones[0]}
        </a>
      </nav>
    </header>
  );
}

