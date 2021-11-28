import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient) { }
  getPromotions():  Observable<Promotion[]> {
    return this.http.get<Promotion[]>(baseURL + 'promotions');
  }
  
    getPromoiton(id: string): Observable<Promotion> {
      return this.http.get<Promotion>(baseURL + 'promotions/' + id);
  }
  
    getFeaturedPromotion(): Observable<Promotion>{
      return this.http.get<Promotion[]>(baseURL + 'promotions?featured=true').pipe(map(promotions => promotions[0]));

}
}
