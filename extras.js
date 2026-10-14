// Optional details stay useful without JavaScript; controls appear when ready.
const projectFilters = [...document.querySelectorAll('[data-project-filter]')];
const projects = [...document.querySelectorAll('[data-project-category]')];
if (projects.length && projectFilters.length) {
  document.getElementById('project-toolbar').hidden = false;
  projectFilters.forEach((button) => button.addEventListener('click', () => {
    const category = button.dataset.projectFilter;
    let count = 0;
    projects.forEach((project) => {
      const visible = category === 'all' || project.dataset.projectCategory === category;
      project.hidden = !visible;
      if (visible) count += 1;
    });
    projectFilters.forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
    document.getElementById('project-count').textContent = `${count} project${count === 1 ? '' : 's'}`;
  }));
}

const articles = [...document.querySelectorAll('[data-article]')];
const saveButtons = [...document.querySelectorAll('[data-save-article]')];
const readingFilters = [...document.querySelectorAll('[data-reading-filter]')];
const storageKey = 'zentex-saved-articles';
const allowedIds = new Set(articles.map((article) => article.dataset.article));
let saved = new Set();
let onlySaved = false;
let persistent = true;
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(stored)) saved = new Set(stored.filter((id) => allowedIds.has(id)));
} catch { /* A corrupt or unavailable store starts with an empty reading list. */ }

function updateReadingList() {
  const focusedArticle = document.activeElement?.closest("[data-article]");
  const emptyState = document.getElementById('reading-empty');
  const focusedEmptyState = emptyState?.contains(document.activeElement);
  let visible = 0;
  articles.forEach((article) => {
    article.hidden = onlySaved && !saved.has(article.dataset.article);
    if (!article.hidden) visible += 1;
  });
  saveButtons.forEach((button) => {
    const selected = saved.has(button.dataset.saveArticle);
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', selected
      ? `Remove ${button.dataset.articleTitle} from saved articles`
      : `Save ${button.dataset.articleTitle} for later`);
    button.title = selected ? 'Remove from saved' : 'Save for later';
  });
  readingFilters.forEach((button) => {
    button.setAttribute('aria-pressed', String((button.dataset.readingFilter === 'saved') === onlySaved));
  });
  document.getElementById('saved-count').textContent = String(saved.size);
  emptyState.hidden = visible > 0;
  if (focusedArticle?.hidden || (focusedEmptyState && emptyState.hidden)) {
    readingFilters.find((filter) => filter.dataset.readingFilter === (onlySaved ? 'saved' : 'all'))?.focus();
  }
  document.getElementById('reading-help').textContent = saved.size
    ? persistent ? 'Saved on this device.' : 'Saved for this visit.'
    : 'Save a piece for later.';
}

if (articles.length && readingFilters.length) {
  document.getElementById('reading-toolbar').hidden = false;
  saveButtons.forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', () => {
      const id = button.dataset.saveArticle;
      const wasSaved = saved.has(id);
      if (wasSaved) saved.delete(id);
      else saved.add(id);
      try {
        localStorage.setItem(storageKey, JSON.stringify([...saved]));
        persistent = true;
      } catch { persistent = false; }
      updateReadingList();
      document.getElementById('reading-status').textContent = wasSaved
        ? `${button.dataset.articleTitle} removed from saved articles.`
        : `${button.dataset.articleTitle} saved ${persistent ? 'on this device' : 'for this visit'}.`;
    });
  });
  readingFilters.forEach((button) => button.addEventListener('click', () => {
    onlySaved = button.dataset.readingFilter === 'saved';
    updateReadingList();
  }));
  document.querySelectorAll('[data-reading-reset]').forEach((button) => button.addEventListener('click', () => {
    onlySaved = false;
    updateReadingList();
    readingFilters.find((filter) => filter.dataset.readingFilter === 'all')?.focus();
  }));
  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    try {
      const values = JSON.parse(event.newValue || '[]');
      saved = new Set(Array.isArray(values) ? values.filter((id) => allowedIds.has(id)) : []);
      updateReadingList();
    } catch { /* Keep the current list if another tab writes invalid data. */ }
  });
  updateReadingList();
}

const localTime = document.getElementById('local-time');
if (localTime) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  });
  function updateClock() {
    const now = new Date();
    localTime.dateTime = now.toISOString();
    localTime.textContent = formatter.format(now);
    localTime.setAttribute('aria-label', `${formatter.format(now)}, local time in Kashmir`);
    localTime.hidden = false;
  }
  updateClock();
  setInterval(() => { if (!document.hidden) updateClock(); }, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateClock(); });
}
