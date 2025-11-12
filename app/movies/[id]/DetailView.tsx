import { MovieDetail } from "@/model/temp.interface"
import Image from "next/image"
import Link from "next/link"
import Comments from "@/components/Movies/Comments"
import FavoriteButton from "@/components/Movies/FavoriteButton"

interface DetailViewProps {
    movieId: string
}

async function getMovieDetail(id: string): Promise<MovieDetail> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/movies/${id}/detail`, {
        cache: 'force-cache',
    })
    
    if (!res.ok) {
        throw new Error('Failed to fetch movie details')
    }
    
    const data = await res.json()
    return data.data
}

export default async function DetailView({ movieId }: DetailViewProps) {
    const movie = await getMovieDetail(movieId)
    
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/placeholder-movie.png'
    
    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const formatRuntime = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours}h ${mins}m`
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            {/* Backdrop */}
            {backdropUrl && (
                <div className="relative h-96 w-full">
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-zinc-50/50 to-zinc-50 dark:via-black/50 dark:to-black z-10" />
                    <Image
                        unoptimized
                        src={backdropUrl}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-8"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Poster */}
                    <div className="lg:col-span-1">
                        <div className="relative aspect-2/3 w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-2xl">
                            <Image
                                unoptimized
                                src={posterUrl}
                                alt={movie.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title and Tagline */}
                        <div>
                            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                                {movie.title}
                            </h1>
                            {movie.tagline && (
                                <p className="text-xl text-zinc-600 dark:text-zinc-400 italic">
                                    "{movie.tagline}"
                                </p>
                            )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-semibold text-zinc-900 dark:text-white">
                                    {movie.vote_average.toFixed(1)}
                                </span>
                                <span className="text-zinc-600 dark:text-zinc-400">
                                    ({movie.vote_count.toLocaleString()} votes)
                                </span>
                            </div>
                            
                            {movie.release_date && (
                                <span className="text-zinc-600 dark:text-zinc-400">
                                    {new Date(movie.release_date).getFullYear()}
                                </span>
                            )}
                            
                            {movie.runtime > 0 && (
                                <span className="text-zinc-600 dark:text-zinc-400">
                                    {formatRuntime(movie.runtime)}
                                </span>
                            )}
                            
                            <span className="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                {movie.status}
                            </span>
                        </div>

                        {/* Genres */}
                        {movie.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {movie.genres.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-sm font-medium"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Overview */}
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                                Overview
                            </h2>
                            <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                {movie.overview || 'No overview available.'}
                            </p>
                        </div>

                        {/* Additional Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                            {movie.budget > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                                        Budget
                                    </h3>
                                    <p className="text-lg text-zinc-900 dark:text-white">
                                        {formatCurrency(movie.budget)}
                                    </p>
                                </div>
                            )}

                            {movie.revenue > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                                        Revenue
                                    </h3>
                                    <p className="text-lg text-zinc-900 dark:text-white">
                                        {formatCurrency(movie.revenue)}
                                    </p>
                                </div>
                            )}

                            {movie.release_date && (
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                                        Release Date
                                    </h3>
                                    <p className="text-lg text-zinc-900 dark:text-white">
                                        {new Date(movie.release_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            )}

                            {movie.original_language && (
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                                        Original Language
                                    </h3>
                                    <p className="text-lg text-zinc-900 dark:text-white uppercase">
                                        {movie.original_language}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Production Companies */}
                        {movie.production_companies.length > 0 && (
                            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
                                    Production Companies
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {movie.production_companies.map((company) => (
                                        <div
                                            key={company.id}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                                        >
                                            {company.logo_path && (
                                                <div className="relative w-8 h-8">
                                                    <Image
                                                        unoptimized
                                                        src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                                                        alt={company.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            )}
                                            <span className="text-sm text-zinc-900 dark:text-white">
                                                {company.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* External Links */}
                        <div className="flex flex-wrap gap-4 pt-6">
                            <FavoriteButton movieId={movie.id} />
                            
                            {movie.homepage && (
                                <a
                                    href={movie.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-80 transition-opacity"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Official Website
                                </a>
                            )}
                            
                            {movie.imdb_id && (
                                <a
                                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" />
                                    </svg>
                                    View on IMDb
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Comments */}
                <Comments movieId={movieId} />
            </div>
        </div>
    )
}
