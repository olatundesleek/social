function checkJson(err,req,res,next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Handle invalid JSON payload
    return res.status(400).json({ error: "Invalid JSON payload" });
}
next(err); // Pass other errors to the default error handler
}

module.exports = checkJson



