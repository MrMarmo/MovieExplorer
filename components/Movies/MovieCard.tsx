"use client";

import { Movie } from "@/model/temp.interface";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
    movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

    return (
        <Link
            href={`/movies/${movie.id}`}
            className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl dark:bg-zinc-900"
        >
            {/* Poster Image */}
            <div className="relative aspect-2/3 w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                {posterUrl ? (
                    <Image
                        src={posterUrl}
                        alt={movie.title}
                        unoptimized
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800">
                        <svg
                            className="h-16 w-16 text-zinc-400 dark:text-zinc-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                            />
                        </svg>
                    </div>
                )}

                {/* Rating Badge */}
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    <svg
                        className="h-3 w-3 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{movie.vote_average.toFixed(1)}</span>
                </div>
            </div>

            {/* Movie Info */}
            <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-2 line-clamp-2 text-base font-semibold text-zinc-900 dark:text-white">
                    {movie.title}
                </h3>
                <p className="mb-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {movie.overview}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-500">
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                    <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {movie.vote_count.toLocaleString()}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export function MovieCardSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md dark:bg-zinc-900">
            {/* Poster Skeleton */}
            <div className="relative aspect-2/3 w-full animate-pulse bg-linear-to-br from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800" />

            {/* Info Skeleton */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="space-y-2">
                    <div className="h-3 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3 w-4/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="mt-auto flex justify-between">
                    <div className="h-3 w-12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
            </div>
        </div>
    );
}
