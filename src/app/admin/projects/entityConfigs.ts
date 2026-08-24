import type { EntityConfig } from "@/components/admin/EntityListEditor";
import { STORAGE_BUCKETS } from "@/lib/supabase/storage";

export const entityConfigs: Record<string, EntityConfig> = {
  problems: {
    title: "Problems",
    icon: "⚠️",
    fields: [
      {
        name: "title",
        label: "Problem Title",
        type: "text",
        placeholder: "e.g., Slow page load times",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Describe the problem in detail...",
        required: true,
        rows: 3,
      },
    ],
  },

  solutions: {
    title: "Solutions",
    icon: "💡",
    fields: [
      {
        name: "title",
        label: "Solution Title",
        type: "text",
        placeholder: "e.g., Implemented lazy loading",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Explain how the solution works...",
        required: true,
        rows: 3,
      },
      {
        name: "icon",
        label: "Icon (optional)",
        type: "text",
        placeholder: "e.g., 🚀 or emoji/icon identifier",
        required: false,
      },
    ],
  },

  designs: {
    title: "Designs",
    icon: "🎨",
    fields: [
      {
        name: "type",
        label: "Design Type",
        type: "select",
        required: true,
        options: [
          { value: "wireframe", label: "Wireframe" },
          { value: "mockup", label: "Mockup" },
          { value: "prototype", label: "Prototype" },
          { value: "uml", label: "UML Diagram" },
          { value: "flowchart", label: "Flowchart" },
        ],
      },
      {
        name: "title",
        label: "Design Title",
        type: "text",
        placeholder: "e.g., User Dashboard Mockup",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Describe the design...",
        required: true,
        rows: 2,
      },
      {
        name: "image_url",
        label: "Design Image / Document",
        type: "image",
        bucket: STORAGE_BUCKETS.DOCUMENTS,
        placeholder: "https://example.com/design.png",
        required: true,
      },
    ],
  },

  features: {
    title: "Features",
    icon: "⭐",
    fields: [
      {
        name: "title",
        label: "Feature Title",
        type: "text",
        placeholder: "e.g., User Authentication",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Describe the feature...",
        required: true,
        rows: 3,
      },
      {
        name: "image_url",
        label: "Feature Image / Screenshot (optional)",
        type: "image",
        bucket: STORAGE_BUCKETS.DOCUMENTS,
        placeholder: "https://example.com/feature.png",
        required: false,
      },
    ],
  },

  testings: {
    title: "Test Cases",
    icon: "🧪",
    fields: [
      {
        name: "test_case",
        label: "Test Case",
        type: "text",
        placeholder: "e.g., Login with valid credentials",
        required: true,
      },
      {
        name: "expected_result",
        label: "Expected Result",
        type: "textarea",
        placeholder: "What should happen...",
        required: true,
        rows: 2,
      },
      {
        name: "actual_result",
        label: "Actual Result",
        type: "textarea",
        placeholder: "What actually happened...",
        required: true,
        rows: 2,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { value: "passed", label: "✅ Passed" },
          { value: "failed", label: "❌ Failed" },
          { value: "pending", label: "⏳ Pending" },
          { value: "skipped", label: "⏭️ Skipped" },
        ],
      },
    ],
  },

  results: {
    title: "Results",
    icon: "📊",
    fields: [
      {
        name: "title",
        label: "Result Title",
        type: "text",
        placeholder: "e.g., Performance Improvement",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Describe the result...",
        required: true,
        rows: 2,
      },
    ],
  },

  learnings: {
    title: "Learnings",
    icon: "📚",
    fields: [
      {
        name: "content",
        label: "Learning Content",
        type: "textarea",
        placeholder: "What did you learn from this project?",
        required: true,
        rows: 3,
      },
    ],
  },
};
