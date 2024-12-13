import { Module } from '@nestjs/common';  
import { MongooseModule } from '@nestjs/mongoose';  
import { MoviesController } from './movies.controller';  
import { MovieService } from './movies.service';  
import { Movie, MovieSchema } from './entities/movie.entity';  
import { TmdbService } from './tmdb.service';  
import { HttpModule } from '@nestjs/axios';  

@Module({  
  imports: [  
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),  
    HttpModule, // Import HttpModule to use HttpService  
  ],  
  controllers: [MoviesController],  
  providers: [MovieService, TmdbService],  
})  
export class MoviesModule {}