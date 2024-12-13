export interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    genre_ids: number[];
    popularity: number;
    vote_average: number;
    vote_count: number;
}

export interface TMDBResponse {
    page: number;
    total_results: number;
    total_pages: number;
    results: TMDBMovie[];
}
