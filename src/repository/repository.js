'use strict';

let LessonsRepository = require('./lessons-repository');
let TasksRepository = require('./tasks-repository');
let TimeRepository = require('./time-repository');

function CreateRepository(db) {
    function MiddleWareFunction(req, res, next) {
        
        let repository = {
            lessons: new LessonsRepository(db, req.user),
            tasks: new TasksRepository(db, req.user),
            time: new TimeRepository()
        };

        req.repository = repository;
        next();
    }

    return MiddleWareFunction;
}

module.exports = CreateRepository;