const yearTarget = document.querySelector("[data-year]");
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = typeof window.gsap !== "undefined";
const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

const introSequence = document.querySelector(".intro-sequence");
const introCount = document.querySelector("[data-intro-count]");
const introBar = document.querySelector("[data-intro-bar]");
let introFallback = 0;

function releasePage() {
  if (introFallback) window.clearTimeout(introFallback);
  document.body.classList.remove("is-loading");
  introSequence?.classList.add("is-finished");
  if (introSequence?.isConnected) {
    window.requestAnimationFrame(() => introSequence.remove());
  }
}

if (!introSequence || prefersReducedMotion) {
  releasePage();
} else if (hasGsap) {
  introFallback = window.setTimeout(releasePage, 3500);
  const introProgress = { value: 0 };
  window.gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .from(".intro-line-horizontal", { scaleX: 0, duration: 0.7 }, 0)
    .from(".intro-line-vertical", { scaleY: 0, duration: 0.7 }, 0.08)
    .from(".intro-code", { x: -24, autoAlpha: 0, duration: 0.46 }, 0.12)
    .from(".intro-copy p span", { yPercent: 112, duration: 0.86, ease: "power4.out" }, 0.18)
    .from(".intro-copy small", { y: 16, autoAlpha: 0, duration: 0.46 }, 0.5)
    .to(
      introProgress,
      {
        value: 100,
        duration: 1.22,
        ease: "power2.inOut",
        onUpdate: () => {
          if (introCount) introCount.textContent = String(Math.round(introProgress.value)).padStart(3, "0");
        },
      },
      0.14,
    )
    .to(introBar, { scaleX: 1, duration: 1.22, ease: "power2.inOut" }, 0.14)
    .to(".intro-copy, .intro-meter", { y: -22, autoAlpha: 0, duration: 0.34, ease: "power2.in" }, 1.38)
    .to(introSequence, { clipPath: "inset(0 0 100% 0)", duration: 0.82, ease: "power4.inOut" }, 1.48)
    .add(releasePage, 2.34);
} else {
  window.setTimeout(releasePage, 900);
}

const scrollBar = document.querySelector("[data-scroll-bar]");
const scrollCount = document.querySelector("[data-scroll-count]");
let scrollProgressFrame = 0;

function updateScrollProgress() {
  scrollProgressFrame = 0;
  const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, window.scrollY / scrollRange));
  if (scrollBar) scrollBar.style.transform = `scaleY(${progress})`;
  if (scrollCount) scrollCount.textContent = String(Math.round(progress * 100)).padStart(2, "0");
}

window.addEventListener(
  "scroll",
  () => {
    if (!scrollProgressFrame) scrollProgressFrame = window.requestAnimationFrame(updateScrollProgress);
  },
  { passive: true },
);
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

const menuToggle = document.querySelector(".menu-toggle");
const menuIcon = menuToggle?.querySelector("i");
const nav = document.querySelector(".site-nav");

