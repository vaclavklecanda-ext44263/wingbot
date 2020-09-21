## Classes

<dl>
<dt><a href="#Ai">Ai</a></dt>
<dd></dd>
<dt><a href="#CustomEntityDetectionModel">CustomEntityDetectionModel</a></dt>
<dd></dd>
<dt><a href="#WingbotModel">WingbotModel</a></dt>
<dd></dd>
<dt><a href="#CachedModel">CachedModel</a></dt>
<dd></dd>
<dt><a href="#AiMatching">AiMatching</a></dt>
<dd><p>{AiMatching}</p>
<p>Class responsible for NLP Routing by score</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#EntityExpression">EntityExpression</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#textFilter">textFilter</a> ⇒ <code>string</code></dt>
<dd><p>Text filter function</p>
</dd>
<dt><a href="#IntentRule">IntentRule</a> : <code>string</code> | <code><a href="#EntityExpression">EntityExpression</a></code></dt>
<dd></dd>
<dt><a href="#BotPath">BotPath</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#IntentAction">IntentAction</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#DetectedEntity">DetectedEntity</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#EntityDetector">EntityDetector</a> ⇒ <code><a href="#DetectedEntity">Array.&lt;DetectedEntity&gt;</a></code> | <code><a href="#DetectedEntity">DetectedEntity</a></code> | <code><a href="#DetectedEntity">Promise.&lt;DetectedEntity&gt;</a></code> | <code>Promise.&lt;Array.&lt;DetectedEntity&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#ValueExtractor">ValueExtractor</a> ⇒ <code>*</code></dt>
<dd></dd>
<dt><a href="#Entity">Entity</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Intent">Intent</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Result">Result</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Entity">Entity</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Intent">Intent</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Result">Result</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Entity">Entity</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Intent">Intent</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Result">Result</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Compare">Compare</a> : <code>string</code></dt>
<dd></dd>
<dt><a href="#Entity">Entity</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Intent">Intent</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#EntityExpression">EntityExpression</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#IntentRule">IntentRule</a> : <code>string</code> | <code><a href="#EntityExpression">EntityExpression</a></code></dt>
<dd></dd>
<dt><a href="#RegexpComparator">RegexpComparator</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#PreprocessorOutput">PreprocessorOutput</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#AIRequest">AIRequest</a> : <code>object</code></dt>
<dd></dd>
</dl>

{% raw %}<div id="Ai">&nbsp;</div>{% endraw %}

## Ai
**Kind**: global class  

