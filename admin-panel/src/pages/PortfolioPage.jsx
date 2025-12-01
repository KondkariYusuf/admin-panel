// src/pages/PortfolioPage.jsx
// import React, { useEffect, useState } from "react";
// import api from "../api/axios.js";
// import TagInput from "../components/TagInput";
// import ImageUpload from "../components/ImageUpload";
// import Navbar from "../components/Navbar";
// import SideBar from "../components/SideBar";

// const emptyModel = {
//   recentWork: {
//     heading: "Creative works with our incredible people.",
//     subheading: "Creative works with our incredible people.",
//     services: ["Design", "Development", "Marketing", "Writing"],
//   },
//   projects: [
//     {
//       title: "Harash Denmark",
//       year: 2010,
//       category: "Branding",
//       imageUrl: "https://yourcdn.com/images/harash.webp",
//     },
//   ],
// };

// export default function PortfolioPage() {
//   const [model, setModel] = useState(emptyModel);
//   const [projectImages, setProjectImages] = useState([]); // File per project index
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [portfolioId, setPortfolioId] = useState(null);

//   const setRecentWork = (patch) =>
//     setModel((m) => ({ ...m, recentWork: { ...m.recentWork, ...patch } }));

//   const setProjects = (arr) => setModel((m) => ({ ...m, projects: arr }));

//   useEffect(() => {
//     (async function load() {
//       try {
//         setLoading(true);
//         const res = await api.get("/portfolio");
//         if (res?.data) {
//           const portfolio = res.data;
//           setModel({
//             recentWork: portfolio.recentWork || emptyModel.recentWork,
//             projects: portfolio.projects || [],
//           });
//           setPortfolioId(portfolio._id || null);
//           setProjectImages(
//             Array((portfolio.projects || []).length).fill(null)
//           );
//         } else {
//           setModel(emptyModel);
//         }
//       } catch (err) {
//         console.warn(
//           "Load portfolio failed (may be empty):",
//           err?.response?.data || err.message
//         );
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // Projects manipulation (client-side)
//   const addProjectLocal = () => {
//     const newP = {
//       title: "New Project",
//       year: new Date().getFullYear(),
//       category: "Uncategorized",
//       imageUrl: "",
//     };
//     setProjects([...model.projects, newP]);
//     setProjectImages((prev) => [...prev, null]);
//   };

//   const updateProjectLocal = (index, patch) => {
//     const next = model.projects.map((p, i) =>
//       i === index ? { ...p, ...patch } : p
//     );
//     setProjects(next);
//   };

//   const removeProjectLocal = (index) => {
//     const next = model.projects.filter((_, i) => i !== index);
//     setProjects(next);
//     setProjectImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleProjectImageChange = (index, files) => {
//     setProjectImages((prev) => {
//       const copy = [...prev];
//       copy[index] = files && files.length ? files[0] : null;
//       return copy;
//     });
//     // clear imageUrl -> server will replace via Cloudinary
//     updateProjectLocal(index, { imageUrl: "" });
//   };

//   // MAIN SAVE (Create/Update) with multipart + Cloudinary
//   const savePortfolio = async (e) => {
//     e?.preventDefault?.();
//     setMessage("");
//     setLoading(true);

//     try {
//       const fd = new FormData();
//       const payload = JSON.parse(JSON.stringify(model));

//       // Clear imageUrl where new file selected
//       payload.projects = (payload.projects || []).map((p, idx) => {
//         const hasFile = !!projectImages[idx];
//         return hasFile ? { ...p, imageUrl: "" } : p;
//       });

//       fd.append("payload", JSON.stringify(payload));

//       // Attach image files
//       projectImages.forEach((file, idx) => {
//         if (file) {
//           fd.append(`projectImage_${idx}`, file, file.name);
//         }
//       });

//       let res;
//       if (portfolioId) {
//         // update existing singleton
//         res = await api.put("/portfolio", fd, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else {
//         // create new portfolio
//         res = await api.post("/portfolio", fd, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       const data = res.data;
//       setMessage(
//         data?.message || (portfolioId ? "Portfolio updated." : "Portfolio created.")
//       );

//       if (data?.portfolio?._id) {
//         setPortfolioId(data.portfolio._id);
//         // sync local model with server response if you want:
//         if (data.portfolio.projects) {
//           setProjects(data.portfolio.projects);
//           setProjectImages(
//             Array((data.portfolio.projects || []).length).fill(null)
//           );
//         }
//         if (data.portfolio.recentWork) {
//           setRecentWork(data.portfolio.recentWork);
//         }
//       }
//     } catch (err) {
//       console.error("savePortfolio error:", err);
//       setMessage(
//         err.response?.data?.message || err.message || "Save failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Remote project operations – JSON only (no file upload here)
//   const addProjectRemote = async (index) => {
//     if (!portfolioId) {
//       setMessage(
//         "Create a portfolio first (Save Portfolio) before adding single projects via API."
//       );
//       return;
//     }
//     const project = model.projects[index];
//     if (!project) {
//       setMessage("Project not found.");
//       return;
//     }

//     if (projectImages[index]) {
//       setMessage(
//         "To upload a new image for this project, use Save Portfolio instead of Add remote."
//       );
//       return;
//     }

//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await api.post(`/portfolio/${portfolioId}/projects`, {
//         title: project.title,
//         year: project.year,
//         category: project.category,
//         imageUrl: project.imageUrl || "",
//       });

//       if (res.data?.project) {
//         const newProjects = [...model.projects];
//         newProjects[index] = res.data.project;
//         setProjects(newProjects);
//         setMessage("Project added on server.");
//       } else {
//         setMessage(res.data?.message || "Project added.");
//       }
//     } catch (err) {
//       console.error("addProjectRemote error:", err);
//       setMessage(
//         err.response?.data?.message ||
//           err.message ||
//           "Add project failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProjectRemote = async (index) => {
//     const project = model.projects[index];
//     if (!portfolioId || !project || !project._id) {
//       setMessage(
//         "Project must exist on server (has _id) to update remotely. Use Save Portfolio to create portfolio first."
//       );
//       return;
//     }

//     if (projectImages[index]) {
//       setMessage(
//         "To upload a new image for this project, use Save Portfolio instead of Update remote."
//       );
//       return;
//     }

//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await api.put(
//         `/portfolio/${portfolioId}/projects/${project._id}`,
//         {
//           title: project.title,
//           year: project.year,
//           category: project.category,
//           imageUrl: project.imageUrl || "",
//         }
//       );

//       setMessage(res.data?.message || "Project updated.");
//       if (res.data?.project) {
//         const next = model.projects.map((p, i) =>
//           i === index ? res.data.project : p
//         );
//         setProjects(next);
//       }
//     } catch (err) {
//       console.error("updateProjectRemote error:", err);
//       setMessage(
//         err.response?.data?.message ||
//           err.message ||
//           "Update project failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteProjectRemote = async (index) => {
//     const project = model.projects[index];
//     if (!portfolioId || !project || !project._id) {
//       removeProjectLocal(index);
//       setMessage("Project removed locally.");
//       return;
//     }

//     if (!confirm("Delete this project on server? This cannot be undone."))
//       return;

