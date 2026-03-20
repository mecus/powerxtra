import { inject, Injectable } from '@angular/core';
import { backendApiUrl } from '../../../../environments/backend-api';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProgrammeService {
  private http = inject(HttpClient);

  createProgramme(programme: any) {
    return lastValueFrom(this.http.post(`${backendApiUrl}/api/programmes/create`, programme));
  }

  listProgrammes(query?: any) {
    return lastValueFrom(this.http.get(`${backendApiUrl}/api/programmes/list`));
  }
  updateProgramme(ID: string, patch: any) {
    return lastValueFrom(this.http.patch(`${backendApiUrl}/api/programmes/update/${ID}`, patch));
  }
 deleteProgramme(ID: string) {
    return lastValueFrom(this.http.delete(`${backendApiUrl}/api/programmes/delete/${ID}`));
  }

}
