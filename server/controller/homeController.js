// // server/controllers/homeController.js
// const mongoose = require("mongoose");
// const Home = require("../models/home");
// const cloudinary = require("../utils/cloudinary");

// const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// const getHomeDoc = async (homeId) => {
//   if (homeId) {
//     if (!isValidId(homeId)) return null;
//     return await Home.findById(homeId);
//   }
//   let home = await Home.findOne({ slug: "home" });
//   if (!home) {
//     home = await Home.findOne();
//   }
//   return home;
// };

// // helper to upload buffer to cloudinary
// const uploadBufferToCloudinary = (buffer, folder, resource_type = "image") =>
//   new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder, resource_type },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     );
//     stream.end(buffer);
//   });

// /* ---------- CREATE HOME ---------- (unchanged) */
// const createHome = async (req, res) => {
//   try {
//     const existing = await Home.findOne({ slug: "home" });
//     if (existing) {
//       return res
//         .status(400)
//         .json({ message: "Home document already exists. Use update instead." });
//     }

//     const {
//       hero,
//       about,
//       video,
//       workSection,
//       serviceSection,
//       funFactSection,
//       clientSection,
//       parallaxImage,
//     } = req.body || {};

//     if (!hero || !about || !video) {
//       return res.status(400).json({
//         message: "hero, about and video sections are required to create home.",
//       });
//     }

//     const newHome = new Home({
//       hero,
//       about,
//       video,
//       workSection,
//       serviceSection,
//       funFactSection,
//       clientSection,
//       parallaxImage,
//       slug: "home",
//     });

//     await newHome.save();
//     res.status(201).json({ message: "Home created", home: newHome });
//   } catch (error) {
//     console.error("createHome error:", error);
//     res
//       .status(500)
//       .json({ message: "Error creating home", error: error.message });
//   }
// };

// /* ---------- GET HOME ---------- (unchanged) */
// const getHome = async (req, res) => {
//   try {
//     const homeId = req.params.id;
//     const home = await getHomeDoc(homeId);
//     if (!home) return res.status(404).json({ message: "Home not found" });
//     res.status(200).json(home);
//   } catch (error) {
//     console.error("getHome error:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching home", error: error.message });
//   }
// };

// /* ---------- UPDATE HOME (multipart + cloudinary) ---------- */
// // const updateHome = async (req, res) => {
// //   try {
// //     const homeId = req.params.id;
// //     const home = await getHomeDoc(homeId);
// //     if (!home) return res.status(404).json({ message: "Home not found" });

// //     // If the form is multipart, the React code sends a "payload" field as JSON string
// //     let incoming;
// //     if (req.body && req.body.payload) {
// //       try {
// //         incoming = JSON.parse(req.body.payload);
// //       } catch (e) {
// //         return res.status(400).json({ message: "Invalid JSON in payload" });
// //       }
// //     } else {
// //       incoming = req.body || {};
// //     }

// //     const files = req.files || [];

// //     // 1. Parallax image (field: "parallaxImage")
// //     const parallaxFile = files.find((f) => f.fieldname === "parallaxImage");
// //     if (parallaxFile) {
// //       const uploaded = await uploadBufferToCloudinary(
// //         parallaxFile.buffer,
// //         "home/parallax",
// //         "image"
// //       );
// //       incoming.parallaxImage = {
// //         ...(incoming.parallaxImage || {}),
// //         imageUrl: uploaded.secure_url,
// //       };
// //     }

// //     // 2. Service images (fields: "serviceImage_0", "serviceImage_1", ...)
// //     const serviceFiles = files.filter((f) =>
// //       f.fieldname.startsWith("serviceImage_")
// //     );
// //     if (
// //       incoming.serviceSection &&
// //       Array.isArray(incoming.serviceSection.services)
// //     ) {
// //       for (const file of serviceFiles) {
// //         const parts = file.fieldname.split("_");
// //         const index = Number(parts[1]);
// //         if (
// //           !Number.isNaN(index) &&
// //           incoming.serviceSection.services[index]
// //         ) {
// //           const uploaded = await uploadBufferToCloudinary(
// //             file.buffer,
// //             "home/services",
// //             "image"
// //           );
// //           incoming.serviceSection.services[index].imageUrl =
// //             uploaded.secure_url;
// //         }
// //       }
// //     }

