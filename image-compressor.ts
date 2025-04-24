// image-compressor.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-image-compressor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatSliderModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card class="main-card">
        <mat-card-header>
          <mat-card-title>Compresor de Imágenes Inteligente</mat-card-title>
          <mat-card-subtitle>Optimiza tus imágenes manteniendo la mejor calidad</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="drop-zone" 
               [class.active]="isDragging" 
               (dragover)="onDragOver($event)" 
               (dragleave)="onDragLeave()" 
               (drop)="onDrop($event)"
               (click)="fileInput.click()">
            <input #fileInput type="file" 
                  accept="image/*" 
                  multiple 
                  style="display: none" 
                  (change)="onFileSelected($event)">
            <mat-icon>cloud_upload</mat-icon>
            <p>Arrastra y suelta tus imágenes aquí o haz clic para seleccionar</p>
            <p class="supported-formats">Formatos soportados: JPG, PNG, WebP, AVIF, GIF</p>
          </div>

          <div *ngIf="isProcessing" class="processing-indicator">
            <p>Optimizando imágenes...</p>
            <mat-progress-bar mode="indeterminate"></mat-progress-bar>
          </div>

          <div *ngIf="compressionResults.length > 0" class="results-container">
            <h3>Resultados de compresión</h3>
            
            <div class="quality-settings">
              <p>Calidad de compresión: {{quality}}%</p>
              <mat-slider min="50" max="100" step="1" [value]="quality" (input)="onQualityChange($event)"></mat-slider>
              <button mat-raised-button color="primary" (click)="reprocessImages()" [disabled]="isProcessing">
                Recomprimir
              </button>
            </div>

            <div class="results-list">
              <mat-card class="result-item" *ngFor="let result of compressionResults">
                <div class="image-preview">
                  <div class="preview-container">
                    <h4>Original ({{formatFileSize(result.originalSize)}})</h4>
                    <img [src]="result.originalImage" alt="Original image">
                  </div>
                  <div class="preview-container">
                    <h4>Comprimida ({{formatFileSize(result.compressedSize)}}) 
                      <span class="savings">{{calculateSavings(result.originalSize, result.compressedSize)}}% reducción</span>
                    </h4>
                    <img [src]="result.compressedImage" alt="Compressed image">
                  </div>
                </div>
                <div class="actions">
                  <button mat-button (click)="downloadImage(result)" [disabled]="isProcessing">
                    <mat-icon>download</mat-icon> Descargar
                  </button>
                  <span class="format-info">{{result.format}}, {{result.width}}x{{result.height}}</span>
                </div>
              </mat-card>
            </div>

            <div class="batch-actions">
              <button mat-raised-button color="accent" (click)="downloadAll()" [disabled]="isProcessing || compressionResults.length === 0">
                <mat-icon>archive</mat-icon> Descargar todo
              </button>
              <button mat-raised-button color="warn" (click)="clearAll()" [disabled]="isProcessing || compressionResults.length === 0">
                <mat-icon>delete</mat-icon> Limpiar todo
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 0 20px;
    }
    
    .main-card {
      margin-bottom: 20px;
    }
    
    .drop-zone {
      border: 2px dashed #ccc;
      border-radius: 5px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 20px;
    }
    
    .drop-zone.active {
      border-color: #3f51b5;
      background-color: rgba(63, 81, 181, 0.05);
    }
    
    .drop-zone mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #3f51b5;
    }
    
    .supported-formats {
      font-size: 12px;
      color: #666;
      margin-top: 10px;
    }
    
    .processing-indicator {
      text-align: center;
      margin: 20px 0;
    }
    
    .results-container {
      margin-top: 30px;
    }
    
    .quality-settings {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 5px;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .quality-settings p {
      margin: 0;
      min-width: 160px;
    }
    
    .quality-settings mat-slider {
      flex: 1;
    }
    
    .results-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }
    
    .result-item {
      padding: 15px;
    }
    
    .image-preview {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .preview-container {
      flex: 1;
    }
    
    .preview-container img {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }
    
    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .format-info {
      color: #666;
      font-size: 12px;
    }
    
    .savings {
      color: #4caf50;
      font-weight: bold;
    }
    
    .batch-actions {
      margin-top: 20px;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
  `]
})
export class ImageCompressorComponent implements OnInit {
  isDragging = false;
  isProcessing = false;
  files: File[] = [];
  compressionResults: CompressionResult[] = [];
  quality = 85; // Default quality

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  onQualityChange(event: any): void {
    this.quality = event.value;
  }

  handleFiles(fileList: FileList): void {
    const imageFiles = Array.from(fileList).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      this.snackBar.open('Por favor, selecciona archivos de imagen válidos', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.files = imageFiles;
    this.processImages();
  }

  processImages(): void {
    if (this.files.length === 0) return;
    
    this.isProcessing = true;
    this.compressionResults = [];
    const promises: Promise<CompressionResult>[] = [];
    
    for (const file of this.files) {
      const promise = this.compressImage(file, this.quality);
      promises.push(promise);
    }

    Promise.all(promises)
      .then(results => {
        this.compressionResults = results;
        this.isProcessing = false;
        const totalOriginal = results.reduce((sum, result) => sum + result.originalSize, 0);
        const totalCompressed = results.reduce((sum, result) => sum + result.compressedSize, 0);
        const savingsPercentage = this.calculateSavings(totalOriginal, totalCompressed);
        
        this.snackBar.open(`¡Imágenes optimizadas! Ahorro total: ${savingsPercentage}%`, 'Cerrar', {
          duration: 5000
        });
      })
      .catch(error => {
        console.error('Error processing images:', error);
        this.isProcessing = false;
        this.snackBar.open('Error al procesar las imágenes', 'Cerrar', {
          duration: 3000
        });
      });
  }

  reprocessImages(): void {
    if (this.files.length === 0) return;
    this.processImages();
  }

  async compressImage(file: File, quality: number): Promise<CompressionResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Analyze image to determine best compression format
          const bestFormat = this.determineBestFormat(file.type, img.width, img.height);
          
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Set canvas dimensions
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image on canvas
          ctx.drawImage(img, 0, 0);
          
          // Compress using the best format
          let compressedDataUrl: string;
          const qualityFactor = quality / 100;
          
          switch (bestFormat) {
            case 'image/webp':
              compressedDataUrl = canvas.toDataURL('image/webp', qualityFactor);
              break;
            case 'image/avif':
              // AVIF is not directly supported by canvas, we'd need a library
              // Fallback to WebP for now
              compressedDataUrl = canvas.toDataURL('image/webp', qualityFactor);
              break;
            case 'image/png':
              compressedDataUrl = canvas.toDataURL('image/png', qualityFactor);
              break;
            case 'image/gif':
              // GIF optimization would require a specialized library
              // Fallback to PNG for now
              compressedDataUrl = canvas.toDataURL('image/png', qualityFactor);
              break;
            default:
              // Default to JPEG
              compressedDataUrl = canvas.toDataURL('image/jpeg', qualityFactor);
              break;
          }
          
          // Calculate compressed size
          const compressedSize = this.getDataUrlSize(compressedDataUrl);
          
          resolve({
            originalName: file.name,
            originalSize: file.size,
            originalImage: e.target?.result as string,
            compressedImage: compressedDataUrl,
            compressedSize: compressedSize,
            format: bestFormat,
            width: img.width,
            height: img.height,
            quality: quality
          });
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  determineBestFormat(originalType: string, width: number, height: number): string {
    // Simple logic to determine the best format based on image characteristics
    // This can be expanded with more sophisticated analysis
    
    // For photos, WebP is generally a good choice
    if (originalType === 'image/jpeg' || originalType === 'image/jpg') {
      return 'image/webp';
    }
    
    // For PNG with transparency, keep as PNG
    if (originalType === 'image/png') {
      // We'd need to check for transparency which is complex
      // For simplicity, we'll keep it as PNG
      return 'image/png';
    }
    
    // For GIFs (potentially animated), keep as GIF
    if (originalType === 'image/gif') {
      return 'image/gif';
    }
    
    // For WebP, keep as WebP
    if (originalType === 'image/webp') {
      return 'image/webp';
    }
    
    // For AVIF, keep as AVIF
    if (originalType === 'image/avif') {
      return 'image/avif';
    }
    
    // Default to WebP for best compression/quality ratio
    return 'image/webp';
  }

  getDataUrlSize(dataUrl: string): number {
    // Calculate size of base64 data URL in bytes
    const base64 = dataUrl.split(',')[1];
    return Math.round((base64.length * 3) / 4);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  }

  calculateSavings(original: number, compressed: number): number {
    if (original === 0) return 0;
    return Math.round(((original - compressed) / original) * 100);
  }

  downloadImage(result: CompressionResult): void {
    // Convert data URL to Blob
    const arr = result.compressedImage.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    const blob = new Blob([u8arr], { type: mime });
    
    // Extract extension from MIME type
    const extension = mime.split('/')[1];
    const fileName = `${result.originalName.split('.')[0]}_compressed.${extension}`;
    
    // Download the file
    saveAs(blob, fileName);
  }

  downloadAll(): void {
    // In a real implementation, we might want to use JSZip to create a zip file
    // For simplicity, we'll just download them one by one
    this.compressionResults.forEach(result => {
      this.downloadImage(result);
    });
  }

  clearAll(): void {
    this.files = [];
    this.compressionResults = [];
  }
}

interface CompressionResult {
  originalName: string;
  originalSize: number;
  originalImage: string;
  compressedImage: string;
  compressedSize: number;
  format: string;
  width: number;
  height: number;
  quality: number;
}
