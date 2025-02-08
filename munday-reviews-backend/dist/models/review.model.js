"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const organization_model_1 = require("./organization.model");
let Review = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'reviews',
            paranoid: true,
            timestamps: true
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _pros_decorators;
    let _pros_initializers = [];
    let _pros_extraInitializers = [];
    let _cons_decorators;
    let _cons_initializers = [];
    let _cons_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _helpfulCount_decorators;
    let _helpfulCount_initializers = [];
    let _helpfulCount_extraInitializers = [];
    let _reportCount_decorators;
    let _reportCount_initializers = [];
    let _reportCount_extraInitializers = [];
    let _isAnonymous_decorators;
    let _isAnonymous_initializers = [];
    let _isAnonymous_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _moderatorId_decorators;
    let _moderatorId_initializers = [];
    let _moderatorId_extraInitializers = [];
    let _moderatedAt_decorators;
    let _moderatedAt_initializers = [];
    let _moderatedAt_extraInitializers = [];
    let _moderationNotes_decorators;
    let _moderationNotes_initializers = [];
    let _moderationNotes_extraInitializers = [];
    let _user_decorators;
    let _user_initializers = [];
    let _user_extraInitializers = [];
    let _organization_decorators;
    let _organization_initializers = [];
    let _organization_extraInitializers = [];
    let _moderator_decorators;
    let _moderator_initializers = [];
    let _moderator_extraInitializers = [];
    var Review = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.title = __runInitializers(this, _title_initializers, void 0);
            this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.rating = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
            this.pros = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _pros_initializers, void 0));
            this.cons = (__runInitializers(this, _pros_extraInitializers), __runInitializers(this, _cons_initializers, void 0));
            this.status = (__runInitializers(this, _cons_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.helpfulCount = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _helpfulCount_initializers, void 0));
            this.reportCount = (__runInitializers(this, _helpfulCount_extraInitializers), __runInitializers(this, _reportCount_initializers, void 0));
            this.isAnonymous = (__runInitializers(this, _reportCount_extraInitializers), __runInitializers(this, _isAnonymous_initializers, void 0));
            this.userId = (__runInitializers(this, _isAnonymous_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.organizationId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
            this.moderatorId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _moderatorId_initializers, void 0));
            this.moderatedAt = (__runInitializers(this, _moderatorId_extraInitializers), __runInitializers(this, _moderatedAt_initializers, void 0));
            this.moderationNotes = (__runInitializers(this, _moderatedAt_extraInitializers), __runInitializers(this, _moderationNotes_initializers, void 0));
            this.user = (__runInitializers(this, _moderationNotes_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.organization = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _organization_initializers, void 0));
            this.moderator = (__runInitializers(this, _organization_extraInitializers), __runInitializers(this, _moderator_initializers, void 0));
            __runInitializers(this, _moderator_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Review");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING
            })];
        _content_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false
            })];
        _rating_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5
                }
            })];
        _pros_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING)
            })];
        _cons_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING)
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('pending', 'approved', 'rejected'),
                defaultValue: 'pending'
            })];
        _helpfulCount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 0
            })];
        _reportCount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 0
            })];
        _isAnonymous_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false
            })];
        _userId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false
            })];
        _organizationId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => organization_model_1.Organization), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false
            })];
        _moderatorId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER
            })];
        _moderatedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE
            })];
        _moderationNotes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT
            })];
        _user_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, 'userId')];
        _organization_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => organization_model_1.Organization, 'organizationId')];
        _moderator_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, 'moderatorId')];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
        __esDecorate(null, null, _pros_decorators, { kind: "field", name: "pros", static: false, private: false, access: { has: obj => "pros" in obj, get: obj => obj.pros, set: (obj, value) => { obj.pros = value; } }, metadata: _metadata }, _pros_initializers, _pros_extraInitializers);
        __esDecorate(null, null, _cons_decorators, { kind: "field", name: "cons", static: false, private: false, access: { has: obj => "cons" in obj, get: obj => obj.cons, set: (obj, value) => { obj.cons = value; } }, metadata: _metadata }, _cons_initializers, _cons_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _helpfulCount_decorators, { kind: "field", name: "helpfulCount", static: false, private: false, access: { has: obj => "helpfulCount" in obj, get: obj => obj.helpfulCount, set: (obj, value) => { obj.helpfulCount = value; } }, metadata: _metadata }, _helpfulCount_initializers, _helpfulCount_extraInitializers);
        __esDecorate(null, null, _reportCount_decorators, { kind: "field", name: "reportCount", static: false, private: false, access: { has: obj => "reportCount" in obj, get: obj => obj.reportCount, set: (obj, value) => { obj.reportCount = value; } }, metadata: _metadata }, _reportCount_initializers, _reportCount_extraInitializers);
        __esDecorate(null, null, _isAnonymous_decorators, { kind: "field", name: "isAnonymous", static: false, private: false, access: { has: obj => "isAnonymous" in obj, get: obj => obj.isAnonymous, set: (obj, value) => { obj.isAnonymous = value; } }, metadata: _metadata }, _isAnonymous_initializers, _isAnonymous_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
        __esDecorate(null, null, _moderatorId_decorators, { kind: "field", name: "moderatorId", static: false, private: false, access: { has: obj => "moderatorId" in obj, get: obj => obj.moderatorId, set: (obj, value) => { obj.moderatorId = value; } }, metadata: _metadata }, _moderatorId_initializers, _moderatorId_extraInitializers);
        __esDecorate(null, null, _moderatedAt_decorators, { kind: "field", name: "moderatedAt", static: false, private: false, access: { has: obj => "moderatedAt" in obj, get: obj => obj.moderatedAt, set: (obj, value) => { obj.moderatedAt = value; } }, metadata: _metadata }, _moderatedAt_initializers, _moderatedAt_extraInitializers);
        __esDecorate(null, null, _moderationNotes_decorators, { kind: "field", name: "moderationNotes", static: false, private: false, access: { has: obj => "moderationNotes" in obj, get: obj => obj.moderationNotes, set: (obj, value) => { obj.moderationNotes = value; } }, metadata: _metadata }, _moderationNotes_initializers, _moderationNotes_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: obj => "user" in obj, get: obj => obj.user, set: (obj, value) => { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _organization_decorators, { kind: "field", name: "organization", static: false, private: false, access: { has: obj => "organization" in obj, get: obj => obj.organization, set: (obj, value) => { obj.organization = value; } }, metadata: _metadata }, _organization_initializers, _organization_extraInitializers);
        __esDecorate(null, null, _moderator_decorators, { kind: "field", name: "moderator", static: false, private: false, access: { has: obj => "moderator" in obj, get: obj => obj.moderator, set: (obj, value) => { obj.moderator = value; } }, metadata: _metadata }, _moderator_initializers, _moderator_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Review = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Review = _classThis;
})();
exports.Review = Review;