* [Ai](#Ai)
    * [.confidence](#Ai_confidence) : <code>number</code>
    * [.threshold](#Ai_threshold) : <code>number</code>
    * [.logger](#Ai_logger) : <code>object</code>
    * [.matcher](#Ai_matcher) : [<code>AiMatching</code>](#AiMatching)
    * [.getPrefix(prefix, req)](#Ai_getPrefix)
    * [.textFilter(text)](#Ai_textFilter) : [<code>textFilter</code>](#textFilter)
    * [.mockIntent([intent], [score])](#Ai_mockIntent) ⇒ <code>this</code>
    * [.register(model, prefix)](#Ai_register) ⇒ [<code>WingbotModel</code>](#WingbotModel) \| <code>T</code>
    * [.getModel(prefix)](#Ai_getModel) ⇒ [<code>WingbotModel</code>](#WingbotModel)
    * [.global(path, intents, [title], [meta])](#Ai_global) ⇒ <code>object</code>
    * [.local(path, intents, [title])](#Ai_local) ⇒ <code>object</code>
    * [.match(intent)](#Ai_match) ⇒ <code>function</code>
    * [.shouldDisambiguate(aiActions)](#Ai_shouldDisambiguate) ⇒ <code>boolean</code>

{% raw %}<div id="Ai_confidence">&nbsp;</div>{% endraw %}

### ai.confidence : <code>number</code>
Upper threshold - for match method and for navigate method

**Kind**: instance property of [<code>Ai</code>](#Ai)  
{% raw %}<div id="Ai_threshold">&nbsp;</div>{% endraw %}

### ai.threshold : <code>number</code>
Lower threshold - for disambiguation

**Kind**: instance property of [<code>Ai</code>](#Ai)  
{% raw %}<div id="Ai_logger">&nbsp;</div>{% endraw %}

### ai.logger : <code>object</code>
The logger (console by default)

**Kind**: instance property of [<code>Ai</code>](#Ai)  
{% raw %}<div id="Ai_matcher">&nbsp;</div>{% endraw %}

### ai.matcher : [<code>AiMatching</code>](#AiMatching)
AI Score provider

**Kind**: instance property of [<code>Ai</code>](#Ai)  
{% raw %}<div id="Ai_getPrefix">&nbsp;</div>{% endraw %}

### ai.getPrefix(prefix, req)
The prefix translator - for request-specific prefixes

**Kind**: instance method of [<code>Ai</code>](#Ai)  

| Param | Type |
| --- | --- |
| prefix | <code>string</code> | 
| req | <code>Request</code> | 

{% raw %}<div id="Ai_textFilter">&nbsp;</div>{% endraw %}

### ai.textFilter(text) : [<code>textFilter</code>](#textFilter)
Preprocess text for NLP
For example to remove any confidential data

**Kind**: instance method of [<code>Ai</code>](#Ai)  

| Param | Type |
| --- | --- |
| text | <code>string</code> | 

{% raw %}<div id="Ai_mockIntent">&nbsp;</div>{% endraw %}

### ai.mockIntent([intent], [score]) ⇒ <code>this</code>
Usefull method for testing AI routes

**Kind**: instance method of [<code>Ai</code>](#Ai)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [intent] | <code>string</code> | <code>null</code> | intent name |
| [score] | <code>number</code> | <code></code> | the score of the top intent |

**Example**  
```js
const { Tester, ai, Route } = require('bontaut');

const bot = new Route();

bot.use(['intentAction', ai.localMatch('intentName')], (req, res) => {
    res.text('PASSED');
});

describe('bot', function () {
    it('should work', function () {
        ai.mockIntent('intentName');

        const t = new Tester(bot);

        return t.text('Any text')
            .then(() => {
                t.actionPassed('intentAction');

            t.any()
                .contains('PASSED');
        })
    });
});
```
{% raw %}<div id="Ai_register">&nbsp;</div>{% endraw %}

### ai.register(model, prefix) ⇒ [<code>WingbotModel</code>](#WingbotModel) \| <code>T</code>
Registers Wingbot AI model

**Kind**: instance method of [<code>Ai</code>](#Ai)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| model | <code>string</code> \| [<code>WingbotModel</code>](#WingbotModel) \| <code>T</code> |  | wingbot model name or AI plugin |
| prefix | <code>string</code> | <code>&quot;default&quot;</code> | model prefix |

{% raw %}<div id="Ai_getModel">&nbsp;</div>{% endraw %}

### ai.getModel(prefix) ⇒ [<code>WingbotModel</code>](#WingbotModel)
Returns registered AI model

**Kind**: instance method of [<code>Ai</code>](#Ai)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| prefix | <code>string</code> | <code>&quot;default&quot;</code> | model prefix |

{% raw %}<div id="Ai_global">&nbsp;</div>{% endraw %}

### ai.global(path, intents, [title], [meta]) ⇒ <code>object</code>
Returns matching middleware, that will export the intent to the root router
so the intent will be matched in a global context

**Kind**: instance method of [<code>Ai</code>](#Ai)  
**Returns**: <code>object</code> - - the middleware  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>string</code> |  |  |
| intents | [<code>IntentRule</code>](#IntentRule) \| [<code>Array.&lt;IntentRule&gt;</code>](#IntentRule) |  |  |
| [title] | <code>string</code> | <code>null</code> | disambiguation title |
| [meta] | <code>object</code> |  | metadata for multibot environments |
| [meta.targetAppId] | <code>object</code> |  | target application id |
| [meta.targetAction] | <code>object</code> |  | target action |

**Example**  
```js
const { Router, ai } = require('wingbot');

ai.register('app-model');

bot.use(ai.global('route-path', 'intent1'), (req, res) => {
    console.log(req.intent(true)); // { intent: 'intent1', score: 0.9604 }

    res.text('Oh, intent 1 :)');
});
```
{% raw %}<div id="Ai_local">&nbsp;</div>{% endraw %}

### ai.local(path, intents, [title]) ⇒ <code>object</code>
Returns matching middleware, that will export the intent to the root router
so the intent will be matched in a context of local dialogue

**Kind**: instance method of [<code>Ai</code>](#Ai)  
**Returns**: <code>object</code> - - the middleware  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>string</code> |  |  |
| intents | [<code>IntentRule</code>](#IntentRule) \| [<code>Array.&lt;IntentRule&gt;</code>](#IntentRule) |  |  |
| [title] | <code>string</code> | <code>null</code> | disambiguation title |

**Example**  
```js
const { Router, ai } = require('wingbot');

ai.register('app-model');

bot.use(ai.global('route-path', 'intent1'), (req, res) => {
    console.log(req.intent(true)); // { intent: 'intent1', score: 0.9604 }

    res.text('Oh, intent 1 :)');
});
```
{% raw %}<div id="Ai_match">&nbsp;</div>{% endraw %}

### ai.match(intent) ⇒ <code>function</code>
Returns matching middleware

**supports:**

- intents (`'intentName'`)
- entities (`'@entity'`)
- entities with conditions (`'@entity=PRG,NYC'`)
- entities with conditions (`'@entity>=100'`)
- complex entities (`{ entity:'entity', op:'range', compare:[null,1000] }`)
- optional entities (`{ entity:'entity', optional: true }`)
- wildcard keywords (`'#keyword#'`)
- phrases (`'#first-phrase|second-phrase'`)
- emojis (`'#😄🙃😛'`)

**Kind**: instance method of [<code>Ai</code>](#Ai)  
**Returns**: <code>function</code> - - the middleware  

| Param | Type |
| --- | --- |
| intent | [<code>IntentRule</code>](#IntentRule) \| [<code>Array.&lt;IntentRule&gt;</code>](#IntentRule) | 

**Example**  
```js
const { Router, ai } = require('wingbot');

ai.register('app-model');

bot.use(ai.match('intent1'), (req, res) => {
    console.log(req.intent(true)); // { intent: 'intent1', score: 0.9604 }

    res.text('Oh, intent 1 :)');
});
```
{% raw %}<div id="Ai_shouldDisambiguate">&nbsp;</div>{% endraw %}

### ai.shouldDisambiguate(aiActions) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>Ai</code>](#Ai)  

| Param | Type |
| --- | --- |
| aiActions | [<code>Array.&lt;IntentAction&gt;</code>](#IntentAction) | 

{% raw %}<div id="CustomEntityDetectionModel">&nbsp;</div>{% endraw %}

## CustomEntityDetectionModel
**Kind**: global class  

* [CustomEntityDetectionModel](#CustomEntityDetectionModel)
    * [new CustomEntityDetectionModel(options, [log])](#new_CustomEntityDetectionModel_new)
    * [._normalizeResult(entities, entity, text, offset, originalText)](#CustomEntityDetectionModel__normalizeResult)
    * [._detectEntities(entity, text, entities)](#CustomEntityDetectionModel__detectEntities) ⇒ <code>Promise.&lt;Array.&lt;DetectedEntity&gt;&gt;</code>
    * [._nonOverlapping(entities)](#CustomEntityDetectionModel__nonOverlapping)
    * [.resolve(text)](#CustomEntityDetectionModel_resolve) ⇒ [<code>Promise.&lt;Result&gt;</code>](#Result)
    * [._extractRegExpDependencies(regexp)](#CustomEntityDetectionModel__extractRegExpDependencies)
    * [._entityByDependency(entities, dependency)](#CustomEntityDetectionModel__entityByDependency) ⇒ [<code>DetectedEntity</code>](#DetectedEntity) \| <code>null</code>
    * [._regexpToDetector(regexp, dependencies, extractValue)](#CustomEntityDetectionModel__regexpToDetector)
    * [.setEntityDetector(name, detector, [options])](#CustomEntityDetectionModel_setEntityDetector) ⇒ <code>this</code>

{% raw %}<div id="new_CustomEntityDetectionModel_new">&nbsp;</div>{% endraw %}

### new CustomEntityDetectionModel(options, [log])

| Param | Type |
| --- | --- |
| options | <code>object</code> | 
| [log] | <code>Object</code> | 

{% raw %}<div id="CustomEntityDetectionModel__normalizeResult">&nbsp;</div>{% endraw %}

### customEntityDetectionModel.\_normalizeResult(entities, entity, text, offset, originalText)
**Kind**: instance method of [<code>CustomEntityDetectionModel</code>](#CustomEntityDetectionModel)  

| Param | Type |
| --- | --- |
| entities | [<code>Array.&lt;DetectedEntity&gt;</code>](#DetectedEntity) | 
| entity | <code>string</code> | 
| text | <code>string</code> | 
| offset | <code>number</code> | 
| originalText | <code>string</code> | 

{% raw %}<div id="CustomEntityDetectionModel__detectEntities">&nbsp;</div>{% endraw %}

### customEntityDetectionModel.\_detectEntities(entity, text, entities) ⇒ <code>Promise.&lt;Array.&lt;DetectedEntity&gt;&gt;</code>
**Kind**: instance method of [<code>CustomEntityDetectionModel</code>](#CustomEntityDetectionModel)  

| Param | Type |
| --- | --- |
| entity | <code>string</code> | 
| text | <code>string</code> | 
| entities | [<code>Array.&lt;DetectedEntity&gt;</code>](#DetectedEntity) | 

{% raw %}<div id="CustomEntityDetectionModel__nonOverlapping">&nbsp;</div>{% endraw %}

### customEntityDetectionModel.\_nonOverlapping(entities)
**Kind**: instance method of [<code>CustomEntityDetectionModel</code>](#CustomEntityDetectionModel)  

| Param | Type |
| --- | --- |
| entities | [<code>Array.&lt;DetectedEntity&gt;</code>](#DetectedEntity) | 

{% raw %}<div id="CustomEntityDetectionModel_resolve">&nbsp;</div>{% endraw %}

### customEntityDetectionModel.resolve(text) ⇒ [<code>Promise.&lt;Result&gt;</code>](#Result)
**Kind**: instance method of [<code>CustomEntityDetectionModel</code>](#CustomEntityDetectionModel)  

| Param | Type |
| --- | --- |
| text | <code>string</code> | 

{% raw %}<div id="CustomEntityDetectionModel__extractRegExpDependencies">&nbsp;</div>{% endraw %}

### customEntityDetectionModel.\_extractRegExpDependencies(regexp)
**Kind**: instance method of [<code>CustomEntityDetectionModel</code>](#CustomEntityDetectionModel)  

| Param | Type |
| --- | --- |
| regexp | <code>RegExp</code> | 

{% raw %}<div id="CustomEntityDetectionModel__entityByDependency">&nbsp;</div>{% endraw %}

### customEntityDetectionModel.\_entityByDependency(entities, dependency) ⇒ [<code>DetectedEntity</code>](#DetectedEntity) \| <code>null</code>
**Kind**: instance method of [<code>CustomEntityDetectionModel</code>](#CustomEntityDetectionModel)  

| Param | Type |
| --- | --- |
| entities | [<code>Array.&lt;DetectedEntity&gt;</code>](#DetectedEntity) | 
| dependency | <code>string</code> | 

{% raw %}<div id="CustomEntityDetectionModel__regexpToDetector">&nbsp;</div>{% endraw %}

### customEntityDetectionModel.\_regexpToDetector(regexp, dependencies, extractValue)
**Kind**: instance method of [<code>CustomEntityDetectionModel</code>](#CustomEntityDetectionModel)  

| Param | Type | Default |
| --- | --- | --- |
| regexp | <code>RegExp</code> |  | 
| dependencies | <code>Array.&lt;string&gt;</code> |  | 
| extractValue | <code>string</code> \| <code>function</code> | <code>null</code> | 

{% raw %}<div id="CustomEntityDetectionModel_setEntityDetector">&nbsp;</div>{% endraw %}

### customEntityDetectionModel.setEntityDetector(name, detector, [options]) ⇒ <code>this</code>
**Kind**: instance method of [<code>CustomEntityDetectionModel</code>](#CustomEntityDetectionModel)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> |  |
| detector | [<code>EntityDetector</code>](#EntityDetector) \| <code>RegExp</code> |  |
| [options] | <code>object</code> |  |
| [options.anonymize] | <code>boolean</code> | if true, value will not be sent to NLP |
| [options.extractValue] | <code>function</code> \| <code>string</code> | entity extractor |
| [options.dependencies] | <code>Array.&lt;string&gt;</code> | array of dependent entities |

{% raw %}<div id="WingbotModel">&nbsp;</div>{% endraw %}

## WingbotModel
**Kind**: global class  

* [WingbotModel](#WingbotModel)
    * [new WingbotModel(options, [log])](#new_WingbotModel_new)
    * [._fetch](#WingbotModel__fetch) : <code>fetch</code>
    * [._queryModel(text)](#WingbotModel__queryModel) ⇒ [<code>Promise.&lt;Result&gt;</code>](#Result)

{% raw %}<div id="new_WingbotModel_new">&nbsp;</div>{% endraw %}

### new WingbotModel(options, [log])

| Param | Type |
| --- | --- |
| options | <code>object</code> | 
| [options.serviceUrl] | <code>string</code> | 
| options.model | <code>string</code> | 
| [options.cacheSize] | <code>number</code> | 
| [options.matches] | <code>number</code> | 
| [options.fetch] | <code>function</code> | 
| [log] | <code>Object</code> | 

{% raw %}<div id="WingbotModel__fetch">&nbsp;</div>{% endraw %}

### wingbotModel.\_fetch : <code>fetch</code>
**Kind**: instance property of [<code>WingbotModel</code>](#WingbotModel)  
{% raw %}<div id="WingbotModel__queryModel">&nbsp;</div>{% endraw %}

### wingbotModel.\_queryModel(text) ⇒ [<code>Promise.&lt;Result&gt;</code>](#Result)
**Kind**: instance method of [<code>WingbotModel</code>](#WingbotModel)  

| Param | Type |
| --- | --- |
| text | <code>string</code> | 

{% raw %}<div id="CachedModel">&nbsp;</div>{% endraw %}

## CachedModel
**Kind**: global class  

* [CachedModel](#CachedModel)
    * [new CachedModel(options, [log])](#new_CachedModel_new)
    * [.resolve(text)](#CachedModel_resolve) ⇒ [<code>Promise.&lt;Result&gt;</code>](#Result)
    * [._queryModel(text)](#CachedModel__queryModel) ⇒ <code>Promise.&lt;(Array.&lt;Intent&gt;\|Result)&gt;</code>

{% raw %}<div id="new_CachedModel_new">&nbsp;</div>{% endraw %}

### new CachedModel(options, [log])

| Param | Type |
| --- | --- |
| options | <code>object</code> | 
| [options.cacheSize] | <code>number</code> | 
| [log] | <code>Object</code> | 

{% raw %}<div id="CachedModel_resolve">&nbsp;</div>{% endraw %}

### cachedModel.resolve(text) ⇒ [<code>Promise.&lt;Result&gt;</code>](#Result)
**Kind**: instance method of [<code>CachedModel</code>](#CachedModel)  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | the user input |

{% raw %}<div id="CachedModel__queryModel">&nbsp;</div>{% endraw %}

### cachedModel.\_queryModel(text) ⇒ <code>Promise.&lt;(Array.&lt;Intent&gt;\|Result)&gt;</code>
**Kind**: instance method of [<code>CachedModel</code>](#CachedModel)  

| Param | Type |
| --- | --- |
| text | <code>string</code> | 

{% raw %}<div id="AiMatching">&nbsp;</div>{% endraw %}

## AiMatching
{AiMatching}

Class responsible for NLP Routing by score

**Kind**: global class  

* [AiMatching](#AiMatching)
    * [.optionalHandicap](#AiMatching_optionalHandicap) : <code>number</code>
    * [.redundantEntityHandicap](#AiMatching_redundantEntityHandicap) : <code>number</code>
    * [.redundantIntentHandicap](#AiMatching_redundantIntentHandicap) : <code>number</code>
    * [.multiMatchGain](#AiMatching_multiMatchGain) : <code>number</code>
    * [.getSetStateForEntityRules(rule)](#AiMatching_getSetStateForEntityRules) ⇒ <code>object</code>
    * [.preprocessRule(intent)](#AiMatching_preprocessRule) ⇒ [<code>PreprocessorOutput</code>](#PreprocessorOutput)
    * [.match(req, rule, stateless)](#AiMatching_match) ⇒ [<code>Intent</code>](#Intent) \| <code>null</code>
    * [._matchRegexp(req, regexps)](#AiMatching__matchRegexp) ⇒ <code>boolean</code>

{% raw %}<div id="AiMatching_optionalHandicap">&nbsp;</div>{% endraw %}

### aiMatching.optionalHandicap : <code>number</code>
When the entity is optional, the final score should be little bit lower
(0.001 by default)

**Kind**: instance property of [<code>AiMatching</code>](#AiMatching)  
{% raw %}<div id="AiMatching_redundantEntityHandicap">&nbsp;</div>{% endraw %}

### aiMatching.redundantEntityHandicap : <code>number</code>
When there are additional entities then required add a handicap for each unmatched entity
Also works, when an optional entity was not matched
(0.03 by default)

**Kind**: instance property of [<code>AiMatching</code>](#AiMatching)  
{% raw %}<div id="AiMatching_redundantIntentHandicap">&nbsp;</div>{% endraw %}

### aiMatching.redundantIntentHandicap : <code>number</code>
When there is additional intent, the final score will be lowered by this value
(0.06 by default)

**Kind**: instance property of [<code>AiMatching</code>](#AiMatching)  
{% raw %}<div id="AiMatching_multiMatchGain">&nbsp;</div>{% endraw %}

### aiMatching.multiMatchGain : <code>number</code>
When more than one AI features (Intent, Entity, Regex) are matching,
enrich the score using the {multiMatchGain} ^ {additionalFeaturesCount}
(1.2 by default)

**Kind**: instance property of [<code>AiMatching</code>](#AiMatching)  
{% raw %}<div id="AiMatching_getSetStateForEntityRules">&nbsp;</div>{% endraw %}

### aiMatching.getSetStateForEntityRules(rule) ⇒ <code>object</code>
**Kind**: instance method of [<code>AiMatching</code>](#AiMatching)  

| Param | Type |
| --- | --- |
| rule | [<code>PreprocessorOutput</code>](#PreprocessorOutput) | 

{% raw %}<div id="AiMatching_preprocessRule">&nbsp;</div>{% endraw %}

### aiMatching.preprocessRule(intent) ⇒ [<code>PreprocessorOutput</code>](#PreprocessorOutput)
Create a rule to be cached inside a routing structure

**Kind**: instance method of [<code>AiMatching</code>](#AiMatching)  

| Param | Type |
| --- | --- |
| intent | [<code>IntentRule</code>](#IntentRule) \| [<code>Array.&lt;IntentRule&gt;</code>](#IntentRule) | 

{% raw %}<div id="AiMatching_match">&nbsp;</div>{% endraw %}

### aiMatching.match(req, rule, stateless) ⇒ [<code>Intent</code>](#Intent) \| <code>null</code>
Calculate a matching score of preprocessed rule against the request

**Kind**: instance method of [<code>AiMatching</code>](#AiMatching)  

| Param | Type | Default |
| --- | --- | --- |
| req | [<code>AIRequest</code>](#AIRequest) |  | 
| rule | [<code>PreprocessorOutput</code>](#PreprocessorOutput) |  | 
| stateless | <code>boolean</code> | <code>false</code> | 

{% raw %}<div id="AiMatching__matchRegexp">&nbsp;</div>{% endraw %}

### aiMatching.\_matchRegexp(req, regexps) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>AiMatching</code>](#AiMatching)  

| Param | Type |
| --- | --- |
| req | [<code>AIRequest</code>](#AIRequest) | 
| regexps | [<code>Array.&lt;RegexpComparator&gt;</code>](#RegexpComparator) | 

{% raw %}<div id="COMPARE">&nbsp;</div>{% endraw %}

## COMPARE : <code>enum</code>
**Kind**: global enum  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| EQUAL | [<code>Compare</code>](#Compare) | <code>eq</code> | 
| NOT_EQUAL | [<code>Compare</code>](#Compare) | <code>ne</code> | 
| RANGE | [<code>Compare</code>](#Compare) | <code>range</code> | 
| GT | [<code>Compare</code>](#Compare) | <code>gt</code> | 
| GTE | [<code>Compare</code>](#Compare) | <code>gte</code> | 
| LT | [<code>Compare</code>](#Compare) | <code>lt</code> | 
| LTE | [<code>Compare</code>](#Compare) | <code>lte</code> | 

{% raw %}<div id="EntityExpression">&nbsp;</div>{% endraw %}

## EntityExpression : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| entity | <code>string</code> | the requested entity |
| [optional] | <code>boolean</code> | entity is optional, can be missing in request |
| [op] | [<code>Compare</code>](#Compare) | comparison operation (eq|ne|range) |
| [compare] | <code>Array.&lt;string&gt;</code> \| <code>Array.&lt;number&gt;</code> | value to compare with |

{% raw %}<div id="textFilter">&nbsp;</div>{% endraw %}

## textFilter ⇒ <code>string</code>
Text filter function

**Kind**: global typedef  
**Returns**: <code>string</code> - - filtered text  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | input text |

{% raw %}<div id="IntentRule">&nbsp;</div>{% endraw %}

## IntentRule : <code>string</code> \| [<code>EntityExpression</code>](#EntityExpression)
**Kind**: global typedef  
{% raw %}<div id="BotPath">&nbsp;</div>{% endraw %}

## BotPath : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| path | <code>string</code> | 

{% raw %}<div id="IntentAction">&nbsp;</div>{% endraw %}

## IntentAction : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| action | <code>string</code> | 
| intent | [<code>Intent</code>](#Intent) | 
| sort | <code>number</code> | 
| local | <code>boolean</code> | 
| aboveConfidence | <code>boolean</code> | 
| [winner] | <code>boolean</code> | 
| [title] | <code>string</code> | 

{% raw %}<div id="DetectedEntity">&nbsp;</div>{% endraw %}

## DetectedEntity : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| [start] | <code>number</code> | 
| [entity] | <code>string</code> | 
| [end] | <code>number</code> | 
| [score] | <code>number</code> | 
| [value] | <code>string</code> \| <code>number</code> \| <code>boolean</code> | 
| [text] | <code>string</code> | 

{% raw %}<div id="EntityDetector">&nbsp;</div>{% endraw %}

## EntityDetector ⇒ [<code>Array.&lt;DetectedEntity&gt;</code>](#DetectedEntity) \| [<code>DetectedEntity</code>](#DetectedEntity) \| [<code>Promise.&lt;DetectedEntity&gt;</code>](#DetectedEntity) \| <code>Promise.&lt;Array.&lt;DetectedEntity&gt;&gt;</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | part of text |
| entities | [<code>Array.&lt;DetectedEntity&gt;</code>](#DetectedEntity) | dependent entities |

{% raw %}<div id="ValueExtractor">&nbsp;</div>{% endraw %}

## ValueExtractor ⇒ <code>\*</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| match | <code>Array.&lt;string&gt;</code> | regexp result |
| entities | [<code>Array.&lt;DetectedEntity&gt;</code>](#DetectedEntity) | dependent entities |

{% raw %}<div id="Entity">&nbsp;</div>{% endraw %}

## Entity : <code>object</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| entity | <code>string</code> | 
| value | <code>string</code> | 
| score | <code>number</code> | 

{% raw %}<div id="Intent">&nbsp;</div>{% endraw %}

## Intent : <code>object</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| intent | <code>string</code> | 
| score | <code>number</code> | 
| [entities] | [<code>Array.&lt;Entity&gt;</code>](#Entity) | 

{% raw %}<div id="Result">&nbsp;</div>{% endraw %}

## Result : <code>object</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| text | <code>string</code> | 
| entities | [<code>Array.&lt;Entity&gt;</code>](#Entity) | 
| intents | [<code>Array.&lt;Intent&gt;</code>](#Intent) | 

{% raw %}<div id="Entity">&nbsp;</div>{% endraw %}

## Entity : <code>object</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| entity | <code>string</code> | 
| value | <code>string</code> | 
| score | <code>number</code> | 

{% raw %}<div id="Intent">&nbsp;</div>{% endraw %}

## Intent : <code>object</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| intent | <code>string</code> | 
| score | <code>number</code> | 
| [entities] | [<code>Array.&lt;Entity&gt;</code>](#Entity) | 

{% raw %}<div id="Result">&nbsp;</div>{% endraw %}

## Result : <code>object</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| entities | [<code>Array.&lt;Entity&gt;</code>](#Entity) | 
| intents | [<code>Array.&lt;Intent&gt;</code>](#Intent) | 

{% raw %}<div id="Entity">&nbsp;</div>{% endraw %}

## Entity : <code>object</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| entity | <code>string</code> | 
| value | <code>string</code> | 
| score | <code>number</code> | 

{% raw %}<div id="Intent">&nbsp;</div>{% endraw %}

## Intent : <code>object</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| intent | <code>string</code> | 
| score | <code>number</code> | 
| [entities] | [<code>Array.&lt;Entity&gt;</code>](#Entity) | 

{% raw %}<div id="Result">&nbsp;</div>{% endraw %}

## Result : <code>object</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| entities | [<code>Array.&lt;Entity&gt;</code>](#Entity) | 
| intents | [<code>Array.&lt;Intent&gt;</code>](#Intent) | 

{% raw %}<div id="Compare">&nbsp;</div>{% endraw %}

## Compare : <code>string</code>
**Kind**: global typedef  
{% raw %}<div id="Entity">&nbsp;</div>{% endraw %}

## Entity : <code>object</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| entity | <code>string</code> | 
| value | <code>string</code> | 
| score | <code>number</code> | 

{% raw %}<div id="Intent">&nbsp;</div>{% endraw %}

## Intent : <code>object</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| [intent] | <code>string</code> | 
| score | <code>number</code> | 
| [entities] | [<code>Array.&lt;Entity&gt;</code>](#Entity) | 

{% raw %}<div id="EntityExpression">&nbsp;</div>{% endraw %}

## EntityExpression : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| entity | <code>string</code> | the requested entity |
| [optional] | <code>boolean</code> | the match is optional |
| [op] | [<code>Compare</code>](#Compare) | comparison operation |
| [compare] | <code>Array.&lt;string&gt;</code> \| <code>Array.&lt;number&gt;</code> | value to compare with |

{% raw %}<div id="IntentRule">&nbsp;</div>{% endraw %}

## IntentRule : <code>string</code> \| [<code>EntityExpression</code>](#EntityExpression)
**Kind**: global typedef  
{% raw %}<div id="RegexpComparator">&nbsp;</div>{% endraw %}

## RegexpComparator : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| r | <code>RegExp</code> | regular expression |
| t | <code>boolean</code> | use normalized text |

{% raw %}<div id="PreprocessorOutput">&nbsp;</div>{% endraw %}

## PreprocessorOutput : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| regexps | [<code>Array.&lt;RegexpComparator&gt;</code>](#RegexpComparator) | 
| intents | <code>Array.&lt;string&gt;</code> | 
| entities | [<code>Array.&lt;EntityExpression&gt;</code>](#EntityExpression) | 

{% raw %}<div id="AIRequest">&nbsp;</div>{% endraw %}

## AIRequest : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| text | <code>function</code> | 
| intents | [<code>Array.&lt;Intent&gt;</code>](#Intent) \| <code>null</code> | 
| entities | [<code>Array.&lt;Entity&gt;</code>](#Entity) | 
| [state] | <code>object</code> | 

