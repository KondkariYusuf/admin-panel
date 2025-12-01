// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import TagInput from "../components/TagInput";
import ImageUpload from "../components/ImageUpload";
import VideoUpload from "../components/VideoUpload";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import api from "../api/axios";

/**
 * HomePage editor for the provided home.js model.
 * - Uses TagInput for arrays of strings
 * - Uses ImageUpload and VideoUpload for media files
 * - Sends multipart/form-data to backend (/api/home)
 */

const defaultModel = {
  hero: {
    satisfiedClientsPercent: 198,
    projectsCount: 123,
    countriesCount: 124,
    descriptionText:
      "We’re a digital products design & development agency that works passionately with the digital experiences.",
  },
  about: {
    bodyText:
      "We’re a dynamic startup agency specializing in innovative solutions for businesses looking to elevate their brand presence.",
  },
  video: {
    videoUrl: "https://rrdevs.net/project-video/group-meeting.mp4",
  },
  serviceSection: {
    heading: "Complex proficiency",
    services: [
      {
        number: "(01)",
        title: "Branding",
        list: [
          "Creative Direction",
          "Brand Identity",
          "Branding Strategy",
          "Graphic Design",
          "Startup",
        ],
        imageUrl: "/assets/imgs/gallery/image-3.webp",
        detailsUrl: "/service-details",
      },
      {
        number: "(02)",
        title: "UI/UX Design",
        list: ["User Research", "Wireframing", "Prototyping", "Product Design"],
        imageUrl: "/assets/imgs/gallery/image-4.webp",
        detailsUrl: "/service-details",
      },
    ],
  },
  funFactSection: {
    title: "Perfect —activity",
    items: [
      { value: "1.8M", text: "Total Impressions" },
      { value: "260+", text: "Successful Projects" },
      { value: "12+", text: "Countries Reached" },
    ],
  },
  clientSection: {
    descriptionText:
      "We’re a great team of creatives with a strongest capabilities to helping progressive fields achieve their goals. With the best talent on every project done successfully",
    companyNames: ["Google", "Netflix", "Spotify", "Airbnb", "Figma"],
  },
  parallaxImage: {
    imageUrl: "/assets/imgs/gallery/image-7.webp",
    alt: "Creative team working",
  },
};

export default function HomePage() {
  const [model, setModel] = useState(defaultModel);

  // keep separate file states for uploads (File[] / File)
  const [videoFiles, setVideoFiles] = useState([]);
  const [parallaxFiles, setParallaxFiles] = useState([]);
  const [serviceImages, setServiceImages] = useState([]);
  const [clientLogos, setClientLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ---------- fetch existing home from backend on mount ----------
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await api.get("/home");
        const data = res.data;
        if (!data) return;

        setModel((prev) => ({
          ...prev,
          ...data,
          hero: { ...prev.hero, ...(data.hero || {}) },
          about: { ...prev.about, ...(data.about || {}) },
          video: { ...prev.video, ...(data.video || {}) },
          serviceSection: {
            ...prev.serviceSection,
            ...(data.serviceSection || {}),
          },
          funFactSection: {
            ...prev.funFactSection,
            ...(data.funFactSection || {}),
          },
          clientSection: {
            ...prev.clientSection,
            ...(data.clientSection || {}),
          },
          parallaxImage: {
            ...prev.parallaxImage,
            ...(data.parallaxImage || {}),
          },
        }));

        if (
          data.serviceSection &&
          Array.isArray(data.serviceSection.services)
        ) {
          setServiceImages(
            new Array(data.serviceSection.services.length).fill(null)
          );
        }
      } catch (err) {
        console.error("Failed to fetch home data", err);
      }
    };

    fetchHome();
  }, []);

  // ---------- helpers for nested updates ----------
  const setHero = (payload) =>
    setModel((m) => ({ ...m, hero: { ...m.hero, ...payload } }));

  const setAbout = (payload) =>
    setModel((m) => ({ ...m, about: { ...m.about, ...payload } }));

  const setVideo = (payload) =>
    setModel((m) => ({ ...m, video: { ...m.video, ...payload } }));

  const setServiceSection = (payload) =>
    setModel((m) => ({
      ...m,
      serviceSection: { ...m.serviceSection, ...payload },
    }));

  const setFunFactSection = (payload) =>
    setModel((m) => ({
      ...m,
      funFactSection: { ...m.funFactSection, ...payload },
    }));

  const setClientSection = (payload) =>
    setModel((m) => ({
      ...m,
      clientSection: { ...m.clientSection, ...payload },
    }));

  const setParallaxImage = (payload) =>
    setModel((m) => ({
      ...m,
      parallaxImage: { ...m.parallaxImage, ...payload },
    }));

  // ---------- services management ----------
  const addService = () => {
    setServiceSection({
      services: [
        ...model.serviceSection.services,
        {
          number: `(${String(model.serviceSection.services.length + 1).padStart(
            2,
            "0"
          )})`,
          title: "New Service",
          list: [],
          imageUrl: "",
          detailsUrl: "/service-details",
        },
      ],
    });
    setServiceImages((s) => [...s, null]);
  };

  const updateService = (index, patch) => {
    const next = model.serviceSection.services.map((s, i) =>
      i === index ? { ...s, ...patch } : s
    );
    setServiceSection({ services: next });
  };

  const removeService = (index) => {
    const next = model.serviceSection.services.filter((_, i) => i !== index);
    setServiceSection({ services: next });
    setServiceImages((s) => s.filter((_, i) => i !== index));
  };

  // ---------- funFact items ----------
  const addFunFact = () => {
    setFunFactSection({
      items: [...model.funFactSection.items, { value: "", text: "" }],
    });
  };
  const updateFunFact = (i, patch) => {
    const next = model.funFactSection.items.map((it, idx) =>
      idx === i ? { ...it, ...patch } : it
    );
    setFunFactSection({ items: next });
  };
  const removeFunFact = (i) => {
    const next = model.funFactSection.items.filter((_, idx) => idx !== i);
    setFunFactSection({ items: next });
  };

  // ---------- client companies ----------
  const handleClientLogos = (files) => {
    if (!files || !files.length) return;
    // append new files to existing clientLogos state
    setClientLogos((prev) => [...prev, ...files]);
  
    // do NOT clear existing companyNames — we want to append, not replace
    // only clear companyNames if you explicitly want to wipe them (we won't)
  };
  // remove an existing logo URL (already saved on model)
