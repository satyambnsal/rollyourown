use rollyourown::config::{
    hustlers::{HustlerConfig, HustlerImpl},
    game::{GameConfig}, drugs::{DrugConfig}, encounters::{EncounterConfig},
};


#[starknet::interface]
trait IConfig<T> {
    fn initialize_1(self: @T);
    fn initialize_2(self: @T);
    fn get_config(self: @T) -> Config;
    fn update_game_config(self: @T, game_config: GameConfig);
    fn update_drug_config(self: @T, drug_config: DrugConfig);
    fn update_encounter_config(self: @T, encounter_config: EncounterConfig);


}

#[derive(Drop, Serde)]
struct Config {
    layouts: LayoutsConfig,
    hustlers: Array<HustlerConfig>,
    game_config: GameConfig, // TODO: query torii instead
}

#[derive(Drop, Serde)]
struct LayoutsConfig {
    game_store: Array<LayoutItem>,
    player: Array<LayoutItem>,
}


#[derive(Copy, Drop, Serde)]
struct LayoutItem {
    name: bytes31,
    idx: u8,
    bits: u8,
}


#[dojo::contract]
mod config {
    use starknet::{get_caller_address, get_contract_address};

    use rollyourown::{
        config::{
            game::{initialize_game_config, GameConfig, GameConfigImpl},
            drugs::{initialize_drug_config, DrugConfig, Drugs}, locations::initialize_location_config,
            hustlers::{
                HustlerConfig, HustlerImpl, initialize_weapons_config, initialize_clothes_config,
                initialize_feet_config, initialize_transport_config, initialize_weapons_tiers_config,
                initialize_clothes_tiers_config, initialize_feet_tiers_config,
                initialize_transport_tiers_config,
            },
            encounters::{initialize_encounter_config,initialize_encounter_config_extra, EncounterConfig, Encounters},
        },
        packing::{
            game_store_layout::{
                GameStoreLayout, GameStoreLayoutEnumerableImpl, GameStoreLayoutPackableImpl,
                GameStoreLayoutIntoBytes31Impl
            },
            player_layout::{
                PlayerLayout, PlayerLayoutEnumerableImpl, PlayerLayoutPackableImpl,
                PlayerLayoutIntoBytes31Impl
            }
        }
    };

    use super::{Config, LayoutsConfig, LayoutItem};

    #[abi(embed_v0)]
    impl ConfigImpl of super::IConfig<ContractState> {
        fn initialize_1(self: @ContractState) {
            // TODO checks
            self.assert_caller_is_owner();

            let world = self.world();
           
            // common
            initialize_game_config(world); // must be set before encounters

            initialize_drug_config(world);
            initialize_location_config(world);

            // hustlers items
            initialize_weapons_config(world);
            initialize_clothes_config(world);
            initialize_feet_config(world);
            initialize_transport_config(world);

            // hutlsers items tiers
            initialize_weapons_tiers_config(world);
            initialize_clothes_tiers_config(world);
            initialize_feet_tiers_config(world);
            initialize_transport_tiers_config(world);
          
        }

        fn initialize_2(self: @ContractState) {
            // TODO checks
            self.assert_caller_is_owner();

            let world = self.world();
           
            // encounters
            initialize_encounter_config(world);
            initialize_encounter_config_extra(world);

        }

        fn get_config(self: @ContractState) -> Config {
            let world = self.world();

            let mut game_store: Array<LayoutItem> = array![];
            let mut game_store_layout_items = GameStoreLayoutEnumerableImpl::all();

            loop {
                match game_store_layout_items.pop_front() {
                    Option::Some(i) => {
                        game_store
                            .append(
                                LayoutItem { name: (*i).into(), bits: i.bits(), idx: i.idx(), }
                            );
                    },
                    Option::None => { break; }
                };
            };

            //

            let mut player: Array<LayoutItem> = array![];
            let mut player_layout_items = PlayerLayoutEnumerableImpl::all();

            loop {
                match player_layout_items.pop_front() {
                    Option::Some(i) => {
                        player
                            .append(
                                LayoutItem { name: (*i).into(), bits: i.bits(), idx: i.idx(), }
                            );
                    },
                    Option::None => { break; }
                };
            };

            //

            let mut hustlers: Array<HustlerConfig> = array![];
            let mut hustler_ids = array![0_u16, 1_u16, 2_u16].span();

            loop {
                match hustler_ids.pop_front() {
                    Option::Some(id) => {
                        let hustler = HustlerImpl::get(world, *id);
                        hustlers.append(hustler.get_hustler_config());
                    },
                    Option::None => { break; }
                };
            };
          
            //
            // TODO: remove & use torii 
            let game_config = GameConfigImpl::get(world);

            //
            Config { game_config, hustlers, layouts: LayoutsConfig { game_store, player } }
        }

        fn update_game_config(self: @ContractState, game_config: GameConfig) {
            self.assert_caller_is_owner();
            GameConfigImpl::set(self.world(), game_config);
        }


        fn update_drug_config(self: @ContractState, drug_config: DrugConfig) {
            self.assert_caller_is_owner();

            let drug: Drugs = drug_config.drug_id.into();
            let mut to_update = get!(self.world(), (drug), (DrugConfig));

            to_update.base = drug_config.base;
            to_update.step = drug_config.step;
            to_update.weight = drug_config.weight;
            to_update.name = drug_config.name;

            set!(self.world(), (to_update));
        }

        fn update_encounter_config(self: @ContractState, encounter_config: EncounterConfig) {
            self.assert_caller_is_owner();
            
            let mut to_update = get!(self.world(), (encounter_config.id), (EncounterConfig));
            
            to_update.encounter = encounter_config.encounter;
          
            to_update.level = encounter_config.level;
            to_update.health = encounter_config.health;
            to_update.attack = encounter_config.attack;
            to_update.defense = encounter_config.defense;
            to_update.speed = encounter_config.speed;

            to_update.rep_pay = encounter_config.rep_pay;
            to_update.rep_run = encounter_config.rep_run;
            to_update.rep_fight = encounter_config.rep_fight;

            to_update.min_rep = encounter_config.min_rep;
            to_update.max_rep = encounter_config.max_rep;

            to_update.payout = encounter_config.payout;

            set!(self.world(), (to_update));
        }
        
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn assert_caller_is_owner(self: @ContractState) {
            // assert(self.world().is_owner(starknet::get_caller_address(), 0), 'only world owner');

            assert(
                self.world().is_owner(get_caller_address(), get_contract_address().into()),
                'not owner'
            );
        }

    }
}
