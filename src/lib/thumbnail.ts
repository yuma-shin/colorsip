export const THUMBNAIL_MAX_SIZE = 64;

export function createThumbnailDataUrl(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
): string {
  const scale = THUMBNAIL_MAX_SIZE / Math.max(sourceWidth, sourceHeight);
  const width = Math.round(sourceWidth * scale);
  const height = Math.round(sourceHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  context?.drawImage(source, 0, 0, width, height);

  return canvas.toDataURL("image/png");
}
