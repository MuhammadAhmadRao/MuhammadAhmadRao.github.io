/**
 * main controller - v3 heyclicky desktop
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Menu bar live clock (like "2:07 am" lowercase)
  const clockEl = document.getElementById("menubar-clock");

  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    clockEl.textContent = `${hours}:${minutes} ${ampm}`;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // 2. Navigation smooth scroll & active link management
  const navLinks = document.querySelectorAll(".menubar-link");
  const observedSections = ["hero", "work", "notes", "services", "faq"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActiveLink(activeId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (activeId && href === `#${activeId}`) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  // Smooth scroll click handler
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").slice(1);
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        if (targetId === "hero" || targetId === "say-hi") {
          setActiveLink(null);
        } else {
          setActiveLink(targetId);
        }
      }
    });
  });

  // IntersectionObserver for scroll spy (observes #hero to clear active link)
  if ("IntersectionObserver" in window && observedSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === "hero") {
            setActiveLink(null);
          } else {
            setActiveLink(entry.target.id);
          }
        }
      });
    }, observerOptions);

    observedSections.forEach((sec) => sectionObserver.observe(sec));
  }

  // 3. Soft click feedback on interactive elements
  document.querySelectorAll("button, a").forEach((el) => {
    el.addEventListener("click", () => {
      if (window.desktopAudio) {
        window.desktopAudio.playSoftClick();
      }
    });
  });

  // 4. Hero Scatter Windows Controller (decorative, scale-out on close, trash restores)
  const scatterWindows = document.querySelectorAll(".hero-scatter-canvas .scatter-window");
  const trashCan = document.getElementById("hero-trash-can") || document.querySelector(".sticker-trash");
  const ghostBubble = document.getElementById("ghost-speech-bubble") || document.querySelector(".ghost-speech-bubble");
  let ghostBubbleTimeout = null;

  scatterWindows.forEach((win) => {
    // Ensure decorative & out of tab order
    win.setAttribute("aria-hidden", "true");

    const closeBtn = win.querySelector(".window-close-x");
    if (closeBtn) {
      closeBtn.setAttribute("tabindex", "-1");
      closeBtn.setAttribute("aria-hidden", "true");
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        win.classList.add("is-closed");
        if (window.desktopAudio) {
          window.desktopAudio.playSoftClick();
        }
      });
    }
  });

  if (trashCan) {
    const restoreClosedScatterWindows = () => {
      const closed = document.querySelectorAll(".hero-scatter-canvas .scatter-window.is-closed");
      closed.forEach((win) => {
        win.classList.remove("is-closed");
        win.classList.add("is-restoring");
        setTimeout(() => {
          win.classList.remove("is-restoring");
        }, 360);
      });

      if (ghostBubble) {
        ghostBubble.textContent = "restored. you're welcome.";
        ghostBubble.classList.add("is-active");
        if (ghostBubbleTimeout) clearTimeout(ghostBubbleTimeout);
        ghostBubbleTimeout = setTimeout(() => {
          ghostBubble.textContent = "shh, i'm debugging";
          ghostBubble.classList.remove("is-active");
        }, 2600);
      }

      if (window.desktopAudio) {
        window.desktopAudio.playSoftClick();
      }
    };

    trashCan.addEventListener("click", restoreClosedScatterWindows);
    trashCan.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        restoreClosedScatterWindows();
      }
    });
  }

  // 5. "The Work" Project Window Controller via WindowManager
  function findProjectData(projectId) {
    if (!window.portfolioData) return null;
    const all = [
      ...(window.portfolioData.projects || []),
      ...(window.portfolioData.sideQuests || [])
    ];
    return all.find((p) => p.id === projectId || p.slug === projectId);
  }

  function renderProjectModalContent(data) {
    const disclaimerHtml = data.disclaimer ? `
      <div class="project-modal-disclaimer">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <span>${data.disclaimer}</span>
      </div>
    ` : "";

    const statsHtml = (Array.isArray(data.stats) && data.stats.length > 0) ? `
      <div class="project-modal-stats-section">
        <div class="stats-strip-label">verified metrics</div>
        <div class="stats-strip-grid">
          ${data.stats.map((s) => `
            <div class="stat-card">
              <span class="stat-value">${s.value}</span>
              <span class="stat-label">${s.label}</span>
            </div>
          `).join("")}
        </div>
      </div>
    ` : "";

    const tagsHtml = (Array.isArray(data.tags) && data.tags.length > 0) ? `
      <div class="project-modal-tags-section">
        <div class="stats-strip-label">technologies</div>
        <div class="project-modal-tags-list">
          ${data.tags.map((t) => `<span class="project-tag">${t}</span>`).join("")}
        </div>
      </div>
    ` : "";

    const hasValidRepo = data.repo && typeof data.repo === "string" && data.repo.startsWith("http") && !data.repo.includes("[TODO");
    const githubBtnHtml = hasValidRepo ? `
      <a href="${data.repo}" class="btn-modal-github" target="_blank" rel="noopener noreferrer">
        <svg class="github-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        <span>view code on github</span>
      </a>
    ` : `<span class="repo-coming-soon" style="font-size: 13px; color: var(--muted); font-weight: 500; padding: 8px 12px; display: inline-block;">repo coming soon</span>`;

    const demoBtnHtml = (data.demo && typeof data.demo === "string" && data.demo.startsWith("http")) ? `
      <a href="${data.demo}" class="btn-modal-demo" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
        <span>live demo</span>
      </a>
    ` : "";

    return `
      <div class="project-modal-body">
        <div class="project-modal-header">
          <div class="project-modal-badge">${data.type || "project"}</div>
          <h3 class="project-modal-title">${data.title || data.id}</h3>
          <p class="project-modal-headline">${data.headline || data.description}</p>
        </div>
        ${disclaimerHtml}
        <div class="project-modal-desc-box">
          <p class="project-modal-description">${data.description || ""}</p>
        </div>
        ${statsHtml}
        ${tagsHtml}
        <div class="project-modal-actions">
          ${githubBtnHtml}
          ${demoBtnHtml}
        </div>
      </div>
    `;
  }

  function openProjectModal(projectId, triggerEl) {
    const data = findProjectData(projectId);
    if (!data || !window.WindowManager) return;

    window.WindowManager.openWindow({
      id: "project-window",
      title: data.filename || `${data.id}.app`,
      pastel: data.pastel || null,
      width: 680,
      content: renderProjectModalContent(data),
      triggerEl: triggerEl
    });
  }

  // Bind main project cards and side-quest cards to open window
  const projectCards = document.querySelectorAll("[data-project-id]");
  projectCards.forEach((card) => {
    const projectId = card.getAttribute("data-project-id");
    const clickableWindow = card.querySelector(".work-window");
    const captionEl = card.querySelector(".window-caption");

    function handleOpen(e) {
      if (e.target.closest("a") || e.target.closest("input") || e.target.closest("button") || e.target.closest(".sample-chip") || e.target.closest(".spam-mini-demo-widget")) return;
      openProjectModal(projectId, card.getAttribute("role") === "button" ? card : (clickableWindow || card));
    }

    // Side-quest cards have role="button" on card itself
    if (card.getAttribute("role") === "button") {
      card.addEventListener("click", handleOpen);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen(e);
        }
      });
    }

    // Main project cards have clickable .work-window
    if (clickableWindow) {
      clickableWindow.addEventListener("click", handleOpen);
      clickableWindow.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProjectModal(projectId, clickableWindow);
        }
      });
    }

    if (captionEl) {
      captionEl.style.cursor = "pointer";
      captionEl.addEventListener("click", handleOpen);
    }
  });

  // 7. "Spam or Ham?" Interactive Toy Classifier with Verdict Stamp
  const spamInput = document.getElementById("spam-demo-input");
  const spamBtn = document.getElementById("spam-demo-btn");
  const stampEl = document.getElementById("spam-verdict-stamp");
  const sampleChips = document.querySelectorAll(".sample-chip");

  const spamKeywords = [
    "free", "win", "winner", "won", "prize", "cash", "claim", "urgent",
    "guaranteed", "congratulations", "selected", "credit", "loan",
    "call now", "text now", "txt", "1000", "5000", "reward", "offer",
    "cheap", "discount", "dating", "dating site", "hot singles", "exclusive"
  ];

  function evaluateSpamOrHam(text) {
    if (!text || !text.trim()) return "HAM";
    const lower = text.toLowerCase();
    const isSpam = spamKeywords.some((kw) => lower.includes(kw));
    return isSpam ? "SPAM" : "HAM";
  }

  function triggerVerdict(verdict) {
    if (!stampEl) return;
    stampEl.classList.remove("stamp-animated", "verdict-spam", "verdict-ham");
    // force reflow
    void stampEl.offsetWidth;

    stampEl.textContent = verdict;
    if (verdict === "SPAM") {
      stampEl.classList.add("verdict-spam", "stamp-animated");
    } else {
      stampEl.classList.add("verdict-ham", "stamp-animated");
    }
  }

  if (spamBtn && spamInput) {
    spamBtn.addEventListener("click", () => {
      const text = spamInput.value;
      const verdict = evaluateSpamOrHam(text);
      triggerVerdict(verdict);
    });

    spamInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const text = spamInput.value;
        const verdict = evaluateSpamOrHam(text);
        triggerVerdict(verdict);
      }
    });
  }

  sampleChips.forEach((chip) => {
    chip.addEventListener("click", (e) => {
      e.stopPropagation();
      const sampleText = chip.getAttribute("data-sample");
      if (spamInput && sampleText) {
        spamInput.value = sampleText;
        const verdict = evaluateSpamOrHam(sampleText);
        triggerVerdict(verdict);
      }
    });
  });

  // 8. "The Notes" Typewriter Effect & Folder Arc Parallax
  const notesTarget = document.getElementById("notes-text-target");
  const notesSection = document.getElementById("notes");
  const folderArc = document.getElementById("notes-folder-arc");

  const fullTextBefore = "i started with flutter apps. then machine learning pulled me in, and now i teach computers to read, see and (sometimes) fail. i vibe code with antigravity, break things, and ";
  const highlightPhrase = "fix them in public";
  const fullTextAfter = ". i'm looking for internships and freelance work. come say hi.";

  let notesTyped = false;

  function runNotesTypewriter() {
    if (notesTyped || !notesTarget) return;
    notesTyped = true;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      notesTarget.innerHTML = `${fullTextBefore}<mark class="marker-highlight">${highlightPhrase}</mark>${fullTextAfter}`;
      return;
    }

    let p1Index = 0;
    let hlIndex = 0;
    let p2Index = 0;

    function typePart1() {
      if (p1Index < fullTextBefore.length) {
        notesTarget.textContent += fullTextBefore.charAt(p1Index);
        p1Index++;
        setTimeout(typePart1, 16);
      } else {
        const markEl = document.createElement("mark");
        markEl.className = "marker-highlight";
        notesTarget.appendChild(markEl);
        typeHighlight(markEl);
      }
    }

    function typeHighlight(markEl) {
      if (hlIndex < highlightPhrase.length) {
        markEl.textContent += highlightPhrase.charAt(hlIndex);
        hlIndex++;
        setTimeout(() => typeHighlight(markEl), 20);
      } else {
        const afterSpan = document.createElement("span");
        notesTarget.appendChild(afterSpan);
        typePart2(afterSpan);
      }
    }

    function typePart2(afterSpan) {
      if (p2Index < fullTextAfter.length) {
        afterSpan.textContent += fullTextAfter.charAt(p2Index);
        p2Index++;
        setTimeout(() => typePart2(afterSpan), 16);
      }
    }

    typePart1();
  }

  if (notesSection && "IntersectionObserver" in window) {
    const notesObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          runNotesTypewriter();
          notesObserver.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    notesObserver.observe(notesSection);
  } else {
    runNotesTypewriter();
  }

  // Gentle Parallax for Folder Arc on scroll
  if (folderArc && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              folderArc.style.transform = "none";
              ticking = false;
              return;
            }
            const rect = notesSection ? notesSection.getBoundingClientRect() : null;
            if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
              const delta = (rect.top - window.innerHeight / 2) * 0.06;
              folderArc.style.transform = `translateY(${delta}px)`;
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // Dynamic matchMedia change listener for prefers-reduced-motion
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  function handleMotionChange(e) {
    if (e.matches) {
      if (notesTarget && !notesTyped) {
        notesTarget.innerHTML = `${fullTextBefore}<mark class="marker-highlight">${highlightPhrase}</mark>${fullTextAfter}`;
        notesTyped = true;
      }
      if (folderArc) {
        folderArc.style.transform = "none";
      }
    }
  }
  if (motionQuery.addEventListener) {
    motionQuery.addEventListener("change", handleMotionChange);
  } else if (motionQuery.addListener) {
    motionQuery.addListener(handleMotionChange);
  }

  // =========================================================================
  // 7. FAQ accordion controller (single-open, smooth animation)
  // =========================================================================
  const faqCards = document.querySelectorAll(".faq-card");
  faqCards.forEach((card) => {
    const btn = card.querySelector(".faq-question-btn");
    const icon = card.querySelector(".faq-toggle-icon");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isExpanded = btn.getAttribute("aria-expanded") === "true";

      // Close all cards
      faqCards.forEach((otherCard) => {
        otherCard.classList.remove("is-open");
        const otherBtn = otherCard.querySelector(".faq-question-btn");
        const otherIcon = otherCard.querySelector(".faq-toggle-icon");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        if (otherIcon) otherIcon.textContent = "+";
      });

      // If it wasn't open before, open it now
      if (!isExpanded) {
        card.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        if (icon) icon.textContent = "−";
      }
    });
  });

  // =========================================================================
  // 8. Folder wordmark generator (5x7 pixel grid spelling "ahmad")
  // =========================================================================
  const wordmarkGrid = document.getElementById("folder-wordmark-grid");
  if (wordmarkGrid) {
    const ahmadMatrix = [
      ".....#..................#",
      ".....#..................#",
      ".##..###..##.##..##...###",
      "...#.#..#.#.#.#....#.#..#",
      ".###.#..#.#.#.#.####.#..#",
      "#..#.#..#.#.#.#.#..#.#..#",
      ".###.#..#.#.#.#.####..###"
    ];

    let folderCount = 0;
    const fragment = document.createDocumentFragment();

    ahmadMatrix.forEach((rowStr) => {
      for (let col = 0; col < rowStr.length; col++) {
        const char = rowStr[col];
        const cell = document.createElement("div");
        cell.className = "wordmark-cell";

        if (char === "#") {
          folderCount++;
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("class", "wordmark-folder");
          svg.setAttribute("viewBox", "0 0 54 44");
          svg.setAttribute("aria-hidden", "true");
          svg.style.setProperty("--stagger", folderCount);
          svg.innerHTML = `
            <path d="M4 8a4 4 0 0 1 4-4h12l5 5h21a4 4 0 0 1 4 4v23a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" fill="#72b5fb" opacity="0.95"/>
            <path d="M4 14a4 4 0 0 1 4-4h38a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V14z" fill="#4a90e2"/>
            <path d="M5 14h38" stroke="rgba(255, 255, 255, 0.55)" stroke-width="1"/>
          `;
          cell.appendChild(svg);
        }

        fragment.appendChild(cell);
      }
    });

    wordmarkGrid.appendChild(fragment);

    // Staggered pop-in observer when scrolled into view
    if ("IntersectionObserver" in window) {
      const folderObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            wordmarkGrid.classList.add("is-visible");
            folderObserver.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: "100px" }
      );
      folderObserver.observe(wordmarkGrid);
    } else {
      wordmarkGrid.classList.add("is-visible");
    }
  }

  // =========================================================================
  // 9. credits.txt window controller via WindowManager
  // =========================================================================
  const creditsTrigger = document.getElementById("credits-trigger");
  const creditsContent = `
    <div class="credits-modal-body">
      <div class="credits-file-meta">
        <span class="credits-pill">plaintext</span>
        <span class="credits-bytes">1,024 bytes</span>
      </div>
      <pre class="credits-pre">
# credits.txt
# visual inspiration, fonts, and assets

design inspiration:
- heyclicky.com by clicky (composition, mac os playfulness, stickers, wordmark)

typography:
- inter by rasmus andersson (google fonts)
- caveat by impallari type (google fonts)

media & gifs:
- patrick "we have technology" - nickelodeon / spongebob squarepants
- kung fu cat - internet classic cat gif
- dancing pixel penguin - pixel animation community
- pixel robot avatar - generated / custom pixel art
- project assets - muhammad ahmad rao

built with:
- vanilla html5, modern css3, vanilla javascript
- antigravity pair programmer
      </pre>
    </div>
  `;

  if (creditsTrigger) {
    creditsTrigger.addEventListener("click", () => {
      if (window.WindowManager) {
        window.WindowManager.openWindow({
          id: "credits-window",
          title: "credits.txt",
          pastel: "yellow",
          width: 580,
          content: creditsContent,
          triggerEl: creditsTrigger
        });
      }
    });
  }

  // =========================================================================
  // 10. boring mode toggle (with localStorage & 'b' keyboard shortcut)
  // =========================================================================
  const boringTrigger = document.getElementById("boring-mode-trigger");

  function setBoringMode(enable) {
    if (enable) {
      document.body.classList.add("boring-mode");
    } else {
      document.body.classList.remove("boring-mode");
    }
    if (boringTrigger) {
      boringTrigger.textContent = enable ? "boring mode: on" : "boring mode";
      boringTrigger.setAttribute("aria-pressed", enable ? "true" : "false");
    }
    try {
      localStorage.setItem("ahmad_boring_mode", enable ? "true" : "false");
    } catch (e) {}
  }

  // Restore saved boring mode preference
  try {
    const savedBoring = localStorage.getItem("ahmad_boring_mode");
    if (savedBoring === "true") {
      setBoringMode(true);
    }
  } catch (e) {}

  if (boringTrigger) {
    boringTrigger.addEventListener("click", () => {
      const isCurrentlyBoring = document.body.classList.contains("boring-mode");
      setBoringMode(!isCurrentlyBoring);
    });
  }

  // Keyboard shortcut 'b' toggles boring mode
  document.addEventListener("keydown", (e) => {
    // Ignore if user is typing in an input or textarea
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
    if (activeTag === "input" || activeTag === "textarea") return;

    if (e.key === "b" || e.key === "B") {
      const isCurrentlyBoring = document.body.classList.contains("boring-mode");
      setBoringMode(!isCurrentlyBoring);
    }
  });

  // =========================================================================
  // 11. easter eggs: beachball fast spin + headphones "nice taste"
  // =========================================================================
  const easterBeachball = document.getElementById("easter-beachball");
  const beachballSvg = document.getElementById("beachball-svg");
  const headphonesTooltip = document.getElementById("headphones-taste-tooltip");
  let tasteTooltipTimeout = null;

  function triggerBeachballEasterEgg() {
    if (beachballSvg) {
      beachballSvg.classList.remove("spin-fast");
      void beachballSvg.offsetWidth; // trigger reflow
      beachballSvg.classList.add("spin-fast");
      setTimeout(() => {
        beachballSvg.classList.remove("spin-fast");
      }, 1400);
    }

    if (headphonesTooltip) {
      if (tasteTooltipTimeout) clearTimeout(tasteTooltipTimeout);
      headphonesTooltip.classList.add("is-active");
      tasteTooltipTimeout = setTimeout(() => {
        headphonesTooltip.classList.remove("is-active");
      }, 2500);
    }
  }

  if (easterBeachball) {
    easterBeachball.addEventListener("click", triggerBeachballEasterEgg);
    easterBeachball.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerBeachballEasterEgg();
      }
    });
  }

  // =========================================================================
  // 12. easter eggs: konami code makes penguin run across the screen
  // =========================================================================
  const konamiSequence = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "b", "a"
  ];
  let konamiIndex = 0;

  function triggerKonamiPenguin() {
    if (document.querySelector(".konami-penguin-runner")) return;

    const runner = document.createElement("div");
    runner.className = "konami-penguin-runner";
    runner.setAttribute("aria-hidden", "true");

    const img = document.createElement("img");
    img.src = "assets/pixel-penguin-dance.gif";
    img.alt = "running penguin easter egg";
    img.className = "konami-penguin-img";

    const bubble = document.createElement("span");
    bubble.className = "konami-bubble";
    bubble.textContent = "you found the secret code! 🐧✨";

    runner.appendChild(img);
    runner.appendChild(bubble);
    document.body.appendChild(runner);

    setTimeout(() => {
      if (runner.parentNode) {
        runner.parentNode.removeChild(runner);
      }
    }, 4000);
  }

  document.addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const expected = konamiSequence[konamiIndex].length === 1
      ? konamiSequence[konamiIndex].toLowerCase()
      : konamiSequence[konamiIndex];

    if (key === expected) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        triggerKonamiPenguin();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = key === konamiSequence[0] ? 1 : 0;
    }
  });

  // =========================================================================
  // 13. dynamic fiverr & gig links guard & renderer
  // =========================================================================
  function initFiverrLinks() {
    const fiverr = (window.portfolioData && window.portfolioData.links && window.portfolioData.links.fiverr) || "";
    const gigs = (window.portfolioData && window.portfolioData.links && window.portfolioData.links.gigs) || {};

    function isLinkValid(url) {
      if (!url || typeof url !== "string") return false;
      const t = url.trim();
      if (!t) return false;
      if (t.includes("<<") || t.includes(">>") || t.includes("PASTE") || t.includes("TODO") || t.includes("seller_dashboard")) {
        return false;
      }
      return true;
    }

    const hasValidFiverr = isLinkValid(fiverr);

    // 1. Service "see my gigs" buttons
    const serviceSlots = document.querySelectorAll("[data-gig-key]");
    serviceSlots.forEach((slot) => {
      const gigKey = slot.getAttribute("data-gig-key");
      const gigUrl = (gigs[gigKey] && isLinkValid(gigs[gigKey]))
        ? gigs[gigKey]
        : (hasValidFiverr ? fiverr : null);

      slot.innerHTML = "";
      if (gigUrl) {
        const btn = document.createElement("a");
        btn.href = gigUrl;
        btn.className = "btn-service-pill";
        btn.target = "_blank";
        btn.rel = "noopener noreferrer";
        btn.textContent = "see my gigs";
        slot.appendChild(btn);
      }
    });

    // 2. Say Hi pill
    const sayhiSlot = document.getElementById("sayhi-fiverr-slot");
    if (sayhiSlot) {
      sayhiSlot.innerHTML = "";
      if (hasValidFiverr) {
        const pill = document.createElement("a");
        pill.href = fiverr;
        pill.className = "sayhi-pill sayhi-pill-active";
        pill.target = "_blank";
        pill.rel = "noopener noreferrer";
        pill.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="700" font-family="Inter, sans-serif" fill="currentColor">fi</text></svg>
          <span>fiverr</span>
        `;
        sayhiSlot.appendChild(pill);
      }
    }

    // 3. Footer link
    const footerSlot = document.getElementById("footer-fiverr-slot");
    if (footerSlot) {
      footerSlot.innerHTML = "";
      if (hasValidFiverr) {
        const a = document.createElement("a");
        a.href = fiverr;
        a.className = "footer-link";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = "fiverr";
        footerSlot.appendChild(a);
      }
    }
  }

  initFiverrLinks();
});
