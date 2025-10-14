// app/api/teams/info/[teamId]/route.ts
import { NextResponse } from "next/server"
import axios from "axios"

const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "https://api.football-data.org/v4"

export async function GET(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  const { teamId } = await params
  try {
    const res = await axios.get(`${BASE_URL}/teams/${teamId}`, {
      headers: { "X-Auth-Token": API_KEY ?? "" },
    })
    return NextResponse.json(res.data)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: "Impossible de récupérer les informations de l'équipe" },
      { status: 500 }
    )
  }
}