//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await api.delete(
//         `/portfolio/${portfolioId}/projects/${project._id}`
//       );
//       setMessage(res.data?.message || "Project deleted.");
//       removeProjectLocal(index);
//     } catch (err) {
//       console.error("deleteProjectRemote error:", err);
//       setMessage(
//         err.response?.data?.message ||
//           err.message ||
//           "Delete failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deletePortfolio = async () => {
//     if (!portfolioId) {
//       setMessage("No portfolio to delete.");
//       return;
//     }
//     if (!confirm("Delete the entire portfolio from server?")) return;
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await api.delete(`/portfolio/${portfolioId}`);
//       setMessage(res.data?.message || "Portfolio deleted.");
//       setModel(emptyModel);
//       setPortfolioId(null);
//       setProjectImages([]);
//     } catch (err) {
//       console.error("deletePortfolio error:", err);
//       setMessage(
//         err.response?.data?.message ||
//           err.message ||
//           "Delete failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="">
//       <Navbar />
//       <div className="flex flex-col md:flex-row gap-6 px-4 py-6 max-w-7xl mx-auto w-full">
//         <SideBar />
//         <div className="flex-1">
//           <div className="max-w-5xl w-full">
//             <h1 className="text-2xl font-semibold mb-4 px-2">Edit Portfolio</h1>

//             {message && (
//               <div className="mb-4 px-4 py-2 rounded bg-white/6 text-sm ">
//                 {message}
//               </div>
//             )}

//             <form onSubmit={savePortfolio} className="space-y-6 rounded-lg border border-white/5 bg-[var(--panel)]/50 p-6">
//           {/* Recent Work */}
//           <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
//             <h2 className="font-medium mb-3">Recent Work</h2>

//             <label className="text-sm text-[var(--muted)]">Heading</label>
//             <input
//               type="text"
//               value={model.recentWork.heading}
//               onChange={(e) => setRecentWork({ heading: e.target.value })}
//               className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
//             />

//             <label className="text-sm text-[var(--muted)] mt-3 block">
//               Subheading
//             </label>
//             <input
//               type="text"
//               value={model.recentWork.subheading}
//               onChange={(e) =>
//                 setRecentWork({ subheading: e.target.value })
//               }
//               className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
//             />

//             <div className="mt-3">
//               <label className="text-sm text-[var(--muted)] block mb-2">
//                 Services
//               </label>
//               <TagInput
//                 value={model.recentWork.services}
//                 onChange={(arr) => setRecentWork({ services: arr })}
//               />
//             </div>
//           </section>

