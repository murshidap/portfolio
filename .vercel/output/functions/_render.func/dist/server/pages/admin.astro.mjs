import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from '../chunks/astro/server_tE5jNKah.mjs';
import 'piccolore';
import { jsx, jsxs } from 'react/jsx-runtime';
import { LogOut, Trash2, LoaderCircle, Save, Plus, Eye, Check, Upload, X, ImagePlus, ArrowLeft, ExternalLink, Pencil } from 'lucide-react';
import { useState } from 'react';
import { c as cn, B as Button, I as Input, T as Textarea, $ as $$BaseLayout } from '../chunks/BaseLayout_k0i_bco2.mjs';
import { d as defaultContent } from '../chunks/defaultContent_Cj_9S1DA.mjs';
import { f as fetchPortfolioContent } from '../chunks/content_DBw6s_dR.mjs';
import { g as getAdminUserFromRequest } from '../chunks/auth_B79Sfj4C.mjs';
export { renderers } from '../renderers.mjs';

function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "theme-card rounded-md border",
        className
      ),
      ...props
    }
  );
}

function Label({ className, ...props }) {
  return /* @__PURE__ */ jsx("label", { className: cn("mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-zinc-600", className), ...props });
}

const tabs = [
  { key: "homepage", label: "Homepage" },
  { key: "about", label: "About Me" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "certificates", label: "Certificates" }
];
const createId = () => crypto.randomUUID();
function normalizePersistedId(value) {
  if (typeof value === "string" && value.trim()) {
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return createId();
}
function appendUniqueUrl(urls, url) {
  return Array.from(new Set([...urls ?? [], url].map((item) => item.trim()).filter(Boolean)));
}
function normalizeActivitySlots(items) {
  const sourceItems = items ?? defaultContent.activities;
  return sourceItems.map((item, index) => ({
    id: normalizePersistedId(item?.id),
    title: item?.title || `Activity ${index + 1}`,
    image_url: item?.image_url || ""
  }));
}
function isSquareImage(file) {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image.naturalWidth > 0 && image.naturalWidth === image.naturalHeight);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(false);
    };
    image.src = objectUrl;
  });
}
const primaryActionClass = "!h-9 !rounded-md !border-black !bg-black !px-3 !text-sm !font-medium !normal-case !tracking-normal !text-white !shadow-none hover:!scale-100 hover:!bg-zinc-800";
const secondaryActionClass = "!h-9 !rounded-md !border-zinc-300 !bg-white !px-3 !text-sm !font-medium !normal-case !tracking-normal !text-zinc-900 !shadow-none hover:!scale-100 hover:!border-zinc-500 hover:!bg-zinc-50";
const destructiveActionClass = "!h-9 !rounded-md !border-zinc-300 !bg-white !px-3 !text-sm !font-medium !normal-case !tracking-normal !text-zinc-700 !shadow-none hover:!scale-100 hover:!border-zinc-900 hover:!bg-zinc-50 hover:!text-black";
const panelClass = "!rounded-md !border-zinc-200 !bg-white !shadow-none !backdrop-blur-none";
const homepageValueInputClass = "!h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-0 !shadow-none focus:!border-0 focus:!ring-0";
const projectAdditionalImageMaxCount = 4;
const projectDescriptionMaxLength = 240;
const experienceDescriptionMaxLength = 220;
const achievementTitleMaxLength = 28;
const activityTitleMaxLength = 60;
const fixedOwnerName = "MURSHIDA P.";
async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }
  return payload;
}
function AdminApp({ authenticated, initialContent }) {
  const [tab, setTab] = useState("homepage");
  const [aboutSection, setAboutSection] = useState("intro");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(authenticated);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState(() => {
    const startingContent = initialContent ?? defaultContent;
    return {
      ...startingContent,
      achievements: startingContent.achievements,
      activities: normalizeActivitySlots(startingContent.activities)
    };
  });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const saveIntro = async () => {
    setSaving(true);
    setMessage("");
    try {
      await parseResponse(
        await fetch("/api/admin/intro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...content.intro, name: fixedOwnerName })
        })
      );
      setMessage("Homepage updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Saving failed.");
    } finally {
      setSaving(false);
    }
  };
  const saveList = async (table, rows) => {
    setSaving(true);
    setMessage("");
    try {
      const sanitizedRows = rows.map((row) => {
        if (!row || typeof row !== "object") {
          return row;
        }
        const withId = row;
        return {
          ...withId,
          id: normalizePersistedId(withId.id)
        };
      });
      await parseResponse(
        await fetch("/api/admin/collection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table, rows: sanitizedRows })
        })
      );
      setMessage(`${table} updated.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Saving failed.");
    } finally {
      setSaving(false);
    }
  };
  const saveAchievementsPanel = async () => {
    setSaving(true);
    setMessage("");
    try {
      await Promise.all([
        parseResponse(
          await fetch("/api/admin/intro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...content.intro, name: fixedOwnerName })
          })
        ),
        parseResponse(
          await fetch("/api/admin/collection", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              table: "achievements",
              rows: content.achievements.map((entry) => ({
                ...entry,
                title: entry.title.slice(0, achievementTitleMaxLength)
              }))
            })
          })
        ),
        parseResponse(
          await fetch("/api/admin/collection", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ table: "education", rows: content.education })
          })
        ),
        parseResponse(
          await fetch("/api/admin/collection", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              table: "activities",
              rows: content.activities.map((entry, index) => ({
                ...entry,
                id: entry.id || `activity-${index + 1}`,
                title: entry.title.slice(0, activityTitleMaxLength)
              }))
            })
          })
        )
      ]);
      setMessage("About content updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Saving failed.");
    } finally {
      setSaving(false);
    }
  };
  const deleteRow = async (table, id) => {
    try {
      await parseResponse(
        await fetch("/api/admin/collection", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table, id })
        })
      );
      setMessage("Item deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    }
  };
  const handleLogin = async () => {
    setSaving(true);
    setMessage("");
    try {
      await parseResponse(
        await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        })
      );
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
      setSaving(false);
    }
  };
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsLoggedIn(false);
    window.location.reload();
  };
  const addProject = () => {
    const newProject = {
      id: createId(),
      title: "",
      subtitle: "",
      description: "",
      stack: [],
      project_url: "",
      image_url: "",
      screenshot_urls: []
    };
    setContent((previous) => ({
      ...previous,
      projects: [...previous.projects, newProject]
    }));
    setEditingProjectId(newProject.id);
  };
  const addSkill = () => setContent((previous) => ({
    ...previous,
    skills: [{ id: createId(), title: "", icon_url: "" }, ...previous.skills]
  }));
  const addExperience = () => {
    const newExperience = {
      id: createId(),
      company: "",
      role: "",
      duration: "",
      description: ""
    };
    setContent((previous) => ({
      ...previous,
      experience: [newExperience, ...previous.experience]
    }));
    setEditingExperienceId(newExperience.id);
  };
  const addCertificate = () => setContent((previous) => ({
    ...previous,
    certificates: [{ id: createId(), title: "", issuer: "", year: "", asset_url: "" }, ...previous.certificates]
  }));
  const addAchievement = () => setContent((previous) => ({
    ...previous,
    achievements: [{ id: createId(), title: "", image_url: "" }, ...previous.achievements]
  }));
  const addEducation = () => setContent((previous) => ({
    ...previous,
    education: [{ id: createId(), institution: "", degree: "", duration: "", description: "" }, ...previous.education]
  }));
  const saveExperience = () => saveList(
    "experience",
    content.experience.map((entry) => ({
      ...entry,
      description: entry.description.slice(0, experienceDescriptionMaxLength)
    }))
  );
  const saveProjects = () => saveList(
    "projects",
    content.projects.map((entry) => ({
      ...entry,
      screenshot_urls: (entry.screenshot_urls ?? []).slice(0, projectAdditionalImageMaxCount)
    }))
  );
  const renderLogin = () => /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-white px-5 py-10 text-zinc-950", children: /* @__PURE__ */ jsxs(Card, { className: cn(panelClass, "w-full max-w-md p-6"), children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500", children: "Portfolio Admin" }),
    /* @__PURE__ */ jsx("h1", { className: "mt-3 text-2xl font-semibold tracking-tight text-zinc-950", children: "Sign in" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-6 text-zinc-500", children: "Use the configured admin credentials to manage portfolio content." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "username", children: "Username" }),
        /* @__PURE__ */ jsx(Input, { id: "username", onChange: (event) => setUsername(event.target.value), value: username })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx(Input, { id: "password", onChange: (event) => setPassword(event.target.value), type: "password", value: password })
      ] }),
      /* @__PURE__ */ jsx(Button, { className: cn(primaryActionClass, "w-full justify-center"), onClick: handleLogin, type: "button", children: saving ? /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Login" })
    ] }),
    message ? /* @__PURE__ */ jsx("p", { className: "mt-4 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700", children: message }) : null
  ] }) });
  if (!isLoggedIn) {
    return renderLogin();
  }
  const tabCounts = {
    homepage: 1,
    skills: content.skills.length,
    projects: content.projects.length,
    experience: content.experience.length,
    certificates: content.certificates.length
  };
  const aboutSectionCounts = {
    education: content.education.length,
    achievements: content.achievements.length,
    activities: content.activities.length
  };
  const activeTab = tabs.find((item) => item.key === tab) ?? tabs[0];
  const renderHeaderActions = () => {
    if (tab === "homepage") {
      return /* @__PURE__ */ jsxs(Button, { className: primaryActionClass, onClick: saveIntro, type: "button", children: [
        /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
        "Save Homepage"
      ] });
    }
    if (tab === "about") {
      if (aboutSection === "intro") {
        return /* @__PURE__ */ jsxs(Button, { className: primaryActionClass, onClick: saveIntro, type: "button", children: [
          /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
          "Save Intro"
        ] });
      }
      if (aboutSection === "education") {
        return /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 flex-wrap justify-end gap-3", children: [
          /* @__PURE__ */ jsxs(Button, { className: secondaryActionClass, onClick: addEducation, type: "button", variant: "secondary", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            "Add Education"
          ] }),
          /* @__PURE__ */ jsxs(Button, { className: primaryActionClass, onClick: () => saveList("education", content.education), type: "button", children: [
            /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
            "Save Education"
          ] })
        ] });
      }
      if (aboutSection === "achievements") {
        return /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 flex-wrap justify-end gap-3", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              className: secondaryActionClass,
              onClick: addAchievement,
              type: "button",
              variant: "secondary",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
                "Add Achievement"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(Button, { className: primaryActionClass, onClick: () => saveList("achievements", content.achievements), type: "button", children: [
            /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
            "Save Achievements"
          ] })
        ] });
      }
      return /* @__PURE__ */ jsx("div", { className: "flex shrink-0 flex-wrap justify-end gap-3", children: /* @__PURE__ */ jsxs(Button, { className: primaryActionClass, onClick: saveAchievementsPanel, type: "button", children: [
        /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
        "Save Activities"
      ] }) });
    }
    const actions = {
      skills: { addLabel: "Add Skill", onAdd: addSkill, onSave: () => saveList("skills", content.skills) },
      projects: { addLabel: "Add Project", onAdd: addProject, onSave: saveProjects },
      experience: { addLabel: "Add Experience", onAdd: addExperience, onSave: saveExperience },
      certificates: { addLabel: "Add Certificate", onAdd: addCertificate, onSave: () => saveList("certificates", content.certificates) },
      achievements: { addLabel: "Add Achievement", onAdd: addAchievement, onSave: saveAchievementsPanel },
      activities: { addLabel: "Add Activity", onAdd: () => void 0, onSave: saveAchievementsPanel },
      education: { addLabel: "Add Education", onAdd: addEducation, onSave: () => saveList("education", content.education) }
    };
    const activeActions = actions[tab];
    return /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 flex-wrap justify-end gap-3", children: [
      /* @__PURE__ */ jsxs(Button, { className: secondaryActionClass, onClick: activeActions.onAdd, type: "button", variant: "secondary", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        activeActions.addLabel
      ] }),
      /* @__PURE__ */ jsxs(Button, { className: primaryActionClass, onClick: activeActions.onSave, type: "button", children: [
        /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
        "Save Changes"
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white text-zinc-950", children: [
    /* @__PURE__ */ jsxs("aside", { className: "fixed inset-y-0 left-0 z-30 flex w-[280px] flex-col border-r border-zinc-200 bg-white", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-zinc-200 px-5 py-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-zinc-950", children: "Murshida Portfolio" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-zinc-500", children: "Content admin" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "flex-1 overflow-y-auto px-3 py-4", children: [
        /* @__PURE__ */ jsx("p", { className: "px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400", children: "Content" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 space-y-1", children: tabs.map((item) => {
          const active = tab === item.key;
          if (item.key === "about") {
            return /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: cn(
                    "flex h-10 w-full items-center justify-between rounded-md px-3 text-left text-sm font-medium transition",
                    active ? "bg-black text-white" : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                  ),
                  onClick: () => setTab("about"),
                  type: "button",
                  children: /* @__PURE__ */ jsx("span", { children: item.label })
                }
              ),
              active ? /* @__PURE__ */ jsx("div", { className: "ml-3 mt-1 space-y-1 border-l border-zinc-200 pl-3", children: ["intro", "education", "achievements", "activities"].map((section) => /* @__PURE__ */ jsxs(
                "button",
                {
                  className: cn(
                    "flex h-9 w-full items-center justify-between rounded-md px-3 text-left text-sm transition",
                    aboutSection === section ? "bg-zinc-100 font-medium text-zinc-950" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                  ),
                  onClick: () => setAboutSection(section),
                  type: "button",
                  children: [
                    /* @__PURE__ */ jsx("span", { children: section[0].toUpperCase() + section.slice(1) }),
                    aboutSectionCounts[section] !== void 0 ? /* @__PURE__ */ jsx("span", { className: "text-xs text-zinc-400", children: aboutSectionCounts[section] }) : null
                  ]
                },
                section
              )) }) : null
            ] }, item.key);
          }
          return /* @__PURE__ */ jsxs(
            "button",
            {
              className: cn(
                "flex h-10 w-full items-center justify-between rounded-md px-3 text-left text-sm font-medium transition",
                active ? "bg-black text-white" : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
              ),
              onClick: () => setTab(item.key),
              type: "button",
              children: [
                /* @__PURE__ */ jsx("span", { children: item.label }),
                /* @__PURE__ */ jsx("span", { className: cn("text-xs", active ? "text-white/70" : "text-zinc-400"), children: tabCounts[item.key] })
              ]
            },
            item.key
          );
        }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-zinc-200 p-3", children: /* @__PURE__ */ jsxs(Button, { className: cn(secondaryActionClass, "w-full justify-start"), onClick: handleLogout, type: "button", variant: "secondary", children: [
        /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
        "Logout"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "min-h-screen pl-[280px]", children: [
      /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-20 flex h-[82px] items-center justify-between border-b border-zinc-200 bg-white px-8", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight text-zinc-950", children: activeTab.label }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center justify-end gap-4", children: [
          message ? /* @__PURE__ */ jsx("p", { className: "max-w-sm truncate rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700", children: message }) : null,
          renderHeaderActions()
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-[1280px] px-8 py-7", children: /* @__PURE__ */ jsxs(Card, { className: "!border-0 !bg-transparent p-5 !shadow-none md:p-6", children: [
        tab === "homepage" && /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-md border border-zinc-200", children: [
          /* @__PURE__ */ jsx(AdminFieldRow, { label: "Profile Picture", children: /* @__PURE__ */ jsx(
            AssetUpload,
            {
              accept: ".jpeg,.jpg,.png,.webp,.avif,.gif",
              assetFolder: "intro",
              inputClassName: homepageValueInputClass,
              onUploaded: (url) => setContent((previous) => ({
                ...previous,
                intro: { ...previous.intro, profile_image_url: url }
              })),
              value: content.intro.profile_image_url
            }
          ) }),
          /* @__PURE__ */ jsx(AdminFieldRow, { label: "Role", children: /* @__PURE__ */ jsx(
            Input,
            {
              className: homepageValueInputClass,
              value: content.intro.role,
              onChange: (event) => setContent((previous) => ({ ...previous, intro: { ...previous.intro, role: event.target.value } }))
            }
          ) }),
          /* @__PURE__ */ jsx(AdminFieldRow, { label: "GitHub", children: /* @__PURE__ */ jsx(
            Input,
            {
              className: homepageValueInputClass,
              value: content.intro.github_url,
              onChange: (event) => setContent((previous) => ({
                ...previous,
                intro: { ...previous.intro, github_url: event.target.value }
              }))
            }
          ) }),
          /* @__PURE__ */ jsx(AdminFieldRow, { label: "LinkedIn", children: /* @__PURE__ */ jsx(
            Input,
            {
              className: homepageValueInputClass,
              value: content.intro.linkedin_url,
              onChange: (event) => setContent((previous) => ({
                ...previous,
                intro: { ...previous.intro, linkedin_url: event.target.value }
              }))
            }
          ) }),
          /* @__PURE__ */ jsx(AdminFieldRow, { label: "Phone", children: /* @__PURE__ */ jsx(
            Input,
            {
              className: homepageValueInputClass,
              value: content.intro.phone,
              onChange: (event) => setContent((previous) => ({ ...previous, intro: { ...previous.intro, phone: event.target.value } }))
            }
          ) }),
          /* @__PURE__ */ jsx(AdminFieldRow, { label: "Email", children: /* @__PURE__ */ jsx(
            Input,
            {
              className: homepageValueInputClass,
              value: content.intro.email,
              onChange: (event) => setContent((previous) => ({ ...previous, intro: { ...previous.intro, email: event.target.value } }))
            }
          ) }),
          /* @__PURE__ */ jsx(AdminFieldRow, { label: "Resume", children: /* @__PURE__ */ jsx(
            AssetUpload,
            {
              accept: "application/pdf",
              assetFolder: "resume",
              inputClassName: homepageValueInputClass,
              onUploaded: (url) => setContent((previous) => ({
                ...previous,
                intro: { ...previous.intro, resume_url: url }
              })),
              value: content.intro.resume_url
            }
          ) })
        ] }),
        tab === "skills" && /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-md border border-zinc-200", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[88px_120px_minmax(0,1fr)_88px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500", children: [
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3", children: "SI NO." }),
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3 text-center", children: "Icon" }),
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3", children: "Skill" }),
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3 text-center", children: "Delete" })
          ] }),
          content.skills.map((item, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "grid min-h-14 grid-cols-[88px_120px_minmax(0,1fr)_88px] border-b border-zinc-200 last:border-b-0",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center px-5 py-3 text-sm text-zinc-500", children: index + 1 }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center px-5 py-3", children: /* @__PURE__ */ jsx(
                  IconUploadButton,
                  {
                    accept: ".jpeg,.jpg,.png,.webp,.avif,.gif",
                    assetFolder: "skills",
                    currentUrl: item.icon_url,
                    onUploaded: (url) => setContent((previous) => ({
                      ...previous,
                      skills: previous.skills.map(
                        (entry, entryIndex) => entryIndex === index ? { ...item, icon_url: url } : entry
                      )
                    }))
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center px-5 py-3", children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: homepageValueInputClass,
                    value: item.title,
                    onChange: (event) => setContent((previous) => ({
                      ...previous,
                      skills: previous.skills.map(
                        (entry, entryIndex) => entryIndex === index ? { ...item, title: event.target.value } : entry
                      )
                    }))
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center px-5 py-3", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    "aria-label": `Delete ${item.title || "skill"}`,
                    className: "grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black",
                    onClick: () => {
                      setContent((previous) => ({
                        ...previous,
                        skills: previous.skills.filter((entry) => entry.id !== item.id)
                      }));
                      void deleteRow("skills", item.id);
                    },
                    type: "button",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                ) })
              ]
            },
            item.id
          ))
        ] }),
        tab === "projects" && (() => {
          const editingProject = content.projects.find((project) => project.id === editingProjectId);
          if (editingProject) {
            const projectIndex = content.projects.findIndex((project) => project.id === editingProject.id);
            return /* @__PURE__ */ jsx(
              ProjectEditor,
              {
                item: editingProject,
                onBack: () => setEditingProjectId(null),
                onChange: (next) => setContent((previous) => ({
                  ...previous,
                  projects: previous.projects.map((project, index) => index === projectIndex ? next : project)
                })),
                onDelete: () => {
                  setEditingProjectId(null);
                  setContent((previous) => ({
                    ...previous,
                    projects: previous.projects.filter((project) => project.id !== editingProject.id)
                  }));
                  void deleteRow("projects", editingProject.id);
                }
              }
            );
          }
          return /* @__PURE__ */ jsx(
            ProjectsTable,
            {
              items: content.projects,
              onDelete: (item) => {
                setContent((previous) => ({
                  ...previous,
                  projects: previous.projects.filter((project) => project.id !== item.id)
                }));
                void deleteRow("projects", item.id);
              },
              onEdit: (item) => setEditingProjectId(item.id)
            }
          );
        })(),
        tab === "experience" && (() => {
          const editingExperience = content.experience.find((item) => item.id === editingExperienceId);
          if (editingExperience) {
            return /* @__PURE__ */ jsx(
              ExperienceEditor,
              {
                item: editingExperience,
                onBack: () => setEditingExperienceId(null),
                onChange: (next) => setContent((previous) => ({
                  ...previous,
                  experience: previous.experience.map((entry) => entry.id === next.id ? next : entry)
                })),
                onDelete: () => {
                  setEditingExperienceId(null);
                  setContent((previous) => ({
                    ...previous,
                    experience: previous.experience.filter((entry) => entry.id !== editingExperience.id)
                  }));
                  void deleteRow("experience", editingExperience.id);
                }
              }
            );
          }
          return /* @__PURE__ */ jsx(
            ExperienceTable,
            {
              items: content.experience,
              onDelete: (item) => {
                setContent((previous) => ({
                  ...previous,
                  experience: previous.experience.filter((entry) => entry.id !== item.id)
                }));
                void deleteRow("experience", item.id);
              },
              onEdit: (item) => setEditingExperienceId(item.id)
            }
          );
        })(),
        tab === "certificates" && /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-md border border-zinc-200", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[88px_240px_minmax(0,1fr)_minmax(0,1fr)_120px_72px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500", children: [
            /* @__PURE__ */ jsx("div", { className: "whitespace-nowrap px-4 py-3 text-center", children: "SI No." }),
            /* @__PURE__ */ jsx("div", { className: "px-4 py-3 text-center", children: "Image" }),
            /* @__PURE__ */ jsx("div", { className: "px-4 py-3", children: "Title" }),
            /* @__PURE__ */ jsx("div", { className: "px-4 py-3", children: "Issuer" }),
            /* @__PURE__ */ jsx("div", { className: "px-4 py-3", children: "Year" }),
            /* @__PURE__ */ jsx("div", { className: "px-4 py-3 text-center", children: "Delete" })
          ] }),
          content.certificates.map((item, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "grid min-h-14 grid-cols-[88px_240px_minmax(0,1fr)_minmax(0,1fr)_120px_72px] border-b border-zinc-200 last:border-b-0",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center px-4 py-3 text-sm text-zinc-500", children: index + 1 }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center px-4 py-3", children: /* @__PURE__ */ jsx(
                  IconUploadButton,
                  {
                    accept: ".jpeg,.jpg,.png,.webp,.avif,.gif",
                    assetFolder: "certificates",
                    currentUrl: item.asset_url,
                    onUploaded: (url) => setContent((previous) => ({
                      ...previous,
                      certificates: previous.certificates.map(
                        (entry, entryIndex) => entryIndex === index ? { ...item, asset_url: url } : entry
                      )
                    }))
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center px-4 py-3", children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: homepageValueInputClass,
                    value: item.title,
                    onChange: (event) => setContent((previous) => ({
                      ...previous,
                      certificates: previous.certificates.map(
                        (entry, entryIndex) => entryIndex === index ? { ...item, title: event.target.value } : entry
                      )
                    }))
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center px-4 py-3", children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: homepageValueInputClass,
                    value: item.issuer,
                    onChange: (event) => setContent((previous) => ({
                      ...previous,
                      certificates: previous.certificates.map(
                        (entry, entryIndex) => entryIndex === index ? { ...item, issuer: event.target.value } : entry
                      )
                    }))
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center px-4 py-3", children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: homepageValueInputClass,
                    value: item.year,
                    onChange: (event) => setContent((previous) => ({
                      ...previous,
                      certificates: previous.certificates.map(
                        (entry, entryIndex) => entryIndex === index ? { ...item, year: event.target.value } : entry
                      )
                    }))
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center px-4 py-3", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    "aria-label": `Delete ${item.title || "certificate"}`,
                    className: "grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black",
                    onClick: () => {
                      setContent((previous) => ({
                        ...previous,
                        certificates: previous.certificates.filter((entry) => entry.id !== item.id)
                      }));
                      void deleteRow("certificates", item.id);
                    },
                    type: "button",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                ) })
              ]
            },
            item.id
          ))
        ] }),
        tab === "about" && aboutSection === "intro" && /* @__PURE__ */ jsx(CrudList, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Intro Text" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              className: "!min-h-80 resize-y",
              value: content.intro.intro,
              onChange: (event) => setContent((previous) => ({ ...previous, intro: { ...previous.intro, intro: event.target.value } }))
            }
          )
        ] }) }),
        tab === "about" && aboutSection === "education" && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border border-zinc-200", children: /* @__PURE__ */ jsxs("div", { className: "min-w-[720px] overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)_minmax(0,1fr)_88px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500", children: [
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3", children: "Degree" }),
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3", children: "Institution" }),
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3", children: "Duration" }),
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3 text-center", children: "Delete" })
          ] }),
          content.education.map((item, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "grid min-h-14 grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)_minmax(0,1fr)_88px] border-b border-zinc-200 last:border-b-0",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center px-5 py-3", children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: homepageValueInputClass,
                    value: item.degree,
                    onChange: (event) => setContent((previous) => ({
                      ...previous,
                      education: previous.education.map(
                        (entry, entryIndex) => entryIndex === index ? { ...entry, degree: event.target.value } : entry
                      )
                    }))
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center px-5 py-3", children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: homepageValueInputClass,
                    value: item.institution,
                    onChange: (event) => setContent((previous) => ({
                      ...previous,
                      education: previous.education.map(
                        (entry, entryIndex) => entryIndex === index ? { ...entry, institution: event.target.value } : entry
                      )
                    }))
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center px-5 py-3", children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: homepageValueInputClass,
                    value: item.duration,
                    onChange: (event) => setContent((previous) => ({
                      ...previous,
                      education: previous.education.map(
                        (entry, entryIndex) => entryIndex === index ? { ...entry, duration: event.target.value } : entry
                      )
                    }))
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center px-5 py-3", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    "aria-label": `Delete ${item.degree || "education"}`,
                    className: "grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black",
                    onClick: () => {
                      setContent((previous) => ({
                        ...previous,
                        education: previous.education.filter((entry) => entry.id !== item.id)
                      }));
                      void deleteRow("education", item.id);
                    },
                    type: "button",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                ) })
              ]
            },
            item.id
          ))
        ] }) }),
        tab === "about" && aboutSection === "achievements" && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border border-zinc-200", children: /* @__PURE__ */ jsxs("div", { className: "min-w-[640px] overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[88px_120px_minmax(0,1fr)_88px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500", children: [
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3", children: "SI NO." }),
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3 text-center", children: "Image" }),
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3", children: "Title" }),
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3 text-center", children: "Delete" })
          ] }),
          content.achievements.map((item, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "grid min-h-14 grid-cols-[88px_120px_minmax(0,1fr)_88px] border-b border-zinc-200 last:border-b-0",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center px-5 py-3 text-sm text-zinc-500", children: index + 1 }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center px-5 py-3", children: /* @__PURE__ */ jsx(
                  IconUploadButton,
                  {
                    accept: ".jpeg,.jpg,.png,.webp,.svg",
                    assetFolder: "achievements",
                    currentUrl: item.image_url,
                    onUploaded: (url) => setContent((previous) => ({
                      ...previous,
                      achievements: previous.achievements.map(
                        (entry, entryIndex) => entryIndex === index ? { ...entry, image_url: url } : entry
                      )
                    }))
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center px-5 py-3", children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: homepageValueInputClass,
                    maxLength: achievementTitleMaxLength,
                    value: item.title,
                    onChange: (event) => setContent((previous) => ({
                      ...previous,
                      achievements: previous.achievements.map(
                        (entry, entryIndex) => entryIndex === index ? { ...entry, title: event.target.value.slice(0, achievementTitleMaxLength) } : entry
                      )
                    }))
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center px-5 py-3", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    "aria-label": `Delete ${item.title || "achievement"}`,
                    className: "grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black",
                    onClick: () => {
                      setContent((previous) => ({
                        ...previous,
                        achievements: previous.achievements.filter((entry) => entry.id !== item.id)
                      }));
                      void deleteRow("achievements", item.id);
                    },
                    type: "button",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                ) })
              ]
            },
            item.id
          ))
        ] }) }),
        tab === "about" && aboutSection === "activities" && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border border-zinc-200", children: /* @__PURE__ */ jsxs("div", { className: "min-w-[640px] overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[88px_120px_minmax(0,1fr)_88px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500", children: [
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3", children: "SI NO." }),
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3 text-center", children: "Image" }),
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3", children: "Title" }),
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3 text-center", children: "Delete" })
          ] }),
          content.activities.map((item, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "grid min-h-14 grid-cols-[88px_120px_minmax(0,1fr)_88px] border-b border-zinc-200 last:border-b-0",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center px-5 py-3 text-sm text-zinc-500", children: index + 1 }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center px-5 py-3", children: /* @__PURE__ */ jsx(
                  IconUploadButton,
                  {
                    accept: ".jpeg,.jpg,.png,.webp,.gif",
                    assetFolder: "activities",
                    currentUrl: item.image_url,
                    onUploaded: (url) => setContent((previous) => ({
                      ...previous,
                      activities: previous.activities.map(
                        (entry, entryIndex) => entryIndex === index ? { ...entry, image_url: url } : entry
                      )
                    }))
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center px-5 py-3", children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: homepageValueInputClass,
                    maxLength: activityTitleMaxLength,
                    value: item.title,
                    onChange: (event) => setContent((previous) => ({
                      ...previous,
                      activities: previous.activities.map(
                        (entry, entryIndex) => entryIndex === index ? { ...entry, title: event.target.value.slice(0, activityTitleMaxLength) } : entry
                      )
                    }))
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center px-5 py-3", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    "aria-label": `Delete ${item.title || "activity"}`,
                    className: "grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black",
                    onClick: () => {
                      setContent((previous) => ({
                        ...previous,
                        activities: previous.activities.filter((entry) => entry.id !== item.id)
                      }));
                      void deleteRow("activities", item.id);
                    },
                    type: "button",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                ) })
              ]
            },
            item.id
          ))
        ] }) })
      ] }) })
    ] })
  ] });
}
function CrudList({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "space-y-4", children });
}
function AdminFieldRow({ label, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "grid border-b border-zinc-200 last:border-b-0 md:grid-cols-[220px_minmax(0,1fr)]", children: [
    /* @__PURE__ */ jsx(Label, { className: "flex min-h-14 items-center border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 md:border-b-0 md:border-r", children: label }),
    /* @__PURE__ */ jsx("div", { className: "flex min-h-14 items-center px-4 py-3", children })
  ] });
}
function ProjectsTable({
  items,
  onEdit,
  onDelete
}) {
  return /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-md border border-zinc-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[88px_120px_minmax(0,1.25fr)_minmax(0,1fr)_112px_104px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500", children: [
      /* @__PURE__ */ jsx("div", { className: "px-5 py-3", children: "SI NO." }),
      /* @__PURE__ */ jsx("div", { className: "px-5 py-3 text-center", children: "Icon" }),
      /* @__PURE__ */ jsx("div", { className: "px-5 py-3", children: "Project" }),
      /* @__PURE__ */ jsx("div", { className: "px-5 py-3", children: "Website" }),
      /* @__PURE__ */ jsx("div", { className: "px-5 py-3 text-center", children: "Edit" }),
      /* @__PURE__ */ jsx("div", { className: "px-5 py-3 text-center", children: "Delete" })
    ] }),
    items.length ? items.map((item, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "grid min-h-14 grid-cols-[88px_120px_minmax(0,1.25fr)_minmax(0,1fr)_112px_104px] border-b border-zinc-200 last:border-b-0",
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center px-5 py-3 text-sm text-zinc-500", children: index + 1 }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center px-5 py-3", children: /* @__PURE__ */ jsx("div", { "aria-label": item.image_url ? `${item.title || "Project"} cover image` : "No cover image", className: "flex h-10 w-10 items-center justify-center overflow-hidden rounded-md text-zinc-400", title: "Edit cover image from the project editor", children: item.image_url ? /* @__PURE__ */ jsx("img", { alt: "", className: "h-8 w-8 rounded object-cover", src: item.image_url }) : /* @__PURE__ */ jsx(ImagePlus, { className: "h-5 w-5" }) }) }),
          /* @__PURE__ */ jsx("div", { className: "flex min-w-0 items-center px-5 py-3", children: /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-zinc-950", children: item.title || "Untitled project" }) }),
          /* @__PURE__ */ jsx("div", { className: "flex min-w-0 items-center px-5 py-3", children: item.project_url ? /* @__PURE__ */ jsxs(
            "a",
            {
              className: "inline-flex min-w-0 items-center gap-2 text-sm text-zinc-600 transition hover:text-black",
              href: item.project_url,
              rel: "noreferrer",
              target: "_blank",
              children: [
                /* @__PURE__ */ jsx("span", { className: "truncate", children: item.project_url }),
                /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5 shrink-0" })
              ]
            }
          ) : /* @__PURE__ */ jsx("span", { className: "text-sm text-zinc-400", children: "Not added" }) }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center px-5 py-3", children: /* @__PURE__ */ jsx(
            "button",
            {
              "aria-label": `Edit ${item.title || "project"}`,
              className: "grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black",
              onClick: () => onEdit(item),
              type: "button",
              children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center px-5 py-3", children: /* @__PURE__ */ jsx(
            "button",
            {
              "aria-label": `Delete ${item.title || "project"}`,
              className: "grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black",
              onClick: () => onDelete(item),
              type: "button",
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
            }
          ) })
        ]
      },
      item.id
    )) : /* @__PURE__ */ jsx("div", { className: "px-4 py-8 text-center text-sm text-zinc-500", children: "No projects added." })
  ] });
}
function ProjectEditor({
  item,
  onBack,
  onChange,
  onDelete
}) {
  const [newTech, setNewTech] = useState("");
  const screenshotUrls = (item.screenshot_urls ?? []).slice(0, projectAdditionalImageMaxCount);
  const canUploadMoreImages = screenshotUrls.length < projectAdditionalImageMaxCount;
  const addTech = () => {
    const nextTech = newTech.trim();
    if (!nextTech || item.stack.includes(nextTech)) {
      setNewTech("");
      return;
    }
    onChange({ ...item, stack: [...item.stack, nextTech] });
    setNewTech("");
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs(Button, { className: secondaryActionClass, onClick: onBack, type: "button", variant: "secondary", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        "Projects"
      ] }),
      /* @__PURE__ */ jsxs(Button, { className: destructiveActionClass, onClick: onDelete, type: "button", variant: "secondary", children: [
        /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
        "Delete Project"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          "aria-label": "Project title",
          className: "!h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-0 !text-3xl !font-medium !shadow-none focus:!border-0 focus:!ring-0",
          placeholder: "Project title",
          value: item.title,
          onChange: (event) => onChange({ ...item, title: event.target.value })
        }
      ),
      /* @__PURE__ */ jsx(
        Input,
        {
          "aria-label": "Project website",
          className: "!h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-0 !text-base !shadow-none focus:!border-0 focus:!ring-0",
          placeholder: "Project URL",
          value: item.project_url,
          onChange: (event) => onChange({ ...item, project_url: event.target.value })
        }
      ),
      /* @__PURE__ */ jsx(
        ProjectStackEditor,
        {
          newTech,
          onAdd: addTech,
          onNewTechChange: setNewTech,
          onRemove: (tech) => onChange({ ...item, stack: item.stack.filter((entry) => entry !== tech) }),
          stack: item.stack
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        Textarea,
        {
          className: "!min-h-32 resize-none",
          maxLength: projectDescriptionMaxLength,
          placeholder: "Project description",
          value: item.description.slice(0, projectDescriptionMaxLength),
          onChange: (event) => onChange({ ...item, description: event.target.value.slice(0, projectDescriptionMaxLength) })
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-zinc-500", children: [
        projectDescriptionMaxLength - item.description.slice(0, projectDescriptionMaxLength).length,
        " characters remaining"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 xl:grid-cols-[180px_minmax(0,1fr)]", children: [
      /* @__PURE__ */ jsx(
        ProjectImageTile,
        {
          currentUrl: item.image_url,
          label: "Cover image",
          onRemove: () => onChange({ ...item, image_url: "" }),
          onUploaded: (url) => onChange({ ...item, image_url: url })
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsx(Label, { children: "Images" }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-zinc-500", children: [
            screenshotUrls.length,
            "/",
            projectAdditionalImageMaxCount
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4", children: [
          screenshotUrls.map((url, index) => /* @__PURE__ */ jsx(
            ProjectImageTile,
            {
              currentUrl: url,
              label: `Image ${index + 1}`,
              onRemove: () => onChange({
                ...item,
                screenshot_urls: screenshotUrls.filter((_, screenshotIndex) => screenshotIndex !== index)
              }),
              onUploaded: (nextUrl) => onChange({
                ...item,
                screenshot_urls: screenshotUrls.map((entry, screenshotIndex) => screenshotIndex === index ? nextUrl : entry)
              })
            },
            `${url}-${index}`
          )),
          canUploadMoreImages ? /* @__PURE__ */ jsx(
            ProjectImageTile,
            {
              currentUrl: "",
              label: "Add image",
              onUploaded: (url) => onChange({
                ...item,
                screenshot_urls: appendUniqueUrl(screenshotUrls, url).slice(0, projectAdditionalImageMaxCount)
              })
            }
          ) : null
        ] })
      ] })
    ] })
  ] });
}
function ProjectStackEditor({
  stack,
  newTech,
  onNewTechChange,
  onAdd,
  onRemove
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    stack.map((tech) => /* @__PURE__ */ jsxs(
      "button",
      {
        className: "group inline-flex h-8 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 transition hover:border-zinc-400 hover:text-black",
        onClick: () => onRemove(tech),
        type: "button",
        children: [
          tech,
          /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5 text-zinc-400 group-hover:text-black" })
        ]
      },
      tech
    )),
    /* @__PURE__ */ jsx(
      Input,
      {
        "aria-label": "Add technology",
        className: "!h-8 !w-36",
        placeholder: "Add tech",
        value: newTech,
        onChange: (event) => onNewTechChange(event.target.value),
        onKeyDown: (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onAdd();
          }
        }
      }
    ),
    /* @__PURE__ */ jsxs(Button, { className: secondaryActionClass, onClick: onAdd, type: "button", variant: "secondary", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
      "Add"
    ] })
  ] });
}
function ProjectImageTile({
  label,
  currentUrl,
  onUploaded,
  onRemove
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-zinc-200 bg-white p-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium text-zinc-600", children: label }),
      currentUrl && onRemove ? /* @__PURE__ */ jsx(
        "button",
        {
          "aria-label": `Remove ${label}`,
          className: "grid h-7 w-7 place-items-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-black",
          onClick: onRemove,
          type: "button",
          children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
        }
      ) : null
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid aspect-[4/3] place-items-center overflow-hidden rounded-sm bg-zinc-50", children: currentUrl ? /* @__PURE__ */ jsx("img", { alt: "", className: "h-full w-full object-cover", src: currentUrl }) : /* @__PURE__ */ jsx(ImagePlus, { className: "h-8 w-8 text-zinc-300" }) }),
    /* @__PURE__ */ jsx(ProjectImageUploadButton, { currentUrl, onUploaded })
  ] });
}
function ProjectImageUploadButton({
  currentUrl,
  onUploaded
}) {
  const [uploading, setUploading] = useState(false);
  return /* @__PURE__ */ jsxs("label", { className: "mt-2 inline-flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-800 transition hover:border-zinc-500 hover:bg-zinc-50", children: [
    uploading ? /* @__PURE__ */ jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5" }),
    currentUrl ? "Replace" : "Upload",
    /* @__PURE__ */ jsx(
      "input",
      {
        accept: ".jpeg,.jpg,.png,.webp,.avif,.gif",
        className: "hidden",
        onChange: async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", "projects");
          formData.append("currentUrl", currentUrl);
          setUploading(true);
          try {
            const payload = await parseResponse(
              await fetch("/api/admin/upload", {
                method: "POST",
                body: formData
              })
            );
            onUploaded(payload.url);
          } finally {
            setUploading(false);
          }
        },
        type: "file"
      }
    )
  ] });
}
function ExperienceTable({
  items,
  onEdit,
  onDelete
}) {
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border border-zinc-200", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[680px] border-collapse text-left", children: [
    /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500", children: /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsx("th", { className: "border-b border-zinc-200 px-4 py-3", children: "Role" }),
      /* @__PURE__ */ jsx("th", { className: "border-b border-zinc-200 px-4 py-3", children: "Company" }),
      /* @__PURE__ */ jsx("th", { className: "border-b border-zinc-200 px-4 py-3", children: "Duration" }),
      /* @__PURE__ */ jsx("th", { className: "w-24 border-b border-zinc-200 px-4 py-3 text-center", children: "Edit" }),
      /* @__PURE__ */ jsx("th", { className: "w-24 border-b border-zinc-200 px-4 py-3 text-center", children: "Delete" })
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { className: "text-sm text-zinc-700", children: items.length ? items.map((item) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-zinc-200 last:border-b-0", children: [
      /* @__PURE__ */ jsx("td", { className: "max-w-[240px] px-4 py-4 font-medium text-zinc-950", children: item.role || "Untitled role" }),
      /* @__PURE__ */ jsx("td", { className: "max-w-[240px] px-4 py-4", children: item.company || "No company" }),
      /* @__PURE__ */ jsx("td", { className: "max-w-[200px] px-4 py-4", children: item.duration || "No duration" }),
      /* @__PURE__ */ jsx("td", { className: "px-4 py-4 text-center", children: /* @__PURE__ */ jsx(
        Button,
        {
          "aria-label": `Edit ${item.role || "experience"}`,
          className: "!h-8 !w-8 !rounded-md !p-0 !text-zinc-700",
          onClick: () => onEdit(item),
          title: "Edit experience",
          type: "button",
          variant: "secondary",
          children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
        }
      ) }),
      /* @__PURE__ */ jsx("td", { className: "px-4 py-4 text-center", children: /* @__PURE__ */ jsx(
        Button,
        {
          "aria-label": `Delete ${item.role || "experience"}`,
          className: "!h-8 !w-8 !rounded-md !border-red-200 !p-0 !text-red-600 hover:!border-red-600 hover:!bg-red-50",
          onClick: () => onDelete(item),
          title: "Delete experience",
          type: "button",
          variant: "secondary",
          children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
        }
      ) })
    ] }, item.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { className: "px-4 py-8 text-center text-sm text-zinc-500", colSpan: 5, children: "No experience entries yet." }) }) })
  ] }) });
}
function ExperienceEditor({
  item,
  onChange,
  onBack,
  onDelete
}) {
  const visibleDescription = item.description.slice(0, experienceDescriptionMaxLength);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs(Button, { className: secondaryActionClass, onClick: onBack, type: "button", variant: "secondary", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        "Experience"
      ] }),
      /* @__PURE__ */ jsxs(Button, { className: destructiveActionClass, onClick: onDelete, type: "button", variant: "secondary", children: [
        /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
        "Delete Experience"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "experience-role", children: "Role" }),
          /* @__PURE__ */ jsx(Input, { id: "experience-role", value: item.role, onChange: (event) => onChange({ ...item, role: event.target.value }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "experience-company", children: "Company" }),
          /* @__PURE__ */ jsx(Input, { id: "experience-company", value: item.company, onChange: (event) => onChange({ ...item, company: event.target.value }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "experience-duration", children: "Duration" }),
          /* @__PURE__ */ jsx(Input, { id: "experience-duration", value: item.duration, onChange: (event) => onChange({ ...item, duration: event.target.value }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-1 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "experience-description", children: "Description" }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-zinc-500", children: [
            visibleDescription.length,
            "/",
            experienceDescriptionMaxLength
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "experience-description",
            maxLength: experienceDescriptionMaxLength,
            value: visibleDescription,
            onChange: (event) => onChange({ ...item, description: event.target.value.slice(0, experienceDescriptionMaxLength) })
          }
        )
      ] })
    ] })
  ] });
}
function IconUploadButton({
  currentUrl,
  onUploaded,
  assetFolder,
  accept
}) {
  const [uploading, setUploading] = useState(false);
  return /* @__PURE__ */ jsxs(
    "label",
    {
      className: cn(
        "relative inline-flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-black",
        currentUrl ? "text-zinc-950" : ""
      ),
      title: currentUrl ? "Replace icon image" : "Upload icon image",
      children: [
        uploading ? /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : currentUrl ? /* @__PURE__ */ jsx("img", { alt: "", className: "h-8 w-8 rounded object-cover", src: currentUrl }) : /* @__PURE__ */ jsx(ImagePlus, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            accept,
            className: "hidden",
            onChange: async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.append("file", file);
              formData.append("folder", assetFolder);
              formData.append("currentUrl", currentUrl);
              setUploading(true);
              try {
                const payload = await parseResponse(
                  await fetch("/api/admin/upload", {
                    method: "POST",
                    body: formData
                  })
                );
                onUploaded(payload.url);
              } finally {
                setUploading(false);
              }
            },
            type: "file"
          }
        )
      ]
    }
  );
}
function AssetUpload({
  value,
  onUploaded,
  assetFolder,
  accept,
  displayValue,
  helperText,
  inputClassName,
  requireSquareImage = false
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadComplete, setUploadComplete] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const isResume = assetFolder === "resume";
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 md:flex-row", children: [
      isResume && value ? /* @__PURE__ */ jsx(
        "button",
        {
          "aria-label": "Preview resume",
          className: "inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-900 transition hover:border-zinc-500 hover:bg-zinc-50",
          onClick: () => setPreviewOpen(true),
          title: "Preview resume",
          type: "button",
          children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
        }
      ) : /* @__PURE__ */ jsx(Input, { className: inputClassName, readOnly: true, value: displayValue ?? value, placeholder: "Upload asset to Supabase Storage" }),
      /* @__PURE__ */ jsxs("label", { className: "inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-500 hover:bg-zinc-50", children: [
        uploading ? /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : uploadComplete ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-emerald-600" }) : /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
        "Upload File",
        /* @__PURE__ */ jsx(
          "input",
          {
            accept,
            className: "hidden",
            onChange: async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setUploadError("");
              setUploadComplete(false);
              if (requireSquareImage) {
                const square = await isSquareImage(file);
                if (!square) {
                  setUploadError("Please upload a square 1:1 image.");
                  event.target.value = "";
                  return;
                }
              }
              const formData = new FormData();
              formData.append("file", file);
              formData.append("folder", assetFolder);
              formData.append("currentUrl", value);
              setUploading(true);
              try {
                const payload = await parseResponse(
                  await fetch("/api/admin/upload", {
                    method: "POST",
                    body: formData
                  })
                );
                onUploaded(payload.url);
                setUploadComplete(true);
              } catch (error) {
                setUploadError(error instanceof Error ? error.message : "Upload failed.");
              } finally {
                setUploading(false);
                event.target.value = "";
              }
            },
            type: "file"
          }
        )
      ] })
    ] }),
    isResume && previewOpen ? /* @__PURE__ */ jsx("div", { "aria-labelledby": "resume-preview-title", "aria-modal": "true", className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", role: "dialog", children: /* @__PURE__ */ jsxs("div", { className: "flex h-[min(90vh,900px)] w-full max-w-4xl flex-col overflow-hidden rounded-md bg-white shadow-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-zinc-200 px-4 py-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-zinc-950", id: "resume-preview-title", children: "Resume preview" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            "aria-label": "Close resume preview",
            className: "grid h-8 w-8 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950",
            onClick: () => setPreviewOpen(false),
            title: "Close preview",
            type: "button",
            children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("iframe", { className: "min-h-0 flex-1", src: value, title: "Resume PDF preview" })
    ] }) }) : null,
    helperText || uploadError ? /* @__PURE__ */ jsx("p", { className: cn("mt-2 text-xs", uploadError ? "text-red-600" : "text-zinc-500"), children: uploadError || helperText }) : null
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const user = await getAdminUserFromRequest(Astro2.request);
  const initialContent = user ? await fetchPortfolioContent(true) : null;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Admin | Murshida P." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-white text-zinc-950"> ${renderComponent($$result2, "AdminApp", AdminApp, { "client:load": true, "authenticated": Boolean(user), "initialContent": initialContent, "client:component-hydration": "load", "client:component-path": "@/components/admin/AdminApp", "client:component-export": "AdminApp" })} </main> ` })}`;
}, "C:/Murshida/Career/portfolio/src/pages/admin/index.astro", void 0);

const $$file = "C:/Murshida/Career/portfolio/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
