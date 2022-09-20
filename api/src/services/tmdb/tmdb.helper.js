function currentTime() {
  return new Date().toLocaleString("vi-VN");
}

function isSameDate(dateStr1, dateStr2) {
  return new Date(dateStr1).getTime() === new Date(dateStr2).getTime();
}

module.exports = {
  currentTime,
  isSameDate,
};
