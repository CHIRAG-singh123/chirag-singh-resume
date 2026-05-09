import { useEffect } from 'react'
import { resume } from '../../data/resume'
import { SEO_SITE_URL } from './useDocumentHead'

const SCRIPT_ID = 'jsonld-person'

export function PersonJsonLd() {
  useEffect(() => {
    const payload = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: resume.personal.name,
      jobTitle: resume.personal.title,
      url: SEO_SITE_URL,
      image: `${SEO_SITE_URL}/Image/Profile-960.webp`,
      email: `mailto:${resume.personal.email}`,
      telephone: resume.personal.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ahmedabad',
        addressRegion: 'Gujarat',
        addressCountry: 'IN',
      },
      sameAs: [resume.personal.githubUrl, resume.personal.linkedinUrl],
      knowsAbout: resume.skills.flatMap((group) => group.items),
      alumniOf: resume.education.map((ed) => ({
        '@type': 'CollegeOrUniversity',
        name: ed.school,
      })),
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(payload)
  }, [])

  return null
}
