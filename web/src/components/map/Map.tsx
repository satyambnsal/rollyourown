import { Location } from "@/dojo/types";
import { Flex, Image, useBreakpointValue } from "@chakra-ui/react";
import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
import { HitBox } from "./HitBox";
import { Outline } from "./Outline";

type CoordinateType = {
  [key in Location]: { x: number; y: number };
};

const coordinate: CoordinateType = {
  [Location.Home]: { x: 0, y: 0 },
  [Location.Queens]: { x: -150, y: 150 },
  [Location.Jersey]: { x: 150, y: 150 },
  [Location.Bronx]: { x: 0, y: 300 },
  [Location.Central]: { x: 0, y: 150 },
  [Location.Coney]: { x: -150, y: -0 },
  [Location.Brooklyn]: { x: 0, y: -0 },
};

const yOffset = -150;

export const Map = ({
  targetId,
  current,
  onSelect,
}: {
  targetId?: Location;
  current?: Location;
  onSelect: (selected: Location) => void;
}) => {
  const [scope, animate] = useAnimate();
  const isMobile = useBreakpointValue([true, false]);

  useEffect(() => {
    if (targetId !== undefined) {
      const point = coordinate[targetId] ? coordinate[targetId] : {x:0,y:0}
      const animation = isMobile
        ? {
            scale: 1.5,
            x: point.x,
            y: point.y + yOffset,
          }
        : { scale: 1, x: 0, y: 0 };
      animate(
        scope.current,
        { ...animation },
        {
          ease: "easeInOut",
          duration: 0.5,
        },
      );
    }
  }, [targetId, isMobile, animate, scope]);

  return (
    <Flex
      userSelect="none"
      position="relative"
      w="inherit"
      as={motion.div}
      ref={scope}
      drag={isMobile}
      dragConstraints={{
        left: -150,
        right: 150,
        top: -150,
        bottom: 300,
      }}
    >
      <Image
        src="/images/map/basemap.svg"
        position="absolute"
        top="0"
        left="0"
        boxSize="full"
        alt="ryo map"
      />

      <Outline targetId={targetId} current={current} />
      <HitBox onSelect={onSelect} />
    </Flex>
  );
};
