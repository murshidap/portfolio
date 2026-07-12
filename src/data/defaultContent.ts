import type { PortfolioContent } from "@/types/content";

export const defaultContent: PortfolioContent = {
  intro: {
    id: "intro-default",
    name: "MURSHIDA P.",
    role: "Web Developer",
    skills: ["Astro", "React", "Tailwind CSS", "Supabase"],
    intro:
      "I am a web developer with a BSc in Computer Science and professional experience working as a Junior Web Developer. I specialize in building modern, responsive, and interactive websites that combine strong visual design with clean, scalable, and reliable development.\n\nI enjoy turning ideas and design concepts into functional websites through thoughtful layouts, smooth interactions, and well-structured code.\n\nAlongside my work in web development, I am currently pursuing an MSc in Computer Science with a specialization in Data Analytics. I am committed to improving my skills, exploring modern technologies, and building web experiences that are both creative and practical.",
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
      image_url: "",
      screenshot_urls: []
    },
    {
      id: "project-2",
      title: "Design Clone",
      subtitle: "Reference-perfect UI",
      description:
        "A polished landing experience recreated with careful spacing, gradients, and glassmorphism.",
      stack: ["Tailwind", "Framer Motion"],
      project_url: "https://example.com",
      image_url: "",
      screenshot_urls: []
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
  achievements: [
    {
      id: "achievement-1",
      title: "Academic Excellence",
      image_url: "/images/achievements/academic-excellence.svg"
    },
    {
      id: "achievement-2",
      title: "Web Development Award",
      image_url: "/images/achievements/web-award.svg"
    },
    {
      id: "achievement-3",
      title: "Data Analytics Milestone",
      image_url: "/images/achievements/data-milestone.svg"
    },
    {
      id: "achievement-4",
      title: "Project Showcase",
      image_url: "/images/achievements/project-showcase.svg"
    },
    {
      id: "achievement-5",
      title: "Hackathon Finalist",
      image_url: "/images/achievements/hackathon-finalist.svg"
    },
    {
      id: "achievement-6",
      title: "Creative Coding Recognition",
      image_url: "/images/achievements/creative-coding.svg"
    },
    {
      id: "achievement-7",
      title: "Certification Path",
      image_url: "/images/achievements/certification-path.svg"
    },
    {
      id: "achievement-8",
      title: "Community Contribution",
      image_url: "/images/achievements/community-contribution.svg"
    },
    {
      id: "achievement-9",
      title: "Leadership Recognition",
      image_url: "/images/achievements/leadership-recognition.svg"
    },
    {
      id: "achievement-10",
      title: "Outstanding Award",
      image_url: "/images/achievements/outstanding-award.svg"
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "MES Ponnani College, University of Calicut",
      degree: "B.Sc Computer Science",
      duration: "2023 - 26",
      description: ""
    },
    {
      id: "edu-2",
      institution: "Pondichery University",
      degree: "M.Sc Computer Science (Data Analytics)",
      duration: "2026 - 28 (Ongoing)",
      description: ""
    }
  ]
};
