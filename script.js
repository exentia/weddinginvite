/* ==========================================================================
   Afreen & Aftab — Wedding Invitation
   All wedding details live in weddingConfig below. Replace placeholder
   values freely — nothing else in this file needs to change.
   ========================================================================== */

const weddingConfig = {
  brideName: "Afreen Shaikh",
  groomName: "Aftab Turk",
  brideParents: "Mr. & Mrs. Shaikh",
  groomParents: "Mr. & Mrs. Shaikh",

  // The Nikah is the main ceremony: it drives the countdown, the Save-the-Date
  // scroll, the closing date, and its own dedicated spotlight section — it is
  // intentionally not one of the swipeable cards in `events` below.
  nikah: {
    id: "nikah",
    title: "Nikah",
    date: "2026-12-18",
    startTime: "19:00",
    endTime: "21:00",
    venue: "Seasons 24",
    address: "Banquet hall TVCC city centre 9th floor above Croma show room Dhanori Pune-411015, Maharashtra",
    mapsUrl: "https://maps.app.goo.gl/E2gMSjTNXPto4pGb6",
    description: "With the blessings of Allah SWT and our beloved families, we invite you to witness our Nikah."
  },

  // Swipeable pre-wedding festivities carousel.
  events: [
    {
      id: "mehndi",
      title: "Mehndi",
      date: "2026-12-16",
      startTime: "19:00",
      endTime: "23:00",
      venue: "Family Residence",
      address: "Haa Meem Residency",
      mapsUrl: "https://maps.google.com/?q=Haa+Meem",
      description: "An evening of henna, music, and joyful beginnings with family and friends.",
      theme: "mehndi",
      dressCode: { label: "Vibrant Festive Colours", color: "#496934" }
    },
    {
      id: "haldi",
      title: "Haldi",
      date: "2026-12-17",
      startTime: "19:00",
      endTime: "23:00",
      venue: "Haldi Venue",
      address: "Haa Meem Residency",
      mapsUrl: "https://maps.google.com/?q=Haa+Meem",
      description: "A joyful turmeric ceremony blessing the couple with warmth and good fortune ahead of their big day.",
      theme: "haldi",
      dressCode: { label: "Sunshine Yellow & Marigold", color: "#D9A441" }
    }
  ],

  backgroundMusic: "audio.mp3" // e.g. "assets/nasheed.mp3" — music control stays hidden while empty
};

const nikahEvent = weddingConfig.nikah;

function lastWord(str) {
  const parts = str.trim().split(/\s+/);
  return parts[parts.length - 1];
}

/* ==========================================================================
   Background music
   ========================================================================== */

function initMusic() {
  const toggle = document.getElementById("musicToggle");
  const audio = document.getElementById("bgMusic");

  if (!weddingConfig.backgroundMusic) return;

  audio.src = weddingConfig.backgroundMusic;
  toggle.hidden = false;

  toggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.volume = audio.volume || 0.55;
      audio.play().catch(() => {});
      toggle.classList.add("is-playing");
    } else {
      audio.pause();
      toggle.classList.remove("is-playing");
    }
  });
}

function fadeInMusic() {
  if (!weddingConfig.backgroundMusic) return;
  const audio = document.getElementById("bgMusic");
  audio.volume = 0;
  audio.play().then(() => {
    document.getElementById("musicToggle").classList.add("is-playing");
    const target = 0.55;
    const steps = 20;
    let i = 0;
    const ramp = setInterval(() => {
      i += 1;
      audio.volume = Math.min(target, (target * i) / steps);
      if (i >= steps) clearInterval(ramp);
    }, 100);
  }).catch(() => {});
}

/* ==========================================================================
   Loader — waits for fonts and music (with a safety cap)
   ========================================================================== */

function initLoader() {
  const loader = document.getElementById("loader");
  const audio = document.getElementById("bgMusic");

  const tasks = [document.fonts ? document.fonts.ready : Promise.resolve()];

  if (weddingConfig.backgroundMusic) {
    tasks.push(
      new Promise((resolve) => {
        audio.addEventListener("canplaythrough", resolve, { once: true });
        audio.addEventListener("error", resolve, { once: true });
        audio.load();
        setTimeout(resolve, 4000); // never block the invitation on a slow/broken track
      })
    );
  }

  const safety = new Promise((resolve) => setTimeout(resolve, 6000));

  Promise.race([Promise.all(tasks), safety]).then(() => {
    loader.classList.add("is-hidden");
  });
}

/* ==========================================================================
   Scroll-driven parallax (corner roses + hanging garlands)
   ========================================================================== */

