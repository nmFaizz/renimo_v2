import SearchPageContainer from "@/app/home/[search]/containers/SearchPageContainer";

export default async function SearchPage({
    params,
}: {
    params: Promise<{ search: string }>;  
}) {
    const { search } = await params

    return <SearchPageContainer search={search} />
}