/**
 * js/windows.js
 * Unified WindowManager for Ahmad's portfolio desktop.
 * Single source of truth for window creation, stacking, dragging, Esc closing,
 * focus trapping/restoration, and mobile sheet adaptation.
 */

class WindowManager {
  constructor() {
    this.openWindows = []; // Stack of { id, el, triggerEl, onClose }
    this.highestZ = 2000;
    this.activeDrag = null;

    this.boundPointerMove = this.onPointerMove.bind(this);
    this.boundPointerUp = this.onPointerUp.bind(this);

    this.initGlobalListeners();
  }

  initGlobalListeners() {
    // Esc closes the topmost window
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.openWindows.length > 0) {
        e.preventDefault();
        const top = this.openWindows[this.openWindows.length - 1];
        this.closeWindow(top.id);
      }
    });

    // Re-clamp all open desktop windows on resize
    window.addEventListener("resize", () => {
      this.clampAllWindows();
    });
  }

  /**
   * openWindow({ id, title, pastel, width, content, onClose, triggerEl })
   */
  openWindow({
    id,
    title = "window",
    pastel = null,
    width = 560,
    content = "",
    onClose = null,
    triggerEl = null
  }) {
    if (!id) {
      id = "wm-win-" + Math.random().toString(36).slice(2, 9);
    }

    // Default trigger to active element if not provided
    if (!triggerEl && document.activeElement) {
      triggerEl = document.activeElement;
    }

    let win = document.getElementById(id);
    let titleEl = null;
    let bodyEl = null;

    if (!win) {
      win = document.createElement("div");
      win.id = id;
      win.className = "wm-window mac-window";
      document.body.appendChild(win);
    } else {
      win.classList.add("wm-window", "mac-window");
    }

    // Accessibility
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-labelledby", `${id}-title`);
    win.setAttribute("tabindex", "-1");

    // Pastel titlebar variant
    win.className = win.className.replace(/titlebar-pastel-\w+/g, "").trim();
    if (pastel) {
      win.classList.add(`titlebar-pastel-${pastel}`);
    }

    // Target width (stored for clamp & desktop view)
    const targetWidth = typeof width === "number" ? `${width}px` : (width || "560px");
    win.style.setProperty("--wm-target-width", targetWidth);

    // Build chrome if not present
    if (!win.querySelector(".wm-titlebar")) {
      win.innerHTML = `
        <div class="window-titlebar wm-titlebar">
          <div class="window-traffic-lights" aria-hidden="true">
            <button type="button" class="traffic-dot traffic-red wm-close-btn" aria-label="close window" title="close (esc)"></button>
            <span class="traffic-dot traffic-yellow" aria-hidden="true"></span>
            <span class="traffic-dot traffic-green" aria-hidden="true"></span>
          </div>
          <span class="window-title-text wm-title-text" id="${id}-title">${title}</span>
          <button type="button" class="window-close-x wm-close-btn" aria-label="close window">&times;</button>
        </div>
        <div class="wm-body"></div>
      `;
      titleEl = win.querySelector(".wm-title-text");
      bodyEl = win.querySelector(".wm-body");
      this.bindWindowEvents(win);
    } else {
      titleEl = win.querySelector(".wm-title-text") || win.querySelector(".window-title-text");
      bodyEl = win.querySelector(".wm-body") || win.querySelector(".project-modal-body") || win.querySelector(".credits-modal-body");
      if (titleEl) {
        titleEl.id = `${id}-title`;
        titleEl.textContent = title;
      }
      if (!win._wmEventsBound) {
        this.bindWindowEvents(win);
      }
    }

    // Update content if provided
    if (content) {
      if (typeof content === "string") {
        if (!bodyEl) {
          bodyEl = document.createElement("div");
          bodyEl.className = "wm-body";
          win.appendChild(bodyEl);
        }
        bodyEl.innerHTML = content;
      } else if (content instanceof HTMLElement || content instanceof DocumentFragment) {
        if (bodyEl) {
          bodyEl.innerHTML = "";
          bodyEl.appendChild(content);
        } else {
          win.appendChild(content);
        }
      }
    }

    // Desktop positioning (>640px)
    if (window.innerWidth > 640) {
      win.style.width = targetWidth;
      const numOpen = this.openWindows.length;
      const stagger = (numOpen * 24) % 120;
      const parsedW = parseInt(targetWidth, 10) || 560;
      const left = Math.max(16, Math.floor((window.innerWidth - parsedW) / 2) + stagger);
      const top = Math.max(48, Math.floor((window.innerHeight - 480) / 2) + stagger);

      // Only set initial position if not currently open
      const isAlreadyOpen = this.openWindows.some(item => item.id === id);
      if (!isAlreadyOpen) {
        win.style.left = `${left}px`;
        win.style.top = `${top}px`;
      }
    }

    // Reveal and activate
    win.removeAttribute("hidden");
    win.inert = false;
    win.removeAttribute("inert");

    // Bring to front
    this.bringToFront(win);

    // Register in openWindows stack
    const existingIndex = this.openWindows.findIndex((item) => item.id === id);
    const record = { id, el: win, triggerEl, onClose };
    if (existingIndex !== -1) {
      this.openWindows[existingIndex] = record;
    } else {
      this.openWindows.push(record);
    }

    // Pop-open animation (scale .96 to 1, 160ms)
    void win.offsetWidth; // Force reflow
    win.classList.remove("wm-closing");
    win.classList.add("wm-open");

    // Focus moves into the window on open
    requestAnimationFrame(() => {
      const focusables = win.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'
      );
      if (focusables.length > 0) {
        // Prefer first meaningful control over close button if available
        const mainControl = Array.from(focusables).find(el => !el.classList.contains("wm-close-btn") && !el.classList.contains("traffic-dot"));
        if (mainControl) {
          mainControl.focus();
        } else {
          focusables[0].focus();
        }
      } else {
        win.focus();
      }
    });

    return win;
  }

  closeWindow(id) {
    const idx = this.openWindows.findIndex((item) => item.id === id);
    let triggerEl = null;
    let onClose = null;
    let win = null;

    if (idx !== -1) {
      const record = this.openWindows[idx];
      win = record.el;
      triggerEl = record.triggerEl;
      onClose = record.onClose;
      this.openWindows.splice(idx, 1);
    } else {
      win = document.getElementById(id);
    }

    if (!win) return;

    this.animateClose(win, triggerEl, onClose);
  }

  animateClose(win, triggerEl, onClose) {
    win.classList.remove("wm-open");
    win.classList.add("wm-closing");

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finishClose = () => {
      win.setAttribute("hidden", "");
      win.inert = true;
      win.setAttribute("inert", "");
      win.classList.remove("wm-closing");

      // Return focus to trigger on close
      if (triggerEl && typeof triggerEl.focus === "function") {
        try {
          triggerEl.focus();
        } catch (e) {}
      }

      if (typeof onClose === "function") {
        try {
          onClose();
        } catch (e) {}
      }
    };

    if (isReduced) {
      finishClose();
    } else {
      setTimeout(finishClose, 160);
    }
  }

  bringToFront(win) {
    this.highestZ += 2;
    win.style.zIndex = this.highestZ;

    const idx = this.openWindows.findIndex((item) => item.el === win);
    if (idx !== -1 && idx !== this.openWindows.length - 1) {
      const [record] = this.openWindows.splice(idx, 1);
      this.openWindows.push(record);
    }
  }

  bindWindowEvents(win) {
    win._wmEventsBound = true;

    // Bring to front on pointerdown
    win.addEventListener("pointerdown", () => {
      this.bringToFront(win);
    });

    // Close buttons
    const closeBtns = win.querySelectorAll(".wm-close-btn, .modal-traffic-close-btn, .modal-x-close-btn, #credits-close-x, #credits-traffic-close");
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeWindow(win.id);
      });
    });

    // Titlebar dragging via pointer events (clamped to viewport, touch friendly)
    const titlebar = win.querySelector(".wm-titlebar") || win.querySelector(".window-titlebar");
    if (titlebar) {
      titlebar.addEventListener("pointerdown", (e) => {
        // Do not drag if clicking close button, links, or inputs
        if (e.target.closest("button") || e.target.closest("a") || e.target.closest("input")) {
          return;
        }

        // Under 640px sheet mode: no dragging
        if (window.innerWidth <= 640) {
          return;
        }

        e.preventDefault();
        this.bringToFront(win);

        const rect = win.getBoundingClientRect();
        this.activeDrag = {
          win,
          startX: e.clientX,
          startY: e.clientY,
          rectLeft: rect.left,
          rectTop: rect.top,
          rectWidth: rect.width,
          rectHeight: rect.height,
          pointerId: e.pointerId
        };

        try {
          titlebar.setPointerCapture(e.pointerId);
        } catch (err) {}

        titlebar.classList.add("is-dragging");
        titlebar.addEventListener("pointermove", this.boundPointerMove);
        titlebar.addEventListener("pointerup", this.boundPointerUp);
        titlebar.addEventListener("pointercancel", this.boundPointerUp);
      });
    }
  }

  onPointerMove(e) {
    if (!this.activeDrag) return;
    const { win, startX, startY, rectLeft, rectTop, rectWidth } = this.activeDrag;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const newLeft = rectLeft + deltaX;
    const newTop = rectTop + deltaY;

    // Viewport clamping
    const minLeft = 8;
    const maxLeft = Math.max(8, window.innerWidth - rectWidth - 8);
    const minTop = 32; // stay below menubar
    const maxTop = Math.max(32, window.innerHeight - 38);

    const clampedLeft = Math.min(Math.max(minLeft, newLeft), maxLeft);
    const clampedTop = Math.min(Math.max(minTop, newTop), maxTop);

    win.style.left = `${clampedLeft}px`;
    win.style.top = `${clampedTop}px`;
  }

  onPointerUp(e) {
    if (!this.activeDrag) return;
    const titlebar = this.activeDrag.win.querySelector(".wm-titlebar") || this.activeDrag.win.querySelector(".window-titlebar");
    if (titlebar) {
      try {
        titlebar.releasePointerCapture(this.activeDrag.pointerId);
      } catch (err) {}
      titlebar.classList.remove("is-dragging");
      titlebar.removeEventListener("pointermove", this.boundPointerMove);
      titlebar.removeEventListener("pointerup", this.boundPointerUp);
      titlebar.removeEventListener("pointercancel", this.boundPointerUp);
    }
    this.activeDrag = null;
  }

  clampAllWindows() {
    if (window.innerWidth <= 640) return;
    this.openWindows.forEach(({ el: win }) => {
      if (win.hasAttribute("hidden")) return;
      const rect = win.getBoundingClientRect();
      const minLeft = 8;
      const maxLeft = Math.max(8, window.innerWidth - rect.width - 8);
      const minTop = 32;
      const maxTop = Math.max(32, window.innerHeight - 38);

      const clampedLeft = Math.min(Math.max(minLeft, rect.left), maxLeft);
      const clampedTop = Math.min(Math.max(minTop, rect.top), maxTop);

      win.style.left = `${clampedLeft}px`;
      win.style.top = `${clampedTop}px`;
    });
  }
}

// Global singleton instance
window.WindowManager = new WindowManager();

