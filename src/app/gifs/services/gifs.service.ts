import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class GifsService {
    private http = inject(HttpClient);
    private apiKey = environment.giphyApiKey;
    private apiUrl = environment.giphyApiUrl;
    trendingGifs = signal<Gif[]>([]);
    trendingGifsLoading = signal(true);
    searchHistory = signal<Record<string, Gif[]>>({});
    searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

    constructor() {
        this.loadTrendingGifs();
    }

    loadTrendingGifs() {
        this.http.get<GiphyResponse>(`${this.apiUrl}/gifs/trending`, {
            params: {
                api_key: this.apiKey,
                limit: '20',
            }
        }).subscribe({
            next: (response) => {
                const gifs = GifMapper.mapGiphyResponseArrayToGifArray(response.data);
                this.trendingGifs.set(gifs);
                this.trendingGifsLoading.set(false);
            },
            error: (error) => {
                console.error('Error fetching gifs:', error);
            },
            complete: () => {
                this.trendingGifsLoading.set(false);
            }
        });
    }

    searchGifs(query: string) {
        return this.http.get<GiphyResponse>(`${this.apiUrl}/gifs/search`, {
            params: {
                api_key: this.apiKey,
                limit: '20',
                q: query
            }
        }).pipe(
            map(({ data }) => GifMapper.mapGiphyResponseArrayToGifArray(data)),
            tap((gifs) => {
                this.searchHistory.update((history) => ({
                    ...history,
                    [query.toLowerCase()]: gifs
                }));
            })
        )
    }


}