/**
 * @author David Menger
 */
'use strict';

const { replaceDiacritics } = require('../utils');

/**
 * @typedef {object} DetectedEntity
 * @prop {number} [start]
 * @prop {string} [entity]
 * @prop {number} [end]
 * @prop {number} [score]
 * @prop {string|number|boolean} [value]
 * @prop {string} [text]
 */

/**
 * @callback EntityDetector
 * @param {string} text - part of text
 * @param {DetectedEntity[]} entities - dependent entities
 * @param {boolean} [searchWithinWords] - optional ability to search within words
 * @returns {DetectedEntity[]|DetectedEntity|Promise<DetectedEntity>|Promise<DetectedEntity[]>}
 */

/**
 * @callback ValueExtractor
 * @param {string[]} match - regexp result
 * @param {DetectedEntity[]} entities - dependent entities
 * @returns {*}
 */

/**
 * @typedef {object} Entity
 * @prop {string} entity
 * @prop {string} value
 * @prop {number} score
 */

/**
 * @typedef {object} Intent
 * @prop {string} intent
 * @prop {number} score
 * @prop {Entity[]} [entities]
 */

/**
 * @typedef {object} Result
 * @prop {string} text
 * @prop {Entity[]} entities
 * @prop {Intent[]} intents
 */

/**
 * @typedef {object} Phrases
 * @prop {Map<string,string[]>} phrases
 */

/** @typedef {import('../Request')} Request */

function optionalWrap (l, r, content) {
    const consistent = !l === !r;
    if (consistent) {
        return `(${content})`;
    }
    return `${l || ''}(${content})${r || ''}`;
}

class CustomEntityDetectionModel {

    /**
     * @param {object} options
     * @param {{ warn: Function, error: Function }} [log]
     */
    constructor (options, log = console) {
        this._options = options;
        this._log = log;

        this._entityDetectors = new Map();

        /**
         * @type {number}
         */
        this.phrasesCacheTime = 0;
    }

    /**
     *
     * @param {DetectedEntity[]} entities
     * @param {string} entity
     * @param {string} text
     * @param {number} offset
     * @param {string} originalText
     */
    _normalizeResult (entities, entity, text, offset, originalText) {

        return entities
            .map((e) => {
                if (!e) {
                    return null;
                }
                const score = typeof e.score !== 'number' ? 1 : Math.max(Math.min(e.score, 1), 0);
                if (typeof e.text !== 'string'
                    && (typeof e.start !== 'number' || typeof e.end !== 'number')) {

                    throw new Error(`Entity matcher '${entity}' should return 'text' or 'start'+'end' hint`);
                }

                if (typeof e.text === 'string') {
                    if (!e.text) {
                        return null;
                    }

                    const start = offset + text.toLocaleLowerCase()
                        .indexOf(e.text.toLocaleLowerCase());

                    if (start === -1) {
                        throw new Error(`Entity matcher '${entity}' retuned string, which cannot be found in query`);
                    }

                    const end = start + e.text.length;

                    const useText = originalText.substring(start, end);

                    return {
                        ...e,
                        text: useText,
                        entity,
                        start,
                        end,
                        score
                    };
                }

                if (e.start < 0 || e.start >= text.length) {
                    throw new Error(`Entity matcher '${entity}' retuned start out of bounds: ${e.start} (string length was ${text.length})`);
                }

                if (e.start === e.end) {
                    return null;
                }

                if (e.end < e.start || e.end > text.length) {
                    throw new Error(`Entity matcher '${entity}' retuned end out of bounds: ${e.end} (start: ${e.start}, length: ${text.length})`);
                }

                const entityText = text.substring(e.start, e.end);

                return {
                    ...e,
                    entity,
                    text: entityText,
                    start: offset + e.start,
                    end: offset + e.end,
                    score
                };
            })
            .filter((e) => e !== null);
    }

    /**
     *
     * @param {string} entity
     * @param {string} text
     * @param {DetectedEntity[]} entities
     * @param {DetectedEntity[]} subWord
     * @returns {Promise<DetectedEntity[]>}
     */
    async _detectAllEntities (entity, text, entities, subWord) {
        const [regularResults, subWordResults] = await Promise.all([
            this._detectEntities(entity, text, entities, subWord, false),
            this._detectEntities(entity, text, entities, subWord, true)
        ]);

        const cleanSubWordResults = subWordResults
            .filter((regular) => !regularResults
                .some((e) => e.start < regular.end && e.end > regular.start
                    && e.end >= regular.end && e.start <= regular.start));

        subWord.push(...cleanSubWordResults);

        return regularResults;
    }

