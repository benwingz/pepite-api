var mongoose = require('mongoose');
mongoose.Promise = Promise;


// var PDFDocument = require('pdfkit');

var Phase = require('../models/phase.model');
var Category = require('../models/category.model');
var Grade = require('../models/grade.model');
var User = require('../models/user.model');

var authRequest = require('../service/authrequest.service');

var errorHandler = require('../service/error.service');

function getExportedUser(req) {

    var user = null;
    if (req.params.id) {
        user = User.findOne({_id: req.params.id}, function(err, user) {
            return user;
        });
    } else {
        user = authRequest.returnUser(req);
    }

    return Promise.resolve(user);
}

function structureByPhase(categories) {
    var phases = [];

    categories.forEach(function(category) {
        var phaseOrder = category.phase.order;
        if (!phases[phaseOrder]) {
            phases[phaseOrder] = {
                title: category._phase.title,
                categories: []
            }

            phases[phaseOrder].categories.push(category);
        }
    });

    return phases;
}

// function exportPDF(stream, user, categories) {
//     var pdf = new PDFDocument({
//         Title: 'Compétences Pépite - ${user.firstname} ${user.lastname}',
//         Author: 'Skilvioo - Pépite'
//     });

//     pdf.pipe(stream);

//     var phases = structureByPhase(categories);
    
//     // @TODO Print title

//     phases.forEach( exportPhase.bind(pdf) );

//     pdf.end();

//     return file;
// }

// /**
//  * this = pdf document
//  * @param {*} phase 
//  */
// function exportPhase(phase) {
//     // a phase : { title: string, categories: [category] }

//     this.addPage();
//     // @TODO write title to doc
//     phase.categories.forEach( exportCategory.bind(this) )
// }

// /**
//  * this = pdf document
//  * @param {*} category 
//  */
// function exportCategory(category) {

//     // @TODO print category title
//     // @TODO print category stars
//     // @TODO print details (skills)

// }

function getUserGrades(user, evaluatedBy) {
    var userGrades = Grade
        .find({ _user: user._id }, '_user _category');

    switch(evaluatedBy) {
        case 'anyone': 
            userGrades.select('user_eval validator_eval');
            break;
        case 'self':
            userGrades.where('user_eval').ne(null).select('user_eval');
            break;
        case 'validator':
            userGrades.where('validator_eval').ne(null).select('validator_eval');
            break;
    }

    return userGrades.exec();
}

function getPhases() {
    return Phase.find({}, 'title _id').sort({ order: 1 }).then(function(phases) {
        
        // resolve with an array of phases, containings its categories
        return Promise.all(phases.map(function(phase) {

            // select phase's categories and add them to the phase intance
            return Category
                .find( { _phase: phase._id} )
                .select('title skills _id')
                .then(function(categories) {
                    // create new objects as promise returned values are immutable
                    return {
                        title: phase.title,
                        categories: categories.map(function(category) {
                            return { 
                                title: category.title, 
                                skills: category.skills, 
                                _id: category._id 
                            };
                        })
                    }
                });
        }));
    });
}

function filterPhases(phases, evaluatedBy) {
    var categoryFilter = function keepAll (category) {
        return true;
    }

    if (evaluatedBy == 'self') { 
        categoryFilter = function keelOnlySelfEvaluated(category) {
            return category.user_eval != null;
        }
    } else if (evaluatedBy == 'validator') {
        categoryFilter = function keepOnlyValidated(category) {
            return category.validator_eval != null;
        }
    }

    return phases
        .map(function(phase) {
            phase.categories = phase.categories.filter(categoryFilter); // discard empty categories by the filter criteria
            return phase;
        })
        .filter(function(phase) {
            return phase.categories.length > 0; // discard phases for which no category was kept
        })

}

function fetchExportDataForUser(user, evaluatedBy) {
    evaluatedBy = evaluatedBy || 'anyone'; // valid values 'anyone' (default) || 'self' || 'validator'

    var grades = getUserGrades(user, evaluatedBy);
    return getPhases().then(function(phases){
        // create a map of categories to make next step o(n + m) instead of o(n * m)
        var categoriesMap = {};
        phases.forEach(function(phase) {
            phase.categories.forEach(function(category) {
                categoriesMap[category._id] = category;
            });
        });

        grades.then(function(grades) {
            grades.forEach(function(grade) {
                var category = categoriesMap[grade._category];
                category.user_eval = grade.user_eval;
                category.validator_eval = grade.validator_eval;
            })
        });

        return phases;

    }).then(function(phases) {
        return filterPhases(phases, evaluatedBy); // phases now contain a collection of categories, with the user's evaluation data attached
    });
    
}

function filterUnevaluatedCategories(categories, by) {
    by = by || 'self'; // 'self' || 'others'

    return categories;
}

function getExport(evaluatedBy, req, res) {
    var user = getExportedUser(req);

    user.then(function(user) {
        fetchExportDataForUser(user, evaluatedBy).then(function(data){
            res.json(data);
        });
    }, function() {
        errorHandler.error(res, "Une erreur s'est produite, impossible de générer le PDF");
    });
};

exports.getExportFull = getExport.bind({}, 'anyone');
exports.getExportEvaluated = getExport.bind({}, 'self');
exports.getExportValidated = getExport.bind({}, 'validated');