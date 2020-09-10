/*
 * @author David Menger
 */
'use strict';

const { default: fetch } = require('node-fetch');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

class WingbotApiConnector {

    constructor (options) {
        this._token = options.token;
        this._appToken = options.appToken;
        this._keysUrl = options.keysUrl;
        this._cacheFor = options.cacheKeys;
        this._useBundledGql = options.useBundledGql;

        this._keys = null;
        this._keysLoaded = 0;
        this._schema = null;
    }

    _verify (token, key) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, key, {}, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    _error (message, code) {
        const err = new Error(message);
        return Object.assign(err, { code, status: code });
    }

    async getSchema () {
        await this._getKeys();

        return this._schema;
    }

    async verifyToken (token, wingbotToken = this._token) {
        if (!token) {
            throw this._error('Unauthorized', 401);
        }

        if (this._appToken && token === this._appToken) {
            const appToken = await Promise.resolve(this._appToken);

            if (token === appToken) {
                return { id: null, groups: [{ group: 'appToken' }] };
            }
        }

        try {
            const decoded = jwt.decode(token, { complete: true });

            if (!decoded) {
                throw new Error('Unknown key format');
            }

            // @ts-ignore
            const { header, payload } = decoded;

            const resolvedToken = await Promise.resolve(wingbotToken);

            if (resolvedToken !== payload.token) {
                throw new Error('Token does not match');
            }

            const keys = await this._getKeys();

            const key = keys.find((k) => k.kid === header.kid);

            if (!key) {
                throw new Error('No key found');
            }

            return this._verify(token, key.public);
        } catch (e) {
            throw this._error(`Forbidden: ${e.message}`, 403);
        }
    }

    async _getKeys () {
        if (this._keys instanceof Promise) {
            await this._keys;
        }
        if (this._keysLoaded < (Date.now() - this._cacheFor)) {
            this._keys = this._loadKeys();
            await this._keys;
        }
        return this._keys;
    }

    async _loadKeys () {
        const res = await fetch(this._keysUrl);

        const data = await res.json();

        this._keys = data.keys;
        this._schema = this._useBundledGql
            ? fs.readFileSync(path.resolve(__dirname, 'schema.gql'), { encoding: 'utf8' })
            : data.schema;
        this._keysLoaded = Date.now();
    }

}

module.exports = WingbotApiConnector;
