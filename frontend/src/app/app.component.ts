import { Component } from '@angular/core';
import { UploadFormComponent } from './components/upload-form/upload-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UploadFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
