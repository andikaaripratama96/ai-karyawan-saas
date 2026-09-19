import HeroSection from "./landing/Hero";
import Agents from "./landing/Agents";
import { Workflow, Platform } from "./landing/Workflow";
import { ReduceWork, BusinessTypes } from "./landing/Values";
import Testimonials from "./landing/Testimonials";
import { Pricing } from "./landing/Pricing";
import { CtaBanner, Faq, FinalCta, Footer } from "./landing/Closing";

export default function LandingPage() {
  return (
    <div className="bg-white">
      <HeroSection />
      <Testimonials />
      <Agents />
      <Workflow />
      <Platform />
      <ReduceWork />
      <BusinessTypes />
      <Pricing />
      <CtaBanner />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}