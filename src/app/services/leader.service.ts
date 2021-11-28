import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient) { }
  getLeaders():  Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leaders');
  }
  
    getLeader(id: string): Observable<Leader> {
      return this.http.get<Leader>(baseURL + 'leaders/' + id);
  }
  
    getFeaturedLeader(): Observable<Leader>{
      return this.http.get<Leader[]>(baseURL + 'leaders?featured=true').pipe(map(leaders => leaders[0]));
}
}