//           {/* Projects */}
//           <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
//             <div className="flex items-center justify-between">
//               <h2 className="font-medium">Projects</h2>
//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   onClick={addProjectLocal}
//                   className="px-3 py-1 rounded bg-white/6 text-sm"
//                 >
//                   + Add project (local)
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     const newP = {
//                       title: "New Project",
//                       year: new Date().getFullYear(),
//                       category: "Category",
//                       imageUrl: "",
//                     };
//                     setProjects([...model.projects, newP]);
//                     setProjectImages((prev) => [...prev, null]);
//                   }}
//                   className="px-3 py-1 rounded bg-white/6 text-sm"
//                 >
//                   + Sample
//                 </button>

//                 <button
//                   type="button"
//                   onClick={deletePortfolio}
//                   className="px-3 py-1 rounded bg-red-600 text-sm"
//                 >
//                   Delete Portfolio
//                 </button>
//               </div>
//             </div>

//             <div className="mt-4 space-y-4">
//               {model.projects.map((p, idx) => (
//                 <div
//                   key={idx}
//                   className="p-3 rounded bg-[#0b1220] border border-white/8"
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                         <div>
//                           <label className="text-sm text-[var(--muted)]">
//                             Title
//                           </label>
//                           <input
//                             value={p.title}
//                             onChange={(e) =>
//                               updateProjectLocal(idx, {
//                                 title: e.target.value,
//                               })
//                             }
//                             className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
//                           />
//                         </div>

//                         <div>
//                           <label className="text-sm text-[var(--muted)]">
//                             Year
//                           </label>
//                           <input
//                             type="number"
//                             value={p.year}
//                             onChange={(e) =>
//                               updateProjectLocal(idx, {
//                                 year:
//                                   Number(e.target.value) ||
//                                   new Date().getFullYear(),
//                               })
//                             }
//                             className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
//                           />
//                         </div>

//                         <div>
//                           <label className="text-sm text-[var(--muted)]">
//                             Category
//                           </label>
//                           <input
//                             value={p.category}
//                             onChange={(e) =>
//                               updateProjectLocal(idx, {
//                                 category: e.target.value,
//                               })
//                             }
//                             className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
//                           />
//                         </div>
//                       </div>

//                       <div className="mt-3">
//                         <label className="text-sm text-[var(--muted)]">
//                           Image
//                         </label>

//                         <ImageUpload
//                           value={
//                             projectImages[idx] ? [projectImages[idx]] : []
//                           }
//                           onChange={(files) =>
//                             handleProjectImageChange(idx, files)
//                           }
//                           maxFiles={1}
//                           maxSizeMB={5}
//                           label="Upload project image (optional)"
//                         />

//                         {(p.imageUrl || projectImages[idx]) && (
//                           <img
//                             src={
//                               projectImages[idx]
//                                 ? URL.createObjectURL(projectImages[idx])
//                                 : p.imageUrl
//                             }
//                             alt={p.title || "Project image"}
//                             className="mt-2 w-40 h-40 object-cover rounded border border-white/10"
//                           />
//                         )}

//                         <input
//                           type="text"
//                           value={p.imageUrl}
//                           onChange={(e) =>
//                             updateProjectLocal(idx, {
//                               imageUrl: e.target.value,
//                             })
//                           }
//                           placeholder="Or paste image URL (optional)"
//                           className="w-full mt-2 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
//                         />
//                       </div>
//                     </div>

//                     <div className="ml-4 flex flex-col gap-2">
//                       <button
//                         type="button"
//                         onClick={() => deleteProjectRemote(idx)}
//                         className="px-3 py-1 rounded bg-red-600 text-sm"
//                       >
//                         Remove
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => updateProjectRemote(idx)}
//                         className="px-3 py-1 rounded bg-white/6 text-sm"
//                       >
//                         Update remote
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => addProjectRemote(idx)}
//                         className="px-3 py-1 rounded bg-white/6 text-sm"
//                       >
//                         Add remote
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {model.projects.length === 0 && (
//                 <div className="text-[var(--muted)] text-sm py-4 text-center">
//                   No projects yet — add one.
//                 </div>
//               )}
//             </div>
//           </section>

//           <div className="flex items-center gap-3">
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 rounded bg-[var(--accent)] text-black font-medium"
//             >
//               {loading
//                 ? "Saving..."
//                 : portfolioId
//                 ? "Save Portfolio (PUT)"
//                 : "Create Portfolio (POST)"}
//             </button>

//             <button
//               type="button"
//               onClick={() => {
//                 setModel(emptyModel);
//                 setProjectImages([]);
//                 setMessage("");
//               }}
//               className="px-4 py-2 rounded bg-white/6"
//             >
//               Reset
//             </button>
//           </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






// src/pages/PortfolioPage.jsx
// import React, { useEffect, useState } from "react";
// import api from "../api/axios.js";
// import TagInput from "../components/TagInput";
// import ImageUpload from "../components/ImageUpload";
// import Navbar from "../components/Navbar";
// import SideBar from "../components/SideBar";

// const emptyProject = {
//   title: "New Project",
//   year: new Date().getFullYear(),
//   category: "Uncategorized",
//   imageUrl: "",

//   // detail/meta fields
//   slug: "",
//   serviceLabel: "",
//   client: "",
//   detailDate: "",

//   technologies: [], // e.g. ["Figma", "WordPress"]

//   overviewTitle: "",
//   overviewText: "",
//   featureList: [], // ["Brand Development", "UX/UI Design", ...]

//   galleryImages: [], // array of URLs

//   // sections like "Visual Hierarchy", "Components"
//   detailSections: [
//     { title: "Visual Hierarchy", text: "" },
//     { title: "Components", text: "" },
//   ],

//   finalImageUrl: "",
// };

// const emptyModel = {
//   recentWork: {
//     heading: "Creative works with our incredible people.",
//     subheading: "Creative works with our incredible people.",
//     services: ["Design", "Development", "Marketing", "Writing"],
//   },
//   projects: [emptyProject],
// };

// export default function PortfolioPage() {
//   const [model, setModel] = useState(emptyModel);
//   const [projectImages, setProjectImages] = useState([]); // File per project index
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [portfolioId, setPortfolioId] = useState(null);

//   const setRecentWork = (patch) =>
//     setModel((m) => ({ ...m, recentWork: { ...m.recentWork, ...patch } }));

//   const setProjects = (arr) => setModel((m) => ({ ...m, projects: arr }));

//   useEffect(() => {
//     (async function load() {
//       try {
//         setLoading(true);
//         const res = await api.get("/portfolio");
//         if (res?.data) {
//           const portfolio = res.data;

//           // Ensure projects have all new fields by merging with emptyProject
//           const projects = (portfolio.projects || []).map((p) => ({
//             ...emptyProject,
//             ...p,
//           }));

//           setModel({
//             recentWork: portfolio.recentWork || emptyModel.recentWork,
//             projects: projects.length ? projects : [emptyProject],
//           });
//           setPortfolioId(portfolio._id || null);
//           setProjectImages(Array(projects.length).fill(null));
//         } else {
//           setModel(emptyModel);
//         }
//       } catch (err) {
//         console.warn(
//           "Load portfolio failed (may be empty):",
//           err?.response?.data || err.message
//         );
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // Projects manipulation (client-side)
//   const addProjectLocal = () => {
//     setProjects([...model.projects, { ...emptyProject }]);
//     setProjectImages((prev) => [...prev, null]);
//   };

//   const updateProjectLocal = (index, patch) => {
//     const next = model.projects.map((p, i) =>
//       i === index ? { ...p, ...patch } : p
//     );
//     setProjects(next);
//   };

//   const removeProjectLocal = (index) => {
//     const next = model.projects.filter((_, i) => i !== index);
//     setProjects(next);
//     setProjectImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleProjectImageChange = (index, files) => {
//     setProjectImages((prev) => {
//       const copy = [...prev];
//       copy[index] = files && files.length ? files[0] : null;
//       return copy;
//     });
//     // clear imageUrl -> server will replace via Cloudinary
//     updateProjectLocal(index, { imageUrl: "" });
//   };

//   // MAIN SAVE (Create/Update) with multipart + Cloudinary
//   const savePortfolio = async (e) => {
//     e?.preventDefault?.();
//     setMessage("");
//     setLoading(true);

//     try {
//       const fd = new FormData();
//       const payload = JSON.parse(JSON.stringify(model));

//       // Clear imageUrl where new file selected
//       payload.projects = (payload.projects || []).map((p, idx) => {
//         const hasFile = !!projectImages[idx];
//         return hasFile ? { ...p, imageUrl: "" } : p;
//       });

//       fd.append("payload", JSON.stringify(payload));

//       // Attach image files
//       projectImages.forEach((file, idx) => {
//         if (file) {
//           fd.append(`projectImage_${idx}`, file, file.name);
//         }
//       });

//       let res;
//       if (portfolioId) {
//         // update existing singleton
//         res = await api.put("/portfolio", fd, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else {
//         // create new portfolio
//         res = await api.post("/portfolio", fd, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       const data = res.data;
//       setMessage(
//         data?.message ||
//           (portfolioId ? "Portfolio updated." : "Portfolio created.")
//       );

//       if (data?.portfolio?._id) {
//         setPortfolioId(data.portfolio._id);

//         // Re-merge with emptyProject to ensure new fields exist
//         if (data.portfolio.projects) {
//           const projects = data.portfolio.projects.map((p) => ({
//             ...emptyProject,
//             ...p,
//           }));
//           setProjects(projects);
//           setProjectImages(Array(projects.length).fill(null));
//         }
//         if (data.portfolio.recentWork) {
//           setRecentWork(data.portfolio.recentWork);
//         }
//       }
//     } catch (err) {
//       console.error("savePortfolio error:", err);
//       setMessage(
//         err.response?.data?.message || err.message || "Save failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Remote project operations – JSON only (no file upload here)
//   const addProjectRemote = async (index) => {
//     if (!portfolioId) {
//       setMessage(
//         "Create a portfolio first (Save Portfolio) before adding single projects via API."
//       );
//       return;
//     }
//     const project = model.projects[index];
//     if (!project) {
//       setMessage("Project not found.");
//       return;
//     }

//     if (projectImages[index]) {
//       setMessage(
//         "To upload a new image for this project, use Save Portfolio instead of Add remote."
//       );
//       return;
//     }

//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await api.post(`/portfolio/${portfolioId}/projects`, {
//         title: project.title,
//         slug: project.slug,
//         year: project.year,
//         category: project.category,
//         imageUrl: project.imageUrl || "",

//         serviceLabel: project.serviceLabel,
//         client: project.client,
//         detailDate: project.detailDate,
//         technologies: project.technologies,
//         overviewTitle: project.overviewTitle,
//         overviewText: project.overviewText,
//         featureList: project.featureList,
//         galleryImages: project.galleryImages,
//         detailSections: project.detailSections,
//         finalImageUrl: project.finalImageUrl,
//       });

//       if (res.data?.project) {
//         const newProjects = [...model.projects];
//         // merge to keep any defaults if server didn't return everything
//         newProjects[index] = { ...emptyProject, ...res.data.project };
//         setProjects(newProjects);
//         setMessage("Project added on server.");
//       } else {
//         setMessage(res.data?.message || "Project added.");
//       }
//     } catch (err) {
//       console.error("addProjectRemote error:", err);
//       setMessage(
//         err.response?.data?.message ||
//           err.message ||
//           "Add project failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProjectRemote = async (index) => {
//     const project = model.projects[index];
//     if (!portfolioId || !project || !project._id) {
//       setMessage(
//         "Project must exist on server (has _id) to update remotely. Use Save Portfolio to create portfolio first."
//       );
//       return;
//     }

//     if (projectImages[index]) {
//       setMessage(
//         "To upload a new image for this project, use Save Portfolio instead of Update remote."
//       );
//       return;
//     }

//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await api.put(
//         `/portfolio/${portfolioId}/projects/${project._id}`,
//         {
//           title: project.title,
//           slug: project.slug,
//           year: project.year,
//           category: project.category,
//           imageUrl: project.imageUrl || "",

//           serviceLabel: project.serviceLabel,
//           client: project.client,
//           detailDate: project.detailDate,
//           technologies: project.technologies,
//           overviewTitle: project.overviewTitle,
//           overviewText: project.overviewText,
//           featureList: project.featureList,
//           galleryImages: project.galleryImages,
//           detailSections: project.detailSections,
//           finalImageUrl: project.finalImageUrl,
//         }
//       );

//       setMessage(res.data?.message || "Project updated.");
//       if (res.data?.project) {
//         const next = model.projects.map((p, i) =>
//           i === index ? { ...emptyProject, ...res.data.project } : p
//         );
//         setProjects(next);
//       }
//     } catch (err) {
//       console.error("updateProjectRemote error:", err);
//       setMessage(
//         err.response?.data?.message ||
//           err.message ||
//           "Update project failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteProjectRemote = async (index) => {
//     const project = model.projects[index];
//     if (!portfolioId || !project || !project._id) {
//       removeProjectLocal(index);
//       setMessage("Project removed locally.");
//       return;
//     }

//     if (!confirm("Delete this project on server? This cannot be undone."))
//       return;

//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await api.delete(
//         `/portfolio/${portfolioId}/projects/${project._id}`
//       );
//       setMessage(res.data?.message || "Project deleted.");
//       removeProjectLocal(index);
//     } catch (err) {
//       console.error("deleteProjectRemote error:", err);
//       setMessage(
//         err.response?.data?.message ||
//           err.message ||
//           "Delete failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deletePortfolio = async () => {
//     if (!portfolioId) {
//       setMessage("No portfolio to delete.");
//       return;
//     }
//     if (!confirm("Delete the entire portfolio from server?")) return;
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await api.delete(`/portfolio/${portfolioId}`);
//       setMessage(res.data?.message || "Portfolio deleted.");
//       setModel(emptyModel);
//       setPortfolioId(null);
//       setProjectImages([]);
//     } catch (err) {
//       console.error("deletePortfolio error:", err);
//       setMessage(
//         err.response?.data?.message ||
//           err.message ||
//           "Delete failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helpers for detailSections per project
//   const updateDetailSection = (projectIndex, sectionIndex, patch) => {
//     const project = model.projects[projectIndex];
//     const sections = project.detailSections || [];
//     const nextSections = sections.map((s, i) =>
//       i === sectionIndex ? { ...s, ...patch } : s
//     );
//     updateProjectLocal(projectIndex, { detailSections: nextSections });
//   };

//   const addDetailSection = (projectIndex) => {
//     const project = model.projects[projectIndex];
//     const sections = project.detailSections || [];
//     const nextSections = [
//       ...sections,
//       { title: "New Section", text: "" },
//     ];
//     updateProjectLocal(projectIndex, { detailSections: nextSections });
//   };

//   const removeDetailSection = (projectIndex, sectionIndex) => {
//     const project = model.projects[projectIndex];
//     const sections = project.detailSections || [];
//     const nextSections = sections.filter((_, i) => i !== sectionIndex);
//     updateProjectLocal(projectIndex, { detailSections: nextSections });
//   };

//   return (
//     <div className="">
//       <Navbar />
//       <div className="flex flex-col md:flex-row gap-6 px-4 py-6 max-w-7xl mx-auto w-full">
//         <SideBar />
//         <div className="flex-1">
//           <div className="max-w-5xl w-full">
//             <h1 className="text-2xl font-semibold mb-4 px-2">Edit Portfolio</h1>

//             {message && (
//               <div className="mb-4 px-4 py-2 rounded bg-white/6 text-sm ">
//                 {message}
//               </div>
//             )}

//             <form
//               onSubmit={savePortfolio}
//               className="space-y-6 rounded-lg border border-white/5 bg-[var(--panel)]/50 p-6"
//             >
//               {/* Recent Work */}
//               <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
//                 <h2 className="font-medium mb-3">Recent Work</h2>

//                 <label className="text-sm text-[var(--muted)]">Heading</label>
//                 <input
//                   type="text"
//                   value={model.recentWork.heading}
//                   onChange={(e) =>
//                     setRecentWork({ heading: e.target.value })
//                   }
//                   className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
//                 />

//                 <label className="text-sm text-[var(--muted)] mt-3 block">
//                   Subheading
//                 </label>
//                 <input
//                   type="text"
//                   value={model.recentWork.subheading}
//                   onChange={(e) =>
//                     setRecentWork({ subheading: e.target.value })
//                   }
//                   className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
//                 />

//                 <div className="mt-3">
//                   <label className="text-sm text-[var(--muted)] block mb-2">
//                     Services
//                   </label>
//                   <TagInput
//                     value={model.recentWork.services}
//                     onChange={(arr) => setRecentWork({ services: arr })}
//                   />
//                 </div>
//               </section>

//               {/* Projects */}
//               <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
//                 <div className="flex items-center justify-between">
//                   <h2 className="font-medium">Projects</h2>
//                   <div className="flex gap-2">
//                     <button
//                       type="button"
//                       onClick={addProjectLocal}
//                       className="px-3 py-1 rounded bg-white/6 text-sm"
//                     >
//                       + Add project (local)
//                     </button>

//                     <button
//                       type="button"
//                       onClick={deletePortfolio}
//                       className="px-3 py-1 rounded bg-red-600 text-sm"
//                     >
//                       Delete Portfolio
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mt-4 space-y-4">
//                   {model.projects.map((p, idx) => (
//                     <div
//                       key={idx}
//                       className="p-3 rounded bg-[#0b1220] border border-white/8"
//                     >
//                       <div className="flex items-start justify-between gap-4">
//                         <div className="flex-1 space-y-4">
//                           {/* Basic info */}
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                             <div>
//                               <label className="text-sm text-[var(--muted)]">
//                                 Title
//                               </label>
//                               <input
//                                 value={p.title}
//                                 onChange={(e) =>
//                                   updateProjectLocal(idx, {
//                                     title: e.target.value,
//                                   })
//                                 }
//                                 className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
//                               />
//                             </div>

//                             <div>
//                               <label className="text-sm text-[var(--muted)]">
//                                 Year
//                               </label>
//                               <input
//                                 type="number"
//                                 value={p.year}
//                                 onChange={(e) =>
//                                   updateProjectLocal(idx, {
//                                     year:
//                                       Number(e.target.value) ||
//                                       new Date().getFullYear(),
//                                   })
//                                 }
//                                 className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
//                               />
//                             </div>

//                             <div>
//                               <label className="text-sm text-[var(--muted)]">
//                                 Category
//                               </label>
//                               <input
//                                 value={p.category}
//                                 onChange={(e) =>
//                                   updateProjectLocal(idx, {
//                                     category: e.target.value,
//                                   })
//                                 }
//                                 className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
//                               />
//                             </div>
//                           </div>

//                           {/* Slug + Meta */}
//                           <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
//                             <div>
//                               <label className="text-sm text-[var(--muted)]">
//                                 Slug (for /portfolio-details/[slug])
//                               </label>
//                               <input
//                                 value={p.slug || ""}
//                                 onChange={(e) =>
//                                   updateProjectLocal(idx, {
//                                     slug: e.target.value,
//                                   })
//                                 }
//                                 placeholder="saudi-venture-capital"
//                                 className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
//                               />
//                             </div>

//                             <div>
//                               <label className="text-sm text-[var(--muted)]">
//                                 Service Label
//                               </label>
//                               <input
//                                 value={p.serviceLabel || ""}
//                                 onChange={(e) =>
//                                   updateProjectLocal(idx, {
//                                     serviceLabel: e.target.value,
//                                   })
//                                 }
//                                 placeholder="Visual Identity, Branding"
//                                 className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
//                               />
//                             </div>

//                             <div>
//                               <label className="text-sm text-[var(--muted)]">
//                                 Client
//                               </label>
//                               <input
//                                 value={p.client || ""}
//                                 onChange={(e) =>
//                                   updateProjectLocal(idx, {
//                                     client: e.target.value,
//                                   })
//                                 }
//                                 placeholder="Softakey Digital Agency"
//                                 className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
//                               />
//                             </div>

//                             <div>
//                               <label className="text-sm text-[var(--muted)]">
//                                 Date (display)
//                               </label>
//                               <input
//                                 value={p.detailDate || ""}
//                                 onChange={(e) =>
//                                   updateProjectLocal(idx, {
//                                     detailDate: e.target.value,
//                                   })
//                                 }
//                                 placeholder="January 2025"
//                                 className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
//                               />
//                             </div>
//                           </div>

//                           {/* Technologies */}
//                           <div>
//                             <label className="text-sm text-[var(--muted)] block mb-1">
//                               Technologies
//                             </label>
//                             <TagInput
//                               value={p.technologies || []}
//                               onChange={(arr) =>
//                                 updateProjectLocal(idx, {
//                                   technologies: arr,
//                                 })
//                               }
//                             />
//                           </div>

//                           {/* Image (main hero / thumbnail) */}
//                           <div>
//                             <label className="text-sm text-[var(--muted)]">
//                               Main Image (card + hero)
//                             </label>

//                             <ImageUpload
//                               value={
//                                 projectImages[idx]
//                                   ? [projectImages[idx]]
//                                   : []
//                               }
//                               onChange={(files) =>
//                                 handleProjectImageChange(idx, files)
//                               }
//                               maxFiles={1}
//                               maxSizeMB={5}
//                               label="Upload project image (optional)"
//                             />

//                             {(p.imageUrl || projectImages[idx]) && (
//                               <img
//                                 src={
//                                   projectImages[idx]
//                                     ? URL.createObjectURL(
//                                         projectImages[idx]
//                                       )
//                                     : p.imageUrl
//                                 }
//                                 alt={p.title || "Project image"}
//                                 className="mt-2 w-40 h-40 object-cover rounded border border-white/10"
//                               />
//                             )}

//                             <input
//                               type="text"
//                               value={p.imageUrl}
//                               onChange={(e) =>
//                                 updateProjectLocal(idx, {
//                                   imageUrl: e.target.value,
//                                 })
//                               }
//                               placeholder="Or paste image URL (optional)"
//                               className="w-full mt-2 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
//                             />
//                           </div>

//                           {/* Overview Section */}
//                           <div className="border-t border-white/10 pt-3 mt-3">
//                             <h3 className="text-sm font-medium mb-2">
//                               Overview Section
//                             </h3>
//                             <label className="text-sm text-[var(--muted)]">
//                               Overview Title
//                             </label>
//                             <input
//                               type="text"
//                               value={p.overviewTitle || ""}
//                               onChange={(e) =>
//                                 updateProjectLocal(idx, {
//                                   overviewTitle: e.target.value,
//                                 })
//                               }
//                               placeholder="Build streamline and evolve together with solution"
//                               className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
//                             />

//                             <label className="text-sm text-[var(--muted)] mt-3 block">
//                               Overview Text
//                             </label>
//                             <textarea
//                               value={p.overviewText || ""}
//                               onChange={(e) =>
//                                 updateProjectLocal(idx, {
//                                   overviewText: e.target.value,
//                                 })
//                               }
//                               rows={4}
//                               className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
//                             />

//                             <div className="mt-3">
//                               <label className="text-sm text-[var(--muted)] block mb-1">
//                                 Feature List (bullets)
//                               </label>
//                               <TagInput
//                                 value={p.featureList || []}
//                                 onChange={(arr) =>
//                                   updateProjectLocal(idx, {
//                                     featureList: arr,
//                                   })
//                                 }
//                               />
//                             </div>
//                           </div>

//                           {/* Gallery Images */}
//                           <div className="border-t border-white/10 pt-3 mt-3">
//                             <h3 className="text-sm font-medium mb-2">
//                               Gallery Images (6 in line)
//                             </h3>
//                             <label className="text-xs text-[var(--muted)] block mb-1">
//                               Add image URLs (in order)
//                             </label>
//                             <TagInput
//                               value={p.galleryImages || []}
//                               onChange={(arr) =>
//                                 updateProjectLocal(idx, {
//                                   galleryImages: arr,
//                                 })
//                               }
//                             />
//                           </div>

//                           {/* Detail Sections */}
//                           <div className="border-t border-white/10 pt-3 mt-3">
//                             <div className="flex items-center justify-between mb-1">
//                               <h3 className="text-sm font-medium">
//                                 Detail Sections
//                               </h3>
//                               <button
//                                 type="button"
//                                 onClick={() => addDetailSection(idx)}
//                                 className="px-2 py-1 rounded bg-white/6 text-xs"
//                               >
//                                 + Add section
//                               </button>
//                             </div>
//                             <p className="text-[10px] text-[var(--muted)] mb-2">
//                               Used for items like "Visual Hierarchy" and
//                               "Components".
//                             </p>

//                             {(p.detailSections || []).map(
//                               (sec, sIdx) => (
//                                 <div
//                                   key={sIdx}
//                                   className="mt-2 p-2 rounded border border-white/12 bg-[#050816]"
//                                 >
//                                   <div className="flex items-start gap-2">
//                                     <div className="flex-1">
//                                       <label className="text-xs text-[var(--muted)]">
//                                         Section Title
//                                       </label>
//                                       <input
//                                         value={sec.title || ""}
//                                         onChange={(e) =>
//                                           updateDetailSection(
//                                             idx,
//                                             sIdx,
//                                             {
//                                               title: e.target.value,
//                                             }
//                                           )
//                                         }
//                                         className="w-full mt-1 px-2 py-1 rounded bg-[#071028] border border-white/8 text-xs"
//                                       />
//                                       <label className="text-xs text-[var(--muted)] mt-2 block">
//                                         Section Text
//                                       </label>
//                                       <textarea
//                                         value={sec.text || ""}
//                                         onChange={(e) =>
//                                           updateDetailSection(
//                                             idx,
//                                             sIdx,
//                                             {
//                                               text: e.target.value,
//                                             }
//                                           )
//                                         }
//                                         rows={3}
//                                         className="w-full mt-1 px-2 py-1 rounded bg-[#071028] border border-white/8 text-xs"
//                                       />
//                                     </div>
//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         removeDetailSection(
//                                           idx,
//                                           sIdx
//                                         )
//                                       }
//                                       className="px-2 py-1 rounded bg-red-600 text-xs h-fit"
//                                     >
//                                       ✕
//                                     </button>
//                                   </div>
//                                 </div>
//                               )
//                             )}

//                             {(!p.detailSections ||
//                               p.detailSections.length === 0) && (
//                               <div className="text-[10px] text-[var(--muted)] mt-1">
//                                 No sections yet — add one.
//                               </div>
//                             )}
//                           </div>

//                           {/* Final Image */}
//                           <div className="border-t border-white/10 pt-3 mt-3">
//                             <h3 className="text-sm font-medium mb-2">
//                               Final Image (bottom)
//                             </h3>
//                             <input
//                               type="text"
//                               value={p.finalImageUrl || ""}
//                               onChange={(e) =>
//                                 updateProjectLocal(idx, {
//                                   finalImageUrl: e.target.value,
//                                 })
//                               }
//                               placeholder="Paste final image URL"
//                               className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
//                             />
//                           </div>
//                         </div>

//                         {/* Actions */}
//                         <div className="ml-1 flex flex-col gap-2 shrink-0">
//                           <button
//                             type="button"
//                             onClick={() => deleteProjectRemote(idx)}
//                             className="px-3 py-1 rounded bg-red-600 text-sm"
//                           >
//                             Remove
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() => updateProjectRemote(idx)}
//                             className="px-3 py-1 rounded bg-white/6 text-sm"
//                           >
//                             Update remote
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() => addProjectRemote(idx)}
//                             className="px-3 py-1 rounded bg-white/6 text-sm"
//                           >
//                             Add remote
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}

