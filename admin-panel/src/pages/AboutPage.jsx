// src/pages/AboutPage.jsx
import React, { useState, useEffect } from "react";
import TagInput from "../components/TagInput";
import ImageUpload from "../components/ImageUpload";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import api from "../api/axios";

/**
 * AboutPage editor based on provided model.
 * - Sends: multipart/form-data:
 *   - payload: JSON string
 *   - gallery_<i>, mediaImage, teamImage_<i> files
 */

const defaultModel = {
  pageTitle: { title: "About Us" },
  aboutArea: {
    infoList: { items: ["Art Direction", "Capability", "Sustainability"] },
    paragraphs: [
      "Sage Craft is the first and only creative agency for your real exploration. It’s one private place to save everything you can realize about digital beautifully design.",
      "As a global creative agency, we understand the importance of staying ahead of the game. That’s why we partner with some of the world's best talent to bring fresh ideas."
    ],
    galleryImages: [
      { imageUrl: "/assets/imgs/gallery/image-19.webp", alt: "image-1" },
      { imageUrl: "/assets/imgs/gallery/image-20.webp", alt: "image-2" },
      { imageUrl: "/assets/imgs/gallery/image-21.webp", alt: "image-3" },
      { imageUrl: "/assets/imgs/gallery/image-22.webp", alt: "image-4" }
    ]
  },
  approachSection: {
    subtitle: "Approach",
    heading: "Method of making better result",
    approaches: [
      {
        title: "Problem discovery",
        showShape: true,
        items: ["Usability Studies", "User Interviews", "Stakeholder Interviews", "Competitive Research", "Insights Report", "User Journey"]
      },
      {
        title: "Design system ready",
        showShape: true,
        items: ["Thinking Workshops", "Sitemaps", "Concepts", "Designs", "Prototypes", "Usability Studies"]
      },
      {
        title: "Design implementation",
        showShape: false,
        items: ["Design", "Use Cases", "User Flows", "Various User Types", "Annotations", "Interactions"]
      }
    ]
  },
  infoSection: {
    subtitle: "Who are we?",
    heading: "We deliver creative ideas to a crowded world.",
    stats: [
      { label: "35+ Google reviews", value: "4.9" },
      { label: "Clients world-wide", value: "170+" },
      { label: "Completed projects", value: "1.7k" },
      { label: "Client satisfaction", value: "95%" }
    ]
  },
  mediaSection: {
    mediaImage: { imageUrl: "/assets/imgs/gallery/image-23.webp", alt: "collaboration" },
    heading: "Collaborate with a super down-to-earth, mad-talented team",
    text: "A collective bunch working on incredible projects and building enduring partnerships that extend well beyond the deliverable."
  },
  awardsSection: {
    heading: "We believe in quality, not quantity, that’s why we’re great ever.",
    awards: [
      {
        category: "Awwwards",
        items: [
          { title: "7x Honorable Mention", year: "2014" },
          { title: "4x Site of the Day", year: "2016" }
        ]
      }
    ]
  },
  teamSection: {
    heading: "Meet the talented squad, behind the creativity",
    description: "We are a great skilled and talented team behind the creativity and your amazing digital craft.",
    members: [
      { name: "James David", post: "CEO & Founder", imageUrl: "/assets/imgs/team/team-1.webp" },
      { name: "Brenda C. Janet", post: "Lead Developer", imageUrl: "/assets/imgs/team/team-2.webp" }
    ]
  }
};

