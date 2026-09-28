// Stage reveal (once) — IntersectionObserver, never scroll listeners.
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    io.unobserve(e.target);
    const price = e.target.querySelector("[data-round]");
    if (price) tickUp(price);
  }),
  { rootMargin: "0px 0px -15% 0px" },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Round-up tick: $23.15 counts up to $24.00, then settles as the "before" price.
function tickUp(el) {
  const from = Number(el.dataset.round);
  const to = Math.ceil(from);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const steps = 10;
  let i = 0;
  const id = setInterval(() => {
    i++;
    el.textContent = "$" + (from + ((to - from) * i) / steps).toFixed(2);
    if (i >= steps) {
      clearInterval(id);
      setTimeout(() => (el.textContent = "$" + from.toFixed(2)), 500);
    }
  }, 45);
}

// Waitlist forms: concept only — validate, show inline success, send nothing.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
document.querySelectorAll("[data-waitlist]").forEach((form) => {
  const input = form.querySelector("input");
  const btn = form.querySelector("button");
  const msg = form.querySelector(".cta-form__msg");
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") === "true" && EMAIL.test(input.value.trim())) {
      input.removeAttribute("aria-invalid");
      msg.textContent = "";
      delete msg.dataset.state;
    }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!EMAIL.test(input.value.trim())) {
      input.setAttribute("aria-invalid", "true");
      msg.dataset.state = "error";
      msg.textContent = "That email doesn't look right. Check for a typo?";
      input.focus();
      return;
    }
    btn.setAttribute("aria-busy", "true");
    btn.disabled = true;
    setTimeout(() => {
      btn.removeAttribute("aria-busy");
      btn.disabled = false;
      input.value = "";
      msg.dataset.state = "success";
      msg.textContent = "You're on the list. (Concept demo: nothing was sent.)";
    }, 500);
  });
});
