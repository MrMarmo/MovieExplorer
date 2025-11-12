'use client'

import { useComments } from "./useComments"

interface CommentsProps {
    movieId: string
}

export default function Comments({ movieId }: CommentsProps) {
    const {
        content,
        setContent,
        rating,
        setRating,
        hoveredStar,
        setHoveredStar,
        isEditing,
        comments,
        isLoading,
        error,
        handleSubmit,
        handleDelete,
        isSubmitting,
        isDeleting,
    } = useComments(movieId)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const renderStars = (currentRating: number, interactive: boolean = false) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type={interactive ? "button" : undefined}
                        disabled={!interactive}
                        onClick={() => interactive && setRating(star)}
                        onMouseEnter={() => interactive && setHoveredStar(star)}
                        onMouseLeave={() => interactive && setHoveredStar(0)}
                        className={interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}
                    >
                        <svg
                            className={`w-5 h-5 ${
                                star <= (interactive ? (hoveredStar || rating) : currentRating)
                                    ? 'text-yellow-500'
                                    : 'text-zinc-300 dark:text-zinc-700'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                ))}
            </div>
        )
    }

    return (
        <div className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
                Comments & Reviews
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-12">
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
                    {isEditing && (
                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Editing your existing review</span>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                            Your Rating
                        </label>
                        {renderStars(rating, true)}
                    </div>

                    <div>
                        <label htmlFor="comment" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                            Your Review
                        </label>
                        <textarea
                            id="comment"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your thoughts about this movie..."
                            rows={4}
                            maxLength={1000}
                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-zinc-500 dark:focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700"
                        />
                        <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 text-right">
                            {content.length}/1000
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={!content.trim() || isSubmitting || isDeleting}
                            className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting 
                                ? (isEditing ? 'Updating...' : 'Posting...') 
                                : (isEditing ? 'Update Review' : 'Post Review')}
                        </button>
                        
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isSubmitting || isDeleting}
                                className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Review'}
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {isLoading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 animate-pulse">
                                <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
                                <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
                                <div className="space-y-2">
                                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="text-center py-8">
                        <p className="text-red-600 dark:text-red-400">Failed to load comments</p>
                    </div>
                )}

                {comments && comments.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <svg className="w-16 h-16 mx-auto text-zinc-400 dark:text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-zinc-600 dark:text-zinc-400">No reviews yet. Be the first to review this movie!</p>
                    </div>
                )}

                {comments && comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-zinc-900 dark:text-white">
                                    {comment.guest_name}
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                    {renderStars(comment.rating)}
                                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                        {formatDate(comment.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {comment.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
