import clsx from "clsx";
import type { FC } from "react";
import { Container, Title, Text, Button, Accordion } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";

type AboutTournamentPageProps = {
  className?: string;
};

export const AboutTournamentPage: FC<AboutTournamentPageProps> = ({
  className,
}) => {
  const telegramBotUsername =
    import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "mixifycup_bot";
  const telegramBotUrl = `https://t.me/${telegramBotUsername}`;

  const handleTelegramClick = () => {
    window.open(telegramBotUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={clsx("min-h-screen relative overflow-hidden", className)}>
      {/* Фоновое изображение с градиентом */}
      <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none">
        <picture className="absolute inset-0 w-full h-full">
          <source
            srcSet="/dragonstouch_loading_screen.webp"
            type="image/webp"
          />
          <img
            src="/dragonstouch_loading_screen.png"
            alt=""
            className="w-full h-full object-cover opacity-30"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        {/* Градиент от темно-синего/бирюзового внизу к черному вверху */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-900 via-[#0a1628] via-20% to-[#0c4a6e]/40 z-0 pointer-events-none" />
      </div>

      {/* Главный баннер */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-20 sm:pt-24 md:pt-32 pb-12 md:pb-0">
        <Container size="xl" className="w-full relative z-10">
          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
            {/* Бейдж Mixify CUP SERIES */}
            <div className="bg-black/90 px-5 py-2.5 rounded-md border border-white/10">
              <Text className="text-white text-xs md:text-sm font-semibold tracking-widest uppercase">
                Mixify CUP
              </Text>
            </div>

            {/* Главный заголовок */}
            <Title
              order={1}
              classNames={{
                root: "text-3xl sm:text-4xl md:text-5xl lg:text-[4rem]!",
              }}
              className="text-white font-black! uppercase italic tracking-tight leading-[1.1]"
            >
              ТУРНИР ПО DOTA 2
              <br />
              без комиссии
            </Title>

            {/* Подзаголовок */}
            <div className="space-y-2 md:space-y-3 max-w-3xl mt-2 sm:mt-3 md:mt-4 px-2">
              <Text className="text-gray-500! text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light leading-relaxed">
                Микс Турнир 5 на 5 для игры соло или с друзьями.
              </Text>
              <Text className="text-gray-500! text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light leading-relaxed">
                Система жизней, Автоподбор команды.
              </Text>
              <Text className="text-gray-500! text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light leading-relaxed">
                Турнир без комиссии — все взносы формируют призовой фонд.
              </Text>
            </div>

            {/* Кнопка Telegram */}
            <Button
              onClick={handleTelegramClick}
              size="lg"
              className="bg-cyan-light! text-black! hover:bg-cyan-light/90 text-black font-bold uppercase px-6 py-4 sm:px-7 sm:py-5 md:px-8 md:py-6 text-sm sm:text-base md:text-lg rounded-md transition-all duration-200 shadow-lg hover:shadow-cyan-light/50 mt-4 sm:mt-5 md:mt-6"
              leftSection={<IconSend size={20} className="sm:w-6 sm:h-6" />}
            >
              ПОДАТЬ ЗАЯВКУ В TG
            </Button>

            <picture className="hidden md:flex justify-center items-center w-full max-w-full px-4">
              <source srcSet="/land-bg-2-1.webp" type="image/webp" />
              <img
                src="/land-bg-2-1.png"
                alt=""
                className="w-full max-w-[800px] h-auto object-cover opacity-90 aspect-video min-h-[300px]"
                loading="eager"
                fetchPriority="high"
              />
            </picture>
          </div>
        </Container>
      </section>

      {/* Секция "О ТУРНИРЕ" */}
      <section className="relative py-8 sm:py-10 md:py-12 lg:py-16 px-4 bg-dark-900/95 backdrop-blur-sm">
        <Container size="xl" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 md:gap-8 lg:gap-12 items-center">
            {/* Текст */}
            <div className="space-y-4 order-2 lg:order-1">
              <Title
                order={2}
                className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black! mb-4! italic uppercase tracking-tight"
              >
                О ТУРНИРЕ
              </Title>
              <div className="space-y-4">
                <Text className="text-white text-sm sm:text-base md:text-lg leading-relaxed">
                  Турнир 5 на 5 с автоматическим подбором команд — играй соло
                  или с друзьями, система сама сформирует сбалансированные
                  составы для каждого матча.
                </Text>
                <Text className="text-white text-sm sm:text-base md:text-lg leading-relaxed">
                  Турнир проходит без комиссии — все взносы участников полностью
                  формируют призовой фонд. После каждой игры проигравшие теряют
                  жизнь. Победитель с наибольшим количеством жизней забирает
                  весь призовой фонд.
                </Text>
              </div>
            </div>

            {/* Иллюстрация трофея */}
            <div className="flex justify-center items-center order-1 lg:order-2 px-4">
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
                <picture>
                  <source srcSet="/trophy-image.webp" type="image/webp" />
                  <img
                    src="/trophy-image.png"
                    alt="Трофей турнира"
                    className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(81,232,244,0.3)]"
                  />
                </picture>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Секция "ВЫГОДЫ УЧАСТИЯ И РЕДУКЦИОН" */}
      <section className="relative py-8 sm:py-10 md:py-12 lg:py-16 px-4 bg-dark-800/95 backdrop-blur-sm">
        <Container size="xl" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 md:gap-8 lg:gap-12 items-center">
            {/* Текст */}
            <div className="space-y-4 order-2 lg:order-1">
              <Title
                order={2}
                className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-black! mb-4! italic uppercase tracking-tight"
              >
                Как подбираются команды?
              </Title>
              <div className="space-y-4">
                <Text className="text-white text-sm sm:text-base md:text-lg leading-relaxed">
                  Система формирует лобби, где игроки с наивысшим рейтингом
                  автоматически становятся капитанами команд. Капитаны по
                  очереди выбирают себе игроков из доступного пула участников,
                  создавая сбалансированные составы.
                </Text>
                <Text className="text-white text-sm sm:text-base md:text-lg leading-relaxed">
                  После завершения каждого раунда лобби формируются заново — это
                  означает, что состав команд меняется, и у каждого игрока есть
                  шанс сыграть с разными партнерами и против разных соперников.
                </Text>
              </div>
            </div>

            {/* Иллюстрация молотка и доллара */}
            <div className="flex justify-center items-center order-1 lg:order-2 px-4">
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
                <picture>
                  <source srcSet="/cube-image.webp" type="image/webp" />
                  <img
                    src="/cube-image.png"
                    alt="Трофей турнира"
                    className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(81,232,244,0.3)]"
                  />
                </picture>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Секция FAQ */}
      <section className="relative py-8 sm:py-10 md:py-12 lg:py-16 px-4 bg-dark-900/95 backdrop-blur-sm">
        <Container size="xl" className="w-full">
          <div className="max-w-4xl mx-auto">
            <Title
              order={2}
              className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black! mb-6! md:mb-8! italic uppercase tracking-tight text-center"
            >
              Часто задаваемые вопросы
            </Title>

            <Accordion
              variant="separated"
              className="space-y-4"
              styles={{
                item: {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.5rem",
                },
                control: {
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                },
                label: {
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1.125rem",
                },
                content: {
                  color: "rgba(255, 255, 255, 0.8)",
                },
                chevron: {
                  color: "white",
                },
              }}
            >
              <Accordion.Item value="how-to-participate">
                <Accordion.Control>
                  <Text className="text-white font-semibold text-base sm:text-lg">
                    Как принять участие в турнире?
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text className="text-white/80 text-sm sm:text-base leading-relaxed">
                    Для участия в турнире необходимо подать заявку через
                    Telegram бота. Нажмите кнопку "ПОДАТЬ ЗАЯВКУ В TG" выше, и
                    вы будете перенаправлены в бота, где сможете
                    зарегистрироваться и подключить свой Steam аккаунт.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="rating-requirements">
                <Accordion.Control>
                  <Text className="text-white font-semibold text-base sm:text-lg">
                    Какие требования к рейтингу?
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text className="text-white/80 text-sm sm:text-base leading-relaxed">
                    Турнир предназначен для игроков с соревновательным рейтингом
                    "2500" и выше. Это позволяет обеспечить баланс в командах и
                    интересные матчи для всех участников.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="prizes">
                <Accordion.Control>
                  <Text className="text-white font-semibold text-base sm:text-lg">
                    Какие призовые выплачиваются?
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text className="text-white/80 text-sm sm:text-base leading-relaxed">
                    В течении суток организаторы свяжутся с вами для выплаты
                    призов.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="lives-system">
                <Accordion.Control>
                  <Text className="text-white font-semibold text-base sm:text-lg">
                    Как работает система жизней?
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text className="text-white/80 text-sm sm:text-base leading-relaxed">
                    В турнире используется система жизней. Каждый игрок имеет
                    определенное количество жизней. При проигрыше матча вы
                    теряете жизнь. Когда жизни заканчиваются, вы вылетаете из
                    турнира. Если вы попали в chill zone, вы пропускаете раунд
                    сохраяня жизнь, ваш приортет увеличивается на 1 чтобы не не
                    окаазывались в ChillZone больше 1 раза
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="schedule">
                <Accordion.Control>
                  <Text className="text-white font-semibold text-base sm:text-lg">
                    Как проходит расписание турнира?
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text className="text-white/80 text-sm sm:text-base leading-relaxed">
                    Турнир проходит в несколько раундов. Расписание матчей
                    формируется автоматически после формирования команд. Вы
                    получите уведомление о времени вашего матча через Telegram
                    бота.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </div>
        </Container>
      </section>
    </div>
  );
};
