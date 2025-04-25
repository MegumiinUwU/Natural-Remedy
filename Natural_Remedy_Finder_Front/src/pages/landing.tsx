import Header from '../layout/header';
import Hero from '../components/Home/hero';
import About from '../components/Home/About';
import Footer from '../layout/footer';
import AiSection from '../components/Home/AiSection';

function landing() {
  return (
    <div className="font-sans bg-light-cream">
      <Header />
      <main>
        <Hero />
        <About />
        <AiSection/>
      </main>
      <Footer />
    </div>
  );
}

export default landing;