import { Button } from "@/components/common";
import { DollarBag, Heart, Siren } from "@/components/icons";
import { Footer, Layout } from "@/components/layout";
import { CashIndicator, HealthIndicator } from "@/components/player";
import { ChildrenOrConnect } from "@/components/wallet";
import { GameClass } from "@/dojo/class/Game";
import { TravelEncounterData } from "@/dojo/events";
import { useGameStore, useRouterContext, useSystems } from "@/dojo/hooks";
import { EncountersAction, PlayerStatus } from "@/dojo/types";
import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { getSentence } from "@/responses";
import { IsMobile, formatCash } from "@/utils/ui";
import { Box, Card, Divider, HStack, Heading, Image, StyleProps, Text, VStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";

type CombatLog = {
  text: string;
  color: string;
  icon?: React.FC;
};

const Decision = observer(() => {
  const { router, gameId } = useRouterContext();
  const { account } = useAccount();
  const { game, gameInfos, gameEvents } = useGameStore();
  const { decide, isPending } = useSystems();

  const [prefixTitle, setPrefixTitle] = useState("");
  const [title, setTitle] = useState("");
  const [demand, setDemand] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [encounter, setEncounter] = useState<TravelEncounterData | undefined>(undefined);
  const [encounterImg, setEncounterImg] = useState<string>("");

  const [isPaying, setIsPaying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isFigthing, setIsFigthing] = useState(false);

  const [combatLogs, setCombatLogs] = useState<CombatLog[]>([]);
  const [sentence, setSentence] = useState("");

  const toaster = useToast();

  const combatsListRef = useRef(null);
  const isMobile = IsMobile();

  useEffect(() => {
    if (game && gameEvents && !isPending) {
      const encounter = gameEvents?.lastEncounter!.parsed as TravelEncounterData;
      setEncounter(encounter);
    }
  }, [game, isPending, gameEvents, gameEvents?.lastEncounter]);

  useEffect(() => {
    if (game && gameEvents && encounter && !isPending) {
      switch (game.player.status) {
        case PlayerStatus.BeingMugged:
          setPrefixTitle("You encountered a...");
          setTitle("Gang!");
          const cashAmount = Math.ceil((game.player.cash * encounter!.demandPct) / 100);
          encounter && setDemand(`They want ${formatCash(cashAmount)} PAPER!`);
          setSentence(getSentence(PlayerStatus.BeingMugged, EncountersAction.Fight));
          setEncounterImg(`/images/events/gang/${encounter.level}.gif`);
          break;
        case PlayerStatus.BeingArrested:
          setPrefixTitle("You encountered the...");
          setTitle("Cops!");
          const drugAmount = Math.ceil((game.drugs.quantity * encounter!.demandPct) / 100);
          const drugName = game.drugs.drug?.name;
          encounter && setDemand(`They want ${drugAmount} ${drugName}!`);
          setSentence(getSentence(PlayerStatus.BeingArrested, EncountersAction.Fight));
          setEncounterImg(`/images/events/cops/${encounter.level}.gif`);
          break;
      }
    }
  }, [game, gameEvents, game?.player.status, encounter, isPending]);

  useEffect(() => {
    if (game?.player.status == PlayerStatus.BeingArrested) {
      playSound(Sounds.Police);
    }
    if (game?.player.status == PlayerStatus.BeingMugged) {
      playSound(Sounds.Gang);
    }
  }, [game, game?.player.status]);

  useEffect(() => {
    if (!isPending) {
      setIsPaying(false);
      setIsRunning(false);
      setIsFigthing(false);
    }
  }, [isPending]);

  useEffect(() => {
    if (!combatsListRef.current) return;
    const lastEl = combatsListRef.current["lastElementChild"];
    // @ts-ignore
    lastEl && lastEl.scrollIntoView({ behavior: "smooth" });
  }, [combatLogs.length]);

  const addCombatLog = (log: CombatLog) => {
    setCombatLogs((logs) => [...logs, log]);
  };

  const onDecision = async (action: EncountersAction) => {
    //  play sound

    switch (action) {
      case EncountersAction.Pay:
        addCombatLog({ text: "You decided to pay up", color: "neon.400", icon: DollarBag });
        setSentence(getSentence(game?.player.status as PlayerStatus, EncountersAction.Pay));
        playSound(Sounds.Pay);
        break;
      case EncountersAction.Run:
        addCombatLog({
          text: "You split without a second thought",
          color: "neon.400",
          icon: game?.items.attack.icon,
        });
        setSentence(getSentence(game?.player.status as PlayerStatus, EncountersAction.Run));
        playSound(Sounds.Run);
        break;
      case EncountersAction.Fight:
        setSentence(getSentence(game?.player.status as PlayerStatus, EncountersAction.Fight));
        switch (gameInfos?.hustler_id) {
          case 0:
            playSound(Sounds.Uzi);
            break;
          case 1:
            playSound(Sounds.Chains);
            break;
          case 2:
            playSound(Sounds.Punch);
            break;
          default:
            playSound(Sounds.Punch);
            break;
        }
        break;
    }

    try {
      const { event, events, isGameOver } = await decide(gameId!, action);
      // if (isGameOver) {
      //   router.replace(`/${gameId}/end`);
      // } else {
      router.replace(`/${gameId}/event/consequence`);
      // }
    } catch (e) {
      console.log(e);
    }

    //try {
    //   switch (action) {
    //     case Action.Pay:
    //       addCombatLog({ text: "You decided to pay up", color: "neon.400", icon: DollarBag });
    //       setSentence(getSentence(playerEntity!.status, Action.Pay));
    //       playSound(Sounds.Pay);
    //       break;
    //     case Action.Run:
    //       addCombatLog({
    //         text: "You split without a second thought",
    //         color: "neon.400",
    //         icon: speedItem ? getShopItem(speedItem.id, speedItem.level).icon : Flipflop,
    //       });
    //       setSentence(getSentence(playerEntity!.status, Action.Run));
    //       playSound(Sounds.Run);
    //       break;
    //     case Action.Fight:
    //       //addCombatLog({ text: "Bouyakaaa", color: "neon.400" });
    //       setSentence(getSentence(playerEntity!.status, Action.Fight));
    //       switch (attackItem?.level) {
    //         case 1:
    //           playSound(Sounds.Knife);
    //           break;
    //         case 2:
    //           playSound(Sounds.Magnum357);
    //           break;
    //         case 3:
    //           playSound(Sounds.Uzi);
    //           break;
    //         default:
    //           playSound(Sounds.Punch);
    //           break;
    //       }
    //       break;
    //   }
    //   // setIsPaying(false);
    //   // setIsRunning(false);
    //   // setIsFigthing(false);
    //   // return;
    //   // save player status
    //   const playerStatus = playerEntity?.status;
    // const { event, events } = await decide(gameId, action);
    //   if (events) {
    //     displayMarketEvents(events as HighVolatilityData[], toaster);
    //   }
    //   const consequenceEvent = event as ConsequenceEventData;
    //   switch (consequenceEvent.outcome) {
    //     case Outcome.Died:
    //       setIsRedirecting(true);
    //       return router.replace(`/${gameId}/end`);
    //     case Outcome.Paid:
    //     case Outcome.Escaped:
    //       setIsRedirecting(true);
    //       consequenceEvent.dmgDealt > 0 &&
    //         addCombatLog({
    //           text: `You dealt ${consequenceEvent.dmgDealt}HP!`,
    //           color: "neon.400",
    //           icon: attackItem ? getShopItem(attackItem.id, attackItem.level).icon : undefined,
    //         });
    //       return router.replace(
    //         `/${gameId}/event/consequence?outcome=${consequenceEvent.outcome}&status=${playerStatus}`,
    //       );
    //     case Outcome.Victorious:
    //       setIsRedirecting(true);
    //       consequenceEvent.dmgDealt > 0 &&
    //         addCombatLog({ text: `You dealt ${consequenceEvent.dmgDealt}HP!`, color: "neon.400" });
    //       return router.replace(
    //         `/${gameId}/event/consequence?outcome=${consequenceEvent.outcome}&status=${playerStatus}&payout=${
    //           encounter!.payout
    //         }`,
    //       );
    //     case Outcome.Captured:
    //       playSound(Sounds.Ooo);
    //       consequenceEvent.dmgDealt > 0 &&
    //         addCombatLog({
    //           text: `You dealt ${consequenceEvent.dmgDealt}HP!`,
    //           color: "neon.400",
    //           icon: attackItem ? getShopItem(attackItem.id, attackItem.level).icon : Fist,
    //         });
    //       addCombatLog({ text: `You lost ${consequenceEvent.healthLoss}HP!`, color: "red", icon: Heart });
    //       break;
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  };

  if (!game || !router.isReady || isRedirecting || !encounter) {
    return <></>;
  }

  return (
    <Layout
      isSinglePanel
      footer={
        <Footer w={["100%", "50%"]}>
          <ChildrenOrConnect>
            <Button
              w="full"
              px={["auto", "20px"]}
              isDisabled={isRunning || isPaying}
              isLoading={isFigthing}
              onClick={() => {
                setIsFigthing(true);
                onDecision(EncountersAction.Fight);
              }}
            >
              Fight
            </Button>

            <Button
              w="full"
              px={["auto", "20px"]}
              isDisabled={isPaying || isFigthing}
              isLoading={isRunning}
              onClick={() => {
                setIsRunning(true);
                onDecision(EncountersAction.Run);
              }}
            >
              Run
            </Button>

            <Button
              w="full"
              px={["auto", "20px"]}
              isDisabled={isRunning || isFigthing}
              isLoading={isPaying}
              onClick={() => {
                setIsPaying(true);
                onDecision(EncountersAction.Pay);
              }}
            >
              PAY
            </Button>
          </ChildrenOrConnect>
        </Footer>
      }
    >
      <VStack
        w="full"
        h={["calc(100vh - 70px)", "calc(100vh - 120px)"]}
        overflowY="scroll"
        sx={{
          "scrollbar-width": "none",
        }}
      >
        <Encounter
          prefixTitle={prefixTitle}
          title={title}
          demand={demand}
          sentence={sentence}
          encounter={encounter!}
          game={game}
          imageSrc={encounterImg}
          flex={[0, 1]}
          mb={0}
          w="full"
        />
        <Box minH="100px" />
      </VStack>
    </Layout>
  );
});
export default Decision;

const Encounter = ({
  prefixTitle,
  title,
  demand,
  imageSrc,
  sentence,
  encounter,
  game,
  ...props
}: {
  prefixTitle?: string;
  title?: string;
  demand?: string;
  imageSrc: string;
  sentence: string;
  game: GameClass;
  encounter: TravelEncounterData;
} & StyleProps) => {
  return (
    <VStack {...props}>
      <VStack>
        <Text textStyle="subheading" textAlign="center" fontSize={["10px", "11px"]} letterSpacing="0.25em">
          {prefixTitle}
        </Text>
        <Heading fontSize={["30px", "48px"]} fontWeight="400">
          {title}
        </Heading>
      </VStack>
      <VStack
        w="full"
        // flexDir={["row", "column"]}
        justifyContent="center"
        alignItems={"center"}
        position="relative"
      >
        {!IsMobile() && sentence && (
          <>
            <Box top="0" position="absolute" w="280px">
              <Box fontSize="14px" p="6px" color="neon.500" textAlign="center" mb="8px">
                {sentence}
              </Box>
              <Card marginLeft="185px" w="10px" fontSize="12px" p="8px"></Card>
              <Card marginLeft="170px" w="10px" fontSize="12px" p="6px"></Card>
            </Box>
          </>
        )}

        <Image
          src={imageSrc}
          alt="adverse event"
          mt={[0, "100px"]}
          maxH={["30vh", "calc(100vh - 300px)"]}
          w="auto"
          h={[150, 300]}
        />

        <VStack w="full" mt={[0, "20px"]}>
          <Text color="red" h="40px" lineHeight="40px">
            <Heart /> You lost {encounter?.healthLoss} HP!
          </Text>

          <Card alignItems="center" w={"auto"} justify="center">
            <VStack w="full" gap="0">
              {/* <Divider w="full" orientation="horizontal" borderWidth="1px" borderColor="neon.600" /> */}

              <HStack w="full" px="16px" py="8px" justifyContent="center">
                <HStack>
                  <Siren /> <Text> LVL {encounter?.level}</Text>{" "}
                </HStack>
                <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                <CashIndicator cash={formatCash(encounter?.payout)} />
                <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
                <HealthIndicator health={encounter?.health} maxHealth={100} />
              </HStack>
              {!IsMobile() && (
                <Box w="full" px="10px">
                  <Divider w="full" orientation="horizontal" borderWidth="1px" borderColor="neon.600" />
                  <Text color="yellow.400" textAlign="center" h="40px" lineHeight="40px">
                    {demand}
                  </Text>
                </Box>
              )}
            </VStack>
          </Card>
        </VStack>
      </VStack>

      {IsMobile() && (
        <Card w="full" color="yellow.400" textAlign="center" p="10px" mb="10px">
          {demand}
        </Card>
      )}
    </VStack>
  );
};

// /// TODO: move this in a relevant place
// function getEncounterNPCMaxHealth(level: number, turn: number) {
//   // Calculate initial health based on level and turn.
//   let health = level * 8 + turn;
//   // Ensure health does not exceed 100.
//   health = Math.min(health, 100);

//   return health;
// }
