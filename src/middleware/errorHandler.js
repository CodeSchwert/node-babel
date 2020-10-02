const errorHandler = (err, req, res, next) => {
  // variable = Boolean(statement) ? true : false ;
  const error = err.message ? err.message : 'Something broke!';

  return res.status(500).json({ error });
};

export default errorHandler;