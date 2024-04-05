
export const  catchAsync = (fun) => {
 return (req, res, next) => {
  fun(req, res, next).catch((err) => next(err));
  // fun(req, res, next).catch((err) => next(new AppError(`Cant fint ${req.originalUrl} on this server!`, 309)));
 };
};
