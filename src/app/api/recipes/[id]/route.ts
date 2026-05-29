import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      select: {
        description:  true,
        servings:     true,
        commentCount: true,
        createdAt:    true,
        comments: {
          where:   { parentId: null },
          orderBy: { createdAt: 'desc' },
          take:    20,
          select: {
            id:        true,
            content:   true,
            likeCount: true,
            createdAt: true,
            user: {
              select: {
                username:     true,
                profileImage: true,
              },
            },
          },
        },
      },
    })

    if (!recipe) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({
      description:  recipe.description,
      servings:     recipe.servings,
      commentCount: recipe.commentCount,
      createdAt:    recipe.createdAt.toISOString(),
      comments: recipe.comments.map(c => ({
        id:          c.id,
        username:    c.user.username,
        userAvatar:  c.user.profileImage,
        text:        c.content,
        createdAt:   c.createdAt.toISOString(),
        likeCount:   c.likeCount,
      })),
    })
  } catch (error) {
    console.error('[recipes/[id] GET]', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
