import HeroSection from './components/HeroSection';
import FeaturedSection from './components/FeaturedSection';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar/>
      <HeroSection/>
      <FeaturedSection/>
      {/* <Footer/> */}
    </main>
  );
}

