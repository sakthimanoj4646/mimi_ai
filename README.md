# 🌊 MIMI AI — YOUR CREATIVE VIDEO STUDIO
> **"Imagine It. Describe It. Create It."**  
> *Mimi — Your Creative AI Buddy 💙*

---

## 1. Product Vision & Architecture

**MIMI AI** is an AI-powered creative video creation, editing, and enhancement studio designed for mobile and web. Users without professional editing training can describe what they want in **English, Tamil, or Tanglish** and receive structured editing plans or generated video footage.

### Core Workflows
1. **Workflow A: AI Video Creation** — Text-to-Video generation using prompts, styles (Cinematic, Realistic, Anime, Cyberpunk, Watercolor), negative prompts, aspect ratios (16:9, 9:16, 1:1, 4:3), and duration options.
2. **Workflow B: AI-Assisted Video Editing** — Upload single or multiple clips, describe desired edits in natural language, review structured editing plans, execute real video processing operations, and export playable videos.
3. **Workflow C: Multi-Clip Assembly** — Stitch, reorder, cross-dissolve, and synchronize background audio across multiple footage clips.
4. **Workflow D: AI Video Enhancement** — Real-time lighting, contrast, warmth, sharpening, and denoising adjustments with an interactive split-screen Before & After comparison slider.
5. **Workflow E: Conversational Mimi Assistant** — Friendly, multilingual creative mentor answering technical editing questions, providing color grading advice, and converting chat prompts into executed timeline edits.

---

## 2. Visual Design System: OCEAN AI

- **Primary Background**: Deep Navy (`#070D1E`, `#050A18`)
- **Secondary Background**: Dark Blue Surface (`#0C162E`, `#101C38`)
- **Primary Accent**: Ocean Blue (`#0077B6`, `#0096C7`, `#3A86FF`)
- **Secondary Accent**: Glowing Neon Cyan (`#00F0FF`, `#48CAE4`)
- **Tertiary Accent**: Soft Lavender (`#B5A6FF`, `#9D8DF1`)
- **Text**: Pure White (`#FFFFFF`) with cool light grey secondary text
- **Glow Effects**: Subtle neon cyan ambient lighting (`shadow-ocean-glow`)

---

## 3. The 20 Application Screens

| # | Screen | Purpose & Capabilities |
|---|---|---|
| **1** | **Splash Screen** | Animated assistant emblem, Ocean AI backdrop, brand tagline, auto-transition. |
| **2** | **Onboarding Screens** | 3-step walkthrough: AI Creation, Video Editing, Meet Mimi. Remembers completion state. |
| **3** | **Login Screen** | Email & password auth, password visibility toggle, quick dev creator login. |
| **4** | **Registration Screen** | Display name, email, password confirmation, terms agreement. |
| **5** | **Password Recovery** | Email validation and secure password reset link flow. |
| **6** | **Home Dashboard** | Multilingual prompt box (EN/TA/Tanglish), voice input simulation, 6 action cards, recent projects. |
| **7** | **AI Video Creation** | Prompt, negative prompt, aspect ratio, duration, visual styles, generation progress, cancel, preview player. |
| **8** | **Video Upload** | Drag & drop, multi-clip upload, MP4/MOV/WEBM validation, size limit check, procedural demo clip loader. |
| **9** | **Multiple Clip Selection** | Timeline reordering, trim, inter-clip transitions (dissolve, fade, wipe), background music, sequence preview. |
| **10** | **Video Editing Workspace** | Interactive video player, multi-track timeline, color grading sliders, text overlays, speed (0.5x-2x), chat-to-edit drawer. |
| **11** | **Video Enhancement** | Natural language enhancement prompt, color temperature, unsharp mask sharpening, Before/After slider. |
| **12** | **Mimi AI Chat** | Conversational assistant in Tamil, Tanglish & English, quick action chips, contextual plan generator card. |
| **13** | **Plan Review Screen** | Structured editing plan breakdown, operation parameters diff, target resolution, "Apply Edits" button. |
| **14** | **Video Preview Screen** | Full-fidelity video preview, playback stats, audio sync status, runtime breakdown. |
| **15** | **Export Screen** | Resolution presets (720p, 1080p, 4K), aspect ratios (16:9, 9:16, 1:1), real Canvas encoding progress, direct file download. |
| **16** | **My Projects** | Persistent project library, search, filter tags, project duplication, delete confirmation modal. |
| **17** | **Project Details** | In-depth metadata audit, source media assets breakdown, timeline logs. |
| **18** | **User Profile** | Creator Pro membership badge, local storage footprint meter, metrics, session logout. |
| **19** | **Settings Screen** | Language selector (English, Tanglish, Tamil), Theme switcher, Gemini/Replicate API keys, Mock Mode toggle. |
| **20** | **Help & Support** | Knowledge base, FAQ accordion (Tanglish AI, format support, 4K rendering), architecture diagnostics. |

