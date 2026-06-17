const tabData = {
  descoberta: {
    title: "Descoberta",
    text: "Plutão foi descoberto em 1930 por Clyde Tombaugh no Observatório Lowell, no Arizona. A descoberta veio após noites de comparação entre placas fotográficas: Tombaugh procurava um pequeno ponto que se movesse contra o fundo fixo das estrelas. Esse ponto revelou um mundo frio, distante e até então invisível aos telescópios comuns."
  },
  nono: {
    title: "Antigo nono planeta",
    text: "Por mais de 70 anos, Plutão foi ensinado como o nono planeta do Sistema Solar. Mesmo pequeno e distante, ele ganhou enorme presença cultural: aparecia em mapas escolares, livros de astronomia e no imaginário de gerações. Na época, ainda se sabia pouco sobre sua superfície, suas luas e a região gelada onde ele orbita."
  },
  "reclassificacao-tab": {
    title: "Reclassificação",
    text: "Em 24 de agosto de 2006, a União Astronômica Internacional reclassificou Plutão como planeta-anão. A decisão ocorreu porque Plutão não limpa a vizinhança de sua órbita, compartilhando sua região com muitos objetos do Cinturão de Kuiper. A mudança não apagou sua importância: ela mostrou que Plutão é parte de uma população maior de mundos gelados."
  },
  exploracao: {
    title: "Exploração",
    text: "Em 2015, a sonda New Horizons realizou o primeiro sobrevoo de Plutão. O que antes era apenas um ponto distante se tornou um mundo com montanhas de gelo, planícies congeladas, regiões coloridas e uma atmosfera delicada em camadas. A missão mudou completamente a percepção científica sobre corpos pequenos e distantes."
  },
  atualidade: {
    title: "Atualidade",
    text: "Hoje Plutão é um dos principais objetos estudados no Cinturão de Kuiper. Ele ajuda a explicar como mundos gelados evoluem, como atmosferas finas se comportam em órbitas extremas e como a região externa do Sistema Solar guarda materiais quase primordiais. Plutão deixou de ser apenas o antigo nono planeta e se tornou uma janela para a história profunda do nosso sistema."
  }
};

const menuToggle = document.querySelector(".menu-toggle");
const mainMenu = document.querySelector(".main-menu");
const menuLinks = [...document.querySelectorAll(".main-menu a")];
const revealItems = document.querySelectorAll(".reveal");
const canvas = document.getElementById("particle-canvas");
const context = canvas.getContext("2d");
let particles = [];
let width = 0;
let height = 0;
let animationFrame;

function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  mainMenu.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenu(!isOpen);
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    const content = tabData[button.dataset.tab];
    if (!content) return;

    document.querySelectorAll(".tab-button").forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-selected", "true");

    const title = document.getElementById("tab-title");
    const text = document.getElementById("tab-text");
    const panel = document.querySelector(".tab-content");

    panel.animate(
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 260, easing: "ease-out" }
    );

    title.textContent = content.title;
    text.textContent = content.text;
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sections = menuLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      menuLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => activeObserver.observe(section));

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const count = Math.min(130, Math.floor((width * height) / 9500));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.8 + 0.4,
    speed: Math.random() * 0.28 + 0.06,
    alpha: Math.random() * 0.62 + 0.18
  }));
}

function drawParticles() {
  context.clearRect(0, 0, width, height);

  particles.forEach((particle) => {
    particle.y += particle.speed;
    particle.x += Math.sin(particle.y * 0.008) * 0.08;

    if (particle.y > height + 8) {
      particle.y = -8;
      particle.x = Math.random() * width;
    }

    const gradient = context.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.radius * 4
    );

    gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.alpha})`);
    gradient.addColorStop(0.55, `rgba(88, 184, 255, ${particle.alpha * 0.32})`);
    gradient.addColorStop(1, "rgba(88, 184, 255, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
    context.fill();
  });

  animationFrame = requestAnimationFrame(drawParticles);
}

function applyParallax() {
  const scroll = window.scrollY;
  document.querySelectorAll("[data-parallax]").forEach((element) => {
    const speed = Number(element.dataset.parallax) || 0.04;
    element.style.transform = `translate3d(0, ${scroll * speed}px, 0)`;
  });
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    applyParallax();
    ticking = false;
  });
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawParticles();
applyParallax();

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationFrame);
});
