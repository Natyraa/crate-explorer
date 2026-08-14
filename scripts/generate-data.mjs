import { faker } from "@faker-js/faker";
import { writeFileSync } from "fs";

faker.seed(1998);

const GENRES = [
  "Jazz", "Soul", "Funk", "Disco", "Post-Punk", "Krautrock",
  "Ambient", "Hip-Hop", "Afrobeat", "Bossa Nova", "Synth-Pop", "Dub"
];
const CONDITIONS = ["Mint", "Near Mint", "Very Good+", "Very Good", "Good"];
const FORMATS = ["LP", "12\"", "7\"", "Double LP"];

const records = Array.from({ length: 12000 }).map((_, i) => {
  const year = faker.number.int({ min: 1958, max: 2024 });
  const stock = faker.number.int({ min: 0, max: 14 });
  return {
    id: `rec-${i + 1}`,
    catalog: `CR-${String(i + 1).padStart(5, "0")}`,
    artist: faker.person.lastName() + (faker.datatype.boolean() ? ` ${faker.person.firstName()}` : " Ensemble"),
    title: faker.music.songName ? faker.music.songName() : faker.lorem.words({ min: 2, max: 4 }),
    genre: faker.helpers.arrayElement(GENRES),
    year,
    format: faker.helpers.arrayElement(FORMATS),
    condition: faker.helpers.arrayElement(CONDITIONS),
    price: Number(faker.commerce.price({ min: 6, max: 145, dec: 2 })),
    stock,
  };
});

writeFileSync(
  new URL("../public/records.json", import.meta.url),
  JSON.stringify(records)
);

console.log(`Generated ${records.length} records -> public/records.json`);