// //     // 3. Video file(s) (fields: "video_0", "video_1"...; we’ll just use the first)
// //     const videoFiles = files.filter((f) => f.fieldname.startsWith("video_"));
// //     if (videoFiles.length) {
// //       const firstVideo = videoFiles[0];
// //       const uploadedVideo = await uploadBufferToCloudinary(
// //         firstVideo.buffer,
// //         "home/videos",
// //         "video"
// //       );
// //       incoming.video = {
// //         ...(incoming.video || {}),
// //         videoUrl: uploadedVideo.secure_url,
// //       };
// //     }

// //     // destructure AFTER we've potentially updated incoming with URLs
// //     const {
// //       hero,
// //       about,
// //       video,
// //       workSection,
// //       serviceSection,
// //       funFactSection,
// //       clientSection,
// //       parallaxImage,
// //       slug,
// //     } = incoming || {};

// //     if (hero) {
// //       home.hero = {
// //         ...(home.hero && home.hero.toObject
// //           ? home.hero.toObject()
// //           : home.hero),
// //         ...hero,
// //       };
// //     }

// //     if (about) {
// //       home.about = {
// //         ...(home.about && home.about.toObject
// //           ? home.about.toObject()
// //           : home.about),
// //         ...about,
// //       };
// //     }

// //     if (video) {
// //       home.video = {
// //         ...(home.video && home.video.toObject
// //           ? home.video.toObject()
// //           : home.video),
// //         ...video,
// //       };
// //     }

// //     if (workSection) {
// //       home.workSection = {
// //         ...(home.workSection && home.workSection.toObject
// //           ? home.workSection.toObject()
// //           : home.workSection),
// //         ...workSection,
// //       };
// //     }

// //     if (serviceSection) {
// //       home.serviceSection = {
// //         ...(home.serviceSection && home.serviceSection.toObject
// //           ? home.serviceSection.toObject()
// //           : home.serviceSection),
// //         ...serviceSection,
// //       };
// //     }

// //     if (funFactSection) {
// //       home.funFactSection = {
// //         ...(home.funFactSection && home.funFactSection.toObject
// //           ? home.funFactSection.toObject()
// //           : home.funFactSection),
// //         ...funFactSection,
// //       };
// //     }

// //     if (clientSection) {
// //       home.clientSection = {
// //         ...(home.clientSection && home.clientSection.toObject
// //           ? home.clientSection.toObject()
// //           : home.clientSection),
// //         ...clientSection,
// //       };
// //     }

// //     if (parallaxImage) {
// //       home.parallaxImage = {
// //         ...(home.parallaxImage && home.parallaxImage.toObject
// //           ? home.parallaxImage.toObject()
// //           : home.parallaxImage),
// //         ...parallaxImage,
// //       };
// //     }

// //     if (slug !== undefined) {
// //       home.slug = slug;
// //     }

// //     await home.save();
// //     res.status(200).json({ message: "Home updated", home });
// //   } catch (error) {
// //     console.error("updateHome error:", error);
// //     res
// //       .status(500)
// //       .json({ message: "Error updating home", error: error.message });
// //   }
// // };

// /* ---------- UPDATE HOME (multipart + cloudinary) ---------- */
// const updateHome = async (req, res) => {
//   try {
//     const homeId = req.params.id;
//     const home = await getHomeDoc(homeId);
//     if (!home) return res.status(404).json({ message: "Home not found" });

//     // If the form is multipart, the React code sends a "payload" field as JSON string
//     let incoming;
//     if (req.body && req.body.payload) {
//       try {
//         incoming = JSON.parse(req.body.payload);
//       } catch (e) {
//         return res.status(400).json({ message: "Invalid JSON in payload" });
//       }
//     } else {
//       incoming = req.body || {};
//     }

//     const files = req.files || [];

