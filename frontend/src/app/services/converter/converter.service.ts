import { Injectable } from '@angular/core';
import { 
  BehaviorSubject, 
  catchError, 
  combineLatest, 
  Observable, 
  map, 
  of,  
  filter,
  exhaustMap,
  takeUntil
} from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DownloadLinkOptions, ErrorData } from './converter.model';
import { DestroyService } from '../destroy/destroy.service';
import { BASE_URL } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  private inputSubject$: BehaviorSubject<File | null> = new BehaviorSubject<File | null>(null);
  private convertedId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private outputSubject$: BehaviorSubject<Blob | null> = new BehaviorSubject<Blob | null>(null);
  private errorSubject$: BehaviorSubject<HttpErrorResponse | null> = 
    new BehaviorSubject<HttpErrorResponse | null>(null);
  private loadingSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public loading$: Observable<boolean> = this.loadingSubject$.asObservable();
  public error$: Observable<ErrorData | null> = this.errorSubject$.asObservable().pipe(
    map((errorPayload) => {
      if (!errorPayload)
        return null;
      const { status, error, statusText } = errorPayload;
      return {
        status,
        message: typeof error === 'string' ? error : statusText,
      };
    })
  );

  public fileName$: Observable<string | null> = this.inputSubject$.asObservable().pipe(
    map((file) => file?.name ?? null)
  );

  public otputData$: Observable<DownloadLinkOptions | null> = combineLatest([
    this.fileName$, 
    this.outputSubject$.asObservable()
  ]).pipe(
    map(([name, blob]) => 
      name && blob ? 
        ({ 
          href: window.URL.createObjectURL(blob), 
          download: `${name.split('.')[0]}.gif`
        }) : 
        null
    )
  );

  constructor(
    private readonly http: HttpClient,
    private readonly destroy$: DestroyService,
  ) {}

  public selectFile(file: File) {
    this.inputSubject$.next(file);
    this.outputSubject$.next(null);
    this.convertedId$.next(null);
    this.errorSubject$.next(null);
  }

  public convert() {
    this.loadingSubject$.next(true);
    return this.inputSubject$.asObservable().pipe(
      takeUntil(this.destroy$),
      filter((file) => !!file),
      exhaustMap((file) => {
        const headers = new HttpHeaders().set('Accept', 'image/gif');
        const formData = new FormData();
        formData.append('file', file as File);
        return this.http.post(
          `${BASE_URL}/upload`, 
          formData, 
          { headers, responseType: 'blob' },
        );
      }),
      catchError((error) => {
        this.errorSubject$.next(error);
        this.inputSubject$.next(null);
        return of(null);
      })
    ).subscribe((result) => {
      this.loadingSubject$.next(false);
      this.outputSubject$.next(result);
      if(result) {
        this.errorSubject$.next(null);
      }
    });
  }

}