const removeExistingLogo = (index) => {
  setModel((m) => {
    const next = { ...m };
    if (!Array.isArray(next.clientSection?.companyNames)) return next;
    next.clientSection = {
      ...(next.clientSection || {}),
      companyNames: next.clientSection.companyNames.filter((_, i) => i !== index),
    };
    return next;
  });
};

// remove a newly selected file (before upload)
const removeNewLogo = (index) => {
  setClientLogos((prev) => prev.filter((_, i) => i !== index));
};
// BEFORE appending files, we build payload (deep clone)
const fd = new FormData();
const payload = JSON.parse(JSON.stringify(model));

// We WILL NOT clear payload.clientSection.companyNames here — keep existing URLs
payload.clientSection = {
  ...(payload.clientSection || {}),
  companyNames: Array.isArray(payload.clientSection.companyNames)
    ? payload.clientSection.companyNames.slice()
    : [],
};

// ... other file handling (parallax, services, video) stays the same ...

// append client logos — but set indices so they append after existing logos
const existingCount =
  Array.isArray(payload.clientSection.companyNames) &&
  payload.clientSection.companyNames.length
    ? payload.clientSection.companyNames.length
    : 0;

clientLogos.forEach((file, idx) => {
  if (file) {
    // send fieldname so backend can place urls at correct index
    fd.append(`clientLogo_${existingCount + idx}`, file, file.name);
  }
});

