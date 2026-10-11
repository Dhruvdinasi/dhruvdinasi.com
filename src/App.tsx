import { MotionConfig } from 'framer-motion';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useDocumentMeta, useRevealOnScroll, useScrollRestoration } from './lib/hooks';
import About from './pages/About';
import Certifications from './pages/Certifications';
import Contact from './pages/Contact';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProjectCaseStudy from './pages/ProjectCaseStudy';
import Projects from './pages/Projects';
import Resume from './pages/Resume';

function Effects() {
  useScrollRestoration();
  useRevealOnScroll();
  useDocumentMeta();
  return null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Effects />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectCaseStudy />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </MotionConfig>
  );
}
