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
exports.Organization = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const review_model_1 = require("./review.model");
const user_model_1 = require("./user.model");
let Organization = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'organizations',
            paranoid: true,
            timestamps: true
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _website_decorators;
    let _website_initializers = [];
    let _website_extraInitializers = [];
    let _logo_decorators;
    let _logo_initializers = [];
    let _logo_extraInitializers = [];
    let _industry_decorators;
    let _industry_initializers = [];
    let _industry_extraInitializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _size_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _isVerified_decorators;
    let _isVerified_initializers = [];
    let _isVerified_extraInitializers = [];
    let _verifiedBy_decorators;
    let _verifiedBy_initializers = [];
    let _verifiedBy_extraInitializers = [];
    let _verifiedAt_decorators;
    let _verifiedAt_initializers = [];
    let _verifiedAt_extraInitializers = [];
    let _reviews_decorators;
    let _reviews_initializers = [];
    let _reviews_extraInitializers = [];
    let _verifier_decorators;
    let _verifier_initializers = [];
    let _verifier_extraInitializers = [];
    var Organization = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.website = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _website_initializers, void 0));
            this.logo = (__runInitializers(this, _website_extraInitializers), __runInitializers(this, _logo_initializers, void 0));
            this.industry = (__runInitializers(this, _logo_extraInitializers), __runInitializers(this, _industry_initializers, void 0));
            this.size = (__runInitializers(this, _industry_extraInitializers), __runInitializers(this, _size_initializers, void 0));
            this.location = (__runInitializers(this, _size_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.isVerified = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _isVerified_initializers, void 0));
            this.verifiedBy = (__runInitializers(this, _isVerified_extraInitializers), __runInitializers(this, _verifiedBy_initializers, void 0));
            this.verifiedAt = (__runInitializers(this, _verifiedBy_extraInitializers), __runInitializers(this, _verifiedAt_initializers, void 0));
            this.reviews = (__runInitializers(this, _verifiedAt_extraInitializers), __runInitializers(this, _reviews_initializers, void 0));
            this.verifier = (__runInitializers(this, _reviews_extraInitializers), __runInitializers(this, _verifier_initializers, void 0));
            __runInitializers(this, _verifier_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Organization");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
                unique: true
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT
            })];
        _website_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                validate: {
                    isUrl: true
                }
            })];
        _logo_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING
            })];
        _industry_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING
            })];
        _size_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')
            })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING
            })];
        _isVerified_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false
            })];
        _verifiedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                references: {
                    model: user_model_1.User,
                    key: 'id'
                }
            })];
        _verifiedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE
            })];
        _reviews_decorators = [(0, sequelize_typescript_1.HasMany)(() => review_model_1.Review)];
        _verifier_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, 'verifiedBy')];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _website_decorators, { kind: "field", name: "website", static: false, private: false, access: { has: obj => "website" in obj, get: obj => obj.website, set: (obj, value) => { obj.website = value; } }, metadata: _metadata }, _website_initializers, _website_extraInitializers);
        __esDecorate(null, null, _logo_decorators, { kind: "field", name: "logo", static: false, private: false, access: { has: obj => "logo" in obj, get: obj => obj.logo, set: (obj, value) => { obj.logo = value; } }, metadata: _metadata }, _logo_initializers, _logo_extraInitializers);
        __esDecorate(null, null, _industry_decorators, { kind: "field", name: "industry", static: false, private: false, access: { has: obj => "industry" in obj, get: obj => obj.industry, set: (obj, value) => { obj.industry = value; } }, metadata: _metadata }, _industry_initializers, _industry_extraInitializers);
        __esDecorate(null, null, _size_decorators, { kind: "field", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } }, metadata: _metadata }, _size_initializers, _size_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _isVerified_decorators, { kind: "field", name: "isVerified", static: false, private: false, access: { has: obj => "isVerified" in obj, get: obj => obj.isVerified, set: (obj, value) => { obj.isVerified = value; } }, metadata: _metadata }, _isVerified_initializers, _isVerified_extraInitializers);
        __esDecorate(null, null, _verifiedBy_decorators, { kind: "field", name: "verifiedBy", static: false, private: false, access: { has: obj => "verifiedBy" in obj, get: obj => obj.verifiedBy, set: (obj, value) => { obj.verifiedBy = value; } }, metadata: _metadata }, _verifiedBy_initializers, _verifiedBy_extraInitializers);
        __esDecorate(null, null, _verifiedAt_decorators, { kind: "field", name: "verifiedAt", static: false, private: false, access: { has: obj => "verifiedAt" in obj, get: obj => obj.verifiedAt, set: (obj, value) => { obj.verifiedAt = value; } }, metadata: _metadata }, _verifiedAt_initializers, _verifiedAt_extraInitializers);
        __esDecorate(null, null, _reviews_decorators, { kind: "field", name: "reviews", static: false, private: false, access: { has: obj => "reviews" in obj, get: obj => obj.reviews, set: (obj, value) => { obj.reviews = value; } }, metadata: _metadata }, _reviews_initializers, _reviews_extraInitializers);
        __esDecorate(null, null, _verifier_decorators, { kind: "field", name: "verifier", static: false, private: false, access: { has: obj => "verifier" in obj, get: obj => obj.verifier, set: (obj, value) => { obj.verifier = value; } }, metadata: _metadata }, _verifier_initializers, _verifier_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Organization = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Organization = _classThis;
})();
exports.Organization = Organization;