function setMenuState(isOpen) {
  document.body.classList.toggle("nav-open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  menuIcon?.classList.toggle("ph-list", !isOpen);
  menuIcon?.classList.toggle("ph-x", isOpen);
  const label = menuToggle?.querySelector(".sr-only");
  if (label) {
    label.textContent = isOpen ? "关闭导航" : "打开导航";
  }
}

menuToggle?.addEventListener("click", () => {
  setMenuState(!document.body.classList.contains("nav-open"));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    setMenuState(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
  }
});

const projectData = [
  {
    index: "01",
    kicker: "研究 · 2025—至今",
    title: "VLM Reliability",
    description:
      "面向图像描述幻觉与目标误分类，部署并比较 BLIP2、GLIP、LLaVA-Next 与 ContextDET，构建伪 GT、鲁棒微调和开放场景评估流程。",
    tags: ["LoRA", "LLaVA", "BLIP2", "HICO-DET"],
    linkLabel: "查看研究",
    link: "#research",
    view: "系统视图 / 01",
    position: "50% 50%",
  },
  {
    index: "02",
    kicker: "机器人 · 2025 年 4 月",
    title: "VisionRL-KUKA",
    description:
      "在 PyBullet 中使用 PPO 强化学习构建 KUKA 机械臂视觉伺服系统，并设计融合 CNN 感知与六自由度动作空间的自定义 Gym 环境。",
    tags: ["PyBullet", "PPO", "CNN", "Gym"],
    linkLabel: "查看工程项目",
    link: "#project-index-title",
    view: "机器人视图 / 02",
    position: "62% 50%",
  },
  {
    index: "03",
    kicker: "移动产品 · 2024",
    title: "GT-Social",
    description:
      "使用 Flutter 与 Firebase 开发跨平台校园社交应用，负责首页 UI/UX、事件排序功能，以及从 Figma 设计到产品实现的完整流程。",
    tags: ["Flutter", "Firebase", "Figma", "产品"],
    linkLabel: "查看产品项目",
    link: "#project-index-title",
    view: "产品视图 / 03",
    position: "35% 48%",
  },
  {
    index: "04",
    kicker: "云端系统 · 2023",
    title: "AWS 系统",
    description:
      "使用 S3、Cloud9、Lambda 与 DynamoDB 构建文件夹使用情况统计网页，通过事件触发器实现数据自动入库与可视化。",
    tags: ["AWS S3", "Lambda", "DynamoDB", "Cloud9"],
    linkLabel: "查看云端项目",
    link: "#project-index-title",
    view: "云端视图 / 04",
    position: "72% 48%",
  },
];

const relayTabs = Array.from(document.querySelectorAll(".relay-tab"));
const relayNext = document.querySelector(".relay-next");
const relayCount = document.querySelector(".relay-label strong");
const featureElements = {
  kicker: document.querySelector(".feature-kicker"),
  index: document.querySelector(".feature-index"),
  title: document.querySelector("#feature-title"),
  description: document.querySelector(".feature-lede"),
  tags: document.querySelector(".feature-meta"),
  link: document.querySelector(".feature-copy .text-link"),
  view: document.querySelector(".window-label"),
  image: document.querySelector(".feature-window img"),
};
let activeProject = 0;
let projectTimeline;

function writeProject(projectIndex) {
  const project = projectData[projectIndex];
  if (!project) return;

  featureElements.kicker.textContent = project.kicker;
  featureElements.index.textContent = project.index;
  featureElements.title.textContent = project.title;
  featureElements.description.textContent = project.description;
  featureElements.tags.replaceChildren(
    ...project.tags.map((tag) => {
      const span = document.createElement("span");
      span.textContent = tag;
      return span;
    }),
  );
  featureElements.link.firstChild.textContent = `${project.linkLabel} `;
  featureElements.link.setAttribute("href", project.link);
  featureElements.view.textContent = project.view;
  featureElements.image.style.objectPosition = project.position;
  relayCount.textContent = `${project.index} / 04`;
}

function selectProject(projectIndex, shouldFocus = false) {
  const nextIndex = (projectIndex + projectData.length) % projectData.length;
  if (nextIndex === activeProject && relayTabs[nextIndex].classList.contains("active")) return;

  activeProject = nextIndex;
  relayTabs.forEach((tab, index) => {
    const isActive = index === activeProject;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  if (shouldFocus) {
    relayTabs[activeProject].focus();
  }

  const copyTargets = [
    featureElements.kicker,
    featureElements.index,
    featureElements.title,
    featureElements.description,
    featureElements.tags,
    featureElements.link,
  ];

  if (!hasGsap || prefersReducedMotion) {
    writeProject(activeProject);
    return;
  }

  projectTimeline?.kill();
  projectTimeline = window.gsap.timeline();
  projectTimeline
    .to(copyTargets, {
      autoAlpha: 0,
      y: 14,
      duration: 0.18,
      stagger: 0.015,
      ease: "power2.in",
      onComplete: () => writeProject(activeProject),
    })
    .to(
      ".feature-window",
      {
        rotationY: activeProject % 2 === 0 ? 7 : -7,
        rotationX: -3,
        scale: 0.965,
        duration: 0.2,
        ease: "power2.in",
      },
      0,
    )
    .fromTo(
      featureElements.image,
      {
        scale: 1.16,
        rotate: activeProject % 2 === 0 ? -2.2 : 2.2,
        clipPath: activeProject % 2 === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
      },
      { scale: 1, rotate: 0, clipPath: "inset(0 0 0 0)", duration: 0.92, ease: "power4.out" },
      0.12,
    )
    .to(
      ".feature-window",
      { rotationY: 0, rotationX: 0, scale: 1, duration: 0.72, ease: "power3.out" },
      0.2,
    )
    .to(copyTargets, {
      autoAlpha: 1,
      y: 0,
      duration: 0.42,
      stagger: 0.035,
      ease: "power3.out",
    }, 0.22);
}

relayTabs.forEach((tab, index) => {
  tab.tabIndex = index === 0 ? 0 : -1;
  tab.addEventListener("click", () => selectProject(index));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") selectProject(0, true);
    if (event.key === "End") selectProject(projectData.length - 1, true);
    if (event.key === "ArrowLeft") selectProject(activeProject - 1, true);
    if (event.key === "ArrowRight") selectProject(activeProject + 1, true);
  });
});

relayNext?.addEventListener("click", () => selectProject(activeProject + 1));

const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const navIndicator = document.querySelector(".nav-indicator");

function moveNavIndicator(link) {
  if (!link || !navIndicator || window.innerWidth <= 820) return;
  const update = {
    x: link.offsetLeft,
    width: link.offsetWidth,
    opacity: 1,
    duration: prefersReducedMotion ? 0 : 0.36,
    ease: "power3.out",
  };
  if (hasGsap) {
    window.gsap.to(navIndicator, update);
  } else {
    navIndicator.style.width = `${link.offsetWidth}px`;
    navIndicator.style.opacity = "1";
    navIndicator.style.transform = `translateX(${link.offsetLeft}px)`;
  }
}

const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      const activeLink = navLinks.find((link) => link.getAttribute("href") === `#${visible.target.id}`);
      navLinks.forEach((link) => link.classList.toggle("active", link === activeLink));
      moveNavIndicator(activeLink);
    },
    { rootMargin: "-28% 0px -55% 0px", threshold: [0.05, 0.2, 0.45] },
  );
  observedSections.forEach((section) => sectionObserver.observe(section));
}

