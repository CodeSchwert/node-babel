const errorHandler = (err, req, res, next) => {
  // variable = Boolean(statement) ? true : false ;
  const error = err.message ? err.message : 'Something broke!';

  console.error('errorHandler', error);
  console.error('errorHandler.sentry', res.sentry);

  return res.status(500).json({ error });
};

export default errorHandler;