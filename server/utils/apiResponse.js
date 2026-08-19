/**
 * Every endpoint answers with the same envelope so the client never has to
 * guess where the payload lives.
 */
export function sendSuccess(res, { status = 200, data = null, message, meta } = {}) {
  const body = { success: true };
  if (message) body.message = message;
  if (data !== null) body.data = data;
  if (meta) body.meta = meta;
  return res.status(status).json(body);
}

export function sendCreated(res, data, message) {
  return sendSuccess(res, { status: 201, data, message });
}
