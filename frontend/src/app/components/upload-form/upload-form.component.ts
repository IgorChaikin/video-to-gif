import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConverterService } from '../../services/converter/converter.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { DestroyService } from '../../services/destroy/destroy.service';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule,
  ],
  providers: [ConverterService, DestroyService],
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.scss'
})
export class UploadFormComponent {
  constructor(
    private readonly converterService: ConverterService,
    private readonly formBuilder: FormBuilder,
  ) {}

  public form: FormGroup = this.formBuilder.group({
    file: [null, [Validators.required]],
  });
  uploadedFile: File | undefined;

  public loading$ = this.converterService.loading$;
  public error$ = this.converterService.error$;
  public fileName$ = this.converterService.fileName$;

  public convertedData$ = this.converterService.otputData$;

  onChange(event: Event) {
    const file: File | undefined = (event?.target as HTMLInputElement)
      ?.files?.[0];
    if(file) {
      this.converterService.selectFile(file);
    }
  }

  uploadFile() {
    this.converterService.convert();
  }
}