    /**
     *
     * @param {string} entity
     * @param {string} text
     * @param {DetectedEntity[]} entities
     * @param {DetectedEntity[]} subWord
     * @param {boolean} detectSubWords
     * @returns {Promise<DetectedEntity[]>}
     */
    async _detectEntities (entity, text, entities, subWord, detectSubWords) {
        const { entityDetector, dependencies } = this._entityDetectors.get(entity);

        if (detectSubWords && entityDetector.length < 3) {
            return [];
        }

        const collected = [];
        let o = 0;
        let t = text;
        try {
            for (let i = 0; i < text.length; i++) {
                const dependentEntities = [
                    ...subWord.filter((e) => dependencies.includes(`@${e.entity.toUpperCase()}`)),
                    ...entities.filter((e) => dependencies.includes(`@${e.entity.toUpperCase()}`))
                ];
                const res = await Promise.resolve(
                    entityDetector(t, dependentEntities, detectSubWords)
                );

                const resWasArray = Array.isArray(res);
                const resArray = resWasArray ? res : [res];
                const normalized = this._normalizeResult(resArray, entity, t, o, text);

                if (resWasArray || normalized.length === 0) {
                    return [...collected, ...normalized];
                }

                const [e] = normalized;

                t = text.substring(e.end);
                const [whitespaces] = t.match(/^\s*/);
                t = t.substring(whitespaces.length);
                o = e.end + whitespaces.length;

                collected.push(e);
            }

            this._log.error(`Entity '${entity}' detection reached iteration limit`);
            return collected;
        } catch (e) {
            this._log.error(`Entity '${entity}' detection failed`, e);
            return collected;
        }
    }

    _escapeRegex (string, shouldReplaceDiacritics) {
        const ret = string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

        if (!shouldReplaceDiacritics) {
            return ret;
        }

        return replaceDiacritics(ret);
    }

    /**
     * Return only entities without overlap
     *
     * @param {DetectedEntity[]} entities
     * @param {string[]} [expectedEntities]
     * @returns {DetectedEntity[]}
     */
    nonOverlapping (entities, expectedEntities = []) {
        // longest first
        entities.sort(({ start: a, end: b }, { start: z, end: y }) => {
            const aLen = b - a;
            const zLen = y - z;

            if (aLen === zLen) {
                return a - z;
            }
            return zLen - aLen;
        });

        let res = [];

        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];

            const isExpected = expectedEntities.includes(entity.entity);

            let overlapping = res
                .some((e) => e.start < entity.end && e.end > entity.start);

            if (overlapping) {
                const duplicate = res
                    .find((e) => e.start === entity.start && e.end === entity.end);

                if (duplicate) {
                    overlapping = !isExpected && expectedEntities.includes(duplicate.entity);
                }

                if (isExpected) {
                    overlapping = false;
                    res = res.filter((e) => {
                        const isOverlapping = e.start < entity.end && e.end > entity.start;

                        if (!isOverlapping) {
                            return true;
                        }

                        const expectedEntity = expectedEntities.includes(e.entity);

                        if (expectedEntity && !duplicate) {
                            overlapping = true;
                        }

                        return expectedEntity;
                    });

                    // try to put back previously ignored entities
                    for (let k = 0; k < i; k++) {
                        const putback = entities[k];
                        const currentConflict = putback.start < entity.end
                            && putback.end > entity.start;

                        const othersConflict = res.some((e) => putback === e
                            || (e.start < putback.end && e.end > putback.start));

                        if (!currentConflict && !othersConflict) {
                            res.push(putback);
                        }
                    }
                }
            }

