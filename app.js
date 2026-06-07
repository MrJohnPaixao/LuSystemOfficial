/* ============================================================
   LU SYSTEM · Landing — interações
   Starfield (canvas) · energy curves · sticky nav ·
   scroll reveal · parallax · menu mobile
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Starfield canvas ---------- */
  (function starfield() {
    var cv = document.querySelector(".stars");
    if (!cv) return;
    var ctx = cv.getContext("2d");
    var stars = [];
    var meteors = [];
    var W = 0, H = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rafId = null;
    var nextMeteorAt = 0;

    function build() {
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      cv.style.width = W + "px";
      cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(260, Math.round((W * H) / 5400));
      stars = [];
      meteors = [];
      nextMeteorAt = 900 + Math.random() * 1400;
      for (var i = 0; i < count; i++) {
        var big = Math.random() < 0.16;
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: big ? 1.3 + Math.random() * 1.4 : 0.4 + Math.random() * 0.9,
          a: 0.25 + Math.random() * 0.6,
          tw: Math.random() < 0.45,
          ph: Math.random() * Math.PI * 2,
          sp: 0.6 + Math.random() * 1.2,
          c:
            Math.random() < 0.28
              ? "191,224,255"
              : Math.random() < 0.5
              ? "231,243,255"
              : "159,208,255"
        });
      }
    }

    function spawnMeteor(t) {
      var fromRight = Math.random() > 0.35;
      var length = 110 + Math.random() * 140;
      var speed = 11 + Math.random() * 8;
      meteors.push({
        x: fromRight ? W + length : Math.random() * W * 0.78,
        y: 20 + Math.random() * H * 0.52,
        vx: fromRight ? -speed : speed * 0.62,
        vy: speed * 0.34,
        len: length,
        life: 0,
        max: 54 + Math.random() * 26,
        hue: Math.random() > 0.42 ? "0,229,255" : "200,255,0"
      });
      nextMeteorAt = t + 1800 + Math.random() * 3600;
    }

    function drawMeteor(m) {
      var fade = Math.sin(Math.min(1, m.life / m.max) * Math.PI);
      var a = 0.16 + fade * 0.72;
      var angle = Math.atan2(m.vy, m.vx);
      var tx = Math.cos(angle) * m.len;
      var ty = Math.sin(angle) * m.len;
      var grad = ctx.createLinearGradient(m.x, m.y, m.x - tx, m.y - ty);
      grad.addColorStop(0, "rgba(255,255,255," + (a * 0.95).toFixed(3) + ")");
      grad.addColorStop(0.22, "rgba(" + m.hue + "," + a.toFixed(3) + ")");
      grad.addColorStop(1, "rgba(" + m.hue + ",0)");
      ctx.save();
      ctx.lineCap = "round";
      ctx.shadowColor = "rgba(" + m.hue + ",0.72)";
      ctx.shadowBlur = 12;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - tx, m.y - ty);
      ctx.stroke();
      ctx.restore();
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var a = s.a;
        if (s.tw) a *= 0.55 + 0.45 * Math.sin(t * 0.001 * s.sp + s.ph);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + s.c + "," + a.toFixed(3) + ")";
        if (s.r > 1.2) {
          ctx.shadowColor = "rgba(150,210,255,.6)";
          ctx.shadowBlur = s.r * 4;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      if (!reduceMotion) {
        if (t >= nextMeteorAt && meteors.length < 4) spawnMeteor(t);
        for (var j = meteors.length - 1; j >= 0; j--) {
          var m = meteors[j];
          m.x += m.vx;
          m.y += m.vy;
          m.life += 1;
          drawMeteor(m);
          if (m.life > m.max || m.x < -m.len || m.x > W + m.len || m.y > H + m.len) {
            meteors.splice(j, 1);
          }
        }
        rafId = requestAnimationFrame(draw);
      }
    }

    function start() {
      if (rafId) cancelAnimationFrame(rafId);
      if (reduceMotion) {
        draw(0);
        return;
      }
      draw(performance.now());
    }

    build();
    start();
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        build();
        start();
      }, 160);
    });
  })();

  /* ---------- Energy curves (echo of the logo) ---------- */
  (function energy() {
    var el = document.querySelector(".energy");
    if (!el) return;
    el.innerHTML =
      '<svg viewBox="0 0 600 480" preserveAspectRatio="none" style="width:100%;height:100%">' +
      '<defs><linearGradient id="ecHi" gradientUnits="userSpaceOnUse" x1="40" y1="430" x2="560" y2="60">' +
      '<stop offset="0" stop-color="#19b8b0"/><stop offset="0.5" stop-color="#7BFF6A"/>' +
      '<stop offset="0.8" stop-color="#C8FF00"/><stop offset="1" stop-color="#fff94a"/>' +
      "</linearGradient></defs>" +
      '<g fill="none" stroke-linecap="round">' +
      '<path d="M -30 300 Q 300 200 640 40" stroke="#1f5c66" stroke-width="2" opacity=".55"/>' +
      '<path d="M -30 345 Q 305 245 640 80" stroke="#1d525e" stroke-width="2" opacity=".5"/>' +
      '<path d="M -30 390 Q 310 288 642 122" stroke="#1a4854" stroke-width="2" opacity=".45"/>' +
      '<path d="M -30 435 Q 316 330 644 168" stroke="#184350" stroke-width="2" opacity=".4"/>' +
      '<path d="M -30 365 Q 308 262 640 100" stroke="url(#ecHi)" stroke-width="2.4" opacity=".85"/>' +
      "</g></svg>";
  })();

  /* ---------- Sticky nav state ---------- */
  (function stickyNav() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function onScroll() {
      if (window.scrollY > 30) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

  /* ---------- Mobile menu ---------- */
  (function mobileMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    function close() {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    }
    function open() {
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fechar menu");
    }
    toggle.addEventListener("click", function () {
      if (menu.hidden) open();
      else close();
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  })();

  /* ---------- Scroll reveal ---------- */
  (function scrollReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (reduceMotion) {
      els.forEach(function (el) {
        el.classList.add("in");
      });
      return;
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      els.forEach(function (el) {
        io.observe(el);
      });
    } else {
      els.forEach(function (el) {
        el.classList.add("in");
      });
    }
  })();

  /* ---------- Hero parallax (pointer + scroll) ---------- */
  (function parallax() {
    if (reduceMotion) return;
    var nodes = document.querySelectorAll("[data-parallax]");
    if (!nodes.length) return;
    var px = 0, py = 0, sy = 0;

    window.addEventListener(
      "pointermove",
      function (e) {
        var cx = window.innerWidth / 2;
        var cy = window.innerHeight / 2;
        px = (e.clientX - cx) / cx;
        py = (e.clientY - cy) / cy;
        apply();
      },
      { passive: true }
    );
    window.addEventListener(
      "scroll",
      function () {
        sy = window.scrollY;
        apply();
      },
      { passive: true }
    );

    function apply() {
      nodes.forEach(function (n) {
        var f = parseFloat(n.getAttribute("data-parallax")) || 0.04;
        var tx = px * f * 260;
        var ty = py * f * 200 - sy * f * 0.6;
        n.style.transform = "translate3d(" + tx + "px," + ty + "px,0)";
      });
    }
  })();

  /* ---------- Active nav link on scroll ---------- */
  (function activeNav() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll(".nav-desktop a")
    );
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (l) {
      var id = l.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = l;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) {
              l.style.color = "";
            });
            var active = map[en.target.id];
            if (active) active.style.color = "var(--lu-accent)";
          }
        });
      },
      { threshold: 0.5 }
    );
    Object.keys(map).forEach(function (id) {
      io.observe(document.getElementById(id));
    });
  })();
})();
