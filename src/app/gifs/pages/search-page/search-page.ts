import { Component, inject, signal } from '@angular/core';
import { GifList } from "../../components/gif-list/gif-list";
import { GifsService } from '../../services/gifs.service';
import { Loader } from "src/app/shared/components/loader/loader";
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifList, Loader],
  templateUrl: './search-page.html',
})
export class SearchPage {
  gifsService = inject(GifsService);
  gifs = signal<Gif[]>([]);
  searchedGifsLoading = signal(false);

  onSearch(query: string) {
    this.searchedGifsLoading.set(true);
    query = query.trim();
    this.gifsService.searchGifs(query).subscribe({
      next: (gifs) => {
        this.gifs.set(gifs);
      },
      error: (error) => {
        console.error('Error fetching gifs:', error);
      },
      complete: () => {
        this.searchedGifsLoading.set(false);
      }
    });
  }

}
