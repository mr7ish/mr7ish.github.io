type Vector2 = [number, number];

export function calcMoveDistance(pic: HTMLImageElement): Vector2 {
  const { clientCenterPoint } = getClientInfo();
  const { picCenterPoint } = getPicInfo(pic);

  // image center to client center
  const moveX = clientCenterPoint[0] - picCenterPoint[0];
  const moveY = clientCenterPoint[1] - picCenterPoint[1];

  return [moveX, moveY];
}

export function calcScale(pic: HTMLImageElement, ratio?: number) {
  const { clientW } = getClientInfo();
  const { renderW } = getPicInfo(pic);

  const scale = clientW / renderW;

  return scale * (ratio ?? 1);
}

export function getClientInfo() {
  const clientW = document.documentElement.clientWidth;
  const clientH = document.documentElement.clientHeight;

  const clientCenterPoint: Vector2 = [clientW / 2, clientH / 2];

  return {
    clientW,
    clientH,
    clientCenterPoint,
  };
}

export function getPicInfo(pic: HTMLImageElement) {
  // image rendering size
  const renderW = pic.width;
  const renderH = pic.height;

  const { x, y, top, bottom, left, right, width, height } =
    pic.getBoundingClientRect();

  // image center point relative to the client
  const picCenterPoint: Vector2 = [x + renderW / 2, y + renderH / 2];

  return {
    renderW,
    renderH,
    picCenterPoint,
    x,
    y,
    top,
    bottom,
    left,
    right,
    width,
    height,
  };
}
