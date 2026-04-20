// ===================================
// Invitation Defaults
// ===================================
const DEFAULT_INVITATION = {
  slug: "vo-nguyen-minh-quan",
  name: "Võ Nguyễn Minh Quân",
  age: 2026,
  countdownDate: "2026-04-23T18:00:00+07:00",
  dateISO: "2026-04-23",
  dateDisplay: "Thứ Năm, 23 tháng 04, 2026",
  time: "18:00",
  location: [
    "Đại học Công Thương TP.HCM",
    "140 Lê Trọng Tấn, P. Tây Thạnh, TP.HCM",
    "TP. Hồ Chí Minh",
  ],
  mapUrl: "https://maps.app.goo.gl/PGUwVH8ErdPtQKGa7",
  message:
    "Rất mong bạn đến chung vui và chứng kiến khoảnh khắc tốt nghiệp đáng nhớ của mình.",
  image: "../img/MinhQuun.jpg",
  metaTitle: "Thiệp mời tốt nghiệp của Võ Nguyễn Minh Quân",
  metaDescription:
    "Thiệp mời lễ tốt nghiệp với hiệu ứng hiện đại và thông tin đầy đủ.",
  sharePath: "index.html?guest=vo-nguyen-minh-quan",
};

// ===================================
// Configuration
// ===================================
const CONFIG = {
  eventDate: new Date(DEFAULT_INVITATION.countdownDate),
  particleCount: 100,
  confettiCount: 50,
  colors: {
    primary: "#3b82f6",
    secondary: "#93c5fd",
    accent: "#60a5fa",
    purple: "#2563eb",
    pink: "#38bdf8",
  },
};

// ===================================
// State Management
// ===================================
const STATE = {
  isCardFlipped: false,
  isMusicPlaying: false,
  audio: null,
  playMusic: null,
  pauseMusic: null,
  particles: [],
  confetti: [],
  shareUrl: "",
  shareData: {
    title: "",
    text: "",
  },
};

// ===================================
// DOM Elements
// ===================================
const DOM = {
  card: document.getElementById("card"),
  cardInner: document.querySelector(".gra_inv__card-inner"),
  cardBack: document.querySelector(".gra_inv__card-back"),
  openCard: document.getElementById("openCard"),
  closeCard: document.getElementById("closeCard"),
  musicToggle: document.getElementById("musicToggle"),
  musicButton: document.querySelector(".gra_inv__music-button"),
  canvas: document.getElementById("canvas"),
  particles: document.getElementById("particles"),
  countdown: {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  },
  share: {
    section: document.getElementById("shareSection"),
    button: document.getElementById("shareButton"),
    label: document.getElementById("shareButtonLabel"),
    link: document.getElementById("shareLink"),
  },
};

const DYNAMIC = {
  avatar: document.getElementById("guestAvatar"),
  name: document.getElementById("guestName"),
  age: document.getElementById("guestAge"),
  dateDisplay: document.getElementById("eventDateDisplay"),
  timeRange: document.getElementById("eventTimeRange"),
  location: document.getElementById("eventLocation"),
  mapLink: document.getElementById("eventMapLink"),
  message: document.getElementById("guestMessage"),
};

// ===================================
// Particle System
// ===================================
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.color = Object.values(CONFIG.colors)[Math.floor(Math.random() * 5)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// ===================================
// Confetti System
// ===================================
class Confetti {
  constructor(canvas, x, y) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.size = Math.random() * 10 + 5;
    this.speedY = Math.random() * 5 + 2;
    this.speedX = Math.random() * 4 - 2;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 10 - 5;
    this.color = Object.values(CONFIG.colors)[Math.floor(Math.random() * 5)];
    this.opacity = 1;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;
    this.speedY += 0.1; // gravity
    this.opacity -= 0.01;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }

  isAlive() {
    return this.opacity > 0 && this.y < this.canvas.height;
  }
}

