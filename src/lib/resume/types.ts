export interface PersonalInfo {
  name: string
  title: string
  phone: string
  email: string
  github: string
  githubUrl: string
  linkedin: string
  linkedinUrl: string
  location: string
}

export interface SkillGroup {
  label: string
  items: string[]
}

export interface Project {
  name: string
  tagline: string
  bullets: string[]
  stack: string[]
}

export interface ExperienceItem {
  title: string
  company: string
  period: string
  bullets: string[]
}

export interface EducationItem {
  degree: string
  school: string
  period: string
  location: string
}

export interface Certificate {
  title: string
  description: string
}

export interface ResumeData {
  summary: string
  personal: PersonalInfo
  skills: SkillGroup[]
  projects: Project[]
  experience: ExperienceItem[]
  achievements: string[]
  certificates: Certificate[]
  certificatesExtra: string
  education: EducationItem[]
}
