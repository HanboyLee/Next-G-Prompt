"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export interface PromptInput {
  title: string
  content: string
  description?: string
  tags?: string
  variables?: string // JSON stringified
  collectionId?: string
}

// Dev mode: create a default user if not exists
async function getOrCreateDevUser() {
  const devEmail = "dev@localhost"
  let user = await prisma.user.findUnique({ where: { email: devEmail } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: devEmail,
        name: "Dev User",
      }
    })
  }
  return user.id
}

export async function createPrompt(data: PromptInput) {
  const session = await auth()
  let userId = session?.user?.id
  
  // In development, use a dev user if not authenticated
  if (!userId && process.env.NODE_ENV !== "production") {
    userId = await getOrCreateDevUser()
  }
  
  if (!userId) {
    return { success: false, error: "Please sign in to save prompts" }
  }

  try {
    const prompt = await prisma.prompt.create({
      data: {
        title: data.title || "Untitled Prompt",
        content: data.content,
        description: data.description,
        tags: data.tags,
        variables: data.variables,
        userId: userId,
        collectionId: data.collectionId || null,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, data: prompt }
  } catch (error) {
    console.error("Failed to create prompt:", error)
    return { success: false, error: "Failed to create prompt" }
  }
}

export async function updatePrompt(id: string, data: Partial<PromptInput>) {
  const session = await auth()
  let userId = session?.user?.id
  
  if (!userId && process.env.NODE_ENV !== "production") {
    userId = await getOrCreateDevUser()
  }
  
  if (!userId) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    // Verify ownership
    const existing = await prisma.prompt.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existing || existing.userId !== userId) {
      return { success: false, error: "Prompt not found or unauthorized" }
    }

    const prompt = await prisma.prompt.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        description: data.description,
        tags: data.tags,
        variables: data.variables,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, data: prompt }
  } catch (error) {
    console.error("Failed to update prompt:", error)
    return { success: false, error: "Failed to update prompt" }
  }
}

export async function deletePrompt(id: string) {
  const session = await auth()
  let userId = session?.user?.id
  
  if (!userId && process.env.NODE_ENV !== "production") {
    userId = await getOrCreateDevUser()
  }
  
  if (!userId) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const existing = await prisma.prompt.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existing || existing.userId !== userId) {
      return { success: false, error: "Prompt not found or unauthorized" }
    }

    await prisma.prompt.delete({ where: { id } })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete prompt:", error)
    return { success: false, error: "Failed to delete prompt" }
  }
}

export async function getPrompts() {
  const session = await auth()
  let userId = session?.user?.id
  
  if (!userId && process.env.NODE_ENV !== "production") {
    userId = await getOrCreateDevUser()
  }
  
  if (!userId) {
    return []
  }

  return prisma.prompt.findMany({
    where: { userId: userId },
    orderBy: { updatedAt: "desc" },
  })
}

export async function getPrompt(id: string) {
  const session = await auth()
  let userId = session?.user?.id
  
  if (!userId && process.env.NODE_ENV !== "production") {
    userId = await getOrCreateDevUser()
  }
  
  if (!userId) {
    return null
  }

  return prisma.prompt.findFirst({
    where: { 
      id,
      userId: userId 
    },
  })
}
