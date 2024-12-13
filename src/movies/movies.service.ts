import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';  
import { InjectModel } from '@nestjs/mongoose';  
import { Model } from 'mongoose';  
import { Movie } from './entities/movie.entity';  
import { CreateMovieDto } from './dto/create-movie.dto';  
import { UpdateMovieDto } from './dto/update-movie.dto';  
import { TMDBMovie } from './tmdb-response.interface';  
import { TmdbService } from './tmdb.service';  
import { HttpService } from '@nestjs/axios';
import { TMDBResponse } from './tmdb-response.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()  
export class MovieService {  
  constructor(  private httpService: HttpService,
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,  
    private readonly tmdbService: TmdbService,  
  ) {}  
    private readonly tmdbApiKey = '3c5af44d51ce89d48dd3dff3894d14d3';// Replace with your API key  
    private readonly tmdbBaseUrl = 'https://api.themoviedb.org/3';

  async populateDatabase(page: number = 1): Promise<string> {
    try {
      const response$ = this.httpService.get<TMDBResponse>(
        `${this.tmdbBaseUrl}/movie/popular`,
        {
          params: {
            api_key: this.tmdbApiKey,
            language: 'en-US',
            page,
          },
        },
      );
      const response = await lastValueFrom(response$);
      const movies: TMDBMovie[] = response.data.results;

      for (const movie of movies) {
        const existingMovie = await this.movieModel.findOne({ tmdbId: movie.id }).exec();

        if (!existingMovie) {
          const newMovie = new this.movieModel({
            tmdbId: movie.id,
            title: movie.title,
            overview: movie.overview,
            releaseDate: movie.release_date,
            //genres: movie.genres?.map((genre) => genre.name) || [], // Add null check// Store genre IDs
            //genres: movie.genre_ids, // Store genre IDs
            genres: Array.isArray(movie.genre_ids) ? movie.genre_ids : [], // Ensure genres is an array
            popularity: movie.popularity,
            voteAverage: movie.vote_average,
            voteCount: movie.vote_count,
          });
          await newMovie.save();
        }
      }

      return `Page ${page} of popular movies populated successfully!`;
    } catch (error: any) {
      throw new HttpException(
        `Failed to populate database: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  } 

  /**
   * Retrieve all movies from MongoDB.
   * @returns Array of movie documents.
   */
  async findAll(): Promise<any[]> {  // Changing return type to 'any[]'
    const movies = await this.movieModel.find().exec();

    return movies.map(movie => {
      return {
        tmdbId: movie.tmdbId,
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.releaseDate,
        popularity: movie.popularity,
        voteAverage: movie.voteAverage,
        voteCount: movie.voteCount,
        genres: movie.genres,
        /* ratings: movie.ratings,
        averageRating: movie.averageRating, // Add calculated average rating */
      };
    });
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {  
    const movie = new this.movieModel(createMovieDto);  
    return movie.save();  
  }  

  async findById(id: number): Promise<any> {  // Updated to use number type
    const movie = await this.movieModel.findOne({ tmdbId: id }).exec();  // Query by numeric tmdbId
  
    if (!movie) {
      throw new Error(`Movie with ID ${id} not found`);
    }
  
    return {
      tmdbId: movie.tmdbId,
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.releaseDate,
      popularity: movie.popularity,
      voteAverage: movie.voteAverage,
      voteCount: movie.voteCount,
      genres: movie.genres,
      /* ratings: movie.ratings,
      averageRating: movie.averageRating, // Add calculated average rating */
    };
  }
  

  async fetchMovieByTmdbId(id: number): Promise<any> {  
    return this.tmdbService.fetchMovieById(id);  
  }  

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const updatedMovie = await this.movieModel
      .findOneAndUpdate({ tmdbId: id }, updateMovieDto, { new: true }) // Query by tmdbId
      .exec();
  
    if (!updatedMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  
    return updatedMovie;
  }
    

  async remove(id: number): Promise<Movie> {
    const deletedMovie = await this.movieModel.findOneAndDelete({ tmdbId: id }).exec();// Use findOneAndDelete for non-_id fields to delete id as a number 123456
    // findByIdAndDelete to delet id as string like 675bd62b5180b7414ce86787
    if (!deletedMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return deletedMovie;
  }  

  async addToWatchlist(id: string): Promise<Movie> {
    const movie = await this.movieModel.findOne({ tmdbId: id }).exec();
    if (!movie) {
      throw new NotFoundException(`Movie with TMDB ID ${id} not found`);
    }

    movie.isOnWatchlist = true;  // Mark movie as on watchlist
    await movie.save();
    return movie;
  }  

  async rateMovie(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.movieModel.findOne({ tmdbId: id }).exec();
    if (!movie) {
      throw new NotFoundException(`Movie with TMDB ID ${id} not found`);
    }
    movie.ratings.push(updateMovieDto.rating);
    await movie.save();
    return movie;
  }
}