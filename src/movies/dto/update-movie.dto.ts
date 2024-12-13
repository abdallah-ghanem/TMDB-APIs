import { IsNumber, IsOptional, IsString, } from 'class-validator';
//import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    overview?: string;

    @IsOptional()
    releaseDate?: string;

    @IsOptional()
    @IsString({ each: true })
    genres?: number[];

    @IsOptional()
    @IsNumber()
    popularity?: number;

    @IsOptional()
    @IsNumber()
    voteAverage?: number;

    @IsOptional()
    @IsNumber()
    voteCount?: number;

    @IsOptional()
    isOnWatchlist?: boolean;

    @IsOptional()
    isFavorite?: boolean;

    @IsOptional()
    @IsNumber()
    rating?: number;
}