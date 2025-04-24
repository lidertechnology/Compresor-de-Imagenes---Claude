# Compresor de Imágenes con Angular Material - Guía de Instalación

## Prerequisitos
- Node.js (versión 16.x o superior)
- Angular CLI (versión 17.x o superior)

## Paso 1: Crear un nuevo proyecto Angular Standalone

```bash
ng new compresor-imagenes --standalone
cd compresor-imagenes
```

## Paso 2: Instalar dependencias necesarias

```bash
# Instalar Angular Material
ng add @angular/material

# Instalar FileSaver para la descarga de archivos
npm install file-saver
npm install @types/file-saver --save-dev
```

## Paso 3: Crear el componente de compresor de imágenes

```bash
ng generate component image-compressor --standalone
```

## Paso 4: Reemplazar el contenido del componente

Copia el código del componente que te proporcioné en el archivo `src/app/image-compressor/image-compressor.component.ts`.

## Paso 5: Actualizar el componente principal (app.component.ts)

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ImageCompressorComponent } from './image-compressor/image-compressor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ImageCompressorComponent],
  template: `
    <div class="app-container">
      <h1>Optimizador de Imágenes</h1>
      <app-image-compressor></app-image-compressor>
    </div>
  `,
  styles: [`
    .app-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #3f51b5;
    }
  `]
})
export class AppComponent {
  title = 'compresor-imagenes';
}
```

## Paso 6: Ejecutar la aplicación

```bash
ng serve
```

Navega a `http://localhost:4200/` para ver la aplicación en funcionamiento.

## Tecnología utilizada para la compresión de imágenes

El componente utiliza las siguientes tecnologías y técnicas para la compresión eficiente de imágenes:

1. **Canvas API**: Utilizamos el API de Canvas de HTML5 para renderizar y manipular las imágenes, permitiendo la compresión sin necesidad de bibliotecas externas pesadas.

2. **Formato WebP**: El componente prioriza la conversión a WebP, un formato moderno desarrollado por Google que ofrece una excelente relación calidad/tamaño, con soporte para transparencia.

3. **Algoritmo de selección inteligente**: El componente analiza el tipo de imagen original y sus características para determinar el mejor formato de salida:
   - JPEG → WebP (mejor compresión con calidad similar)
   - PNG con transparencia → PNG (mantiene la transparencia)
   - GIF → Se mantiene como GIF (para preservar animaciones)

4. **Control de calidad dinámico**: Permite al usuario ajustar el nivel de calidad de la compresión mediante un slider, ofreciendo un control preciso sobre el equilibrio entre tamaño de archivo y calidad visual.

5. **Procesamiento en el navegador**: Todo el procesamiento se realiza en el navegador del cliente, lo que elimina la necesidad de enviar las imágenes a un servidor y protege la privacidad del usuario.

## Mejoras futuras

Para mejorar aún más el compresor de imágenes, se podrían implementar las siguientes funcionalidades:

1. **Integración con bibliotecas especializadas**:
   - `imagemin` para optimizaciones avanzadas
   - `sharp` para un procesamiento más potente

2. **Soporte completo para AVIF**: Integrar una biblioteca específica para la conversión a AVIF, que ofrece una compresión superior a WebP.

3. **Compresión de GIF animados**: Añadir soporte para optimizar GIFs animados sin perder la animación.

4. **Redimensionamiento inteligente**: Detectar y sugerir dimensiones óptimas para diferentes casos de uso.

5. **Compresión por lotes con Worker**: Utilizar Web Workers para procesar múltiples imágenes en segundo plano sin bloquear la interfaz de usuario.
