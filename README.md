# ahmad — personal portfolio (v3)

> a quiet, light mac desktop portfolio inspired by heyclicky.  
> live at: **https://muhammadahmadrao.github.io/**  
> built with vanilla html5, modern css3, and vanilla javascript — zero build step, zero frameworks.

---

## 🚀 quick start (run locally)

You can run this project with any static file server:

```bash
# Option 1: Python 3 built-in server (recommended)
python3 -m http.server 3000

# Option 2: Node.js npx serve
npx serve . -p 3000

# Option 3: VS Code / Cursor Live Server extension
# Click "Go Live" on index.html
```

Then open your browser at **`http://localhost:3000`**.

---

## 📁 project structure

```text
├── index.html              # main page with all sections & accessible semantic markup
├── 404.html                # custom mac-style 404 error page with dino mascot
├── .nojekyll               # bypass jekyll processing on github pages
├── robots.txt              # search engine crawler policy
├── PROJECT_BRIEF.md        # design specification, facts, and constraints
├── assets/                 # gifs, stickers, avatars, audio, and project previews
│   ├── projects/           # project screenshot previews (480x270)
│   ├── cat-kungfu.webp     # kungfu-debugging window media (animated webp)
│   ├── pixel-penguin-dance.gif
│   ├── patrick-we-have-technology.gif
│   ├── ghost-yellow.png
│   ├── mascot-dino.jpg
│   ├── pixel-robot-hill.jpg
│   └── og-preview.png      # 1200x630 social share preview card
├── css/
│   └── styles.css          # design tokens, macOS window chrome, responsive rules & animations
├── js/
│   ├── data.js             # verified facts, projects list, metrics & links
│   ├── windows.js          # unified WindowManager for desktop modals & windows
│   ├── player.js           # anchored music popover controller
│   └── main.js             # interactive desktop: drag, modals, typewriter, spam demo, easter eggs
└── scripts/
    └── check.mjs           # automated link and local asset path guard
```

---

## 🎵 music popover configuration (`js/data.js`)

Clicking the headphones icon in the menu bar opens a lightweight macOS popover anchored directly below the icon with a caret. When closed, it is completely `hidden` and `inert` to prevent keyboard focus leaks.

You can configure the song source in [`js/data.js`](js/data.js) via `portfolioData.song`. Three source types are supported:

```javascript
// Option 1: External Link (Default)
// Displays song cover, title, artist, and a "listen on youtube ↗" button
song: {
  type: "link",
  title: "lady (hear me tonight)",
  artist: "modjo",
  url: "https://youtu.be/mMfxI3r_LyA",
  src: null,
  spotifyEmbedUrl: null
}

// Option 2: Spotify Embed
// Displays an 80px-tall compact Spotify player iframe
song: {
  type: "spotify",
  title: "lady (hear me tonight)",
  artist: "modjo",
  url: "https://open.spotify.com/track/...",
  src: null,
  spotifyEmbedUrl: "https://open.spotify.com/embed/track/..."
}

// Option 3: Local or Hosted MP3
// Activates native audio playback with scrubber, time duration, and volume slider
song: {
  type: "mp3",
  title: "lady (hear me tonight)",
  artist: "modjo",
  url: null,
  src: "path/to/your/audio-track.mp3",
  spotifyEmbedUrl: null
}
```

---

## 🛠️ how to add or update projects (`js/data.js`)

To add a new project or update an existing one, open [`js/data.js`](js/data.js) and add an object to `portfolioData.projects`:

```javascript
{
  id: "my-new-project",
  slug: "my-new-project",
  title: "my-project-name",
  filename: "my-project.app",
  pastel: "green", // "green" | "blue" | "pink" | "yellow"
  type: "category label (e.g. computer vision / flutter)",
  headline: "one-line punchy headline for the modal header",
  description: "detailed explanation of the problem, approach, and results.",
  disclaimer: null, // optional: string warning (e.g. "educational project, not a medical tool")
  joke: "a witty self-aware one-liner under the card",
  repo: "https://github.com/MuhammadAhmadRao/my-new-project",
  demo: "https://my-demo-link.com", // or null if repo-only
  stats: [
    { label: "metric 1", value: "98.2%" },
    { label: "dataset", value: "10,000 samples" }
  ],
  tags: ["python", "pytorch", "fastapi"]
}
```

