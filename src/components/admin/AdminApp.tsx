import { LoaderCircle, LogOut, Plus, Save, Trash2, Upload } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { defaultContent } from "@/data/defaultContent";
import { cn } from "@/lib/utils";
import type {
  CertificateItem,
  EducationItem,
  ExperienceItem,
  PortfolioContent,
  ProjectItem
} from "@/types/content";

type TabKey = "intro" | "projects" | "experience" | "certificates" | "education";
type CollectionKey = "projects" | "experience" | "certificates" | "education";

interface AdminAppProps {
  authenticated: boolean;
  initialContent: PortfolioContent | null;
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "intro", label: "Intro" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "certificates", label: "Certificates" },
  { key: "education", label: "Education" }
];

const createId = () => crypto.randomUUID();

function parseUrlList(value: string) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function appendUniqueUrl(urls: string[] | undefined, url: string) {
  return Array.from(new Set([...(urls ?? []), url].map((item) => item.trim()).filter(Boolean)));
}

const primaryActionClass =
  "!h-9 !rounded-md !border-black !bg-black !px-3 !text-sm !font-medium !normal-case !tracking-normal !text-white !shadow-none hover:!scale-100 hover:!bg-zinc-800";
const secondaryActionClass =
  "!h-9 !rounded-md !border-zinc-300 !bg-white !px-3 !text-sm !font-medium !normal-case !tracking-normal !text-zinc-900 !shadow-none hover:!scale-100 hover:!border-zinc-500 hover:!bg-zinc-50";
const destructiveActionClass =
  "!h-9 !rounded-md !border-zinc-300 !bg-white !px-3 !text-sm !font-medium !normal-case !tracking-normal !text-zinc-700 !shadow-none hover:!scale-100 hover:!border-zinc-900 hover:!bg-zinc-50 hover:!text-black";
const panelClass = "!rounded-md !border-zinc-200 !bg-white !shadow-none !backdrop-blur-none";

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">{title}</h2>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
    </div>
  );
}

async function parseResponse(response: Response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }
  return payload;
}

