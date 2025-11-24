import { useEffect, useRef, useState } from "react";
import {
  longPollLobbies,
  type Lobby,
  type LongPollLobbiesResponse,
} from "../../../shared/api/lobbies";

type LongPollState = {
  lobbies: Lobby[];
  lastUpdate?: string;
  isLoading: boolean;
  error?: unknown;
};

export const useTournamentLobbiesLongPoll = (tournamentId?: number) => {
  const [state, setState] = useState<LongPollState>({
    lobbies: [],
    isLoading: !!tournamentId,
  });
  const lastUpdateRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!tournamentId) {
      setState({ lobbies: [], isLoading: false });
      lastUpdateRef.current = undefined;
      return;
    }

    let isActive = true;

    const poll = async (since?: string) => {
      if (!isActive) return;
      try {
        const response = await longPollLobbies(tournamentId, {
          since,
          timeoutMs: 15000,
        });
        if (!isActive) return;

        if (response) {
          handleUpdate(response);
          lastUpdateRef.current = response.lastUpdate;
          poll(response.lastUpdate);
        } else {
          poll(since);
        }
      } catch (error) {
        if (!isActive) return;
        setState((prev) => ({
          ...prev,
          error,
          isLoading: false,
        }));
        setTimeout(() => poll(since), 2000);
      }
    };

    const handleUpdate = (payload: LongPollLobbiesResponse) => {
      setState({
        lobbies: payload.lobbies,
        lastUpdate: payload.lastUpdate,
        isLoading: false,
        error: undefined,
      });
    };

    setState((prev) => ({ ...prev, isLoading: true }));
    poll(lastUpdateRef.current);

    return () => {
      isActive = false;
    };
  }, [tournamentId]);

  return state;
};


