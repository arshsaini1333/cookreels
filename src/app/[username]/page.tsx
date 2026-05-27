import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'
import type { Metadata } from 'next'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PublicProfilePage } from '@/components/profile/PublicProfilePage'

type Props = {
  params: Promise<{ username: string }>
}

// ─── Cached DB fetch (shared between generateMetadata and Page) ───────────────

const fetchUser = cache(async (username: string) => {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id:               true,
      firstName:        true,
      lastName:         true,
      username:         true,
      bio:              true,
      profileImage:     true,
      cuisineSpecialty: true,
      level:            true,
      isVerified:       true,
      isOnline:         true,
      _count: {
        select: {
          recipes:   { where: { isPublished: true } },
          reels:     { where: { isPublished: true } },
          followers: true,
          following: true,
        },
      },
      recipes: {
        where:   { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take:    9,
        select: {
          id:         true,
          title:      true,
          coverImage: true,
          cookTime:   true,
          prepTime:   true,
          likeCount:  true,
          difficulty: true,
        },
      },
      reels: {
        where:   { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take:    12,
        select: {
          id:           true,
          title:        true,
          thumbnailUrl: true,
          duration:     true,
          viewCount:    true,
          likeCount:    true,
        },
      },
    },
  })
})

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const user = await fetchUser(username)

  if (!user) {
    return { title: 'User not found | CookReels' }
  }

  const fullName   = `${user.firstName} ${user.lastName}`
  const title      = `${fullName} (@${username}) | CookReels`
  const description = user.bio
    ?? `View ${fullName}'s recipes and cooking reels on CookReels.`

  return {
    title,
    description,
    openGraph: {
      type:        'profile',
      title,
      description,
      url:         `/${username}`,
      images:      user.profileImage ? [{ url: user.profileImage }] : [],
      firstName:   user.firstName,
      lastName:    user.lastName,
      username,
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      user.profileImage ? [user.profileImage] : [],
    },
    alternates: {
      canonical: `/${username}`,
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Page({ params }: Props) {
  const { username } = await params

  const [user, session] = await Promise.all([
    fetchUser(username),
    getSession(),
  ])

  if (!user) notFound()

  // Redirect own profile to /profile
  if (session?.userId === user.id) {
    redirect('/profile')
  }

  // Compute friends count, follow relationship, and logged-in user's name in parallel
  const [friendsCount, followRelation, currentViewer] = await Promise.all([
    // Friends of the profile user = mutual follows
    prisma.user.count({
      where: {
        AND: [
          { followers: { some: { followerId:  user.id } } },
          { following: { some: { followingId: user.id } } },
        ],
      },
    }),
    // Current viewer's relationship with the profile user
    session
      ? Promise.all([
          prisma.follow.findFirst({
            where: { followerId: session.userId, followingId: user.id },
            select: { id: true },
          }),
          prisma.follow.findFirst({
            where: { followerId: user.id, followingId: session.userId },
            select: { id: true },
          }),
        ])
      : Promise.resolve([null, null] as const),
    // Logged-in user's first name for the sidebar/navbar
    session
      ? prisma.user.findUnique({
          where: { id: session.userId },
          select: { firstName: true },
        })
      : Promise.resolve(null),
  ])

  const [fwdRecord, revRecord] = followRelation
  const isFollowing  = !!fwdRecord
  const isFollowedBy = !!revRecord

  return (
    <PublicProfilePage
      user={{
        id:               user.id,
        name:             `${user.firstName} ${user.lastName}`,
        username:         `@${user.username}`,
        bio:              user.bio,
        verified:         user.isVerified,
        isOnline:         user.isOnline,
        topChef:          user._count.recipes >= 10,
        level:            user.level ?? 'Home Chef',
        avatar:           user.profileImage,
        cuisineSpecialty: user.cuisineSpecialty,
      }}
      stats={{
        recipes:   user._count.recipes,
        reels:     user._count.reels,
        followers: user._count.followers,
        following: user._count.following,
        friends:   friendsCount,
      }}
      initialRecipes={user.recipes.map(r => ({
        id:         r.id,
        title:      r.title,
        coverImage: r.coverImage,
        cookTime:   r.cookTime,
        prepTime:   r.prepTime,
        likeCount:  r.likeCount,
        difficulty: r.difficulty as string | null,
      }))}
      initialReels={user.reels.map(r => ({
        id:           r.id,
        title:        r.title,
        thumbnailUrl: r.thumbnailUrl,
        duration:     r.duration,
        viewCount:    r.viewCount,
        likeCount:    r.likeCount,
      }))}
      totalRecipes={user._count.recipes}
      totalReels={user._count.reels}
      currentUserId={session?.userId ?? null}
      currentUserName={currentViewer?.firstName ?? 'Chef'}
      initialIsFollowing={isFollowing}
      initialIsFollowedBy={isFollowedBy}
    />
  )
}
