import { Injectable } from '@angular/core';
import { backendApiUrl } from '../../../../environments/backend-api';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private http: HttpClient
  ){

  }

  listUser() {
    return lastValueFrom(this.http.get(`${backendApiUrl}/api/auth/list_users`));
  }
  updateUser(ID, patch) {
    return lastValueFrom(this.http.patch(`${backendApiUrl}/api/auth/update_user/${ID}`, patch));
  }
  deleteUser(ID) {
    return lastValueFrom(this.http.delete(`${backendApiUrl}/api/auth/delete_user/${ID}`));
  }
  getPresenters(query) {
    const param = new HttpParams().appendAll(query);
    return lastValueFrom(this.http.get(`${backendApiUrl}/api/auth/list_users`, {params: param}));
  }

}
