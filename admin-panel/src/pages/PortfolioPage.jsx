// src/pages/PortfolioPage.jsx
import React, { useState } from "react";
import TagInput from "../components/TagInput";
import ImageUpload from "../components/ImageUpload";
import Navbar from "../components/Navbar";

/**
 * PortfolioPage editor for the provided Portfolio model.
 * - payload: JSON string in 'payload' form field
 * - project images uploaded as `projectImage_<index>`
 */

const defaultModel = {
  recentWork: {
    heading: "Creative works with our incredible people.",
    subheading: "Creative works with our incredible people.",
    services: ["Design", "Development", "Marketing", "Writing"],
  },
  projects: [
    {
      title: "Harash Denmark",
      year: 2010,
      category: "Branding",
      imageUrl: "https://yourcdn.com/images/harash.webp",
    },
  ],
};

export default function PortfolioPage() {
  const [model, setModel] = useState(defaultModel);
  // maintain file objects for each project's image (index -> File or null)
  const [projectImages, setProjectImages] = useState([]); // array of File | null
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // helpers
  const setRecentWork = (patch) =>
    setModel((m) => ({ ...m, recentWork: { ...m.recentWork, ...patch } }));

  const setProjects = (arr) => setModel((m) => ({ ...m, projects: arr }));

  // Projects manipulation
  const addProject = () => {
    const newProject = {
      title: "New Project",
      year: new Date().getFullYear(),
      category: "Uncategorized",
      imageUrl: "",
    };
    setProjects([...model.projects, newProject]);
    setProjectImages((prev) => [...prev, null]);
  };

  const updateProject = (index, patch) => {
    const next = model.projects.map((p, i) => (i === index ? { ...p, ...patch } : p));
    setProjects(next);
  };

  const removeProject = (index) => {
    const next = model.projects.filter((_, i) => i !== index);
    setProjects(next);
    setProjectImages((prev) => prev.filter((_, i) => i !== index));
  };

  // handle image file selected for a project (files: File[])
  const handleProjectImageChange = (index, files) => {
    setProjectImages((prev) => {
      const copy = [...prev];
      copy[index] = files && files.length ? files[0] : null;
      return copy;
    });
    // clear imageUrl to indicate replacement on server
    if (model.projects[index]) updateProject(index, { imageUrl: "" });
  };

  // services (tags) for recentWork
  const setRecentServices = (arr) =>
    setRecentWork({ services: arr });

  // submit handler: sends JSON payload + images
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const fd = new FormData();

      // create payload copy and clear imageUrl fields for uploaded files
      const payload = JSON.parse(JSON.stringify(model));

      payload.projects = payload.projects.map((p, idx) => ({
        ...p,
        // if a file exists in projectImages for this index, set imageUrl to empty
        imageUrl: projectImages[idx] ? "" : p.imageUrl || "",
      }));

      fd.append("payload", JSON.stringify(payload));

      // append project image files
      projectImages.forEach((file, idx) => {
        if (file) {
          fd.append(`projectImage_${idx}`, file, file.name);
        }
      });

      const res = await api.post("/admin/portfolio", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data?.message || "Portfolio saved successfully.");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  };

  // reset back to default
  const handleReset = () => {
    setModel(defaultModel);
    setProjectImages([]);
    setMessage("");
  };

  return (
    // <div className="p-6 max-w-5xl mx-auto">
    <div className="p-1  mx-auto">
        <Navbar />
      <h1 className="text-2xl font-semibold mb-4 p-6 max-w-5xl mx-auto">Edit Portfolio</h1>

      {message && (
        <div className="mb-4 px-4 py-2 rounded bg-white/6 text-sm ">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl  mx-auto">
        {/* Recent Work */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <h2 className="font-medium mb-3">Recent Work</h2>

          <label className="text-sm text-[var(--muted)]">Heading</label>
          <input
            type="text"
            value={model.recentWork.heading}
            onChange={(e) => setRecentWork({ heading: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />

          <label className="text-sm text-[var(--muted)] mt-3 block">Subheading</label>
          <input
            type="text"
            value={model.recentWork.subheading}
            onChange={(e) => setRecentWork({ subheading: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />

          <div className="mt-3">
            <label className="text-sm text-[var(--muted)] block mb-2">Services</label>
            <TagInput value={model.recentWork.services} onChange={setRecentServices} />
          </div>
        </section>

        {/* Projects */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Projects</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addProject}
                className="px-3 py-1 rounded bg-white/6 text-sm"
              >
                + Add project
              </button>
              <button
                type="button"
                onClick={() => {
                  // quick add sample project
                  const newP = {
                    title: "New Project",
                    year: new Date().getFullYear(),
                    category: "Category",
                    imageUrl: "",
                  };
                  setProjects([...model.projects, newP]);
                  setProjectImages((prev) => [...prev, null]);
                }}
                className="px-3 py-1 rounded bg-white/6 text-sm"
              >
                + Sample
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {model.projects.map((p, idx) => (
              <div key={idx} className="p-3 rounded bg-[#0b1220] border border-white/8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm text-[var(--muted)]">Title</label>
                        <input
                          value={p.title}
                          onChange={(e) => updateProject(idx, { title: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-[var(--muted)]">Year</label>
                        <input
                          type="number"
                          value={p.year}
                          onChange={(e) => updateProject(idx, { year: Number(e.target.value) || new Date().getFullYear() })}
                          className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-[var(--muted)]">Category</label>
                        <input
                          value={p.category}
                          onChange={(e) => updateProject(idx, { category: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-sm text-[var(--muted)]">Image</label>
                      <ImageUpload
                        value={projectImages[idx] ? [projectImages[idx]] : []}
                        onChange={(files) => handleProjectImageChange(idx, files)}
                        maxFiles={1}
                        maxSizeMB={5}
                        label="Upload project image"
                      />
                      <div className="text-xs text-[var(--muted)] mt-2">
                        Current image path: {p.imageUrl || "— (upload to replace)"}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="px-3 py-1 rounded bg-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {model.projects.length === 0 && (
              <div className="text-[var(--muted)] text-sm py-4 text-center">No projects yet — add one.</div>
            )}
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-[var(--accent)] text-black font-medium"
          >
            {loading ? "Saving..." : "Save Portfolio"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded bg-white/6"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
