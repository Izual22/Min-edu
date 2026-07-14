import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const people = await prisma.item.findMany();
  return NextResponse.json(people);
}

export async function POST(req: Request) {
  const data = await req.json();
  const person = await prisma.item.create({ data });
  return NextResponse.json(person, { status: 201 });
}