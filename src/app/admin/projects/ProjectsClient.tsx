"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminLayout,
  Header,
  Card,
  Button,
  Input,
  Textarea,
  Table,
  TableAction,
  Badge,
  type Column,
  EntityListEditor,
  type EntityItem,
} from "@/components/admin";
import { ProjectWithDetails, ProjectWithTechnologies, Technology } from "@/types/portfolio";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjectWithDetails,
  createProjectProblem,
  createProjectSolution,
  createProjectDesign,
  createProjectFeature,
  createProjectTesting,
  createProjectResult,
  createProjectLearning,
  deleteProjectProblem,
  deleteProjectSolution,
  deleteProjectDesign,
  deleteProjectFeature,
  deleteProjectTesting,
  deleteProjectResult,
  deleteProjectLearning,
} from "@/lib/actions/portfolio";
import { handleLogout } from "../logout-action";
import { STORAGE_BUCKETS, uploadImage } from "@/lib/supabase/storage";
import { MultipleImageUpload } from "@/components/admin/MultipleImageUpload";
import { entityConfigs } from "./entityConfigs";

type SectionKey =
  | "problems"
  | "solutions"
  | "designs"
  | "features"
  | "testings"
  | "results"
  | "learnings";

type DetailDrafts = Record<SectionKey, EntityItem[]>;

interface ProjectsClientProps {
  initialProjects: ProjectWithTechnologies[];
  technologies: Technology[];
  userEmail: string;
  error: string | null;
}

