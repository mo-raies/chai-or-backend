
const asyncHandalar = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandalar };


// const asyncHandalar = () => {}
// const asyncHandalar = (fun) => ()=> {}
// const asyncHandalar = (fun) => async ()=> {}

// const asyncHandalar = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next)
//   } catch (error) {
//     res.status(error.code || 5000).json({
//       success: false,
//       message: error.message
//     })

//   }
// }