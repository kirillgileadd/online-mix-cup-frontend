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
          />
        </picture>
        {/* Градиент от темно-синего/бирюзового внизу к черному вверху */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-900 via-[#0a1628] via-20% to-[#0c4a6e]/40 z-0 pointer-events-none" />
      </div>

      {/* Главный баннер */}
      <section className="relative flex flex-col items-center justify-center px-4 md:pt-32 pt-32">
        <Container size="xl" className="w-full relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
            {/* Бейдж Mixify CUP SERIES */}
            <div className="bg-black/90 px-5 py-2.5 rounded-md border border-white/10">
              <Text className="text-white text-xs md:text-sm font-semibold tracking-widest uppercase">
                Mixify CUP
              </Text>
            </div>

            {/* Главный заголовок */}
            <Title
              order={1}
              classNames={{ root: "text-[4rem]!" }}
              className="text-white font-black! uppercase italic tracking-tight leading-[1.1]"
            >
              ТУРНИР ПО DOTA 2
              <br />
              для потных раков
            </Title>

            {/* Подзаголовок */}
            <div className="space-y-2 md:space-y-3 max-w-3xl mt-4">
              <Text className="text-gray-500! text-lg md:text-xl lg:text-2xl font-light leading-relaxed">
                Микс Турнир для игры соло или с друзьями.
              </Text>
              <Text className="text-gray-500! text-lg md:text-xl lg:text-2xl font-light leading-relaxed">
                Система жизней, Автоподбор команды.
              </Text>
            </div>

            {/* Кнопка Telegram */}
            <Button
              onClick={handleTelegramClick}
              size="lg"
              className="bg-cyan-light! text-black! hover:bg-cyan-light/90 text-black font-bold uppercase px-8 py-6 text-base md:text-lg rounded-md transition-all duration-200 shadow-lg hover:shadow-cyan-light/50 mt-6"
              leftSection={<IconSend size={24} />}
            >
              ПОДАТЬ ЗАЯВКУ В TG
            </Button>

            <picture>
              <img
                src="/land-bg-2-1.png"
                alt=""
                className="w-[800px] h-[350px] object-cover opacity-90"
              />
            </picture>
          </div>
        </Container>
      </section>

      {/* Секция "О ТУРНИРЕ" */}
      <section className="relative py-12 md:py-16 px-4 bg-dark-900/95 backdrop-blur-sm">
        <Container size="xl" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Текст */}
            <div className="space-y-4 order-2 lg:order-1">
              <Title
                order={2}
                className="text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black! mb-4! italic uppercase tracking-tight"
              >
                О ТУРНИРЕ
              </Title>
              <div className="space-y-4">
                <Text className="text-white text-base md:text-lg leading-relaxed">
                  Далеко-далеко за словесными горами в стране гласных и
                  согласных, живут рыбные тексты. Все маленький ручеек, гор пояс
                  текст встретил раз путь. Взобравшись имени курсивных агентство
                  заманивший свое буквоград она свою пояс домах.
                </Text>
              </div>
            </div>

            {/* Иллюстрация трофея */}
            <div className="flex justify-center items-center order-1 lg:order-2">
              <div className="relative w-full max-w-md h-64 md:h-80">
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    filter: "drop-shadow(0 20px 60px rgba(20, 184, 166, 0.3))",
                  }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Пьедестал с свечением */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-gradient-to-b from-cyan-500/30 to-cyan-700/20 rounded-t-full blur-xl" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-20 bg-gradient-to-b from-cyan-400/20 to-cyan-600/10 rounded-t-full blur-lg" />

                    {/* Трофей */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="text-7xl md:text-9xl drop-shadow-2xl animate-pulse-slow">
                        🏆
                      </div>
                      {/* Конфетти эффект */}
                      <div className="absolute -top-10 -left-10 text-2xl opacity-60 animate-bounce delay-100">
                        ✨
                      </div>
                      <div className="absolute -top-5 -right-10 text-xl opacity-50 animate-bounce delay-300">
                        ⭐
                      </div>
                      <div className="absolute top-10 -left-5 text-xl opacity-40 animate-bounce delay-500">
                        💫
                      </div>
                    </div>

                    {/* Монета слева */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24">
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-400/50 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-700/50 to-transparent rounded-full" />
                        <span className="text-2xl md:text-3xl relative z-10">
                          ⭐
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Секция "ВЫГОДЫ УЧАСТИЯ И РЕДУКЦИОН" */}
      <section className="relative py-12 md:py-16 px-4 bg-dark-800/95 backdrop-blur-sm">
        <Container size="xl" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Текст */}
            <div className="space-y-4 order-2 lg:order-1">
              <Title
                order={2}
                className="text-white text-4xl md:text-5xl lg:text-6xl font-bold font-black! mb-4! italic uppercase tracking-tight"
              >
                Как подбираются команды?
              </Title>
              <div className="space-y-4">
                <Text className="text-white text-base md:text-lg leading-relaxed">
                  Далеко-далеко за словесными горами в стране гласных и
                  согласных живут рыбные тексты. Обеспечивает переписывается
                  безопасную вершину! Знаках, он. Которой лучше даль своих
                  языком толку, строчка свой рекламных она не океана гор lorem!
                  Далеко-далеко за, словесными горами в стране гласных и
                  согласных живут рыбные тексты. Океана букв эта рыбного, там
                  что на берегу семь вскоре деревни диких себя ipsum всемогущая
                  толку коварных, приставка рыбными языком послушавшись?
                </Text>
              </div>
            </div>

            {/* Иллюстрация молотка и доллара */}
            <div className="flex justify-center items-center order-1 lg:order-2"></div>
          </div>
        </Container>
      </section>

      {/* Секция FAQ */}
      <section className="relative py-12 md:py-16 px-4 bg-dark-900/95 backdrop-blur-sm">
        <Container size="xl" className="w-full">
          <div className="max-w-4xl mx-auto">
            <Title
              order={2}
              className="text-white text-4xl md:text-5xl lg:text-6xl font-black! mb-8! italic uppercase tracking-tight text-center"
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
                  <Text className="text-white font-semibold text-lg">
                    Как принять участие в турнире?
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text className="text-white/80 text-base leading-relaxed">
                    Для участия в турнире необходимо подать заявку через
                    Telegram бота. Нажмите кнопку "ПОДАТЬ ЗАЯВКУ В TG" выше, и
                    вы будете перенаправлены в бота, где сможете
                    зарегистрироваться и подключить свой Steam аккаунт.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="rating-requirements">
                <Accordion.Control>
                  <Text className="text-white font-semibold text-lg">
                    Какие требования к рейтингу?
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text className="text-white/80 text-base leading-relaxed">
                    Турнир предназначен для игроков с соревновательным рейтингом
                    "2500" и выше. Это позволяет обеспечить баланс в командах и
                    интересные матчи для всех участников.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="team-formation">
                <Accordion.Control>
                  <Text className="text-white font-semibold text-lg">
                    Как формируются команды?
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text className="text-white/80 text-base leading-relaxed">
                    Команды из 10 человек формируются автоматически на основе
                    среднего рейтинга участников. Система старается создать
                    сбалансированные команды, чтобы матчи были интересными и
                    честными.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="prizes">
                <Accordion.Control>
                  <Text className="text-white font-semibold text-lg">
                    Какие призовые выплачиваются?
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text className="text-white/80 text-base leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Labore nisi quos error. Reprehenderit maxime ducimus,
                    quisquam error libero voluptates odio laudantium? Fugit nemo
                    vel porro qui necessitatibus modi unde adipisci.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="lives-system">
                <Accordion.Control>
                  <Text className="text-white font-semibold text-lg">
                    Как работает система жизней?
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text className="text-white/80 text-base leading-relaxed">
                    В турнире используется система жизней. Каждый игрок имеет
                    определенное количество жизней. При проигрыше матча вы
                    теряете жизнь. Когда жизни заканчиваются, вы попадаете в
                    Chill Zone, где можете отдохнуть и вернуться в игру позже.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="schedule">
                <Accordion.Control>
                  <Text className="text-white font-semibold text-lg">
                    Как проходит расписание турнира?
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text className="text-white/80 text-base leading-relaxed">
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
