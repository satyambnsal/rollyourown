import {
  Bronx,
  Brooklyn,
  CentralPark,
  ConeyIsland,
  Manhattan,
  Queens,
} from "@/components/icons/locations";

import {
  Acid,
  Cocaine,
  Heroin,
  Ludes,
  Speed,
  Weed,
} from "@/components/icons/drugs";

import { getCopResponses, getMuggerResponses } from "@/responses";
import {
  DrugInfo,
  Drugs,
  EncounterOutcomes,
  Encounters,
  EncountersAction,
  ItemSlot,
  LocationInfo,
  Locations,
  OutcomeInfo
} from "./types";

import { Cigarette } from "@/components/icons";
import {
  AK47,
  BaseballBat,
  Kevlar,
  Leatherjacket,
  PlasticBag,
  Shirt,
  Shoes
} from "@/components/icons/items";
import { Chain } from "@/components/icons/items/Chain";


export const itemUpgrades = {
  [ItemSlot.Weapon]: {
    0: {
      1:"Extended Mag",
      2:"Recoil Compensator",
      3:"Laser Sight",
    }, 
    1: {
      1:"Tactical Grip",
      2:"Reinforced Links",
      3:"Spiked End",
    },
    2: {
      1:"Grip Tape",
      2:"Corked Bat",
      3:"Aluminum Bat",
    }
  },
  [ItemSlot.Clothes]:  {
    0: {
      1:"Reinforced Stitching",
      2:"Polyester Blend",
      3:"More Blood",
    }, 
    1: {
      1:"Shoulder Straps",
      2:"Thermal Ventilation",
      3:"Ceramic Plate Inserts",
    },
    2: {
      1:"Tailor Fitting",
      2:"Treated Leather",
      3:"Ballistic Inserts",
    }
  },
  [ItemSlot.Feet]: {
    0: {
      1:"Fresh Laces",
      2:"Ventilated Mesh",
      3:"Memory Foam Insoles",
    }, 
    1: {
      1:"Quick-Lace System",
      2:"Anti-Slip Outsoles",
      3:"Memory Foam Insoles",
    },
    2: {
      1:"Locking Laces",
      2:"Shock-Absorbing Insoles",
      3:"Steel-toed Cap",
    }
  },
  [ItemSlot.Transport]:  {
    0: {
      1:"Fanny Pack",
      2:"Backpack",
      3:"Duffle Bag",
    }
  },
}

export const statName = {
  [ItemSlot.Weapon]: "ATK",
  [ItemSlot.Clothes]: "DEF",
  [ItemSlot.Feet]: "SPD",
  [ItemSlot.Transport]: "INV",
}
export type statNameKeys = keyof typeof statName;


export const locationIcons = {
  "Queens": Queens,
  "Bronx": Bronx,
  "Brooklyn": Brooklyn,
  "Jersey": Manhattan,
  "Central": CentralPark,
  "Coney": ConeyIsland,
}
export type locationIconsKeys = keyof typeof locationIcons;

export const drugIcons = {
  "Ludes": Ludes,
  "Speed": Speed,
  "Weed": Weed,
  "Acid": Acid,
  "Heroin": Heroin,
  "Cocaine": Cocaine,
}
export type drugIconsKeys = keyof typeof drugIcons;

export const itemIcons = {
  "Naked": Cigarette,
  //
  "AK47": AK47,
  "Chain": Chain,
  "Baseball Bat": BaseballBat,
  //
  "Blood-Stained Shirt": Shirt,
  "Bullet Proof Vest": Kevlar,
  "Trench Coat": Leatherjacket,
  //
  "All-Black Sneakers": Shoes,
  "Athletic Trainers": Shoes,
  "Work Boots": Shoes,
  //
  "Plastic bag": PlasticBag,
}
export type itemsIconsKeys = keyof typeof itemIcons;


export const locations: LocationInfo[] = [
  {
    type: Locations.Queens,
    name: "Queens",
    slug: "queens",
    id: "Queens",
    icon: Queens,
  },
  {
    type: Locations.Bronx,
    name: "The Bronx",
    slug: "bronx",
    id: "Bronx",
    icon: Bronx,
  },
  {
    type: Locations.Brooklyn,
    name: "Brooklyn",
    slug: "brooklyn",
    id: "Brooklyn",
    icon: Brooklyn,
  },
  {
    type: Locations.Jersey,
    name: "Jersey City",
    slug: "jersey",
    id: "Jersey",
    icon: Manhattan,
  },
  {
    type: Locations.Central,
    name: "Central Park",
    slug: "central",
    id: "Central",
    icon: CentralPark,
  },
  {
    type: Locations.Coney,
    name: "Coney Island",
    slug: "coney",
    id: "Coney",
    icon: ConeyIsland,
  },
];

