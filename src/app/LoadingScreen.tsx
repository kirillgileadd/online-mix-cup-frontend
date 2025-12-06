import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<"appear" | "disappear">(
    "appear"
  );

  useEffect(() => {
    // Фаза появления длится 1.5 секунды
    const appearTimer = setTimeout(() => {
      setAnimationPhase("disappear");
    }, 800);

    // Общий таймер для скрытия загрузочного экрана
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => {
      clearTimeout(appearTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-0 left-0 w-screen h-screen z-[9999] ${
              isLoading ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <motion.div
              animate={{
                scale: animationPhase === "disappear" ? 500 : 1,
                y: animationPhase === "disappear" ? "1100%" : 0,
              }}
              transition={{
                duration: 2.2,
                ease: "easeInOut",
                delay: animationPhase === "disappear" ? 0.3 : 0,
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <motion.svg
                initial={{
                  y: -50,
                }}
                animate={{
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
                width="100%"
                height="calc(100% + 100px)"
                viewBox="0 0 1920 1080"
                preserveAspectRatio="xMidYMid slice"
                className="block"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask id="cut" maskUnits="userSpaceOnUse">
                  <rect width="1920" height="1080" fill="white" />

                  <g
                    fill="#111827"
                    transform="
         translate(960 540)
         translate(-75 -75)
         scale(0.0732421875)
       "
                  >
                    <path d="M1503 333L1025 678L544 334V913L947 1217V948L792 832L789 924L698 860V622L1024 854L1344 620V862L1256 924L1253 831L1099 946L1101 1217L1503 912V333ZM293 1296L294 1608L365 1607L366 1410L455 1573L539 1408L544 1607H615V1296L523 1295L459 1416L393 1296H293ZM784 1296L886 1449L776 1607L864 1608L932 1512L1003 1607H1092L985 1450L1088 1296H999L937 1385L872 1296H784ZM1458 1296H1256L1257 1608L1329 1607L1330 1491L1444 1490L1443 1425H1330L1329 1365L1458 1363V1296ZM1479 1296L1586 1485V1607L1656 1608L1657 1484L1766 1296H1683L1625 1401L1562 1296H1479ZM1125 1296V1607L1200 1608L1201 1296H1125ZM667 1296V1607L742 1608L743 1296H667Z" />
                  </g>
                </mask>

                <rect
                  width="1920"
                  height="1080"
                  fill="#111827"
                  mask="url(#cut)"
                />
              </motion.svg>
            </motion.div>
            <motion.div
              initial={{
                y: -50,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              animate={{
                opacity: animationPhase === "disappear" ? 0 : 1,
                y: 0,
              }}
              className="fixed top-0 left-0 w-screen h-screen pointer-events-auto -z-10 bg-[#54EFFB]"
            ></motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
