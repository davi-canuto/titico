'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import * as userService from '@/services/user.service'

export async function updateHeroSkin(skinNum: string): Promise<void> {
  const session = await auth()
  if (!session?.user?.id) throw new Error('UNAUTHORIZED')
  await userService.updateHeroSkin(session.user.id, skinNum)
  revalidatePath('/dashboard')
}
