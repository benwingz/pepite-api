exports.buildQueryFind = function(model, queryParams) {
  var query = model.find(queryParams.find);

  if (queryParams['populate']) {
    for (populateIndex = 0; populateIndex < queryParams.populate.length -1; populateIndex ++) {
      query.populate(queryParams.populate[populateIndex]);
    }
  }

  if (queryParams['where']) {
    query.where(queryParams.where);
  }

  return new Promise(function(resolve, reject) {
    query.exec(function(error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    })
  });
}