//     // 1. Parallax image (field: "parallaxImage")
//     const parallaxFile = files.find((f) => f.fieldname === "parallaxImage");
//     if (parallaxFile) {
//       const uploaded = await uploadBufferToCloudinary(
//         parallaxFile.buffer,
//         "home/parallax",
//         "image"
//       );
//       incoming.parallaxImage = {
//         ...(incoming.parallaxImage || {}),
//         imageUrl: uploaded.secure_url,
//       };
//     }

//     // 2. Service images (fields: "serviceImage_0", "serviceImage_1", ...)
//     const serviceFiles = files.filter((f) =>
//       f.fieldname.startsWith("serviceImage_")
//     );
//     if (
//       incoming.serviceSection &&
//       Array.isArray(incoming.serviceSection.services)
//     ) {
//       for (const file of serviceFiles) {
//         const parts = file.fieldname.split("_");
//         const index = Number(parts[1]);
//         if (
//           !Number.isNaN(index) &&
//           incoming.serviceSection.services[index]
//         ) {
//           const uploaded = await uploadBufferToCloudinary(
//             file.buffer,
//             "home/services",
//             "image"
//           );
//           incoming.serviceSection.services[index].imageUrl =
//             uploaded.secure_url;
//         }
//       }
//     }

//     // 3. Video file(s) (fields: "video_0", "video_1"...; we’ll just use the first)
//     const videoFiles = files.filter((f) => f.fieldname.startsWith("video_"));
//     if (videoFiles.length) {
//       const firstVideo = videoFiles[0];
//       const uploadedVideo = await uploadBufferToCloudinary(
//         firstVideo.buffer,
//         "home/videos",
//         "video"
//       );
//       incoming.video = {
//         ...(incoming.video || {}),
//         videoUrl: uploadedVideo.secure_url,
//       };
//     }

//     // 4. Client logos (fields: "clientLogo_0", "clientLogo_1", ...)
//     const clientFiles = files.filter((f) =>
//       f.fieldname.startsWith("clientLogo_")
//     );
//     if (clientFiles.length) {
//       // ensure incoming.clientSection exists and has companyNames array (frontend sends empty array when uploading)
//       incoming.clientSection = {
//         ...(incoming.clientSection || {}),
//         companyNames: Array.isArray(incoming.clientSection?.companyNames)
//           ? incoming.clientSection.companyNames.slice()
//           : [],
//       };

//       // Place uploaded urls at the index parsed from fieldname to preserve order.
//       for (const file of clientFiles) {
//         const parts = file.fieldname.split("_");
//         const index = Number(parts[1]);
//         const uploaded = await uploadBufferToCloudinary(
//           file.buffer,
//           "home/clients",
//           "image"
//         );
//         if (!Number.isNaN(index)) {
//           incoming.clientSection.companyNames[index] = uploaded.secure_url;
//         } else {
//           // fallback: push if index parsing failed
//           incoming.clientSection.companyNames.push(uploaded.secure_url);
//         }
//       }

//       // remove any undefined gaps and compact the array
//       incoming.clientSection.companyNames = incoming.clientSection.companyNames.filter(
//         (x) => !!x
//       );
//     }

//     // destructure AFTER we've potentially updated incoming with URLs
//     const {
//       hero,
//       about,
//       video,
//       workSection,
//       serviceSection,
//       funFactSection,
//       clientSection,
//       parallaxImage,
//       slug,
//     } = incoming || {};

//     if (hero) {
//       home.hero = {
//         ...(home.hero && home.hero.toObject
//           ? home.hero.toObject()
//           : home.hero),
//         ...hero,
//       };
//     }

//     if (about) {
//       home.about = {
//         ...(home.about && home.about.toObject
//           ? home.about.toObject()
//           : home.about),
//         ...about,
//       };
//     }

//     if (video) {
//       home.video = {
//         ...(home.video && home.video.toObject
//           ? home.video.toObject()
//           : home.video),
//         ...video,
//       };
//     }

//     if (workSection) {
//       home.workSection = {
//         ...(home.workSection && home.workSection.toObject
//           ? home.workSection.toObject()
//           : home.workSection),
//         ...workSection,
//       };
//     }

