import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMasterResponse } from '../interfaces/master.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class SitesService {
  constructor(private http: HttpClient) {}
  userService = inject(UserService);

  clientId = this.userService.loggedUserData?.extraId;

  siteId = 1;

  getSitesByClientId(): Observable<IMasterResponse> {
    console.log('Fetching sites for clientId:', this.clientId);
    return this.http.get<IMasterResponse>(
      'https://api.freeprojectapi.com/api/SmartParking/GetSitesByClientId?id=' +
        this.clientId,
    );
  }

  GetBuildingBySiteId(siteId: number): Observable<IMasterResponse> {
    return this.http.get<IMasterResponse>(
      'https://api.freeprojectapi.com/api/SmartParking/GetBuildingBySiteId?id=' +
        siteId,
    );
  }

  GetFloorsByBuildingId(buildingId: number): Observable<IMasterResponse> {
    return this.http.get<IMasterResponse>(
      'https://api.freeprojectapi.com/api/SmartParking/GetFloorsByBuildingId?id=' +
        buildingId,
    );
  }
}
