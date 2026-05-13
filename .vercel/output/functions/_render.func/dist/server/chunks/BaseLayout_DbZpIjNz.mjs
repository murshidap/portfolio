import { jsx } from 'react/jsx-runtime';
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { a as getServiceSupabase, c as getPublicServerSupabase } from './auth_hH7cwaQS.mjs';
import { e as createComponent, g as addAttribute, l as renderHead, n as renderSlot, r as renderTemplate, h as createAstro } from './astro/server_y1XpGNYX.mjs';
import 'piccolore';
/* empty css                         */

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-[0.22em] uppercase transition-all duration-300 disabled:pointer-events-none disabled:opacity-100",
  {
    variants: {
      variant: {
        primary: "border border-white/10 bg-[linear-gradient(90deg,rgba(61,103,255,0.95),rgba(119,85,255,0.4))] text-white shadow-glow hover:scale-[1.02]",
        secondary: "border border-white/15 bg-white/[0.03] text-white/88 hover:border-white/30 hover:bg-white/[0.06]",
        ghost: "text-white/70 hover:text-white"
      },
      size: {
        default: "h-14 px-8",
        sm: "h-10 px-4 text-xs",
        lg: "h-16 px-10"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return /* @__PURE__ */ jsx("button", { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";

function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "rounded-[28px] border border-white/10 bg-white/[0.04] shadow-panel backdrop-blur-2xl",
        className
      ),
      ...props
    }
  );
}

const defaultContent = {
  intro: {
    id: "intro-default",
    name: "MURSHIDA P.",
    role: "Web Developer",
    skills: ["Astro", "React", "Tailwind CSS", "Supabase"],
    intro: "I build modern, responsive, and interactive web experiences that combine clean design with functional, scalable development. I enjoy creating interfaces that not only look visually polished, but also feel smooth, intuitive, and engaging to use.",
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
      description: "A responsive portfolio platform with admin-driven content, glowing visuals, and premium motion.",
      stack: ["Astro", "React", "Supabase"],
      project_url: "https://example.com",
      image_url: ""
    },
    {
      id: "project-2",
      title: "Design Clone",
      subtitle: "Reference-perfect UI",
      description: "A polished landing experience recreated with careful spacing, gradients, and glassmorphism.",
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

async function fetchPortfolioContent(serverSide = false) {
  const supabase = serverSide ? getServiceSupabase() ?? getPublicServerSupabase() : getPublicServerSupabase();
  if (!supabase) {
    return defaultContent;
  }
  const [introResult, projectsResult, experienceResult, certificatesResult, educationResult] = await Promise.all([
    supabase.from("intro_content").select("*").limit(1).maybeSingle(),
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("experience").select("*").order("created_at", { ascending: false }),
    supabase.from("certificates").select("*").order("created_at", { ascending: false }),
    supabase.from("education").select("*").order("created_at", { ascending: false })
  ]);
  return {
    intro: introResult.data ?? defaultContent.intro,
    projects: projectsResult.data?.length ? projectsResult.data : defaultContent.projects,
    experience: experienceResult.data?.length ? experienceResult.data : defaultContent.experience,
    certificates: certificatesResult.data?.length ? certificatesResult.data : defaultContent.certificates,
    education: educationResult.data?.length ? educationResult.data : defaultContent.education
  };
}

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title,
    description = "Murshida P. portfolio built with Astro, React, Tailwind CSS, shadcn/ui and Supabase."
  } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><title>${title}</title>${renderHead()}</head> <body class="bg-background text-foreground antialiased"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Murshida/Career/murshida-portfolio/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $, Button as B, Card as C, cn as c, defaultContent as d, fetchPortfolioContent as f };
