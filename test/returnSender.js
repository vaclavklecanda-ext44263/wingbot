/**
 * @author David Menger
 */
'use strict';

const assert = require('assert');
const sinon = require('sinon');
const ReturnSender = require('../src/ReturnSender');
const Tester = require('../src/Tester');
const Router = require('../src/Router');
const { Processor, Request } = require('..');

describe('<ReturnSender>', () => {

    it('throws an error through the processor', async () => {

        const bot = new Router();

        bot.use((req, res) => {
            res.text('foo');
        });

        const log = {
            error: sinon.spy(),
            log: sinon.spy()
        };

        const p = new Processor(bot, { log });

        class MockSender extends ReturnSender {

            async _send (m) {
                if (m.message && m.message.text === 'foo') {
                    throw new Error('fails');
                }

                return { message_id: '0' };
            }

        }

        const req = Request.text('u', 'bar');
        const s = new MockSender({}, 'u', req);

        let error = null;
        try {
            await p.processMessage(req, 'i', s);
        } catch (e) {
            error = e;
        }

        assert.ok(log.error.calledOnce);
        assert.ok(log.error.firstCall.args[0] instanceof Error, 'there should be an error');
        assert.strictEqual(log.error.firstCall.args[1], req);
        assert.strictEqual(error, null, 'there should no an error');
    });

    describe('#send() & finished()', () => {

        it('should retain catched error', async () => {
            const rs = new ReturnSender({}, 'a', {});

            rs.simulateFail = true;

            rs.send({ a: 1 });

            rs.send({ wait: 100 });

            rs.simulateFail = true;

            rs.send({ b: 1 });

            await new Promise((r) => setTimeout(r, 10));

            let err = null;
            try {
                await rs.finished();
            } catch (e) {
                err = e;
            }

            assert.equal(err && err.message, 'Fail');
        });

        it('should not log, if requested', async () => {
            const bot = new Router();

            bot.use('notlog', (req, res) => {
                res.text('not')
                    .doNotLogTheEvent();
            });

            bot.use('log', (req, res) => {
                res.text('log');
            });
            const t = new Tester(bot);
            // @ts-ignore
            t.senderLogger = {
                log: sinon.spy(),
                error: sinon.spy()
            };

            await t.postBack('log');

            t.any().contains('log');

            // @ts-ignore
            assert.equal(t.senderLogger.log.callCount, 1);

            await t.postBack('notLog');

            t.any().contains('not');

            // @ts-ignore
            assert.equal(t.senderLogger.log.callCount, 1);
        });

    });

    describe('#textFilter', () => {

        it('is able to filter text data', async () => {
            const collect = [];
            const log = (...args) => collect.push(args);

            const rs = new ReturnSender(
                { textFilter: () => 'good' },
                'a',
                { message: { text: 'bad' } },
                // @ts-ignore
                { log, error: log, info: log }
            );

            rs.send({ message: { text: 'bad' } });

            rs.send({ message: { attachment: { type: 'template', payload: { text: 'bad' } } } });

            const res = await rs.finished();

            assert.equal(res.status, 200);
            assert.deepEqual(collect, [
                [
                    'a',
                    [
                        { message: { text: 'good' } },
                        { message: { attachment: { type: 'template', payload: { text: 'good' } } } }
                    ],
                    { message: { text: 'good' } },
                    { visitedInteractions: [] }
                ]
            ]);

        });

    });

});
