import { Gif } from "../interfaces/gif.interface";
import { GiphyItem } from "../interfaces/giphy.interfaces";

export class GifMapper {
    static mapGiphyResponseToGif(giphyData: GiphyItem): Gif {
        return {
            id: giphyData.id,
            title: giphyData.title,
            url: giphyData.images.original.url
        };
    }

    static mapGiphyResponseArrayToGifArray(giphyDataArray: GiphyItem[]): Gif[] {
        return giphyDataArray.map(this.mapGiphyResponseToGif);
    }
}