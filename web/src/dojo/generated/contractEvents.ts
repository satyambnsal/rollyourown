/* Autogenerated file. Do not edit manually. */

import { num, GetTransactionReceiptResponse, InvokeTransactionReceiptResponse, Contract } from "starknet";

export enum WorldEvents {
  Upgraded = "0x2db340e6c609371026731f47050d3976552c89b4fbb012941663841c59d1af3",
  GameCreated = "0x230f942bb2087887c3b1dd964c716614bb6df172214f22409fefb734d96a4d2",
  Traveled = "0x2c4d9d5da873550ed167876bf0bc2ae300ce1db2eeff67927a85693680a2328",
  TradeDrug = "0x168c796c89bf587204933184c04f932929cb578ea082f44a918b4251706f902",
  HighVolatility = "0x5745fc04eae9463f95a8fd2efc3a0ce995c72189f48fc4afcaee0648773f24",
  UpgradeItem = "0x3ca813365217de90cf97b15d7e7e6f0525760cdec66dd9326203e7ddc368f80",
  TravelEncounter = "0x211a1369d28745f22bfe7e3e7e8e9d671f904ea80596d1fab13bfa9c16c1c57",
  TravelEncounterResult = "0x4c25d590d9373d60632194fce3d4237e3ccb1d31738c1f881045e495e04b35",
  GameOver = "0x165460ded86991fa560a0d331810f83651da90c5df6d4b61357c3b3807ff41c",
}

/*
      export interface BaseEventData {
        game_id: number;
        event_type: WorldEvents;
        event_name: string;
      }


export interface GameCreatedData extends BaseEventData {
        game_id: number;
player_id: string;
game_mode: String;
player_name: string;
hustler_id: number;
        }

export interface TraveledData extends BaseEventData {
        game_id: number;
player_id: string;
turn: number;
from_location_id: number;
to_location_id: number;
        }

export interface TradeDrugData extends BaseEventData {
        game_id: number;
player_id: string;
drug_id: number;
quantity: number;
price: number;
is_buy: boolean;
        }

export interface HighVolatilityData extends BaseEventData {
        game_id: number;
player_id: string;
location_id: number;
drug_id: number;
increase: boolean;
        }

export interface UpgradeItemData extends BaseEventData {
        game_id: number;
player_id: string;
item_slot: number;
item_level: number;
        }

export interface TravelEncounterData extends BaseEventData {
        game_id: number;
player_id: string;
attack: number;
health: number;
level: number;
health_loss: number;
demand_pct: number;
payout: number;
        }

export interface TravelEncounterResultData extends BaseEventData {
        game_id: number;
player_id: string;
action: String;
outcome: String;
rounds: number;
dmg_dealt: number;
dmg_taken: number;
cash_earnt: number;
cash_loss: number;
drug_id: number;
drug_loss: number;
        }

export interface GameOverData extends BaseEventData {
        game_id: number;
player_id: string;
leaderboard_version: number;
player_name: string;
hustler_id: number;
turn: number;
cash: number;
health: number;
        }


      export const parseAllEvents = (receipt: GetTransactionReceiptResponse) => {
      if (receipt.execution_status === "REVERTED") {
          throw new Error(`transaction REVERTED`);
      }
    
      const flatEvents = parseEvents(receipt as InvokeTransactionReceiptResponse)
      return flatEvents
    }
    
    export const parseEvents = (receipt: InvokeTransactionReceiptResponse) => {
      const parsed = receipt.events.map(e => parseEvent(e))
      return parsed
    }
    
    export type ParseEventResult = ReturnType<typeof parseEvent>;


    
    export const parseEvent = (raw: any) => {
      switch (raw.keys[0]) {
          
case WorldEvents.GameCreated:
return {
event_type: WorldEvents.GameCreated,
event_name: "GameCreated",
game_id: Number(raw.keys[1]),
player_id: num.toHexString(raw.keys[2]),
game_mode: num.toHexString(raw.data[0]),
player_name: num.toHexString(raw.data[1]),
hustler_id: Number(raw.data[2]),
} as GameCreatedData;

case WorldEvents.Traveled:
return {
event_type: WorldEvents.Traveled,
event_name: "Traveled",
game_id: Number(raw.keys[1]),
player_id: num.toHexString(raw.keys[2]),
turn: Number(raw.data[0]),
from_location_id: Number(raw.data[1]),
to_location_id: Number(raw.data[2]),
} as TraveledData;

case WorldEvents.TradeDrug:
return {
event_type: WorldEvents.TradeDrug,
event_name: "TradeDrug",
game_id: Number(raw.keys[1]),
player_id: num.toHexString(raw.keys[2]),
drug_id: Number(raw.data[0]),
quantity: Number(raw.data[1]),
price: Number(raw.data[2]),
is_buy: raw.data[3] === "0x0" ? false : true,
} as TradeDrugData;

case WorldEvents.HighVolatility:
return {
event_type: WorldEvents.HighVolatility,
event_name: "HighVolatility",
game_id: Number(raw.keys[1]),
player_id: num.toHexString(raw.keys[2]),
location_id: Number(raw.data[0]),
drug_id: Number(raw.data[1]),
increase: raw.data[2] === "0x0" ? false : true,
} as HighVolatilityData;

case WorldEvents.UpgradeItem:
return {
event_type: WorldEvents.UpgradeItem,
event_name: "UpgradeItem",
game_id: Number(raw.keys[1]),
player_id: num.toHexString(raw.keys[2]),
item_slot: Number(raw.data[0]),
item_level: Number(raw.data[1]),
} as UpgradeItemData;

case WorldEvents.TravelEncounter:
return {
event_type: WorldEvents.TravelEncounter,
event_name: "TravelEncounter",
game_id: Number(raw.keys[1]),
player_id: num.toHexString(raw.keys[2]),
attack: Number(raw.data[0]),
health: Number(raw.data[1]),
level: Number(raw.data[2]),
health_loss: Number(raw.data[3]),
demand_pct: Number(raw.data[4]),
payout: Number(raw.data[5]),
} as TravelEncounterData;

case WorldEvents.TravelEncounterResult:
return {
event_type: WorldEvents.TravelEncounterResult,
event_name: "TravelEncounterResult",
game_id: Number(raw.keys[1]),
player_id: num.toHexString(raw.keys[2]),
action: num.toHexString(raw.data[0]),
outcome: num.toHexString(raw.data[1]),
rounds: Number(raw.data[2]),
dmg_dealt: Number(raw.data[3]),
dmg_taken: Number(raw.data[4]),
cash_earnt: Number(raw.data[5]),
cash_loss: Number(raw.data[6]),
drug_id: Number(raw.data[7]),
drug_loss: Number(raw.data[8]),
} as TravelEncounterResultData;

case WorldEvents.GameOver:
return {
event_type: WorldEvents.GameOver,
event_name: "GameOver",
game_id: Number(raw.keys[1]),
player_id: num.toHexString(raw.keys[2]),
leaderboard_version: Number(raw.keys[3]),
player_name: num.toHexString(raw.data[0]),
hustler_id: Number(raw.data[1]),
turn: Number(raw.data[2]),
cash: Number(raw.data[3]),
health: Number(raw.data[4]),
} as GameOverData;


    default:
      return {
        gameId: undefined,
        event_type: raw.keys[0],
        event_name: raw.keys[0],
      }
    break;


      }
    }


    */
