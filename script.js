const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon/";
let allPokemonDetails = [];
let currentCount = 0;
const BATCH_SIZE = 24;
let totalPokemonInApi = null;


async function init() {
  toggleLoading(true);
  let container = document.getElementById("pokemon-container");
  container.innerHTML = "";
  allPokemonDetails = [];
  currentCount = 0;
  await loadMore();
  toggleLoading(false);
}


async function loadMore() {
  if (totalPokemonInApi && currentCount >= totalPokemonInApi) return;
  toggleLoading(true);

  if (totalPokemonInApi === null) await fetchTotalCount();

  const start = currentCount + 1;
  const end = Math.min(currentCount + BATCH_SIZE, totalPokemonInApi);

  await renderPokemonRange(start, end);

  currentCount = end;
  if (currentCount >= totalPokemonInApi)
    document.getElementById("load-more-btn").style.display = "none";
  toggleLoading(false);
}


async function fetchTotalCount() {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon-species/?limit=1"
  );
  const data = await response.json();
  totalPokemonInApi = data.count;
}


async function renderPokemonRange(start, end) {
  for (let i = start; i <= end; i++) {
    await fetchAndRenderPokemon(i);
  }
}


async function fetchAndRenderPokemon(id) {
  try {
    let response = await fetch(POKE_API_URL + id);
    let pokemonData = await response.json();
    allPokemonDetails.push(pokemonData);
    renderSinglePokemon(pokemonData);
  } catch (error) {
    console.error("Error loading Pokemon", error);
  }
}

function renderSinglePokemon(pokemonData) {
  let container = document.getElementById("pokemon-container");
  let type = pokemonData.types[0].type.name;
  let color = TYPE_COLORS[type] || "#AAA";
  container.innerHTML += generatePokemonCardHTML(pokemonData, color);
}


function filterPokemon() {
  const searchTerm = document
    .getElementById("pokemon-search")
    .value.toLowerCase();
  const cards = Array.from(document.getElementsByClassName("pokemon-card"));
  const isShort = searchTerm.length > 0 && searchTerm.length < 3;

  cards.forEach((card) => {
    const name = card.querySelector("h3").innerText.toLowerCase();
    // If it's short, show it. If not, filter by name.
    card.style.display = isShort || name.includes(searchTerm) ? "flex" : "none";
  });

  const foundAny = cards.some((card) => card.style.display === "flex");
  renderNotFoundMessage(foundAny);
}


function openPokemonDialog(pokemonId) {
  let pokemon = allPokemonDetails.find((p) => p.id === pokemonId);
  if (!pokemon) return;

  let index = allPokemonDetails.indexOf(pokemon);
  let type = pokemon.types[0].type.name;
  let color = TYPE_COLORS[type] || "#AAA";
  let dialog = document.getElementById("pokemon-details-dialog");

  applyDynamicColors(dialog, color);
  document.getElementById("dialog-content").innerHTML =
    generatePokemonDialogHTML(pokemon, index, color);

  dialog.classList.add("is-visible");
  document.getElementById("dialog-overlay").classList.add("is-visible");
  document.body.style.overflow = "hidden";
}

function applyDynamicColors(dialog, color) {
  let softColor = color + "26"; 
  dialog.style.setProperty("--dynamic-type-color", color);
  dialog.style.setProperty("--dynamic-soft-color", softColor);
}

function closePokemonDialog() {
  let dialog = document.getElementById("pokemon-details-dialog");
  let overlay = document.getElementById("dialog-overlay");

  dialog.classList.remove("is-visible");
  overlay.classList.remove("is-visible");
  document.body.style.overflow = "auto";
}

function navigatePokemon(newIndex) {
  if (newIndex >= 0 && newIndex < allPokemonDetails.length) {
    let nextId = allPokemonDetails[newIndex].id;
    openPokemonDialog(nextId);
  }
}

function toggleLoading(show) {
  let loader = document.getElementById("loading-overlay");
  if (loader) {
    loader.style.display = show ? "flex" : "none";
  }
}
