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
const strengthMap = new Map([
  ["Normal", [""]],
  ["Fire", ["Grass", "Ice", "Bug", "Steel"]],
  ["Water", ["Fire", "Ground", "Rock"]],
  ["Electric", ["Water", "Flying"]],
  ["Grass", ["Water", "Ground", "Rock"]],
  ["Ice", ["Grass", "Ground", "Flying", "Dragon"]],
  ["Fighting", ["Normal", "Ice", "Rock", "Dark", "Steel"]],
  ["Poison", ["Grass", "Fairy"]],
  ["Ground", ["Fire", "Electric", "Poison", "Rock", "Steel"]],
  ["Flying", ["Grass", "Fighting", "Bug"]],
  ["Psychic", ["Fighting", "Poison"]],
  ["Bug", ["Grass", "Psychic", "Dark"]],
  ["Rock", ["Fire", "Ice", "Flying", "Bug"]],
  ["Ghost", ["Psychic", "Ghost"]],
  ["Dragon", ["Dragon"]],
  ["Dark", ["Ghost", "Psychic"]],
  ["Steel", ["Ice", "Rock", "Fairy"]],
  ["Fairy", ["Fighting", "Dark", "Dragon"]],
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
          .replace("-galarian", "")
      );
    }
  }
};

let commonTypes = [];
const buildUI = (typeWrapper, types, index) => {
  let refinedTypes = new Set();
  for (const type of types) {
    if (index === 0) {
      for (const weakness of weaknessMap.get(type)) {
        refinedTypes.add(weakness);
      }
    } else {
      refinedTypes.add(type);
    }
  }
  if (index === 0)
    for (const type of types) {
      if (strengthMap.get(type)[0])
        for (const strength of strengthMap.get(type)) {
          refinedTypes.delete(strength);
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
