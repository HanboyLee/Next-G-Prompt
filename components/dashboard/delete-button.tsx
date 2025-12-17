"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { deletePrompt } from "@/app/actions/prompt"

interface DeleteButtonProps {
  promptId: string
  promptTitle: string
}

export function DeletePromptButton({ promptId, promptTitle }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    console.log("Delete button clicked for:", promptId, promptTitle)
    
    const confirmed = window.confirm(
      `确定要删除 "${promptTitle}" 吗？\n\n此操作无法撤销。`
    )
    
    console.log("User confirmed:", confirmed)
    
    if (!confirmed) return
    
    setIsDeleting(true)
    try {
      const result = await deletePrompt(promptId)
      if (result.success) {
        window.location.reload()
      } else {
        window.alert(`删除失败: ${result.error}`)
      }
    } catch (error) {
      window.alert("删除时发生错误")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="invisible group-hover:visible text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
      onClick={handleDelete}
      disabled={isDeleting}
      type="button"
    >
      {isDeleting ? "..." : "✕"}
    </Button>
  )
}