// ===================================
// Canvas Animation
// ===================================
function initCanvas() {
  const canvas = DOM.canvas;
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Create particles
  for (let i = 0; i < CONFIG.particleCount; i++) {
    STATE.particles.push(new Particle(canvas));
  }

  // Draw connections between particles
  function drawConnections() {
    for (let i = 0; i < STATE.particles.length; i++) {
      for (let j = i + 1; j < STATE.particles.length; j++) {
        const dx = STATE.particles[i].x - STATE.particles[j].x;
        const dy = STATE.particles[i].y - STATE.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.strokeStyle = CONFIG.colors.primary;
          ctx.globalAlpha = (1 - distance / 150) * 0.2;
          ctx.lineWidth = 1;
          ctx.moveTo(STATE.particles[i].x, STATE.particles[i].y);
          ctx.lineTo(STATE.particles[j].x, STATE.particles[j].y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    STATE.particles.forEach((particle) => {
      particle.update();
      particle.draw(ctx);
    });

    drawConnections();

    // Update and draw confetti
    STATE.confetti = STATE.confetti.filter((conf) => {
      conf.update();
      conf.draw(ctx);
      return conf.isAlive();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ===================================
// Create Particles in DOM
// ===================================
function createDOMParticles() {
  const container = DOM.particles;
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${
              Object.values(CONFIG.colors)[Math.floor(Math.random() * 5)]
            };
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            animation: gra_inv-particle-float ${
              Math.random() * 10 + 10
            }s linear infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
        `;
    container.appendChild(particle);
  }

  // Add CSS animation
  if (!document.getElementById("particle-animation")) {
    const style = document.createElement("style");
    style.id = "particle-animation";
    style.textContent = `
            @keyframes gra_inv-particle-float {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                }
                25% {
                    transform: translate(20px, -30px) scale(1.2);
                }
                50% {
                    transform: translate(-20px, -60px) scale(0.8);
                }
                75% {
                    transform: translate(30px, -30px) scale(1.1);
                }
            }
        `;
    document.head.appendChild(style);
  }
}

// ===================================
// Card Flip
// ===================================
function initCardFlip() {
  if (!DOM.openCard || !DOM.closeCard) {
    return;
  }
  DOM.openCard.addEventListener("click", () => {
    flipCard(true);
    createConfettiBurst();
    if (typeof STATE.playMusic === "function") {
      STATE.playMusic().catch((error) => {
        console.warn("Không thể phát nhạc khi mở thiệp:", error);
      });
    }
  });

  DOM.closeCard.addEventListener("click", () => {
    flipCard(false);
  });
}

function flipCard(flip) {
  STATE.isCardFlipped = flip;
  if (flip && DOM.card) {
    DOM.card.style.transform = "";
  }
  if (flip) {
    DOM.cardInner.classList.add("gra_inv__card-inner--flipped");
    if (DOM.cardBack) {
      DOM.cardBack.scrollTop = 0;
    }
  } else {
    DOM.cardInner.classList.remove("gra_inv__card-inner--flipped");
  }
}

// ===================================
// Confetti Burst
// ===================================
function createConfettiBurst() {
  const canvas = DOM.canvas;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < CONFIG.confettiCount; i++) {
    const angle = (Math.PI * 2 * i) / CONFIG.confettiCount;
    const velocity = Math.random() * 5 + 5;
    const confetti = new Confetti(canvas, centerX, centerY);
    confetti.speedX = Math.cos(angle) * velocity;
    confetti.speedY = Math.sin(angle) * velocity - 5;
    STATE.confetti.push(confetti);
  }
}

// ===================================
// Countdown Timer
// ===================================
function initCountdown() {
  function updateCountdown() {
    if (
      !(CONFIG.eventDate instanceof Date) ||
      Number.isNaN(CONFIG.eventDate.getTime())
    ) {
      DOM.countdown.days.textContent = "00";
      DOM.countdown.hours.textContent = "00";
      DOM.countdown.minutes.textContent = "00";
      DOM.countdown.seconds.textContent = "00";
      return;
    }

    const now = new Date().getTime();
    const distance = CONFIG.eventDate.getTime() - now;

    if (distance < 0) {
      DOM.countdown.days.textContent = "00";
      DOM.countdown.hours.textContent = "00";
      DOM.countdown.minutes.textContent = "00";
      DOM.countdown.seconds.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    DOM.countdown.days.textContent = String(days).padStart(2, "0");
    DOM.countdown.hours.textContent = String(hours).padStart(2, "0");
    DOM.countdown.minutes.textContent = String(minutes).padStart(2, "0");
    DOM.countdown.seconds.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ===================================
// Music Player
// ===================================
function initMusicPlayer() {
  if (!DOM.musicToggle || !DOM.musicButton) {
    return;
  }

  const audioSrc = DOM.musicButton.dataset.audioSrc;
  DOM.musicToggle.setAttribute("aria-pressed", "false");

  if (!audioSrc) {
    console.warn(
      "Không tìm thấy đường dẫn nhạc. Hãy gán data-audio-src cho nút nhạc.",
    );
    DOM.musicButton.classList.add("gra_inv__music-button--paused");
    return;
  }

  STATE.audio = new Audio(audioSrc);
  STATE.audio.loop = true;
  STATE.audio.preload = "auto";
  STATE.audio.volume = 0.4;

  const playMusic = async () => {
    if (!STATE.audio || STATE.isMusicPlaying) {
      return;
    }

    await STATE.audio.play();
    STATE.isMusicPlaying = true;
    DOM.musicButton.classList.remove("gra_inv__music-button--paused");
    DOM.musicToggle.setAttribute("aria-pressed", "true");
  };

  const pauseMusic = () => {
    if (!STATE.audio || !STATE.isMusicPlaying) {
      return;
    }

    STATE.audio.pause();
    STATE.isMusicPlaying = false;
    DOM.musicButton.classList.add("gra_inv__music-button--paused");
    DOM.musicToggle.setAttribute("aria-pressed", "false");
  };

  STATE.playMusic = async () => {
    try {
      await playMusic();
    } catch (error) {
      console.error("Không thể phát nhạc:", error);
      pauseMusic();
      throw error;
    }
  };

  STATE.pauseMusic = pauseMusic;

  DOM.musicToggle.addEventListener("click", async () => {
    if (STATE.isMusicPlaying) {
      pauseMusic();
      return;
    }

    try {
      await playMusic();
    } catch (error) {
      console.error("Không thể phát nhạc:", error);
      pauseMusic();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseMusic();
    }
  });
}

// ===================================
// Mouse Interaction Effects
// ===================================
function initMouseEffects() {
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Parallax effect on card
    if (DOM.card) {
      if (STATE.isCardFlipped) {
        if (DOM.card.style.transform) {
          DOM.card.style.transform = "";
        }
      } else {
        const moveX = (mouseX - window.innerWidth / 2) / 50;
        const moveY = (mouseY - window.innerHeight / 2) / 50;
        DOM.card.style.transform = `perspective(2000px) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
      }
    }

    // Create sparkle on mouse move
    if (Math.random() > 0.95) {
      createSparkle(mouseX, mouseY);
    }
  });

  // Reset card position on mouse leave
  document.addEventListener("mouseleave", () => {
    if (DOM.card) {
      DOM.card.style.transform = "";
    }
  });
}

function createSparkle(x, y) {
  const sparkle = document.createElement("div");
  sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 5px;
        height: 5px;
        background: ${CONFIG.colors.accent};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 10px currentColor;
        animation: gra_inv-sparkle-fade 1s ease forwards;
    `;
  document.body.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 1000);
}

// Add sparkle animation
if (!document.getElementById("sparkle-animation")) {
  const style = document.createElement("style");
  style.id = "sparkle-animation";
  style.textContent = `
        @keyframes gra_inv-sparkle-fade {
            0% {
                opacity: 1;
                transform: translate(0, 0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(${Math.random() * 50 - 25}px, ${
                  Math.random() * 50 - 25
                }px) scale(0);
            }
        }
    `;
  document.head.appendChild(style);
}

// ===================================
// Touch Gestures
// ===================================
function initTouchGestures() {
  if (!DOM.card) {
    return;
  }
  let touchStartX = 0;
  let touchStartY = 0;

  DOM.card.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true },
  );

  DOM.card.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;

      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Swipe left to open
      if (
        Math.abs(diffX) > Math.abs(diffY) &&
        diffX > 50 &&
        !STATE.isCardFlipped
      ) {
        DOM.openCard.click();
      }

      // Swipe right to close
      if (
        Math.abs(diffX) > Math.abs(diffY) &&
        diffX < -50 &&
        STATE.isCardFlipped
      ) {
        DOM.closeCard.click();
      }
    },
    { passive: true },
  );
}

// ===================================
// Keyboard Navigation
// ===================================
function initKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    // ESC to close card
    if (e.key === "Escape" && STATE.isCardFlipped) {
      DOM.closeCard.click();
    }

    // Enter or Space to open card
    if (
      (e.key === "Enter" || e.key === " ") &&
      !STATE.isCardFlipped &&
      document.activeElement === DOM.openCard
    ) {
      e.preventDefault();
      DOM.openCard.click();
    }

    // M to toggle music
    if (e.key === "m" || e.key === "M") {
      DOM.musicToggle.click();
    }
  });
}

// ===================================
// Performance Optimization
// ===================================
function initPerformanceOptimization() {
  // Reduce particles on low-end devices
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    CONFIG.particleCount = 30;
    CONFIG.confettiCount = 20;
  }

  // Reduce animations on mobile
  if (window.innerWidth < 768) {
    CONFIG.particleCount = 50;
    CONFIG.confettiCount = 30;
  }
}

// ===================================
// Accessibility
// ===================================
function initAccessibility() {
  // Add ARIA live region
  const liveRegion = document.createElement("div");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  liveRegion.className = "gra_inv__sr-only";
  liveRegion.style.cssText =
    "position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;";
  document.body.appendChild(liveRegion);

  // Announce card state
  DOM.openCard.addEventListener("click", () => {
    liveRegion.textContent = "Thiep moi tot nghiep da duoc mo";
  });

  DOM.closeCard.addEventListener("click", () => {
    liveRegion.textContent = "Thiep moi tot nghiep da duoc dong";
  });
}

// ===================================
// Data Loading & Binding
// ===================================
const INVITATION_DATA_SOURCES = [
  "../data/invitations.json",
  "/data/invitations.json",
  "data/invitations.json",
];

function getInvitationSlug() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("guest");
  if (fromQuery) {
    return decodeURIComponent(fromQuery.trim().toLowerCase());
  }

  const hash = window.location.hash.replace("#", "").trim().toLowerCase();
  if (hash) {
    return decodeURIComponent(hash);
  }

  const segments = window.location.pathname.split("/").filter(Boolean);
  if (segments.length) {
    const lastSegment = decodeURIComponent(
      segments[segments.length - 1],
    ).toLowerCase();
    if (lastSegment) {
      return lastSegment.replace(/\.html?$/i, "");
    }
  }

  return DEFAULT_INVITATION.slug;
}

async function fetchInvitationPayload() {
  for (const source of INVITATION_DATA_SOURCES) {
    try {
      const response = await fetch(source, { cache: "no-store" });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Skip data source ${source}:`, error);
    }
  }

  throw new Error("Khong the tai du lieu invitations.json");
}

