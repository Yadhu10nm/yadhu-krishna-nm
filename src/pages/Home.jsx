import Hero from '../components/Hero';
import About from '../components/About';
import ProjectCarousel from '../components/ProjectCarousel';
import Skills from '../components/Skills';
import CertificationsPreview from '../components/CertificationsPreview';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ProjectCarousel />
      <Skills />
      <CertificationsPreview />
      <Gallery />
      <Contact />
    </>
  );
}
