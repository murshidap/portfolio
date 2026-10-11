export type SocialKey = "github" | "linkedin" | "phone" | "email";

export interface IntroContent {
  id: string;
  name: string;
  role: string;
  role_scale_percent?: number;
  intro: string;
  email: string;
  phone: string;
  github_url: string;
  linkedin_url: string;
  resume_url: string;
  profile_image_url: string;
}

export interface SkillItem {
  id: string;
  display_order?: number;
  title: string;
  icon_url: string;
}

export interface ProjectItem {
  id: string;
  display_order?: number;
  title: string;
  title_font?: string;
  subtitle: string;
  description: string;
  stack: string[];
  project_url: string;
  image_url: string;
  screenshot_urls?: string[];
}

export interface ExperienceItem {
  id: string;
  display_order?: number;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface CertificateItem {
  id: string;
  display_order?: number;
  title: string;
  issuer: string;
  year: string;
  asset_url: string;
}

export interface AchievementItem {
  id: string;
  display_order?: number;
  title: string;
  image_url: string;
}

export interface ActivityItem {
  id: string;
  display_order?: number;
  title: string;
  image_url: string;
}

export interface EducationItem {
  id: string;
  display_order?: number;
  institution: string;
  degree: string;
  duration: string;
  description: string;
}

export interface PortfolioContent {
  intro: IntroContent;
  skills: SkillItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  certificates: CertificateItem[];
  achievements: AchievementItem[];
  activities: ActivityItem[];
  education: EducationItem[];
}