function initSceneParallax() {
  let ticking = false;

  function update() {
    const y = window.scrollY;
    document.documentElement.style.setProperty("--parallax-y", `${Math.min(y * 0.05, 40)}px`);
    document.documentElement.style.setProperty("--sway-deg", `${Math.sin(y / 140) * 4}deg`);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
}

/* ==========================================================================
   Pause decorative animations while their section is off-screen
   ========================================================================== */

function initPauseOffscreenAnimations() {
  const targets = document.querySelectorAll("[data-observe-anim]");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("in-view", entry.isIntersecting));
    },
    { threshold: 0.1 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   1. Opening — 3D Book
   ========================================================================== */

function initBook() {
  document.getElementById("bookBride").textContent = weddingConfig.brideName;
  document.getElementById("bookGroom").textContent = weddingConfig.groomName;

  const book = document.getElementById("book");
  const hint = document.getElementById("bookHint");
  const invitationBody = document.getElementById("invitationBody");
  const chapterEl = document.getElementById("bookChapterText");
  const bookStage = document.getElementById("book-stage");

  splitLetters(chapterEl, "A new chapter begins…");
  const chapterLetters = chapterEl.querySelectorAll(".letter");

  function openBook() {
    if (book.classList.contains("is-open")) return;
    book.classList.add("is-open");
    hint.classList.add("is-hidden");
    fadeInMusic();

    // let the cover finish swinging open, then type out the chapter line on the page beneath it
    const typeStartDelay = 700;
    const typeDuration = chapterLetters.length * 45 + 500;
    const readPause = 900;

    setTimeout(() => {
      chapterLetters.forEach((letter) => letter.classList.add("is-in"));
    }, typeStartDelay);

    // once it's been read, reveal the rest of the invitation and scroll to it
    const scrollSettleTime = 700; // roughly how long the smooth scroll takes to finish
    setTimeout(() => {
      invitationBody.hidden = false;
      requestAnimationFrame(() => {
        invitationBody.classList.add("is-open");
        invitationBody.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      // the book stage is a one-time intro — drop it from the page once we've scrolled away,
      // then snap straight back to re-align the viewport (removing its height shifts the scroll)
      setTimeout(() => {
        bookStage.style.display = "none";
        invitationBody.scrollIntoView({ block: "start" });
      }, scrollSettleTime);
    }, typeStartDelay + typeDuration + readPause);
  }

  book.addEventListener("click", openBook);
  book.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openBook();
    }
  });
}

/* ==========================================================================
   Floating petals (reused for the book stage)
   ========================================================================== */

function initPetals() {
  const field = document.getElementById("petalField");
  if (!field) return;
  const count = window.innerWidth < 640 ? 10 : 16;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    const size = 6 + Math.random() * 8;
    petal.style.setProperty("--size", `${size}px`);
    petal.style.setProperty("--dur", `${11 + Math.random() * 9}s`);
    petal.style.setProperty("--delay", `${Math.random() * 12}s`);
    petal.style.setProperty("--drift", `${(Math.random() - 0.5) * 120}px`);
    petal.style.left = `${Math.random() * 100}%`;
    field.appendChild(petal);
  }
}

/* ==========================================================================
   2. First Page — letter-by-letter typed names
   ========================================================================== */

function splitLetters(container, text) {
  container.innerHTML = "";
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "letter" + (ch === " " ? " is-space" : "");
    span.textContent = ch === " " ? " " : ch;
    span.style.transitionDelay = `${i * 45}ms`;
    container.appendChild(span);
  });
}

function initTypedNames() {
  const groomEl = document.getElementById("typedGroom");
  const brideEl = document.getElementById("typedBride");

  splitLetters(groomEl, weddingConfig.groomName);
  splitLetters(brideEl, weddingConfig.brideName);

  document.getElementById("groomParentsLine").textContent = `Son of ${weddingConfig.groomParents}`;
  document.getElementById("brideParentsLine").textContent = `Daughter of ${weddingConfig.brideParents}`;

  const firstPage = document.getElementById("first-page");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          groomEl.querySelectorAll(".letter").forEach((l) => l.classList.add("is-in"));
          brideEl.querySelectorAll(".letter").forEach((l) => l.classList.add("is-in"));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(firstPage);
}

/* ==========================================================================
   Dates + names used across several sections
   ========================================================================== */

function formatLongDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatTime12h(time24) {
  return new Date(`2000-01-01T${time24}:00`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatTimeRange(startTime, endTime) {
  return `${formatTime12h(startTime)} – ${formatTime12h(endTime)}`;
}

function initDatesAndNames() {
  document.getElementById("closingBride").textContent = weddingConfig.brideName;
  document.getElementById("closingGroom").textContent = weddingConfig.groomName;
  document.getElementById("closingFamilies").textContent =
    `The ${lastWord(weddingConfig.brideParents)} & ${lastWord(weddingConfig.groomParents)} Families`;
  document.getElementById("scrollDateText").textContent = formatLongDate(nikahEvent.date);
}

/* ==========================================================================
   4. Save the Date — pull to reveal
   ========================================================================== */

function burstConfetti(container) {
  const burst = document.createElement("div");
  burst.className = "confetti-burst";
  const colors = ["var(--gold)", "var(--gold-light)", "var(--sage)", "var(--emerald-600)"];

  for (let i = 0; i < 18; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.setProperty("--piece-color", colors[i % colors.length]);
    const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.4;
    const dist = 50 + Math.random() * 50;
    piece.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
    piece.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
    burst.appendChild(piece);
  }

  container.appendChild(burst);
  setTimeout(() => burst.remove(), 1000);
}

function initSaveDate() {
  const scrollPaper = document.getElementById("scrollPaper");
  const scrollTassel = document.getElementById("scrollTassel");
  const countdownLine = document.getElementById("countdownLine");
  const saveDateSection = document.getElementById("save-date");
  let revealed = false;

  function reveal() {
    if (revealed) return;
    revealed = true;
    scrollPaper.classList.add("is-revealed");
    burstConfetti(saveDateSection);
    countdownLine.classList.add("is-visible");
  }

  scrollTassel.addEventListener("click", reveal);

  let dragStartY = null;
  scrollTassel.addEventListener("pointerdown", (e) => { dragStartY = e.clientY; });
  scrollTassel.addEventListener("pointermove", (e) => {
    if (dragStartY === null || revealed) return;
    const delta = Math.max(0, Math.min(e.clientY - dragStartY, 40));
    scrollTassel.style.transform = `translateY(${delta}px)`;
  });

  function endDrag(e) {
    if (dragStartY === null) return;
    const delta = e.clientY - dragStartY;
    scrollTassel.style.transform = "";
    dragStartY = null;
    if (delta > 24) reveal();
  }
  scrollTassel.addEventListener("pointerup", endDrag);
  scrollTassel.addEventListener("pointercancel", endDrag);

  document.getElementById("addToCalendarDate").addEventListener("click", () => openGoogleCalendar(nikahEvent));
}

/* ==========================================================================
   Countdown
   ========================================================================== */

function initCountdown() {
  const target = new Date(`${nikahEvent.date}T${nikahEvent.startTime}:00`);
  const els = {
    days: document.getElementById("cdDays"),
    hours: document.getElementById("cdHours"),
    minutes: document.getElementById("cdMinutes"),
    seconds: document.getElementById("cdSeconds")
  };
  const line = document.getElementById("countdownLine");
  const message = document.getElementById("countdownMessage");

  function tick() {
    const diff = target.getTime() - Date.now();

    if (diff <= 0) {
      line.hidden = true;
      message.hidden = false;
      clearInterval(timer);
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    els.days.textContent = String(days).padStart(2, "0");
    els.hours.textContent = String(hours).padStart(2, "0");
    els.minutes.textContent = String(minutes).padStart(2, "0");
    els.seconds.textContent = String(seconds).padStart(2, "0");
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* ==========================================================================
   5 & 6. Reusable 3D swipeable carousel
   ========================================================================== */

function createCarousel3D(track, dotsWrap, items, renderSlide) {
  const n = items.length;
  let active = 0;
  let dragged = false;
  let startX = null;
  let startY = null;

  function wrappedOffset(i) {
    let raw = (((i - active) % n) + n) % n;
    if (raw > n / 2) raw -= n;
    return raw;
  }

  function render() {
    slideEls.forEach((el, i) => {
      const offset = wrappedOffset(i);
      el.style.setProperty("--offset", offset);
      el.style.setProperty("--dist", Math.abs(offset));
    });
    dotEls.forEach((d, i) => d.classList.toggle("is-active", i === active));
  }

  function goTo(i) {
    active = ((i % n) + n) % n;
    render();
  }

  const slideEls = items.map((item, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "carousel3d-slide";
    wrapper.appendChild(renderSlide(item, i));
    wrapper.addEventListener("click", () => { if (!dragged) goTo(i); });
    track.appendChild(wrapper);
    return wrapper;
  });

  const dotEls = items.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel3d-dot";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  track.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
    dragged = false;
  });
  track.addEventListener("pointermove", (e) => {
    if (startX === null) return;
    if (Math.abs(e.clientX - startX) > 10) dragged = true;
  });
  track.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      goTo(active + (dx < 0 ? 1 : -1));
    }
    startX = null;
    startY = null;
  });

  render();
  return { goTo };
}

