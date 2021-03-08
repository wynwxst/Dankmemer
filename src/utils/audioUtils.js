const { get } = require('./http');
const { constants, promises: fs } = require('fs');
const { exec } = require('child_process');

async function isOpus (url) {
  const res = await get(url)
    .set('Range', 'bytes=0-35')
    .catch(() => ({})) // eslint-disable-line

  const buf = res.body;

  if (!res.ok || !Buffer.isBuffer(buf) || buf.length < 36) {
    return false;
  }

  // Bytes 0 to 3: detect general OGG (OPUS is OGG)
  // Bytes 28 to 35: detect OPUS
  return buf[0] === 79 &&
    buf[1] === 103 &&
    buf[2] === 103 &&
    buf[3] === 83 &&
    buf[28] === 79 &&
    buf[29] === 112 &&
    buf[30] === 117 &&
    buf[31] === 115 &&
    buf[32] === 72 &&
    buf[33] === 101 &&
    buf[34] === 97 &&
    buf[35] === 100;
}

async function getFileSize (url) {
  const res = await get(url);
  return res.headers['content-length'] || 0;
}

function exists (path) {
  return fs.access(path, constants.R_OK)
    .then(() => true)
    .catch(() => false);
}

function convertAndSave (url, dir, file) {
  return new Promise(async (resolve, reject) => { // Opus is nice and efficient. This should sound like 96K MP3 while consuming less space
    await makeDir(dir);
    exec(`ffmpeg -loglevel error -i ${url} -acodec libopus -b:a 96k "${dir}/${file}"`, (err, _, stderr) => {
      if (err) {
        return reject(err.message);
      }
      if (stderr) {
        return reject(stderr);
      }
      resolve();
    });
  });
}

async function saveAudioData (url, dir, file) {
  const res = await get(url);
  await writeBuffer(dir, file, res.body);
}

async function makeDir (dir) {
  const ex = await exists(dir);

  if (!ex) {
    await fs.mkdir(dir);
  }
}

async function writeBuffer (path, file, buffer) {
  await makeDir(path);
  await fs.writeFile(`${path}/${file}`, buffer);
}

async function getFiles (path) {
  return fs.readdir(path);
}

async function removeFile (path) {
  const ex = await exists(path);

  if (ex) {
    await fs.unlink(path);
  } else {
    throw new Error(`Cannot delete ${path}; does not exist`);
  }
}

module.exports = {
  convertAndSave,
  exists,
  getFiles,
  getFileSize,
  isOpus,
  removeFile,
  saveAudioData
};