export function ProjectsClient({
  initialProjects,
  technologies,
  userEmail,
  error: initialError,
}: ProjectsClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectWithTechnologies[]>(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithTechnologies | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  // Pending image files — uploaded to storage only when the form is submitted
  const [pendingImageFiles, setPendingImageFiles] = useState<File[]>([]);
  const [details, setDetails] = useState<ProjectWithDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailDrafts, setDetailDrafts] = useState<DetailDrafts>({
    problems: [],
    solutions: [],
    designs: [],
    features: [],
    testings: [],
    results: [],
    learnings: [],
  });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    role: "",
    duration: "",
    platform: "",
    team: "",
    image_urls: [] as string[],
    demo_url: "",
    github_url: "",
    technology_ids: [] as number[],
  });

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!editingProject) {
      return;
    }
    void Promise.resolve().then(() => {
      setDetailsLoading(true);
      return getProjectWithDetails(editingProject.id)
        .then((result) => {
          if (result.error) setError(result.error);
          else {
            setDetails(result.data);
            setDetailDrafts({
              problems: (result.data?.problems || []).map((item) => ({ ...item })),
              solutions: (result.data?.solutions || []).map((item) => ({ ...item })),
              designs: (result.data?.designs || []).map((item) => ({ ...item })),
              features: (result.data?.features || []).map((item) => ({ ...item })),
              testings: (result.data?.testings || []).map((item) => ({ ...item })),
              results: (result.data?.results || []).map((item) => ({ ...item })),
              learnings: (result.data?.learnings || []).map((item) => ({ ...item })),
            });
          }
        })
        .finally(() => setDetailsLoading(false));
    });
  }, [editingProject]);

  const handleOpenForm = (project?: ProjectWithTechnologies) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        slug: project.slug,
        description: project.description,
        role: project.role || "",
        duration: project.duration || "",
        platform: project.platform || "",
        team: project.team || "",
        image_urls: project.image_urls,
        demo_url: project.demo_url || "",
        github_url: project.github_url || "",
        technology_ids: project.technologies.map((t) => t.id),
      });
    } else {
      setEditingProject(null);
      setDetails(null);
      setDetailDrafts({
        problems: [],
        solutions: [],
        designs: [],
        features: [],
        testings: [],
        results: [],
        learnings: [],
      });
      setFormData({
        title: "",
        slug: "",
        description: "",
        role: "",
        duration: "",
        platform: "",
        team: "",
        image_urls: [],
        demo_url: "",
        github_url: "",
        technology_ids: [],
      });
    }
    setIsFormOpen(true);
    setError(null);
    setPendingImageFiles([]);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      role: "",
      duration: "",
      platform: "",
      team: "",
      image_urls: [],
      demo_url: "",
      github_url: "",
      technology_ids: [],
    });
    setError(null);
    setPendingImageFiles([]);
    setDetails(null);
    setDetailDrafts({
      problems: [],
      solutions: [],
      designs: [],
      features: [],
      testings: [],
      results: [],
      learnings: [],
    });
  };

  const saveDetails = async (projectId: number) => {
    const sections: Array<{
      key: SectionKey;
      create: (projectId: number, data: Record<string, unknown>) => Promise<{ error: string | null }>;
    }> = [
      { key: "problems", create: createProjectProblem as unknown as (projectId: number, data: Record<string, unknown>) => Promise<{ error: string | null }> },
      { key: "solutions", create: createProjectSolution as unknown as (projectId: number, data: Record<string, unknown>) => Promise<{ error: string | null }> },
      { key: "designs", create: createProjectDesign as unknown as (projectId: number, data: Record<string, unknown>) => Promise<{ error: string | null }> },
      { key: "features", create: createProjectFeature as unknown as (projectId: number, data: Record<string, unknown>) => Promise<{ error: string | null }> },
      { key: "testings", create: createProjectTesting as unknown as (projectId: number, data: Record<string, unknown>) => Promise<{ error: string | null }> },
      { key: "results", create: createProjectResult as unknown as (projectId: number, data: Record<string, unknown>) => Promise<{ error: string | null }> },
      { key: "learnings", create: createProjectLearning as unknown as (projectId: number, data: Record<string, unknown>) => Promise<{ error: string | null }> },
    ];

    for (const section of sections) {
      const items = detailDrafts[section.key] || [];

      const existing = details?.[section.key] || [];
      for (const row of existing) {
        const removeFn =
          section.key === "problems"
            ? deleteProjectProblem
            : section.key === "solutions"
              ? deleteProjectSolution
              : section.key === "designs"
                ? deleteProjectDesign
                : section.key === "features"
                  ? deleteProjectFeature
                  : section.key === "testings"
                    ? deleteProjectTesting
                    : section.key === "results"
                      ? deleteProjectResult
                      : deleteProjectLearning;
        const removed = await removeFn(row.id);
        if (removed.error) throw new Error(removed.error);
      }

      for (let i = 0; i < items.length; i++) {
        const row = items[i];
        const { id, project_id, created_at, updated_at, ...data } = row as Record<string, unknown>;
        void id;
        void project_id;
        void created_at;
        void updated_at;
        const payload = {
          ...data,
          sort_order: typeof data.sort_order === "number" ? data.sort_order : i,
        };
        const created = await section.create(projectId, payload);
        if (created.error) throw new Error(created.error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Upload any pending image files to storage first
      const uploadedUrls: string[] = [];
      for (const file of pendingImageFiles) {
        const result = await uploadImage(file, STORAGE_BUCKETS.PROJECTS);
        if (result.error) {
          setError(`Image upload failed: ${result.error}`);
          return;
        }
        if (result.data) uploadedUrls.push(result.data.publicUrl);
      }

      // Combine already-committed URLs with newly uploaded ones
      const finalImageUrls = [...formData.image_urls, ...uploadedUrls];

      const { technology_ids, ...rest } = formData;
      const projectData = { ...rest, image_urls: finalImageUrls };

      if (editingProject) {
        const { error } = await updateProject(editingProject.id, projectData, technology_ids);
          if (error) {
          setError(error);
          } else {
            if (editingProject) await saveDetails(editingProject.id);
            router.refresh();
          handleCloseForm();
        }
      } else {
        const { data, error } = await createProject(projectData, technology_ids);
        if (error) {
          setError(error);
        } else {
          if (data) await saveDetails(data.id);
          router.refresh();
          handleCloseForm();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete project "${title}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    const { error } = await deleteProject(id);

    if (error) {
      alert(`Error: ${error}`);
    } else {
      setProjects(projects.filter((p) => p.id !== id));
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const columns: Column<ProjectWithTechnologies>[] = [
    {
      key: "title",
      label: "Project Title",
      width: "25%",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "slug",
      label: "Slug",
      width: "20%",
      render: (value) => <code className="text-xs bg-slate-100 px-2 py-1 rounded">{value}</code>,
    },
    {
      key: "technologies",
      label: "Technologies",
      width: "30%",
      render: (techs: Technology[]) => (
        <div className="flex flex-wrap gap-1">
          {techs.slice(0, 3).map((tech) => (
            <Badge key={tech.id} variant="info">
              {tech.name}
            </Badge>
          ))}
          {techs.length > 3 && (
            <Badge variant="default">+{techs.length - 3}</Badge>
          )}
        </div>
      ),
    },
    {
      key: "id",
      label: "Actions",
      width: "25%",
      align: "right",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <TableAction
            icon="👁️"
            label="View"
            variant="secondary"
            onClick={() => window.open(`/projects/${row.slug}`, "_blank")}
          />
          <TableAction
            icon="✏️"
            label="Edit"
            variant="secondary"
            onClick={() => handleOpenForm(row)}
          />
          <TableAction
            icon="🗑️"
            label="Delete"
            variant="danger"
            onClick={() => handleDelete(row.id, row.title)}
          />
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Header
        title="Projects Management"
        subtitle="Manage your portfolio projects and showcase your work"
        userEmail={userEmail}
        onLogout={async () => {
          await handleLogout();
          router.push("/admin/login");
        }}
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{projects.length}</p>
              <p className="text-sm text-slate-600 mt-1">Total Projects</p>
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {projects.filter((p) => p.demo_url).length}
              </p>
              <p className="text-sm text-slate-600 mt-1">With Demo</p>
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {filteredProjects.length}
              </p>
              <p className="text-sm text-slate-600 mt-1">Showing</p>
            </div>
          </Card>
        </div>

        {/* Projects Table */}
        <Card
          title="Projects List"
          subtitle={`${filteredProjects.length} of ${projects.length} projects`}
          actions={
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="🔍"
                fullWidth={false}
                className="w-64"
              />
              <Button
                variant="primary"
                icon="➕"
                onClick={() => handleOpenForm()}
              >
                Add Project
              </Button>
            </div>
          }
          padding="none"
        >
          <Table
            columns={columns}
            data={filteredProjects}
            keyExtractor={(row) => row.id}
            emptyMessage="No projects found. Add your first project to showcase your work."
            hoverable
          />
        </Card>

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
            <Card
              title={editingProject ? "Edit Project" : "Add New Project"}
              subtitle={
                editingProject
                  ? "Update project information"
                  : "Fill in the form to add a new project"
              }
              className="w-full max-w-5xl my-8"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Project Title"
                    placeholder="e.g., E-commerce Platform"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({
                        ...formData,
                        title,
                        slug: editingProject ? formData.slug : generateSlug(title),
                      });
                    }}
                    required
                  />

                  <Input
                    label="Slug (URL-friendly)"
                    placeholder="e-commerce-platform"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                    helperText="Auto-generated from title"
                  />
                </div>

                <Textarea
                  label="Description"
                  placeholder="Describe your project..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Role"
                    placeholder="e.g., Full-stack Developer"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    helperText="Your role in the project"
                  />

                  <Input
                    label="Duration"
                    placeholder="e.g., 3 months"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    helperText="Project duration"
                  />

                  <Input
                    label="Platform"
                    placeholder="e.g., Web, Mobile, Desktop"
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value })
                    }
                    helperText="Target platform"
                  />

                  <Input
                    label="Team"
                    placeholder="e.g., Solo, 5 developers"
                    value={formData.team}
                    onChange={(e) =>
                      setFormData({ ...formData, team: e.target.value })
                    }
                    helperText="Team size or structure"
                  />
                </div>

                <MultipleImageUpload
                  label="Project Images"
                  value={formData.image_urls}
                  onFileSelect={(files) => setPendingImageFiles(files)}
                  bucket={STORAGE_BUCKETS.PROJECTS}
                  helperText="Select project images — they will be uploaded when you save (max 5MB, JPG/PNG/WEBP)"
                  preview
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Demo URL"
                    placeholder="https://demo.example.com"
                    value={formData.demo_url}
                    onChange={(e) =>
                      setFormData({ ...formData, demo_url: e.target.value })
                    }
                    helperText="Optional live demo link"
                  />

                  <Input
                    label="GitHub URL"
                    placeholder="https://github.com/username/repo"
                    value={formData.github_url}
                    onChange={(e) =>
                      setFormData({ ...formData, github_url: e.target.value })
                    }
                    helperText="Optional repository link"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Technologies Used
                  </label>
                  <div className="border border-slate-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {technologies.map((tech) => (
                        <label
                          key={tech.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={formData.technology_ids.includes(tech.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  technology_ids: [...formData.technology_ids, tech.id],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  technology_ids: formData.technology_ids.filter(
                                    (id) => id !== tech.id
                                  ),
                                });
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{tech.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {formData.technology_ids.length} selected
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-5 space-y-5">
                  <div>
                    <h3 className="font-semibold text-slate-900">Project Details</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Manage problems, solutions, designs, features, testings, results, and learnings.
                    </p>
                  </div>
                  {detailsLoading ? (
                    <p className="text-sm text-slate-500">Loading project details...</p>
                  ) : (
                    <div className="space-y-4">
                      {(Object.keys(entityConfigs) as SectionKey[]).map((key) => (
                        <EntityListEditor
                          key={key}
                          config={entityConfigs[key]}
                          items={detailDrafts[key] || []}
                          onChange={(items) =>
                            setDetailDrafts((current) => ({
                              ...current,
                              [key]: items,
                            }))
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCloseForm}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon="💾"
                    loading={loading}
                    disabled={loading}
                  >
                    {editingProject ? "Update" : "Create"} Project
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
