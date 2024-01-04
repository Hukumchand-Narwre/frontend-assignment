export function formatDuration(durationInSeconds) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  const formattedTime = [hours, minutes, seconds].map((unit) => String(unit).padStart(2, "0")).join(":");

  return formattedTime;
}
