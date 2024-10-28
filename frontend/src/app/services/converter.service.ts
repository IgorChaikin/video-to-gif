import { Injectable } from '@angular/core';
import { 
  BehaviorSubject, 
  catchError, 
  combineLatest, 
  Observable, 
  map, 
  of, 
  tap, 
  switchMap,
  filter
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import path from 'path';

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  private inputSubject$: BehaviorSubject<File | null> = new BehaviorSubject<File | null>(null);
  private outputSubject$: BehaviorSubject<File | null> = new BehaviorSubject<File | null>(null);
  // TODO: actualize error type
  private errorSubject$: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private loadingSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public loading$ = this.loadingSubject$.asObservable();
  public error$ = this.errorSubject$.asObservable();
  public otputData$: Observable<
    { href: string;  download: string} | null
  > = combineLatest([
    this.inputSubject$.asObservable(), 
    this.outputSubject$.asObservable()
  ]).pipe(
    map(([file, blob]) => 
      file && blob ? 
        ({ 
          href: window.URL.createObjectURL(blob), 
          download: `${path.parse(file.name)}.gif`
        }) : 
        null
    )
  );

  constructor(private readonly http: HttpClient) {}

  public selectFile(file: File) {
    this.inputSubject$.next(file);
  }

  public convertFile() {
    return this.inputSubject$.asObservable().pipe(
      filter((file) => !!file),
      tap(() => this.loadingSubject$.next(true)),
      switchMap((file) => {
        const formData = new FormData();
        formData.append('file', file as File);
        return this.http.post<File>('http://localhost:3000/upload', formData);
      }),
      catchError((error) => {
        // MYLOG
        console.log(error);
        // MYLOG END
        this.errorSubject$.next(error);
        return of(null);
      })
    ).subscribe((result) => {
      // MYLOG
      console.log('ready');
      console.log(result);
      // MYLOG END
      this.loadingSubject$.next(false);
      this.outputSubject$.next(result);
    });
  }

}
