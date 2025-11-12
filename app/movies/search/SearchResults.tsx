'use client'

import { MovieSearchResponse } from "@/model/temp.interface"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { MovieCard, MovieCardSkeleton } from "@/components/Movies/MovieCard"

interface SearchResultsProps {
    query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
    const observerTarget = useRef<HTMLDivElement>(null)

    const queryKey = ['search-movies', query]

    const {
        data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error
    } = useInfiniteQuery({
        queryKey: queryKey,
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const res = await fetch(`/api/movies/search?title=${encodeURIComponent(query)}&page=${pageParam}`)
            if (!res.ok) {
                throw new Error('Failed to fetch movies')
            }
            return res.json() as Promise<{ data: MovieSearchResponse }>
        },
        getNextPageParam: (lastPage, allPages) => {
            const currentPage = allPages.length
            const totalPages = lastPage.data.total_pages
            if (totalPages && currentPage < totalPages) {
                return currentPage + 1
            } else {
                return undefined
            }
        },
    })

    const movies = data?.pages.flatMap(page => page.data.results) || []

    // Calculate skeleton cards needed to fill the current row
    const getSkeletonCount = () => {
        const gridCols = {
            base: 2,
            sm: 3,
            md: 4,
            lg: 5,
            xl: 6,
        }
        const cols = gridCols.xl // just use xl for now
        const remainder = movies.length % cols

        return remainder === 0 ? cols : cols - remainder + cols
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            { threshold: 0.5 }
        )

        const currentTarget = observerTarget.current
        if (currentTarget) {
            observer.observe(currentTarget)
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget)
            }
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    if (status === 'pending') {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="h-8 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <MovieCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Error loading movies</h2>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">{error.message}</p>
                </div>
            </div>
        )
    }

    if (movies.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="text-center">
                    <svg className="mx-auto h-24 w-24 text-zinc-400 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">No movies found</h2>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">Try searching for something else</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                        Search results for "{query}"
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        {data?.pages[0]?.data.total_results?.toLocaleString() || 0} movies found
                    </p>
                </div>

                {/* Movie Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                    {isFetchingNextPage && Array.from({ length: getSkeletonCount() }).map((_, i) => (
                        <MovieCardSkeleton key={`loading-${i}`} />
                    ))}
                </div>

                {/* Intersection Observer Target */}
                {hasNextPage && <div ref={observerTarget} className="h-10 mt-8" />}
            </div>
        </div>
    )
}
