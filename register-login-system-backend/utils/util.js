const buildResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
};

module.exports.buildResponse = buildResponse;
