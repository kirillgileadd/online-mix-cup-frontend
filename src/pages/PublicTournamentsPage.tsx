import clsx from "clsx";
import type { FC } from "react";
import { TournamentsList } from "../features/PublicTournaments";

type PublicTournamentsPageProps = {
  className?: string;
};

export const PublicTournamentsPage: FC<PublicTournamentsPageProps> = ({
  className,
}) => {
  return (
    <div className={clsx("py-6", className)}>
      <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none">
        <picture className="absolute inset-0 w-full h-full">
          <source
            srcSet="/dragonstouch_loading_screen.webp"
            type="image/webp"
          />
          <img
            src="/dragonstouch_loading_screen.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </picture>
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-0 pointer-events-none" />
      </div>
      <div>
        <TournamentsList />
      </div>
    </div>
  );
};
