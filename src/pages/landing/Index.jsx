import MainNavigation from "../../components/landing/MainNavigation";
import Hero from "../../components/landing/home/Hero";
import ProductGrid from "../../components/landing/home/ProductGrid";
import BenefitRow from "../../components/landing/home/BenefitRow";
import SocialProof from "../../components/landing/home/SocialProof";
import PricingTeaser from "../../components/landing/home/PricingTeaser";
import Footer from "../../components/landing/Footer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Initialize scroll reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".reveal-animation");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div>
      <MainNavigation />
      <Hero />
      <ProductGrid />
      <BenefitRow />
      <SocialProof />
      <PricingTeaser />
      <Footer />
    </div>
  );
};

export default Index;