navLinks.forEach((link) => {
  link.addEventListener("mouseenter", () => moveNavIndicator(link));
  link.addEventListener("focus", () => moveNavIndicator(link));
});

nav?.addEventListener("mouseleave", () => {
  moveNavIndicator(navLinks.find((link) => link.classList.contains("active")));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) setMenuState(false);
  moveNavIndicator(navLinks.find((link) => link.classList.contains("active")));
});

function initSignalCanvas() {
  const canvas = document.querySelector(".signal-canvas");
  const stage = document.querySelector(".visual-stage");
  if (!(canvas instanceof HTMLCanvasElement) || !stage) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const colors = ["#14543d", "#285ea8", "#b74c20", "#d29a1c"];
  const pointer = { x: 0, y: 0, active: false };
  let width = 1;
  let height = 1;
  let nodes = [];
  let animationFrame = 0;

  function createNodes() {
    const count = width < 560 ? 24 : 42;
    nodes = Array.from({ length: count }, (_, index) => ({
      x: ((index * 73) % 101) / 101 * width,
      y: ((index * 47 + 19) % 97) / 97 * height,
      vx: (Math.sin(index * 1.7) * 0.18) || 0.08,
      vy: (Math.cos(index * 1.3) * 0.16) || -0.08,
      radius: 1.4 + (index % 4) * 0.42,
      color: colors[index % colors.length],
    }));
  }

  function resizeCanvas() {
    const bounds = stage.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(bounds.width));
    height = Math.max(1, Math.round(bounds.height));
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    createNodes();
    drawNetwork(false);
  }

  function drawNetwork(continueAnimation = true) {
    context.clearRect(0, 0, width, height);
    const connectionDistance = width < 560 ? 88 : 126;

    nodes.forEach((node) => {
      if (!prefersReducedMotion) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -8 || node.x > width + 8) node.vx *= -1;
        if (node.y < -8 || node.y > height + 8) node.vy *= -1;

        if (pointer.active) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 170 && distance > 1) {
            node.x += dx * 0.0018;
            node.y += dy * 0.0018;
          }
        }
      }
    });

    for (let first = 0; first < nodes.length; first += 1) {
      for (let second = first + 1; second < nodes.length; second += 1) {
        const dx = nodes[first].x - nodes[second].x;
        const dy = nodes[first].y - nodes[second].y;
        const distance = Math.hypot(dx, dy);
        if (distance >= connectionDistance) continue;
        context.beginPath();
        context.moveTo(nodes[first].x, nodes[first].y);
        context.lineTo(nodes[second].x, nodes[second].y);
        context.strokeStyle = `rgba(20, 84, 61, ${0.24 * (1 - distance / connectionDistance)})`;
        context.lineWidth = 0.7;
        context.stroke();
      }
    }

    nodes.forEach((node) => {
      context.beginPath();
      context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      context.fillStyle = node.color;
      context.fill();
    });

    if (pointer.active) {
      context.beginPath();
      context.arc(pointer.x, pointer.y, 18, 0, Math.PI * 2);
      context.strokeStyle = "rgba(183, 76, 32, 0.42)";
      context.lineWidth = 1;
      context.stroke();
    }

    if (continueAnimation && !prefersReducedMotion) {
      animationFrame = window.requestAnimationFrame(() => drawNetwork(true));
    }
  }

  stage.addEventListener("pointermove", (event) => {
    const bounds = stage.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
  });
  stage.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  const resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(stage);
  resizeCanvas();
  if (!prefersReducedMotion) animationFrame = window.requestAnimationFrame(() => drawNetwork(true));

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
    } else if (!prefersReducedMotion) {
      animationFrame = window.requestAnimationFrame(() => drawNetwork(true));
    }
  });
}

