import { ArrowLeft, ExternalLink, ImagePlus, LoaderCircle, LogOut, Pencil, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { defaultContent } from "@/data/defaultContent";
import { cn } from "@/lib/utils";
import type {
  AchievementItem,
  EducationItem,
  ExperienceItem,
  PortfolioContent,
  ProjectItem
} from "@/types/content";

type TabKey = "homepage" | "skills" | "projects" | "experience" | "certificates" | "achievements";
type CollectionKey = "skills" | "projects" | "experience" | "certificates" | "achievements" | "education";

interface AdminAppProps {
  authenticated: boolean;
  initialContent: PortfolioContent | null;
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "homepage", label: "Homepage" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "certificates", label: "Certificates" },
  { key: "achievements", label: "Achievements" }
];

const createId = () => crypto.randomUUID();

function appendUniqueUrl(urls: string[] | undefined, url: string) {
  return Array.from(new Set([...(urls ?? []), url].map((item) => item.trim()).filter(Boolean)));
}

const primaryActionClass =
  "!h-9 !rounded-md !border-black !bg-black !px-3 !text-sm !font-medium !normal-case !tracking-normal !text-white !shadow-none hover:!scale-100 hover:!bg-zinc-800";
const secondaryActionClass =
  "!h-9 !rounded-md !border-zinc-300 !bg-white !px-3 !text-sm !font-medium !normal-case !tracking-normal !text-zinc-900 !shadow-none hover:!scale-100 hover:!border-zinc-500 hover:!bg-zinc-50";
const destructiveActionClass =
  "!h-9 !rounded-md !border-zinc-300 !bg-white !px-3 !text-sm !font-medium !normal-case !tracking-normal !text-zinc-700 !shadow-none hover:!scale-100 hover:!border-zinc-900 hover:!bg-zinc-50 hover:!text-black";
const redDestructiveActionClass =
  "!h-9 !rounded-md !border-red-600 !bg-red-600 !px-3 !text-sm !font-medium !normal-case !tracking-normal !text-white !shadow-none hover:!scale-100 hover:!border-red-700 hover:!bg-red-700";
const panelClass = "!rounded-md !border-zinc-200 !bg-white !shadow-none !backdrop-blur-none";
const homepageValueInputClass =
  "!h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-0 !shadow-none focus:!border-0 focus:!ring-0";
const projectAdditionalImageMaxCount = 4;
const experienceDescriptionMaxLength = 220;
const achievementTitleMaxLength = 28;
const achievementMaxCount = 4;
const fixedOwnerName = "MURSHIDA P.";

async function parseResponse(response: Response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }
  return payload;
}

