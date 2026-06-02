"use strict";

/* ==========================================
   script.js
   MD Naahe Uddin Laskar — Portfolio
========================================== */

/* ========== 1. PARTICLE CANVAS ========== */
(function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const COLORS = ["0,229,255", "139,92,246", "245,158,11"];

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(initial) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : -4;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.r = Math.random() * 1.4 + 0.3;
      this.op = Math.random() * 0.35 + 0.05;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (
        this.x < -5 ||
        this.x > canvas.width + 5 ||
        this.y < -5 ||
        this.y > canvas.height + 5
      ) {
        this.reset(false);
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.op})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 130 }, () => new Particle());

  function drawLines() {
    const DIST = 95;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,229,255,${0.05 * (1 - d / DIST)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ========== 2. CURSOR GLOW ========== */
(function initCursor() {
  const glow = document.getElementById("cursorGlow");
  if (!glow) return;
  document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
})();

/* ========== 3. TYPED TEXT EFFECT ========== */
(function initTyped() {
  const el = document.getElementById("typedText");
  if (!el) return;

  const phrases = [
    "Software Engineer",
    "AI / ML Researcher",
    "Web Developer",
    "Competitive Programmer",
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const TYPING_SPEED = 70;
  const DELETING_SPEED = 38;
  const PAUSE_END = 1800;
  const PAUSE_START = 350;

  function tick() {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    } else {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, DELETING_SPEED);
    }
  }
  setTimeout(tick, 1200);
})();

/* ========== 4. SCROLL REVEAL ========== */
(function initScrollReveal() {
  const items = document.querySelectorAll(".scroll-reveal");
  if (!items.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  items.forEach((el, i) => {
    el.style.transitionDelay = (i % 5) * 0.08 + "s";
    obs.observe(el);
  });
})();

/* ========== 5. ACTIVE NAV LINK ON SCROLL ========== */
(function initActiveNav() {
  const links = document.querySelectorAll(".nav-links a[data-nav]");
  const sections = document.querySelectorAll("section[id]");
  if (!links.length) return;

  function update() {
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

/* ========== 6. PROJECT FILTER ========== */
(function initFilter() {
  const btns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".proj-card");
  if (!btns.length) return;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const cat = card.dataset.cat;
        const visible = filter === "all" || cat === filter;

        if (visible) {
          card.style.display = "flex";
          // featured card spans two columns when "all" is selected on wide screens
          if (
            card.classList.contains("proj-featured") &&
            filter === "all" &&
            window.innerWidth > 1100
          ) {
            card.style.gridColumn = "span 2";
          } else {
            card.style.gridColumn = "";
          }
          // trigger re-reveal animation
          card.classList.remove("visible");
          setTimeout(() => card.classList.add("visible"), 50);
        } else {
          card.style.display = "none";
        }
      });
    });
  });
})();

/* ========== 7. MOBILE DRAWER ========== */
function toggleDrawer() {
  const drawer = document.getElementById("mobileDrawer");
  if (!drawer) return;
  drawer.classList.toggle("open");
}

function closeDrawer() {
  const drawer = document.getElementById("mobileDrawer");
  if (drawer) drawer.classList.remove("open");
}

(function initHamburger() {
  const btn = document.getElementById("hamburger");
  if (btn) btn.addEventListener("click", toggleDrawer);
})();

/* ========== 8. MOUSE PARALLAX ON 3D SCENE ========== */
(function initParallax() {
  const scene = document.getElementById("scene3d");
  if (!scene) return;

  document.addEventListener("mousemove", (e) => {
    const rx = (e.clientY / window.innerHeight - 0.5) * 14;
    const ry = (e.clientX / window.innerWidth - 0.5) * 14;
    scene.style.transform = `rotateX(${-rx}deg) rotateY(${ry}deg)`;
  });
})();

/* ========== 9. NAVBAR BACKGROUND SCROLL ========== */
(function initNavBg() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  function update() {
    nav.style.background =
      window.scrollY > 40 ? "rgba(4,6,15,0.92)" : "rgba(4,6,15,0.65)";
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

/* ========== 10. SMOOTH ANCHOR SCROLL ========== */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById("navbar").offsetHeight + 8;
    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: "smooth",
    });
  });
});