//     if (serviceSection) {
//       home.serviceSection = {
//         ...(home.serviceSection && home.serviceSection.toObject
//           ? home.serviceSection.toObject()
//           : home.serviceSection),
//         ...serviceSection,
//       };
//     }

//     if (funFactSection) {
//       home.funFactSection = {
//         ...(home.funFactSection && home.funFactSection.toObject
//           ? home.funFactSection.toObject()
//           : home.funFactSection),
//         ...funFactSection,
//       };
//     }

//     if (clientSection) {
//       home.clientSection = {
//         ...(home.clientSection && home.clientSection.toObject
//           ? home.clientSection.toObject()
//           : home.clientSection),
//         ...clientSection,
//       };
//     }

//     if (parallaxImage) {
//       home.parallaxImage = {
//         ...(home.parallaxImage && home.parallaxImage.toObject
//           ? home.parallaxImage.toObject()
//           : home.parallaxImage),
//         ...parallaxImage,
//       };
//     }

//     if (slug !== undefined) {
//       home.slug = slug;
//     }

//     await home.save();
//     res.status(200).json({ message: "Home updated", home });
//   } catch (error) {
//     console.error("updateHome error:", error);
//     res
//       .status(500)
//       .json({ message: "Error updating home", error: error.message });
//   }
// };



// /* ---------- DELETE HOME ---------- (unchanged) */
// const deleteHome = async (req, res) => {
//   try {
//     const homeId = req.params.id;
//     let deleted;

//     if (homeId) {
//       if (!isValidId(homeId))
//         return res.status(400).json({ message: "Invalid home id" });
//       deleted = await Home.findByIdAndDelete(homeId);
//     } else {
//       const first =
//         (await Home.findOne({ slug: "home" })) || (await Home.findOne());
//       if (!first) return res.status(404).json({ message: "Home not found" });
//       deleted = await Home.findByIdAndDelete(first._id);
//     }

//     if (!deleted) return res.status(404).json({ message: "Home not found" });

//     res.status(200).json({ message: "Home deleted", home: deleted });
//   } catch (error) {
//     console.error("deleteHome error:", error);
//     res
//       .status(500)
//       .json({ message: "Error deleting home", error: error.message });
//   }
// };

// module.exports = {
//   createHome,
//   getHome,
//   updateHome,
//   deleteHome,
// };
// server/controllers/homeController.js
const mongoose = require("mongoose");
const Home = require("../models/home");
const cloudinary = require("../utils/cloudinary");

/**
 * Home controller
 * - Expects multipart forms handled by multer with memoryStorage (so req.files[].buffer exists)
 * - Frontend should send a JSON string field named `payload` when uploading files
 * - Client logos should be sent with fieldnames like `clientLogo_0`, `clientLogo_1`, ...
 */

/* ---------- helpers ---------- */
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Resolve the Home document to use:
 * - If homeId is provided and valid, findById
 * - Else findOne({ slug: "home" }) or fallback to any Home document
 */
const getHomeDoc = async (homeId) => {
  if (homeId) {
    if (!isValidId(homeId)) return null;
    return await Home.findById(homeId);
  }
  let home = await Home.findOne({ slug: "home" });
  if (!home) {
    home = await Home.findOne();
  }
  return home;
};

/**
 * Upload a Buffer to Cloudinary using upload_stream
 * folder: destination folder on Cloudinary
 * resource_type: 'image' | 'video' etc.
 */
const uploadBufferToCloudinary = (buffer, folder, resource_type = "image") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });

/* ---------- CREATE HOME ---------- */
const createHome = async (req, res) => {
  try {
    const existing = await Home.findOne({ slug: "home" });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Home document already exists. Use update instead." });
    }

    // If multipart and frontend sends `payload`, parse it. Otherwise use req.body.
    let incoming;
    if (req.body && req.body.payload) {
      try {
        incoming = JSON.parse(req.body.payload);
      } catch (e) {
        return res.status(400).json({ message: "Invalid JSON in payload" });
      }
    } else {
      incoming = req.body || {};
    }

    const {
      hero,
      about,
      video,
      workSection,
      serviceSection,
      funFactSection,
      clientSection,
      parallaxImage,
    } = incoming || {};

    if (!hero || !about || !video) {
      return res.status(400).json({
        message: "hero, about and video sections are required to create home.",
      });
    }

    const newHome = new Home({
      hero,
      about,
      video,
      workSection,
      serviceSection,
      funFactSection,
      clientSection,
      parallaxImage,
      slug: "home",
    });

    await newHome.save();
    res.status(201).json({ message: "Home created", home: newHome });
  } catch (error) {
    console.error("createHome error:", error);
    res
      .status(500)
      .json({ message: "Error creating home", error: error.message });
  }
};