export function AdminApp({ authenticated, initialContent }: AdminAppProps) {
  const [tab, setTab] = useState<TabKey>("intro");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(authenticated);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<PortfolioContent>(initialContent ?? defaultContent);

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

  const saveList = async (table: CollectionKey, rows: object[]) => {
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

  const deleteRow = async (table: CollectionKey, id: string) => {
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

  const renderLogin = () => (
    <div className="flex min-h-screen items-center justify-center bg-white px-5 py-10 text-zinc-950">
      <Card className={cn(panelClass, "w-full max-w-md p-6")}>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Portfolio Admin</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">Use the configured admin credentials to manage portfolio content.</p>
        <div className="mt-8 space-y-5">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" onChange={(event) => setUsername(event.target.value)} value={username} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
          </div>
          <Button className={cn(primaryActionClass, "w-full justify-center")} onClick={handleLogin} type="button">
            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Login"}
          </Button>
        </div>
        {message ? <p className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">{message}</p> : null}
      </Card>
    </div>
  );

  if (!isLoggedIn) {
    return renderLogin();
  }

  const tabCounts: Record<TabKey, string | number> = {
    intro: 1,
    projects: content.projects.length,
    experience: content.experience.length,
    certificates: content.certificates.length,
    education: content.education.length
  };
  const activeTab = tabs.find((item) => item.key === tab) ?? tabs[0];

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-[280px] flex-col border-r border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-5">
          <p className="text-sm font-semibold text-zinc-950">Murshida Portfolio</p>
          <p className="mt-1 text-xs text-zinc-500">Content admin</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Content</p>
          <div className="mt-2 space-y-1">
            {tabs.map((item) => {
              const active = tab === item.key;

              return (
                <button
                  key={item.key}
                  className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md px-3 text-left text-sm font-medium transition",
                    active ? "bg-black text-white" : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                  )}
                  onClick={() => setTab(item.key)}
                  type="button"
                >
                  <span>{item.label}</span>
                  <span className={cn("text-xs", active ? "text-white/70" : "text-zinc-400")}>{tabCounts[item.key]}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-zinc-200 p-3">
          <Button className={cn(secondaryActionClass, "w-full justify-start")} onClick={handleLogout} type="button" variant="secondary">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="min-h-screen pl-[280px]">
        <header className="sticky top-0 z-20 flex h-[82px] items-center justify-between border-b border-zinc-200 bg-white px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">{activeTab.label}</h1>
            <p className="mt-1 text-sm text-zinc-500">Manage portfolio content and assets.</p>
          </div>
          {message ? <p className="max-w-sm truncate rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">{message}</p> : null}
        </header>

        <div className="max-w-[1280px] px-8 py-7">
          <Card className={cn(panelClass, "p-5 md:p-6")}>
        {tab === "intro" && (
          <div>
            <SectionHeader
              description="Update the content used in the home view. The profile picture stays fixed in code, but resume and social details are editable here."
              title="Intro"
            />
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input
                  value={content.intro.name}
                  onChange={(event) =>
                    setContent((previous) => ({ ...previous, intro: { ...previous.intro, name: event.target.value } }))
                  }
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  value={content.intro.role}
                  onChange={(event) =>
                    setContent((previous) => ({ ...previous, intro: { ...previous.intro, role: event.target.value } }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label>Skills</Label>
                <Input
                  value={content.intro.skills.join(", ")}
                  onChange={(event) =>
                    setContent((previous) => ({
                      ...previous,
                      intro: {
                        ...previous.intro,
                        skills: event.target.value
                          .split(",")
                          .map((skill) => skill.trim())
                          .filter(Boolean)
                      }
                    }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label>Intro Text</Label>
                <Textarea
                  value={content.intro.intro}
                  onChange={(event) =>
                    setContent((previous) => ({ ...previous, intro: { ...previous.intro, intro: event.target.value } }))
                  }
                />
              </div>
              <div>
                <Label>GitHub URL</Label>
                <Input
                  value={content.intro.github_url}
                  onChange={(event) =>
                    setContent((previous) => ({
                      ...previous,
                      intro: { ...previous.intro, github_url: event.target.value }
                    }))
                  }
                />
              </div>
              <div>
                <Label>LinkedIn URL</Label>
                <Input
                  value={content.intro.linkedin_url}
                  onChange={(event) =>
                    setContent((previous) => ({
                      ...previous,
                      intro: { ...previous.intro, linkedin_url: event.target.value }
                    }))
                  }
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={content.intro.phone}
                  onChange={(event) =>
                    setContent((previous) => ({ ...previous, intro: { ...previous.intro, phone: event.target.value } }))
                  }
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={content.intro.email}
                  onChange={(event) =>
                    setContent((previous) => ({ ...previous, intro: { ...previous.intro, email: event.target.value } }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label>Resume PDF</Label>
                <AssetUpload
                  accept="application/pdf"
                  assetFolder="resume"
                  onUploaded={(url) =>
                    setContent((previous) => ({
                      ...previous,
                      intro: { ...previous.intro, resume_url: url }
                    }))
                  }
                  value={content.intro.resume_url}
                />
              </div>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <Button className={primaryActionClass} onClick={saveIntro} type="button">
                <Save className="h-4 w-4" />
                Save Intro
              </Button>
            </div>
          </div>
        )}

        {tab === "projects" && (
          <CrudList addLabel="Add Project" description="Manage project cards shown in the user panel." onAdd={() =>
            setContent((previous) => ({
              ...previous,
              projects: [
                { id: createId(), title: "", subtitle: "", description: "", stack: [], project_url: "", image_url: "", screenshot_urls: [] },
                ...previous.projects
              ]
            }))
          } onSave={() => saveList("projects", content.projects)} title="Projects">
            {content.projects.map((item, index) => (
              <ProjectEditor
                key={item.id}
                item={item}
                onDelete={() => {
                  setContent((previous) => ({
                    ...previous,
                    projects: previous.projects.filter((project) => project.id !== item.id)
                  }));
                  void deleteRow("projects", item.id);
                }}
                onChange={(next) =>
                  setContent((previous) => ({
                    ...previous,
                    projects: previous.projects.map((project, projectIndex) => (projectIndex === index ? next : project))
                  }))
                }
              />
            ))}
          </CrudList>
        )}

        {tab === "experience" && (
          <CrudList addLabel="Add Experience" description="Manage experience entries shown in the user panel." onAdd={() =>
            setContent((previous) => ({
              ...previous,
              experience: [{ id: createId(), company: "", role: "", duration: "", description: "" }, ...previous.experience]
            }))
          } onSave={() => saveList("experience", content.experience)} title="Experience">
            {content.experience.map((item, index) => (
              <SimpleEditor
                key={item.id}
                fields={[
                  ["Role", item.role, (value) => ({ ...item, role: value })],
                  ["Company", item.company, (value) => ({ ...item, company: value })],
                  ["Duration", item.duration, (value) => ({ ...item, duration: value })]
                ]}
                onBodyChange={(value) =>
                  setContent((previous) => ({
                    ...previous,
                    experience: previous.experience.map((entry, entryIndex) =>
                      entryIndex === index ? { ...item, description: value } : entry
                    )
                  }))
                }
                onDelete={() => {
                  setContent((previous) => ({
                    ...previous,
                    experience: previous.experience.filter((entry) => entry.id !== item.id)
                  }));
                  void deleteRow("experience", item.id);
                }}
                onFieldUpdate={(next) =>
                  setContent((previous) => ({
                    ...previous,
                    experience: previous.experience.map((entry, entryIndex) => (entryIndex === index ? next : entry))
                  }))
                }
                textValue={item.description}
              />
            ))}
          </CrudList>
        )}

        {tab === "certificates" && (
          <CrudList addLabel="Add Certificate" description="Manage certificates and certificate assets." onAdd={() =>
            setContent((previous) => ({
              ...previous,
              certificates: [{ id: createId(), title: "", issuer: "", year: "", asset_url: "" }, ...previous.certificates]
            }))
          } onSave={() => saveList("certificates", content.certificates)} title="Certificates">
            {content.certificates.map((item, index) => (
              <AssetEditor
                key={item.id}
                assetFolder="certificates"
                item={item}
                onChange={(next) =>
                  setContent((previous) => ({
                    ...previous,
                    certificates: previous.certificates.map((entry, entryIndex) => (entryIndex === index ? next : entry))
                  }))
                }
                onDelete={() => {
                  setContent((previous) => ({
                    ...previous,
                    certificates: previous.certificates.filter((entry) => entry.id !== item.id)
                  }));
                  void deleteRow("certificates", item.id);
                }}
              />
            ))}
          </CrudList>
        )}

        {tab === "education" && (
          <CrudList addLabel="Add Education" description="Manage academic background content." onAdd={() =>
            setContent((previous) => ({
              ...previous,
              education: [{ id: createId(), institution: "", degree: "", duration: "", description: "" }, ...previous.education]
            }))
          } onSave={() => saveList("education", content.education)} title="Education">
            {content.education.map((item, index) => (
              <SimpleEditor
                key={item.id}
                fields={[
                  ["Degree", item.degree, (value) => ({ ...item, degree: value })],
                  ["Institution", item.institution, (value) => ({ ...item, institution: value })],
                  ["Duration", item.duration, (value) => ({ ...item, duration: value })]
                ]}
                onBodyChange={(value) =>
                  setContent((previous) => ({
                    ...previous,
                    education: previous.education.map((entry, entryIndex) =>
                      entryIndex === index ? { ...item, description: value } : entry
                    )
                  }))
                }
                onDelete={() => {
                  setContent((previous) => ({
                    ...previous,
                    education: previous.education.filter((entry) => entry.id !== item.id)
                  }));
                  void deleteRow("education", item.id);
                }}
                onFieldUpdate={(next) =>
                  setContent((previous) => ({
                    ...previous,
                    education: previous.education.map((entry, entryIndex) => (entryIndex === index ? next : entry))
                  }))
                }
                textValue={item.description}
              />
            ))}
          </CrudList>
        )}
          </Card>
        </div>
      </main>
    </div>
  );
}

function CrudList({
  title,
  description,
  addLabel,
  onAdd,
  onSave,
  children
}: {
  title: string;
  description: string;
  addLabel: string;
  onAdd: () => void;
  onSave: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SectionHeader title={title} description={description} />
        <div className="flex flex-wrap gap-3">
          <Button className={secondaryActionClass} onClick={onAdd} type="button" variant="secondary">
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
          <Button className={primaryActionClass} onClick={onSave} type="button">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ProjectEditor({
  item,
  onChange,
  onDelete
}: {
  item: ProjectItem;
  onChange: (next: ProjectItem) => void;
  onDelete: () => void;
}) {
  return (
    <Card className={cn(panelClass, "p-4")}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Title</Label>
          <Input value={item.title} onChange={(event) => onChange({ ...item, title: event.target.value })} />
        </div>
        <div>
          <Label>Subtitle</Label>
          <Input value={item.subtitle} onChange={(event) => onChange({ ...item, subtitle: event.target.value })} />
        </div>
        <div className="md:col-span-2">
          <Label>Description</Label>
          <Textarea value={item.description} onChange={(event) => onChange({ ...item, description: event.target.value })} />
        </div>
        <div>
          <Label>Stack</Label>
          <Input
            value={item.stack.join(", ")}
            onChange={(event) =>
              onChange({
                ...item,
                stack: event.target.value
                  .split(",")
                  .map((value) => value.trim())
                  .filter(Boolean)
              })
            }
          />
        </div>
        <div>
          <Label>Project URL</Label>
          <Input value={item.project_url} onChange={(event) => onChange({ ...item, project_url: event.target.value })} />
        </div>
        <div className="md:col-span-2">
          <Label>Cover Screenshot URL</Label>
          <AssetUpload
            accept=".jpeg,.jpg,.png,.webp,.svg"
            assetFolder="projects"
            onUploaded={(url) => onChange({ ...item, image_url: url })}
            value={item.image_url}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Additional Screenshot URLs</Label>
          <Textarea
            placeholder="Paste one screenshot URL per line"
            value={(item.screenshot_urls ?? []).join("\n")}
            onChange={(event) => onChange({ ...item, screenshot_urls: parseUrlList(event.target.value) })}
          />
          <div className="mt-3">
            <AssetUpload
              accept=".jpeg,.jpg,.png,.webp,.svg"
              assetFolder="projects"
              onUploaded={(url) => onChange({ ...item, screenshot_urls: appendUniqueUrl(item.screenshot_urls, url) })}
              value=""
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button className={destructiveActionClass} onClick={onDelete} type="button" variant="secondary">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </Card>
  );
}

function SimpleEditor<T extends ExperienceItem | EducationItem>({
  fields,
  onFieldUpdate,
  onBodyChange,
  textValue,
  onDelete
}: {
  fields: Array<[string, string, (value: string) => T]>;
  onFieldUpdate: (next: T) => void;
  onBodyChange: (value: string) => void;
  textValue: string;
  onDelete: () => void;
}) {
  return (
    <Card className={cn(panelClass, "p-4")}>
      <div className="grid gap-4 md:grid-cols-3">
        {fields.map(([label, value, factory]) => (
          <div key={label}>
            <Label>{label}</Label>
            <Input value={value} onChange={(event) => onFieldUpdate(factory(event.target.value))} />
          </div>
        ))}
        <div className="md:col-span-3">
          <Label>Description</Label>
          <Textarea value={textValue} onChange={(event) => onBodyChange(event.target.value)} />
        </div>
      </div>
      <div className="mt-4">
        <Button className={destructiveActionClass} onClick={onDelete} type="button" variant="secondary">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </Card>
  );
}

function AssetEditor({
  item,
  onChange,
  onDelete,
  assetFolder
}: {
  item: CertificateItem;
  onChange: (next: CertificateItem) => void;
  onDelete: () => void;
  assetFolder: string;
}) {
  return (
    <Card className={cn(panelClass, "p-4")}>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label>Title</Label>
          <Input value={item.title} onChange={(event) => onChange({ ...item, title: event.target.value })} />
        </div>
        <div>
          <Label>Issuer</Label>
          <Input value={item.issuer} onChange={(event) => onChange({ ...item, issuer: event.target.value })} />
        </div>
        <div>
          <Label>Year</Label>
          <Input value={item.year} onChange={(event) => onChange({ ...item, year: event.target.value })} />
        </div>
        <div className="md:col-span-3">
          <Label>Certificate Asset</Label>
          <AssetUpload
            accept=".jpeg,.jpg,.png,.svg"
            assetFolder={assetFolder}
            onUploaded={(url) => onChange({ ...item, asset_url: url })}
            value={item.asset_url}
          />
        </div>
      </div>
      <div className="mt-4">
        <Button className={destructiveActionClass} onClick={onDelete} type="button" variant="secondary">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </Card>
  );
}

function AssetUpload({
  value,
  onUploaded,
  assetFolder,
  accept
}: {
  value: string;
  onUploaded: (url: string) => void;
  assetFolder: string;
  accept: string;
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <Input readOnly value={value} placeholder="Upload asset to Supabase Storage" />
      <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-500 hover:bg-zinc-50">
        {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        Upload File
        <input
          accept={accept}
          className="hidden"
          onChange={async (event) => {
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
          }}
          type="file"
        />
      </label>
    </div>
  );
}
