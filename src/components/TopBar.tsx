import { Facebook, FileText, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { college } from '../data/college';

export default function TopBar() {
  return (
    <div className="hidden border-b border-gray-100 bg-white text-sm md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 text-gray-600">
          <a href={`https://maps.google.com/?q=${encodeURIComponent(college.address)}`} className="flex items-center hover:text-primary" target="_blank" rel="noreferrer">
            <MapPin className="mr-2 h-4 w-4 text-primary" />
            <span>{college.location}</span>
          </a>
          <a href={`mailto:${college.email}`} className="hidden items-center hover:text-primary lg:flex">
            <Mail className="mr-2 h-4 w-4 text-primary" />
            <span>{college.email}</span>
          </a>
          <a href={`tel:${college.phones[0].replace(/\s/g, '')}`} className="flex items-center hover:text-primary">
            <Phone className="mr-2 h-4 w-4 text-primary" />
            <span>{college.phones[0]}</span>
          </a>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <a href="/#registration" className="flex items-center gap-1.5 font-black text-primary hover:text-orange-700"><FileText className="h-4 w-4" /> Online Registration</a>
          <span className="hidden font-semibold text-gray-500 lg:inline">Follow:</span>
          <a href={college.facebook} aria-label="HLS Inter College on Facebook" target="_blank" rel="noreferrer" className="hover:text-primary"><Facebook className="h-4 w-4" /></a>
          <a href={college.youtube} aria-label="HLS Inter College on YouTube" target="_blank" rel="noreferrer" className="hover:text-primary"><Youtube className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
  );
}