            if (!overlapping) {
                res.push(entity);
            }
        }

        res.sort(({ start: a }, { start: z }) => a - z);

        return res;
    }

    /**
     *
     * @param {boolean} [known]
     * @returns {string[]} -
     */
    getDependentEntities (known = null) {
        const entities = new Set();
        const knownEntities = new Map(
            Array.from(this._entityDetectors.keys())
                .map((key) => [key.toLowerCase(), key])
        );

        for (const { dependencies } of this._entityDetectors.values()) {
            for (const entity of dependencies) {
                const lowerCase = entity.replace(/^@/, '').toLowerCase();
                const isKnown = knownEntities.has(lowerCase);

                if (isKnown && known !== false) {
                    entities.add(knownEntities.get(lowerCase));
                } else if (!isKnown && known !== true) {
                    entities.add(lowerCase);
                }
            }
        }

        return Array.from(entities.values());
    }

    /**
     *
     * @param {string} text
     * @param {string} [singleEntity]
     * @param {string[]} [expected]
     * @param {DetectedEntity[]} [prevEnts] - previously detected entities to include
     * @param {DetectedEntity[]} [subWord] - previously detected entities within words
     * @returns {Promise<DetectedEntity[]>}
     */
    async resolveEntities (text, singleEntity = null, expected = [], prevEnts = [], subWord = []) {
        // mark unknown dependencies as resolved
        const resolved = new Set(
            this.getDependentEntities(false)
                .map((entity) => `@${entity.toUpperCase()}`)
        );

        let missing = Array.from(this._entityDetectors.keys());
        const entities = prevEnts.map((e) => {
            if (typeof e.text === 'string') {
                return e;
            }
            return {
                ...e,
                text: text.substring(e.start, e.end)
            };
        });

        while (missing.length !== 0) {
            let detect = [];

            missing = missing.filter((e) => {
                const { dependencies } = this._entityDetectors.get(e);

                if (dependencies.every((d) => resolved.has(d))) {
                    detect.push(e);
                    return false;
                }
                return true;
            });

            if (detect.length === 0 && missing.length !== 0) {
                this._log.warn(`Ignoring entities because of dependency cycle: ${missing.join(', ')}`);
                break;
            }

            if (singleEntity && detect.includes(singleEntity)) {
                detect = [singleEntity];
                missing = [];
            }

            const results = await Promise.all(
                detect.map((entity) => this._detectAllEntities(entity, text, entities, subWord))
            );

            detect.forEach((entity) => resolved.add(`@${entity.toUpperCase()}`));

            results.forEach((res) => entities.push(...res));
        }

        const clean = this.nonOverlapping(entities, expected);

        if (!singleEntity) {
            return clean;
        }

        const entity = clean.find((e) => e.entity === singleEntity);

        if (!entity) {
            return [];
        }

        return [entity];
    }

    async resolveEntityValue (entity, text) {
        if (!this._entityDetectors.has(entity)) {
            return text;
        }
        const [res = null] = await this.resolveEntities(text, entity);
        return res ? res.value : null;
    }

    /**
     *
     * @param {string} text - the user input
     * @param {Request} [req]
     * @returns {Promise<Result>}
     */
    async resolve (text, req) {
        let cleanText = text
            .replace(/[\r\n]+/g, ' ')
            .trim();
        const expectedEntities = req ? req.expectedEntities() : [];
        const entities = await this.resolveEntities(cleanText, null, expectedEntities);
        cleanText = cleanText.toLocaleLowerCase();

        // filter the text
        for (let i = entities.length - 1; i >= 0; i--) {
            const entity = entities[i];
            const { anonymize } = this._entityDetectors.get(entity.entity);

            if (anonymize) {
                const before = cleanText.substring(0, entity.start);
                const after = cleanText.substring(entity.end);

                cleanText = `${before}@${entity.entity.toUpperCase()}${after}`;
            }
        }

        return {
            text: cleanText,
            intents: [],
            entities
        };
    }

    /**
     *
     * @param {RegExp} regexp
     */
    _extractRegExpDependencies (regexp) {
        const matches = regexp.source.match(/@[A-Z0-9-]+/g);
        return Array.from(new Set(matches).values());
    }

    /**
     *
     * @param {DetectedEntity[]} entities
     * @param {string} dependency
     * @returns {DetectedEntity|null}
     */
    _entityByDependency (entities, dependency) {
        return entities.find((e) => `@${e.entity.toUpperCase()}` === dependency);
    }

    /**
     *
     * @param {RegExp} regexp
     * @param {object} [options]
     * @param {Function|string} [options.extractValue] - entity extractor
     * @param {boolean} [options.matchWholeWords] - match whole words at regular expression
     * @param {boolean} [options.replaceDiacritics] - replace diacritics when matching regexp
     * @param {string[]} [options.dependencies] - array of dependent entities
     */
    _regexpToDetector (regexp, options) {
        const { dependencies = [], extractValue = null } = options;
        const { source } = regexp;

        /**
         * @param {string} text
         * @param {DetectedEntity[]} entities
         * @param {boolean} searchWithinWords
         */
        return (text, entities, searchWithinWords) => {
            if (typeof extractValue === 'string'
                && !this._entityByDependency(entities, extractValue)) {

                return null;
            }

            let replaced = source.replace(/(\()?@([A-Z0-9-]+)(\))?/g, (value, l, ent, r) => {
                const matchingEntities = entities
                    .filter((e) => e.entity.toUpperCase() === ent)
                    .map((e) => this._escapeRegex(e.text, options.replaceDiacritics));

                if (matchingEntities.length === 0) {
                    return optionalWrap(l, r, `@${ent}`);
                }
                matchingEntities.sort((a, z) => z.length - a.length);
                return optionalWrap(l, r, matchingEntities.join('|'));
            });

            if (options.matchWholeWords && !searchWithinWords) {
                replaced = `(?<=(^|[^a-z0-9\u00C0-\u017F]))${replaced}(?=([^a-z0-9\u00C0-\u017F]|$))`;
            }

            const r = new RegExp(replaced, 'i');
            const lc = text.toLocaleLowerCase();
            let matchText = lc;
            if (options.replaceDiacritics) {
                matchText = replaceDiacritics(matchText);
            }
            const match = matchText.match(r);

            // console.log({ matchText, replaced, match: match && match[0], searchWithinWords });

            if (!match) {
                return null;
            }

            // find the right entity
            const start = match.index;
            const end = start + match[0].length;
            matchText = lc.substring(start, end);

            const useEntities = entities.filter((e) => e.start >= start && e.end <= end);

            let value;

            if (typeof extractValue === 'function') {
                value = extractValue(match, useEntities);
            } else if (typeof extractValue === 'string' || dependencies.length > 0) {
                const entityName = typeof extractValue === 'string'
                    ? extractValue
                    : dependencies[0];

                const entity = this._entityByDependency(useEntities, entityName);
                value = entity ? entity.value : null;
            } else {
                [value] = match;
            }

            return {
                text: matchText,
                start,
                end,
                value
            };
        };
    }

    /**
     *
     * @param {string} name
     * @param {EntityDetector|RegExp} detector
     * @param {object} [options]
     * @param {boolean} [options.anonymize] - if true, value will not be sent to NLP
     * @param {Function|string} [options.extractValue] - entity extractor
     * @param {boolean} [options.matchWholeWords] - match whole words at regular expression
     * @param {boolean} [options.replaceDiacritics] - keep diacritics when matching regexp
     * @param {string[]} [options.dependencies] - array of dependent entities
     * @returns {this}
     */
    setEntityDetector (name, detector, options = {}) {
        const entity = name;
        let entityDetector = detector;
        let dependencies = [];

        if (detector instanceof RegExp) {
            dependencies = this._extractRegExpDependencies(detector);
            if (typeof options.extractValue === 'string' && !dependencies.includes(options.extractValue)) {
                throw new Error(`RegExp entity detector '${name}' uses ${options.extractValue} extractValue but it's missing in RegExp`);
            }
            entityDetector = this._regexpToDetector(detector, { ...options, dependencies });
        } else if (options.dependencies) {
            dependencies = dependencies
                .map((d) => (`${d}`.match(/^@/) ? `${d}`.toUpperCase() : `@${d.toUpperCase()}`));
        }

        this._entityDetectors.set(entity, {
            entityDetector,
            detector,
            dependencies,
            anonymize: !!options.anonymize
        });

        return this;
    }

    async getPhrases () {
        return this._getPhrases();
    }

    async _getPhrases () {
        return CustomEntityDetectionModel.getEmptyPhrasesObject();
    }

    static getEmptyPhrasesObject () {
        return { phrases: new Map() };
    }
}

module.exports = CustomEntityDetectionModel;
