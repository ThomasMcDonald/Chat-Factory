import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  
  private socket;
  
  constructor() { }
}
