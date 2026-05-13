import type { PortfolioContent } from "@/types/content";

export const defaultContent: PortfolioContent = {
  intro: {
    id: "intro-default",
    name: "MURSHIDA P.",
    role: "Web Developer",
    skills: ["Astro", "React", "Tailwind CSS", "Supabase"],
    intro:
      "I build modern, responsive, and interactive web experiences that combine clean design with functional, scalable development. I enjoy creating interfaces that not only look visually polished, but also feel smooth, intuitive, and engaging to use.",
    email: "murshida@example.com",
    phone: "+91 90000 00000",
    github_url: "https://github.com/",
    linkedin_url: "https://linkedin.com/",
    resume_url: "",
    profile_image_url: "/images/profile-picture.png"
  },
  projects: [
    {
      id: "project-1",
      title: "Portfolio System",
      subtitle: "Astro + Supabase",
      description:
        "A responsive portfolio platform with admin-driven content, glowing visuals, and premium motion.",
      stack: ["Astro", "React", "Supabase"],
      project_url: "https://example.com",
      image_url: ""
    },
    {
      id: "project-2",
      title: "Design Clone",
      subtitle: "Reference-perfect UI",
      description:
        "A polished landing experience recreated with careful spacing, gradients, and glassmorphism.",
      stack: ["Tailwind", "Framer Motion"],
      project_url: "https://example.com",
      image_url: ""
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "Freelance",
      role: "Frontend Developer",
      duration: "2024 - Present",
      description: "Building high-performance websites with a focus on visual quality and smooth UX."
    }
  ],
  certificates: [
    {
      id: "cert-1",
      title: "Frontend Development",
      issuer: "Professional Certification",
      year: "2025",
      asset_url: ""
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Your Institution",
      degree: "Bachelor's Degree",
      duration: "2020 - 2024",
      description: "Focused on web technologies, software engineering, and interface design."
    }
  ]
};
