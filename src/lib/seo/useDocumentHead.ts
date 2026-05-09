import { useEffect } from 'react'

interface DocumentHeadInput {
  title: string
  description?: string
  canonical?: string
  image?: string
  type?: 'website' | 'profile' | 'article'
}

const SITE_URL = 'https://chirag-singh.vercel.app'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  if (!href) return
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useDocumentHead({
  title,
  description,
  canonical,
  image = '/Image/Profile-960.webp',
  type = 'website',
}: DocumentHeadInput) {
  useEffect(() => {
    document.title = title

    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
      setMeta('name', 'twitter:description', description)
    }

    setMeta('property', 'og:title', title)
    setMeta('property', 'og:type', type)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:card', 'summary_large_image')

    const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`
    setMeta('property', 'og:image', absoluteImage)
    setMeta('name', 'twitter:image', absoluteImage)

    if (canonical) {
      const absolute = canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`
      setLink('canonical', absolute)
      setMeta('property', 'og:url', absolute)
    }
  }, [title, description, canonical, image, type])
}

export const SEO_SITE_URL = SITE_URL
