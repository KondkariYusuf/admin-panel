
// src/pages/PortfolioPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios.js"; 
import TagInput from "../components/TagInput";
import ImageUpload from "../components/ImageUpload";
import Navbar from "../components/Navbar";


 

const emptyModel = {
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
  const [model, setModel] = useState(emptyModel);
  const [projectImages, setProjectImages] = useState([]); // local File objects per project index
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [portfolioId, setPortfolioId] = useState(null); // holds _id from server if exists

  // helpers for updating nested fields
  const setRecentWork = (patch) =>
    setModel((m) => ({ ...m, recentWork: { ...m.recentWork, ...patch } }));

  const setProjects = (arr) => setModel((m) => ({ ...m, projects: arr }));

  useEffect(() => {
    // load existing portfolio on mount
    (async function load() {
      try {
        setLoading(true);
        const res = await api.get("/portfolio"); // controller: router.get('/', controller.getPortfolio);
        if (res?.data) {
          const portfolio = res.data;
          setModel({
            recentWork: portfolio.recentWork || emptyModel.recentWork,
            projects: portfolio.projects || [],
          });
          setPortfolioId(portfolio._id || null);
          // initialize projectImages array same length
          setProjectImages((prev) => Array((portfolio.projects || []).length).fill(null));
        } else {
          setModel(emptyModel);
        }
      } catch (err) {
        // If 404 or empty, keep default model
        console.warn("Load portfolio failed (may be empty):", err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Projects manipulation (client-side)
  const addProjectLocal = () => {
    const newP = {
      title: "New Project",
      year: new Date().getFullYear(),
      category: "Uncategorized",
      imageUrl: "",
    };
    setProjects([...model.projects, newP]);
    setProjectImages((prev) => [...prev, null]);
  };

  const updateProjectLocal = (index, patch) => {
    const next = model.projects.map((p, i) => (i === index ? { ...p, ...patch } : p));
    setProjects(next);
  };

  const removeProjectLocal = (index) => {
    const next = model.projects.filter((_, i) => i !== index);
    setProjects(next);
    setProjectImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProjectImageChange = (index, files) => {
    setProjectImages((prev) => {
      const copy = [...prev];
      copy[index] = files && files.length ? files[0] : null;
      return copy;
    });
    // clear imageUrl locally so it indicates a replacement needed
    updateProjectLocal(index, { imageUrl: "" });
  };

  
  async function uploadFile(file) {
    if (!file) return null;

    throw new Error(
      "No upload endpoint implemented. Implement POST /upload to accept files and return { url } or set imageUrl manually."
    );
  }

 
  const savePortfolio = async (e) => {
    e?.preventDefault?.();
    setMessage("");
    setLoading(true);

    try {
      
      const payload = JSON.parse(JSON.stringify(model));

      
      for (let i = 0; i < projectImages.length; i++) {
        const file = projectImages[i];
        if (file) {
          try {
            const url = await uploadFile(file); // <-- requires server /upload
            if (url) payload.projects[i].imageUrl = url;
          } catch (uploadErr) {
            // upload failed — inform user and stop; user can still save JSON-only portfolio if they remove files or give imageUrl manually
            setMessage(
              "File upload not configured. Either implement POST /upload or remove local images and use imageUrl strings."
            );
            setLoading(false);
            return;
          }
        }
      }

      let res;
      if (portfolioId) {
        // update existing portfolio
        res = await api.put(`/portfolio/${portfolioId}`, {
          recentWork: payload.recentWork,
          projects: payload.projects,
        });
        setMessage(res.data?.message || "Portfolio updated.");
      } else {
        // create new portfolio
        res = await api.post("/portfolio", {
          recentWork: payload.recentWork,
          projects: payload.projects,
        });
        setMessage(res.data?.message || "Portfolio created.");
        // store new id if returned
        if (res.data?.portfolio?._id) setPortfolioId(res.data.portfolio._id);
      }
    } catch (err) {
      console.error("savePortfolio error:", err);
      setMessage(err.response?.data?.message || err.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  };

 
  const addProjectRemote = async (index) => {
    if (!portfolioId) {
      setMessage("Create a portfolio first (Save Portfolio) before adding single projects via API.");
      return;
    }
    const project = model.projects[index];
    if (!project) {
      setMessage("Project not found.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      
      let imageUrlToSend = project.imageUrl || "";
      if (projectImages[index]) {
        try {
          const url = await uploadFile(projectImages[index]); // requires /upload endpoint
          imageUrlToSend = url;
        } catch (uploadErr) {
          setMessage("No upload endpoint configured. Provide imageUrl manually or implement /upload.");
          setLoading(false);
          return;
        }
      }

      const res = await api.post(`/portfolio/${portfolioId}/projects`, {
        title: project.title,
        year: project.year,
        category: project.category,
        imageUrl: imageUrlToSend,
      });

      if (res.data?.project) {
        const newProjects = [...model.projects];
        newProjects[index] = res.data.project;
        setProjects(newProjects);
        setMessage("Project added on server.");
      } else {
        setMessage(res.data?.message || "Project added.");
      }
    } catch (err) {
      console.error("addProjectRemote error:", err);
      setMessage(err.response?.data?.message || err.message || "Add project failed.");
    } finally {
      setLoading(false);
    }
  };

  
  
  const updateProjectRemote = async (index) => {
    const project = model.projects[index];
    if (!portfolioId || !project || !project._id) {
      setMessage("Project must exist on server (has _id) to update remotely. Use Save Portfolio to create portfolio first.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      let imageUrlToSend = project.imageUrl || "";
      if (projectImages[index]) {
        try {
          const url = await uploadFile(projectImages[index]);
          imageUrlToSend = url;
        } catch {
          setMessage("No upload endpoint configured. Provide imageUrl manually or implement /upload.");
          setLoading(false);
          return;
        }
      }

      const res = await api.put(
        `/portfolio/${portfolioId}/projects/${project._id}`,
        {
          title: project.title,
          year: project.year,
          category: project.category,
          imageUrl: imageUrlToSend,
        }
      );

      setMessage(res.data?.message || "Project updated.");
      // update local with server response (if provided)
      if (res.data?.project) {
        const next = model.projects.map((p, i) => (i === index ? res.data.project : p));
        setProjects(next);
      }
    } catch (err) {
      console.error("updateProjectRemote error:", err);
      setMessage(err.response?.data?.message || err.message || "Update project failed.");
    } finally {
      setLoading(false);
    }
  };

  
  const deleteProjectRemote = async (index) => {
    const project = model.projects[index];
    if (!portfolioId || !project || !project._id) {
      // If not on server yet, delete locally
      removeProjectLocal(index);
      setMessage("Project removed locally.");
      return;
    }

    if (!confirm("Delete this project on server? This cannot be undone.")) return;

    setLoading(true);
    setMessage("");
    try {
      const res = await api.delete(`/portfolio/${portfolioId}/projects/${project._id}`);
      setMessage(res.data?.message || "Project deleted.");
      // remove locally as well
      removeProjectLocal(index);
    } catch (err) {
      console.error("deleteProjectRemote error:", err);
      setMessage(err.response?.data?.message || err.message || "Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  
  const deletePortfolio = async () => {
    if (!portfolioId) {
      setMessage("No portfolio to delete.");
      return;
    }
    if (!confirm("Delete the entire portfolio from server?")) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await api.delete(`/portfolio/${portfolioId}`);
      setMessage(res.data?.message || "Portfolio deleted.");
      // reset local state
      setModel(emptyModel);
      setPortfolioId(null);
      setProjectImages([]);
    } catch (err) {
      console.error("deletePortfolio error:", err);
      setMessage(err.response?.data?.message || err.message || "Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="p-1 mx-auto">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Edit Portfolio</h1>

        {message && (
          <div className="mb-4 px-4 py-2 rounded bg-white/6 text-sm ">{message}</div>
        )}

        <form onSubmit={savePortfolio} className="space-y-6">
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
              <TagInput value={model.recentWork.services} onChange={(arr) => setRecentWork({ services: arr })} />
            </div>
          </section>

          {/* Projects */}
          <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Projects</h2>
              <div className="flex gap-2">
                <button type="button" onClick={addProjectLocal} className="px-3 py-1 rounded bg-white/6 text-sm">
                  + Add project (local)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    // quick add sample project
                    const newP = { title: "New Project", year: new Date().getFullYear(), category: "Category", imageUrl: "" };
                    setProjects([...model.projects, newP]);
                    setProjectImages((prev) => [...prev, null]);
                  }}
                  className="px-3 py-1 rounded bg-white/6 text-sm"
                >
                  + Sample
                </button>

                <button type="button" onClick={deletePortfolio} className="px-3 py-1 rounded bg-red-600 text-sm">
                  Delete Portfolio
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
                            onChange={(e) => updateProjectLocal(idx, { title: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-[var(--muted)]">Year</label>
                          <input
                            type="number"
                            value={p.year}
                            onChange={(e) => updateProjectLocal(idx, { year: Number(e.target.value) || new Date().getFullYear() })}
                            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-[var(--muted)]">Category</label>
                          <input
                            value={p.category}
                            onChange={(e) => updateProjectLocal(idx, { category: e.target.value })}
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
                          label="Upload project image (optional)"
                        />
                        <div className="text-xs text-[var(--muted)] mt-2">
                          Current image path: {p.imageUrl || "— (upload to replace or set URL manually)"}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => deleteProjectRemote(idx)}
                        className="px-3 py-1 rounded bg-red-600 text-sm"
                      >
                        Remove
                      </button>

                      <button
                        type="button"
                        onClick={() => updateProjectRemote(idx)}
                        className="px-3 py-1 rounded bg-white/6 text-sm"
                      >
                        Update remote
                      </button>

                      <button
                        type="button"
                        onClick={() => addProjectRemote(idx)}
                        className="px-3 py-1 rounded bg-white/6 text-sm"
                      >
                        Add remote
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
            <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-[var(--accent)] text-black font-medium">
              {loading ? "Saving..." : portfolioId ? "Save Portfolio (PUT)" : "Create Portfolio (POST)"}
            </button>

            <button type="button" onClick={() => { setModel(emptyModel); setProjectImages([]); setMessage(""); }} className="px-4 py-2 rounded bg-white/6">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
