export function findCamera(devices: MediaDeviceInfo[]) {
  const cameras = devices.filter(device => device.kind === "videoinput");

  // Find the 4 cameras with the shortest label, should be the main cameras
  const lenghts = cameras
    .map(item => item.label.length)
    .sort((a, b) => a - b)
    .slice(0, 4);
  const length = lenghts.pop() || Infinity;

  const mainCameras = cameras.filter(camera => camera.label.length <= length);

  // Return the last camera in the list, should be the back camera
  return mainCameras[mainCameras.length - 1];
}
