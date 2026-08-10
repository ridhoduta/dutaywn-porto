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
  ImageUpload,
} from "@/components/admin";
import { Profile } from "@/types/portfolio";
import { updateProfile } from "@/lib/actions/portfolio";
import { handleLogout } from "../logout-action";
import { STORAGE_BUCKETS } from "@/lib/supabase/storage";

interface ProfileClientProps {
  initialProfile: Profile | null;
  userEmail: string;
  error: string | null;
}

export function ProfileClient({
  initialProfile,
  userEmail,
  error: initialError,
}: ProfileClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: initialProfile?.name || "",
    title: initialProfile?.title || "",
    description: initialProfile?.description || "",
    location: initialProfile?.location || "",
    email: initialProfile?.email || "",
    phone: initialProfile?.phone || "",
    profile_image: initialProfile?.profile_image || "",
    github_url: initialProfile?.github_url || "",
    linkedin_url: initialProfile?.linkedin_url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await updateProfile(formData);
      if (error) {
        setError(error);
      } else {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm("Discard all changes and reset to saved values?")) {
      setFormData({
        name: initialProfile?.name || "",
        title: initialProfile?.title || "",
        description: initialProfile?.description || "",
        location: initialProfile?.location || "",
        email: initialProfile?.email || "",
        phone: initialProfile?.phone || "",
        profile_image: initialProfile?.profile_image || "",
        github_url: initialProfile?.github_url || "",
        linkedin_url: initialProfile?.linkedin_url || "",
      });
      setError(null);
      setSuccess(false);
    }
  };

  return (
    <AdminLayout>
      <Header
        title="Profile Management"
        subtitle="Manage your personal information and contact details"
        userEmail={userEmail}
        onLogout={async () => {
          await handleLogout();
          router.push("/admin/login");
        }}
      />

      <div className="p-6 space-y-6">
        {/* Preview Card */}
        <Card title="Profile Preview" subtitle="How your profile appears on the public site">
          <div className="flex items-start gap-6">
            {formData.profile_image ? (
              <img
                src={formData.profile_image}
                alt={formData.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center border-4 border-slate-200">
                <span className="text-white font-bold text-3xl">
                  {formData.name.charAt(0) || "?"}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900">
                {formData.name || "Your Name"}
              </h3>
              <p className="text-lg text-blue-600 mt-1">
                {formData.title || "Your Title"}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                {formData.description || "Your description"}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                {formData.location && (
                  <span className="flex items-center gap-1">
                    📍 {formData.location}
                  </span>
                )}
                {formData.email && (
                  <span className="flex items-center gap-1">
                    ✉️ {formData.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <span>✓</span>
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <Card title="Basic Information" subtitle="Your name and professional title">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="e.g., John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Professional Title"
                placeholder="e.g., Full Stack Developer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <Textarea
              label="About Me"
              placeholder="Brief description about yourself..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              helperText="A short bio that appears on your portfolio"
            />

            <ImageUpload
              label="Profile Image"
              value={formData.profile_image}
              onChange={(url) => setFormData({ ...formData, profile_image: url })}
              bucket={STORAGE_BUCKETS.PROFILES}
              helperText="Upload your profile photo (max 5MB, JPG/PNG/WEBP)"
              preview
            />
          </Card>

          {/* Contact Information */}
          <Card title="Contact Information" subtitle="How people can reach you">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon="✉️"
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+62 812 3456 7890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                icon="📱"
              />

              <Input
                label="Location"
                placeholder="e.g., Jakarta, Indonesia"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                icon="📍"
              />
            </div>
          </Card>

          {/* Social Links */}
          <Card title="Social Links" subtitle="Your professional social media profiles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="GitHub URL"
                placeholder="https://github.com/username"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                icon="💻"
                helperText="Your GitHub profile link"
              />

              <Input
                label="LinkedIn URL"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                icon="💼"
                helperText="Your LinkedIn profile link"
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              disabled={loading}
            >
              Reset Changes
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon="💾"
              loading={loading}
              disabled={loading}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
