import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Movie extends Document {
    @Prop({ type: Number, required: true, unique: true })
    tmdbId: number;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    overview: string;

    @Prop()
    releaseDate: string;

    @Prop()
    genres: number[];

    @Prop()
    popularity: number;

    @Prop()
    voteAverage: number;

    @Prop()
    voteCount: number;

    @Prop({ default: false })
    isOnWatchlist: boolean;

    @Prop({ default: false })
    isFavorite: boolean;

    @Prop({ type: [Number], default: [] })
    ratings: number[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);