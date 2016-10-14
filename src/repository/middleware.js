'use strict';

let LessonsRepository = require('./lessons');
let TasksRepository = require('./tasks');
let TimeRepository = require('./time');
let StudentsRepository = require('./students');

function CreateRepository(db) {
    function MiddlewareFunction(req, res, next) {
        
        let repository = {
            lessons: new LessonsRepository(db, req.user),
            tasks: new TasksRepository(db, req.user),
            time: new TimeRepository(),
            students: new StudentsRepository()
        };

        req.school_context.repository = repository;
        next();
    }

    return MiddlewareFunction;
}

module.exports = CreateRepository;