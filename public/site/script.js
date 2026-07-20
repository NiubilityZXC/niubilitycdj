(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsapReady = typeof window.gsap !== "undefined";
  const scrollTriggerReady = typeof window.ScrollTrigger !== "undefined";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const intro = $(".intro");
  const introCount = $("[data-intro-count]");
  const introBar = $("[data-intro-bar]");
  const heroTitle = $(".hero-title-line > span");

  const completeIntro = () => {
    if (!document.body.classList.contains("is-loading")) return;
    document.body.classList.remove("is-loading");
    intro?.classList.add("is-done");

    if (gsapReady && !reduceMotion) {
      window.gsap.to(heroTitle, {
        y: 0,
        duration: 1.35,
        ease: "power4.out",
      });
      window.gsap.fromTo(
        $$(".hero .reveal-item"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" },
      );
    } else if (heroTitle) {
      heroTitle.style.transform = "none";
    }
  };

  const playIntro = () => {
    if (!intro || reduceMotion) {
      completeIntro();
      return;
    }

    const startedAt = performance.now();
    const duration = 1050;
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * 100);

      if (introCount) introCount.textContent = String(value).padStart(3, "0");
      if (introBar) introBar.style.transform = `scaleX(${eased})`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        window.setTimeout(completeIntro, 180);
      }
    };

    requestAnimationFrame(tick);
  };

  window.setTimeout(completeIntro, 3200);
  playIntro();

  const year = $("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const header = $("[data-header]");
  const progressBar = $("[data-page-progress]");
  const menuButton = $(".menu-toggle");
  const nav = $(".site-nav");

  const updateScrollUi = () => {
    const scrollTop = window.scrollY;
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    header?.classList.toggle("is-scrolled", scrollTop > 24);
    if (progressBar) progressBar.style.transform = `scaleX(${Math.min(scrollTop / scrollable, 1)})`;
  };

  window.addEventListener("scroll", updateScrollUi, { passive: true });
  updateScrollUi();

  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    nav?.classList.toggle("is-open", !open);
    const icon = $("i", menuButton);
    icon?.classList.toggle("ph-list", open);
    icon?.classList.toggle("ph-x", !open);
  });

  $$(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
      const icon = menuButton ? $("i", menuButton) : null;
      icon?.classList.add("ph-list");
      icon?.classList.remove("ph-x");
    });
  });

  const observedSections = $$("main section[id]");
  const navLinks = $$(".site-nav a");
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    { rootMargin: "-25% 0px -60%", threshold: [0, 0.2, 0.5] },
  );
  observedSections.forEach((section) => navObserver.observe(section));

  if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
    const cursor = $(".cursor");
    let cursorX = -80;
    let cursorY = -80;
    let targetX = -80;
    let targetY = -80;

    window.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    }, { passive: true });

    const moveCursor = () => {
      cursorX += (targetX - cursorX) * 0.18;
      cursorY += (targetY - cursorY) * 0.18;
      if (cursor) cursor.style.transform = `translate3d(${cursorX - 19}px, ${cursorY - 19}px, 0)`;
      requestAnimationFrame(moveCursor);
    };
    moveCursor();

    $$('a, button').forEach((interactive) => {
      interactive.addEventListener("pointerenter", () => cursor?.classList.add("is-active"));
      interactive.addEventListener("pointerleave", () => cursor?.classList.remove("is-active"));
    });

    $$(".magnetic").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) / 5;
        const y = (event.clientY - rect.top - rect.height / 2) / 5;
        element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      element.addEventListener("pointerleave", () => {
        element.style.transform = "translate3d(0, 0, 0)";
      });
    });
  }

  const splitCharacterText = () => {
    const target = $("[data-character-reveal]");
    if (!target) return [];
    const text = target.textContent.trim().replace(/\s+/g, " ");
    target.textContent = "";
    return [...text].map((character) => {
      const span = document.createElement("span");
      span.textContent = character === " " ? "\u00a0" : character;
      target.append(span);
      return span;
    });
  };

  const characterSpans = splitCharacterText();

  const setupTideCanvas = () => {
    const canvas = $(".tide-canvas");
    const hero = $(".hero");
    if (!canvas || !hero || reduceMotion) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    let width = 0;
    let height = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let frameId = 0;

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const waveY = (x, layer, time) => {
      const baseline = height * (0.49 + layer * 0.072);
      const distance = Math.abs(x / Math.max(width, 1) - pointerX);
      const pointerInfluence = Math.max(0, 1 - distance * 3.4) * (pointerY - 0.5) * 20;
      return baseline
        + Math.sin(x * 0.011 + time * (0.72 + layer * 0.13)) * (5 + layer * 2.7)
        + Math.sin(x * 0.0042 - time * (0.42 + layer * 0.035)) * (7 + layer * 1.25)
        + pointerInfluence;
    };

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width;
      pointerY = (event.clientY - rect.top) / rect.height;
    }, { passive: true });

    hero.addEventListener("pointerleave", () => {
      pointerX = 0.5;
      pointerY = 0.5;
    }, { passive: true });

    const draw = (timestamp) => {
      const time = timestamp * 0.001;
      context.clearRect(0, 0, width, height);

      for (let layer = 0; layer < 6; layer += 1) {
        context.beginPath();
        for (let x = -32; x <= width + 32; x += 8) {
          const y = waveY(x, layer, time);
          if (x === -32) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        if (layer >= 2) {
          context.lineTo(width + 32, height + 10);
          context.lineTo(-32, height + 10);
          context.closePath();
          context.fillStyle = `rgba(21, 139, 158, ${0.016 + layer * 0.009})`;
          context.fill();
        }

        context.beginPath();
        for (let x = -32; x <= width + 32; x += 8) {
          const y = waveY(x, layer, time);
          if (x === -32) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.lineWidth = 0.75 + layer * 0.2;
        context.strokeStyle = `rgba(225, 252, 255, ${0.16 + layer * 0.045})`;
        context.shadowColor = "rgba(126, 232, 240, 0.5)";
        context.shadowBlur = layer > 2 ? 7 : 3;
        context.stroke();
      }

      context.shadowBlur = 0;
      for (let lane = 0; lane < 3; lane += 1) {
        const layer = lane + 2;
        const spacing = 150 - lane * 14;
        const travel = (time * (24 + lane * 7)) % spacing;
        for (let start = -spacing; start < width + spacing; start += spacing) {
          const x = start + travel;
          const y = waveY(x, layer, time) - 1;
          const length = 24 + lane * 8 + Math.sin(time * 1.3 + start) * 7;
          context.beginPath();
          context.moveTo(x - length, y + 1);
          context.quadraticCurveTo(x - length * 0.25, y - 5 - lane, x + length, y + 1);
          context.lineWidth = 1.2 + lane * 0.35;
          context.strokeStyle = `rgba(244, 255, 255, ${0.34 + lane * 0.11})`;
          context.stroke();
        }
      }

      const glintCount = Math.min(42, Math.max(18, Math.floor(width / 25)));
      for (let index = 0; index < glintCount; index += 1) {
        const x = ((index * 97 + time * (12 + (index % 4) * 4)) % (width + 80)) - 40;
        const depth = (Math.sin(index * 12.37) + 1) / 2;
        const y = height * (0.51 + depth * 0.42) + Math.sin(time * 1.4 + index) * 5;
        const pulse = 0.18 + ((Math.sin(time * 2.2 + index * 1.7) + 1) / 2) * 0.4;
        context.beginPath();
        context.moveTo(x - 2, y);
        context.lineTo(x + 8 + depth * 8, y);
        context.lineWidth = 0.8 + depth;
        context.strokeStyle = `rgba(239, 255, 255, ${pulse})`;
        context.stroke();
      }

      frameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      } else if (!frameId) {
        frameId = requestAnimationFrame(draw);
      }
    });
    frameId = requestAnimationFrame(draw);
  };

  setupTideCanvas();

  if (gsapReady && scrollTriggerReady && !reduceMotion) {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".reveal-item").forEach((element) => {
      if (element.closest(".hero")) return;
      gsap.fromTo(
        element,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        },
      );
    });

    gsap.to(".hero-scene img", {
      yPercent: 10,
      scale: 1.12,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 },
    });

    gsap.to(".hero-title-wrap", {
      y: -70,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 },
    });

    const reel = $("[data-reel]");
    const rightRow = $("[data-reel-row='right']");
    const leftRow = $("[data-reel-row='left']");
    if (reel && rightRow && leftRow) {
      gsap.fromTo(rightRow, { x: -360 }, {
        x: 40,
        ease: "none",
        scrollTrigger: { trigger: reel, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
      gsap.fromTo(leftRow, { x: 20 }, {
        x: -380,
        ease: "none",
        scrollTrigger: { trigger: reel, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
    }

    if (characterSpans.length) {
      ScrollTrigger.create({
        trigger: "[data-character-reveal]",
        start: "top 78%",
        end: "bottom 36%",
        scrub: true,
        onUpdate: ({ progress }) => {
          const visibleCount = Math.ceil(progress * characterSpans.length);
          characterSpans.forEach((span, index) => span.classList.toggle("is-visible", index < visibleCount));
        },
      });
    }

    const cards = gsap.utils.toArray("[data-stack-card]");
    cards.forEach((card, index) => {
      if (index === cards.length - 1) return;
      gsap.to(card, {
        scale: 0.94 + index * 0.015,
        opacity: 0.58,
        ease: "none",
        scrollTrigger: {
          trigger: card.parentElement,
          start: "top 9%",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    ScrollTrigger.refresh();
  } else {
    $$(".reveal-item").forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
    characterSpans.forEach((span) => span.classList.add("is-visible"));
  }
})();
