import { Controller, Get, Post, Param, Body, Put, Delete, Query } from '@nestjs/common';  
import { MovieService } from './movies.service';  
import { CreateMovieDto } from './dto/create-movie.dto';  
import { UpdateMovieDto } from './dto/update-movie.dto';  
import { Movie } from './entities/movie.entity'; 
import { TmdbService } from './tmdb.service'; 

@Controller('movies')  
export class MoviesController {  
  constructor(
    private readonly movieService: MovieService,
    private readonly tmdbService: TmdbService,
  ) {}  

  @Get('tmdb')  
  async fetchPopularMovies(@Query('page') page: number) {  
    return this.tmdbService.fetchPopularMovies(page);  
  }
  
  @Get('search')  
  async fetchMoviesBySearch(@Query('query') query: string) {  
    return this.tmdbService.searchMovies(query, 1);  
  }
  
  @Get('genre')  
  async fetchMoviesByGenre(@Query('genreId') genreId: number) {  
    return this.tmdbService.fetchMoviesByGenre(genreId);  
  }
  
  @Get(':id/tmdb')  
  async getMovieFromTmdbById(@Param('id') id: number) {  
    return this.tmdbService.fetchMovieById(id);  
  }
  
  /* @Get('watchlist')  
  async getWatchlistMovies() {  
    return this.movieService.findOnWatchlist();  
  } */
    @Get('populate')  
    async populateDatabase(@Query('page') page: string) { 
      const pageNumber = parseInt(page, 10) || 1; 
      await this.movieService.populateDatabase(pageNumber);  
      return { message: `Page ${page} of popular movies populated successfully!` };  
    } 

    @Get('db')
    async findAll() {  
      return this.movieService.findAll();  
    } 
    
  @Post()  
  async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {  
    return this.movieService.create(createMovieDto);  
  }  

  @Get(':id')
  async getMovieById(@Param('id') id: number) {
  return this.movieService.findById(+id);  // Convert 'id' to number if necessary
  }

  @Get('tmdb/:id')  
  async getMovieFromTmdb(@Param('id') id: number) {  
    return this.movieService.fetchMovieByTmdbId(id);  
  }  

  @Put(':id')
  async updateMovie(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
  return this.movieService.update(Number(id), updateMovieDto); // Convert `id` to number
  }
  
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.movieService.remove(Number(id));
  }  

  @Post('watchlist/:id')  
  async addToWatchlist(@Param('id') id: string) {
    return this.movieService.addToWatchlist(id);
  }  

  @Post('rate/:id')
  async rateMovie(
    @Param('id') id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.movieService.rateMovie(id, updateMovieDto);
  }
  
}