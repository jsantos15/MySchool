const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

function setPage(pageId) {
  navButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });

  pages.forEach((page) => {
    page.classList.toggle('active', page.id === pageId);
  });
}

navButtons.forEach((btn) => {
  btn.addEventListener('click', () => setPage(btn.dataset.page));
});

setPage('dashboard');