/*
 * @author David Menger
 */
'use strict';

const { makeAbsolute } = require('./pathUtils');
const { tokenize } = require('./tokenizer');
const { FLAG_DISAMBIGUATION_SELECTED } = require('../flags');
const { checkSetState } = require('./stateVariables');

function makeExpectedKeyword (action, title, matcher = null, payloadData = {}, setState = null) {
    let match = null;

    if (Array.isArray(matcher)) {
        match = matcher;
    } else if (matcher instanceof RegExp) {
        match = `#${matcher.source}#`;
    } else if (typeof matcher === 'string') {
        match = `#${tokenize(matcher)}`;
    } else {
        // make matcher from title
        match = `#${tokenize(title)}`;
    }

    const ret = {
        action,
        title,
        match,
        data: payloadData
    };

    if (setState) Object.assign(ret, { setState });

    return ret;
}

/**
 *
 * @ignore
 * @param {object|object[]|null} replies
 * @param {string} [path]
 * @param {Function} [translate=w => w]
 * @param {object[]} [quickReplyCollector]
 * @param {Ai} ai
 * @returns {{quickReplies: object[], expectedKeywords: object[], disambiguationIntents: string[]}}
 */
function makeQuickReplies (replies, path = '', translate = (w) => w, quickReplyCollector = [], ai = null) {

    const expectedKeywords = [];
    const disambiguationIntents = [];

    let iterate = replies;

    // if there are no replies and quickReplyCollector collector
    // has only "_justToExisting" items, skip it
    if (!iterate
        && quickReplyCollector.every((q) => q._justToExisting)) {

        return { quickReplies: [], expectedKeywords, disambiguationIntents };
    }

    if (!Array.isArray(iterate)) {
        iterate = Object.keys(replies)
            .map((action) => {
                const value = replies[action];

                if (typeof value === 'object') {
                    return { ...value, action };
                }

                return { title: value, action };
            });
    }

    let unshift = 0;
    quickReplyCollector.forEach((reply) => {
        if (reply._justToExisting) {
            delete reply._justToExisting; // eslint-disable-line no-param-reassign
        }
        if (reply._prepend) {
            delete reply._prepend; // eslint-disable-line no-param-reassign
            iterate.splice(unshift++, 0, reply);
        } else {
            iterate.push(reply);
        }
    });

    const quickReplies = iterate
        .map((reply) => {
            const {
                title,
                action,
                match,
                data = {},
                isLocation = false,
                isEmail = false,
                isPhone = false
            } = reply;
            let {
                setState = null
            } = reply;

            if (isLocation) {
                return {
                    content_type: 'location'
                };
            }

            if (isPhone) {
                return {
                    content_type: 'user_phone_number'
                };
            }

            if (isEmail) {
                return {
                    content_type: 'user_email'
                };
            }

            let absoluteAction = null;

            if (action) {
                absoluteAction = makeAbsolute(action, path);
            }

            let payload = absoluteAction;

            if (match && ai) {
                const rule = ai.matcher.preprocessRule(match);
                const entitiesSetState = ai.matcher.getSetStateForEntityRules(rule);

                if (Object.keys(entitiesSetState).length !== 0) {
                    if (!setState) {
                        setState = entitiesSetState;
                    } else {
                        checkSetState(setState, entitiesSetState);
                        setState = {
                            ...entitiesSetState,
                            ...setState
                        };
                    }
                }
            }

            const hasData = Object.keys(data).length !== 0;
            const hasSetState = setState && Object.keys(setState).length !== 0;

            if (hasData || hasSetState) {

                if (data._senderMeta
                    && data._senderMeta.flag === FLAG_DISAMBIGUATION_SELECTED) {

                    const { likelyIntent } = data._senderMeta;
                    disambiguationIntents.push(likelyIntent);
                }

                payload = {
                    action: absoluteAction
                };

                if (hasData) Object.assign(payload, { data });
                if (hasSetState) Object.assign(payload, { setState });

                payload = JSON.stringify(payload);
            }

            const translatedTitle = translate(title);
            const expect = makeExpectedKeyword(
                absoluteAction, translatedTitle, match, data, setState
            );
            expectedKeywords.push(expect);

            const res = {
                content_type: 'text',
                title: translatedTitle
            };

            if (payload) {
                Object.assign(res, {
                    payload
                });
            }

            return res;
        });

    return {
        quickReplies, expectedKeywords, disambiguationIntents
    };
}

/**
 *
 * @ignore
 * @param {object[]} expectedKeywords
 * @param {Request} req
 * @param {Ai} ai
 * @returns {null|object}
 */
function quickReplyAction (expectedKeywords, req, ai) {
    const text = req.text();

    if (text) {
        const lcText = text.toLocaleLowerCase();
        const lowerCaseMatch = expectedKeywords
            .filter((keyword) => keyword.title && keyword.title.toLocaleLowerCase() === lcText);

        if (lowerCaseMatch.length === 1) {
            return lowerCaseMatch[0];
        }

        const exactMatch = expectedKeywords
            .filter((keyword) => keyword.title === text);

        if (exactMatch.length !== 0) {
            return exactMatch[0];
        }
    } else if (!req.isTextOrIntent()) {
        return null;
    }

    // @todo disambiguate
    const found = [];
    expectedKeywords
        .forEach((keyword) => {
            const intent = ai.ruleIsMatching(keyword.match, req, true);
            if (intent) {
                const { score, setState } = intent;

                found.push({
                    ...keyword,
                    score,
                    setState: keyword.setState
                        ? { ...keyword.setState, ...setState }
                        : setState
                });
            }
        });

    if (found.length === 0) {
        return null;
    }

    found.sort(({ score: a }, { score: z }) => z - a);

    return found[0];
}

/**
 * Create a disambiguation quick reply
 *
 * @param {string} title - quick reply title
 * @param {string} likelyIntent - possible intent
 * @param {string} disambText - users text input
 * @param {string} action - action to process the disambbiguation
 * @param {object} data - optional data
 */
function disambiguationQuickReply (title, likelyIntent, disambText, action, data = {}) {
    return {
        ...data,
        title,
        action,
        data: {
            ...data,
            _senderMeta: {
                flag: FLAG_DISAMBIGUATION_SELECTED,
                likelyIntent,
                disambText
            }
        }
    };
}

module.exports = {
    makeQuickReplies,
    quickReplyAction,
    disambiguationQuickReply
};
