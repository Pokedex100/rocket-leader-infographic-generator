const weaknessMap = new Map([
  ["Normal", ["Fighting"]],
  ["Fighting", ["Flying", "Psychic", "Fairy"]],
  ["Flying", ["Rock", "Electric", "Ice"]],
  ["Poison", ["Ground", "Psychic"]],
  ["Ground", ["Water", "Grass", "Ice"]],
  ["Rock", ["Fighting", "Ground", "Steel", "Water", "Grass"]],
  ["Bug", ["Flying", "Rock", "Fire"]],
  ["Ghost", ["Ghost", "Dark"]],
  ["Steel", ["Fighting", "Ground", "Fire"]],
  ["Fire", ["Ground", "Rock", "Water"]],
  ["Water", ["Grass", "Electric"]],
  ["Grass", ["Flying", "Poison", "Bug", "Fire", "Ice"]],
  ["Electric", ["Ground"]],
  ["Psychic", ["Bug", "Ghost", "Dark"]],
  ["Ice", ["Fighting", "Rock", "Steel", "Fire"]],
  ["Dragon", ["Ice", "Dragon", "Fairy"]],
  ["Dark", ["Fighting", "Bug", "Fairy"]],
  ["Fairy", ["Poison", "Steel"]],
]);

const pokemonTypes = [
  "grass",
  "fire",
  "water",
  "electric",
  "ground",
  "ice",
  "rock",
  "steel",
  "fighting",
  "psychic",
  "ghost",
  "dark",
  "fairy",
  "poison",
  "bug",
  "flying",
  "dragon",
  "normal",
];
const typeChart = {
  bug: { fighting: 0.5, grass: 0.5, ground: 0.5, fire: 2, flying: 2, rock: 2 },
  dark: { dark: 0.5, ghost: 0.5, psychic: 0.5, bug: 2, fairy: 2, fighting: 2 },
  dragon: {
    electric: 0.5,
    fire: 0.5,
    grass: 0.5,
    water: 0.5,
    dragon: 2,
    fairy: 2,
    ice: 2,
  },
  electric: { electric: 0.5, flying: 0.5, steel: 0.5, ground: 2 },
  fairy: {
    bug: 0.5,
    dark: 0.5,
    dragon: 0.5,
    fighting: 0.5,
    poison: 2,
    steel: 2,
  },
  fighting: { bug: 0.5, dark: 0.5, rock: 0.5, fairy: 2, flying: 2, psychic: 2 },
  fire: {
    bug: 0.5,
    fire: 0.5,
    grass: 0.5,
    ice: 0.5,
    steel: 0.5,
    ground: 2,
    rock: 2,
    water: 2,
  },
  flying: {
    bug: 0.5,
    fighting: 0.5,
    grass: 0.5,
    ground: 0.5,
    electric: 2,
    ice: 2,
    rock: 2,
  },
  ghost: {
    bug: 0.5,
    fighting: 0.5,
    normal: 0.5,
    poison: 0.5,
    dark: 2,
    ghost: 2,
  },
  grass: {
    electric: 0.5,
    grass: 0.5,
    ground: 0.5,
    water: 0.5,
    bug: 2,
    fire: 2,
    flying: 2,
    ice: 2,
    poison: 2,
  },
  ground: { electric: 0.5, poison: 0.5, rock: 0.5, grass: 2, ice: 2, water: 2 },
  ice: { ice: 0.5, fighting: 2, fire: 2, rock: 2, steel: 2 },
  normal: { ghost: 0.5, fighting: 2 },
  poison: {
    fairy: 0.5,
    fighting: 0.5,
    grass: 0.5,
    poison: 0.5,
    bug: 0.5,
    ground: 2,
    psychic: 2,
  },
  psychic: { fighting: 0.5, psychic: 0.5, bug: 2, dark: 2, ghost: 2 },
  rock: {
    fire: 0.5,
    flying: 0.5,
    normal: 0.5,
    poison: 0.5,
    fighting: 2,
    grass: 2,
    ground: 2,
    steel: 2,
    water: 2,
  },
  steel: {
    bug: 0.5,
    dragon: 0.5,
    fairy: 0.5,
    flying: 0.5,
    grass: 0.5,
    ice: 0.5,
    poison: 0.5,
    psychic: 0.5,
    rock: 0.5,
    steel: 0.5,
    fighting: 2,
    fire: 2,
    ground: 2,
  },
  water: { fire: 0.5, ice: 0.5, steel: 0.5, water: 0.5, electric: 2, grass: 2 },
};

