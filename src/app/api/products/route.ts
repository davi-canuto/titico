import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const creatorSlug = req.nextUrl.searchParams.get('creatorSlug')

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(creatorSlug ? { creator: { slug: creatorSlug } } : {}),
    },
    include: { creator: { select: { slug: true, name: true, champion: true } } },
  })

  const result = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    creator: product.creator,
    price: {
      amount: product.price,
      currency: 'BRL',
      formatted: (product.price / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
    },
  }))

  return NextResponse.json(result)
}
