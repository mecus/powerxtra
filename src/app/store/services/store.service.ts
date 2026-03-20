import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private store = inject(Store<any>);

  updateMediaState(state: string) {
    this.store.dispatch({type: '[ MEDIA ] Update Media', media: state});
  }
  getMediaState() {
    return this.store.pipe(select('media'));
  }

  getRadioState() { // including now playing
    return this.store.pipe(select('radio'));
  }
  getAuthUser() {
    return this.store.pipe(select('user'));
  }

}
