const stories = {
  descoberta: {
    year: "1930",
    title: "Descoberta",
    text: "Plutão foi descoberto por Clyde Tombaugh no Observatório Lowell, no Arizona. Ele comparava placas fotográficas em busca de um ponto que se movesse contra o fundo das estrelas. Esse trabalho paciente revelou um corpo distante, frio e quase invisível aos telescópios da época."
  },
  nono: {
    year: "1930-2006",
    title: "O antigo nono planeta",
    text: "Durante mais de 70 anos, Plutão foi apresentado como o nono planeta do Sistema Solar. Mesmo pequeno e distante, ele ganhou enorme força cultural, aparecendo em livros escolares, mapas astronômicos e no imaginário de gerações inteiras."
  },
  reclassificacao: {
    year: "2006",
    title: "A nova classificação",
    text: "Em 24 de agosto de 2006, a União Astronômica Internacional reclassificou Plutão como planeta-anão. A decisão ocorreu porque ele não limpa a vizinhança de sua órbita, compartilhando o Cinturão de Kuiper com muitos outros mundos gelados."
  },
  exploracao: {
    year: "2015",
    title: "Exploração direta",
    text: "A New Horizons realizou o primeiro sobrevoo de Plutão em 2015. A missão transformou um ponto distante em paisagem: montanhas de gelo, planícies claras, névoas atmosféricas e sinais de geologia ativa apareceram em detalhes inéditos."
  },
  atualidade: {
    year: "Hoje",
    title: "Objeto-chave do Cinturão de Kuiper",
    text: "Hoje Plutão é estudado como uma janela para a história externa do Sistema Solar. Ele ajuda a explicar como pequenos mundos gelados evoluem, como atmosferas tênues se comportam e como materiais antigos foram preservados longe do Sol."
  }
};

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav-links");
const navLinks = [...document.querySelectorAll(".nav-links a")];

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  setMenu(!isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    const story = stories[button.dataset.tab];
    if (!story) return;

    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");

    const card = document.querySelector(".story-card");
    document.getElementById("story-year").textContent = story.year;
    document.getElementById("story-title").textContent = story.title;
    document.getElementById("story-text").textContent = story.text;

    card.animate(
      [
        { opacity: 0.2, transform: "translateY(12px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 260, easing: "ease-out" }
    );
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
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { threshold: 0.42 }
);

sections.forEach((section) => activeObserver.observe(section));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
