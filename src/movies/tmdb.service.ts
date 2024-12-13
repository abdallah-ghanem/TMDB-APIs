import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { TMDBResponse } from './tmdb-response.interface';

@Injectable()
export class TmdbService {
    private readonly apiKey = '3c5af44d51ce89d48dd3dff3894d14d3'; // Replace with your API key  
    private readonly baseUrl = 'https://api.themoviedb.org/3';

    constructor(private httpService: HttpService) { }

    async fetchPopularMovies(page: number): Promise<TMDBResponse> {
        try {
            const response = await lastValueFrom(this.httpService.get<TMDBResponse>(
                `${this.baseUrl}/movie/popular`,
                {
                    params: { api_key: this.apiKey, page },
                },
            ));
            return response.data;  // Return the movie data properly  
        } catch (error) {
            throw new Error(`Failed to fetch popular movies: ${error.response?.data?.status_message || error.message}`);
        }
    }

    async searchMovies(query: string, page: number): Promise<TMDBResponse> {
        const response = await lastValueFrom(this.httpService.get<TMDBResponse>(
            `${this.baseUrl}/search/movie`,
            {
                params: {
                    api_key: this.apiKey,
                    query,
                    language: 'en-US',
                    page,
                },
            },
        ));

        return response.data;  // Same extraction  
    }

    async fetchMoviesByGenre(genreId: number): Promise<TMDBResponse> {
        const response = await lastValueFrom(this.httpService.get<TMDBResponse>(
            `${this.baseUrl}/discover/movie`,
            {
                params: {
                    api_key: this.apiKey,
                    with_genres: genreId,
                },
            },
        ));

        return response.data;  // Same extraction  
    }

    async fetchMovieById(id: number): Promise<any> {
        const response$ = this.httpService.get<any>(
            `${this.baseUrl}/movie/${id}`,
            {
                params: { api_key: this.apiKey },
            },
        );
        return await lastValueFrom(response$);
    }

}