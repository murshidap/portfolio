import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from '../chunks/astro/server_y1XpGNYX.mjs';
import 'piccolore';
import { jsx, jsxs } from 'react/jsx-runtime';
import { LogOut, Save, LoaderCircle, Upload, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { c as cn, d as defaultContent, B as Button, C as Card, f as fetchPortfolioContent, $ as $$BaseLayout } from '../chunks/BaseLayout_DbZpIjNz.mjs';
import { g as getAdminUserFromRequest } from '../chunks/auth_hH7cwaQS.mjs';
export { renderers } from '../renderers.mjs';

const Input = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "input",
    {
      ref,
      className: cn(
        "flex h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#6a75ff] focus:ring-2 focus:ring-[#6a75ff]/30",
        className
      ),
      ...props
    }
  )
);
Input.displayName = "Input";

function Label({ className, ...props }) {
  return /* @__PURE__ */ jsx("label", { className: cn("mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-white/55", className), ...props });
}

const Textarea = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "textarea",
  {
    ref,
    className: cn(
      "min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#6a75ff] focus:ring-2 focus:ring-[#6a75ff]/30",
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
function SectionHeader({ title, description }) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl text-white", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-white/60", children: description })
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
  const renderLogin = () => /* @__PURE__ */ jsx("div", { className: "mx-auto flex min-h-screen max-w-xl items-center px-5 py-10", children: /* @__PURE__ */ jsxs(Card, { className: "w-full p-8", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.28em] text-[#8690ff]", children: "Admin Access" }),
    /* @__PURE__ */ jsx("h1", { className: "mt-4 font-display text-4xl text-white", children: "Murshida Dashboard" }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm leading-7 text-white/60", children: "Sign in with the configured username and your Supabase password. The dashboard session is protected with a server-side cookie." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "username", children: "Username" }),
        /* @__PURE__ */ jsx(Input, { id: "username", onChange: (event) => setUsername(event.target.value), value: username })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx(Input, { id: "password", onChange: (event) => setPassword(event.target.value), type: "password", value: password })
      ] }),
      /* @__PURE__ */ jsx(Button, { className: "w-full justify-center", onClick: handleLogin, type: "button", children: saving ? /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Login" })
    ] }),
    message ? /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-[#b4baff]", children: message }) : null
  ] }) });
  if (!isLoggedIn) {
    return renderLogin();
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto min-h-screen max-w-7xl px-5 py-8 md:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.28em] text-[#8690ff]", children: "Admin Panel" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-3 font-display text-4xl text-white", children: "Portfolio Content Dashboard" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-white/60", children: "Authenticated with an HttpOnly cookie-backed SSR session." })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: handleLogout, type: "button", variant: "secondary", children: [
        /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
        "Logout"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-8 flex flex-wrap gap-3", children: tabs.map((item) => /* @__PURE__ */ jsx(
      "button",
      {
        className: `rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] transition ${tab === item.key ? "border-[#7d85ff]/60 bg-[#4657ff]/20 text-white" : "border-white/10 bg-white/[0.03] text-white/55 hover:text-white"}`,
        onClick: () => setTab(item.key),
        type: "button",
        children: item.label
      },
      item.key
    )) }),
    /* @__PURE__ */ jsxs(Card, { className: "p-6 md:p-8", children: [
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
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex items-center gap-4", children: [
          /* @__PURE__ */ jsxs(Button, { onClick: saveIntro, type: "button", children: [
            /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
            "Save Intro"
          ] }),
          message ? /* @__PURE__ */ jsx("p", { className: "text-sm text-[#b4baff]", children: message }) : null
        ] })
      ] }),
      tab === "projects" && /* @__PURE__ */ jsx(CrudList, { addLabel: "Add Project", description: "Manage project cards shown in the user panel.", onAdd: () => setContent((previous) => ({
        ...previous,
        projects: [{ id: createId(), title: "", subtitle: "", description: "", stack: [], project_url: "", image_url: "" }, ...previous.projects]
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
        /* @__PURE__ */ jsxs(Button, { onClick: onAdd, type: "button", variant: "secondary", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          addLabel
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: onSave, type: "button", children: [
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
  return /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
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
        /* @__PURE__ */ jsx(Label, { children: "Project Image URL" }),
        /* @__PURE__ */ jsx(
          AssetUpload,
          {
            accept: ".jpeg,.jpg,.png,.svg",
            assetFolder: "projects",
            onUploaded: (url) => onChange({ ...item, image_url: url }),
            value: item.image_url
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxs(Button, { onClick: onDelete, type: "button", variant: "secondary", children: [
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
  return /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
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
    /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxs(Button, { onClick: onDelete, type: "button", variant: "secondary", children: [
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
  return /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
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
    /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxs(Button, { onClick: onDelete, type: "button", variant: "secondary", children: [
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
    /* @__PURE__ */ jsxs("label", { className: "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/75 transition hover:text-white", children: [
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
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Admin | Murshida P." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-[#050818] bg-hero-grid text-white"> <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(88,105,255,0.22),transparent_24%)]"></div> <div class="relative z-10"> ${renderComponent($$result2, "AdminApp", AdminApp, { "client:load": true, "authenticated": Boolean(user), "initialContent": initialContent, "client:component-hydration": "load", "client:component-path": "@/components/admin/AdminApp", "client:component-export": "AdminApp" })} </div> </main> ` })}`;
}, "C:/Murshida/Career/murshida-portfolio/src/pages/admin/index.astro", void 0);

const $$file = "C:/Murshida/Career/murshida-portfolio/src/pages/admin/index.astro";
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
