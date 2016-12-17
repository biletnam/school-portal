'use strict';

const LessonsRepository = require('../repository/lessons');
const TimingsRepository = require('../repository/timings');
const Time = require('../repository/time');

const utils = require('../utils');

const helper = require('./controller-helper')('student');

module.exports.getDashboardPage = (req, res) => {

    let promises = {
        lessons: () => LessonsRepository.getTodayLessons(req.school_context.user.student.groupId)
    }

    let processors = {
        lessons: (lesson) => {
            
            let locateResult = utils.locateLessonInTime(lesson);

            return {
                now: locateResult.isNow,
                auditory: lesson.auditory ? lesson.auditory.name : null,
                subject: lesson.subject.shortname,
                time: locateResult.isNow ? locateResult.timeleftString : lesson.timing.getDisplayName(),
                teacher: `${lesson.teacher.user.lastname} ${lesson.teacher.user.firstname.charAt(0)}. ${lesson.teacher.user.middlename.charAt(0)}.`,
            }
        }
    }

    helper.processPromises(promises, processors)
        .then(lists => {
            lists.lessons.sort((a, b) => a.begins > b.begins);

            let renderOptions = {
                view: 'student/dashboard',
                title: 'Сегодня',
            };

            helper.render(req, res, { lists }, renderOptions);
        });
}