initSignalCanvas();

const cursorAura = document.querySelector(".cursor-aura");
if (cursorAura && hasGsap && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  const moveCursorX = window.gsap.quickTo(cursorAura, "x", { duration: 0.22, ease: "power3.out" });
  const moveCursorY = window.gsap.quickTo(cursorAura, "y", { duration: 0.22, ease: "power3.out" });

  document.addEventListener("pointermove", (event) => {
    cursorAura.classList.add("is-visible");
    moveCursorX(event.clientX);
    moveCursorY(event.clientY);
  }, { passive: true });

  document.addEventListener("pointerover", (event) => {
    if (event.target instanceof Element && event.target.closest("a, button, .project-row")) {
      cursorAura.classList.add("is-active");
    }
  });
  document.addEventListener("pointerout", (event) => {
    if (event.target instanceof Element && event.target.closest("a, button, .project-row")) {
      cursorAura.classList.remove("is-active");
    }
  });

  document.addEventListener("pointerdown", (event) => {
    const pulse = document.createElement("span");
    pulse.className = "click-pulse";
    pulse.style.left = `${event.clientX}px`;
    pulse.style.top = `${event.clientY}px`;
    document.body.append(pulse);
    window.gsap.fromTo(
      pulse,
      { scale: 0.25, autoAlpha: 0.9 },
      { scale: 3.2, autoAlpha: 0, duration: 0.62, ease: "power2.out", onComplete: () => pulse.remove() },
    );
  });
}

