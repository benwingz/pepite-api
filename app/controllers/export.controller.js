var mongoose = require('mongoose');
mongoose.Promise = Promise;


var PDFDocument = require('pdfkit');

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

function exportPDF(res, user, phases, evaluatedBy) {
    var pdf = new PDFDocument({
        margins: {
            top: 40,
            bottom: 40,
            left: 35,
            right: 35
        }
    });

    var starEmpty = '\uE83A';
    var starFull = '\uE838';

    pdf.registerFont('Roboto', 'resources/fonts/roboto/Roboto-Regular.ttf');
    pdf.registerFont('Roboto-Italic', 'resources/fonts/roboto/Roboto-Italic.ttf');
    pdf.registerFont('Material-Design', 'resources/fonts/material-design/MaterialIcons-Regular.ttf')
    var typeProfile = '';
    switch (evaluatedBy) {
      case 'anyone':
        typeProfile = 'complet'
        break;
      case 'self':
        typeProfile = 'auto-évalué'
        break;
      default:
        typeProfile = 'validé'

    }
    pdf
        .fontSize(28)
        .font('Roboto')
        .text('Profil ' + typeProfile + ' Pépite Skilvioo ', {align: 'center'})
        .moveDown(0)

        .fontSize(20)
        .text(`${user.firstname} ${user.lastname}`, { align: 'center'})
        .moveDown(3);

    phases.forEach( printPhase.bind(pdf) );

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="profile_pepite.pdf"'
    });

    pdf.pipe(res);
    pdf.end();
}

/**
 * this = pdf document
 * @param {*} phase
 */
function printPhase(phase, phaseIndex) {
    if(phaseIndex != 0) {
        this.addPage({margins: {
            top: 90,
            bottom: 40,
            left: 35,
            right: 35
        }});
    }

    this
      .fontSize(18)
      .font('Roboto')
      .fillColor('#15a1c5')
      .text(phase.title, { align: 'left' })
      .moveDown(1);

    phase.categories.forEach( printCategory.bind(this) );
}

/**
 * this = pdf document
 * @param {*} category
 */
function printCategory( category, index ) {
    console.log(this.y);

    if (this.y > 700) {
        console.log('passe');
        this.addPage();
    }

    this
        .fontSize(16)
        .font('Roboto-Italic')
        .fillColor('black')
        .text(category.title, { width: 400, align: 'left'});

    printEvaluation.call(this, category.user_eval, category.validator_eval);

    this
        .moveDown(0.15)
        drawLine.call(this)
        .moveDown(0.35)

    // @TODO print category stars

    category.skills.forEach( printSkill.bind(this, category.skills.length-1))
}

function printSkill(lastIndex, skill, index) {

    this
        .fontSize(12)
        .font('Roboto')
        .fillColor('black')
        .text('- '+skill, this.page.margins.left, this.y);

    if (lastIndex == index) {
        this.moveDown(2);
    } else {
        this.moveDown(0.30)
        drawLine.call(this)
        .moveDown(0.50);
    }
}

function printEvaluation(autoEval, eval) {
    var grade = 0;
    var isValidated = false;

    var starEmpty = '\uE83A';
    var starFull = '\uE838';
    var check = '\uE5CA';

    if (eval) {
        grade = eval.value;
        isValidated = true;
    } else if(autoEval) {
        grade = autoEval.value;
    } else {
        grade = 0;
    }

    var stars = [];

     this
        .moveUp()
        .font('Material-Design');

    if (isValidated && grade > 0) {
        this
            .fillColor('green')
            .text(check, 470, this.y, {continued: true})
    }

    for (var i = 1 ; i <= 5 ; i++) {
        if (i <= grade) {
            stars.push(starFull)
        } else {
            stars.push(starEmpty);
        }
    }

    this
        .fillColor('gray')
        .text(stars.join(""), { align: 'right' })
        .moveDown();

}

function drawLine() {
    this
        .moveTo(35,this.y)
        .strokeColor('#cccccc')
        .lineTo(577, this.y)

        .lineWidth(1)
        .stroke();

    return this;
}

function getUserGrades(user, evaluatedBy) {
    var userGrades = Grade
        .find({ _user: user._id }, '_user _category')
        .sort({ order: 1 })
    ;

    switch(evaluatedBy) {
        case 'anyone':
            userGrades.select('user_eval validator_eval');
            break;
        case 'self':
            userGrades
                .where('user_eval').ne(null)
                .gt('user_eval.value', 0)
                .select('user_eval');
            break;
        case 'validator':
            userGrades
                .where('validator_eval').ne(null)
                .gt('validator_eval.value', 0)
                .select('validator_eval');
            break;
    }

    return userGrades.exec();
}

function getPhases() {
    return Phase.find({}, 'title _id').sort({ order: 1 }).then(function(phases) {

        // resolve with an array of phases, populated with its categories
        return Promise.all(phases.map(function(phase) {

            // select phase's categories to populate the phase intance
            return Category
                .find( { _phase: phase._id} )
                .select('title skills _id')
                .then(function(categories) {
                    // rebuild a phase object as promise returned values are immutable
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

function getExport(evaluatedBy, req, res) {
    var user = getExportedUser(req);

    user.then(function(user) {
        fetchExportDataForUser(user, evaluatedBy).then(function(data){

            exportPDF(res, user, data, evaluatedBy); // will send the response

        });
    }, function() {
        errorHandler.error(res, "Une erreur s'est produite, impossible de générer le PDF");
    });
};

exports.getExportFull = getExport.bind({}, 'anyone');
exports.getExportEvaluated = getExport.bind({}, 'self');
exports.getExportValidated = getExport.bind({}, 'validator');
