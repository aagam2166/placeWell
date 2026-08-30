const bigintReplacer = (key, value) =>
  typeof value === "bigint" ? Number(value) : value;

const serialize = (data) =>
  JSON.parse(JSON.stringify(data, bigintReplacer));

const sendSuccess = (res, data, statusCode = 200) =>
  res.status(statusCode).json(serialize({ success: true, ...data }));

module.exports = { sendSuccess };
