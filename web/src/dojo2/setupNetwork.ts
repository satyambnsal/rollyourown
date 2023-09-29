import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { RPCProvider, Query, } from "@dojoengine/core";
import { Account, TypedContract, num } from "starknet";
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../generated/graphql';
import manifest from "../../manifest.json";

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

const contractsByName = {
    lobby: {
        address: "0x6c6b9e7ba07148fc9c6f1aa6da1a3c270123ea8c2f560cc003e3f30f6694577"
    },
    trade: {
        address: "0x14ea572ce8d6ffea135c266a319a52b36cc5a3cb0952b72d2fc145ff32ff79b"
    },
    travel: {
        address: "0x6e38af8b9ed6578127b6d7da9ce6204541de69c83438517fc1c198c1ead9799"
    },
    decide: {
        address: "0x405e70695b1ff73931610d85693d7b101614b06f8de5a6184208fb761dbb72e"
    },
    contract: {
        address: "0x74d97f9230afea0478057f475f4f105108d2fa99d8c7ce79f5446ef1031af1c"
    },
}

const getContractByName = (name: string) => {
    return contractsByName[name]
    // return manifest.contracts.find((contract) => contract.name === name);
}

export async function setupNetwork() {

    // Create a new RPCProvider instance.
    const provider = new RPCProvider(process.env.NEXT_PUBLIC_WORLD_ADDRESS, process.env.NEXT_PUBLIC_RPC_ENDPOINT);

    // // Utility function to get the SDK.
    // const createGraphSdk = () => getSdk(new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT));

    // Return the setup object.
    return {
        provider,
        world,

        // Define contract components for the world.
        contractComponents: defineContractComponents(world),

        // // Define the graph SDK instance.
        // graphSdk: createGraphSdk(),

        // Execute function.
        execute: async (signer: Account, contract: string, system: string, call_data: num.BigNumberish[]) => {
            return provider.execute(signer, getContractByName(contract)?.address || "", system, call_data);
        },

        // Entity query function.
        entity: async (component: string, query: Query) => {
            return provider.entity(component, query);
        },

        // Entities query function.
        entities: async (component: string, partition: number) => {
            return provider.entities(component, partition);
        },

        // Call function.
        call: async (selector: string, call_data: num.BigNumberish[]) => {
            return provider.call(selector, call_data);
        },
    };
}