Add your screenshot to `assets/projects/<slug>.png`. If the image is not added, the soft macOS window placeholder automatically displays.

---

## ✨ interactive features & easter eggs

1. **AirPods Music Popover**: Click the headphones icon in the menu bar to toggle the anchored popover player. Closes cleanly on Esc, outside click, or close button.
2. **Interactive Spam Classifier**: In "the work" section, the `spam-or-ham.app` window features an interactive keyword-based toy tester that triggers an animated verdict stamp with a link to the real model on GitHub.
3. **Typewriter Notes & Scroll Parallax**: "the notes" section features dynamic typewriter text highlighting `"fix them in public"`, backed by a 32-folder gradient arc with smooth parallax.
4. **Giant Folder Wordmark**: The footer spells **ahmad** across a 25×7 grid of blue macOS folders that pop into view with staggered animation.
5. **Konami Code Easter Egg**: Press `↑ ↑ ↓ ↓ ← → ← → B A` on your keyboard anywhere on the site to watch the pixel penguin sprint across the screen.
6. **Beachball Easter Egg**: Click the beachball spinner sticker in the hero to spin it rapidly and trigger a `"nice taste 🎵"` popup at the headphones icon.
7. **Boring Mode**: Press the `B` key (or click "boring mode" in the footer) to instantly toggle a plain, calm, lowercase text version without motion or stickers. Preference is saved in `localStorage`.

---

## 📋 profile & links checklist

- [x] **Soundtrack & Audio Player**: Configured with Modjo - Lady (Hear Me Tonight) via `portfolioData.song`.
- [x] **LinkedIn Profile**: `https://www.linkedin.com/in/muhammadahmadrao-` connected.
- [x] **Fiverr Profile & Services**: Set up with public profile URL in `portfolioData.links.fiverr`.
- [x] **Email**: `ahmadxrao@gmail.com` connected.
- [x] **Side Quests**: Facts connected for fake news detector, crypto dashboard, and Onshape CAD models.

---

## 🌐 deployment instructions

### Option A: GitHub Pages (Free & Native)

```bash
# 1. Initialize git (if not already done)
git init
git add .
git commit -m "feat: complete ahmad portfolio v3 heyclicky edition"

# 2. Add your GitHub remote repository
git remote add origin https://github.com/MuhammadAhmadRao/MuhammadAhmadRao.github.io.git
# (Or if deploying to a repository subpath like /me-self)
# git remote add origin https://github.com/MuhammadAhmadRao/me-self.git

# 3. Rename branch to main and push
git branch -M main
git push -u origin main
```

**Enable GitHub Pages**:
1. Go to your repo on GitHub: **Settings** → **Pages**.
2. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
3. Select branch **`main`** and folder **`/ (root)`**, then click **Save**.
4. Your site will be live at `https://muhammadahmadrao.github.io/` within 60 seconds.

---

### Option B: Vercel (Instant Global CDN)

```bash
# Install Vercel CLI (or connect GitHub repo via vercel.com dashboard)
npx vercel
```

---

## 🎨 third-party media

the patrick star gif (`assets/patrick-we-have-technology.gif`), the kung fu cat animated webp (`assets/cat-kungfu.webp`), and the dancing pixel penguin (`assets/pixel-penguin-dance.gif`) are used for portfolio fun and non-commercial educational showcase. if you hold the rights to any of these assets and wish them removed, please open an issue and i will remove them on request.

---

## 📜 credits & acknowledgments

- **Design Inspiration**: [heyclicky.com](https://www.heyclicky.com) by clicky.
- **Typography**: Inter by Rasmus Andersson & Caveat by Impallari Type via Google Fonts.
- **Media**: Spongebob Squarepants / Nickelodeon (Patrick gif), classic internet cat gif, pixel penguin & pixel robot art.
- **Pair Programmer**: Antigravity AI assistant.
