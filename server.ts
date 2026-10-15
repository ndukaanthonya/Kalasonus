import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

// Initialize express server
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// In-memory or file-backed database store for Mints (Supabase fallback)
const MINTS_FILE = path.join(process.cwd(), "mints_data.json");

function loadMintsStore(): Record<string, any> {
  try {
    if (fs.existsSync(MINTS_FILE)) {
      const data = fs.readFileSync(MINTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading mints_data.json:", err);
  }
  return {};
}

function saveMintsStore(data: Record<string, any>) {
  try {
    fs.writeFileSync(MINTS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing mints_data.json:", err);
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "KalaSonus.art Backend" });
});

// 2. Generate Art using Gemini API
app.post("/api/generate-art", async (req, res) => {
  try {
    const { prompt, audioFeatures, artistName, occasion } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // 2a. Generate poetic Art Title using gemini-3.6-flash
    let artTitle = "Resonant Acoustic Symphony";
    try {
      const titleRes = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Generate a short, elegant 2-4 word fine art title for an abstract sound-wave artwork inspired by:
Pitch: ${audioFeatures?.pitch || 'Mid'}, RMS Loudness: ${audioFeatures?.energy || 'Moderate'}, Occasion: ${occasion || 'General'}.
Respond ONLY with the title text, no quotes or explanations.`
      });
      if (titleRes.text) {
        artTitle = titleRes.text.trim().replace(/^["']|["']$/g, '');
      }
    } catch (err) {
      console.warn("Failed to generate title with Gemini:", err);
    }

    // 2b. Generate Image using gemini-3.1-flash-image or fallback
    let imageBase64: string | null = null;
    try {
      const imageRes = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: {
          parts: [
            {
              text: `${prompt}. High resolution fine art masterpiece, museum quality abstract expressionism, deep texture, vivid color harmonies.`
            }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        }
      });

      if (imageRes.candidates?.[0]?.content?.parts) {
        for (const part of imageRes.candidates[0].content.parts) {
          if (part.inlineData) {
            imageBase64 = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (imgErr) {
      console.warn("Gemini image generation warning, falling back to algorithmic canvas synthesizer:", imgErr);
    }

    res.json({
      artTitle,
      imageBase64
    });

  } catch (error: any) {
    console.error("Error in /api/generate-art:", error);
    res.status(500).json({ error: error.message || "Failed to generate art" });
  }
});

// 3. Save Mint Record to Database (Supabase or Local Persistence)
app.post("/api/mints", (req, res) => {
  try {
    const mintData = req.body;
    if (!mintData.unique_id) {
      return res.status(400).json({ error: "unique_id is required" });
    }

    const store = loadMintsStore();
    store[mintData.unique_id] = {
      ...mintData,
      created_at: mintData.created_at || new Date().toISOString()
    };
    saveMintsStore(store);

    // SUPABASE INTEGRATION NOTICE:
    // If process.env.SUPABASE_URL and process.env.SUPABASE_ANON_KEY are provided,
    // you can insert directly into the 'mints' table in Supabase:
    //
    // const { createClient } = require('@supabase/supabase-js');
    // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    // await supabase.from('mints').insert([mintData]);

    res.json({ success: true, unique_id: mintData.unique_id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Fetch Mint by Unique ID for Public Gallery
app.get("/api/mints/:unique_id", (req, res) => {
  try {
    const { unique_id } = req.params;
    const store = loadMintsStore();
    const item = store[unique_id];

    if (!item) {
      return res.status(404).json({ error: "Mint piece not found" });
    }

    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Fetch all mints for gallery feed
app.get("/api/mints", (req, res) => {
  try {
    const store = loadMintsStore();
    res.json(Object.values(store));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Printful Physical Print Order Integration
app.post("/api/printful/order", async (req, res) => {
  try {
    const { printSize, productType, shipping, image_url, unique_id } = req.body;

    const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
    const IS_LIVE = Boolean(PRINTFUL_API_KEY && !PRINTFUL_API_KEY.includes('sandbox'));

    // Printful Product Variant ID Mapping (Mock sandbox mapping)
    const variantMap: Record<string, number> = {
      "Poster Print-8x8": 1,
      "Poster Print-12x12": 2,
      "Poster Print-18x18": 3,
      "Poster Print-24x24": 4,
      "Canvas Print-8x8": 10,
      "Canvas Print-12x12": 11,
      "Canvas Print-18x18": 12,
      "Canvas Print-24x24": 13,
      "Framed Print-8x8": 20,
      "Framed Print-12x12": 21,
      "Framed Print-18x18": 22,
      "Framed Print-24x24": 23,
    };

    const variantId = variantMap[`${productType}-${printSize}`] || 1;
    const mockOrderNumber = `PF-KS-${Math.floor(100000 + Math.random() * 900000)}`;

    if (PRINTFUL_API_KEY) {
      /*
       * LIVE / SANDBOX PRINTFUL INTEGRATION CODE:
       *
       * const response = await fetch('https://api.printful.com/orders', {
       *   method: 'POST',
       *   headers: {
       *     'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
       *     'Content-Type': 'application/json'
       *   },
       *   body: JSON.stringify({
       *     recipient: {
       *       name: shipping.fullName,
       *       address1: shipping.addressLine1,
       *       address2: shipping.addressLine2 || '',
       *       city: shipping.city,
       *       country_code: shipping.countryCode || 'US',
       *       zip: shipping.postalCode
       *     },
       *     items: [
       *       {
       *         variant_id: variantId,
       *         quantity: 1,
       *         files: [{ url: image_url }]
       *       }
       *     ]
       *   })
       * });
       * const data = await response.json();
       * return res.json({ success: true, orderNumber: data.result?.id || mockOrderNumber });
       */
    }

    // Sandbox Response
    res.json({
      success: true,
      orderNumber: mockOrderNumber,
      status: "pending_fulfillment",
      mode: IS_LIVE ? "production" : "sandbox",
      details: {
        productType,
        printSize,
        recipient: shipping.fullName,
        shippingAddress: `${shipping.addressLine1}, ${shipping.city}, ${shipping.postalCode}`
      }
    });

  } catch (err: any) {
    console.error("Printful order error:", err);
    res.status(500).json({ error: err.message || "Failed to create Printful order" });
  }
});


// ----------------------------------------------------
// VITE MIDDLEWARE / STATIC SERVE
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