//                   {model.projects.length === 0 && (
//                     <div className="text-[var(--muted)] text-sm py-4 text-center">
//                       No projects yet — add one.
//                     </div>
//                   )}
//                 </div>
//               </section>

//               <div className="flex items-center gap-3">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 rounded bg-[var(--accent)] text-black font-medium"
//                 >
//                   {loading
//                     ? "Saving..."
//                     : portfolioId
//                     ? "Save Portfolio (PUT)"
//                     : "Create Portfolio (POST)"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setModel(emptyModel);
//                     setProjectImages([]);
//                     setMessage("");
//                   }}
//                   className="px-4 py-2 rounded bg-white/6"
//                 >
//                   Reset
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// src/pages/PortfolioPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import TagInput from "../components/TagInput";
import ImageUpload from "../components/ImageUpload";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";

const emptyProject = {
  title: "New Project",
  year: new Date().getFullYear(),
  category: "Uncategorized",
  imageUrl: "",

  // detail/meta fields
  slug: "",
  serviceLabel: "",
  client: "",
  detailDate: "",

  technologies: [], // e.g. ["Figma", "WordPress"]

  overviewTitle: "",
  overviewText: "",
  featureList: [], // ["Brand Development", "UX/UI Design", ...]

  galleryImages: [], // array of URLs

  // sections like "Visual Hierarchy", "Components"
  detailSections: [
    { title: "Visual Hierarchy", text: "" },
    { title: "Components", text: "" },
  ],

  finalImageUrl: "",
};