// append the payload JSON AFTER we've prepared it
fd.append("payload", JSON.stringify(payload));


  // ---------- parallax image handler ----------
  const handleParallaxFiles = (files) => {
    setParallaxFiles(files);
    if (files.length) setParallaxImage({ imageUrl: "" });
  };

  // ---------- service images handler ----------
  const handleServiceImageChange = (index, files) => {
    setServiceImages((prev) => {
      const copy = [...prev];
      copy[index] = files && files.length ? files[0] : null;
      return copy;
    });
    if (files && files.length) updateService(index, { imageUrl: "" });
  };

  // ---------- video upload ----------
  const handleVideoFiles = (files) => {
    setVideoFiles(files);
    if (files.length) setVideo({ videoUrl: "" });
  };

  // ---------- service list items ----------
  const setServiceList = (serviceIndex, listArray) => {
    const next = model.serviceSection.services.map((s, i) =>
      i === serviceIndex ? { ...s, list: listArray } : s
    );
    setServiceSection({ services: next });
  };

  // ---------- submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const fd = new FormData();

      // deep clone model
      const payload = JSON.parse(JSON.stringify(model));

      // Only clear URLs when new files are being uploaded
      if (parallaxFiles && parallaxFiles.length) {
        payload.parallaxImage = {
          ...(payload.parallaxImage || {}),
          imageUrl: "",
        };
      }

      payload.serviceSection = {
        ...payload.serviceSection,
        services: payload.serviceSection.services.map((s, idx) => {
          const hasFile = !!serviceImages[idx];
          return hasFile ? { ...s, imageUrl: "" } : s;
        }),
      };

      if (videoFiles && videoFiles.length) {
        payload.video = { ...(payload.video || {}), videoUrl: "" };
      }

      if (clientLogos && clientLogos.length) {
        payload.clientSection = {
          ...(payload.clientSection || {}),
          companyNames: [],
        };
      }

      // append JSON payload as string
      fd.append("payload", JSON.stringify(payload));

      // append parallax image
      if (parallaxFiles && parallaxFiles.length) {
        fd.append("parallaxImage", parallaxFiles[0], parallaxFiles[0].name);
      }

      // append service images
      serviceImages.forEach((file, idx) => {
        if (file) fd.append(`serviceImage_${idx}`, file, file.name);
      });

      // append video files
      videoFiles.forEach((file, idx) => {
        if (file) fd.append(`video_${idx}`, file, file.name);
      });

      // append client logos
      clientLogos.forEach((file, idx) => {
        if (file) fd.append(`clientLogo_${idx}`, file, file.name);
      });

      // send to backend: PUT /api/home
      const res = await api.put("/home", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data?.message || "Saved successfully");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      serviceImages.forEach((file) => file && URL.revokeObjectURL(file));
      parallaxFiles.forEach((file) => file && URL.revokeObjectURL(file));
      videoFiles.forEach((file) => file && URL.revokeObjectURL(file));
      clientLogos.forEach((file) => file && URL.revokeObjectURL(file));
    };
  }, [serviceImages, parallaxFiles, videoFiles, clientLogos]);

  return (
    <div className="">
      <Navbar />
      <div className="flex flex-col md:flex-row gap-6 px-4 py-6 max-w-7xl mx-auto w-full">
        <SideBar />
        <div className="flex-1">
          <div className="max-w-5xl w-full">
            <h1 className="text-2xl font-semibold mb-4 px-2">Edit Home Page</h1>

            {message && (
              <div className="mb-4 px-4 py-2 rounded bg-white/6 text-sm">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 p-6 max-w-5xl rounded-lg border border-white/5 bg-[var(--panel)]/50">
        {/* HERO */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <h2 className="font-medium mb-3">Hero</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-[var(--muted)]">
                Satisfied Clients %
              </label>
              <input
                type="number"
                value={model.hero.satisfiedClientsPercent}
                onChange={(e) =>
                  setHero({ satisfiedClientsPercent: Number(e.target.value) })
                }
                className="w-full px-3 py-2 mt-1 rounded bg-[#071028] border border-white/8"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--muted)]">
                Projects Count
              </label>
              <input
                type="number"
                value={model.hero.projectsCount}
                onChange={(e) =>
                  setHero({ projectsCount: Number(e.target.value) })
                }
                className="w-full px-3 py-2 mt-1 rounded bg-[#071028] border border-white/8"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--muted)]">
                Countries Count
              </label>
              <input
                type="number"
                value={model.hero.countriesCount}
                onChange={(e) =>
                  setHero({ countriesCount: Number(e.target.value) })
                }
                className="w-full px-3 py-2 mt-1 rounded bg-[#071028] border border-white/8"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm text-[var(--muted)]">
              Description
            </label>
            <textarea
              rows={3}
              value={model.hero.descriptionText}
              onChange={(e) => setHero({ descriptionText: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
            />
          </div>
        </section>

        {/* ABOUT */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <h2 className="font-medium mb-3">About</h2>
          <label className="block text-sm text-[var(--muted)]">Body Text</label>
          <textarea
            rows={4}
            value={model.about.bodyText}
            onChange={(e) => setAbout({ bodyText: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />
        </section>

        {/* VIDEO */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <h2 className="font-medium mb-3">Video</h2>

          <div className="mb-3">
            <label className="block text-sm text-[var(--muted)]">
              Existing Video URL (optional)
            </label>
            {/* <input
              type="text"
              value={model.video.videoUrl}
              onChange={(e) => setVideo({ videoUrl: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
              placeholder="https://..."
            /> */}
            {(model.video.videoUrl || videoFiles.length > 0) && (
              <video
                controls
                className="w-full mt-3 rounded border border-white/8"
                src={
                  videoFiles.length
                    ? URL.createObjectURL(videoFiles[0])
                    : model.video.videoUrl
                }
              />
            )}

            <input
              type="text"
              value={model.video.videoUrl}
              onChange={(e) => setVideo({ videoUrl: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
              placeholder="Paste video URL or upload below"
            />

            <div className="text-xs text-[var(--muted)] mt-1">
              Or upload a new video below (will replace URL).
            </div>
          </div>

          <VideoUpload
            value={videoFiles}
            onChange={handleVideoFiles}
            maxFiles={1}
          />
        </section>

        {/* SERVICE SECTION */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Service Section</h2>
            <button
              type="button"
              onClick={addService}
              className="px-3 py-1 rounded bg-white/6 text-sm"
            >
              + Add service
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <label className="text-sm text-[var(--muted)]">Heading</label>
            <input
              type="text"
              value={model.serviceSection.heading}
              onChange={(e) => setServiceSection({ heading: e.target.value })}
              className="w-full px-3 py-2 mt-1 rounded bg-[#071028] border border-white/8"
            />

            {model.serviceSection.services.map((s, idx) => (
              <div
                key={idx}
                className="p-3 rounded bg-[#0b1220] border border-white/8"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-[var(--muted)]">Number</div>
                    <input
                      value={s.number}
                      onChange={(e) =>
                        updateService(idx, { number: e.target.value })
                      }
                      className="px-2 py-1 rounded mt-1 bg-[#071028] border border-white/8"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => removeService(idx)}
                      className="px-2 py-1 rounded bg-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-[var(--muted)]">Title</label>
                    <input
                      value={s.title}
                      onChange={(e) =>
                        updateService(idx, { title: e.target.value })
                      }
                      className="w-full px-3 py-2 mt-1 rounded bg-[#071028] border border-white/8"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-[var(--muted)]">
                      Details URL
                    </label>
                    <input
                      value={s.detailsUrl}
                      onChange={(e) =>
                        updateService(idx, { detailsUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 mt-1 rounded bg-[#071028] border border-white/8"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-sm text-[var(--muted)]">
                    List (tags)
                  </label>
                  <TagInput
                    value={s.list || []}
                    onChange={(arr) => setServiceList(idx, arr)}
                  />
                </div>

                <div className="mt-3">
                  <label className="text-sm text-[var(--muted)]">
                    Service Image
                  </label>
                  <ImageUpload
                    value={serviceImages[idx] ? [serviceImages[idx]] : []}
                    onChange={(files) => handleServiceImageChange(idx, files)}
                    maxFiles={1}
                    maxSizeMB={5}
                    label="Upload image for this service"
                  />
                  <div className="text-xs text-[var(--muted)] mt-2">
                    {/* Current image path: {s.imageUrl || "— (upload will replace)"} */}
                    Current image:{" "}
                    {(s.imageUrl || serviceImages[idx]) && (
                      <img
                        src={
                          serviceImages[idx]
                            ? URL.createObjectURL(serviceImages[idx])
                            : s.imageUrl
                        }
                        alt="Service Preview"
                        className="mt-3 w-40 h-40 object-cover rounded border border-white/10"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FUN FACTS */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Fun Fact Section</h2>
            <button
              type="button"
              onClick={addFunFact}
              className="px-3 py-1 rounded bg-white/6 text-sm"
            >
              + Add item
            </button>
          </div>

          <div className="mt-3 space-y-3">
            <label className="text-sm text-[var(--muted)]">Title</label>
            <input
              value={model.funFactSection.title}
              onChange={(e) => setFunFactSection({ title: e.target.value })}
              className="w-full px-3 py-2 mt-1 rounded bg-[#071028] border border-white/8"
            />

            {model.funFactSection.items.map((it, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={it.value}
                  onChange={(e) => updateFunFact(i, { value: e.target.value })}
                  className="px-3 py-2 rounded bg-[#071028] border border-white/8 w-36"
                  placeholder="Value (ex: 1.8M)"
                />
                <input
                  value={it.text}
                  onChange={(e) => updateFunFact(i, { text: e.target.value })}
                  className="flex-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                  placeholder="Label text"
                />
                <button
                  type="button"
                  onClick={() => removeFunFact(i)}
                  className="px-2 py-1 rounded bg-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CLIENT SECTION */}
        {/* <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <h2 className="font-medium mb-2">Client Section</h2>
          <label className="text-sm text-[var(--muted)]">Description</label>
          <textarea
            rows={3}
            value={model.clientSection.descriptionText}
            onChange={(e) =>
              setClientSection({ descriptionText: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />

          <div className="mt-3 space-y-3">
            <label className="text-sm text-[var(--muted)]">Client Logos</label>

            {!clientLogos.length &&
              Array.isArray(model.clientSection.companyNames) &&
              model.clientSection.companyNames.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {model.clientSection.companyNames.map((url, idx) => (
                    <div
                      key={`${url}-${idx}`}
                      className="rounded border border-white/8 p-2 bg-[#0b1220]"
                    >
                      <img
                        src={url}
                        alt={`Client logo ${idx + 1}`}
                        className="w-full h-24 object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}

            <ImageUpload
              value={clientLogos}
              onChange={handleClientLogos}
              maxFiles={8}
              label="Upload client logos (drag & drop or click)"
            />
            <div className="text-xs text-[var(--muted)]">
              Uploading new files will replace the current logos.
            </div>
          </div>
        </section> */}

{/* CLIENT SECTION */}
<section className="bg-[var(--panel)] p-4 rounded border border-white/6">
  <h2 className="font-medium mb-2">Client Section</h2>
  <label className="text-sm text-[var(--muted)]">Description</label>
  <textarea
    rows={3}
    value={model.clientSection.descriptionText}
    onChange={(e) =>
      setClientSection({ descriptionText: e.target.value })
    }
    className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
  />

  <div className="mt-3 space-y-3">
    <label className="text-sm text-[var(--muted)]">Client Logos</label>

    {/* Existing saved logos (from model.clientSection.companyNames) */}
    {Array.isArray(model.clientSection.companyNames) &&
      model.clientSection.companyNames.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {model.clientSection.companyNames.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative rounded border border-white/8 p-2 bg-[#0b1220]"
            >
              <img
                src={url}
                alt={`Client logo ${idx + 1}`}
                className="w-full h-24 object-contain"
              />
              <button
                type="button"
                onClick={() => removeExistingLogo(idx)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

    {/* Newly selected files (before upload) */}
    {clientLogos && clientLogos.length > 0 && (
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
        {clientLogos.map((file, idx) => (
          <div
            key={file.name + "_" + idx}
            className="relative rounded border border-white/8 p-2 bg-[#0b1220]"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-full h-24 object-contain"
            />
            <button
              type="button"
              onClick={() => removeNewLogo(idx)}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}

    <ImageUpload
      value={clientLogos}
      onChange={handleClientLogos}
      maxFiles={8}
      label="Add client logos (drag & drop or click) — these will append"
    />
    <div className="text-xs text-[var(--muted)]">
      Uploading new files will append to current logos.
    </div>
  </div>
</section>


        {/* PARALLAX IMAGE */}
        <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
          <h2 className="font-medium mb-2">Parallax Image</h2>

          <label className="text-sm text-[var(--muted)]">Alt text</label>
          <input
            value={model.parallaxImage.alt}
            onChange={(e) => setParallaxImage({ alt: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
          />

          <div className="mt-3">
            {/* <div className="text-sm text-[var(--muted)]">
              Existing image path: {model.parallaxImage.imageUrl || "—"}
            </div> */}
            {(model.parallaxImage.imageUrl || parallaxFiles.length > 0) && (
              <img
                src={
                  parallaxFiles.length
                    ? URL.createObjectURL(parallaxFiles[0])
                    : model.parallaxImage.imageUrl
                }
                alt="Parallax Preview"
                className="mt-3 w-full max-h-[260px] object-cover rounded border border-white/10"
              />
            )}

            <ImageUpload
              value={parallaxFiles}
              onChange={handleParallaxFiles}
              maxFiles={1}
              maxSizeMB={5}
            />
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-[var(--accent)] text-black font-medium"
          >
            {loading ? "Saving..." : "Save Home"}
          </button>

          <button
            type="button"
            onClick={() => {
              setModel(defaultModel);
              setParallaxFiles([]);
              setServiceImages([]);
              setVideoFiles([]);
              setClientLogos([]);
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
