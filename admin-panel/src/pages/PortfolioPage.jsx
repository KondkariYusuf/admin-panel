// src/pages/PortfolioPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import TagInput from "../components/TagInput";
import ImageUpload from "../components/ImageUpload";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";

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
  const [projectImages, setProjectImages] = useState([]); // File per project index
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [portfolioId, setPortfolioId] = useState(null);

  const setRecentWork = (patch) =>
    setModel((m) => ({ ...m, recentWork: { ...m.recentWork, ...patch } }));

  const setProjects = (arr) => setModel((m) => ({ ...m, projects: arr }));

  useEffect(() => {
    (async function load() {
      try {
        setLoading(true);
        const res = await api.get("/portfolio");
        if (res?.data) {
          const portfolio = res.data;
          setModel({
            recentWork: portfolio.recentWork || emptyModel.recentWork,
            projects: portfolio.projects || [],
          });
          setPortfolioId(portfolio._id || null);
          setProjectImages(
            Array((portfolio.projects || []).length).fill(null)
          );
        } else {
          setModel(emptyModel);
        }
      } catch (err) {
        console.warn(
          "Load portfolio failed (may be empty):",
          err?.response?.data || err.message
        );
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
    const next = model.projects.map((p, i) =>
      i === index ? { ...p, ...patch } : p
    );
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
    // clear imageUrl -> server will replace via Cloudinary
    updateProjectLocal(index, { imageUrl: "" });
  };

  // MAIN SAVE (Create/Update) with multipart + Cloudinary
  const savePortfolio = async (e) => {
    e?.preventDefault?.();
    setMessage("");
    setLoading(true);

    try {
      const fd = new FormData();
      const payload = JSON.parse(JSON.stringify(model));

      // Clear imageUrl where new file selected
      payload.projects = (payload.projects || []).map((p, idx) => {
        const hasFile = !!projectImages[idx];
        return hasFile ? { ...p, imageUrl: "" } : p;
      });

      fd.append("payload", JSON.stringify(payload));

      // Attach image files
      projectImages.forEach((file, idx) => {
        if (file) {
          fd.append(`projectImage_${idx}`, file, file.name);
        }
      });

      let res;
      if (portfolioId) {
        // update existing singleton
        res = await api.put("/portfolio", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // create new portfolio
        res = await api.post("/portfolio", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const data = res.data;
      setMessage(data?.message || (portfolioId ? "Portfolio updated." : "Portfolio created."));

      if (data?.portfolio?._id) {
        setPortfolioId(data.portfolio._id);
        // sync local model with server response if you want:
        if (data.portfolio.projects) {
          setProjects(data.portfolio.projects);
          setProjectImages(
            Array((data.portfolio.projects || []).length).fill(null)
          );
        }
        if (data.portfolio.recentWork) {
          setRecentWork(data.portfolio.recentWork);
        }
      }
    } catch (err) {
      console.error("savePortfolio error:", err);
      setMessage(
        err.response?.data?.message || err.message || "Save failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // Remote project operations – JSON only (no file upload here)
  const addProjectRemote = async (index) => {
    if (!portfolioId) {
      setMessage(
        "Create a portfolio first (Save Portfolio) before adding single projects via API."
      );
      return;
    }
    const project = model.projects[index];
    if (!project) {
      setMessage("Project not found.");
      return;
    }

    if (projectImages[index]) {
      setMessage(
        "To upload a new image for this project, use Save Portfolio instead of Add remote."
      );
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await api.post(`/portfolio/${portfolioId}/projects`, {
        title: project.title,
        year: project.year,
        category: project.category,
        imageUrl: project.imageUrl || "",
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
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Add project failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateProjectRemote = async (index) => {
    const project = model.projects[index];
    if (!portfolioId || !project || !project._id) {
      setMessage(
        "Project must exist on server (has _id) to update remotely. Use Save Portfolio to create portfolio first."
      );
      return;
    }

    if (projectImages[index]) {
      setMessage(
        "To upload a new image for this project, use Save Portfolio instead of Update remote."
      );
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await api.put(
        `/portfolio/${portfolioId}/projects/${project._id}`,
        {
          title: project.title,
          year: project.year,
          category: project.category,
          imageUrl: project.imageUrl || "",
        }
      );

      setMessage(res.data?.message || "Project updated.");
      if (res.data?.project) {
        const next = model.projects.map((p, i) =>
          i === index ? res.data.project : p
        );
        setProjects(next);
      }
    } catch (err) {
      console.error("updateProjectRemote error:", err);
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Update project failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteProjectRemote = async (index) => {
    const project = model.projects[index];
    if (!portfolioId || !project || !project._id) {
      removeProjectLocal(index);
      setMessage("Project removed locally.");
      return;
    }

    if (!confirm("Delete this project on server? This cannot be undone."))
      return;

    setLoading(true);
    setMessage("");
    try {
      const res = await api.delete(
        `/portfolio/${portfolioId}/projects/${project._id}`
      );
      setMessage(res.data?.message || "Project deleted.");
      removeProjectLocal(index);
    } catch (err) {
      console.error("deleteProjectRemote error:", err);
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Delete failed."
      );
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
      setModel(emptyModel);
      setPortfolioId(null);
      setProjectImages([]);
    } catch (err) {
      console.error("deletePortfolio error:", err);
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Delete failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Navbar />
      <div className="flex flex-col md:flex-row gap-6 px-4 py-6 max-w-7xl mx-auto w-full">
        <SideBar />
        <div className="flex-1">
          <div className="max-w-5xl w-full">
            <h1 className="text-2xl font-semibold mb-4 px-2">Edit Portfolio</h1>

            {message && (
              <div className="mb-4 px-4 py-2 rounded bg-white/6 text-sm ">
                {message}
              </div>
            )}

            <form onSubmit={savePortfolio} className="space-y-6 rounded-lg border border-white/5 bg-[var(--panel)]/50 p-6">
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

            <label className="text-sm text-[var(--muted)] mt-3 block">
              Subheading
            </label>
            <input
              type="text"
              value={model.recentWork.subheading}
              onChange={(e) => setRecentWork({ subheading: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
            />

            <div className="mt-3">
              <label className="text-sm text-[var(--muted)] block mb-2">
                Services
              </label>
              <TagInput
                value={model.recentWork.services}
                onChange={(arr) => setRecentWork({ services: arr })}
              />
            </div>
          </section>

          {/* Projects */}
          <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Projects</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addProjectLocal}
                  className="px-3 py-1 rounded bg-white/6 text-sm"
                >
                  + Add project (local)
                </button>

                <button
                  type="button"
                  onClick={() => {
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

                <button
                  type="button"
                  onClick={deletePortfolio}
                  className="px-3 py-1 rounded bg-red-600 text-sm"
                >
                  Delete Portfolio
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {model.projects.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded bg-[#0b1220] border border-white/8"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-sm text-[var(--muted)]">
                            Title
                          </label>
                          <input
                            value={p.title}
                            onChange={(e) =>
                              updateProjectLocal(idx, {
                                title: e.target.value,
                              })
                            }
                            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-[var(--muted)]">
                            Year
                          </label>
                          <input
                            type="number"
                            value={p.year}
                            onChange={(e) =>
                              updateProjectLocal(idx, {
                                year:
                                  Number(e.target.value) ||
                                  new Date().getFullYear(),
                              })
                            }
                            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-[var(--muted)]">
                            Category
                          </label>
                          <input
                            value={p.category}
                            onChange={(e) =>
                              updateProjectLocal(idx, {
                                category: e.target.value,
                              })
                            }
                            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="text-sm text-[var(--muted)]">
                          Image
                        </label>
                        <ImageUpload
                          value={projectImages[idx] ? [projectImages[idx]] : []}
                          onChange={(files) =>
                            handleProjectImageChange(idx, files)
                          }
                          maxFiles={1}
                          maxSizeMB={5}
                          label="Upload project image (optional)"
                        />
                        <div className="text-xs text-[var(--muted)] mt-2">
                          Current image path:{" "}
                          {p.imageUrl ||
                            "— (upload to replace or set URL manually)"}
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
                <div className="text-[var(--muted)] text-sm py-4 text-center">
                  No projects yet — add one.
                </div>
              )}
            </div>
          </section>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-[var(--accent)] text-black font-medium"
            >
              {loading
                ? "Saving..."
                : portfolioId
                ? "Save Portfolio (PUT)"
                : "Create Portfolio (POST)"}
            </button>

            <button
              type="button"
              onClick={() => {
                setModel(emptyModel);
                setProjectImages([]);
                setMessage("");
              }}
              className="px-4 py-2 rounded bg-white/6"
            >
              Reset
            </button>
          </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
