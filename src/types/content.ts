export type SocialKey = "github" | "linkedin" | "phone" | "email";

export interface IntroContent {
  id: string;
  name: string;
  role: string;
  skills: string[];
  intro: string;
  email: string;
  phone: string;
  github_url: string;
  linkedin_url: string;
  resume_url: string;
  profile_image_url: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  project_url: string;
  image_url: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  asset_url: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  description: string;
}

export interface PortfolioContent {
  intro: IntroContent;
  projects: ProjectItem[];
  experience: ExperienceItem[];
  certificates: CertificateItem[];
  education: EducationItem[];
}
