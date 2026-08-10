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
  PdfUpload,
  type Column,
} from "@/components/admin";
import { Certification } from "@/types/portfolio";
import {
  createCertification,
  updateCertification,
  deleteCertification,
} from "@/lib/actions/portfolio";
import { handleLogout } from "../logout-action";
import { STORAGE_BUCKETS } from "@/lib/supabase/storage";

interface CertificationsClientProps {
  initialCertifications: Certification[];
  userEmail: string;
  error: string | null;
}

export function CertificationsClient({
  initialCertifications,
  userEmail,
  error: initialError,
}: CertificationsClientProps) {
  const router = useRouter();
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    issue_date: "",
    credential_url: "",
    image_url: "",
    description: "",
  });

  const filteredCerts = certifications.filter(
    (cert) =>
      cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (cert?: Certification) => {
    if (cert) {
      setEditingCert(cert);
      setFormData({
        name: cert.name,
        issuer: cert.issuer,
        issue_date: cert.issue_date,
        credential_url: cert.credential_url || "",
        image_url: cert.image_url || "",
        description: cert.description || "",
      });
    } else {
      setEditingCert(null);
      setFormData({
        name: "",
        issuer: "",
        issue_date: "",
        credential_url: "",
        image_url: "",
        description: "",
      });
    }
    setIsFormOpen(true);
    setError(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCert(null);
    setFormData({
      name: "",
      issuer: "",
      issue_date: "",
      credential_url: "",
      image_url: "",
      description: "",
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingCert) {
        const { data, error } = await updateCertification(editingCert.id, formData);
        if (error) {
          setError(error);
        } else if (data) {
          setCertifications(certifications.map((c) => (c.id === data.id ? data : c)));
          handleCloseForm();
        }
      } else {
        const { data, error } = await createCertification(formData);
        if (error) {
          setError(error);
        } else if (data) {
          setCertifications([...certifications, data]);
          handleCloseForm();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete certification "${name}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    const { error } = await deleteCertification(id);

    if (error) {
      alert(`Error: ${error}`);
    } else {
      setCertifications(certifications.filter((c) => c.id !== id));
    }
    setLoading(false);
  };

  const columns: Column<Certification>[] = [
    {
      key: "name",
      label: "Certification Name",
      width: "30%",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "issuer",
      label: "Issuer",
      width: "25%",
      render: (value) => <Badge variant="info">{value}</Badge>,
    },
    {
      key: "issue_date",
      label: "Issue Date",
      width: "15%",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "credential_url",
      label: "Credential",
      width: "10%",
      align: "center",
      render: (value) =>
        value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            🔗 View
          </a>
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
    {
      key: "id",
      label: "Actions",
      width: "20%",
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

  const issuers = Array.from(new Set(certifications.map((c) => c.issuer)));

  return (
    <AdminLayout>
      <Header
        title="Certifications Management"
        subtitle="Manage your professional certifications and credentials"
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
              <p className="text-3xl font-bold text-yellow-600">{certifications.length}</p>
              <p className="text-sm text-slate-600 mt-1">Total Certifications</p>
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{issuers.length}</p>
              <p className="text-sm text-slate-600 mt-1">Issuers</p>
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{filteredCerts.length}</p>
              <p className="text-sm text-slate-600 mt-1">Showing</p>
            </div>
          </Card>
        </div>

        <Card
          title="Certifications List"
          subtitle={`${filteredCerts.length} of ${certifications.length} certifications`}
          actions={
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search certifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="🔍"
                fullWidth={false}
                className="w-64"
              />
              <Button variant="primary" icon="➕" onClick={() => handleOpenForm()}>
                Add Certification
              </Button>
            </div>
          }
          padding="none"
        >
          <Table
            columns={columns}
            data={filteredCerts}
            keyExtractor={(row) => row.id}
            emptyMessage="No certifications found. Add your first certification."
            hoverable
          />
        </Card>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <Card
              title={editingCert ? "Edit Certification" : "Add New Certification"}
              subtitle={editingCert ? "Update certification information" : "Fill in the form"}
              className="w-full max-w-2xl my-8"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Input
                  label="Certification Name"
                  placeholder="e.g., AWS Certified Solutions Architect"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Issuer"
                    placeholder="e.g., Amazon Web Services"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    required
                  />

                  <Input
                    label="Issue Date"
                    type="date"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Credential URL"
                  placeholder="https://credential.example.com/verify"
                  value={formData.credential_url}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  helperText="Optional verification link"
                />

                <PdfUpload
                  label="Certification Document (PDF)"
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  bucket={STORAGE_BUCKETS.CERTIFICATIONS}
                  helperText="Upload certificate PDF document (max 10MB)"
                />

                <Textarea
                  label="Description"
                  placeholder="Additional details about this certification..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={handleCloseForm} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" icon="💾" loading={loading} disabled={loading}>
                    {editingCert ? "Update" : "Create"} Certification
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
