'use strict';

const url = require('url');

const LessonsRepository = require('../repository/lessons');
const GroupsRepository = require('../repository/groups');
const SubjectsRepository = require('../repository/subjects');
const AuditoriesRepository = require('../repository/auditories');
const TimingsRepository = require('../repository/timings');
const TeachersRepository = require('../repository/teachers');

const helper = require('./controller-helper')('teacher', 't');
//const config = require('../../config.json');

module.exports.getLessonsEditorPage = (req, res) => {

    let lists = {
        groups: GroupsRepository.browse
    }

    let processors = {
        groups: (_) => { return { text: _.name, value: _.id } }
    }

    helper.processPromises(lists, processors)
        .then((lists) => {
            let renderOptions = {
                view: 'teacher/lessons',
                title: 'Изменение расписания'
            };

            helper.render(req, res, { lists }, renderOptions);
        })
        .catch(err => {
            console.error(err);
            res.end(err);
        })
}

module.exports.getLessonsEditor = (req, res) => {

    let group = req.query.group;
    let weektype = req.query.weektype;

    let lists = {
        lessons: () => LessonsRepository.getTimetable(group, weektype),
        subjects: SubjectsRepository.browse,
        auditories: AuditoriesRepository.browse,
        timings: TimingsRepository.browse,
        teachers: TeachersRepository.browse
    }

    let processors = {
        teachers: (teacher) => { return { text: `${teacher.user.lastname} ${teacher.user.firstname.charAt(0)}. ${teacher.user.middlename.charAt(0)}.`, value: teacher.id } },
        subjects: (_) => { return { text: _.name, value: _.id } },
        auditories: (_) => { return { text: _.name, value: _.id } }
    }

    helper.processPromises(lists, processors)
        .then((lists) => {
            let renderOptions = {
                view: 'teacher/lessons_editor',
                title: 'Изменение расписания'
            };

            helper.render(req, res, { lists }, renderOptions);
        })
        .catch(err => {
            console.error(err);
            res.end(err);
        })
}

module.exports.saveLessons = (req, res) => {
    let formData = req.body;
    let weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    TimingsRepository.browse().then(timings => {
        let timetable = [];
        weekdays.forEach((day, dayIndex) => {
            timings.forEach((timing) => {
                if (formData[`${day}_${timing.id}_toggle`] == 'on') {
                    timetable.push({
                        weekday: day,
                        timingId: timing.id,
                        teacherId: formData[`${day}_${timing.id}_teacher`],
                        subjectId: formData[`${day}_${timing.id}_subject`],
                        auditoryId: formData[`${day}_${timing.id}_auditory`] || null
                    });
                }
            })
        });

        LessonsRepository
            .saveTimetable(timetable, formData.group, formData.weektype)
            .then(() => res.redirect('/t/timetable?message=created'))
            .catch((err) => {
                res.redirect('/t/timetable?error=' + err);
                console.error(err);
            });
    });
}