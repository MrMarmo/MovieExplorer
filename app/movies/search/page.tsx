import SearchResults from "./SearchResults"
import SearchHeader from "@/components/SearchHeader"

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ query: string }>
}) {
    const params = await searchParams
    
    if (!params.query) {
        return (
            <>
                <SearchHeader />
                <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">No search query</h2>
                        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Please enter a search term</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <SearchHeader initialQuery={params.query} />
            <SearchResults query={params.query} />
        </>
    )
}