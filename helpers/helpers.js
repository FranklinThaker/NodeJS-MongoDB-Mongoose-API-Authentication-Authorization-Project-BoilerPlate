/* eslint-disable radix */
exports.successResponse = function (req, res, data, message = "Operation successfully completed!", code = 200) {
  res.status(code)
  res.send({
    code,
    success: true,
    message,
    data,
  });
}

exports.errorResponse = function (req, res, errorMessage, code = 500) {
  res.status(code)
  res.send({
    code,
    errorMessage,
    data: null,
    success: false,
  });
}

exports.validateEmail = function(email) {
  const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


exports.validateFields = function(object, fields){
  const errors = [];
  fields.forEach((f) => {
    if (!(object && object[f])) {
      errors.push(f);
    }
  });
  return errors.length ? `${errors.join(', ')} are required fields.` : '';
}

exports.uniqueId = function(length = 13){
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.groupBy = (items, key) => items.reduce(
  (result, item) => ({
    ...result,
    [item[key]]: [
      ...(result[item[key]] || []),
      item,
    ],
  }),
  {},
);

exports.pagination = (req, defaultSize = 10, defaultPageNumber = 1) => {
  const offset = parseInt(req.query.size ? req.query.size : defaultSize) * (parseInt(req.query.pageNumber ? req.query.pageNumber : defaultPageNumber) - 1);
  const limit = parseInt(req.query.size ? req.query.size : defaultSize);
  return {
    offset,
    limit,
  };
};

exports.order = (req, ...sort) => [req.query.field || sort[0].field, req.query.sort || sort[0].order];
