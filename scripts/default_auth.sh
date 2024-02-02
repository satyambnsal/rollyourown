#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

if [ $# -ge 1 ]; then
    export PROFILE=$1
else
    export PROFILE="dev"
fi

TX_SLEEP=0.5

export WORLD_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.world.address')

# export LOBBY_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::systems::lobby::lobby" ).address')
# export TRAVEL_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::systems::travel::travel" ).address')
# export DECIDE_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::systems::decide::decide" ).address')
# export TRADE_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::systems::trade::trade" ).address')
# export SHOP_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::systems::shop::shop" ).address')
export RYO_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::systems::ryo::ryo" ).address')
export CONFIG_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::config::config::config" ).address')
export GAME_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::systems::game::game" ).address')

echo "---------------------------------------------------------------------------"
echo profile : $PROFILE
echo "---------------------------------------------------------------------------"
echo world : $WORLD_ADDRESS
echo " "
# echo lobby : $LOBBY_ADDRESS
# echo travel: $TRAVEL_ADDRESS
# echo decide: $DECIDE_ADDRESS
# echo trade : $TRADE_ADDRESS
# echo shop : $SHOP_ADDRESS
echo ryo : $RYO_ADDRESS
echo config : $CONFIG_ADDRESS
echo game : $GAME_ADDRESS
echo "---------------------------------------------------------------------------"

# enable system -> component authorizations
# LOBBY_COMPONENTS=("Game" "Player" "Leaderboard" "RyoMeta" "MarketPacked")
# TRAVEL_COMPONENTS=("Player" "Encounter" "Leaderboard" "RyoMeta" "MarketPacked")
# DECIDE_COMPONENTS=("Player" "Drug" "Encounter" "Leaderboard" "RyoMeta" "MarketPacked")
# TRADE_COMPONENTS=("Drug" "Player" "MarketPacked")
# SHOP_COMPONENTS=("Player" "Item" "MarketPacked")
RYO_COMPONENTS=("RyoMeta" "Leaderboard")
CONFIG_COMPONENTS=("DrugConfig" "DrugConfigMeta" "LocationConfig" "LocationConfigMeta" "ItemConfig" "ItemConfigMeta" "GameConfig")
GAME_COMPONENTS=("Game" "GameStorePacked" "Leaderboard" "RyoMeta")

# for component in ${LOBBY_COMPONENTS[@]}; do
#     sozo -P $PROFILE auth writer $component $LOBBY_ADDRESS --world $WORLD_ADDRESS
#     sleep $TX_SLEEP
# done

# for component in ${TRAVEL_COMPONENTS[@]}; do
#     sozo -P $PROFILE auth writer $component $TRAVEL_ADDRESS --world $WORLD_ADDRESS
#     sleep $TX_SLEEP
# done

# for component in ${DECIDE_COMPONENTS[@]}; do
#     sozo -P $PROFILE auth writer $component $DECIDE_ADDRESS --world $WORLD_ADDRESS
#     sleep $TX_SLEEP
# done

# for component in ${TRADE_COMPONENTS[@]}; do
#     sozo -P $PROFILE auth writer $component $TRADE_ADDRESS --world $WORLD_ADDRESS
#     sleep $TX_SLEEP
# done

# for component in ${SHOP_COMPONENTS[@]}; do
#     sozo -P $PROFILE auth writer $component $SHOP_ADDRESS --world $WORLD_ADDRESS
#     sleep $TX_SLEEP
# done

for component in ${RYO_COMPONENTS[@]}; do
    sozo -P $PROFILE auth writer $component $RYO_ADDRESS --world $WORLD_ADDRESS
    sleep $TX_SLEEP
done

for component in ${CONFIG_COMPONENTS[@]}; do
    sozo -P $PROFILE auth writer $component $CONFIG_ADDRESS --world $WORLD_ADDRESS
    sleep $TX_SLEEP
done

for component in ${GAME_COMPONENTS[@]}; do
    sozo -P $PROFILE auth writer $component $GAME_ADDRESS --world $WORLD_ADDRESS
    sleep $TX_SLEEP
done

echo "Default authorizations have been successfully set."

echo "Initializing..."
sozo -P $PROFILE execute $RYO_ADDRESS initialize
echo "Initialized RYO!"
sleep $TX_SLEEP

sozo -P $PROFILE execute $CONFIG_ADDRESS initialize
echo "Initialized CONFIG!"
sleep $TX_SLEEP
