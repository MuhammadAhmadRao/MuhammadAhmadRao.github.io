# Project Brief: Ahmad's Personal Portfolio (v3 - heyclicky desktop)

## concept
my own version of heyclicky's website: a quiet, light mac desktop. NOT colorful. the interface is near-grayscale; color comes only from content (gifs, screenshots, stickers).

## tone & copy
- all visible text lowercase. friendly, funny, self-aware.
- hero wordmark: "ahmad"
- subtitle: "a student who teaches computers to read, see and (sometimes) fail."
- small caption under it: "ex-flutter dev, now into ml/ai"

## design tokens (css variables)
- palette:
  - bg: #f5f5f5
  - surface: #ffffff
  - ink: #111111
  - muted: #6e6e73
  - line: rgba(0,0,0,0.08)
  - blue: #2f6bff (links/cta only)
- window:
  - radius: 10px
  - border: 1px solid rgba(0,0,0,0.12)
  - shadow: 0 10px 30px rgba(0,0,0,0.12)
  - title bar: 28px height with light gray gradient (#efefef to #dedede)
  - traffic lights: 12px (#ff5f57 #febc2e #28c840)
  - tiny gray x on the right
- pastel titlebar variants:
  - notes: #efe6b8
  - green: #cfe5cf
  - blue: #cfd9ef
  - pink: #efd0d0
- dot grid texture for the hero:
  - radial-gradient dots rgba(0,0,0,0.14) every 28px, faded out at the edges with a mask
- typography:
  - "Inter" (400/500/700) for everything (headings, labels, body text, buttons)
  - "Caveat" for handwritten signature and name tags
  - NO pixel fonts, NO monospace labels except tiny filename captions in Inter
  - hero wordmark: Inter 700, letter-spacing -0.04em, size clamp(72px, 12vw, 170px), line-height 0.95
- filename caption under every window: 13px, muted, centered (like "usecase.mov")
- section label: small outlined pill, 12px, white background, 1px line border, radius 999px, lowercase
- buttons:
  - glossy blue pill (aqua style: light-to-mid blue gradient, 1px darker blue border, white inner highlight)
  - white pill with a 1px border
- spacing:
  - max content width: 1100px
  - section padding: 140px desktop / 80px mobile, big gaps, nothing busy
- motion: slow and subtle; respect prefers-reduced-motion

## tech rules
- plain html/css/js, no frameworks or build step
- runs from index.html or any static server
- files: index.html, css/styles.css, js/main.js, js/data.js, js/player.js, js/windows.js
- icons as inline svg drawn by hand (wifi, headphones, bluetooth, battery, folder, trash can, beachball)
- only images from ./assets
- alt text on every image
- mobile-first responsive
- no video anywhere on the main page (gifs are fine)
- no money amounts, earnings or stats that are not in the facts list
- music popover: link/spotify/mp3 source
- quest-log rows with documents open certificate windows

## facts (use ONLY these, never invent; unknowns become visible [TODO ahmad: ...])
- ahmad (muhammad ahmad rao), bs artificial intelligence student at nutech university, islamabad
- github tagline: [ vibe coder, tech enthusiast, student ]
- ex-flutter dev, shifting into ml/ai
- flutter developer intern at roots millennium international school (oct 2023 to jan 2024)
- certifications: flutter (pmysd-navtac), robotics & iot (nutech)
- building toward fiverr freelancing and internships
- links:
  - github.com/MuhammadAhmadRao
  - instagram.com/ahmadxrao
  - linkedin: [TODO ahmad]
  - fiverr: [TODO ahmad]
  - email: [TODO ahmad]
- projects (repos live at github.com/MuhammadAhmadRao/<name>):
  - viewvibe (flutter movie discovery app, tmdb api: trending, search, trailers, watchlist, open source)
  - we-split (flutter expense tracker/splitter, neobrutalism design)
  - brain-tumor-classification (4-class mri classifier, transfer learning, mobilenetv2 83% vs resnet50 87% test accuracy, 7,200 images, tensorflow/keras, educational not medical)
  - sms-spam-detection (nlp, 5,572 messages, tf-idf, best model svc: 97.9% accuracy, 97.4% precision, 86.3% recall, 91.5% f1, streamlit app)
  - fake-news-detector-v2 (python nlp classifier) [TODO ahmad: details]
  - crypto-dashboard (javascript) [TODO ahmad: details]
  - onshape cad designs (texas map, lego brick, cup, dice) [TODO ahmad: repo url]

## page order
1. menu bar
2. hero
3. the work
4. the notes
5. marquee
6. services
7. faq
8. say hi + footer with a giant wordmark

## asset roles
- patrick gif (`assets/patrick-we-have-technology.gif`) = hero sticker behind a window
- kung fu cat gif (`assets/cat-kungfu.webp`) = window content (converted to animated webp)
- penguin gif (`assets/pixel-penguin-dance.gif`) = window content
- ghost, cabinet, handheld, dino, pixel robot = small stickers or avatar
- style-copy sticker = unused unless it fits
- bg-pixel-clouds = retired (commercial watermark)
- any image with a white background gets a soft rounded white card treatment
