import { combineReducers } from 'redux';

import site from './site';
import config from './config';
import course from './course';
import exam from './exam';
import study from './study';
import news from './news';
import order from './order';
import activity from './activity';
import o2o from './o2o';
import group from './group';
import ask from './ask';
import teacher from './teacher';
import user from './user';
import passport from './passport';

export default combineReducers({
    site,
    config,
    course,
    exam,
    study,
    news,
    order,
    activity,
    o2o,
    group,
    ask,
    teacher,
    user,
    passport,
});