const eventIconRef = { mehndi: "#icon-henna", haldi: "#icon-rose" };

function buildEventSlide(evt) {
  const el = document.createElement("div");
  el.className = "event-card";
  el.dataset.theme = evt.theme;
  el.innerHTML = `
    <svg class="event-card-icon"><use href="${eventIconRef[evt.theme] || "#icon-sparkle"}"></use></svg>
    <p class="event-card-datetime">${formatLongDate(evt.date)} &middot; ${formatTimeRange(evt.startTime, evt.endTime)}</p>
    <h3 class="event-card-name">${evt.title}</h3>
    <p class="event-card-venue">${evt.venue}</p>
    <span class="event-card-dresscode">
      <span class="event-card-swatch" style="--swatch-color:${evt.dressCode.color}"></span>
      ${evt.dressCode.label}
    </span>
  `;
  return el;
}

function initFestivities() {
  const track = document.getElementById("festivitiesTrack");
  const dots = document.getElementById("festivitiesDots");
  createCarousel3D(track, dots, weddingConfig.events, buildEventSlide);
}

/* ==========================================================================
   7. Nikah spotlight (the section markup/CSS still uses "reception" names —
      it's the same deep-emerald showcase card, just repurposed for Nikah)
   ========================================================================== */

function initReception() {
  document.getElementById("receptionTitle").textContent = nikahEvent.title;
  document.getElementById("receptionDate").textContent =
    `${formatLongDate(nikahEvent.date)} · ${formatTime12h(nikahEvent.startTime)}`;
  document.getElementById("receptionVenue").textContent = `${nikahEvent.venue}, ${nikahEvent.address}`;
  document.getElementById("receptionAddToCalendar").addEventListener("click", () => openGoogleCalendar(nikahEvent));

  const blooms = document.querySelectorAll("[data-bloom]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-bloomed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  blooms.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   8. Location
   ========================================================================== */

function fallbackCopy(text) {
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) resolve(); else reject(new Error("execCommand copy failed"));
    } catch (err) {
      document.body.removeChild(ta);
      reject(err);
    }
  });
}

function copyText(text) {
  if (!navigator.clipboard || !navigator.clipboard.writeText) return fallbackCopy(text);

  const clipboardWrite = navigator.clipboard.writeText(text);
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("clipboard timeout")), 800));

  return Promise.race([clipboardWrite, timeout]).catch(() => fallbackCopy(text));
}

function initLocation() {
  document.getElementById("mapVenue").textContent = nikahEvent.venue;
  document.getElementById("mapAddress").textContent = nikahEvent.address;
  document.getElementById("getDirections").href = nikahEvent.mapsUrl;

  const mapCard = document.getElementById("mapCard");
  const openMaps = () => window.open(nikahEvent.mapsUrl, "_blank", "noopener");
  mapCard.addEventListener("click", openMaps);
  mapCard.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMaps();
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-drawn");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  observer.observe(mapCard);

  const copyBtn = document.getElementById("copyAddress");
  const toast = document.getElementById("copyToast");
  let toastTimer;
  copyBtn.addEventListener("click", () => {
    copyText(nikahEvent.address).then(() => {
      toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
    }).catch(() => {});
  });
}

/* ==========================================================================
   Calendar — opens Google Calendar's event-creation page, pre-filled,
   shared by every "Add to Calendar" button
   ========================================================================== */

function pad(n) { return String(n).padStart(2, "0"); }

function toGCalDate(date) {
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) + "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) + "Z"
  );
}

function buildGoogleCalendarUrl(event) {
  const start = new Date(`${event.date}T${event.startTime}:00`);
  const end = new Date(`${event.date}T${event.endTime}:00`);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} — ${weddingConfig.brideName} & ${weddingConfig.groomName}`,
    dates: `${toGCalDate(start)}/${toGCalDate(end)}`,
    details: event.description,
    location: event.address
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function openGoogleCalendar(event) {
  window.open(buildGoogleCalendarUrl(event), "_blank", "noopener");
}

/* ==========================================================================
   Generic scroll reveal
   ========================================================================== */

function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
  );
  targets.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   Init
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMusic();
  initLoader();
  initBook();
  initPetals();
  initTypedNames();
  initDatesAndNames();
  initSaveDate();
  initCountdown();
  initFestivities();
  initReception();
  initLocation();
  initScrollReveal();
  initSceneParallax();
  initPauseOffscreenAnimations();
});
