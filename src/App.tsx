import { useEffect, useRef, useState, type RefObject } from 'react';
import TopBar from './components/TopBar';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import LearnToPlay from './components/LearnToPlay';
import EducationalValues from './components/EducationalValues';
import Stats from './components/Stats';
import Programs from './components/Programs';
import FeaturedTeachers from './components/FeaturedTeachers';
import Instructors from './components/Instructors';
import Contact from './components/Contact';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

import RegistrationPage from './pages/RegistrationPage';
import TeachersPage from './pages/TeachersPage';
import TeacherProfilePage from './pages/TeacherProfilePage';
import AboutPage from './pages/AboutPage';
import LeadershipPage from './pages/LeadershipPage';
import AcademicsPage from './pages/AcademicsPage';
import EventsPage from './pages/EventsPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';

import NatureVersePageWrapper from './components/NatureVersePageWrapper';
import StackingPage from './components/stacking/StackingPage';
import StackingSection from './components/stacking/StackingSection';
import NatureVerseRoot from './components/natureverse/NatureVerseRoot';
import type { NatureVerseRoute } from './components/natureverse/types';
import { teachers } from './data/teachers';

function getRoute() {
  if (typeof window === 'undefined') return 'home';
  const hash = (window.location.hash || '').toLowerCase().replace(/^#\/?/, '');
  const path = (window.location.pathname || '').replace(/\/+$/, '').toLowerCase();

  // 1. Check hash route first (e.g. #academics, #about, #events)
  if (hash === 'about') return 'about';
  if (hash === 'academics') return 'academics';
  if (hash === 'teachers') return 'teachers';
  if (hash === 'events') return 'events';
  if (hash === 'gallery') return 'gallery';
  if (hash === 'contact') return 'contact';
  if (hash === 'leadership') return 'leadership';
  if (hash === 'registration' || hash === 'apply') return 'registration';

  // 2. Check path route
  if (path === '/about') return 'about';
  if (path === '/academics') return 'academics';
  if (path === '/teachers') return 'teachers';
  if (path === '/events') return 'events';
  if (path === '/gallery') return 'gallery';
  if (path === '/contact') return 'contact';
  if (path === '/leadership') return 'leadership';
  if (path === '/registration') return 'registration';
  if (path.startsWith('/teachers/')) return 'teacher-profile';

  return 'home';
}

function HomePage({ natureVerseStartRef }: { natureVerseStartRef: RefObject<HTMLDivElement | null> }) {
  return (
    <main id="main-content">
      <Hero />
      <div
        ref={natureVerseStartRef}
        data-natureverse-start
        aria-hidden="true"
      />
      <div className="home-natureverse" data-home-natureverse="below-hero">
        <StackingPage>
          <StackingSection id="growth-ecosystem" index={0} theme="morning">
            <Features />
          </StackingSection>
          <StackingSection id="learning-canopy" index={1} theme="canopy">
            <LearnToPlay />
          </StackingSection>
          <StackingSection id="roots-and-growth" index={2} theme="forest">
            <EducationalValues />
          </StackingSection>
          <StackingSection id="path-of-growth" index={3} theme="sunpath">
            <Stats />
          </StackingSection>
          <StackingSection id="academic-pathways" index={4} theme="canopy">
            <Programs />
          </StackingSection>
          <StackingSection id="mentor-grove" index={5} theme="mentor">
            <FeaturedTeachers />
          </StackingSection>
          <StackingSection id="campus-in-bloom" index={6} theme="bloom">
            <Instructors />
          </StackingSection>
          <StackingSection id="find-your-path" index={7} theme="path">
            <Pricing />
          </StackingSection>
          <StackingSection id="living-memories" index={8} theme="memory">
            <Testimonials />
          </StackingSection>
          <StackingSection id="contact-path" index={9} theme="path" interactive forceFlow>
            <Contact />
          </StackingSection>
        </StackingPage>
      </div>
    </main>
  );
}

function NotFoundPage() {
  return (
    <NatureVersePageWrapper routeName="404">
      <main id="main-content" className="inner-page-shell">
        <section className="grid min-h-[70vh] place-items-center px-4" style={{ paddingBlock: 'clamp(6rem, 12vw, 10rem)' }}>
          <div className="glass-surface w-full max-w-2xl rounded-[1.75rem] border border-white/70 p-8 text-center sm:p-14">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">404</p>
            <h1 className="mt-3 font-display font-bold text-text-dark" style={{ fontSize: 'var(--text-3xl)' }}>Page not found</h1>
            <p className="mx-auto mt-4 max-w-md leading-[1.7] text-text-light">The page you requested does not exist or may have been moved. Try navigating from the links below.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="/" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200/40 transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20">Return home</a>
              <a href="#teachers" className="inline-flex items-center justify-center rounded-full border border-gray-200/80 bg-white/80 px-6 py-3 text-sm font-semibold text-text-dark transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20">View teachers</a>
              <a href="#registration" className="inline-flex items-center justify-center rounded-full border border-gray-200/80 bg-white/80 px-6 py-3 text-sm font-semibold text-text-dark transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20">Register online</a>
            </div>
          </div>
        </section>
      </main>
    </NatureVersePageWrapper>
  );
}

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const natureVerseStartRef = useRef<HTMLDivElement>(null);
  const [homeNatureVerseActive, setHomeNatureVerseActive] = useState(false);
  useEffect(() => {
    const onLocationChange = () => {
      setRoute(getRoute());
    };

    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    return () => {
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  const path = typeof window !== 'undefined' ? window.location.pathname.replace(/\/+$/, '') || '/' : '/';
  const teacherSlug = path.startsWith('/teachers/') ? decodeURIComponent(path.split('/')[2] || '') : '';
  const teacher = teachers.find((item) => item.slug === teacherSlug);
  const isHome = route === 'home';

  useEffect(() => {
    if (!isHome) {
      setHomeNatureVerseActive(true);
      return;
    }

    const updateHomeVisibility = () => {
      const marker = natureVerseStartRef.current;
      if (!marker) {
        setHomeNatureVerseActive(false);
        return;
      }
      setHomeNatureVerseActive(marker.getBoundingClientRect().top <= 72);
    };

    updateHomeVisibility();
    window.addEventListener('scroll', updateHomeVisibility, { passive: true });
    window.addEventListener('resize', updateHomeVisibility, { passive: true });

    const observer = new IntersectionObserver(updateHomeVisibility, { threshold: [0, 1] });
    if (natureVerseStartRef.current) observer.observe(natureVerseStartRef.current);

    return () => {
      window.removeEventListener('scroll', updateHomeVisibility);
      window.removeEventListener('resize', updateHomeVisibility);
      observer.disconnect();
    };
  }, [isHome]);
  useEffect(() => {
    if (route !== 'home') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [route]);

  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'HLS Inter College | Devmanpur, Ghatampur',
      about: 'About Us | HLS Inter College',
      leadership: 'Leadership Messages | HLS Inter College',
      academics: 'Academic Programs | HLS Inter College',
      teachers: 'Faculty Directory | HLS Inter College',
      events: 'Campus Events | HLS Inter College',
      gallery: 'Photo Gallery | HLS Inter College',
      contact: 'Contact Us | HLS Inter College',
      registration: 'Online Registration | HLS Inter College',
    };
    document.title = teacher ? `${teacher.name} | HLS Inter College` : titles[route] ?? 'HLS Inter College';
  }, [route, teacher]);

  let pageContent;
  if (route === 'home') {
    pageContent = <HomePage natureVerseStartRef={natureVerseStartRef} />;
  } else if (route === 'about') {
    pageContent = <NatureVersePageWrapper routeName="about"><AboutPage /></NatureVersePageWrapper>;
  } else if (route === 'leadership') {
    pageContent = <NatureVersePageWrapper routeName="leadership"><LeadershipPage /></NatureVersePageWrapper>;
  } else if (route === 'academics') {
    pageContent = <NatureVersePageWrapper routeName="academics"><AcademicsPage /></NatureVersePageWrapper>;
  } else if (route === 'teachers') {
    pageContent = <NatureVersePageWrapper routeName="teachers"><TeachersPage /></NatureVersePageWrapper>;
  } else if (route === 'teacher-profile' && teacher) {
    pageContent = <NatureVersePageWrapper routeName="teacher-profile"><TeacherProfilePage teacher={teacher} /></NatureVersePageWrapper>;
  } else if (route === 'events') {
    pageContent = <NatureVersePageWrapper routeName="events"><EventsPage /></NatureVersePageWrapper>;
  } else if (route === 'contact') {
    pageContent = <NatureVersePageWrapper routeName="contact"><ContactPage /></NatureVersePageWrapper>;
  } else if (route === 'gallery') {
    pageContent = <NatureVersePageWrapper routeName="gallery"><GalleryPage /></NatureVersePageWrapper>;
  } else if (route === 'registration') {
    pageContent = <NatureVersePageWrapper routeName="registration"><RegistrationPage /></NatureVersePageWrapper>;
  } else {
    pageContent = <NotFoundPage />;
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-transparent text-text-dark">
      <NatureVerseRoot active={!isHome || homeNatureVerseActive} routeMode={route as NatureVerseRoute} />
      <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-text-dark shadow-xl transition focus:translate-y-0">Skip to content</a>
      {!isHome && <TopBar />}
      <Header activeRoute={route} />
      {pageContent}
      <Footer variant={isHome ? 'landing' : 'inner'} />
    </div>
  );
}





