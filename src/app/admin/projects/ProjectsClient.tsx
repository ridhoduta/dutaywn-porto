"use client";

import { useState } from "react";
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
} from "@/components/admin";
import { ProjectWithTechnologies, Technology } from "@/types/portfolio";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/actions/portfolio";
import { handleLogout } from "../logout-action";
import { STORAGE_BUCKETS, uploadImage } from "@/lib/supabase/storage";
import { MultipleImageUpload } from "@/components/admin/MultipleImageUpload";

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

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
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

  const handleOpenForm = (project?: ProjectWithTechnologies) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        slug: project.slug,
        description: project.description,
        image_urls: project.image_urls,
        demo_url: project.demo_url || "",
        github_url: project.github_url || "",
        technology_ids: project.technologies.map((t) => t.id),
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        slug: "",
        description: "",
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
      image_urls: [],
      demo_url: "",
      github_url: "",
      technology_ids: [],
    });
    setError(null);
    setPendingImageFiles([]);
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

      const { technology_ids, image_urls: _removed, ...rest } = formData;
      const projectData = { ...rest, image_urls: finalImageUrls };

      if (editingProject) {
        const { error } = await updateProject(editingProject.id, projectData, technology_ids);
        if (error) {
          setError(error);
        } else {
          router.refresh();
          handleCloseForm();
        }
      } else {
        const { error } = await createProject(projectData, technology_ids);
        if (error) {
          setError(error);
        } else {
          router.refresh();
          handleCloseForm();
        }
      }
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <Card
              title={editingProject ? "Edit Project" : "Add New Project"}
              subtitle={
                editingProject
                  ? "Update project information"
                  : "Fill in the form to add a new project"
              }
              className="w-full max-w-2xl my-8"
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
