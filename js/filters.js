/**
 * CYBERPULSE ARENA - Filters & Dynamic Interactions
 * Prices tab filter, Games catalog live search & genre filter, Tournaments tab switch
 * O'zbek tilida / Uzbek Language
 */

document.addEventListener('DOMContentLoaded', () => {
  initPriceFilters();
  initGameFilters();
  initTournamentTabs();
  initContactFeedback();
});

/**
 * 1. Narxlarni zonalar bo'yicha saralash (prices.html)
 */
function initPriceFilters() {
  const filterBtns = document.querySelectorAll('.price-filter-btn');
  const priceCards = document.querySelectorAll('.price-card');

  if (!filterBtns.length || !priceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetZone = btn.getAttribute('data-zone');

      priceCards.forEach(card => {
        const cardZones = card.getAttribute('data-zone') || '';
        if (targetZone === 'all' || cardZones.includes(targetZone)) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            if (!cardZones.includes(targetZone) && targetZone !== 'all') {
              card.style.display = 'none';
            }
          }, 200);
        }
      });
    });
  });
}

/**
 * 2. O'yinlar qidiruvi va janrlar bo'yicha filter (games.html)
 */
function initGameFilters() {
  const searchInput = document.getElementById('gameSearchInput');
  const genreBtns = document.querySelectorAll('.genre-filter-btn');
  const gameCards = document.querySelectorAll('.game-card');

  if (!gameCards.length) return;

  let currentGenre = 'all';
  let searchQuery = '';

  function filterGames() {
    let visibleCount = 0;

    gameCards.forEach(card => {
      const cardTitle = (card.getAttribute('data-title') || '').toLowerCase();
      const cardGenre = card.getAttribute('data-genre') || '';

      const matchesGenre = (currentGenre === 'all' || cardGenre === currentGenre);
      const matchesSearch = cardTitle.includes(searchQuery.toLowerCase());

      if (matchesGenre && matchesSearch) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });

    const noResultsMsg = document.getElementById('noGamesFound');
    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (genreBtns.length) {
    genreBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        genreBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentGenre = btn.getAttribute('data-genre');
        filterGames();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      filterGames();
    });
  }
}

/**
 * 3. Turnirlar ko'rinishini almashtirish (tournaments.html)
 */
function initTournamentTabs() {
  const tourneyTabs = document.querySelectorAll('.tourney-tab-btn');
  const tourneySections = document.querySelectorAll('.tourney-tab-content');

  if (!tourneyTabs.length || !tourneySections.length) return;

  tourneyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tourneyTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-target');

      tourneySections.forEach(sec => {
        if (sec.id === targetId) {
          sec.style.display = 'block';
        } else {
          sec.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 4. Qayta aloqa formasi (contact.html)
 */
function initContactFeedback() {
  const contactForm = document.getElementById('contactFeedbackForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName');
    const msg = document.getElementById('contactMessage');

    if (!name.value.trim() || !msg.value.trim()) {
      showToast('Xatolik', 'Iltimos, ismingiz va xabar matnini kiriting', 'error');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Yuborilmoqda...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      contactForm.reset();
      showToast('Xabar yuborildi', 'Ma\'muriyatimiz 10 daqiqa ichida siz bilan bog\'lanadi.', 'success');
    }, 900);
  });
}
