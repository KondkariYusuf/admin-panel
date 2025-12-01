// src/pages/ServiceInfoPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import TagInput from "../components/TagInput";
import ImageUpload from "../components/ImageUpload";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";

/**
 * Admin editor for the Service Info model:
 * {
 *  leftImage: { src, alt, width, height, speed },
 *  paragraphs: [string],
 *  rightImage: { src, alt, width, height, speed }
 * }
 *
 * - GET /admin/service-info     -> loads existing doc (optional)
 * - POST /admin/service-info    -> saves payload + files (left/right) as multipart/form-data
 *
 * Server should accept:
 *  - payload (stringified JSON)
 *  - leftImage (file) optional
 *  - rightImage (file) optional
 */

const defaultModel = {
  leftImage: {
    src: "/assets/imgs/gallery/image-10.webp",
    alt: "Service info visual",
    width: 250,
    height: 320,
    speed: "0.9",
  },
  paragraphs: [
    "A practical guide explaining how and why Sage Craft should be part of every project to ensure its high quality and seamless user experience.",
    "If you already understand ask to continue scrolling; otherwise, click the link below to explore more.",
  ],
  rightImage: {
    src: "/assets/imgs/gallery/image-11.webp",
    alt: "Service related",
    width: 740,
    height: 930,
    speed: "0.8",
  },
};

export default function ServiceInfoPage() {
  const [model, setModel] = useState(defaultModel);
  const [leftFile, setLeftFile] = useState(null);
  const [rightFile, setRightFile] = useState(null);
  const [leftPreview, setLeftPreview] = useState(model.leftImage.src);
  const [rightPreview, setRightPreview] = useState(model.rightImage.src);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // load existing data on mount (if backend exposes GET /admin/service-info)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/services");
        if (res?.data) {
          // expected server returns the model object
          setModel((m) => ({ ...m, ...res.data }));
          setLeftPreview(res.data.leftImage?.src || defaultModel.leftImage.src);
          setRightPreview(res.data.rightImage?.src || defaultModel.rightImage.src);
        }
      } catch (err) {
        // ignore if not implemented — keep defaults
        // console.warn("No existing service-info or failed to load:", err);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // model helpers
  const updateLeft = (patch) =>
    setModel((m) => ({ ...m, leftImage: { ...m.leftImage, ...patch } }));
  const updateRight = (patch) =>
    setModel((m) => ({ ...m, rightImage: { ...m.rightImage, ...patch } }));
  const setParagraphs = (arr) => setModel((m) => ({ ...m, paragraphs: arr }));

  // handle image file selections (single-file)
  const handleLeftFiles = (files) => {
    const f = files && files.length ? files[0] : null;
    setLeftFile(f);
    setLeftPreview(f ? URL.createObjectURL(f) : model.leftImage.src);
    if (f) updateLeft({ src: "" }); // clear src to indicate replacement
  };

  const handleRightFiles = (files) => {
    const f = files && files.length ? files[0] : null;
    setRightFile(f);
    setRightPreview(f ? URL.createObjectURL(f) : model.rightImage.src);
    if (f) updateRight({ src: "" });
  };

  // paragraphs CRUD handled by simple add/remove/edit (use TagInput only if you prefer)
  const updateParagraph = (index, text) => {
    setModel((m) => {
      const copy = { ...m, paragraphs: [...m.paragraphs] };
      copy.paragraphs[index] = text;
      return copy;
    });
  };
  const addParagraph = () =>
    setModel((m) => ({ ...m, paragraphs: [...m.paragraphs, ""] }));
  const removeParagraph = (index) =>
    setModel((m) => ({ ...m, paragraphs: m.paragraphs.filter((_, i) => i !== index) }));

  // save handler: sends payload JSON + leftImage/rightImage files as multipart/form-data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const fd = new FormData();
      // make a copy and clear src for images that will be uploaded
      const payload = JSON.parse(JSON.stringify(model));
      payload.leftImage = { ...(payload.leftImage || {}), src: leftFile ? "" : payload.leftImage?.src || "" };
      payload.rightImage = { ...(payload.rightImage || {}), src: rightFile ? "" : payload.rightImage?.src || "" };

      fd.append("payload", JSON.stringify(payload));
      if (leftFile) fd.append("leftImage", leftFile, leftFile.name);
      if (rightFile) fd.append("rightImage", rightFile, rightFile.name);

      const res = await api.post("/services", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data?.message || "Saved successfully.");
      // server might return saved model — update local state & previews accordingly
      if (res.data?.serviceInfo) {
        setModel(res.data.serviceInfo);
        setLeftPreview(res.data.serviceInfo.leftImage?.src || defaultModel.leftImage.src);
        setRightPreview(res.data.serviceInfo.rightImage?.src || defaultModel.rightImage.src);
        setLeftFile(null);
        setRightFile(null);
      }
    } catch (err) {
      console.error("save service-info error:", err);
      setMessage(err.response?.data?.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setModel(defaultModel);
    setLeftFile(null);
    setRightFile(null);
    setLeftPreview(defaultModel.leftImage.src);
    setRightPreview(defaultModel.rightImage.src);
    setMessage("");
  };

  return (
    <div className="">
      <Navbar />
      <div className="flex flex-col md:flex-row gap-6 px-4 py-6 max-w-7xl mx-auto w-full">
        <SideBar />
        <div className="flex-1">
          <div className="max-w-5xl w-full">
            <h1 className="text-2xl font-semibold mb-4 px-2">
              Edit Service Info
            </h1>

            {message && (
              <div className="mb-4 px-4 py-2 rounded bg-white/6 text-sm">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-white/5 bg-[var(--panel)]/50 p-6">
          {/* Images + paragraphs */}
          <section className="bg-[var(--panel)] p-4 rounded border border-white/6">
            <div>
              <label className="text-sm text-[var(--muted)]">Left Image</label>
              <div className="mt-2 mb-2">
                {leftPreview && (
                  <div className="rounded overflow-hidden mb-2" style={{ maxHeight: 320 }}>
                    <img src={leftPreview} alt="left preview" className="w-full h-auto object-cover block" />
                  </div>
                )}
                <ImageUpload value={leftFile ? [leftFile] : []} onChange={handleLeftFiles} maxFiles={1} maxSizeMB={5} />
              </div>

              
            </div>

            <div className="md:col-span-1 md:col-start-2">
              <label className="text-sm text-[var(--muted)]">Paragraphs</label>
              <div className="space-y-2 mt-2">
                {model.paragraphs.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <textarea
                      rows={2}
                      className="flex-1 px-3 py-2 rounded bg-[#071028] border border-white/8"
                      value={p}
                      onChange={(e) => updateParagraph(i, e.target.value)}
                    />
                    <button type="button" onClick={() => removeParagraph(i)} className="px-3 py-2 rounded bg-red-600">
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button type="button" onClick={addParagraph} className="px-3 py-2 rounded bg-white/6">
                    + Add paragraph
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-[var(--muted)]">Right Image</label>
              <div className="mt-2 mb-2">
                {rightPreview && (
                  <div className="rounded overflow-hidden mb-2" style={{ maxHeight: 420 }}>
                    <img src={rightPreview} alt="right preview" className="w-full h-auto object-cover block" />
                  </div>
                )}
                <ImageUpload value={rightFile ? [rightFile] : []} onChange={handleRightFiles} maxFiles={1} maxSizeMB={6} />
              </div>

              
            </div>
          </section>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-[var(--accent)] text-black font-medium">
              {loading ? "Saving..." : "Save Service Info"}
            </button>

            <button type="button" onClick={handleReset} className="px-4 py-2 rounded bg-white/6">
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