if (hasGsap && hasScrollTrigger && !prefersReducedMotion) {
  window.gsap.registerPlugin(window.ScrollTrigger);
  const compactMotion = window.matchMedia("(max-width: 820px)").matches;

  const heroReveal = window.gsap.timeline({ defaults: { ease: "power3.out" } });
  heroReveal
    .from(".site-header", { yPercent: -105, duration: 0.72 })
    .from(".hero-eyebrow", { x: -30, autoAlpha: 0, duration: 0.55 }, 0.12)
    .from(".reveal-line > span", { yPercent: 118, rotationX: -18, duration: 1.05, stagger: 0.12 }, 0.12)
    .from(".hero-role, .hero-copy", { y: 28, autoAlpha: 0, duration: 0.68, stagger: 0.1 }, 0.4)
    .from(".hero-actions .button", { y: 20, scale: 0.94, autoAlpha: 0, duration: 0.52, stagger: 0.08 }, 0.62)
    .from(".visual-stage", { clipPath: "inset(0 0 100% 0)", x: 48, autoAlpha: 0, duration: 1.2, ease: "power4.out" }, 0.2)
    .from(".visual-main", { scale: 0.76, rotate: -5, duration: 1.35, ease: "expo.out" }, 0.34)
    .from(".target-reticle", { scale: 1.8, rotate: -90, autoAlpha: 0, duration: 0.9 }, 0.58)
    .from(".project-relay", { y: 46, autoAlpha: 0, duration: 0.72 }, 0.78);

  window.gsap.to(".ghost-one", {
    x: 25,
    y: -18,
    rotate: 1.2,
    duration: 3.1,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  window.gsap.to(".ghost-two", {
    x: -22,
    y: 17,
    rotate: -1,
    duration: 3.7,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  window.gsap.to(".visual-main", {
    y: -10,
    duration: 3.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  window.gsap.to(".target-reticle", {
    scale: 1.12,
    duration: 1.7,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  window.gsap
    .timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.1,
      },
    })
    .to(".hero-content", { y: -92, autoAlpha: 0.28, ease: "none" }, 0)
    .to(".visual-stage", { y: 105, scale: 0.9, rotationX: 5, ease: "none" }, 0)
    .to(".project-relay", { y: 34, ease: "none" }, 0);

  window.gsap.fromTo(
    ".feature-window",
    { y: -34, rotate: -1.8 },
    {
      y: 34,
      rotate: 1.8,
      ease: "none",
      scrollTrigger: {
        trigger: ".feature-project",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.15,
      },
    },
  );

  window.gsap.fromTo(
    ".feature-window img",
    { scale: 1.1 },
    {
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".feature-project",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.15,
      },
    },
  );

  window.gsap.utils.toArray(".reveal-section").forEach((section) => {
    const leadElements = section.querySelectorAll(".eyebrow, .section-head > p");
    window.gsap.from(leadElements, {
      y: 26,
      autoAlpha: 0,
      duration: 0.72,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 84%", once: true },
    });
  });

  window.gsap.utils.toArray(".section-head h2, .credentials h2, .contact-section h2").forEach((heading) => {
    window.gsap.from(heading, {
      y: 70,
      rotationX: -18,
      autoAlpha: 0,
      clipPath: "inset(0 0 100% 0)",
      duration: 1.02,
      transformOrigin: "50% 100%",
      ease: "power4.out",
      scrollTrigger: { trigger: heading, start: "top 88%", once: true },
    });
  });

  window.gsap.from(".research-primary", {
    x: compactMotion ? 0 : -58,
    y: compactMotion ? 38 : 0,
    autoAlpha: 0,
    duration: 0.92,
    ease: "power4.out",
    scrollTrigger: { trigger: ".research-grid", start: "top 80%", once: true },
  });

  window.gsap.from(".project-row", {
    x: (index) => compactMotion ? 0 : (index % 2 === 0 ? -64 : 64),
    y: compactMotion ? 34 : 0,
    rotationY: (index) => compactMotion ? 0 : (index % 2 === 0 ? -4 : 4),
    autoAlpha: 0,
    duration: 0.78,
    stagger: 0.11,
    ease: "power4.out",
    scrollTrigger: { trigger: ".project-list", start: "top 78%", once: true },
  });

  window.gsap.from(".research-notes article", {
    x: compactMotion ? 0 : 58,
    y: compactMotion ? 30 : 0,
    autoAlpha: 0,
    duration: 0.72,
    stagger: 0.13,
    ease: "power4.out",
    scrollTrigger: { trigger: ".research-notes", start: "top 80%", once: true },
  });

  window.gsap.from(".experience-item", {
    x: compactMotion ? 0 : -52,
    y: compactMotion ? 30 : 0,
    autoAlpha: 0,
    duration: 0.8,
    stagger: 0.16,
    ease: "power4.out",
    scrollTrigger: { trigger: ".experience-list", start: "top 82%", once: true },
  });

  window.gsap.from(".skill-lines article", {
    x: (index) => compactMotion ? 0 : (index % 2 === 0 ? -54 : 54),
    y: compactMotion ? 30 : 0,
    autoAlpha: 0,
    duration: 0.76,
    stagger: 0.1,
    ease: "power4.out",
    scrollTrigger: { trigger: ".skill-lines", start: "top 82%", once: true },
  });

  window.gsap.from(".credential-secondary, .achievement-list p", {
    x: compactMotion ? 0 : 46,
    y: compactMotion ? 28 : 0,
    autoAlpha: 0,
    duration: 0.72,
    stagger: 0.09,
    ease: "power3.out",
    scrollTrigger: { trigger: ".credentials-grid", start: "top 82%", once: true },
  });
}

const visualStage = document.querySelector(".visual-stage");
if (visualStage && hasGsap && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  const moveMainX = window.gsap.quickTo(".visual-main", "x", { duration: 0.65, ease: "power3.out" });
  const moveMainY = window.gsap.quickTo(".visual-main", "y", { duration: 0.65, ease: "power3.out" });
  const moveMainRotateX = window.gsap.quickTo(".visual-main", "rotationX", { duration: 0.72, ease: "power3.out" });
  const moveMainRotateY = window.gsap.quickTo(".visual-main", "rotationY", { duration: 0.72, ease: "power3.out" });
  const moveGhostOneX = window.gsap.quickTo(".ghost-one", "x", { duration: 0.9, ease: "power3.out" });
  const moveGhostTwoX = window.gsap.quickTo(".ghost-two", "x", { duration: 0.9, ease: "power3.out" });
  const moveReticleX = window.gsap.quickTo(".target-reticle", "x", { duration: 0.8, ease: "power3.out" });
  const moveReticleY = window.gsap.quickTo(".target-reticle", "y", { duration: 0.8, ease: "power3.out" });

  visualStage.addEventListener("pointermove", (event) => {
    const bounds = visualStage.getBoundingClientRect();
    const xRatio = (event.clientX - bounds.left) / bounds.width - 0.5;
    const yRatio = (event.clientY - bounds.top) / bounds.height - 0.5;
    moveMainX(xRatio * 22);
    moveMainY(yRatio * 16 - 7);
    moveMainRotateX(yRatio * -7);
    moveMainRotateY(xRatio * 9);
    moveGhostOneX(xRatio * 44 + 18);
    moveGhostTwoX(xRatio * -34 - 15);
    moveReticleX(xRatio * 42);
    moveReticleY(yRatio * 34);
  });

  visualStage.addEventListener("pointerleave", () => {
    moveMainX(0);
    moveMainY(-7);
    moveMainRotateX(0);
    moveMainRotateY(0);
    moveGhostOneX(18);
    moveGhostTwoX(-15);
    moveReticleX(0);
    moveReticleY(0);
  });
}

if (hasGsap && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const bounds = element.getBoundingClientRect();
      window.gsap.to(element, {
        x: (event.clientX - bounds.left - bounds.width / 2) * 0.16,
        y: (event.clientY - bounds.top - bounds.height / 2) * 0.2,
        duration: 0.28,
        ease: "power2.out",
      });
    });
    element.addEventListener("pointerleave", () => {
      window.gsap.to(element, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, 0.45)" });
    });
  });
}

document.addEventListener("visibilitychange", () => {
  if (!hasGsap) return;
  window.gsap.globalTimeline.paused(document.hidden);
});
