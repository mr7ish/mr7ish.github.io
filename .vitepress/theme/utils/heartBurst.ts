type Point = {
  x: number;
  y: number;
};

export function createHeartByClick(e: MouseEvent) {
  const tagName = (e.target as HTMLElement).tagName;
  if (!getWhiteElementsTagName().includes(tagName)) return;
  heartBurst({
    x: e.pageX,
    y: e.pageY,
  });
}

function getWhiteElementsTagName() {
  return ["A", "BUTTON", "IMG", "CODE"];
}

function heartBurst({ x, y }: Point) {
  const heartImg = createImage("/others/heart-animation.png");
  heartImg.style.pointerEvents = "none";
  heartImg.classList.add("love-basic", "love-animation");
  heartImg.style.left = x + "px";
  heartImg.style.top = y + "px";
  document.documentElement.appendChild(heartImg);

  setTimeout(() => {
    document.documentElement.removeChild(heartImg);
  }, 750);
}

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
