"use client"

import { Player } from "@/types"

export default function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="p-2 border rounded shadow flex flex-col">
      <h3 className="font-semibold">{player.name}</h3>
      {player.position && <p className="text-sm text-gray-400">{player.position}</p>}
      {player.nationality && <p className="text-sm text-gray-400">{player.nationality}</p>}
      {player.dateOfBirth && (
        <p className="text-sm text-gray-500">
          Né le : {new Date(player.dateOfBirth).toLocaleDateString("fr-FR")}
        </p>
      )}
    </div>
  )
}