const getWeaknessTypes = (types) => {
  const weaknesses = {};
  for (const type of types) {
    if (type === undefined) continue;

    const typeMultipliers = typeChart[type.toLowerCase()] || {};
    for (const otherType in typeMultipliers) {
      if (!weaknesses[otherType]) weaknesses[otherType] = 1;

      weaknesses[otherType] *= typeMultipliers[otherType];
    }
  }

  const sortedWeaknesses = Object.entries(weaknesses)
    .sort(([, a], [, b]) => b - a)
    .filter(([, value]) => value > 1)
    .map(([type]) => type);
  console.log(sortedWeaknesses);
  return sortedWeaknesses;
};

const getRocketLeaderData = async (leader, format = ".txt") => {
  // Replace ./data.json with your JSON feed
  await fetch(`./data/${leader + format}`)
    .then((response) => {
      return format === ".txt" ? response.text() : response.json();
    })
    .then((data) => {
      // Work with JSON data here
      format === ".txt" ? buildSlots(data.replace(/,/g, "")) : buildTypes(data);
    })
    .catch((err) => {
      console.log(err);
      // Do something for an error here
    });
};
getRocketLeaderData("arlo");
getRocketLeaderData("cliff");
getRocketLeaderData("sierra");
getRocketLeaderData("giovanni");
getRocketLeaderData("pokedex", ".json");

let allSlots = [];
let leaderNames = [];
const buildSlots = (data) => {
  let slots = [];
  const refinedData = data.split(/[\n\r\ ]/g);
  const images = document.querySelectorAll(
    `.${refinedData[0].toLowerCase()} img`
  );
  for (const datum of refinedData.slice(1)) {
    if (datum === "" || datum === "-") continue;
    slots.push(datum.replace(/[:]/g, "").replace("shiny", ""));
  }
  slots.map((slot, index) => {
    images[
      index
    ].src = `https://img.pokemondb.net/sprites/home/normal/${slot.toLowerCase()}.png`;
  });
  leaderNames.push(refinedData[0].toLowerCase());
  allSlots.push(slots);
};

const buildTypes = (pokedex) => {
  let i = 0;
  for (let slots of allSlots) {
    buildTypesForSingleGroup(slots, pokedex, leaderNames[i]);
    i++;
  }
};

const buildTypesForSingleGroup = (group, pokedex, leaderName) => {
  let typeWrappers = document.querySelectorAll(
    `.${leaderName} .disc-container`
  );
  for (let i = 0; i < group.length; i += 4) {
    fragmentTypesForSingleGroup(
      group.slice(i, i + 4),
      pokedex,
      [...typeWrappers].slice(i, i + 4)
    );
  }
};

const fragmentTypesForSingleGroup = (group, pokedex, typeWrappers) => {
  for (let i = 0; i < 4; i++) {
    try {
      let types = pokedex.find((dex) => {
        if (
          group[i]
            .toLowerCase()
            .replace("-f", "♀")
            .replace("-origin", "")
            .replace("-mega", "")
            .replace("-standard", "")
            .replace("-sky", "")
            .replace("-galarian", "") === dex.name.english.toLowerCase()
        )
          return dex;
      }).type;
      buildUI(typeWrappers[i], types, i);
    } catch {
      console.log(
        group[i]
          .replace("-f", "♀")
          .replace("-origin", "")
          .replace("-mega", "")
          .replace("-standard", "")
          .replace("-sky", "")
          .replace("-galarian", "")
      );
    }
  }
};

let commonTypes = [];
const buildUI = (typeWrapper, types, index) => {
  let refinedTypes = new Set();
  if (index === 0) {
    refinedTypes = getWeaknessTypes(types);
  } else {
    for (const type of types) {
      refinedTypes.add(type.toLowerCase());
    }
  }
  refinedTypes = [...refinedTypes];
  if (index === 0) {
    commonTypes = refinedTypes.slice();
  } else {
    if (refinedTypes.find((type) => commonTypes.join("").includes(type)))
      refinedTypes = refinedTypes.filter((type) =>
        commonTypes.join("").includes(type)
      );
  }
  if (index === 3) {
    commonTypes = [];
  }
  refinedTypes = refinedTypes.sort(
    (a, b) =>
      pokemonTypes.indexOf(a.toLowerCase()) -
      pokemonTypes.indexOf(b.toLowerCase())
  );
  for (const type of refinedTypes) {
    let img = document.createElement("img");
    img.src = `./icons/${type.toLowerCase()}.svg`;
    img.classList.add(type.toLowerCase());
    img.classList.add("type-disc");
    typeWrapper.appendChild(img);
  }

  addListeners();
};

const addListeners = () => {
  document.querySelectorAll(".type-disc").forEach((disc) => {
    disc.addEventListener("click", () => {
      disc.remove();
    });
  });
};
