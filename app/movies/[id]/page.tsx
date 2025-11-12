import DetailView from "./DetailView"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function MovieDetailPage({ params }: PageProps) {
    const { id } = await params
    
    return <DetailView movieId={id} />
}
