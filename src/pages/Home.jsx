import Hero from '../components/sections/Hero'
import Stats from '../components/sections/Stats'
import ServiceLines from '../components/sections/ServiceLines'
import PopularDestinations from '../components/sections/PopularDestinations'
import FeaturedTours from '../components/sections/FeaturedTours'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import VisaServices from '../components/sections/VisaServices'
import Testimonials from '../components/sections/Testimonials'
import Faq from '../components/sections/Faq'
import CtaBanner from '../components/sections/CtaBanner'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <ServiceLines />
      <PopularDestinations />
      <FeaturedTours />
      <WhyChooseUs />
      <VisaServices />
      <Testimonials />
      <Faq />
      <CtaBanner />
    </>
  )
}
