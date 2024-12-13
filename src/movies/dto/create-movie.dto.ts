import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
//import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
    @IsNotEmpty()
    @IsNumber()
    tmdbId: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    overview: string;

    @IsString()
    releaseDate: string;

    @IsString({ each: true })
    genres: number[];

    popularity: number;

    voteAverage: number;

    voteCount: number;

    isOnWatchlist?: boolean;

    isFavorite?: boolean;
}