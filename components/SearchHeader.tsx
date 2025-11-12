'use client'

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function SearchHeader({ initialQuery = "" }: { initialQuery?: string }) {
    const [query, setQuery] = useState(initialQuery)
    const router = useRouter()

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/movies/search?query=${encodeURIComponent(query.trim())}`)
        }
    }

    return (
        <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    {/* Logo/Title */}
                    <button
                        onClick={() => router.push('/')}
                        className="text-xl font-bold text-zinc-900 dark:text-white hover:opacity-80 transition-opacity whitespace-nowrap"
                    >
                        Movie Explorer
                    </button>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
                        <div className="group relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-zinc-400 group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-300 transition-colors"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for movies..."
                                className="w-full rounded-full border border-zinc-300 bg-white py-2 pl-10 pr-24 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
                            />
                            <button
                                type="submit"
                                disabled={!query.trim()}
                                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:focus:ring-zinc-700"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Favorites Link */}
                    <button
                        onClick={() => router.push('/movies/favorites')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap"
                        title="My Favorites"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="hidden sm:inline">Favorites</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
