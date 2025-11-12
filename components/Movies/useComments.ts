'use client'

import { Comment } from "@/model/temp.interface"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

interface CommentsResponse {
    comments: Comment[]
    userComment: Comment | null
}

export function useComments(movieId: string) {
    const [content, setContent] = useState("")
    const [rating, setRating] = useState(5)
    const [hoveredStar, setHoveredStar] = useState(0)
    const [isEditing, setIsEditing] = useState(false)
    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery({
        queryKey: ['comments', movieId],
        queryFn: async () => {
            const res = await fetch(`/api/movies/${movieId}/comments`)
            if (!res.ok) throw new Error('Failed to fetch comments')
            const json = await res.json()
            return json.data as CommentsResponse
        }
    })

    // Pre-fill if user has a comment
    useEffect(() => {
        if (data?.userComment) {
            setContent(data.userComment.content)
            setRating(data.userComment.rating)
            setIsEditing(true)
        }
    }, [data?.userComment])

    const createCommentMutation = useMutation({
        mutationFn: async (newComment: { content: string; rating: number }) => {
            const res = await fetch(`/api/movies/${movieId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newComment)
            })
            if (!res.ok) throw new Error('Failed to create comment')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', movieId] })
        }
    })

    const deleteCommentMutation = useMutation({
        mutationFn: async () => {
            if (!data?.userComment?.id) return
            const res = await fetch(`/api/movies/${movieId}/comments`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment_id: data.userComment.id })
            })
            if (!res.ok) throw new Error('Failed to delete comment')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', movieId] })
            setContent("")
            setRating(5)
            setIsEditing(false)
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (content.trim()) {
            createCommentMutation.mutate({ content: content.trim(), rating })
        }
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete your review?')) {
            deleteCommentMutation.mutate()
        }
    }

    const setRatingValue = (value: number) => {
        setRating(value)
    }

    return {
        // State
        content,
        setContent,
        rating,
        setRating: setRatingValue,
        hoveredStar,
        setHoveredStar,
        isEditing,

        // Data
        comments: data?.comments ?? [],
        userComment: data?.userComment,
        isLoading,
        error,

        // Mutations
        handleSubmit,
        handleDelete,
        isSubmitting: createCommentMutation.isPending,
        isDeleting: deleteCommentMutation.isPending,
    }
}
