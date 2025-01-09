export const calculateCountdown = (minute, second) => {
    let totalSeconds = parseInt(minute) * 60 + parseInt(second);

    if (totalSeconds <= 0) {
      return { minutes: "00", seconds: "00" };
    }
    totalSeconds--;

    return {
      minutes: String(Math.floor(totalSeconds / 60)).padStart(2, "0"),
      seconds: String(totalSeconds % 60).padStart(2, "0"),
    };
  };

