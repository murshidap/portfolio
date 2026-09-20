import { ArrowLeft, Check, ExternalLink, Eye, ImagePlus, LoaderCircle, LogOut, Pencil, Plus, Save, Trash2, Upload, X } from "lucide-react";
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
  ActivityItem,
  ExperienceItem,
  PortfolioContent,
  ProjectItem
} from "@/types/content";

type TabKey = "homepage" | "skills" | "projects" | "experience" | "certificates" | "about";
type AboutSection = "intro" | "education" | "achievements" | "activities";
type CollectionKey = "skills" | "projects" | "experience" | "certificates" | "achievements" | "activities" | "education";

interface AdminAppProps {
  authenticated: boolean;
  initialContent: PortfolioContent | null;
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "homepage", label: "Homepage" },
  { key: "about", label: "About Me" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "certificates", label: "Certificates" }
];

const createId = () => crypto.randomUUID();
const activityCardCount = 8;

function normalizePersistedId(value: unknown) {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return createId();
}

function appendUniqueUrl(urls: string[] | undefined, url: string) {
  return Array.from(new Set([...(urls ?? []), url].map((item) => item.trim()).filter(Boolean)));
}

function normalizeActivitySlots(items: ActivityItem[] | undefined) {
  const sourceItems = items ?? defaultContent.activities;

  return sourceItems.map((item, index) => ({
    id: normalizePersistedId(item?.id),
    title: item?.title || `Activity ${index + 1}`,
    image_url: item?.image_url || ""
  }));
}

