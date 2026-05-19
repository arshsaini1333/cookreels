import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { FriendshipStatus } from '@/generated/prisma'
import { ProfilePage } from '@/components/profile/ProfilePage'

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/auth/login')

  const [user, friendsCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        bio: true,
        profileImage: true,
        cuisineSpecialty: true,
        level: true,
        isVerified: true,
        isOnline: true,
        _count: {
          select: {
            recipes: { where: { isPublished: true } },
            reels:   { where: { isPublished: true } },
            followers: true,
            following: true,
          },
        },
        recipes: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
          take: 9,
          select: {
            id: true,
            title: true,
            coverImage: true,
            cookTime: true,
            prepTime: true,
            likeCount: true,
            difficulty: true,
          },
        },
        reels: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
          take: 12,
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            duration: true,
            viewCount: true,
            likeCount: true,
          },
        },
        collections: {
          orderBy: { createdAt: 'desc' },
          take: 4,
          select: {
            id: true,
            name: true,
            savedRecipes: {
              take: 4,
              select: {
                recipe: { select: { coverImage: true } },
              },
            },
            _count: {
              select: {
                savedRecipes: true,
                savedReels: true,
              },
            },
          },
        },
      },
    }),
    prisma.friendship.count({
      where: {
        status: FriendshipStatus.ACCEPTED,
        OR: [
          { userId1: session.userId },
          { userId2: session.userId },
        ],
      },
    }),
  ])

  if (!user) redirect('/auth/login')

  return (
    <ProfilePage
      user={{
        name: `${user.firstName} ${user.lastName}`,
        username: `@${user.username}`,
        bio: user.bio,
        verified: user.isVerified,
        isOnline: user.isOnline,
        topChef: user._count.recipes >= 10,
        level: user.level ?? 'Home Chef',
        avatar: user.profileImage,
        cuisineSpecialty: user.cuisineSpecialty,
      }}
      stats={{
        recipes: user._count.recipes,
        reels: user._count.reels,
        followers: user._count.followers,
        following: user._count.following,
        friends: friendsCount,
      }}
      recipes={user.recipes.map(r => ({
        id: r.id,
        title: r.title,
        coverImage: r.coverImage,
        cookTime: r.cookTime,
        prepTime: r.prepTime,
        likeCount: r.likeCount,
        difficulty: r.difficulty,
      }))}
      reels={user.reels.map(r => ({
        id: r.id,
        title: r.title,
        thumbnailUrl: r.thumbnailUrl,
        duration: r.duration,
        viewCount: r.viewCount,
        likeCount: r.likeCount,
      }))}
      collections={user.collections.map(c => ({
        id: c.id,
        name: c.name,
        itemCount: c._count.savedRecipes + c._count.savedReels,
        previewImages: c.savedRecipes
          .map(sr => sr.recipe.coverImage)
          .filter((img): img is string => img !== null),
      }))}
    />
  )
}