---

## 4. Dual Video Processing Engine

### 1. In-Browser Engine (Client-Side HTML5 Canvas & MediaRecorder)
- **Zero-Server Requirement**: Works directly in any browser on desktop and mobile.
- **Real-Time Color Filters**: CSS and Canvas 2D filters apply brightness, contrast, saturation, and warmth directly to video elements.
- **Real Export Rendering**: `canvas.captureStream()` records frames to a real video Blob (MP4/WebM), triggering a genuine browser file download.
- **Procedural Sample Generator**: Creates real ocean sunset video Blobs on-the-fly for immediate testing without requiring local media files.

### 2. Node.js Backend Engine (FFmpeg Service)
- **FFmpeg Integration**: CLI commands for `-ss` trimming, `-vf eq` color balance, `drawtext` title overlay, and `concat` multi-clip stitching.
- **Graceful Fallback**: Detects whether FFmpeg CLI is present in PATH and falls back smoothly to safe stream pass if absent.

---

## 5. Getting Started & Running

### Option A: Instant Zero-Dependency Browser Runtime
If Node.js is not yet installed in your system PATH, you can run the entire studio immediately:
1. Navigate to:
   ```
   C:\Users\Santhiya Josphine\.gemini\antigravity\scratch\mimi-ai\app\standalone.html
   ```
2. Double-click `standalone.html` to open it in **Google Chrome**, **Microsoft Edge**, **Firefox**, or **Safari**.
3. All 20 connected screens, real video generation, color grading, Tanglish AI chat, and direct video downloads will work immediately with zero installation!

### Option B: Full-Stack Development Mode (with Node.js)
```powershell
# 1. Navigate to project directory
cd "C:\Users\Santhiya Josphine\.gemini\antigravity\scratch\mimi-ai"

# 2. Install dependencies
npm install

# 3. Start Frontend Studio
npm run dev

# 4. In a separate terminal, start Express Backend API
npm run server:dev
```

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## 6. Environment Variables (`.env`)

Copy `.env.example` to `.env`:
```ini
PORT=5000
NODE_ENV=development
JWT_SECRET=mimi_ai_jwt_secret_change_in_production_99881122
JWT_EXPIRES_IN=7d
DATABASE_PATH=./data/mimi_studio.db
UPLOAD_DIR=./uploads
EXPORT_DIR=./exports
MAX_UPLOAD_SIZE_MB=100

# AI Provider Keys (Optional)
GEMINI_API_KEY=your_google_gemini_api_key_here
VIDEO_GEN_PROVIDER=mock # Options: replicate, runway, luma, mock
REPLICATE_API_TOKEN=your_replicate_api_token_here
MOCK_MODE=true
```

---

## 7. Testing

Automated test suite is located in `server/tests/mimi-studio.test.ts`:
```powershell
npm test
```
Tests cover:
- Multilingual detection (English, Tamil, Tanglish)
- Structured editing plan generation and schema validation
- Video generation state lifecycle (queued, generating, completed)
- Video upload filters and size constraints
- FFmpeg availability reporting and fallback safety

---

## 8. License
MIT License • Created for **MIMI AI — Your Creative Video Studio** 💙
