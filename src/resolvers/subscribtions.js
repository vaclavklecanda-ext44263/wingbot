/*
 * @author David Menger
 */
'use strict';

const Router = require('../Router');
const getCondition = require('../utils/getCondition');

function subscribtions (params, { isLastIndex, allowForbiddenSnippetWords }) {
    const {
        tags = [],
        unsetTag = false
    } = params;

    const condition = getCondition(params, '', allowForbiddenSnippetWords);

    const ret = isLastIndex ? Router.END : Router.CONTINUE;
    const method = unsetTag ? 'unsubscribe' : 'subscribe';

    return async (req, res) => {
        if (condition !== null) {
            let condRes = condition(req, res);

            if (condRes instanceof Promise) {
                condRes = await condRes;
            }

            if (!condRes) {
                return ret;
            }
        }

        if (typeof res[method] !== 'function') {
            return ret;
        }

        if (tags.length === 0 && unsetTag) {
            res.unsubscribe();
        }

        tags.forEach((tag) => res[method](tag));

        return ret;
    };
}

module.exports = subscribtions;
