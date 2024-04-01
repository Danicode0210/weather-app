import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherApiService {
  constructor(private http: HttpClient) {}

  getForecast(location: string): Observable<any> {
    const apiUrl = `${environment.apiUrl}${location}/31,80/forecast`;
    return this.http.get(apiUrl);
  }
}
