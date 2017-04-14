exports.buildQueryFind = function(model, queryParams) {
  var query = model.find(queryParams.find);

  if (queryParams['populate']) {
    for (populateIndex = 0; populateIndex < queryParams.populate.length; populateIndex ++) {
      if(queryParams.populate[populateIndex].filter) {
        query.populate(queryParams.populate[populateIndex].field, queryParams.populate[populateIndex].filter);
      } else {
        query.populate(queryParams.populate[populateIndex].field);
      }
    }
  }

  if(queryParams['select']) {
    query.select(queryParams.select);
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
