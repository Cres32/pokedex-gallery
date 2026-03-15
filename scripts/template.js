function generatePokemonCardHTML(data) {
  const typesHtml = data.types
    .map(
      (type) => `
    <div class="type-button">
        <img src="${type.icon}" class="type-icon" alt="${type.name}">
        <span class="type-label">${type.name}</span>
    </div>`
    )
    .join("");

  return `
    <div class="pokemon-card" style="background-color: ${data.color}" onclick="openPokemonDialog(${data.id})">
        <div class="card-header"><span>#${data.displayId}</span><h3>${data.name}</h3></div>
        <div class="pokemon-img-container"><img src="${data.image}" class="pokemon-main-img"></div>
        <div class="type-container">${typesHtml}</div>
    </div>`;
}

function generatePokemonDialogHTML(data) {
  const statsHtml = data.stats.map((stat) => `
    <div class="stat-row">
        <span class="stat-name">${stat.name}</span>
        <div class="stat-bar-bg">
        <div class="stat-bar-fill" style="width: ${stat.percent}%"></div></div>
        <span class="stat-value">${stat.value}</span>
    </div>`
    )
    .join("");

  return `
    <div class="dialog-card">
        ${renderDialogHeader(data)}
        <div class="dialog-body">
            <div class="pokemon-info-row">
            <div class="info-pill">Weight: ${data.weight}kg | Height: ${data.height}m</div></div>
            <div class="stats-container">${statsHtml}</div>
        </div>
    </div>`;
}

function renderDialogHeader(data) {
  return `
    <div class="dialog-header" style="background-color: ${data.color}">
        <button class="close-btn" onclick="closePokemonDialog()">✕</button>
        <button class="nav-arrow prev-arrow" onclick="navigatePokemon(${data.index - 1})">❮</button>
        <button class="nav-arrow next-arrow" onclick="navigatePokemon(${data.index + 1})">❯</button>
        <img src="${data.image}" class="dialog-hero-img">
        <h2 class="dialog-title-bottom">${data.name}</h2>
    </div>`;
}

function renderNotFoundMessage(found) {
  const msgContainer = document.getElementById("not-found-container");
  if (!msgContainer) return;

  msgContainer.innerHTML = found? "": `
      <div style="text-align: center; padding: 40px; width: 100%;">
        <h2 style="color: #ff5350; margin-bottom: 10px;">Oops! No Pokémon matches.</h2>
        <p style="color: #666; font-size: 1.1rem;">Please check the spelling or try a different name!</p>
      </div>`;
}