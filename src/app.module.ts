import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { MongooseModule } from '@nestjs/mongoose';  

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://abdallah:uZL45zSX5Wyq5NLp@cluster0.uh245.mongodb.net/tmdb-db-test'),
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
