// Re-export the new landing page Home component
import Home from './landing/Home'

export function LandingPage() {
  return <Home />
}

// Export individual landing components for routing
export { default as LandingHome } from './landing/Home'
export { default as LandingFeatures } from './landing/Features'
export { default as LandingAbout } from './landing/About'
export { default as LandingPricing } from './landing/Pricing'
export { default as LandingHeader } from './landing/Header'
export { default as LandingFooter } from './landing/Footer'

// Footer pages
export { default as LandingContact } from './landing/Contact'
export { default as LandingPrivacy } from './landing/Privacy'
export { default as LandingTerms } from './landing/Terms'
export { default as LandingBlog } from './landing/Blog'
export { default as LandingCareers } from './landing/Careers'
export { default as LandingHelpCenter } from './landing/HelpCenter'
export { default as LandingSecurity } from './landing/Security'
export { default as LandingChangelog } from './landing/Changelog'
export { default as LandingDocumentation } from './landing/Documentation'
export { default as LandingStatus } from './landing/Status'
export { default as LandingPress } from './landing/Press'
export { default as LandingCookies } from './landing/Cookies'
export { default as LandingGDPR } from './landing/GDPR'
