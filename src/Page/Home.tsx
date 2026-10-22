import { useRef } from 'react';
import ResponsiveLayout from '../components/ResponsiveLayout';
import ArchiveHero from '../components/archive/ArchiveHero';
import ArchiveLog from '../components/archive/ArchiveLog';
import ContentSelector from '../features/content-selector/ContentSelector';
import useHomeEntrance from '../features/home-entrance/useHomeEntrance';
import archiveLogs from '../data/archiveLogs';
import socialLinks from '../data/socialLinks';
import '../styles/pages/home.css';

export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null);
  useHomeEntrance(homeRef);
  return <ResponsiveLayout>
    <div className="page-container home-page" ref={homeRef}>
      <div className="home-entry">
        <ArchiveHero socialLinks={socialLinks} />
        <ContentSelector />
      </div>
      <section className="home-updates" aria-labelledby="home-updates-title">
        <h2 id="home-updates-title">最近更新</h2>
        <ArchiveLog entries={archiveLogs} labelledBy="home-updates-title" />
      </section>
    </div>
  </ResponsiveLayout>;
}