/* ---------- GET HOME ---------- */
const getHome = async (req, res) => {
  try {
    const homeId = req.params.id;
    const home = await getHomeDoc(homeId);
    if (!home) return res.status(404).json({ message: "Home not found" });
    res.status(200).json(home);
  } catch (error) {
    console.error("getHome error:", error);
    res
      .status(500)
      .json({ message: "Error fetching home", error: error.message });
  }
};

/* ---------- UPDATE HOME (multipart + cloudinary) ---------- */
const updateHome = async (req, res) => {
  try {
    const homeId = req.params.id;
    const home = await getHomeDoc(homeId);
    if (!home) return res.status(404).json({ message: "Home not found" });

    // Parse incoming payload (frontend convention: `payload` JSON string)
    let incoming;
    if (req.body && req.body.payload) {
      try {
        incoming = JSON.parse(req.body.payload);
      } catch (e) {
        return res.status(400).json({ message: "Invalid JSON in payload" });
      }
    } else {
      incoming = req.body || {};
    }

    const files = Array.isArray(req.files) ? req.files : [];

    // ---------- 1) Parallax image ----------
    const parallaxFile = files.find((f) => f.fieldname === "parallaxImage");
    if (parallaxFile && parallaxFile.buffer) {
      try {
        const uploaded = await uploadBufferToCloudinary(
          parallaxFile.buffer,
          "home/parallax",
          "image"
        );
        incoming.parallaxImage = {
          ...(incoming.parallaxImage || {}),
          imageUrl: uploaded.secure_url,
        };
      } catch (err) {
        console.error("Failed to upload parallax image:", err);
        // continue — we still want to process other files/data
      }
    }

    // ---------- 2) Service images (serviceImage_<index>) ----------
    const serviceFiles = files.filter((f) =>
      String(f.fieldname).startsWith("serviceImage_")
    );
    if (
      serviceFiles.length &&
      incoming.serviceSection &&
      Array.isArray(incoming.serviceSection.services)
    ) {
      for (const file of serviceFiles) {
        const parts = String(file.fieldname).split("_");
        const index = Number(parts[1]);
        if (!Number.isNaN(index) && incoming.serviceSection.services[index]) {
          try {
            const uploaded = await uploadBufferToCloudinary(
              file.buffer,
              "home/services",
              "image"
            );
            incoming.serviceSection.services[index].imageUrl =
              uploaded.secure_url;
          } catch (err) {
            console.error(
              `Failed to upload serviceImage_${index}:`,
              err.message || err
            );
          }
        }
      }
    }

    // ---------- 3) Video files (video_<index>) — we take first ----------
    const videoFiles = files.filter((f) => String(f.fieldname).startsWith("video_"));
    if (videoFiles.length) {
      const firstVideo = videoFiles[0];
      if (firstVideo && firstVideo.buffer) {
        try {
          const uploadedVideo = await uploadBufferToCloudinary(
            firstVideo.buffer,
            "home/videos",
            "video"
          );
          incoming.video = {
            ...(incoming.video || {}),
            videoUrl: uploadedVideo.secure_url,
          };
        } catch (err) {
          console.error("Failed to upload video:", err);
        }
      }
    }

    // ---------- 4) Client logos (clientLogo_<index>) ----------
    const clientFiles = files.filter((f) =>
      String(f.fieldname).startsWith("clientLogo_")
    );

    if (clientFiles.length) {
      // Ensure incoming.clientSection exists and has companyNames array
      incoming.clientSection = {
        ...(incoming.clientSection || {}),
        companyNames: Array.isArray(incoming.clientSection?.companyNames)
          ? incoming.clientSection.companyNames.slice()
          : [],
      };

      // For each uploaded file, parse the index and put secure_url at that index.
      for (const file of clientFiles) {
        const parts = String(file.fieldname).split("_");
        const index = Number(parts[1]);
        try {
          const uploaded = await uploadBufferToCloudinary(
            file.buffer,
            "home/clients",
            "image"
          );
          if (!Number.isNaN(index)) {
            incoming.clientSection.companyNames[index] = uploaded.secure_url;
          } else {
            // fallback: push if index parsing failed
            incoming.clientSection.companyNames.push(uploaded.secure_url);
          }
        } catch (err) {
          console.error(
            `Failed to upload client logo (${file.fieldname}):`,
            err.message || err
          );
        }
      }

      // Compact the array and remove empty entries
      incoming.clientSection.companyNames = incoming.clientSection.companyNames.filter(
        (x) => !!x
      );
    }

    // After file uploads, destructure incoming fields to apply to home
    const {
      hero,
      about,
      video,
      workSection,
      serviceSection,
      funFactSection,
      clientSection,
      parallaxImage,
      slug,
    } = incoming || {};

    // Merge patterns: keep existing home values, overwrite with incoming
    if (hero) {
      home.hero = {
        ...(home.hero && home.hero.toObject ? home.hero.toObject() : home.hero),
        ...hero,
      };
    }

    if (about) {
      home.about = {
        ...(home.about && home.about.toObject ? home.about.toObject() : home.about),
        ...about,
      };
    }

    if (video) {
      home.video = {
        ...(home.video && home.video.toObject ? home.video.toObject() : home.video),
        ...video,
      };
    }

    if (workSection) {
      home.workSection = {
        ...(home.workSection && home.workSection.toObject
          ? home.workSection.toObject()
          : home.workSection),
        ...workSection,
      };
    }

    if (serviceSection) {
      home.serviceSection = {
        ...(home.serviceSection && home.serviceSection.toObject
          ? home.serviceSection.toObject()
          : home.serviceSection),
        ...serviceSection,
      };
    }

    if (funFactSection) {
      home.funFactSection = {
        ...(home.funFactSection && home.funFactSection.toObject
          ? home.funFactSection.toObject()
          : home.funFactSection),
        ...funFactSection,
      };
    }

    if (clientSection) {
      home.clientSection = {
        ...(home.clientSection && home.clientSection.toObject
          ? home.clientSection.toObject()
          : home.clientSection),
        ...clientSection,
      };
    }

    if (parallaxImage) {
      home.parallaxImage = {
        ...(home.parallaxImage && home.parallaxImage.toObject
          ? home.parallaxImage.toObject()
          : home.parallaxImage),
        ...parallaxImage,
      };
    }

    if (slug !== undefined) {
      home.slug = slug;
    }

    await home.save();
    res.status(200).json({ message: "Home updated", home });
  } catch (error) {
    console.error("updateHome error:", error);
    res
      .status(500)
      .json({ message: "Error updating home", error: error.message });
  }
};

/* ---------- DELETE HOME ---------- */
const deleteHome = async (req, res) => {
  try {
    const homeId = req.params.id;
    let deleted;

    if (homeId) {
      if (!isValidId(homeId))
        return res.status(400).json({ message: "Invalid home id" });
      deleted = await Home.findByIdAndDelete(homeId);
    } else {
      const first =
        (await Home.findOne({ slug: "home" })) || (await Home.findOne());
      if (!first) return res.status(404).json({ message: "Home not found" });
      deleted = await Home.findByIdAndDelete(first._id);
    }

    if (!deleted) return res.status(404).json({ message: "Home not found" });

    res.status(200).json({ message: "Home deleted", home: deleted });
  } catch (error) {
    console.error("deleteHome error:", error);
    res
      .status(500)
      .json({ message: "Error deleting home", error: error.message });
  }
};

module.exports = {
  createHome,
  getHome,
  updateHome,
  deleteHome,
};
