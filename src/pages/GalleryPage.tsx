import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, X, ZoomIn } from 'lucide-react';
import InnerPageHero from '../components/InnerPageHero';
import NatureVerseScene from '../components/NatureVerseScene';
import StackingPage from '../components/stacking/StackingPage';
import FadeUp from '../components/motion/FadeUp';
import { college } from '../data/college';
import { getInitialPerformanceTier } from '../utils/performanceTier';

type GalleryFilter = 'All' | 'Campus' | 'Events' | 'Activities';
type GalleryItem = { src: string; fallback: string; alt: string; category: string };

export default function GalleryPage() {
  const [filter, setFilter] = useState<GalleryFilter>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const batchSize = useMemo(() => {
    const tier = getInitialPerformanceTier();
    return tier === 'low' || tier === 'minimal' ? 8 : 12;
  }, []);
  const [visibleCount, setVisibleCount] = useState(batchSize);

  const galleryItems = useMemo<GalleryItem[]>(() => [
    { src: '/images/hls-campus-gate.jpg', fallback: '/frames/frame_0000.jpg', alt: 'HLS Inter College Main Gate & Campus Entrance', category: 'Campus' },
    { src: '/images/hls-banner-2.png', fallback: '/frames/frame_0060.jpg', alt: 'Front campus building of HLS Inter College', category: 'Campus' },
    { src: '/images/hls-event-1.png', fallback: '/frames/frame_0120.jpg', alt: 'HLS students displaying creative academic models', category: 'Activities' },
    { src: '/images/hls-event-2.png', fallback: '/frames/frame_0180.jpg', alt: 'Students performing during a college event', category: 'Events' },
    { src: '/images/hls-banner-5.jpg', fallback: '/frames/frame_0239.jpg', alt: 'Students assembled for campus activities in Devmanpur', category: 'Events' },
    ...college.gallery.map((item, idx) => ({
      src: item.src,
      fallback: item.fallback,
      alt: item.alt,
      category: idx % 2 === 0 ? 'Campus' : 'Activities',
    })),
  ], []);

  const filteredItems = useMemo(() => (
    filter === 'All' ? galleryItems : galleryItems.filter((item) => item.category === filter)
  ), [filter, galleryItems]);
  const visibleItems = filteredItems.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(batchSize);
  }, [batchSize, filter]);

  useEffect(() => {
    const marker = loadMoreRef.current;
    if (!marker || visibleCount >= filteredItems.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(filteredItems.length, count + batchSize));
        }
      },
      { rootMargin: '420px 0px', threshold: 0 }
    );
    observer.observe(marker);
    return () => observer.disconnect();
  }, [batchSize, filteredItems.length, visibleCount]);

  return (
    <main id="main-content" className="inner-page-shell sv-page sv-page--gallery">
      <div className="inner-page-bg-accents" aria-hidden="true" />

      <InnerPageHero
        eyebrow="Campus Gallery"
        title="Glimpses of campus life and learning."
        description="Explore visual highlights from HLS Inter College in Devmanpur including campus grounds, student projects, events, and sports."
        crumbs={[{ label: 'Gallery' }]}
        aside={
          <>
            <Camera className="h-8 w-8 text-orange-200/80" />
            <h2 className="mt-3 text-lg font-bold">Visual Heritage</h2>
            <p className="mt-2 text-sm leading-[1.7] text-teal-50/85">
              Snapshots of 7.5-acre co-educational campus life in Devmanpur, Ghatampur.
            </p>
          </>
        }
      />

      <StackingPage sections={[
        { id: 'gallery-natureverse', theme: 'memory' },
        { id: 'gallery-filter', theme: 'sunpath', interactive: true, forceFlow: true },
        { id: 'gallery-grid', theme: 'canopy', interactive: true, forceFlow: true },
      ]}>
        <NatureVerseScene variant="gallery" />

        <section className="sv-filter-section py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <div className="flex flex-wrap justify-center gap-2">
                {(['All', 'Campus', 'Events', 'Activities'] as GalleryFilter[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilter(cat)}
                    className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
                      filter === cat
                        ? 'bg-primary text-white shadow-md shadow-orange-200/50'
                        : 'bg-white/80 text-text-dark hover:bg-orange-50 hover:text-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        <section className="sv-content-section sv-content-section--gallery pb-16 pt-10 lg:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((photo, idx) => (
                <FadeUp key={`${photo.src}-${idx}`} delayMs={(idx % 6) * 60}>
                  <div
                    onClick={() => setActivePhoto(photo)}
                    className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/95 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    <img
                      src={photo.src}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = photo.fallback; }}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="mb-2 inline-block w-fit rounded-full bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        {photo.category}
                      </span>
                      <p className="text-sm font-semibold leading-snug text-white">{photo.alt}</p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-orange-200">
                        <ZoomIn className="h-4 w-4" /> Click to enlarge
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            {visibleCount < filteredItems.length && (
              <div ref={loadMoreRef} className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => Math.min(filteredItems.length, count + batchSize))}
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                >
                  Load more photos
                </button>
              </div>
            )}
          </div>
        </section>
      </StackingPage>

      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full overflow-hidden rounded-2xl bg-white p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black"
              aria-label="Close photo modal"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={activePhoto.src}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = activePhoto.fallback; }}
              alt={activePhoto.alt}
              className="max-h-[75vh] w-full rounded-xl object-contain"
            />
            <div className="p-4 text-center">
              <span className="mb-2 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase text-primary">
                {activePhoto.category}
              </span>
              <h3 className="font-display text-lg font-bold text-text-dark">{activePhoto.alt}</h3>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}