const emptyModel = {
  recentWork: {
    heading: "Creative works with our incredible people.",
    subheading: "Creative works with our incredible people.",
    services: ["Design", "Development", "Marketing", "Writing"],
  },
  projects: [emptyProject],
};

export default function PortfolioPage() {
  const [model, setModel] = useState(emptyModel);
  const [projectImages, setProjectImages] = useState([]); // File per project index (main image)
  const [galleryImagesFiles, setGalleryImagesFiles] = useState([]); // File[] per project index (gallery)
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

          // Ensure projects have all new fields by merging with emptyProject
          const projects = (portfolio.projects || []).map((p) => ({
            ...emptyProject,
            ...p,
          }));

          setModel({
            recentWork: portfolio.recentWork || emptyModel.recentWork,
            projects: projects.length ? projects : [emptyProject],
          });
          setPortfolioId(portfolio._id || null);
          setProjectImages(Array(projects.length).fill(null));
          setGalleryImagesFiles(Array(projects.length).fill([]));
        } else {
          setModel(emptyModel);
          setProjectImages(Array(emptyModel.projects.length).fill(null));
          setGalleryImagesFiles(Array(emptyModel.projects.length).fill([]));
        }
      } catch (err) {
        console.warn(
          "Load portfolio failed (may be empty):",
          err?.response?.data || err.message
        );
        // Keep defaults from initial state
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Projects manipulation (client-side)
  const addProjectLocal = () => {
    setProjects([...model.projects, { ...emptyProject }]);
    setProjectImages((prev) => [...prev, null]);
    setGalleryImagesFiles((prev) => [...prev, []]);
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
    setGalleryImagesFiles((prev) => prev.filter((_, i) => i !== index));
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

  const handleGalleryImagesChange = (projectIndex, files) => {
    setGalleryImagesFiles((prev) => {
      const copy = [...prev];
      copy[projectIndex] = files || [];
      return copy;
    });
    // clear galleryImages -> server will replace via Cloudinary
    updateProjectLocal(projectIndex, { galleryImages: [] });
  };

  // MAIN SAVE (Create/Update) with multipart + Cloudinary
  const savePortfolio = async (e) => {
    e?.preventDefault?.();
    setMessage("");
    setLoading(true);

    try {
      const fd = new FormData();
      const payload = JSON.parse(JSON.stringify(model));

      // Clear imageUrl / galleryImages where new files selected so server overwrites
      payload.projects = (payload.projects || []).map((p, idx) => {
        let updated = { ...p };

        if (projectImages[idx]) {
          updated.imageUrl = "";
        }

        const gFiles = galleryImagesFiles[idx] || [];
        if (gFiles.length) {
          updated.galleryImages = [];
        }

        return updated;
      });

      fd.append("payload", JSON.stringify(payload));

      // Attach main project images
      projectImages.forEach((file, idx) => {
        if (file) {
          fd.append(`projectImage_${idx}`, file, file.name);
        }
      });

      // Attach gallery images per project
      galleryImagesFiles.forEach((files, pIdx) => {
        (files || []).forEach((file, gIdx) => {
          fd.append(`galleryImage_${pIdx}_${gIdx}`, file, file.name);
        });
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
      setMessage(
        data?.message ||
          (portfolioId ? "Portfolio updated." : "Portfolio created.")
      );

      if (data?.portfolio?._id) {
        setPortfolioId(data.portfolio._id);

        // Re-merge with emptyProject to ensure new fields exist
        if (data.portfolio.projects) {
          const projects = data.portfolio.projects.map((p) => ({
            ...emptyProject,
            ...p,
          }));
          setProjects(projects);
          setProjectImages(Array(projects.length).fill(null));
          setGalleryImagesFiles(Array(projects.length).fill([]));
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
  // const addProjectRemote = async (index) => {
  //   if (!portfolioId) {
  //     setMessage(
  //       "Create a portfolio first (Save Portfolio) before adding single projects via API."
  //     );
  //     return;
  //   }
  //   const project = model.projects[index];
  //   if (!project) {
  //     setMessage("Project not found.");
  //     return;
  //   }

  //   if (projectImages[index] || (galleryImagesFiles[index] || []).length) {
  //     setMessage(
  //       "To upload new images for this project, use Save Portfolio instead of Add remote."
  //     );
  //     return;
  //   }

  //   setLoading(true);
  //   setMessage("");
  //   try {
  //     const res = await api.post(`/portfolio/${portfolioId}/projects`, {
  //       title: project.title,
  //       slug: project.slug,
  //       year: project.year,
  //       category: project.category,
  //       imageUrl: project.imageUrl || "",

  //       serviceLabel: project.serviceLabel,
  //       client: project.client,
  //       detailDate: project.detailDate,
  //       technologies: project.technologies,
  //       overviewTitle: project.overviewTitle,
  //       overviewText: project.overviewText,
  //       featureList: project.featureList,
  //       galleryImages: project.galleryImages,
  //       detailSections: project.detailSections,
  //       finalImageUrl: project.finalImageUrl,
  //     });

  //     if (res.data?.project) {
  //       const newProjects = [...model.projects];
  //       // merge to keep any defaults if server didn't return everything
  //       newProjects[index] = { ...emptyProject, ...res.data.project };
  //       setProjects(newProjects);
  //       setMessage("Project added on server.");
  //     } else {
  //       setMessage(res.data?.message || "Project added.");
  //     }
  //   } catch (err) {
  //     console.error("addProjectRemote error:", err);
  //     setMessage(
  //       err.response?.data?.message ||
  //         err.message ||
  //         "Add project failed."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
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

  if (projectImages[index] || (galleryImagesFiles[index] || []).length) {
    setMessage(
      "To upload new images for this project, use Save Portfolio instead of Add remote."
    );
    return;
  }

  // ✅ basic validation on the client to match backend
  if (!project.title || !project.year || !project.category) {
    setMessage("Title, year and category are required to add a project.");
    return;
  }

  setLoading(true);
  setMessage("");
  try {
    const res = await api.post(`/portfolio/${portfolioId}/projects`, {
      title: project.title,
      slug: project.slug,
      year: project.year,
      category: project.category,
      imageUrl: project.imageUrl || "",

      serviceLabel: project.serviceLabel,
      client: project.client,
      detailDate: project.detailDate,
      technologies: project.technologies,
      overviewTitle: project.overviewTitle,
      overviewText: project.overviewText,
      featureList: project.featureList,
      galleryImages: project.galleryImages,
      detailSections: project.detailSections,
      finalImageUrl: project.finalImageUrl,
    });

    if (res.data?.project) {
      const newProjects = [...model.projects];
      // merge to keep any defaults if server didn't return everything
      newProjects[index] = { ...emptyProject, ...res.data.project };
      setProjects(newProjects);
      setMessage("Project added on server.");
    } else {
      setMessage(res.data?.message || "Project added.");
    }
  } catch (err) {
    console.error("addProjectRemote error:", err);
    setMessage(
      err.response?.data?.message || err.message || "Add project failed."
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

    if (projectImages[index] || (galleryImagesFiles[index] || []).length) {
      setMessage(
        "To upload new images for this project, use Save Portfolio instead of Update remote."
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
          slug: project.slug,
          year: project.year,
          category: project.category,
          imageUrl: project.imageUrl || "",

          serviceLabel: project.serviceLabel,
          client: project.client,
          detailDate: project.detailDate,
          technologies: project.technologies,
          overviewTitle: project.overviewTitle,
          overviewText: project.overviewText,
          featureList: project.featureList,
          galleryImages: project.galleryImages,
          detailSections: project.detailSections,
          finalImageUrl: project.finalImageUrl,
        }
      );

      setMessage(res.data?.message || "Project updated.");
      if (res.data?.project) {
        const next = model.projects.map((p, i) =>
          i === index ? { ...emptyProject, ...res.data.project } : p
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
      setGalleryImagesFiles([]);
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

  // Helpers for detailSections per project
  const updateDetailSection = (projectIndex, sectionIndex, patch) => {
    const project = model.projects[projectIndex];
    const sections = project.detailSections || [];
    const nextSections = sections.map((s, i) =>
      i === sectionIndex ? { ...s, ...patch } : s
    );
    updateProjectLocal(projectIndex, { detailSections: nextSections });
  };

  const addDetailSection = (projectIndex) => {
    const project = model.projects[projectIndex];
    const sections = project.detailSections || [];
    const nextSections = [
      ...sections,
      { title: "New Section", text: "" },
    ];
    updateProjectLocal(projectIndex, { detailSections: nextSections });
  };

  const removeDetailSection = (projectIndex, sectionIndex) => {
    const project = model.projects[projectIndex];
    const sections = project.detailSections || [];
    const nextSections = sections.filter((_, i) => i !== sectionIndex);
    updateProjectLocal(projectIndex, { detailSections: nextSections });
  };

  return (
    <div className="">
      <Navbar />
      <div className="flex flex-col md:flex-row gap-6 px-4 py-6 max-w-7xl mx-auto w-full">
        <SideBar />
        <div className="flex-1">
          <div className="max-w-5xl w-full">
            <h1 className="text-2xl font-semibold mb-4 px-2">
              Edit Portfolio
            </h1>

            {message && (
              <div className="mb-4 px-4 py-2 rounded bg-white/6 text-sm ">
                {message}
              </div>
            )}

            <form
              onSubmit={savePortfolio}
              className="space-y-6 rounded-lg border border-white/5 bg-[var(--panel)]/50 p-6"
            >
              {/* Recent Work */}
              <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
                <h2 className="font-medium mb-3">Recent Work</h2>

                <label className="text-sm text-[var(--muted)]">
                  Heading
                </label>
                <input
                  type="text"
                  value={model.recentWork.heading}
                  onChange={(e) =>
                    setRecentWork({ heading: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                />

                <label className="text-sm text-[var(--muted)] mt-3 block">
                  Subheading
                </label>
                <input
                  type="text"
                  value={model.recentWork.subheading}
                  onChange={(e) =>
                    setRecentWork({ subheading: e.target.value })
                  }
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
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-4">
                          {/* Basic info */}
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

                          {/* Slug + Meta */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <label className="text-sm text-[var(--muted)]">
                                Slug (for /portfolio-details/[slug])
                              </label>
                              <input
                                value={p.slug || ""}
                                onChange={(e) =>
                                  updateProjectLocal(idx, {
                                    slug: e.target.value,
                                  })
                                }
                                placeholder="saudi-venture-capital"
                                className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
                              />
                            </div>

                            <div>
                              <label className="text-sm text-[var(--muted)]">
                                Service Label
                              </label>
                              <input
                                value={p.serviceLabel || ""}
                                onChange={(e) =>
                                  updateProjectLocal(idx, {
                                    serviceLabel: e.target.value,
                                  })
                                }
                                placeholder="Visual Identity, Branding"
                                className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
                              />
                            </div>

                            <div>
                              <label className="text-sm text-[var(--muted)]">
                                Client
                              </label>
                              <input
                                value={p.client || ""}
                                onChange={(e) =>
                                  updateProjectLocal(idx, {
                                    client: e.target.value,
                                  })
                                }
                                placeholder="Softakey Digital Agency"
                                className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
                              />
                            </div>

                            <div>
                              <label className="text-sm text-[var(--muted)]">
                                Date (display)
                              </label>
                              <input
                                value={p.detailDate || ""}
                                onChange={(e) =>
                                  updateProjectLocal(idx, {
                                    detailDate: e.target.value,
                                  })
                                }
                                placeholder="January 2025"
                                className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
                              />
                            </div>
                          </div>

                          {/* Technologies */}
                          <div>
                            <label className="text-sm text-[var(--muted)] block mb-1">
                              Technologies
                            </label>
                            <TagInput
                              value={p.technologies || []}
                              onChange={(arr) =>
                                updateProjectLocal(idx, {
                                  technologies: arr,
                                })
                              }
                            />
                          </div>

                          {/* Image (main hero / thumbnail) */}
                          <div>
                            <label className="text-sm text-[var(--muted)]">
                              Main Image (card + hero)
                            </label>

                            <ImageUpload
                              value={
                                projectImages[idx]
                                  ? [projectImages[idx]]
                                  : []
                              }
                              onChange={(files) =>
                                handleProjectImageChange(idx, files)
                              }
                              maxFiles={1}
                              maxSizeMB={5}
                              label="Upload project image (optional)"
                            />

                            {(p.imageUrl || projectImages[idx]) && (
                              <img
                                src={
                                  projectImages[idx]
                                    ? URL.createObjectURL(
                                        projectImages[idx]
                                      )
                                    : p.imageUrl
                                }
                                alt={p.title || "Project image"}
                                className="mt-2 w-40 h-40 object-cover rounded border border-white/10"
                              />
                            )}

                            <input
                              type="text"
                              value={p.imageUrl}
                              onChange={(e) =>
                                updateProjectLocal(idx, {
                                  imageUrl: e.target.value,
                                })
                              }
                              placeholder="Or paste image URL (optional)"
                              className="w-full mt-2 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
                            />
                          </div>

                          {/* Overview Section */}
                          <div className="border-t border-white/10 pt-3 mt-3">
                            <h3 className="text-sm font-medium mb-2">
                              Overview Section
                            </h3>
                            <label className="text-sm text-[var(--muted)]">
                              Overview Title
                            </label>
                            <input
                              type="text"
                              value={p.overviewTitle || ""}
                              onChange={(e) =>
                                updateProjectLocal(idx, {
                                  overviewTitle: e.target.value,
                                })
                              }
                              placeholder="Build streamline and evolve together with solution"
                              className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
                            />

                            <label className="text-sm text-[var(--muted)] mt-3 block">
                              Overview Text
                            </label>
                            <textarea
                              value={p.overviewText || ""}
                              onChange={(e) =>
                                updateProjectLocal(idx, {
                                  overviewText: e.target.value,
                                })
                              }
                              rows={4}
                              className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
                            />

                            <div className="mt-3">
                              <label className="text-sm text-[var(--muted)] block mb-1">
                                Feature List (bullets)
                              </label>
                              <TagInput
                                value={p.featureList || []}
                                onChange={(arr) =>
                                  updateProjectLocal(idx, {
                                    featureList: arr,
                                  })
                                }
                              />
                            </div>
                          </div>

                          {/* Gallery Images */}
                          <div className="border-t border-white/10 pt-3 mt-3">
                            <h3 className="text-sm font-medium mb-2">
                              Gallery Images (6 in line)
                            </h3>

                            {/* Upload */}
                            <label className="text-xs text-[var(--muted)] block mb-1">
                              Upload gallery images (up to 6)
                            </label>
                            <ImageUpload
                              value={galleryImagesFiles[idx] || []}
                              onChange={(files) =>
                                handleGalleryImagesChange(idx, files)
                              }
                              maxFiles={6}
                              maxSizeMB={5}
                              label="Upload gallery images"
                            />

                            {/* Preview uploads OR existing URLs */}
                            <div className="mt-2 flex flex-wrap gap-2">
                              {galleryImagesFiles[idx] &&
                              galleryImagesFiles[idx].length > 0 ? (
                                galleryImagesFiles[idx].map(
                                  (file, gIdx) => (
                                    <img
                                      key={gIdx}
                                      src={URL.createObjectURL(
                                        file
                                      )}
                                      alt={`Gallery ${gIdx + 1}`}
                                      className="w-20 h-20 object-cover rounded border border-white/10"
                                    />
                                  )
                                )
                              ) : (
                                (p.galleryImages || []).map(
                                  (url, gIdx) => (
                                    <img
                                      key={gIdx}
                                      src={url}
                                      alt={`Gallery ${gIdx + 1}`}
                                      className="w-20 h-20 object-cover rounded border border-white/10"
                                    />
                                  )
                                )
                              )}
                            </div>

                            {/* Optional: still allow manual URL entry */}
                            <label className="text-xs text-[var(--muted)] block mt-3 mb-1">
                              Or manage gallery image URLs manually
                            </label>
                            <TagInput
                              value={p.galleryImages || []}
                              onChange={(arr) =>
                                updateProjectLocal(idx, {
                                  galleryImages: arr,
                                })
                              }
                            />
                          </div>

                          {/* Detail Sections */}
                          <div className="border-t border-white/10 pt-3 mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-sm font-medium">
                                Detail Sections
                              </h3>
                              <button
                                type="button"
                                onClick={() => addDetailSection(idx)}
                                className="px-2 py-1 rounded bg-white/6 text-xs"
                              >
                                + Add section
                              </button>
                            </div>
                            <p className="text-[10px] text-[var(--muted)] mb-2">
                              Used for items like "Visual Hierarchy" and
                              "Components".
                            </p>

                            {(p.detailSections || []).map(
                              (sec, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="mt-2 p-2 rounded border border-white/12 bg-[#050816]"
                                >
                                  <div className="flex items-start gap-2">
                                    <div className="flex-1">
                                      <label className="text-xs text-[var(--muted)]">
                                        Section Title
                                      </label>
                                      <input
                                        value={sec.title || ""}
                                        onChange={(e) =>
                                          updateDetailSection(
                                            idx,
                                            sIdx,
                                            {
                                              title: e.target.value,
                                            }
                                          )
                                        }
                                        className="w-full mt-1 px-2 py-1 rounded bg-[#071028] border border-white/8 text-xs"
                                      />
                                      <label className="text-xs text-[var(--muted)] mt-2 block">
                                        Section Text
                                      </label>
                                      <textarea
                                        value={sec.text || ""}
                                        onChange={(e) =>
                                          updateDetailSection(
                                            idx,
                                            sIdx,
                                            {
                                              text: e.target.value,
                                            }
                                          )
                                        }
                                        rows={3}
                                        className="w-full mt-1 px-2 py-1 rounded bg-[#071028] border border-white/8 text-xs"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeDetailSection(
                                          idx,
                                          sIdx
                                        )
                                      }
                                      className="px-2 py-1 rounded bg-red-600 text-xs h-fit"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              )
                            )}

                            {(!p.detailSections ||
                              p.detailSections.length === 0) && (
                              <div className="text-[10px] text-[var(--muted)] mt-1">
                                No sections yet — add one.
                              </div>
                            )}
                          </div>

                          {/* Final Image */}
                          <div className="border-t border-white/10 pt-3 mt-3">
                            <h3 className="text-sm font-medium mb-2">
                              Final Image (bottom)
                            </h3>
                            <input
                              type="text"
                              value={p.finalImageUrl || ""}
                              onChange={(e) =>
                                updateProjectLocal(idx, {
                                  finalImageUrl: e.target.value,
                                })
                              }
                              placeholder="Paste final image URL"
                              className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8 text-xs"
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="ml-1 flex flex-col gap-2 shrink-0">
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
                    setGalleryImagesFiles([]);
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
