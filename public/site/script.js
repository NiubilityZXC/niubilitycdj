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

  const setupContentProtection = () => {
    if (window.__portfolioContentProtectionReady) return;
    window.__portfolioContentProtectionReady = true;

    const notice = document.createElement("div");
    notice.className = "content-protection-notice";
    notice.setAttribute("role", "status");
    notice.setAttribute("aria-live", "polite");
    document.body.append(notice);
    let noticeTimer = 0;

    const showNotice = (message) => {
      window.clearTimeout(noticeTimer);
      notice.textContent = message;
      notice.classList.add("is-visible");
      noticeTimer = window.setTimeout(() => notice.classList.remove("is-visible"), 2600);
    };

    const blockContentAction = (event) => {
      event.preventDefault();
      showNotice("除简历下载外，本站内容不提供复制、保存或打印。");
    };

    document.addEventListener("contextmenu", blockContentAction, true);
    document.addEventListener("copy", blockContentAction, true);
    document.addEventListener("cut", blockContentAction, true);
    document.addEventListener("dragstart", blockContentAction, true);
    document.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      const blockedShortcut = (event.ctrlKey || event.metaKey) && ["a", "c", "p", "s", "u", "x"].includes(key);
      if (blockedShortcut) blockContentAction(event);
      if (event.key === "PrintScreen") {
        event.preventDefault();
        showNotice("网页无法控制系统截图，页面内容已加入版权水印。");
      }
    }, true);
  };

  setupContentProtection();

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

  const setupHeroVideo = () => {
    const hero = $(".hero");
    const scene = $(".hero-scene");
    const video = $("[data-hero-video]");
    if (!hero || !scene || !video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    let heroVisible = true;

    const play = () => {
      if (reduceMotion || document.hidden || !heroVisible) {
        video.pause();
        return;
      }

      const playback = video.play();
      playback?.catch(() => {
        // The poster remains visible when a browser blocks autoplay.
      });
    };

    if (reduceMotion) {
      video.pause();
      video.currentTime = 0;
    } else {
      play();
    }

    document.addEventListener("visibilitychange", play);
    window.addEventListener("pageshow", play);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry?.isIntersecting ?? true;
      play();
    }, { threshold: 0.04 });
    visibilityObserver.observe(hero);

    if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
      const target = { panX: 0, panY: 0, tiltX: 0, tiltY: 0 };
      const current = { panX: 0, panY: 0, tiltX: 0, tiltY: 0 };
      let pressed = false;

      const render = () => {
        current.panX += (target.panX - current.panX) * 0.11;
        current.panY += (target.panY - current.panY) * 0.11;
        current.tiltX += (target.tiltX - current.tiltX) * 0.11;
        current.tiltY += (target.tiltY - current.tiltY) * 0.11;
        scene.style.setProperty("--hero-pan-x", `${current.panX.toFixed(2)}px`);
        scene.style.setProperty("--hero-pan-y", `${current.panY.toFixed(2)}px`);
        scene.style.setProperty("--hero-tilt-x", `${current.tiltX.toFixed(2)}deg`);
        scene.style.setProperty("--hero-tilt-y", `${current.tiltY.toFixed(2)}deg`);
        requestAnimationFrame(render);
      };

      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
        const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
        target.panX = x * -16;
        target.panY = y * -10;
        target.tiltX = y * -1.15;
        target.tiltY = x * 1.45;
        if (!pressed) video.playbackRate = 1 + x * 0.16;
        scene.classList.add("is-interacting");
      }, { passive: true });

      hero.addEventListener("pointerleave", () => {
        target.panX = 0;
        target.panY = 0;
        target.tiltX = 0;
        target.tiltY = 0;
        pressed = false;
        video.playbackRate = 1;
        scene.classList.remove("is-interacting", "is-pressed");
      }, { passive: true });

      hero.addEventListener("pointerdown", (event) => {
        if (event.target.closest("a, button")) return;
        pressed = true;
        video.playbackRate = 0.58;
        scene.classList.add("is-pressed");
      });

      window.addEventListener("pointerup", () => {
        if (!pressed) return;
        pressed = false;
        video.playbackRate = 1;
        scene.classList.remove("is-pressed");
      }, { passive: true });

      render();
    }
  };

  setupHeroVideo();

  const setupProjectVideos = () => {
    $$(".project-media-video").forEach((frame) => {
      if (frame.dataset.playerReady === "true") return;
      frame.dataset.playerReady = "true";
      const video = $("video", frame);
      const playButton = $(".project-video-play", frame);
      if (!video || !playButton) return;

      const showPausedState = () => frame.classList.remove("is-playing");
      video.addEventListener("play", () => {
        frame.classList.add("is-playing");
        frame.classList.remove("has-error");
      });
      video.addEventListener("pause", showPausedState);
      video.addEventListener("ended", showPausedState);
      video.addEventListener("loadeddata", () => frame.classList.remove("has-error"));
      video.addEventListener("error", () => {
        showPausedState();
        frame.classList.add("has-error");
        playButton.setAttribute("aria-label", "视频加载失败，点击重试");
        playButton.setAttribute("title", "视频加载失败，点击重试");
      });

      playButton.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        frame.classList.remove("has-error");
        playButton.setAttribute("aria-label", "播放 VisionRL-KUKA 演示视频");
        playButton.setAttribute("title", "播放视频");
        try {
          if (video.readyState === 0) video.load();
          await video.play();
        } catch {
          frame.classList.add("has-error");
          playButton.setAttribute("aria-label", "视频加载失败，点击重试");
          playButton.setAttribute("title", "视频加载失败，点击重试");
        }
      });
    });
  };

  setupProjectVideos();

  const setupProjectInteractions = () => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    $$('[data-stack-card]').forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
        const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
        card.style.setProperty("--media-tilt-x", `${(-y * 2.8).toFixed(2)}deg`);
        card.style.setProperty("--media-tilt-y", `${(x * 3.2).toFixed(2)}deg`);
        card.style.setProperty("--media-shift-x", `${(x * 4).toFixed(2)}px`);
        card.style.setProperty("--media-shift-y", `${(y * 3).toFixed(2)}px`);
        card.style.setProperty("--media-image-x", `${(-x * 9).toFixed(2)}px`);
        card.style.setProperty("--media-image-y", `${(-y * 7).toFixed(2)}px`);
        card.classList.add("is-interacting");
      }, { passive: true });

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--media-tilt-x", "0deg");
        card.style.setProperty("--media-tilt-y", "0deg");
        card.style.setProperty("--media-shift-x", "0px");
        card.style.setProperty("--media-shift-y", "0px");
        card.style.setProperty("--media-image-x", "0px");
        card.style.setProperty("--media-image-y", "0px");
        card.classList.remove("is-interacting");
      }, { passive: true });
    });
  };

  setupProjectInteractions();

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

    gsap.to("[data-hero-video-motion]", {
      yPercent: 7,
      scale: 1.045,
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
        start: "top 96%",
        end: "top 70%",
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