const drugs: DrugInfo[] = [
  {
    type: Drugs.Ludes,
    name: "Ludes",
    slug: "ludes",
    id: "Ludes",
    icon: Ludes,
  },
  {
    type: Drugs.Speed,
    name: "Speed",
    slug: "speed",
    id: "Speed",
    icon: Speed,
  },
  {
    type: Drugs.Weed,
    name: "Weed",
    slug: "weed",
    id: "Weed",
    icon: Weed,
  },
  {
    type: Drugs.Acid,
    name: "Acid",
    slug: "acid",
    id: "Acid",
    icon: Acid,
  },
  {
    type: Drugs.Heroin,
    name: "Heroin",
    slug: "heroin",
    id: "Heroin",
    icon: Heroin,
  },
  {
    type: Drugs.Cocaine,
    name: "Cocaine",
    slug: "cocaine",
    id: "Cocaine",
    icon: Cocaine,
  },
];

export const outcomes: OutcomeInfo[] = [
  {
    title: "You",
    name: "Paid the Cop",
    type: EncounterOutcomes.Paid,
    encounter: Encounters.Cops,
    imageSrc: "/images/events/paid.png",
    description: "You paid the cop off",
    getResponse: (isInitial: boolean) =>
      getCopResponses(EncounterOutcomes.Paid, isInitial),
    color: "yellow.400",
  },
  {
    title: "You",
    name: "Paid the Gang",
    type: EncounterOutcomes.Paid,
    encounter: Encounters.Gang,
    imageSrc: "/images/events/paid.png",
    description: "You paid the gang off",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(EncounterOutcomes.Paid, isInitial),
    color: "neon.200",
  },
  {
    title: "You",
    name: "Escaped",
    type: EncounterOutcomes.Escaped,
    encounter: Encounters.Cops,
    imageSrc: "/images/events/escaped.png",
    getResponse: (isInitial: boolean) =>
      getCopResponses(EncounterOutcomes.Escaped, isInitial),
    description: "You fled to a random location",
    color: "neon.200",
  },
  {
    title: "You",
    name: "Escaped",
    type: EncounterOutcomes.Escaped,
    encounter: Encounters.Gang,
    imageSrc: "/images/events/escaped.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(EncounterOutcomes.Escaped, isInitial),
    description: "You fled to a random location",
    color: "neon.200",
  },
  {
    title: "You",
    name: "Got killed by the Cops",
    type: EncounterOutcomes.Died,
    encounter: Encounters.Cops,
    imageSrc: "/images/events/fought.png",
    getResponse: (isInitial: boolean) =>
      getCopResponses(EncounterOutcomes.Died, isInitial),
    color: "red",
  },
  {
    title: "You",
    name: "Got killed by the Gang",
    type: EncounterOutcomes.Died,
    encounter: Encounters.Gang,
    imageSrc: "/images/events/fought.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(EncounterOutcomes.Died, isInitial),
    color: "red",
  },
  {
    title: "You are",
    name: "Victorious!",
    type: EncounterOutcomes.Victorious,
    encounter: Encounters.Cops,
    imageSrc: "/images/events/victorious.png",
    getResponse: (isInitial: boolean) =>
      getCopResponses(EncounterOutcomes.Victorious, isInitial),
    color: "neon.200",
  },
  {
    title: "You are",
    name: "Victorious!",
    type: EncounterOutcomes.Victorious,
    encounter: Encounters.Gang,
    imageSrc: "/images/events/victorious.png",
    getResponse: (isInitial: boolean) =>
      getMuggerResponses(EncounterOutcomes.Victorious, isInitial),
    color: "neon.200",
  },

];


// function findBy<T>(array: T[], key: keyof T, value: any): T | undefined {
//   return array.find((item) => item[key] === value);
// }


export function getActionName(action: EncountersAction): string {
  switch (action) {
    case EncountersAction.Fight:
      return "Fight";
    case EncountersAction.Pay:
      return "Pay";
    case EncountersAction.Run:
      return "Run";
    default:
      return "?"
  }
}


export function getOutcomeName(outcome: EncounterOutcomes): string {
  switch (outcome) {
    case EncounterOutcomes.Died:
      return "Died";
    case EncounterOutcomes.Escaped:
      return "Escaped";
    case EncounterOutcomes.Paid:
      return "Paid";
    case EncounterOutcomes.Victorious:
      return "Victorious";
    default:
      return "?"
  }
}




export function getOutcomeInfo(
  encounter: Encounters,
  type: EncounterOutcomes,
): OutcomeInfo {
  const found = outcomes.find((item) => {
    return item.encounter === encounter && item.type === type;
  });
  if (!found) {
    console.log(`getOutcomeInfo outcome ${encounter} ${type} not found !`);
  }
  return found || outcomes[0];
}


