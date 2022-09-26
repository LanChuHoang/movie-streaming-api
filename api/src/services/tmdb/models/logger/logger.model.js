const fs = require("fs/promises");
const path = require("path");
const { currentTime } = require("../tmdb/tmdb.helper");

const LOG_FOLDER_PATH = path.join(__dirname, "..", "..", "logs");
const SUCCESS_FILE_PATH = path.join(LOG_FOLDER_PATH, "update_success.log");
const ERROR_FILE_PATH = path.join(LOG_FOLDER_PATH, "update_error.log");

async function writeResults(filePath, results) {
  const header = `\r\n${currentTime()} - ${results?.length || 0} items\r\n`;
  await fs.writeFile(filePath, header, { flag: "a+" });
  const content = results.map((e) => `${e}\r\n`);
  await fs.writeFile(filePath, content, { flag: "a+" });
}

async function writeSuccess(results) {
  await writeResults(SUCCESS_FILE_PATH, results);
}

async function writeErrors(errors) {
  await writeResults(ERROR_FILE_PATH, errors);
}

module.exports = {
  writeSuccess,
  writeErrors,
};
