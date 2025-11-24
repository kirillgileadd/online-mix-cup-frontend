export const ROUTES = {
  root: "/",
  login: "/login",
  adminUsers: "/admin/users",
  adminTournaments: "/admin/tournaments",
  adminTournament: (id: number) => `/admin/tournaments/${id}`,
  adminApplications: "/admin/applications",
  adminPlayers: "/admin/players",
  forbidden: "/forbidden",
  publicTournaments: "/tournaments",
  publicTournament: (id: number) => `/tournaments/${id}`,
} as const;

type PathToTuple<T> = T extends `/${infer P1}/${infer Rest}`
  ? [P1, ...PathToTuple<`/${Rest}`>]
  : T extends `/${infer P1}`
    ? [P1]
    : never;

type FilterPathParams<T extends string[]> = T[number] extends infer R
  ? R extends `:${infer P}`
    ? P
    : never
  : never;

type PathToParams<T> = Record<FilterPathParams<PathToTuple<T>>, string>;

export function replaceParams<T extends `${string}:${string}`>(
  route: T,
  params: PathToParams<T>,
): string;
export function replaceParams(
  route: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any,
) {
  return route
    .toString()
    .replace(/:(\w+)/g, (_match, key) => params[key] || "");
}
