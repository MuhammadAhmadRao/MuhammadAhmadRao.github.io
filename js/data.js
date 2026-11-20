const SITE_URL = "https://muhammadahmadrao.github.io/";

/**
 * portfolio facts & data - v3 heyclicky inspired
 * strict rule: use only verified facts. unknowns must use [TODO ahmad: ...] format.
 */
const portfolioData = {
  siteUrl: SITE_URL,
  profile: {
    handle: "ahmad",
    fullName: "muhammad ahmad rao",
    role: "bs artificial intelligence student at nutech university, islamabad",
    tagline: "[ vibe coder, tech enthusiast, student ]",
    bio: "ex-flutter dev, shifting into ml/ai",
    heroWordmark: "ahmad",
    heroSubtitle: "a student who teaches computers to read, see and (sometimes) fail.",
    heroCaption: "ex-flutter dev, now into ml/ai",
    goals: "building toward fiverr freelancing and internships"
  },
  experience: [
    {
      role: "flutter developer intern",
      company: "roots millennium international school",
      duration: "oct 2023 to jan 2024"
    }
  ],
  certifications: [
    {
      title: "flutter (pmysd-navtac)"
    },
    {
      title: "robotics & iot (nutech)"
    }
  ],
  links: {
    github: "https://github.com/MuhammadAhmadRao",
    instagram: "https://instagram.com/ahmadxrao",
    linkedin: "https://www.linkedin.com/in/muhammadahmadrao-",
    fiverr: "https://www.fiverr.com/kingahmad7274",
    gigs: { sayHi: "", flutterApp: "", mlProject: "" },
    email: "ahmadxrao@gmail.com"
  },
  song: {
    type: "link",
    title: "lady (hear me tonight)",
    artist: "modjo",
    url: "https://youtu.be/mMfxI3r_LyA",
    src: null,
    spotifyEmbedUrl: null
  },
  soundtrack: {
    title: "lady (hear me tonight)",
    artist: "modjo"
  },
  projects: [
    {
      id: "brain-tumor",
      slug: "brain-tumor",
      title: "brain-tumor-classification",
      filename: "brain-tumor.ipynb",
      pastel: "green",
      type: "4-class brain mri classifier",
      headline: "4-class brain mri classifier using transfer learning and deep cnn architectures",
      description: "educational project evaluating transfer learning for multiclass brain mri scan classification. compared mobilenetv2 and resnet50 on 7,200 images across glioma, meningioma, pituitary, and no tumor classes.",
      disclaimer: "educational project, not a medical tool",
      joke: "two models enter, one gets 4% better",
      repo: "https://github.com/MuhammadAhmadRao/brain-tumor-classification",
      demo: null,
      stats: [
        { label: "resnet50 test acc", value: "87%" },
        { label: "mobilenetv2 test acc", value: "83%" },
        { label: "dataset size", value: "7,200 images" },
        { label: "classes", value: "4 classes" }
      ],
      tags: ["tensorflow", "keras", "resnet50", "mobilenetv2", "computer-vision"]
    },
    {
      id: "spam-or-ham",
      slug: "spam-or-ham",
      title: "sms-spam-detection",
      filename: "spam-or-ham.app",
      pastel: "blue",
      type: "nlp classification & interactive demo",
      headline: "sms spam detection powered by tf-idf feature extraction and support vector classification",
      description: "nlp pipeline trained on 5,572 sms messages using tf-idf vectorization. tested naive bayes, random forest, and support vector classifiers; svc achieved top performance across all validation metrics.",
      disclaimer: null,
      joke: "shows a verdict stamp",
      demoHonestNote: "(just for fun, the real model is on github)",
      repo: "https://github.com/MuhammadAhmadRao/sms-spam-detection",
      demo: null,
      stats: [
        { label: "svc accuracy", value: "97.9%" },
        { label: "precision", value: "97.4%" },
        { label: "recall", value: "86.3%" },
        { label: "f1 score", value: "91.5%" },
        { label: "dataset", value: "5,572 msgs" }
      ],
      tags: ["nlp", "scikit-learn", "tf-idf", "svc", "streamlit"]
    },
    {
      id: "viewvibe",
      slug: "viewvibe",
      title: "viewvibe",
      filename: "viewvibe.app",
      pastel: "pink",
      type: "flutter movie discovery app",
      headline: "modern movie discovery mobile application powered by the tmdb api",
      description: "cross-platform flutter app fetching realtime movie metadata, trending releases, trailers, detailed cast breakdowns, and personal watchlists via the tmdb rest api.",
      disclaimer: null,
      joke: "because 45 minutes of netflix scrolling wasn't enough",
      repo: "https://github.com/MuhammadAhmadRao/viewvibe",
      demo: null,
      stats: [
        { label: "framework", value: "flutter / dart" },
        { label: "api integration", value: "tmdb rest api" },
        { label: "features", value: "search, trailers, watchlist" },
        { label: "license", value: "open source" }
      ],
      tags: ["flutter", "dart", "tmdb-api", "cross-platform", "mobile"]
    },
    {
      id: "we-split",
      slug: "we-split",
      title: "we-split",
      filename: "we-split.app",
      pastel: "yellow",
      type: "flutter expense tracker & splitter",
      headline: "group expense tracker and bill splitter built with high-contrast neobrutalism design",
      description: "designed to simplify shared bills, group outings, and roommates' expenses with bold borders, bright shadows, and zero accounting headaches.",
      disclaimer: null,
      joke: "ending friendships over biryani bills since 2026",
      repo: "https://github.com/MuhammadAhmadRao/we-split",
      demo: null,
      stats: [
        { label: "design style", value: "neobrutalism" },
        { label: "framework", value: "flutter / dart" },
        { label: "purpose", value: "group expense splitting" }
      ],
      tags: ["flutter", "dart", "neobrutalism", "ui/ux", "mobile"]
    }
  ],
  sideQuests: [
    {
      id: "fake-news-detector",
      slug: "fake-news-detector",
      title: "fake-news-detector-v2",
      filename: "fake-news-detector.py",
      pastel: "green",
      type: "python nlp classifier",
      headline: "text classification pipeline distinguishing credible news from misinformation",
      description: "python nlp text classifier",
      joke: "reading between the lines so you don't have to",
      repo: "https://github.com/MuhammadAhmadRao/fake-news-detector-v2",
      demo: null,
      tags: ["python", "nlp", "text-classifier"]
    },
    {
      id: "crypto-dashboard",
      slug: "crypto-dashboard",
      title: "crypto-dashboard",
      filename: "crypto-dashboard.js",
      pastel: "blue",
      type: "javascript market dashboard",
      headline: "interactive realtime cryptocurrency price tracking dashboard",
      description: "javascript crypto dashboard",
      joke: "watching charts fluctuate in real time",
      repo: "https://github.com/MuhammadAhmadRao/crypto-dashboard",
      demo: null,
      tags: ["javascript", "chart.js", "crypto-api", "frontend"]
    },
    {
      id: "onshape-cad",
      slug: "onshape-cad",
      title: "onshape cad designs",
      filename: "cad-models.step",
      pastel: "pink",
      type: "3d parametric cad modeling",
      headline: "parametric 3d mechanical cad designs created in onshape",
      description: "onshape cad designs: texas map, lego brick, cup, dice",
      joke: "solid geometry, tight tolerances, zero digital glue",
      repo: null,
      demo: null,
      tags: ["onshape", "3d-cad", "parametric-modeling"]
    }
  ]
};

if (typeof Object.freeze === "function") {
  Object.freeze(portfolioData);
}

if (typeof window !== "undefined") {
  window.portfolioData = portfolioData;
}
