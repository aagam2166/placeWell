const bigintReplacer = (key, value) =>
  typeof value === "bigint" ? Number(value) : value;

export const serialize = (data) =>
  JSON.parse(JSON.stringify(data, bigintReplacer));

export const sendSuccess = (res, data, statusCode = 200) =>
  res.status(statusCode).json(serialize({ success: true, ...data }));
