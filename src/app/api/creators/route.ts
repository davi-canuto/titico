import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const creators = await prisma.creator.findMany({
    where: { active: true },
    select: { id: true, slug: true, name: true, champion: true, description: true, avatarUrl: true, bannerUrl: true },
  })
  return NextResponse.json(creators)
}
