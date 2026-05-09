import { lazy, Suspense, type ComponentType } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { PageFallback } from '../components/PageFallback'
import { RootLayout } from '../layouts/RootLayout'

const HomePage = lazy(() =>
  import('../pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const AboutPage = lazy(() =>
  import('../pages/AboutPage').then((m) => ({ default: m.AboutPage })),
)
const SkillsPage = lazy(() =>
  import('../pages/SkillsPage').then((m) => ({ default: m.SkillsPage })),
)
const ProjectsPage = lazy(() =>
  import('../pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
)
const ProjectDetailPage = lazy(() =>
  import('../pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })),
)
const ExperiencePage = lazy(() =>
  import('../pages/ExperiencePage').then((m) => ({ default: m.ExperiencePage })),
)
const ContactPage = lazy(() =>
  import('../pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

function withSuspense(Component: ComponentType) {
  return (
    <Suspense fallback={<PageFallback />}>
      <Component />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: 'about', element: withSuspense(AboutPage) },
      { path: 'skills', element: withSuspense(SkillsPage) },
      { path: 'projects', element: withSuspense(ProjectsPage) },
      { path: 'projects/:slug', element: withSuspense(ProjectDetailPage) },
      { path: 'experience', element: withSuspense(ExperiencePage) },
      { path: 'contact', element: withSuspense(ContactPage) },
      { path: '*', element: withSuspense(NotFoundPage) },
    ],
  },
])
