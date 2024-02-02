import Button from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Inventory } from "@/components/Inventory";
import Layout from "@/components/Layout";
import { useConfigStore, useDojoContext, useGameStore, useRouterContext, useSystems } from "@/dojo/hooks";
import { DrugConfigFull } from "@/dojo/stores/config";
import { DrugMarket } from "@/dojo/types";
import { formatCash } from "@/utils/ui";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  HStack,
  SimpleGrid,
  StyleProps,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Location() {
  const { router, gameId, location } = useRouterContext();
  const { account } = useDojoContext();

  const configStore = useConfigStore();
  const { game, gameInfos } = useGameStore();

  const [prices, setPrices] = useState<DrugMarket[]>([]);
  useEffect(() => {
    if (game && game.markets.marketsByLocation && location) {
      setPrices(game.markets.marketsByLocation.get(location.location) || []);
    }
  }, [location, game]);

  const { endGame, isPending } = useSystems();

  const [isLastDay, setIsLastDay] = useState(false);

  useEffect(() => {
    if (game && location) {
      // check if player at right location
      if (location?.location !== game.player.location?.location) {
        router.replace(`/${gameId}/${game.player.location?.location}`);
        return;
      }

      // TODO : get max turns form game
      setIsLastDay(game.player.turn === gameInfos.max_turns);
    }
  }, [location, game, router, gameId]);

  if (!game || !prices || !location || !configStore) {
    return <></>;
  }

  const prefixTitle = isLastDay
    ? "Final Day"
    : `Day ${game.player.turn} ${gameInfos.max_turns === 0 ? "" : "/ " + gameInfos.max_turns}`;

  return (
    <Layout
      leftPanelProps={{
        title: location.name,
        prefixTitle: prefixTitle,
        imageSrc: `/images/locations/${location?.location.toLowerCase()}.png`,
      }}
      footer={
        <Footer>
          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            isLoading={isPending}
            onClick={async () => {
              if (isLastDay) {
                await endGame(gameId);
                router.push(`/${gameId}/end`);
              } else {
                router.push(`/${gameId}/travel`);
              }
            }}
          >
            {isLastDay ? "End Game" : "Continue"}
          </Button>
        </Footer>
      }
    >
      <Box w="full" zIndex="1" position="sticky" top="0" bg="neon.900" pb={"8px"}>
        <Inventory />
      </Box>

      <VStack w="full" align="flex-start" gap="10px">
        <SimpleGrid columns={2} w="full" gap={["10px", "16px"]} fontSize={["16px", "20px"]}>
          {prices.map((drug, index) => {
            const drugConfig = configStore.getDrug(drug.drug)!;
            // TODO: update
            // const canBuy = drug.price <= game.player.cash && playerEntity.drugCount < playerEntity.getTransport();
            // const canSell = !!playerEntity.drugs.find((d) => d.id === drug.id && d.quantity > 0);

            const canBuy = true;
            const canSell = true;

            return (
              <Card h={["auto", "180px"]} key={index} position="relative">
                <CardHeader
                  textTransform="uppercase"
                  fontSize={["16px", "20px"]}
                  textAlign="left"
                  padding={["6px 10px", "10px 20px"]}
                >
                  {drugConfig.name}
                </CardHeader>
                <CardBody>
                  <HStack w="full" justify="center">
                    <Flex
                      as={motion.div}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      p="2px"
                      align="center"
                      boxSize="full"
                      position="absolute"
                      pointerEvents={["none", "auto"]}
                    >
                      <HStack h="100px" w="full" p="20px" gap="10px" bgColor="neon.900">
                        <BuySellBtns canBuy={canBuy} canSell={canSell} drugConfig={drugConfig} />
                      </HStack>
                    </Flex>
                    {drugConfig.icon({})}
                  </HStack>
                </CardBody>

                <CardFooter fontSize={["14px", "16px"]} flexDirection="column" padding={["0 10px", "10px 20px"]}>
                  <HStack justifyContent="space-between">
                    <Text>{formatCash(drug.price)}</Text>
                    {/* <HStack>
                      <Cart mb="4px" />
                      <Text marginInlineStart="0 !important">{formatQuantity(drug.marketPool.quantity)}</Text>
                    </HStack> */}
                  </HStack>
                  <BuySellMobileToggle canSell={canSell} canBuy={canBuy} drugConfig={drugConfig} />
                </CardFooter>
              </Card>
            );
          })}
        </SimpleGrid>
      </VStack>
    </Layout>
  );
}

const BuySellBtns = ({
  canBuy,
  canSell,
  drugSlug,
  drugConfig,
}: {
  canBuy: boolean;
  canSell: boolean;
  drugConfig: DrugConfigFull;
}) => {
  const { router } = useRouterContext();
  return (
    <HStack mb="10px" w="full">
      <Button
        flex="1"
        onClick={() => router.push(`${router.asPath}/${drugConfig.drug.toLowerCase()}/buy`)}
        isDisabled={!canBuy}
      >
        Buy
      </Button>
      <Button
        flex="1"
        onClick={() => router.push(`${router.asPath}/${drugConfig.drug.toLowerCase()}/sell`)}
        isDisabled={!canSell}
      >
        Sell
      </Button>
    </HStack>
  );
};

const BuySellMobileToggle = ({
  canBuy,
  canSell,
  drugConfig,
  ...props
}: {
  canBuy: boolean;
  canSell: boolean;
  drugConfig: DrugConfigFull;
} & StyleProps) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Box boxSize="full" position="absolute" top="0" left="0" onClick={onToggle} pointerEvents={["auto", "none"]} />
      <HStack
        as={motion.div}
        initial={{ height: "0", opacity: 0 }}
        animate={{
          height: isOpen ? "auto" : "0",
          opacity: isOpen ? 1 : 0,
        }}
        boxSize="full"
        gap="10px"
        overflow="hidden"
        align="flex-start"
        display={["flex", "none"]}
        {...props}
      >
        <BuySellBtns canBuy={canBuy} canSell={canSell} drugConfig={drugConfig} />
      </HStack>
    </>
  );
};
