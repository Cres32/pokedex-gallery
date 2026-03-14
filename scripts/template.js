/*
function renderPokemonTypesHTML(types) {
  return types
    .map((typeInfo) => {
      let typeName = typeInfo.type.name;
      let typeIconUrl = `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${typeName}.svg`;

      return `
      <div class="type-button">
          <img src="${typeIconUrl}" class="type-icon" alt="${typeName}">
          <span class="type-label">${typeName}</span>
      </div>`;
    })
    .join("");
}


function generatePokemonCardHTML(pokemon, color) {
  let id = String(pokemon.id).padStart(3, "0");
  let img = pokemon.sprites.other["official-artwork"].front_default;
  let typesHtml = renderPokemonTypesHTML(pokemon.types);

  return `
        <div class="pokemon-card" style="background-color: ${color}" onclick="openPokemonDialog(${
    pokemon.id
  })">
            <div class="card-header"><span>#${id}</span><h3>${pokemon.name.toUpperCase()}</h3></div>
            <div class="pokemon-img-container"><img src="${img}" fetchpriority="high" loading="lazy" class="pokemon-main-img"></div>
            <div class="type-container">${typesHtml}</div>
        </div>`;
}


function renderPokemonStatsHTML(stats) {
  return stats
    .map(({ stat, base_stat }) => {
      const percentage = (base_stat / 150) * 100;
      return `
        <div class="stat-row">
            <span class="stat-name">${stat.name.toUpperCase()}</span>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill" style="width: ${percentage}%"></div>
            </div>
            <span class="stat-value">${base_stat}</span>
        </div>`;
    })
    .join("");
}


function generateDialogHeaderHTML(pokemon, index, color) {
    let artwork = pokemon.sprites.other["official-artwork"].front_default;
    return `
        <div class="dialog-header" style="background-color: ${color}">
            <button class="close-btn" onclick="closePokemonDialog()">✕</button>
            <button class="nav-arrow prev-arrow" onclick="navigatePokemon(${index - 1})">❮</button>
            <button class="nav-arrow next-arrow" onclick="navigatePokemon(${index + 1})">❯</button>
            <img src="${artwork}" class="dialog-hero-img">
            <h2 class="dialog-title-bottom">${pokemon.name.toUpperCase()}</h2>
        </div>`;
}


function generateDialogBodyHTML(pokemon) {
    let statsHtml = renderPokemonStatsHTML(pokemon.stats);
    return `
        <div class="dialog-body">
            <div class="pokemon-info-row">
              <div class="info-pill">
                  Weight: ${pokemon.weight / 10}kg | Height: ${pokemon.height / 10}m
              </div>
            </div>
            <div class="stats-container">${statsHtml}</div>
        </div>`;
}


function generatePokemonDialogHTML(pokemon, index, color) {
    let header = generateDialogHeaderHTML(pokemon, index, color);
    let body = generateDialogBodyHTML(pokemon);
    
    return `<div class="dialog-card">${header}${body}</div>`;
}


function renderNotFoundMessage(found) {
  const msgContainer = document.getElementById("not-found-container");
  if (!msgContainer) return;

  if (!found) {
    msgContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; width: 100%;">
        <h2 style="color: #ff5350; margin-bottom: 10px;">Oops! No Pokémon matches.</h2>
        <p style="color: #666; font-size: 1.1rem;">
          We couldn't find anything matching your search.<br>
          <strong>Please check the spelling or try a different name!</strong>
        </p>
      </div>`;
  } else {
    msgContainer.innerHTML = "";
  }
}
*/

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
  const statsHtml = data.stats
    .map(
      (stat) => `
    <div class="stat-row">
        <span class="stat-name">${stat.name}</span>
        <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${stat.percent}%"></div></div>
        <span class="stat-value">${stat.value}</span>
    </div>`
    )
    .join("");

  return `
    <div class="dialog-card">
        ${renderDialogHeader(data)}
        <div class="dialog-body">
            <div class="pokemon-info-row"><div class="info-pill">Weight: ${
              data.weight
            }kg | Height: ${data.height}m</div></div>
            <div class="stats-container">${statsHtml}</div>
        </div>
    </div>`;
}

function renderDialogHeader(data) {
  return `
    <div class="dialog-header" style="background-color: ${data.color}">
        <button class="close-btn" onclick="closePokemonDialog()">✕</button>
        <button class="nav-arrow prev-arrow" onclick="navigatePokemon(${
          data.index - 1
        })">❮</button>
        <button class="nav-arrow next-arrow" onclick="navigatePokemon(${
          data.index + 1
        })">❯</button>
        <img src="${data.image}" class="dialog-hero-img">
        <h2 class="dialog-title-bottom">${data.name}</h2>
    </div>`;
}