// scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => io.observe(el));

// cursor-follow glow on cards
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

// subtle parallax on aurora orbs, mouse-driven
const orbs = document.querySelectorAll('.orb');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  window.addEventListener('pointermove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 6;
      orb.style.translate = `${x * depth}px ${y * depth}px`;
    });
  }, { passive: true });
}

// project detail modal
const PROJECTS = {
  watchlist: {
    index: '01',
    tag: 'živě', tagClass: 'tag-live',
    stack: 'React · Supabase',
    title: 'Watchlist',
    desc: 'Sleduju v ní filmy, seriály a anime na jednom místě — hodnocení, rozepsané a dokoukané seznamy, přátelé a doporučení podle společného vkusu. Postavené na Reactu a Supabase, nasazené na Vercelu.',
    features: [
      'Filmy, seriály i anime v jednom seznamu',
      'Hodnocení a poznámky u každé položky',
      'Přátelé a doporučení podle společného vkusu',
      'Plakáty a metadata přímo z TMDB',
      'Vlastní banner na profilu',
    ],
    updates: [
      { date: '26. 8. 2026', text: 'Patička s odkazem na Gamelist a autora' },
      { date: '22. 8. 2026', text: 'Nová záložka Doporučené — tituly podle vkusu' },
      { date: '22. 8. 2026', text: 'Filtr podle typu (film/anime/seriál) u přátel' },
    ],
    live: 'https://wwatchlist.vercel.app',
    github: 'https://github.com/qves34/watchlist',
  },
  gamelist: {
    index: '02',
    tag: 'živě', tagClass: 'tag-live',
    stack: 'React · RAWG',
    title: 'Gamelist',
    desc: 'Herní obdoba Watchlistu — rozehrané, dohrané a vysněné hry, metadata z RAWG.io, sdílené s přáteli přes stejný účet. Stejná architektura jako Watchlist, jen pro hry.',
    features: [
      'Rozehrané, dohrané i vysněné hry',
      'Obálky a metadata z RAWG.io',
      'Sdílený účet s Watchlistem — stejní přátelé, stejný profil',
      'Doporučené hry na míru',
    ],
    updates: [
      { date: '27. 8. 2026', text: 'Opravený banner — nepřesahuje přes hlavičku' },
      { date: '27. 8. 2026', text: 'Postranní banner teď sdílený s Watchlistem' },
      { date: '26. 8. 2026', text: 'Doporučené hry podle žánru' },
    ],
    live: 'https://ggamelist.vercel.app',
    github: 'https://github.com/qves34/gamelist',
  },
  mercenary: {
    index: '03',
    tag: 've vývoji', tagClass: 'tag-dev',
    stack: 'Godot 4 · GDScript',
    title: 'Mercenary',
    desc: 'Voxelová taktická střílečka s vlastním story módem — mise, dialogy i zbraně psané od nuly v GDScriptu, bez pluginů. Zatím jen zdrojový kód, žádný hratelný live build.',
    features: [
      'Voxelová grafika s vlastním pixelovým shadingem',
      'Mercenary mód — volný výběr mapy, zbraně a operátora',
      'Story mód se 4 misemi a dialogy mezi postavami',
      'Vše psané od nuly, žádné pluginy ani addony',
    ],
    updates: [
      { date: '1. 9. 2026', text: 'Endless mód, žebříček skóre, hudba a zvuky' },
      { date: '30. 8. 2026', text: 'Story mód — první mise a dialogy' },
      { date: '29. 8. 2026', text: 'Nová mapa (sklep), výsledky mise, modely zbraní' },
    ],
    live: null,
    github: 'https://github.com/qves34/mercenary',
  },
};

const modal = document.getElementById('project-modal');
const modalPanel = modal.querySelector('.modal-panel');

function linkButton(href, label, primary) {
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.className = primary ? 'btn btn-primary' : 'btn btn-ghost';
  a.textContent = label;
  return a;
}

function openProject(id) {
  const data = PROJECTS[id];
  if (!data) return;

  modal.querySelector('[data-field="index"]').textContent = data.index;
  const tagEl = modal.querySelector('[data-field="tag"]');
  tagEl.textContent = data.tag;
  tagEl.className = `tag ${data.tagClass}`;
  modal.querySelector('[data-field="stack"]').textContent = data.stack;
  modal.querySelector('[data-field="title"]').textContent = data.title;
  modal.querySelector('[data-field="desc"]').textContent = data.desc;

  const features = modal.querySelector('[data-field="features"]');
  features.innerHTML = '';
  data.features.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    features.appendChild(li);
  });

  const updates = modal.querySelector('[data-field="updates"]');
  updates.innerHTML = '';
  data.updates.forEach(({ date, text }) => {
    const li = document.createElement('li');
    const time = document.createElement('span');
    time.className = 'update-date';
    time.textContent = date;
    li.appendChild(time);
    li.append(text);
    updates.appendChild(li);
  });

  const actions = modal.querySelector('[data-field="actions"]');
  actions.innerHTML = '';
  if (data.live) actions.appendChild(linkButton(data.live, 'Otevřít appku', true));
  actions.appendChild(linkButton(data.github, 'GitHub', !data.live));

  modal.querySelector('.modal-panel').scrollTop = 0;
  modal.showModal();
}

document.querySelectorAll('.card[data-project]').forEach((card) => {
  card.addEventListener('click', () => openProject(card.dataset.project));
});

modal.querySelector('.modal-close').addEventListener('click', () => modal.close());

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.close();
});
