"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminLayout,
  Header,
  Card,
  Button,
  Input,
  Table,
  TableAction,
  Badge,
  type Column,
} from "@/components/admin";
import { Skill } from "@/types/portfolio";
import {
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/lib/actions/portfolio";
import { handleLogout } from "../logout-action";

interface SkillsClientProps {
  initialSkills: Skill[];
  userEmail: string;
  error: string | null;
}

export function SkillsClient({
  initialSkills,
  userEmail,
  error: initialError,
}: SkillsClientProps) {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    icon: "",
  });

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        icon: skill.icon || "",
      });
    } else {
      setEditingSkill(null);
      setFormData({ name: "", category: "", icon: "" });
    }
    setIsFormOpen(true);
    setError(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSkill(null);
    setFormData({ name: "", category: "", icon: "" });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingSkill) {
        // Update existing skill
        const { data, error } = await updateSkill(editingSkill.id, formData);
        if (error) {
          setError(error);
        } else if (data) {
          setSkills(skills.map((s) => (s.id === data.id ? data : s)));
          handleCloseForm();
        }
      } else {
        // Create new skill
        const { data, error } = await createSkill(formData);
        if (error) {
          setError(error);
        } else if (data) {
          setSkills([...skills, data]);
          handleCloseForm();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete skill "${name}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    const { error } = await deleteSkill(id);

    if (error) {
      alert(`Error: ${error}`);
    } else {
      setSkills(skills.filter((s) => s.id !== id));
    }
    setLoading(false);
  };

  const columns: Column<Skill>[] = [
    {
      key: "icon",
      label: "Icon",
      width: "10%",
      align: "center",
      render: (value) => (
        <span className="text-2xl">{value || "⚡"}</span>
      ),
    },
    {
      key: "name",
      label: "Skill Name",
      width: "35%",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "category",
      label: "Category",
      width: "30%",
      render: (value) => <Badge variant="info">{value}</Badge>,
    },
    {
      key: "id",
      label: "Actions",
      width: "25%",
      align: "right",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
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
            onClick={() => handleDelete(row.id, row.name)}
          />
        </div>
      ),
    },
  ];

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <AdminLayout>
      <Header
        title="Skills Management"
        subtitle="Manage your technical skills and expertise"
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
              <p className="text-3xl font-bold text-blue-600">{skills.length}</p>
              <p className="text-sm text-slate-600 mt-1">Total Skills</p>
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {categories.length}
              </p>
              <p className="text-sm text-slate-600 mt-1">Categories</p>
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {filteredSkills.length}
              </p>
              <p className="text-sm text-slate-600 mt-1">Showing</p>
            </div>
          </Card>
        </div>

        {/* Skills Table */}
        <Card
          title="Skills List"
          subtitle={`${filteredSkills.length} of ${skills.length} skills`}
          actions={
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search skills..."
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
                Add Skill
              </Button>
            </div>
          }
          padding="none"
        >
          <Table
            columns={columns}
            data={filteredSkills}
            keyExtractor={(row) => row.id}
            emptyMessage="No skills found. Add your first skill to get started."
            hoverable
          />
        </Card>

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card
              title={editingSkill ? "Edit Skill" : "Add New Skill"}
              subtitle={
                editingSkill
                  ? "Update skill information"
                  : "Fill in the form to add a new skill"
              }
              className="w-full max-w-lg"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Input
                  label="Skill Name"
                  placeholder="e.g., React, Node.js, Python"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <Input
                  label="Category"
                  placeholder="e.g., Frontend, Backend, Database"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />

                <Input
                  label="Icon (Emoji)"
                  placeholder="e.g., ⚡, 🚀, 💻"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  helperText="Optional emoji to represent this skill"
                />

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
                    {editingSkill ? "Update" : "Create"} Skill
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
