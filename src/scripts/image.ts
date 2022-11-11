import type { GlobalState } from '@/types';
import { inject } from 'vue';

export const useImage = () => {
  const state = inject('state') as GlobalState;

  /** Calculate the coordinate value of the center clip */
  const getCropInformation = (image: HTMLImageElement) => {
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    const min = width < height ? width : height;

    return {
      startX: (width - min) / 2,
      startY: (height - min) / 2,
      width: min,
      height: min,
    };
  };

  const setBackground = (e: Event) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:next-line
    const file = e.target.files[0] as File;

    // Load image
    const image = document.createElement('img');
    image.src = URL.createObjectURL(file);

    image.onload = () => {
      // Create canvas for image (Center crop)
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      const cropInformation = getCropInformation(image);
      canvas.width = 384;
      canvas.height = 384;
      context.drawImage(
        image,
        cropInformation.startX,
        cropInformation.startY,
        cropInformation.width,
        cropInformation.height,
        0,
        0,
        384,
        384
      );

      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          const newCanvas = document.createElement('canvas');
          const newContext = newCanvas.getContext('2d') as CanvasRenderingContext2D;
          newCanvas.width = 128;
          newCanvas.height = 128;
          newContext.drawImage(canvas, 128 * x, 128 * y, 128, 128, 0, 0, 128, 128);

          state.backgrounds[y * 3 + x] = newCanvas.toDataURL();
        }
      }
    };
  };

  const uploadBackground = () => {
    // Request image file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = setBackground;
    input.click();
  };

  return { uploadBackground };
};
