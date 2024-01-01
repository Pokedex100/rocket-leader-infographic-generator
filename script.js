let weaknessMap = new Map([
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
  ["Fairy", "Poison", "Steel"],
]);

const getRocketLeaderData = async (leader, format = ".txt") => {
  // Replace ./data.json with your JSON feed
  await fetch(`./data/${leader + format}`)
    .then((response) => {
      return format === ".txt" ? response.text() : response.json();
    })
    .then((data) => {
      // Work with JSON data here
      format === ".txt" ? buildSlots(data) : buildTypes(data);
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
  console.log(leaderName);
  for (let i = 0; i < group.length; i += 4) {
    fragmentTypesForSingleGroup(group.slice(i, i + 4), pokedex);
  }
};

const fragmentTypesForSingleGroup = (group, pokedex) => {
  console.log(group);
};
