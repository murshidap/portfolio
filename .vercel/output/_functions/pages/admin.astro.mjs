import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from '../chunks/astro/server_4Yw_W1_G.mjs';
import 'piccolore';
import { jsx, jsxs } from 'react/jsx-runtime';
import { LogOut, Save, LoaderCircle, Upload, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { c as cn, d as defaultContent, B as Button, C as Card, f as fetchPortfolioContent, $ as $$BaseLayout } from '../chunks/BaseLayout__YDfVSjE.mjs';
import { g as getAdminUserFromRequest } from '../chunks/auth_BMTa4l8E.mjs';
export { renderers } from '../renderers.mjs';

const Input = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "input",
    {
      ref,
      className: cn(
        "flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-black focus:ring-1 focus:ring-black disabled:bg-zinc-100",
        className
      ),
      ...props
    }
  )
);
Input.displayName = "Input";

function Label({ className, ...props }) {
  return /* @__PURE__ */ jsx("label", { className: cn("mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-zinc-600", className), ...props });
}

const Textarea = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "textarea",
  {
    ref,
    className: cn(
      "min-h-[110px] w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-black focus:ring-1 focus:ring-black",
      className
    ),
    ...props
  }
));
Textarea.displayName = "Textarea";

const tabs = [
  { key: "intro", label: "Intro" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "certificates", label: "Certificates" },
  { key: "education", label: "Education" }
];
const createId = () => crypto.randomUUID();
function parseUrlList(value) {
  return value.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);
}
function appendUniqueUrl(urls, url) {
  return Array.from(new Set([...urls ?? [], url].map((item) => item.trim()).filter(Boolean)));
}
const primaryActionClass = "!h-9 !rounded-md !border-black !bg-black !px-3 !text-sm !font-medium !normal-case !tracking-normal !text-white !shadow-none hover:!scale-100 hover:!bg-zinc-800";
const secondaryActionClass = "!h-9 !rounded-md !border-zinc-300 !bg-white !px-3 !text-sm !font-medium !normal-case !tracking-normal !text-zinc-900 !shadow-none hover:!scale-100 hover:!border-zinc-500 hover:!bg-zinc-50";
const destructiveActionClass = "!h-9 !rounded-md !border-zinc-300 !bg-white !px-3 !text-sm !font-medium !normal-case !tracking-normal !text-zinc-700 !shadow-none hover:!scale-100 hover:!border-zinc-900 hover:!bg-zinc-50 hover:!text-black";
const panelClass = "!rounded-md !border-zinc-200 !bg-white !shadow-none !backdrop-blur-none";
function SectionHeader({ title, description }) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold tracking-tight text-zinc-950", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: description })
  ] });
}
async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }
  return payload;
}
function AdminApp({ authenticated, initialContent }) {
  const [tab, setTab] = useState("intro");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(authenticated);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState(initialContent ?? defaultContent);
  const saveIntro = async () => {
    setSaving(true);
    setMessage("");
    try {
      await parseResponse(
        await fetch("/api/admin/intro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(content.intro)
        })
      );
      setMessage("Intro updated.");
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
      await parseResponse(
        await fetch("/api/admin/collection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table, rows })
        })
      );
      setMessage(`${table} updated.`);
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
    intro: 1,
    projects: content.projects.length,
    experience: content.experience.length,
    certificates: content.certificates.length,
    education: content.education.length
  };
  const activeTab = tabs.find((item) => item.key === tab) ?? tabs[0];
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
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight text-zinc-950", children: activeTab.label }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Manage portfolio content and assets." })
        ] }),
        message ? /* @__PURE__ */ jsx("p", { className: "max-w-sm truncate rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700", children: message }) : null
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-[1280px] px-8 py-7", children: /* @__PURE__ */ jsxs(Card, { className: cn(panelClass, "p-5 md:p-6"), children: [
        tab === "intro" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            SectionHeader,
            {
              description: "Update the content used in the home view. The profile picture stays fixed in code, but resume and social details are editable here.",
              title: "Intro"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Name" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: content.intro.name,
                  onChange: (event) => setContent((previous) => ({ ...previous, intro: { ...previous.intro, name: event.target.value } }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Role" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: content.intro.role,
                  onChange: (event) => setContent((previous) => ({ ...previous, intro: { ...previous.intro, role: event.target.value } }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Skills" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: content.intro.skills.join(", "),
                  onChange: (event) => setContent((previous) => ({
                    ...previous,
                    intro: {
                      ...previous.intro,
                      skills: event.target.value.split(",").map((skill) => skill.trim()).filter(Boolean)
                    }
                  }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Intro Text" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  value: content.intro.intro,
                  onChange: (event) => setContent((previous) => ({ ...previous, intro: { ...previous.intro, intro: event.target.value } }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "GitHub URL" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: content.intro.github_url,
                  onChange: (event) => setContent((previous) => ({
                    ...previous,
                    intro: { ...previous.intro, github_url: event.target.value }
                  }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "LinkedIn URL" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: content.intro.linkedin_url,
                  onChange: (event) => setContent((previous) => ({
                    ...previous,
                    intro: { ...previous.intro, linkedin_url: event.target.value }
                  }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Phone Number" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: content.intro.phone,
                  onChange: (event) => setContent((previous) => ({ ...previous, intro: { ...previous.intro, phone: event.target.value } }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Email" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: content.intro.email,
                  onChange: (event) => setContent((previous) => ({ ...previous, intro: { ...previous.intro, email: event.target.value } }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Resume PDF" }),
              /* @__PURE__ */ jsx(
                AssetUpload,
                {
                  accept: "application/pdf",
                  assetFolder: "resume",
                  onUploaded: (url) => setContent((previous) => ({
                    ...previous,
                    intro: { ...previous.intro, resume_url: url }
                  })),
                  value: content.intro.resume_url
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 flex items-center gap-4", children: /* @__PURE__ */ jsxs(Button, { className: primaryActionClass, onClick: saveIntro, type: "button", children: [
            /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
            "Save Intro"
          ] }) })
        ] }),
        tab === "projects" && /* @__PURE__ */ jsx(CrudList, { addLabel: "Add Project", description: "Manage project cards shown in the user panel.", onAdd: () => setContent((previous) => ({
          ...previous,
          projects: [
            { id: createId(), title: "", subtitle: "", description: "", stack: [], project_url: "", image_url: "", screenshot_urls: [] },
            ...previous.projects
          ]
        })), onSave: () => saveList("projects", content.projects), title: "Projects", children: content.projects.map((item, index) => /* @__PURE__ */ jsx(
          ProjectEditor,
          {
            item,
            onDelete: () => {
              setContent((previous) => ({
                ...previous,
                projects: previous.projects.filter((project) => project.id !== item.id)
              }));
              void deleteRow("projects", item.id);
            },
            onChange: (next) => setContent((previous) => ({
              ...previous,
              projects: previous.projects.map((project, projectIndex) => projectIndex === index ? next : project)
            }))
          },
          item.id
        )) }),
        tab === "experience" && /* @__PURE__ */ jsx(CrudList, { addLabel: "Add Experience", description: "Manage experience entries shown in the user panel.", onAdd: () => setContent((previous) => ({
          ...previous,
          experience: [{ id: createId(), company: "", role: "", duration: "", description: "" }, ...previous.experience]
        })), onSave: () => saveList("experience", content.experience), title: "Experience", children: content.experience.map((item, index) => /* @__PURE__ */ jsx(
          SimpleEditor,
          {
            fields: [
              ["Role", item.role, (value) => ({ ...item, role: value })],
              ["Company", item.company, (value) => ({ ...item, company: value })],
              ["Duration", item.duration, (value) => ({ ...item, duration: value })]
            ],
            onBodyChange: (value) => setContent((previous) => ({
              ...previous,
              experience: previous.experience.map(
                (entry, entryIndex) => entryIndex === index ? { ...item, description: value } : entry
              )
            })),
            onDelete: () => {
              setContent((previous) => ({
                ...previous,
                experience: previous.experience.filter((entry) => entry.id !== item.id)
              }));
              void deleteRow("experience", item.id);
            },
            onFieldUpdate: (next) => setContent((previous) => ({
              ...previous,
              experience: previous.experience.map((entry, entryIndex) => entryIndex === index ? next : entry)
            })),
            textValue: item.description
          },
          item.id
        )) }),
        tab === "certificates" && /* @__PURE__ */ jsx(CrudList, { addLabel: "Add Certificate", description: "Manage certificates and certificate assets.", onAdd: () => setContent((previous) => ({
          ...previous,
          certificates: [{ id: createId(), title: "", issuer: "", year: "", asset_url: "" }, ...previous.certificates]
        })), onSave: () => saveList("certificates", content.certificates), title: "Certificates", children: content.certificates.map((item, index) => /* @__PURE__ */ jsx(
          AssetEditor,
          {
            assetFolder: "certificates",
            item,
            onChange: (next) => setContent((previous) => ({
              ...previous,
              certificates: previous.certificates.map((entry, entryIndex) => entryIndex === index ? next : entry)
            })),
            onDelete: () => {
              setContent((previous) => ({
                ...previous,
                certificates: previous.certificates.filter((entry) => entry.id !== item.id)
              }));
              void deleteRow("certificates", item.id);
            }
          },
          item.id
        )) }),
        tab === "education" && /* @__PURE__ */ jsx(CrudList, { addLabel: "Add Education", description: "Manage academic background content.", onAdd: () => setContent((previous) => ({
          ...previous,
          education: [{ id: createId(), institution: "", degree: "", duration: "", description: "" }, ...previous.education]
        })), onSave: () => saveList("education", content.education), title: "Education", children: content.education.map((item, index) => /* @__PURE__ */ jsx(
          SimpleEditor,
          {
            fields: [
              ["Degree", item.degree, (value) => ({ ...item, degree: value })],
              ["Institution", item.institution, (value) => ({ ...item, institution: value })],
              ["Duration", item.duration, (value) => ({ ...item, duration: value })]
            ],
            onBodyChange: (value) => setContent((previous) => ({
              ...previous,
              education: previous.education.map(
                (entry, entryIndex) => entryIndex === index ? { ...item, description: value } : entry
              )
            })),
            onDelete: () => {
              setContent((previous) => ({
                ...previous,
                education: previous.education.filter((entry) => entry.id !== item.id)
              }));
              void deleteRow("education", item.id);
            },
            onFieldUpdate: (next) => setContent((previous) => ({
              ...previous,
              education: previous.education.map((entry, entryIndex) => entryIndex === index ? next : entry)
            })),
            textValue: item.description
          },
          item.id
        )) })
      ] }) })
    ] })
  ] });
}
function CrudList({
  title,
  description,
  addLabel,
  onAdd,
  onSave,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsx(SectionHeader, { title, description }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxs(Button, { className: secondaryActionClass, onClick: onAdd, type: "button", variant: "secondary", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          addLabel
        ] }),
        /* @__PURE__ */ jsxs(Button, { className: primaryActionClass, onClick: onSave, type: "button", children: [
          /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
          "Save Changes"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children })
  ] });
}
function ProjectEditor({
  item,
  onChange,
  onDelete
}) {
  return /* @__PURE__ */ jsxs(Card, { className: cn(panelClass, "p-4"), children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Title" }),
        /* @__PURE__ */ jsx(Input, { value: item.title, onChange: (event) => onChange({ ...item, title: event.target.value }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Subtitle" }),
        /* @__PURE__ */ jsx(Input, { value: item.subtitle, onChange: (event) => onChange({ ...item, subtitle: event.target.value }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsx(Textarea, { value: item.description, onChange: (event) => onChange({ ...item, description: event.target.value }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Stack" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            value: item.stack.join(", "),
            onChange: (event) => onChange({
              ...item,
              stack: event.target.value.split(",").map((value) => value.trim()).filter(Boolean)
            })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Project URL" }),
        /* @__PURE__ */ jsx(Input, { value: item.project_url, onChange: (event) => onChange({ ...item, project_url: event.target.value }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Cover Screenshot URL" }),
        /* @__PURE__ */ jsx(
          AssetUpload,
          {
            accept: ".jpeg,.jpg,.png,.webp,.svg",
            assetFolder: "projects",
            onUploaded: (url) => onChange({ ...item, image_url: url }),
            value: item.image_url
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Additional Screenshot URLs" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            placeholder: "Paste one screenshot URL per line",
            value: (item.screenshot_urls ?? []).join("\n"),
            onChange: (event) => onChange({ ...item, screenshot_urls: parseUrlList(event.target.value) })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(
          AssetUpload,
          {
            accept: ".jpeg,.jpg,.png,.webp,.svg",
            assetFolder: "projects",
            onUploaded: (url) => onChange({ ...item, screenshot_urls: appendUniqueUrl(item.screenshot_urls, url) }),
            value: ""
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxs(Button, { className: destructiveActionClass, onClick: onDelete, type: "button", variant: "secondary", children: [
      /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
      "Delete"
    ] }) })
  ] });
}
function SimpleEditor({
  fields,
  onFieldUpdate,
  onBodyChange,
  textValue,
  onDelete
}) {
  return /* @__PURE__ */ jsxs(Card, { className: cn(panelClass, "p-4"), children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
      fields.map(([label, value, factory]) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: label }),
        /* @__PURE__ */ jsx(Input, { value, onChange: (event) => onFieldUpdate(factory(event.target.value)) })
      ] }, label)),
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-3", children: [
        /* @__PURE__ */ jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsx(Textarea, { value: textValue, onChange: (event) => onBodyChange(event.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxs(Button, { className: destructiveActionClass, onClick: onDelete, type: "button", variant: "secondary", children: [
      /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
      "Delete"
    ] }) })
  ] });
}
function AssetEditor({
  item,
  onChange,
  onDelete,
  assetFolder
}) {
  return /* @__PURE__ */ jsxs(Card, { className: cn(panelClass, "p-4"), children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Title" }),
        /* @__PURE__ */ jsx(Input, { value: item.title, onChange: (event) => onChange({ ...item, title: event.target.value }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Issuer" }),
        /* @__PURE__ */ jsx(Input, { value: item.issuer, onChange: (event) => onChange({ ...item, issuer: event.target.value }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Year" }),
        /* @__PURE__ */ jsx(Input, { value: item.year, onChange: (event) => onChange({ ...item, year: event.target.value }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-3", children: [
        /* @__PURE__ */ jsx(Label, { children: "Certificate Asset" }),
        /* @__PURE__ */ jsx(
          AssetUpload,
          {
            accept: ".jpeg,.jpg,.png,.svg",
            assetFolder,
            onUploaded: (url) => onChange({ ...item, asset_url: url }),
            value: item.asset_url
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxs(Button, { className: destructiveActionClass, onClick: onDelete, type: "button", variant: "secondary", children: [
      /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
      "Delete"
    ] }) })
  ] });
}
function AssetUpload({
  value,
  onUploaded,
  assetFolder,
  accept
}) {
  const [uploading, setUploading] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 md:flex-row", children: [
    /* @__PURE__ */ jsx(Input, { readOnly: true, value, placeholder: "Upload asset to Supabase Storage" }),
    /* @__PURE__ */ jsxs("label", { className: "inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-500 hover:bg-zinc-50", children: [
      uploading ? /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
      "Upload File",
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
    ] })
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
