import clsx from "clsx";
import type { FC } from "react";
import { Table } from "@mantine/core";
import type { Player } from "../../entitity/Player";

type PlayerTableProps = {
  className?: string;
  data: Player[];
  lobbyKey?: string;
};

export const PlayerTable: FC<PlayerTableProps> = ({
  className,
  lobbyKey,
  data,
}) => {
  return (
    <Table
      className={clsx("", className)}
      striped
      highlightOnHover
      verticalSpacing="xs"
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th className="text-center!">№</Table.Th>
          <Table.Th className="text-center!">Никнейм</Table.Th>
          <Table.Th className="text-center!">MMR</Table.Th>
          <Table.Th className="text-center!">Роль</Table.Th>
          <Table.Th className="text-center!">Кол-во жизней</Table.Th>
          <Table.Th className="text-center!">Chill Zone</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody className="text-center">
        {data.map((player, i) => {
          const safeId = player.id || `${lobbyKey}-${i}`;
          return (
            <Table.Tr key={`${lobbyKey}-${safeId}`}>
              <Table.Td>{i + 1}</Table.Td>
              <Table.Td>{player.nickname}</Table.Td>
              <Table.Td>{player.mmr}</Table.Td>
              <Table.Td>{player.role}</Table.Td>
              <Table.Td>{player.lives}</Table.Td>
              <Table.Td>{player.chillZoneValue}</Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};