function isSquareImage(file: File) {
  return new Promise<boolean>((resolve) => {
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
const projectDescriptionMaxLength = 240;
const experienceDescriptionMaxLength = 220;
const achievementTitleMaxLength = 28;
const activityTitleMaxLength = 60;
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
  const [aboutSection, setAboutSection] = useState<AboutSection>("intro");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(authenticated);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<PortfolioContent>(() => {
    const startingContent = initialContent ?? defaultContent;

    return {
      ...startingContent,
      achievements: startingContent.achievements,
      activities: normalizeActivitySlots(startingContent.activities)
    };
  });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);

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
      const sanitizedRows = rows.map((row) => {
        if (!row || typeof row !== "object") {
          return row;
        }

        const withId = row as Record<string, unknown>;
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

  const addSkill = () =>
    setContent((previous) => ({
      ...previous,
      skills: [{ id: createId(), title: "", icon_url: "" }, ...previous.skills]
    }));

  const addExperience = () => {
    const newExperience: ExperienceItem = {
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

  const addCertificate = () =>
    setContent((previous) => ({
      ...previous,
      certificates: [{ id: createId(), title: "", issuer: "", year: "", asset_url: "" }, ...previous.certificates]
    }));

  const addAchievement = () =>
    setContent((previous) => ({
      ...previous,
      achievements: [{ id: createId(), title: "", image_url: "" }, ...previous.achievements]
    }));

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

  const tabCounts: Record<Exclude<TabKey, "about">, string | number> = {
    homepage: 1,
    skills: content.skills.length,
    projects: content.projects.length,
    experience: content.experience.length,
    certificates: content.certificates.length
  };
  const aboutSectionCounts: Partial<Record<AboutSection, number>> = {
    education: content.education.length,
    achievements: content.achievements.length,
    activities: content.activities.length
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

    if (tab === "about") {
      if (aboutSection === "intro") {
        return (
          <Button className={primaryActionClass} onClick={saveIntro} type="button">
            <Save className="h-4 w-4" />
            Save Intro
          </Button>
        );
      }

      if (aboutSection === "education") {
        return (
          <div className="flex shrink-0 flex-wrap justify-end gap-3">
            <Button className={secondaryActionClass} onClick={addEducation} type="button" variant="secondary">
              <Plus className="h-4 w-4" />
              Add Education
            </Button>
            <Button className={primaryActionClass} onClick={() => saveList("education", content.education)} type="button">
              <Save className="h-4 w-4" />
              Save Education
            </Button>
          </div>
        );
      }

      if (aboutSection === "achievements") {
        return (
          <div className="flex shrink-0 flex-wrap justify-end gap-3">
            <Button
              className={secondaryActionClass}
              onClick={addAchievement}
              type="button"
              variant="secondary"
            >
              <Plus className="h-4 w-4" />
              Add Achievement
            </Button>
            <Button className={primaryActionClass} onClick={() => saveList("achievements", content.achievements)} type="button">
              <Save className="h-4 w-4" />
              Save Achievements
            </Button>
          </div>
        );
      }

      return (
        <div className="flex shrink-0 flex-wrap justify-end gap-3">
          <Button className={primaryActionClass} onClick={saveAchievementsPanel} type="button">
            <Save className="h-4 w-4" />
            Save Activities
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
      activities: { addLabel: "Add Activity", onAdd: () => undefined, onSave: saveAchievementsPanel },
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

              if (item.key === "about") {
                return (
                  <div key={item.key}>
                    <button
                      className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md px-3 text-left text-sm font-medium transition",
                        active ? "bg-black text-white" : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                      )}
                      onClick={() => setTab("about")}
                      type="button"
                    >
                      <span>{item.label}</span>
                    </button>
                    {active ? (
                      <div className="ml-3 mt-1 space-y-1 border-l border-zinc-200 pl-3">
                        {(["intro", "education", "achievements", "activities"] as const).map((section) => (
                          <button
                            className={cn(
                              "flex h-9 w-full items-center justify-between rounded-md px-3 text-left text-sm transition",
                              aboutSection === section ? "bg-zinc-100 font-medium text-zinc-950" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                            )}
                            key={section}
                            onClick={() => setAboutSection(section)}
                            type="button"
                          >
                            <span>{section[0].toUpperCase() + section.slice(1)}</span>
                            {aboutSectionCounts[section] !== undefined ? (
                              <span className="text-xs text-zinc-400">{aboutSectionCounts[section]}</span>
                            ) : null}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              }

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
          <Card className="!border-0 !bg-transparent p-5 !shadow-none md:p-6">
        {tab === "homepage" && (
          <div className="overflow-hidden rounded-md border border-zinc-200">
            <AdminFieldRow label="Profile Picture">
              <AssetUpload
                accept=".jpeg,.jpg,.png,.webp,.avif,.gif"
                assetFolder="intro"
                inputClassName={homepageValueInputClass}
                onUploaded={(url) =>
                  setContent((previous) => ({
                    ...previous,
                    intro: { ...previous.intro, profile_image_url: url }
                  }))
                }
                value={content.intro.profile_image_url}
              />
            </AdminFieldRow>
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
            <div className="grid grid-cols-[88px_120px_minmax(0,1fr)_88px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <div className="px-5 py-3">SI NO.</div>
              <div className="px-5 py-3 text-center">Icon</div>
              <div className="px-5 py-3">Skill</div>
              <div className="px-5 py-3 text-center">Delete</div>
            </div>
            {content.skills.map((item, index) => (
              <div
                key={item.id}
                className="grid min-h-14 grid-cols-[88px_120px_minmax(0,1fr)_88px] border-b border-zinc-200 last:border-b-0"
              >
                <div className="flex items-center px-5 py-3 text-sm text-zinc-500">{index + 1}</div>
                <div className="flex items-center justify-center px-5 py-3">
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
                <div className="flex items-center px-5 py-3">
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
                <div className="flex items-center justify-center px-5 py-3">
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
          (() => {
            const editingExperience = content.experience.find((item) => item.id === editingExperienceId);

            if (editingExperience) {
              return (
                <ExperienceEditor
                  item={editingExperience}
                  onBack={() => setEditingExperienceId(null)}
                  onChange={(next) =>
                    setContent((previous) => ({
                      ...previous,
                      experience: previous.experience.map((entry) => (entry.id === next.id ? next : entry))
                    }))
                  }
                  onDelete={() => {
                    setEditingExperienceId(null);
                    setContent((previous) => ({
                      ...previous,
                      experience: previous.experience.filter((entry) => entry.id !== editingExperience.id)
                    }));
                    void deleteRow("experience", editingExperience.id);
                  }}
                />
              );
            }

            return (
              <ExperienceTable
                items={content.experience}
                onDelete={(item) => {
                  setContent((previous) => ({
                    ...previous,
                    experience: previous.experience.filter((entry) => entry.id !== item.id)
                  }));
                  void deleteRow("experience", item.id);
                }}
                onEdit={(item) => setEditingExperienceId(item.id)}
              />
            );
          })()
        )}

        {tab === "certificates" && (
          <div className="overflow-hidden rounded-md border border-zinc-200">
            <div className="grid grid-cols-[88px_240px_minmax(0,1fr)_minmax(0,1fr)_120px_72px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <div className="whitespace-nowrap px-4 py-3 text-center">SI No.</div>
              <div className="px-4 py-3 text-center">Image</div>
              <div className="px-4 py-3">Title</div>
              <div className="px-4 py-3">Issuer</div>
              <div className="px-4 py-3">Year</div>
              <div className="px-4 py-3 text-center">Delete</div>
            </div>
            {content.certificates.map((item, index) => (
              <div
                key={item.id}
                className="grid min-h-14 grid-cols-[88px_240px_minmax(0,1fr)_minmax(0,1fr)_120px_72px] border-b border-zinc-200 last:border-b-0"
              >
                <div className="flex items-center justify-center px-4 py-3 text-sm text-zinc-500">{index + 1}</div>
                <div className="flex items-center justify-center px-4 py-3">
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
                <div className="flex items-center px-4 py-3">
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
                <div className="flex items-center px-4 py-3">
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
                <div className="flex items-center px-4 py-3">
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

        {tab === "about" && aboutSection === "intro" && (
          <CrudList>
            <div className="space-y-2">
              <Label>Intro Text</Label>
              <Textarea
                className="!min-h-80 resize-y"
                value={content.intro.intro}
                onChange={(event) =>
                  setContent((previous) => ({ ...previous, intro: { ...previous.intro, intro: event.target.value } }))
                }
              />
            </div>
          </CrudList>
        )}

        {tab === "about" && aboutSection === "education" && (
          <div className="overflow-x-auto rounded-md border border-zinc-200">
            <div className="min-w-[720px] overflow-hidden">
              <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)_minmax(0,1fr)_88px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                <div className="px-5 py-3">Degree</div>
                <div className="px-5 py-3">Institution</div>
                <div className="px-5 py-3">Duration</div>
                <div className="px-5 py-3 text-center">Delete</div>
              </div>
              {content.education.map((item, index) => (
                <div
                  key={item.id}
                  className="grid min-h-14 grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)_minmax(0,1fr)_88px] border-b border-zinc-200 last:border-b-0"
                >
                  <div className="flex items-center px-5 py-3">
                    <Input
                      className={homepageValueInputClass}
                      value={item.degree}
                      onChange={(event) =>
                        setContent((previous) => ({
                          ...previous,
                          education: previous.education.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, degree: event.target.value } : entry
                          )
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center px-5 py-3">
                    <Input
                      className={homepageValueInputClass}
                      value={item.institution}
                      onChange={(event) =>
                        setContent((previous) => ({
                          ...previous,
                          education: previous.education.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, institution: event.target.value } : entry
                          )
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center px-5 py-3">
                    <Input
                      className={homepageValueInputClass}
                      value={item.duration}
                      onChange={(event) =>
                        setContent((previous) => ({
                          ...previous,
                          education: previous.education.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, duration: event.target.value } : entry
                          )
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-center px-5 py-3">
                    <button
                      aria-label={`Delete ${item.degree || "education"}`}
                      className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
                      onClick={() => {
                        setContent((previous) => ({
                          ...previous,
                          education: previous.education.filter((entry) => entry.id !== item.id)
                        }));
                        void deleteRow("education", item.id);
                      }}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "about" && aboutSection === "achievements" && (
          <div className="overflow-x-auto rounded-md border border-zinc-200">
            <div className="min-w-[640px] overflow-hidden">
              <div className="grid grid-cols-[88px_120px_minmax(0,1fr)_88px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                <div className="px-5 py-3">SI NO.</div>
                <div className="px-5 py-3 text-center">Image</div>
                <div className="px-5 py-3">Title</div>
                <div className="px-5 py-3 text-center">Delete</div>
              </div>
              {content.achievements.map((item, index) => (
                <div
                  key={item.id}
                  className="grid min-h-14 grid-cols-[88px_120px_minmax(0,1fr)_88px] border-b border-zinc-200 last:border-b-0"
                >
                  <div className="flex items-center px-5 py-3 text-sm text-zinc-500">{index + 1}</div>
                  <div className="flex items-center justify-center px-5 py-3">
                    <IconUploadButton
                      accept=".jpeg,.jpg,.png,.webp,.svg"
                      assetFolder="achievements"
                      currentUrl={item.image_url}
                      onUploaded={(url) =>
                        setContent((previous) => ({
                          ...previous,
                          achievements: previous.achievements.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, image_url: url } : entry
                          )
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center px-5 py-3">
                    <Input
                      className={homepageValueInputClass}
                      maxLength={achievementTitleMaxLength}
                      value={item.title}
                      onChange={(event) =>
                        setContent((previous) => ({
                          ...previous,
                          achievements: previous.achievements.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, title: event.target.value.slice(0, achievementTitleMaxLength) } : entry
                          )
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-center px-5 py-3">
                    <button
                      aria-label={`Delete ${item.title || "achievement"}`}
                      className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
                      onClick={() => {
                        setContent((previous) => ({
                          ...previous,
                          achievements: previous.achievements.filter((entry) => entry.id !== item.id)
                        }));
                        void deleteRow("achievements", item.id);
                      }}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "about" && aboutSection === "activities" && (
          <div className="overflow-x-auto rounded-md border border-zinc-200">
            <div className="min-w-[640px] overflow-hidden">
              <div className="grid grid-cols-[88px_120px_minmax(0,1fr)_88px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                <div className="px-5 py-3">SI NO.</div>
                <div className="px-5 py-3 text-center">Image</div>
                <div className="px-5 py-3">Title</div>
                <div className="px-5 py-3 text-center">Delete</div>
              </div>
              {content.activities.map((item, index) => (
                <div
                  key={item.id}
                  className="grid min-h-14 grid-cols-[88px_120px_minmax(0,1fr)_88px] border-b border-zinc-200 last:border-b-0"
                >
                  <div className="flex items-center px-5 py-3 text-sm text-zinc-500">{index + 1}</div>
                  <div className="flex items-center px-5 py-3">
                    <IconUploadButton
                      accept=".jpeg,.jpg,.png,.webp,.gif"
                      assetFolder="activities"
                      currentUrl={item.image_url}
                      onUploaded={(url) =>
                        setContent((previous) => ({
                          ...previous,
                          activities: previous.activities.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, image_url: url } : entry
                          )
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center px-5 py-3">
                    <Input
                      className={homepageValueInputClass}
                      maxLength={activityTitleMaxLength}
                      value={item.title}
                      onChange={(event) =>
                        setContent((previous) => ({
                          ...previous,
                          activities: previous.activities.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, title: event.target.value.slice(0, activityTitleMaxLength) } : entry
                          )
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-center px-5 py-3">
                    <button
                      aria-label={`Delete ${item.title || "activity"}`}
                      className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
                      onClick={() => {
                        setContent((previous) => ({
                          ...previous,
                          activities: previous.activities.filter((entry) => entry.id !== item.id)
                        }));
                        void deleteRow("activities", item.id);
                      }}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
      <div className="grid grid-cols-[88px_120px_minmax(0,1.25fr)_minmax(0,1fr)_112px_104px] border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
        <div className="px-5 py-3">SI NO.</div>
        <div className="px-5 py-3 text-center">Icon</div>
        <div className="px-5 py-3">Project</div>
        <div className="px-5 py-3">Website</div>
        <div className="px-5 py-3 text-center">Edit</div>
        <div className="px-5 py-3 text-center">Delete</div>
      </div>

      {items.length ? (
        items.map((item, index) => (
          <div
            className="grid min-h-14 grid-cols-[88px_120px_minmax(0,1.25fr)_minmax(0,1fr)_112px_104px] border-b border-zinc-200 last:border-b-0"
            key={item.id}
          >
            <div className="flex items-center px-5 py-3 text-sm text-zinc-500">{index + 1}</div>
            <div className="flex items-center justify-center px-5 py-3">
              <div aria-label={item.image_url ? `${item.title || "Project"} cover image` : "No cover image"} className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md text-zinc-400" title="Edit cover image from the project editor">
                {item.image_url ? <img alt="" className="h-8 w-8 rounded object-cover" src={item.image_url} /> : <ImagePlus className="h-5 w-5" />}
              </div>
            </div>
            <div className="flex min-w-0 items-center px-5 py-3">
              <p className="truncate text-sm font-medium text-zinc-950">{item.title || "Untitled project"}</p>
            </div>
            <div className="flex min-w-0 items-center px-5 py-3">
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
            <div className="flex items-center justify-center px-5 py-3">
              <button
                aria-label={`Edit ${item.title || "project"}`}
                className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
                onClick={() => onEdit(item)}
                type="button"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-center px-5 py-3">
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
          maxLength={projectDescriptionMaxLength}
          placeholder="Project description"
          value={item.description.slice(0, projectDescriptionMaxLength)}
          onChange={(event) => onChange({ ...item, description: event.target.value.slice(0, projectDescriptionMaxLength) })}
        />
        <p className="mt-2 text-xs text-zinc-500">{projectDescriptionMaxLength - item.description.slice(0, projectDescriptionMaxLength).length} characters remaining</p>
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

function ExperienceTable({
  items,
  onEdit,
  onDelete
}: {
  items: ExperienceItem[];
  onEdit: (item: ExperienceItem) => void;
  onDelete: (item: ExperienceItem) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-zinc-200">
      <table className="w-full min-w-[680px] border-collapse text-left">
        <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          <tr>
            <th className="border-b border-zinc-200 px-4 py-3">Role</th>
            <th className="border-b border-zinc-200 px-4 py-3">Company</th>
            <th className="border-b border-zinc-200 px-4 py-3">Duration</th>
            <th className="w-24 border-b border-zinc-200 px-4 py-3 text-center">Edit</th>
            <th className="w-24 border-b border-zinc-200 px-4 py-3 text-center">Delete</th>
          </tr>
        </thead>
        <tbody className="text-sm text-zinc-700">
          {items.length ? (
            items.map((item) => (
              <tr className="border-b border-zinc-200 last:border-b-0" key={item.id}>
                <td className="max-w-[240px] px-4 py-4 font-medium text-zinc-950">{item.role || "Untitled role"}</td>
                <td className="max-w-[240px] px-4 py-4">{item.company || "No company"}</td>
                <td className="max-w-[200px] px-4 py-4">{item.duration || "No duration"}</td>
                <td className="px-4 py-4 text-center">
                  <Button
                    aria-label={`Edit ${item.role || "experience"}`}
                    className="!h-8 !w-8 !rounded-md !p-0 !text-zinc-700"
                    onClick={() => onEdit(item)}
                    title="Edit experience"
                    type="button"
                    variant="secondary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </td>
                <td className="px-4 py-4 text-center">
                  <Button
                    aria-label={`Delete ${item.role || "experience"}`}
                    className="!h-8 !w-8 !rounded-md !border-red-200 !p-0 !text-red-600 hover:!border-red-600 hover:!bg-red-50"
                    onClick={() => onDelete(item)}
                    title="Delete experience"
                    type="button"
                    variant="secondary"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-8 text-center text-sm text-zinc-500" colSpan={5}>
                No experience entries yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ExperienceEditor({
  item,
  onChange,
  onBack,
  onDelete
}: {
  item: ExperienceItem;
  onChange: (next: ExperienceItem) => void;
  onBack: () => void;
  onDelete: () => void;
}) {
  const visibleDescription = item.description.slice(0, experienceDescriptionMaxLength);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Button className={secondaryActionClass} onClick={onBack} type="button" variant="secondary">
          <ArrowLeft className="h-4 w-4" />
          Experience
        </Button>
        <Button className={destructiveActionClass} onClick={onDelete} type="button" variant="secondary">
          <Trash2 className="h-4 w-4" />
          Delete Experience
        </Button>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="experience-role">Role</Label>
            <Input id="experience-role" value={item.role} onChange={(event) => onChange({ ...item, role: event.target.value })} />
          </div>
          <div>
            <Label htmlFor="experience-company">Company</Label>
            <Input id="experience-company" value={item.company} onChange={(event) => onChange({ ...item, company: event.target.value })} />
          </div>
          <div>
            <Label htmlFor="experience-duration">Duration</Label>
            <Input id="experience-duration" value={item.duration} onChange={(event) => onChange({ ...item, duration: event.target.value })} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between gap-3">
            <Label htmlFor="experience-description">Description</Label>
            <span className="text-xs text-zinc-500">{visibleDescription.length}/{experienceDescriptionMaxLength}</span>
          </div>
          <Textarea
            id="experience-description"
            maxLength={experienceDescriptionMaxLength}
            value={visibleDescription}
            onChange={(event) => onChange({ ...item, description: event.target.value.slice(0, experienceDescriptionMaxLength) })}
          />
        </div>
      </div>
    </div>
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
        "relative inline-flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-black",
        currentUrl ? "text-zinc-950" : ""
      )}
      title={currentUrl ? "Replace icon image" : "Upload icon image"}
    >
      {uploading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : currentUrl ? (
        <img alt="" className="h-8 w-8 rounded object-cover" src={currentUrl} />
      ) : (
        <ImagePlus className="h-5 w-5" />
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
  helperText,
  inputClassName,
  requireSquareImage = false
}: {
  value: string;
  onUploaded: (url: string) => void;
  assetFolder: string;
  accept: string;
  displayValue?: string;
  helperText?: string;
  inputClassName?: string;
  requireSquareImage?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadComplete, setUploadComplete] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const isResume = assetFolder === "resume";

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row">
        {isResume && value ? (
          <button
            aria-label="Preview resume"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-900 transition hover:border-zinc-500 hover:bg-zinc-50"
            onClick={() => setPreviewOpen(true)}
            title="Preview resume"
            type="button"
          >
            <Eye className="h-4 w-4" />
          </button>
        ) : (
          <Input className={inputClassName} readOnly value={displayValue ?? value} placeholder="Upload asset to Supabase Storage" />
        )}
        <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-500 hover:bg-zinc-50">
          {uploading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : uploadComplete ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload File
          <input
            accept={accept}
            className="hidden"
            onChange={async (event) => {
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
            }}
            type="file"
          />
        </label>
      </div>
      {isResume && previewOpen ? (
        <div aria-labelledby="resume-preview-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog">
          <div className="flex h-[min(90vh,900px)] w-full max-w-4xl flex-col overflow-hidden rounded-md bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-950" id="resume-preview-title">Resume preview</h2>
              <button
                aria-label="Close resume preview"
                className="grid h-8 w-8 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
                onClick={() => setPreviewOpen(false)}
                title="Close preview"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <iframe className="min-h-0 flex-1" src={value} title="Resume PDF preview" />
          </div>
        </div>
      ) : null}
      {helperText || uploadError ? (
        <p className={cn("mt-2 text-xs", uploadError ? "text-red-600" : "text-zinc-500")}>{uploadError || helperText}</p>
      ) : null}
    </div>
  );
}