function resolveAssetPath(pathValue) {
  if (!pathValue || typeof pathValue !== "string") {
    return "";
  }

  if (
    /^(https?:)?\/\//i.test(pathValue) ||
    pathValue.startsWith("/") ||
    pathValue.startsWith("../") ||
    pathValue.startsWith("data:")
  ) {
    return pathValue;
  }

  if (pathValue.startsWith("img/") || pathValue.startsWith("music/")) {
    return `../${pathValue}`;
  }

  return pathValue;
}

async function loadInvitationData() {
  const slug = getInvitationSlug();

  try {
    const payload = await fetchInvitationPayload();
    const guests = payload.guests || {};
    const defaultKey = payload.defaultGuest || DEFAULT_INVITATION.slug;
    const selected = guests[slug] || guests[defaultKey];

    if (!selected) {
      console.warn(
        `Khong tim thay guest slug "${slug}", dung du lieu mac dinh.`,
      );
      return { ...DEFAULT_INVITATION, slug };
    }

    return { ...DEFAULT_INVITATION, ...selected, slug };
  } catch (error) {
    console.warn("Khong the tai du lieu JSON, dung du lieu mac dinh.", error);
    return { ...DEFAULT_INVITATION, slug: DEFAULT_INVITATION.slug };
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function applyInvitationData(invitation) {
  if (!invitation) {
    return;
  }

  if (DYNAMIC.avatar) {
    const avatarSource =
      resolveAssetPath(invitation.image) ||
      resolveAssetPath(DEFAULT_INVITATION.image);
    if (avatarSource) {
      DYNAMIC.avatar.src = avatarSource;
    }
    DYNAMIC.avatar.alt = `Ảnh đại diện ${invitation.name || "khách mời"}`;
  }

  if (DYNAMIC.name) {
    DYNAMIC.name.textContent = invitation.name || DEFAULT_INVITATION.name;
  }

  if (DYNAMIC.age) {
    DYNAMIC.age.textContent =
      invitation.age != null ? invitation.age : DEFAULT_INVITATION.age;
  }

  if (DYNAMIC.dateDisplay) {
    const dateText = invitation.dateDisplay || DEFAULT_INVITATION.dateDisplay;
    DYNAMIC.dateDisplay.textContent = dateText;
    const dateAttr = invitation.dateISO || DEFAULT_INVITATION.dateISO;
    if (dateAttr) {
      DYNAMIC.dateDisplay.setAttribute("datetime", dateAttr);
    }
  }

  if (DYNAMIC.timeRange) {
    DYNAMIC.timeRange.textContent = invitation.time || DEFAULT_INVITATION.time;
  }

  if (DYNAMIC.location) {
    const locationValue = invitation.location || DEFAULT_INVITATION.location;
    if (Array.isArray(locationValue)) {
      DYNAMIC.location.innerHTML = locationValue
        .map((line) => escapeHtml(line))
        .join("<br>");
    } else if (typeof locationValue === "string") {
      DYNAMIC.location.innerHTML = escapeHtml(locationValue).replace(
        /\n/g,
        "<br>",
      );
    }
  }

  if (DYNAMIC.mapLink) {
    const mapUrl = invitation.mapUrl || DEFAULT_INVITATION.mapUrl;
    if (mapUrl) {
      DYNAMIC.mapLink.href = mapUrl;
      DYNAMIC.mapLink.hidden = false;
    } else {
      DYNAMIC.mapLink.hidden = true;
    }
  }

  if (DYNAMIC.message) {
    DYNAMIC.message.textContent =
      invitation.message || DEFAULT_INVITATION.message;
  }
}

function updateMetaTags(invitation) {
  const guestName = invitation.name || DEFAULT_INVITATION.name;
  const fallbackTitle = `Thiệp mời tốt nghiệp của ${guestName}`;
  const title = invitation.metaTitle || fallbackTitle;
  const description =
    invitation.metaDescription || DEFAULT_INVITATION.metaDescription;

  document.title = title;

  const metaDefinitions = [
    ['meta[name="description"]', "content", description],
    ['meta[property="og:title"]', "content", title],
    ['meta[property="og:description"]', "content", description],
    [
      'meta[property="og:image"]',
      "content",
      resolveAssetPath(invitation.image) ||
        resolveAssetPath(DEFAULT_INVITATION.image),
    ],
  ];

  metaDefinitions.forEach(([selector, attribute, value]) => {
    const node = document.querySelector(selector);
    if (node && value) {
      node.setAttribute(attribute, value);
    }
  });
}

function resolveEventDate(invitation) {
  const candidates = [
    invitation.countdownDate,
    invitation.dateTime,
    invitation.dateISO,
  ];
  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    const parsed = new Date(candidate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date(DEFAULT_INVITATION.countdownDate);
}

// ===================================
// Initialize Application
// ===================================
async function init() {
  try {
    console.log("Initializing graduation invitation...");

    const invitation = await loadInvitationData();
    applyInvitationData(invitation);
    updateMetaTags(invitation);
    CONFIG.eventDate = resolveEventDate(invitation);

    // Core features
    initCanvas();
    createDOMParticles();
    initMusicPlayer();
    initCardFlip();
    initCountdown();

    // Enhancement features
    initMouseEffects();
    initTouchGestures();
    initKeyboardNavigation();
    initPerformanceOptimization();
    initAccessibility();

    console.log("Graduation invitation initialized successfully.");
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

// ===================================
// Start Application
// ===================================
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// ===================================
// Export for testing (optional)
// ===================================
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CONFIG,
    STATE,
    Particle,
    Confetti,
    createConfettiBurst,
  };
}
