"use client";

import { FC, useRef } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { wrap } from "@motionone/utils";

/**
 * Props for `BadgeMarquee`.
 */
export type BadgeMarqueeProps = SliceComponentProps<Content.BadgeMarqueeSlice>;

/**
 * Component for "BadgeMarquee" Slices.
 */
const BadgeMarquee: FC<BadgeMarqueeProps> = ({ slice }) => {
  const half = slice.primary.badges.length / 2;
  const firstHalf = slice.primary.badges.slice(0, half);
  const secondHalf = slice.primary.badges.slice(half);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="px-6 sm:px-12 my-[80dvh]"
    >
      <div className="sm:grid sm:grid-cols-2 gap-6 lg:gap-12 py-10 md:py-20 mx-auto max-w-7xl items-center">
        <div className="sm:col-span-1 flex flex-col">
          <PrismicRichText
            field={slice.primary.heading}
            components={{
              heading2: ({ children }) => (
                <h2 className="tracking-tight text-4xl lg:text-5xl font-bold">
                  {children}
                </h2>
              ),
            }}
          />
          <PrismicRichText
            field={slice.primary.subheading}
            components={{
              paragraph: ({ children }) => (
                <p className="mt-6 max-w-[24em] text-base sm:text-md lg:text-xl font-medium text-[#505050]">
                  {children}
                </p>
              ),
            }}
          />
          {isFilled.group(slice.primary.numbers) && (
            <>
              <hr className="mt-8 border-t-2 border-[#EEEEEE]" />
              <div className="flex flex-col lg:grid lg:grid-cols-2 mt-8 gap-6">
                {slice.primary.numbers.map((number, index) => (
                  <div
                    key={index}
                    className="xl:col-span-1 flex items-center gap-6"
                  >
                    <span className="tracking-tight text-5xl sm:text-6xl xl:text-7xl font-bold w-20 sm:w-28 h-20 sm:h-28 rounded-xl shrink-0 flex items-center justify-center bg-[#F5E6FF] text-[#8E44EC]">
                      {number.number}
                    </span>
                    <p className="text-[#505050] text-base lg:text-md 2xl:text-xl font-medium">
                      {number.text}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="sm:col-span-1 mt-12 sm:mt-0 flex flex-col gap-8 relative">
          <div className="absolute pointer-events-none z-10 top-0 bottom-0 left-0 bg-gradient-to-r to-transparent w-[35%] from-white" />
          <div className="absolute pointer-events-none z-10 top-0 bottom-0 right-0 bg-gradient-to-l to-transparent w-[35%] from-white" />
          <BadgeRow baseVelocity={-1}>
            {firstHalf.map((badge, i) => (
              <div
                key={i}
                className="w-44 h-44 shrink-0 flex items-center justify-center"
              >
                <PrismicNextImage
                  field={badge.badge}
                  fallbackAlt=""
                  className="w-auto h-full"
                />
              </div>
            ))}
          </BadgeRow>
          <BadgeRow baseVelocity={1}>
            {secondHalf.map((badge, i) => (
              <div
                key={i}
                className="w-44 h-44 shrink-0 flex items-center justify-center"
              >
                <PrismicNextImage
                  field={badge.badge}
                  fallbackAlt=""
                  className="w-auto h-full"
                />
              </div>
            ))}
          </BadgeRow>
        </div>
      </div>
    </section>
  );
};

const BadgeRow = ({
  children,
  baseVelocity,
}: {
  children: React.ReactNode;
  baseVelocity: number;
}) => {
  const baseX = useMotionValue(0);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (value) => `${wrap(-20, -45, value)}%`);

  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden flex">
      <motion.div className="flex" style={{ x }}>
        <span className="flex">{children}</span>
        <span className="flex">{children}</span>
        <span className="flex">{children}</span>
        <span className="flex">{children}</span>
      </motion.div>
    </div>
  );
};

export default BadgeMarquee;
