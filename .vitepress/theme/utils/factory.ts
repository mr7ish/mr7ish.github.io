/**
 * create an image object
 * @param imagePath image source
 * @returns an img element
 */
export function createImage(imagePath: string) {
  const image = new Image();
  image.src = imagePath;
  return image;
}

/**
 * create an anchor object
 * @param href anchor href
 * @returns an a element
 */
export function createAnchor(href: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  return anchor;
}
