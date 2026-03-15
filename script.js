const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon/";
let allPokemonDetails = [];
let currentCount = 0;
const BATCH_SIZE = 24;
let totalPokemonInApi = null;

async function init() {
  resetUI();
  toggleLoading(true);
  allPokemonDetails = [];
  currentCount = 0;
  await loadMore();
  toggleLoading(false);
}

function resetUI() {
  const searchInput = document.getElementById("pokemon-search");
  if (searchInput) searchInput.value = "";
  const loadMoreBtn = document.getElementById("load-more-btn");
  if (loadMoreBtn) loadMoreBtn.style.display = "block";
  document.getElementById("pokemon-container").innerHTML = "";
}

function getPokemonViewData(pokemon, index, color) {
  return {
    id: pokemon.id,
    displayId: String(pokemon.id).padStart(3, "0"),
    name: pokemon.name.toUpperCase(),
    image: pokemon.sprites.other["official-artwork"].front_default,
    color: color,
    index: index,
    weight: pokemon.weight / 10,
    height: pokemon.height / 10,
    types: mapTypes(pokemon.types),
    stats: mapStats(pokemon.stats),
  };
}

function mapTypes(types) {
  return types.map((t) => ({
    name: t.type.name,
    icon: `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t.type.name}.svg`,
  }));
}

function mapStats(stats) {
  return stats.map((s) => ({
    name: s.stat.name.toUpperCase(),
    value: s.base_stat,
    percent: Math.min((s.base_stat / 150) * 100, 100),
  }));
}

async function loadMore() {
  if (totalPokemonInApi && currentCount >= totalPokemonInApi) return;
  toggleLoading(true);
  if (totalPokemonInApi === null) await fetchTotalCount();

  const start = currentCount + 1;
  const end = Math.min(currentCount + BATCH_SIZE, totalPokemonInApi);
  await renderPokemonRange(start, end);

  currentCount = end;

  updateLoadMoreVisibility();
  toggleLoading(false);
}

async function fetchTotalCount() {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon-species/?limit=1"
  );
  const data = await response.json();
  totalPokemonInApi = data.count;
}

function updateLoadMoreVisibility() {
  const btn = document.getElementById("load-more-btn");
  if (btn && totalPokemonInApi !== null) {
    btn.style.display = currentCount >= totalPokemonInApi ? "none" : "block";
  }
}

async function renderPokemonRange(start, end) {
  const promises = [];
  for (let i = start; i <= end; i++) {
    promises.push(fetchAndPreparePokemon(i));
  }
  const newPokemonData = await Promise.all(promises);
  allPokemonDetails = [
    ...allPokemonDetails,
    ...newPokemonData.filter((p) => p !== null),
  ];
  allPokemonDetails.sort((a, b) => a.id - b.id);
  renderAllPokemon();
}

async function fetchAndPreparePokemon(id) {
  try {
    const response = await fetch(POKE_API_URL + id);
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Error fetching Pokemon " + id, error);
    return null;
  }
}

function renderAllPokemon() {
  const container = document.getElementById("pokemon-container");
  if (!container) return;
  container.innerHTML = allPokemonDetails
    .map((pokemon) => {
      const color = TYPE_COLORS[pokemon.types[0].type.name] || "#AAA";
      const data = getPokemonViewData(pokemon, null, color);
      return generatePokemonCardHTML(data);
    })
    .join("");
}

function renderSinglePokemon(pokemonData) {
  let container = document.getElementById("pokemon-container");
  let type = pokemonData.types[0].type.name;
  let color = TYPE_COLORS[type] || "#AAA";
  container.innerHTML += generatePokemonCardHTML(pokemonData, color);
}

function filterPokemon() {
  const term = document.getElementById("pokemon-search").value.toLowerCase().trim();
  const cards = Array.from(document.getElementsByClassName("pokemon-card"));
  
  if (term.length > 0 && term.length < 3) {
    showAllCards(cards);
    return;
  }
  applySearchFilter(cards, term);
}

function showAllCards(cards) {
  cards.forEach((c) => (c.style.display = "flex"));
  document.getElementById("load-more-btn").style.display = "block";
  renderNotFoundMessage(true);
}


function applySearchFilter(cards, term) {
  cards.forEach((card) => {
    const name = card.querySelector("h3").innerText.toLowerCase();
    card.style.display = name.includes(term) ? "flex" : "none";
  });

  const hasResults = cards.some((c) => c.style.display === "flex");
  const btn = document.getElementById("load-more-btn");

  if (btn) {
    btn.style.display = term === "" ? "block" : "none";
  }

  renderNotFoundMessage(hasResults);
}

function getFilteredList() {
  const term = document.getElementById("pokemon-search").value.toLowerCase().trim();
  return term.length >= 3 
    ? allPokemonDetails.filter(p => p.name.toLowerCase().includes(term))
    : allPokemonDetails;
}

function openPokemonDialog(pokemonId) {
  const currentList = getFilteredList();
  const pokemon = allPokemonDetails.find((p) => p.id === pokemonId);
  const index = currentList.indexOf(pokemon);
  const color = TYPE_COLORS[pokemon.types[0].type.name] || "#AAA";
  const data = getPokemonViewData(pokemon, index, color);

  setupDialogUI(data, currentList.length);
}

function setupDialogUI(data, listLength) {
  const dialog = document.getElementById("pokemon-details-dialog");
  applyDynamicColors(dialog, data.color);
  document.getElementById("dialog-content").innerHTML =
    generatePokemonDialogHTML(data);
  updateNavArrows(data.index, listLength);

  dialog.classList.add("is-visible");
  document.getElementById("dialog-overlay").classList.add("is-visible");
  document.body.style.overflow = "hidden";
}

function updateNavArrows(index, listLength) {
  setTimeout(() => {
    const prev = document.querySelector(".prev-arrow");
    const next = document.querySelector(".next-arrow");
    if (prev) prev.style.visibility = index === 0 ? "hidden" : "visible";
    if (next) next.style.visibility = index === listLength - 1 ? "hidden" : "visible";
  }, 50);
}

function navigatePokemon(newIndex) {
  const currentList = getFilteredList();
  if (newIndex >= 0 && newIndex < currentList.length) {
    openPokemonDialog(currentList[newIndex].id);
  }
}

function applyDynamicColors(dialog, color) {
  dialog.style.setProperty("--dynamic-type-color", color);
  dialog.style.setProperty("--dynamic-soft-color", color + "26");
}

function closePokemonDialog() {
  document.getElementById("pokemon-details-dialog").classList.remove("is-visible");
  document.getElementById("dialog-overlay").classList.remove("is-visible");
  document.body.style.overflow = "auto";
}

function toggleLoading(show) {
  const loader = document.getElementById("loading-overlay");
  if (loader) loader.style.display = show ? "flex" : "none";
}