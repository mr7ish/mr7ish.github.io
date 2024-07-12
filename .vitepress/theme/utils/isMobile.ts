export function isMobile() {
  var userAgent = navigator.userAgent;

  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return true;
  }

  // Android detection
  if (/android/i.test(userAgent)) {
    return true;
  }

  // Other mobile devices
  if (/Mobi|Tablet|iPad|iPhone/.test(userAgent)) {
    return true;
  }

  return false;
}
