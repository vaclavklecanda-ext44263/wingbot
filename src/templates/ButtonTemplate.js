/*
 * @author David Menger
 */
'use strict';

const BaseTemplate = require('./BaseTemplate');
const { makeAbsolute } = require('../utils');

/**
 * Helps with creating of button template
 * Instance of button template is returned by {Responder}
 *
 * @class
 * @extends BaseTemplate
 */
class ButtonTemplate extends BaseTemplate {

    constructor (onDone, context, text) {
        super(onDone, context);

        this.text = text;
        this.buttons = [];
    }

    _makeExtensionUrl (url, hasExtension) {
        if (hasExtension) {
            const hash = [
                `token=${encodeURIComponent(this.context.token)}`,
                `senderId=${encodeURIComponent(this.context.senderId)}`
            ];
            const ret = `${url}#${hash.join('&')}`;

            // prepend url only when url does not contain sheme
            if (ret.match(/^https?:\/\//) || !this.context.appUrl) {
                return ret;
            }

            return `${this.context.appUrl}${ret}`;
        }
        return url;
    }

    /**
     * Adds button. When `hasExtension` is set to `true`, url will contain hash like:
     * `#token=foo&senderId=23344`
     *
     * @param {string} title - button text
     * @param {string} linkUrl - button url
     * @param {boolean} hasExtension - includes token in url
     * @param {string} [webviewHeight=null] - compact|tall|full
     * @returns {this}
     *
     * @memberOf ButtonTemplate
     */
    urlButton (title, linkUrl, hasExtension = false, webviewHeight = null) {
        this.buttons.push({
            type: 'web_url',
            title: this._t(title),
            url: this._makeExtensionUrl(linkUrl, hasExtension),
            webview_height_ratio: webviewHeight || (hasExtension ? 'tall' : 'full'),
            messenger_extensions: hasExtension
        });
        return this;
    }

    /**
     * Adds button, which makes another action
     *
     * @param {string} title - Button title
     * @param {string} action - Button action (can be absolute or relative)
     * @param {object} [data={}] - Action data
     * @param {object} [setState] - SetState data
     * @returns {this}
     *
     * @memberOf ButtonTemplate
     */
    postBackButton (title, action, data = {}, setState = null) {
        const hasSetState = setState && Object.keys(setState).length !== 0;

        this.buttons.push({
            type: 'postback',
            title: this._t(title),
            payload: JSON.stringify({
                action: makeAbsolute(action, this.context.path),
                data: {
                    _ca: this.context.currentAction,
                    ...data
                },
                ...(hasSetState ? { setState } : {})
            })
        });
        return this;
    }

    /**
     *
     * @returns {this}
     *
     * @memberOf ButtonTemplate
     */
    shareButton () {
        this.buttons.push({
            type: 'element_share'
        });
        return this;
    }

    getTemplate () {
        const res = {
            template_type: 'button',
            text: this._t(this.text),
            buttons: this.buttons
        };
        return res;
    }

}

module.exports = ButtonTemplate;
