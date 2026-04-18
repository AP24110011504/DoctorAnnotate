/**
 * Pre-existing X-ray dataset for doctor annotation
 * These images are provided by the system, not uploaded by users
 */

export const XRAY_DATASET = [
  "/dataset/xray1.png",
  "/dataset/xray2.png",
  "/dataset/xray3.png",
  "/dataset/xray4.png",
  "/dataset/xray5.png",
  "/dataset/xray6.png",
  "/dataset/xray7.png",
  "/dataset/xray8.png",
  "/dataset/xray9.png",
  "/dataset/xray10.png",
];

export const getDatasetSize = () => XRAY_DATASET.length;

export const getImageByIndex = (index: number): string | null => {
  if (index < 0 || index >= XRAY_DATASET.length) {
    return null;
  }
  return XRAY_DATASET[index];
};

export const hasNextImage = (currentIndex: number): boolean => {
  return currentIndex + 1 < XRAY_DATASET.length;
};

export const getNextImageIndex = (currentIndex: number): number | null => {
  if (hasNextImage(currentIndex)) {
    return currentIndex + 1;
  }
  return null;
};