export default function AboutPage() {
  const [model, setModel] = useState(defaultModel);

  // files state maps
  const [galleryFiles, setGalleryFiles] = useState([]); // File[] mapped by index
  const [mediaFiles, setMediaFiles] = useState([]); // single file
  const [teamFiles, setTeamFiles] = useState([]); // File[] mapped by index
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ---------- fetch existing About from backend ----------
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get("/about");
        const data = res.data;
        if (!data) return;

        setModel((prev) => ({
          ...prev,
          ...data,
          pageTitle: { ...prev.pageTitle, ...(data.pageTitle || {}) },
          aboutArea: { ...prev.aboutArea, ...(data.aboutArea || {}) },
          approachSection: {
            ...prev.approachSection,
            ...(data.approachSection || {}),
          },
          infoSection: { ...prev.infoSection, ...(data.infoSection || {}) },
          mediaSection: { ...prev.mediaSection, ...(data.mediaSection || {}) },
          awardsSection: {
            ...prev.awardsSection,
            ...(data.awardsSection || {}),
          },
          teamSection: { ...prev.teamSection, ...(data.teamSection || {}) },
        }));

        if (data.aboutArea && Array.isArray(data.aboutArea.galleryImages)) {
          setGalleryFiles(new Array(data.aboutArea.galleryImages.length).fill(null));
        }
        if (data.teamSection && Array.isArray(data.teamSection.members)) {
          setTeamFiles(new Array(data.teamSection.members.length).fill(null));
        }
      } catch (err) {
        console.error("Failed to fetch about data", err);
      }
    };

    fetchAbout();
  }, []);

  // ---------- helpers ----------
  const setPageTitle = (patch) =>
    setModel((m) => ({ ...m, pageTitle: { ...m.pageTitle, ...patch } }));
  const setAboutArea = (patch) =>
    setModel((m) => ({ ...m, aboutArea: { ...m.aboutArea, ...patch } }));
  const setApproachSection = (patch) =>
    setModel((m) => ({ ...m, approachSection: { ...m.approachSection, ...patch } }));
  const setInfoSection = (patch) =>
    setModel((m) => ({ ...m, infoSection: { ...m.infoSection, ...patch } }));
  const setMediaSection = (patch) =>
    setModel((m) => ({ ...m, mediaSection: { ...m.mediaSection, ...patch } }));
  const setAwardsSection = (patch) =>
    setModel((m) => ({ ...m, awardsSection: { ...m.awardsSection, ...patch } }));
  const setTeamSection = (patch) =>
    setModel((m) => ({ ...m, teamSection: { ...m.teamSection, ...patch } }));

  // aboutArea: paragraphs management
  const addParagraph = () =>
    setAboutArea({ paragraphs: [...model.aboutArea.paragraphs, ""] });
  const updateParagraph = (i, text) => {
    const next = model.aboutArea.paragraphs.map((p, idx) =>
      idx === i ? text : p
    );
    setAboutArea({ paragraphs: next });
  };
  const removeParagraph = (i) =>
    setAboutArea({
      paragraphs: model.aboutArea.paragraphs.filter((_, idx) => idx !== i),
    });

  // aboutArea: gallery images
  const handleGalleryFiles = (files) => {
    // ImageUpload returns File[]; index used in submit
    setGalleryFiles(files);
  };

  const updateGalleryMeta = (i, patch) => {
    const next = model.aboutArea.galleryImages.map((g, idx) =>
      idx === i ? { ...g, ...patch } : g
    );
    setAboutArea({ galleryImages: next });
  };

  // approachSection
  const setApproachItems = (approachIndex, items) => {
    const next = model.approachSection.approaches.map((a, idx) =>
      idx === approachIndex ? { ...a, items } : a
    );
    setApproachSection({ approaches: next });
  };
  const updateApproach = (i, patch) => {
    const next = model.approachSection.approaches.map((a, idx) =>
      idx === i ? { ...a, ...patch } : a
    );
    setApproachSection({ approaches: next });
  };
  const addApproach = () => {
    setApproachSection({
      approaches: [
        ...model.approachSection.approaches,
        { title: "New approach", showShape: false, items: [] },
      ],
    });
  };
  const removeApproach = (i) =>
    setApproachSection({
      approaches: model.approachSection.approaches.filter(
        (_, idx) => idx !== i
      ),
    });

  // awards
  const addAwardCategory = () => {
    setAwardsSection({
      awards: [
        ...(model.awardsSection.awards || []),
        { category: "New Category", items: [] },
      ],
    });
  };
  const updateAwardCategory = (idx, patch) => {
    const next = (model.awardsSection.awards || []).map((a, i) =>
      i === idx ? { ...a, ...patch } : a
    );
    setAwardsSection({ awards: next });
  };
  const removeAwardCategory = (idx) =>
    setAwardsSection({
      awards: (model.awardsSection.awards || []).filter((_, i) => i !== idx),
    });

  const addAwardItem = (catIdx) => {
    const copy = [...(model.awardsSection.awards || [])];
    copy[catIdx].items = [
      ...(copy[catIdx].items || []),
      {
        title: "New Award",
        year: new Date().getFullYear().toString(),
      },
    ];
    setAwardsSection({ awards: copy });
  };
  const updateAwardItem = (catIdx, itemIdx, patch) => {
    const copy = [...(model.awardsSection.awards || [])];
    copy[catIdx].items = copy[catIdx].items.map((it, i) =>
      i === itemIdx ? { ...it, ...patch } : it
    );
    setAwardsSection({ awards: copy });
  };
  const removeAwardItem = (catIdx, itemIdx) => {
    const copy = [...(model.awardsSection.awards || [])];
    copy[catIdx].items = copy[catIdx].items.filter((_, i) => i !== itemIdx);
    setAwardsSection({ awards: copy });
  };

  // team members
  const addMember = () => {
    setTeamSection({
      members: [
        ...model.teamSection.members,
        { name: "New Member", post: "Role", imageUrl: "" },
      ],
    });
    setTeamFiles((p) => [...p, null]);
  };
  const updateMember = (idx, patch) => {
    const next = model.teamSection.members.map((m, i) =>
      i === idx ? { ...m, ...patch } : m
    );
    setTeamSection({ members: next });
  };
  const removeMember = (idx) => {
    setTeamSection({
      members: model.teamSection.members.filter((_, i) => i !== idx),
    });
    setTeamFiles((p) => p.filter((_, i) => i !== idx));
  };
  const handleTeamImageChange = (idx, files) => {
    setTeamFiles((prev) => {
      const copy = [...prev];
      copy[idx] = files && files.length ? files[0] : null;
      return copy;
    });
    if (files && files.length) {
      updateMember(idx, { imageUrl: "" });
    }
  };

  // media image handler
  const handleMediaFiles = (files) => {
    setMediaFiles(files);
    if (files && files.length) {
      setMediaSection({
        mediaImage: {
          ...(model.mediaSection.mediaImage || {}),
          imageUrl: "",
        },
      });
    }
  };

  // infoSection stats
  const updateStat = (i, patch) => {
    const next = model.infoSection.stats.map((s, idx) =>
      idx === i ? { ...s, ...patch } : s
    );
    setInfoSection({ stats: next });
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const fd = new FormData();
      const payload = JSON.parse(JSON.stringify(model));

      // gallery image URLs: clear only where a file exists
      if (payload.aboutArea && Array.isArray(payload.aboutArea.galleryImages)) {
        payload.aboutArea.galleryImages = payload.aboutArea.galleryImages.map(
          (g, idx) => ({
            ...g,
            imageUrl: galleryFiles[idx] ? "" : g.imageUrl || "",
          })
        );
      }

      // media image
      payload.mediaSection = {
        ...payload.mediaSection,
        mediaImage: {
          ...(payload.mediaSection.mediaImage || {}),
          imageUrl: mediaFiles[0]
            ? ""
            : payload.mediaSection.mediaImage?.imageUrl || "",
        },
      };

      // team images
      if (
        payload.teamSection &&
        Array.isArray(payload.teamSection.members)
      ) {
        payload.teamSection.members = payload.teamSection.members.map(
          (m, idx) => ({
            ...m,
            imageUrl: teamFiles[idx] ? "" : m.imageUrl || "",
          })
        );
      }

      fd.append("payload", JSON.stringify(payload));

      // append gallery files
      galleryFiles.forEach((file, idx) => {
        if (file) fd.append(`gallery_${idx}`, file, file.name);
      });

      // append media image
      if (mediaFiles && mediaFiles.length) {
        fd.append("mediaImage", mediaFiles[0], mediaFiles[0].name);
      }

      // append team images
      teamFiles.forEach((file, idx) => {
        if (file) fd.append(`teamImage_${idx}`, file, file.name);
      });

      // PUT /api/about
      const res = await api.put("/about", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data?.message || "Saved successfully.");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  };

  // reset
  const handleReset = () => {
    setModel(defaultModel);
    setGalleryFiles([]);
    setMediaFiles([]);
    setTeamFiles([]);
    setMessage("");
  };

  return (
    <div className="">
      <Navbar />
      <div className="flex flex-col md:flex-row gap-6 px-4 py-6 max-w-7xl mx-auto w-full">
        <SideBar />
        <div className="flex-1">
          <div className="max-w-6xl w-full">
            <h1 className="text-2xl font-semibold mb-4 px-2">
              Edit About Page
            </h1>

            {message && (
              <div className="mb-4 px-4 py-2 rounded bg-white/6">{message}</div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-lg border border-white/5 bg-[var(--panel)]/50 p-6"
            >
        {/* Page Title */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <label className="text-sm text-[var(--muted)]">Page Title</label>
          <input
            value={model.pageTitle.title}
            onChange={(e) => setPageTitle({ title: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />
        </section>

        {/* About Area */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <h2 className="font-medium mb-3">About Area</h2>

          <label className="text-sm text-[var(--muted)]">
            Info List (tags)
          </label>
          <TagInput
            value={model.aboutArea.infoList.items}
            onChange={(arr) =>
              setAboutArea({ infoList: { items: arr } })
            }
          />

          <div className="mt-3">
            <label className="text-sm text-[var(--muted)]">
              Paragraphs
            </label>
            <div className="space-y-2 mt-2">
              {model.aboutArea.paragraphs.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    rows={2}
                    value={p}
                    onChange={(e) => updateParagraph(i, e.target.value)}
                    className="flex-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                  />
                  <button
                    type="button"
                    onClick={() => removeParagraph(i)}
                    className="px-3 py-2 rounded bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addParagraph}
                className="px-3 py-2 rounded bg-white/6"
              >
                + Add paragraph
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm text-[var(--muted)]">
              Gallery Images
            </label>
            <ImageUpload
              value={galleryFiles}
              onChange={handleGalleryFiles}
              maxFiles={8}
            />
            {/* <div className="mt-2 space-y-2">
              {model.aboutArea.galleryImages.map((g, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    value={g.imageUrl}
                    onChange={(e) =>
                      updateGalleryMeta(idx, { imageUrl: e.target.value })
                    }
                    placeholder="Existing image path (or leave blank if uploading)"
                    className="flex-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                  />
                  <input
                    value={g.alt}
                    onChange={(e) =>
                      updateGalleryMeta(idx, { alt: e.target.value })
                    }
                    placeholder="Alt text"
                    className="w-48 px-3 py-2 rounded bg-[#071028] border border-white/8"
                  />
                </div>
              ))}
            </div> */}

            <div className="mt-2 space-y-3">
  {model.aboutArea.galleryImages.map((g, idx) => {
    const file = galleryFiles[idx];
    const src = file ? URL.createObjectURL(file) : g.imageUrl;

    return (
      <div key={idx} className="flex items-center gap-3">
        {src && (
          <img
            src={src}
            alt={g.alt || `Gallery image ${idx + 1}`}
            className="w-20 h-20 rounded object-cover border border-white/10"
          />
        )}

        <div className="flex-1 flex gap-2">
          <input
            value={g.imageUrl}
            onChange={(e) =>
              updateGalleryMeta(idx, { imageUrl: e.target.value })
            }
            placeholder="Image path (optional if uploading)"
            className="flex-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />
          {/* <input
            value={g.alt}
            onChange={(e) =>
              updateGalleryMeta(idx, { alt: e.target.value })
            }
            placeholder="Alt text"
            className="w-48 px-3 py-2 rounded bg-[#071028] border border-white/8"
          /> */}
        </div>
      </div>
    );
  })}
</div>

          </div>
        </section>

        {/* Approach Section */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <h2 className="font-medium mb-3">Approach Section</h2>

          <label className="text-sm text-[var(--muted)]">Subtitle</label>
          <input
            value={model.approachSection.subtitle}
            onChange={(e) =>
              setApproachSection({ subtitle: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />

          <label className="text-sm text-[var(--muted)] mt-3">
            Heading
          </label>
          <input
            value={model.approachSection.heading}
            onChange={(e) =>
              setApproachSection({ heading: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />

          <div className="mt-3 space-y-3">
            {model.approachSection.approaches.map((a, i) => (
              <div
                key={i}
                className="p-3 rounded bg-[#0b1220] border border-white/8"
              >
                <div className="flex items-center justify-between">
                  <input
                    value={a.title}
                    onChange={(e) =>
                      updateApproach(i, { title: e.target.value })
                    }
                    className="px-3 py-2 rounded bg-[#071028] border border-white/8"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={a.showShape}
                      onChange={(e) =>
                        updateApproach(i, { showShape: e.target.checked })
                      }
                    />
                    Show shape
                  </label>
                </div>

                <div className="mt-2">
                  <label className="text-sm text-[var(--muted)]">
                    Items (tags)
                  </label>
                  <TagInput
                    value={a.items || []}
                    onChange={(items) => setApproachItems(i, items)}
                  />
                </div>

                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => removeApproach(i)}
                    className="px-3 py-1 rounded bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addApproach}
              className="px-3 py-2 rounded bg-white/6"
            >
              + Add approach
            </button>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <h2 className="font-medium mb-3">Info Section</h2>
          <label className="text-sm text-[var(--muted)]">Subtitle</label>
          <input
            value={model.infoSection.subtitle || ""}
            onChange={(e) =>
              setInfoSection({ subtitle: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />

          <label className="text-sm text-[var(--muted)] mt-3">
            Heading
          </label>
          <input
            value={model.infoSection.heading}
            onChange={(e) =>
              setInfoSection({ heading: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />

          <div className="mt-3 space-y-2">
            {model.infoSection.stats.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={s.label}
                  onChange={(e) => updateStat(i, { label: e.target.value })}
                  className="w-72 px-3 py-2 rounded bg-[#071028] border border-white/8"
                />
                <input
                  value={s.value}
                  onChange={(e) => updateStat(i, { value: e.target.value })}
                  className="flex-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Media Section */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <h2 className="font-medium mb-3">Media Section</h2>
          <label className="text-sm text-[var(--muted)]">Heading</label>
          <input
            value={model.mediaSection.heading}
            onChange={(e) =>
              setMediaSection({ heading: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />

          <label className="text-sm text-[var(--muted)] mt-3">
            Text
          </label>
          <textarea
            rows={3}
            value={model.mediaSection.text}
            onChange={(e) =>
              setMediaSection({ text: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />

          {/* <div className="mt-3">
            <label className="text-sm text-[var(--muted)]">
              Existing image path
            </label>
            <input
              value={model.mediaSection.mediaImage.imageUrl}
              onChange={(e) =>
                setMediaSection({
                  mediaImage: {
                    ...model.mediaSection.mediaImage,
                    imageUrl: e.target.value,
                  },
                })
              }
              className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
            />
            <div className="mt-2">
              <ImageUpload
                value={mediaFiles}
                onChange={handleMediaFiles}
                maxFiles={1}
                maxSizeMB={5}
              />
            </div>
          </div> */}
          <div className="mt-3">
  {(model.mediaSection.mediaImage.imageUrl || mediaFiles.length > 0) && (
    <img
      src={
        mediaFiles.length
          ? URL.createObjectURL(mediaFiles[0])
          : model.mediaSection.mediaImage.imageUrl
      }
      alt={model.mediaSection.mediaImage.alt || "Media preview"}
      className="w-full max-h-64 object-cover rounded border border-white/10 mb-2"
    />
  )}

  <label className="text-sm text-[var(--muted)]">
    Image path (optional)
  </label>
  <input
    value={model.mediaSection.mediaImage.imageUrl}
    onChange={(e) =>
      setMediaSection({
        mediaImage: {
          ...model.mediaSection.mediaImage,
          imageUrl: e.target.value,
        },
      })
    }
    className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
  />

  <div className="mt-2">
    <ImageUpload
      value={mediaFiles}
      onChange={handleMediaFiles}
      maxFiles={1}
      maxSizeMB={5}
    />
  </div>
</div>

        </section>

        {/* Awards Section */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Awards Section</h2>
            <button
              type="button"
              onClick={addAwardCategory}
              className="px-3 py-1 rounded bg-white/6"
            >
              + Category
            </button>
          </div>

          <label className="text-sm text-[var(--muted)] mt-3">
            Heading
          </label>
          <input
            value={model.awardsSection.heading}
            onChange={(e) =>
              setAwardsSection({ heading: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />

          <div className="mt-3 space-y-3">
            {(model.awardsSection.awards || []).map((cat, ci) => (
              <div
                key={ci}
                className="p-3 rounded bg-[#0b1220] border border-white/8"
              >
                <div className="flex items-center justify-between">
                  <input
                    value={cat.category}
                    onChange={(e) =>
                      updateAwardCategory(ci, { category: e.target.value })
                    }
                    className="px-3 py-2 rounded bg-[#071028] border border-white/8"
                  />
                  <button
                    type="button"
                    onClick={() => removeAwardCategory(ci)}
                    className="px-3 py-1 rounded bg-red-600"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-2 space-y-2">
                  {cat.items.map((it, ii) => (
                    <div key={ii} className="flex gap-2 items-center">
                      <input
                        value={it.title}
                        onChange={(e) =>
                          updateAwardItem(ci, ii, { title: e.target.value })
                        }
                        className="flex-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                      />
                      <input
                        value={it.year}
                        onChange={(e) =>
                          updateAwardItem(ci, ii, { year: e.target.value })
                        }
                        className="w-28 px-3 py-2 rounded bg-[#071028] border border-white/8"
                      />
                      <button
                        type="button"
                        onClick={() => removeAwardItem(ci, ii)}
                        className="px-3 py-1 rounded bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addAwardItem(ci)}
                    className="px-3 py-1 rounded bg-white/6"
                  >
                    + Add award
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Team Section</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addMember}
                className="px-3 py-1 rounded bg-white/6"
              >
                + Member
              </button>
            </div>
          </div>

          <label className="text-sm text-[var(--muted)] mt-3">
            Heading
          </label>
          <input
            value={model.teamSection.heading}
            onChange={(e) =>
              setTeamSection({ heading: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />

          <label className="text-sm text-[var(--muted)] mt-3">
            Description
          </label>
          <textarea
            rows={2}
            value={model.teamSection.description}
            onChange={(e) =>
              setTeamSection({ description: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />

          <div className="mt-3 space-y-3">
            {model.teamSection.members.map((m, i) => (
              <div
                key={i}
                className="p-3 rounded bg-[#0b1220] border border-white/8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm text-[var(--muted)]">
                      Name
                    </label>
                    <input
                      value={m.name}
                      onChange={(e) =>
                        updateMember(i, { name: e.target.value })
                      }
                      className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-[var(--muted)]">
                      Post
                    </label>
                    <input
                      value={m.post}
                      onChange={(e) =>
                        updateMember(i, { post: e.target.value })
                      }
                      className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                    />
                  </div>

                  {/* <div>
                    <label className="text-sm text-[var(--muted)]">
                      Image
                    </label>
                    <ImageUpload
                      value={teamFiles[i] ? [teamFiles[i]] : []}
                      onChange={(files) => handleTeamImageChange(i, files)}
                      maxFiles={1}
                      maxSizeMB={5}
                    />
                    <div className="text-xs text-[var(--muted)] mt-2">
                      Current: {m.imageUrl || "(upload to replace)"}
                    </div>
                  </div> */}
                  <div>
  <label className="text-sm text-[var(--muted)]">
    Image
  </label>

  <ImageUpload
    value={teamFiles[i] ? [teamFiles[i]] : []}
    onChange={(files) => handleTeamImageChange(i, files)}
    maxFiles={1}
    maxSizeMB={5}
  />

  {(m.imageUrl || teamFiles[i]) && (
    <img
      src={
        teamFiles[i]
          ? URL.createObjectURL(teamFiles[i])
          : m.imageUrl
      }
      alt={m.name || "Team member"}
      className="mt-2 w-20 h-20 rounded-full object-cover border border-white/10"
    />
  )}
</div>

                </div>

                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeMember(i)}
                    className="px-3 py-1 rounded bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submit / Reset */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-[var(--accent)] text-black font-medium"
          >
            {loading ? "Saving..." : "Save About"}
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
        </div>
      </div>
    </div>
  );
}
