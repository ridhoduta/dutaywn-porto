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
import { Education } from "@/types/portfolio";
import {
  createEducation,
  updateEducation,
  deleteEducation,
} from "@/lib/actions/portfolio";
import { handleLogout } from "../logout-action";

interface EducationClientProps {
  initialEducation: Education[];
  userEmail: string;
  error: string | null;
}

export function EducationClient({
  initialEducation,
  userEmail,
  error: initialError,
}: EducationClientProps) {
  const router = useRouter();
  const [education, setEducation] = useState<Education[]>(initialEducation);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const filteredEducation = education.filter(
    (edu) =>
      edu.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edu.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edu.field.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (edu?: Education) => {
    if (edu) {
      setEditingEdu(edu);
      setFormData({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        description: edu.description || "",
        start_date: edu.start_date,
        end_date: edu.end_date || "",
      });
    } else {
      setEditingEdu(null);
      setFormData({
        institution: "",
        degree: "",
        field: "",
        description: "",
        start_date: "",
        end_date: "",
      });
    }
    setIsFormOpen(true);
    setError(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEdu(null);
    setFormData({
      institution: "",
      degree: "",
      field: "",
      description: "",
      start_date: "",
      end_date: "",
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingEdu) {
        const { data, error } = await updateEducation(editingEdu.id, formData);
        if (error) {
          setError(error);
        } else if (data) {
          setEducation(education.map((e) => (e.id === data.id ? data : e)));
          handleCloseForm();
        }
      } else {
        const { data, error } = await createEducation(formData);
        if (error) {
          setError(error);
        } else if (data) {
          setEducation([...education, data]);
          handleCloseForm();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, institution: string) => {
    if (!confirm(`Delete education from "${institution}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    const { error } = await deleteEducation(id);

    if (error) {
      alert(`Error: ${error}`);
    } else {
      setEducation(education.filter((e) => e.id !== id));
    }
    setLoading(false);
  };

  const columns: Column<Education>[] = [
    {
      key: "institution",
      label: "Institution",
      width: "25%",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "degree",
      label: "Degree",
      width: "20%",
      render: (value) => <Badge variant="success">{value}</Badge>,
    },
    {
      key: "field",
      label: "Field of Study",
      width: "20%",
    },
    {
      key: "start_date",
      label: "Period",
      width: "20%",
      render: (_, row) => {
        const start = new Date(row.start_date).getFullYear();
        const end = row.end_date ? new Date(row.end_date).getFullYear() : "Present";
        return (
          <span className="text-sm text-slate-600">
            {start} - {end}
          </span>
        );
      },
    },
    {
      key: "id",
      label: "Actions",
      width: "15%",
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
            onClick={() => handleDelete(row.id, row.institution)}
          />
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Header
        title="Education Management"
        subtitle="Manage your educational background and qualifications"
        userEmail={userEmail}
        onLogout={async () => {
          await handleLogout();
          router.push("/admin/login");
        }}
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{education.length}</p>
              <p className="text-sm text-slate-600 mt-1">Total Education</p>
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {education.filter((e) => !e.end_date).length}
              </p>
              <p className="text-sm text-slate-600 mt-1">Ongoing</p>
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{filteredEducation.length}</p>
              <p className="text-sm text-slate-600 mt-1">Showing</p>
            </div>
          </Card>
        </div>

        <Card
          title="Education List"
          subtitle={`${filteredEducation.length} of ${education.length} entries`}
          actions={
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search education..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="🔍"
                fullWidth={false}
                className="w-64"
              />
              <Button variant="primary" icon="➕" onClick={() => handleOpenForm()}>
                Add Education
              </Button>
            </div>
          }
          padding="none"
        >
          <Table
            columns={columns}
            data={filteredEducation}
            keyExtractor={(row) => row.id}
            emptyMessage="No education entries found. Add your first educational background."
            hoverable
          />
        </Card>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <Card
              title={editingEdu ? "Edit Education" : "Add New Education"}
              subtitle={editingEdu ? "Update education information" : "Fill in the form"}
              className="w-full max-w-2xl my-8"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Input
                  label="Institution"
                  placeholder="e.g., University of Indonesia"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Degree"
                    placeholder="e.g., Bachelor of Science"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    required
                  />

                  <Input
                    label="Field of Study"
                    placeholder="e.g., Computer Science"
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />

                  <Input
                    label="End Date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    helperText="Leave empty if currently studying"
                  />
                </div>

                <Textarea
                  label="Description"
                  placeholder="Additional details, achievements, or coursework..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={handleCloseForm} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" icon="💾" loading={loading} disabled={loading}>
                    {editingEdu ? "Update" : "Create"} Education
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
