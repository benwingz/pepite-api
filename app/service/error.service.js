exports.error = function(res, errorMessage) {
  res.json({ success: false, message: errorMessage})
}
