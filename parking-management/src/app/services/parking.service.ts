import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IParkingReservationRequest,
  IParkingReservationResponse,
  IReleaseSpace,
} from '../interfaces/parking.interface';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  constructor(private http: HttpClient) {}

  parkingReservation(
    obj: IParkingReservationRequest,
  ): Observable<IParkingReservationResponse> {
    return this.http.post<IParkingReservationResponse>(
      'https://api.freeprojectapi.com/api/SmartParking/AddParking',
      obj,
    );
  }

    releasePrkingSpot(
    obj: IReleaseSpace,
  ): Observable<any> {
    return this.http.post<any>(
      'https://api.freeprojectapi.com/api/SmartParking/MarExit',
      obj,
    );  
  }
}
