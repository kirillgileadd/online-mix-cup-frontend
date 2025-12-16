import clsx from "clsx";
import type { FC } from "react";
import { Container, Title, Text } from "@mantine/core";

type RegulationPageProps = {
  className?: string;
};

export const RegulationPage: FC<RegulationPageProps> = ({ className }) => {
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

      {/* Главный контент */}
      <section className="relative px-4 md:pt-32 pt-32 pb-16">
        <Container size="xl" className="w-full relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Заголовок страницы */}
            <div className="text-center mb-12">
              <Title
                order={1}
                className="text-white text-4xl md:text-5xl lg:text-6xl font-bold uppercase italic tracking-tight mb-4"
              >
                Регламент турнира
              </Title>
              <Title
                order={2}
                className="text-cyan-400 text-2xl md:text-3xl font-semibold"
              >
                "Dota 2 Mixify Cup"
              </Title>
            </div>

            {/* Контент регламента */}
            <div className="space-y-8 bg-dark-900/95 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-white/10">
              {/* 1. Общие положения */}
              <section className="space-y-4">
                <Title
                  order={2}
                  className="text-white text-2xl md:text-3xl font-bold mb-4"
                >
                  1. Общие положения
                </Title>
                <div className="space-y-3 text-white/90">
                  <Text className="text-base md:text-lg leading-relaxed">
                    <strong>Название турнира:</strong> Dota 2 Mixify Cup
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    <strong>Дата проведения:</strong> Указана в карточке и на
                    странице турнира (время окончания зависит от количества
                    участников).
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    <strong>Формат проведения:</strong> Онлайн.
                  </Text>
                </div>
              </section>

              {/* 2. Взнос, призы и награды */}
              <section className="space-y-4">
                <Title
                  order={2}
                  className="text-white text-2xl md:text-3xl font-bold mb-4"
                >
                  2. Взнос, призы и награды
                </Title>
                <div className="space-y-3 text-white/90">
                  <Text className="text-base md:text-lg leading-relaxed">
                    <strong>Взнос:</strong> указан в карточке и на странице
                    турнира
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    <strong>Призовой фонд:</strong> 100% от всех взносов.
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    <strong>Распределение призов:</strong>
                  </Text>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Игрок с 1 жизнью — половина взноса</li>
                    <li>Игрок с 2 жизнями — целый взнос</li>
                    <li>Игроки с 3 жизнями — делят оставшийся фонд.</li>
                    <li>
                      Если игроков с 3 жизнями нет, делят игроки с 2 и далее по
                      нисходящей.
                    </li>
                  </ul>
                </div>
              </section>

              {/* 3. Участники и регистрация */}
              <section className="space-y-4">
                <Title
                  order={2}
                  className="text-white text-2xl md:text-3xl font-bold mb-4"
                >
                  3. Участники и регистрация
                </Title>
                <div className="space-y-3 text-white/90">
                  <Text className="text-base md:text-lg leading-relaxed">
                    <strong>Требования к участникам:</strong>
                  </Text>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Играть только со своего основного аккаунта Steam.</li>
                    <li>
                      На аккаунте не должно быть VAC-банов и других нарушений.
                    </li>
                    <li>Указывать честный ммр в анкете.</li>
                    <li>Минимальный рейтинг 2500 ммр</li>
                  </ul>
                  <Text className="text-base md:text-lg leading-relaxed mt-4">
                    <strong>Регистрация:</strong>
                  </Text>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Через Telegram-бот, указав достоверную информацию.</li>
                    <li>
                      После регистрации необходимо оплатить участие и
                      подтвердить готовность.
                    </li>
                    <li>
                      В день турнира подтвердить готовность не позднее чем за 15
                      минут до начала и не раньше чем за 2 часа до старта.
                    </li>
                    <li>
                      Сняться с турнира с возвратом средств можно не позднее 24
                      часов до начала турнира.
                    </li>
                  </ul>
                </div>
              </section>

              {/* 4. Формат турнира */}
              <section className="space-y-4">
                <Title
                  order={2}
                  className="text-white text-2xl md:text-3xl font-bold mb-4"
                >
                  4. Формат турнира
                </Title>
                <div className="space-y-3 text-white/90">
                  <Text className="text-base md:text-lg leading-relaxed">
                    Все игроки распределяются по лобби из 10 человек. Два игрока
                    с самым высоким MMR становятся капитанами и выбирают игроков
                    по схеме 1–2–2–1–1–2–2–1
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    Случайным образом определяется капитан, который выбирает —
                    пикать первым или вторым.
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    Игроки, не попавшие в лобби, проходят в следующий раунд без
                    потери жизни и ожидают в «чилл-зоне».
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    Игрок не допускается в «чилл-зону» повторно до тех пор, пока
                    все остальные участники не посетят её хотя бы один раз.
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed mt-4">
                    <strong>Система жизней:</strong>
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    Каждому игроку дается 3 жизни. Игрок теряет жизнь, если:
                  </Text>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Проиграл игру.</li>
                    <li>
                      Не подтвердил готовность за 15 минут до начала турнира.
                    </li>
                    <li>
                      Не зашел в лобби в течение 10 минут после его создания.
                    </li>
                    <li>
                      Вёл себя неуважительно по отношению к игрокам или
                      организаторам.
                    </li>
                  </ol>
                  <Text className="text-base md:text-lg leading-relaxed">
                    Игрок с 0 жизнями выбывает.
                  </Text>
                </div>
              </section>

              {/* 5. Правила матчей */}
              <section className="space-y-4">
                <Title
                  order={2}
                  className="text-white text-2xl md:text-3xl font-bold mb-4"
                >
                  5. Правила матчей
                </Title>
                <div className="space-y-3 text-white/90">
                  <Text className="text-base md:text-lg leading-relaxed">
                    <strong>Режим:</strong> Captains draft
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    <strong>Определение сторон и порядок пика:</strong> Coin
                    Flip в лобби.
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    <strong>Хост:</strong> капитан, выбирающий порядок пика.
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed mt-4">
                    <strong>Переподключения и паузы:</strong>
                  </Text>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Если игрок отсутствует 10 минут — команда соперника вправе
                      отжать паузу.
                    </li>
                    <li>За повторные паузы дается по 5 минут.</li>
                    <li>
                      При краше лобби или форс-мажоре назначается переигровка.
                    </li>
                  </ul>
                  <Text className="text-base md:text-lg leading-relaxed mt-4">
                    <strong>GG-ситуации:</strong>
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    Если игрок написал "GG" по ошибке, у его команды есть 30
                    секунд, чтобы уведомить команду соперника, что сообщение
                    было ошибочным. Если уведомление не поступает в течение
                    этого времени, победа автоматически присуждается команде
                    соперника.
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed mt-4">
                    <strong>Нарушения:</strong>
                  </Text>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Использование читов, макросов и скриптов запрещено.
                      Нарушители получают бан на 1 год.
                    </li>
                    <li>
                      Если организатор выявит, что игрок намеренно проигрывает
                      матч, он имеет право немедленно дисквалифицировать его и
                      запретить участие в последующих турнирах.
                    </li>
                  </ul>
                </div>
              </section>

              {/* 6. Коммуникация и дисциплина */}
              <section className="space-y-4">
                <Title
                  order={2}
                  className="text-white text-2xl md:text-3xl font-bold mb-4"
                >
                  6. Коммуникация и дисциплина
                </Title>
                <div className="space-y-3 text-white/90">
                  <Text className="text-base md:text-lg leading-relaxed">
                    <strong>Официальные каналы:</strong> Telegram и Discord.
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    Вся информация о лобби, готовности и матчах публикуется там.
                    Ответственность за получение информации лежит на игроках.
                    Отсчёт времени ведётся с момента публикации.
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed mt-4">
                    <strong>Отчёт о матче:</strong>
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    Капитан победившей команды обязан отправить скриншот лобби
                    не позднее 10 минут после окончания игры.
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    1 нарушение — предупреждение, повторное — минус жизнь.
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed mt-4">
                    <strong>Поведение:</strong>
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    Оскорбления и токсичность запрещены. Организатор может
                    исключить игрока или лишить жизни за неподобающее поведение,
                    или не исключать при мирном урегулировании.
                  </Text>
                </div>
              </section>

              {/* 7. Трансляции и контент */}
              <section className="space-y-4">
                <Title
                  order={2}
                  className="text-white text-2xl md:text-3xl font-bold mb-4"
                >
                  7. Трансляции и контент
                </Title>
                <div className="space-y-3 text-white/90">
                  <Text className="text-base md:text-lg leading-relaxed">
                    Игрокам разрешено стримить с задержкой 2 минуты при закрытой
                    миникарте или 5 минут при открытой.
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    Кастеры также могут стримить с аналогичной задержкой.
                    Организатор может публиковать записи матчей, вести прямые
                    трансляции и размещать контент на видеохостингах.
                  </Text>
                </div>
              </section>

              {/* 8. Судейство */}
              <section className="space-y-4">
                <Title
                  order={2}
                  className="text-white text-2xl md:text-3xl font-bold mb-4"
                >
                  8. Судейство
                </Title>
                <div className="space-y-3 text-white/90">
                  <Text className="text-base md:text-lg leading-relaxed">
                    <strong>Главный судья</strong> — организатор турнира.
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    Он принимает решения по спорным ситуациям, исходя из
                    регламента и принципов честной игры.
                  </Text>
                  <Text className="text-base md:text-lg leading-relaxed">
                    Главный судья имеет право принимать решения на свое
                    усмотрение при обнаружении лазеек в регламенте.
                  </Text>
                </div>
              </section>

              {/* Заключение */}
              <section className="space-y-4 pt-4 border-t border-white/10">
                <Text className="text-white text-base md:text-lg leading-relaxed font-semibold">
                  Заключение:
                </Text>
                <Text className="text-white/90 text-base md:text-lg leading-relaxed">
                  Участие в турнире означает согласие со всеми пунктами данного
                  регламента. Организатор оставляет за собой право вносить
                  изменения с уведомлением участников через официальные каналы.
                </Text>
              </section>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