export function AdminApp({ authenticated, initialContent }: AdminAppProps) {
  const [tab, setTab] = useState<TabKey>("homepage");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(authenticated);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<PortfolioContent>(() => {
    const startingContent = initialContent ?? defaultContent;

    return {
      ...startingContent,
      achievements: startingContent.achievements.slice(0, achievementMaxCount)
    };
  });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

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
              rows: content.achievements.slice(0, achievementMaxCount).map((entry) => ({
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
        )
      ]);
      setMessage("Achievements updated.");
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

  const addProject = () => {
    const newProject: ProjectItem = {
      id: createId(),
      title: "",
      description: "",
      stack: [],
      project_url: "",
      image_url: "",
      screenshot_urls: []
    };

    setContent((previous) => ({
      ...previous,
      projects: [newProject, ...previous.projects]
    }));
    setEditingProjectId(newProject.id);
  };

  const addSkill = () =>
    setContent((previous) => ({
      ...previous,
      skills: [{ id: createId(), title: "", icon_url: "" }, ...previous.skills]
    }));

  const addExperience = () =>
    setContent((previous) => ({
      ...previous,
      experience: [{ id: createId(), company: "", role: "", duration: "", description: "" }, ...previous.experience]
    }));

  const addCertificate = () =>
    setContent((previous) => ({
      ...previous,
      certificates: [{ id: createId(), title: "", issuer: "", year: "", asset_url: "" }, ...previous.certificates]
    }));

  const addAchievement = () =>
    setContent((previous) => {
      if (previous.achievements.length >= achievementMaxCount) {
        setMessage(`Only ${achievementMaxCount} achievements can be uploaded.`);
        return previous;
      }

      return {
        ...previous,
        achievements: [{ id: createId(), title: "", image_url: "" }, ...previous.achievements]
      };
    });

  const addEducation = () =>
    setContent((previous) => ({
      ...previous,
      education: [{ id: createId(), institution: "", degree: "", duration: "", description: "" }, ...previous.education]
    }));

  const saveExperience = () =>
    saveList(
      "experience",
      content.experience.map((entry) => ({
        ...entry,
        description: entry.description.slice(0, experienceDescriptionMaxLength)
      }))
    );

  const saveProjects = () =>
    saveList(
      "projects",
      content.projects.map((entry) => ({
        ...entry,
        screenshot_urls: (entry.screenshot_urls ?? []).slice(0, projectAdditionalImageMaxCount)
      }))
    );

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
    homepage: 1,
    skills: content.skills.length,
    projects: content.projects.length,
    experience: content.experience.length,
    certificates: content.certificates.length,
    achievements: content.achievements.length + content.education.length
  };
  const activeTab = tabs.find((item) => item.key === tab) ?? tabs[0];
  const renderHeaderActions = () => {
    if (tab === "homepage") {
      return (
        <Button className={primaryActionClass} onClick={saveIntro} type="button">
          <Save className="h-4 w-4" />
          Save Homepage
        </Button>
      );
    }

    if (tab === "achievements") {
      return (
        <div className="flex shrink-0 flex-wrap justify-end gap-3">
          <Button
            className={secondaryActionClass}
            disabled={content.achievements.length >= achievementMaxCount}
            onClick={addAchievement}
            type="button"
            variant="secondary"
          >
            <Plus className="h-4 w-4" />
            Add Achievement
          </Button>
          <Button className={secondaryActionClass} onClick={addEducation} type="button" variant="secondary">
            <Plus className="h-4 w-4" />
            Add Education
          </Button>
          <Button className={primaryActionClass} onClick={saveAchievementsPanel} type="button">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      );
    }

    const actions: Record<CollectionKey, { addLabel: string; onAdd: () => void; onSave: () => void }> = {
      skills: { addLabel: "Add Skill", onAdd: addSkill, onSave: () => saveList("skills", content.skills) },
      projects: { addLabel: "Add Project", onAdd: addProject, onSave: saveProjects },
      experience: { addLabel: "Add Experience", onAdd: addExperience, onSave: saveExperience },
      certificates: { addLabel: "Add Certificate", onAdd: addCertificate, onSave: () => saveList("certificates", content.certificates) },
      achievements: { addLabel: "Add Achievement", onAdd: addAchievement, onSave: saveAchievementsPanel },
      education: { addLabel: "Add Education", onAdd: addEducation, onSave: () => saveList("education", content.education) }
    };
    const activeActions = actions[tab as CollectionKey];

    return (
      <div className="flex shrink-0 flex-wrap justify-end gap-3">
        <Button className={secondaryActionClass} onClick={activeActions.onAdd} type="button" variant="secondary">
          <Plus className="h-4 w-4" />
          {activeActions.addLabel}
        </Button>
        <Button className={primaryActionClass} onClick={activeActions.onSave} type="button">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    );
  };

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
          </div>
          <div className="ml-auto flex items-center justify-end gap-4">
            {message ? <p className="max-w-sm truncate rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">{message}</p> : null}
            {renderHeaderActions()}
          </div>
        </header>

        <div className="max-w-[1280px] px-8 py-7">
          <Card className={cn(panelClass, "p-5 md:p-6")}>
        {tab === "homepage" && (
          <div className="overflow-hidden rounded-md border border-zinc-200">
            <AdminFieldRow label="Role">
              <Input
                className={homepageValueInputClass}
                value={content.intro.role}
                onChange={(event) =>
                  setContent((previous) => ({ ...previous, intro: { ...previous.intro, role: event.target.value } }))
                }
              />
            </AdminFieldRow>
            <AdminFieldRow label="GitHub">
              <Input
                className={homepageValueInputClass}
                value={content.intro.github_url}
                onChange={(event) =>
                  setContent((previous) => ({
                    ...previous,
                    intro: { ...previous.intro, github_url: event.target.value }
                  }))
                }
              />
            </AdminFieldRow>
            <AdminFieldRow label="LinkedIn">
              <Input
                className={homepageValueInputClass}
                value={content.intro.linkedin_url}
                onChange={(event) =>
                  setContent((previous) => ({
                    ...previous,
                    intro: { ...previous.intro, linkedin_url: event.target.value }
                  }))
                }
              />
            </AdminFieldRow>
            <AdminFieldRow label="Phone">
              <Input
                className={homepageValueInputClass}
                value={content.intro.phone}
                onChange={(event) =>
                  setContent((previous) => ({ ...previous, intro: { ...previous.intro, phone: event.target.value } }))
                }
              />
            </AdminFieldRow>
            <AdminFieldRow label="Email">
              <Input
                className={homepageValueInputClass}
                value={content.intro.email}
                onChange={(event) =>
                  setContent((previous) => ({ ...previous, intro: { ...previous.intro, email: event.target.value } }))
                }
              />
            </AdminFieldRow>
            <AdminFieldRow label="Resume">
              <AssetUpload
                accept="application/pdf"
                assetFolder="resume"
                displayValue={content.intro.resume_url ? "Uploaded" : ""}
                inputClassName={homepageValueInputClass}
                onUploaded={(url) =>
                  setContent((previous) => ({
                    ...previous,
                    intro: { ...previous.intro, resume_url: url }
                  }))
                }
                value={content.intro.resume_url}
              />
            </AdminFieldRow>
          </div>
        )}

        {tab === "skills" && (
          <div className="overflow-hidden rounded-md border border-zinc-200">
            <div className="grid grid-cols-[minmax(0,1fr)_240px_72px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <div className="border-r border-zinc-200 px-4 py-3">Skill</div>
              <div className="border-r border-zinc-200 px-4 py-3 text-center">Icon Image</div>
              <div className="px-4 py-3 text-center">Delete</div>
            </div>
            {content.skills.map((item, index) => (
              <div
                key={item.id}
                className="grid min-h-14 grid-cols-[minmax(0,1fr)_240px_72px] border-b border-zinc-200 last:border-b-0"
              >
                <div className="flex items-center border-r border-zinc-200 px-4 py-3">
                  <Input
                    className={homepageValueInputClass}
                    value={item.title}
                    onChange={(event) =>
                      setContent((previous) => ({
                        ...previous,
                        skills: previous.skills.map((entry, entryIndex) =>
                          entryIndex === index ? { ...item, title: event.target.value } : entry
                        )
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-center border-r border-zinc-200 px-4 py-3">
                  <IconUploadButton
                    accept=".jpeg,.jpg,.png,.webp,.avif,.gif"
                    assetFolder="skills"
                    currentUrl={item.icon_url}
                    onUploaded={(url) =>
                      setContent((previous) => ({
                        ...previous,
                        skills: previous.skills.map((entry, entryIndex) =>
                          entryIndex === index ? { ...item, icon_url: url } : entry
                        )
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-center px-4 py-3">
                  <button
                    aria-label={`Delete ${item.title || "skill"}`}
                    className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
                    onClick={() => {
                      setContent((previous) => ({
                        ...previous,
                        skills: previous.skills.filter((entry) => entry.id !== item.id)
                      }));
                      void deleteRow("skills", item.id);
                    }}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "projects" && (
          (() => {
            const editingProject = content.projects.find((project) => project.id === editingProjectId);

            if (editingProject) {
              const projectIndex = content.projects.findIndex((project) => project.id === editingProject.id);

              return (
                <ProjectEditor
                  item={editingProject}
                  onBack={() => setEditingProjectId(null)}
                  onChange={(next) =>
                    setContent((previous) => ({
                      ...previous,
                      projects: previous.projects.map((project, index) => (index === projectIndex ? next : project))
                    }))
                  }
                  onDelete={() => {
                    setEditingProjectId(null);
                    setContent((previous) => ({
                      ...previous,
                      projects: previous.projects.filter((project) => project.id !== editingProject.id)
                    }));
                    void deleteRow("projects", editingProject.id);
                  }}
                />
              );
            }

            return (
              <ProjectsTable
                items={content.projects}
                onDelete={(item) => {
                  setContent((previous) => ({
                    ...previous,
                    projects: previous.projects.filter((project) => project.id !== item.id)
                  }));
                  void deleteRow("projects", item.id);
                }}
                onEdit={(item) => setEditingProjectId(item.id)}
              />
            );
          })()
        )}

        {tab === "experience" && (
          <CrudList>
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
                bodyMaxLength={experienceDescriptionMaxLength}
                textValue={item.description}
              />
            ))}
          </CrudList>
        )}

        {tab === "certificates" && (
          <div className="overflow-hidden rounded-md border border-zinc-200">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px_240px_72px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <div className="border-r border-zinc-200 px-4 py-3">Title</div>
              <div className="border-r border-zinc-200 px-4 py-3">Issuer</div>
              <div className="border-r border-zinc-200 px-4 py-3">Year</div>
              <div className="border-r border-zinc-200 px-4 py-3 text-center">Image</div>
              <div className="px-4 py-3 text-center">Delete</div>
            </div>
            {content.certificates.map((item, index) => (
              <div
                key={item.id}
                className="grid min-h-14 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px_240px_72px] border-b border-zinc-200 last:border-b-0"
              >
                <div className="flex items-center border-r border-zinc-200 px-4 py-3">
                  <Input
                    className={homepageValueInputClass}
                    value={item.title}
                    onChange={(event) =>
                      setContent((previous) => ({
                        ...previous,
                        certificates: previous.certificates.map((entry, entryIndex) =>
                          entryIndex === index ? { ...item, title: event.target.value } : entry
                        )
                      }))
                    }
                  />
                </div>
                <div className="flex items-center border-r border-zinc-200 px-4 py-3">
                  <Input
                    className={homepageValueInputClass}
                    value={item.issuer}
                    onChange={(event) =>
                      setContent((previous) => ({
                        ...previous,
                        certificates: previous.certificates.map((entry, entryIndex) =>
                          entryIndex === index ? { ...item, issuer: event.target.value } : entry
                        )
                      }))
                    }
                  />
                </div>
                <div className="flex items-center border-r border-zinc-200 px-4 py-3">
                  <Input
                    className={homepageValueInputClass}
                    value={item.year}
                    onChange={(event) =>
                      setContent((previous) => ({
                        ...previous,
                        certificates: previous.certificates.map((entry, entryIndex) =>
                          entryIndex === index ? { ...item, year: event.target.value } : entry
                        )
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-center border-r border-zinc-200 px-4 py-3">
                  <IconUploadButton
                    accept=".jpeg,.jpg,.png,.webp,.avif,.gif"
                    assetFolder="certificates"
                    currentUrl={item.asset_url}
                    onUploaded={(url) =>
                      setContent((previous) => ({
                        ...previous,
                        certificates: previous.certificates.map((entry, entryIndex) =>
                          entryIndex === index ? { ...item, asset_url: url } : entry
                        )
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-center px-4 py-3">
                  <button
                    aria-label={`Delete ${item.title || "certificate"}`}
                    className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
                    onClick={() => {
                      setContent((previous) => ({
                        ...previous,
                        certificates: previous.certificates.filter((entry) => entry.id !== item.id)
                      }));
                      void deleteRow("certificates", item.id);
                    }}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "achievements" && (
          <CrudList>
            <Card className={cn(panelClass, "p-4")}>
              <Label>Intro Text</Label>
              <Textarea
                value={content.intro.intro}
                onChange={(event) =>
                  setContent((previous) => ({ ...previous, intro: { ...previous.intro, intro: event.target.value } }))
                }
              />
            </Card>
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
            {content.achievements.map((item, index) => (
              <AchievementEditor
                key={item.id}
                item={item}
                onChange={(next) =>
                  setContent((previous) => ({
                    ...previous,
                    achievements: previous.achievements.map((entry, entryIndex) => (entryIndex === index ? next : entry))
                  }))
                }
                onDelete={() => {
                  setContent((previous) => ({
                    ...previous,
                    achievements: previous.achievements.filter((entry) => entry.id !== item.id)
                  }));
                  void deleteRow("achievements", item.id);
                }}
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

function CrudList({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

function AdminFieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid border-b border-zinc-200 last:border-b-0 md:grid-cols-[220px_minmax(0,1fr)]">
      <Label className="flex min-h-14 items-center border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 md:border-b-0 md:border-r">
        {label}
      </Label>
      <div className="flex min-h-14 items-center px-4 py-3">{children}</div>
    </div>
  );
}

function ProjectsTable({
  items,
  onEdit,
  onDelete
}: {
  items: ProjectItem[];
  onEdit: (item: ProjectItem) => void;
  onDelete: (item: ProjectItem) => void;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-zinc-200">
      <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_96px_88px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
        <div className="border-r border-zinc-200 px-4 py-3">Project</div>
        <div className="border-r border-zinc-200 px-4 py-3">Website</div>
        <div className="border-r border-zinc-200 px-4 py-3 text-center">Edit</div>
        <div className="px-4 py-3 text-center">Delete</div>
      </div>

      {items.length ? (
        items.map((item) => (
          <div
            className="grid min-h-14 grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_96px_88px] border-b border-zinc-200 last:border-b-0"
            key={item.id}
          >
            <div className="flex min-w-0 items-center border-r border-zinc-200 px-4 py-3">
              <p className="truncate text-sm font-medium text-zinc-950">{item.title || "Untitled project"}</p>
            </div>
            <div className="flex min-w-0 items-center border-r border-zinc-200 px-4 py-3">
              {item.project_url ? (
                <a
                  className="inline-flex min-w-0 items-center gap-2 text-sm text-zinc-600 transition hover:text-black"
                  href={item.project_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="truncate">{item.project_url}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              ) : (
                <span className="text-sm text-zinc-400">Not added</span>
              )}
            </div>
            <div className="flex items-center justify-center border-r border-zinc-200 px-4 py-3">
              <button
                aria-label={`Edit ${item.title || "project"}`}
                className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
                onClick={() => onEdit(item)}
                type="button"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-center px-4 py-3">
              <button
                aria-label={`Delete ${item.title || "project"}`}
                className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
                onClick={() => onDelete(item)}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="px-4 py-8 text-center text-sm text-zinc-500">No projects added.</div>
      )}
    </div>
  );
}

function ProjectEditor({
  item,
  onBack,
  onChange,
  onDelete
}: {
  item: ProjectItem;
  onBack: () => void;
  onChange: (next: ProjectItem) => void;
  onDelete: () => void;
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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Button className={secondaryActionClass} onClick={onBack} type="button" variant="secondary">
          <ArrowLeft className="h-4 w-4" />
          Projects
        </Button>
        <Button className={destructiveActionClass} onClick={onDelete} type="button" variant="secondary">
          <Trash2 className="h-4 w-4" />
          Delete Project
        </Button>
      </div>

      <div className="space-y-4">
        <Input
          aria-label="Project title"
          className="!h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-0 !text-3xl !font-medium !shadow-none focus:!border-0 focus:!ring-0"
          placeholder="Project title"
          value={item.title}
          onChange={(event) => onChange({ ...item, title: event.target.value })}
        />
        <Input
          aria-label="Project website"
          className="!h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-0 !text-base !shadow-none focus:!border-0 focus:!ring-0"
          placeholder="Project URL"
          value={item.project_url}
          onChange={(event) => onChange({ ...item, project_url: event.target.value })}
        />
        <ProjectStackEditor
          newTech={newTech}
          onAdd={addTech}
          onNewTechChange={setNewTech}
          onRemove={(tech) => onChange({ ...item, stack: item.stack.filter((entry) => entry !== tech) })}
          stack={item.stack}
        />
      </div>

      <div>
        <Textarea
          className="!min-h-32 resize-none"
          placeholder="Project description"
          value={item.description}
          onChange={(event) => onChange({ ...item, description: event.target.value })}
        />
        <p className="mt-2 text-xs text-zinc-500">char: {item.description.length}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[180px_minmax(0,1fr)]">
        <ProjectImageTile
          currentUrl={item.image_url}
          label="Cover image"
          onRemove={() => onChange({ ...item, image_url: "" })}
          onUploaded={(url) => onChange({ ...item, image_url: url })}
        />

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <Label>Images</Label>
            <span className="text-xs text-zinc-500">
              {screenshotUrls.length}/{projectAdditionalImageMaxCount}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {screenshotUrls.map((url, index) => (
              <ProjectImageTile
                currentUrl={url}
                key={`${url}-${index}`}
                label={`Image ${index + 1}`}
                onRemove={() =>
                  onChange({
                    ...item,
                    screenshot_urls: screenshotUrls.filter((_, screenshotIndex) => screenshotIndex !== index)
                  })
                }
                onUploaded={(nextUrl) =>
                  onChange({
                    ...item,
                    screenshot_urls: screenshotUrls.map((entry, screenshotIndex) => (screenshotIndex === index ? nextUrl : entry))
                  })
                }
              />
            ))}
            {canUploadMoreImages ? (
              <ProjectImageTile
                currentUrl=""
                label="Add image"
                onUploaded={(url) =>
                  onChange({
                    ...item,
                    screenshot_urls: appendUniqueUrl(screenshotUrls, url).slice(0, projectAdditionalImageMaxCount)
                  })
                }
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectStackEditor({
  stack,
  newTech,
  onNewTechChange,
  onAdd,
  onRemove
}: {
  stack: string[];
  newTech: string;
  onNewTechChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (tech: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {stack.map((tech) => (
        <button
          className="group inline-flex h-8 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 transition hover:border-zinc-400 hover:text-black"
          key={tech}
          onClick={() => onRemove(tech)}
          type="button"
        >
          {tech}
          <X className="h-3.5 w-3.5 text-zinc-400 group-hover:text-black" />
        </button>
      ))}
      <Input
        aria-label="Add technology"
        className="!h-8 !w-36"
        placeholder="Add tech"
        value={newTech}
        onChange={(event) => onNewTechChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onAdd();
          }
        }}
      />
      <Button className={secondaryActionClass} onClick={onAdd} type="button" variant="secondary">
        <Plus className="h-4 w-4" />
        Add
      </Button>
    </div>
  );
}

function ProjectImageTile({
  label,
  currentUrl,
  onUploaded,
  onRemove
}: {
  label: string;
  currentUrl: string;
  onUploaded: (url: string) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-2">
      <div className="mb-2 flex items-center justify-between gap-2">
        <Label className="text-xs font-medium text-zinc-600">{label}</Label>
        {currentUrl && onRemove ? (
          <button
            aria-label={`Remove ${label}`}
            className="grid h-7 w-7 place-items-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-black"
            onClick={onRemove}
            type="button"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
      <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-sm bg-zinc-50">
        {currentUrl ? (
          <img alt="" className="h-full w-full object-cover" src={currentUrl} />
        ) : (
          <ImagePlus className="h-8 w-8 text-zinc-300" />
        )}
      </div>
      <ProjectImageUploadButton currentUrl={currentUrl} onUploaded={onUploaded} />
    </div>
  );
}

function ProjectImageUploadButton({
  currentUrl,
  onUploaded
}: {
  currentUrl: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <label className="mt-2 inline-flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-800 transition hover:border-zinc-500 hover:bg-zinc-50">
      {uploading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
      {currentUrl ? "Replace" : "Upload"}
      <input
        accept=".jpeg,.jpg,.png,.webp,.avif,.gif"
        className="hidden"
        onChange={async (event) => {
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
        }}
        type="file"
      />
    </label>
  );
}

function SimpleEditor<T extends ExperienceItem | EducationItem>({
  fields,
  onFieldUpdate,
  onBodyChange,
  bodyMaxLength,
  textValue,
  onDelete
}: {
  fields: Array<[string, string, (value: string) => T]>;
  onFieldUpdate: (next: T) => void;
  onBodyChange: (value: string) => void;
  bodyMaxLength?: number;
  textValue: string;
  onDelete: () => void;
}) {
  const visibleTextValue = bodyMaxLength ? textValue.slice(0, bodyMaxLength) : textValue;
  const descriptionLength = visibleTextValue.length;

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
          <div className="mb-1 flex items-center justify-between gap-3">
            <Label>Description</Label>
            {bodyMaxLength ? (
              <span className="text-xs text-zinc-500">
                {descriptionLength}/{bodyMaxLength}
              </span>
            ) : null}
          </div>
          <Textarea
            maxLength={bodyMaxLength}
            value={visibleTextValue}
            onChange={(event) => onBodyChange(bodyMaxLength ? event.target.value.slice(0, bodyMaxLength) : event.target.value)}
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

function AchievementEditor({
  item,
  onChange,
  onDelete
}: {
  item: AchievementItem;
  onChange: (next: AchievementItem) => void;
  onDelete: () => void;
}) {
  const visibleTitle = item.title.slice(0, achievementTitleMaxLength);

  return (
    <Card className={cn(panelClass, "p-4")}>
      <div className="grid gap-4 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <div>
          <div className="mb-1 flex items-center justify-between gap-3">
            <Label>Title</Label>
            <span className="text-xs text-zinc-500">
              {visibleTitle.length}/{achievementTitleMaxLength}
            </span>
          </div>
          <Input
            maxLength={achievementTitleMaxLength}
            value={visibleTitle}
            onChange={(event) => onChange({ ...item, title: event.target.value.slice(0, achievementTitleMaxLength) })}
          />
        </div>
        <div>
          <Label>Achievement Photo</Label>
          <AssetUpload
            accept=".jpeg,.jpg,.png,.webp,.svg"
            assetFolder="achievements"
            onUploaded={(url) => onChange({ ...item, image_url: url })}
            value={item.image_url}
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

function IconUploadButton({
  currentUrl,
  onUploaded,
  assetFolder,
  accept
}: {
  currentUrl: string;
  onUploaded: (url: string) => void;
  assetFolder: string;
  accept: string;
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <label
      className={cn(
        "inline-flex h-9 min-w-32 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-black",
        currentUrl ? "text-zinc-950" : ""
      )}
      title={currentUrl ? "Replace icon image" : "Upload icon image"}
    >
      {uploading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {currentUrl ? <span>Uploaded</span> : null}
          <Upload className="h-4 w-4" />
        </>
      )}
      <input
        accept={accept}
        className="hidden"
        onChange={async (event) => {
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
        }}
        type="file"
      />
    </label>
  );
}

function AssetUpload({
  value,
  onUploaded,
  assetFolder,
  accept,
  displayValue,
  inputClassName
}: {
  value: string;
  onUploaded: (url: string) => void;
  assetFolder: string;
  accept: string;
  displayValue?: string;
  inputClassName?: string;
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <Input className={inputClassName} readOnly value={displayValue ?? value} placeholder="Upload asset to Supabase Storage" />
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
