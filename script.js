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
console.log(weaknessMap);

const getRocketLeaderData = async (leader) => {
  // Replace ./data.json with your JSON feed
  await fetch(`./data/${leader}.txt`)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      // Work with JSON data here
      rawText = data;
      console.log(rawText);
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
