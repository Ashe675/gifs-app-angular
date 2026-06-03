import { Component, inject } from '@angular/core';
import { GifList } from "../../components/gif-list/gif-list";
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'app-trending-page',
  imports: [GifList],
  templateUrl: './trending-page.html',
  styles: ``,
})
export class TrendingPage { 
  gifsService = inject(GifsService);
}
