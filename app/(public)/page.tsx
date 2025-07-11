import { Suspense } from 'react'
import { PremiumHeroSection } from "@/components/Home/premium-hero-section"
import { LuxuryServicesSection } from "@/components/Home/luxury-services-section"
import { BrightpoolSection } from "@/components/Home/brightpool-section"
import { ClienteleSection } from "@/components/Home/clientele-section"
import { DifferentiatorsSection } from "@/components/Home/differentiators-section"
import { LeadershipSection } from "@/components/Home/leadership-section"
import { MembershipSection } from "@/components/Home/membership-section"
import { ContactSection } from "@/components/Home/contact-section"
import { PremiumMissionSection } from "@/components/Home/premium-mission-section"
import { NorthStarSection } from "@/components/Home/north-star-section"
import { AnalyticsSection } from "@/components/Home/analytics-section"
import { Footer } from "@/components/Home/footer"
import { homePageContent, coreServices, differentiators, leadershipPartners, membershipBenefits } from "@/lib/cms-data"
import { LoadingFallback } from '@/components/Core'

// Loading skeletons for each section
const HeroSkeleton = () => (
  <div className="min-h-screen bg-navy-900 animate-pulse" />
)

const SectionSkeleton = () => (
  <div className="py-24 bg-navy-900">
    <div className="max-w-7xl mx-auto px-4">
      <div className="h-8 bg-gold-500/20 rounded w-1/3 mx-auto mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-navy-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  </div>
)

export default function BuckinghamVaultHome() {
  return (
    <main className="relative">
      {/* Premium Hero Section with Liquid Gold Background */}
      <Suspense fallback={<HeroSkeleton />}>
        <PremiumHeroSection 
          headline={homePageContent.hero.headline}
          subheadline={homePageContent.hero.subheadline}
          description={homePageContent.hero.description}
        />
      </Suspense>

      {/* Mission Section */}
      <section id="mission">
        <Suspense fallback={<SectionSkeleton />}>
          <PremiumMissionSection 
            title={homePageContent.mission.title}
            statement={homePageContent.mission.statement}
            description={homePageContent.mission.description}
            extended={homePageContent.mission.extended}
          />
        </Suspense>
      </section>

      {/* Clientele Section */}
      <section id="clientele">
        <Suspense fallback={<SectionSkeleton />}>
          <ClienteleSection clientele={homePageContent.clientele} />
        </Suspense>
      </section>

      {/* Core Services Section */}
      <section id="services">
        <Suspense fallback={<SectionSkeleton />}>
          <LuxuryServicesSection services={coreServices} />
        </Suspense>
      </section>

      {/* Brightpool Exchange Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <BrightpoolSection />
      </Suspense>

      {/* Key Differentiators */}
      <Suspense fallback={<SectionSkeleton />}>
        <DifferentiatorsSection differentiators={differentiators} />
      </Suspense>

      {/* Leadership Team */}
      <section id="leadership">
        <Suspense fallback={<SectionSkeleton />}>
          <LeadershipSection partners={leadershipPartners} />
        </Suspense>
      </section>

      {/* North Star Quote */}
      <Suspense fallback={<SectionSkeleton />}>
        <NorthStarSection quote={homePageContent.northStarQuote} />
      </Suspense>

      {/* Membership Information */}
      <section id="membership">
        <Suspense fallback={<SectionSkeleton />}>
          <MembershipSection benefits={membershipBenefits} />
        </Suspense>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
      </section>

      {/* Buckingham Vault Analytics */}
      <Suspense fallback={<SectionSkeleton />}>
        <AnalyticsSection />
      </Suspense>

      {/* Footer */}
      <Suspense fallback={<div className="h-32 bg-navy-900 animate-pulse" />}>
        <Footer />
      </Suspense>
    </main>
  )
}