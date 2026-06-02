import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
    private http = inject(HttpClient);
    private apiKey = environment.giphyApiKey;
    private apiUrl = environment.giphyApiUrl;

    constructor() {
        this.loadTrendingGifs();
    }

    loadTrendingGifs() {
        this.http.get<GiphyResponse>(`${this.apiUrl}/gifs/trending`, {
            params: {
                api_key: this.apiKey,
                limit: '20',
            }
        }).subscribe(console.log);
    }


}