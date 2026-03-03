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
            <div class="pokemon-img-container"><img src="${img}" class="pokemon-main-img"></div>
            <div class="type-container">${typesHtml}</div>
        </div>`;
}


function renderPokemonStatsHTML(stats) {
  return stats
    .map((statInfo) => {
      let name = statInfo.stat.name;
      let value = statInfo.base_stat;
      let percentage = (value / 150) * 100;

      return `
            <div class="stat-row">
                <span class="stat-name">${name.toUpperCase()}</span>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="stat-value">${value}</span>
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


function renderNotFoundMessage (found) {
  const container = document.getElementById("pokemon-container");
  const existingMsg = document.getElementById("not-found-msg");

  if (!found) {
    
    if (!existingMsg) {
      container.innerHTML += generateNotFoundHTML();
    }
  } else if (existingMsg) {
  
    existingMsg.remove();
  }
}


function generateNotFoundHTML() {
  return `
        <div id="not-found-msg">
            <div class="not-found-content">
                <p>No Pokémon found with that name!</p>
                <img src="./assets/logo/pokeball_2X.png" class="error-image" style="width:100px;">
            </div>
        </div>`;
}