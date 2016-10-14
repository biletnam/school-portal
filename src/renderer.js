'use strict';

const STUDENT_THEME = { primary: 'teal', secondary: 'blue' };
const TEACHER_THEME = { primary: 'purple', secondary: 'indigo' };

function create(layout_mode) {
    return function (req, res, params, options) {

        let mandatory_params = {
            title: options.title,
            user: req.school_context.user,
            layout: layout_mode
        };

        switch (layout_mode) {
            case 'teacher':
                mandatory_params.theme = TEACHER_THEME;
                break;
            case 'student':
                mandatory_params.theme = STUDENT_THEME;
                break;
        }

        res.render(options.view, Object.assign(mandatory_params, params));
        res.end();
    }
}

module.exports = create;