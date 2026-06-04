import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY = 'gifs';

const loadHistoryFromLocalStorage = (): Record<string, Gif[]> => {
    const gifs = localStorage.getItem(GIF_KEY);
    return gifs ? JSON.parse(gifs) : {};
}

@Injectable({ providedIn: 'root' })
export class GifsService {
    private http = inject(HttpClient);
    private apiKey = environment.giphyApiKey;
    private apiUrl = environment.giphyApiUrl;
    private trendingPage = signal(0);

    trendingGifs = signal<Gif[]>([]);
    trendingGifsLoading = signal(false);

    trendingGifGroup = computed<Gif[][]>(() => {
        const groups = [];

        for (let i = 0; i < this.trendingGifs().length; i += 3) {
            groups.push(this.trendingGifs().slice(i, i + 3));
        }

        return groups;
    });

    searchHistory = signal<Record<string, Gif[]>>(loadHistoryFromLocalStorage());
    searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));
    saveHistoryToLocalStorage = effect(() => {
        localStorage.setItem(GIF_KEY, JSON.stringify(this.searchHistory()));
    });

    constructor() {
        this.loadTrendingGifs();
    }

    loadTrendingGifs() {
        if (this.trendingGifsLoading()) return;
        this.trendingGifsLoading.set(true);

        this.http.get<GiphyResponse>(`${this.apiUrl}/gifs/trending`, {
            params: {
                api_key: this.apiKey,
                limit: '20',
                offset: this.trendingPage() * 20
            }
        }).subscribe({
            next: (response) => {
                const gifs = GifMapper.mapGiphyResponseArrayToGifArray(response.data);
                this.trendingGifs.update((prev) => prev.concat(gifs));
                this.trendingGifsLoading.set(false);
            },
            error: (error) => {
                console.error('Error fetching gifs:', error);
            },
            complete: () => {
                this.trendingGifsLoading.set(false);
                this.trendingPage.update((prev) => prev + 1);
            }
        });
    }

    searchGifs(query: string): Observable<Gif[]> {
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

    getHistoryGifs(query: string): Gif[] {
        return this.searchHistory()[query.toLowerCase()] ?? [];
    }


}