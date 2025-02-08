"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
let User = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'users',
            paranoid: true,
            timestamps: true
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_hashPassword_decorators;
    let _static_setFullName_decorators;
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _password_decorators;
    let _password_initializers = [];
    let _password_extraInitializers = [];
    let _firstName_decorators;
    let _firstName_initializers = [];
    let _firstName_extraInitializers = [];
    let _lastName_decorators;
    let _lastName_initializers = [];
    let _lastName_extraInitializers = [];
    let _fullName_decorators;
    let _fullName_initializers = [];
    let _fullName_extraInitializers = [];
    let _avatar_decorators;
    let _avatar_initializers = [];
    let _avatar_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _lastLogin_decorators;
    let _lastLogin_initializers = [];
    let _lastLogin_extraInitializers = [];
    var User = _classThis = class extends _classSuper {
        static async hashPassword(instance) {
            if (instance.changed('password')) {
                const salt = await bcryptjs_1.default.genSalt(10);
                instance.password = await bcryptjs_1.default.hash(instance.password, salt);
            }
        }
        static setFullName(instance) {
            instance.fullName = `${instance.firstName} ${instance.lastName}`;
        }
        async comparePassword(candidatePassword) {
            return bcryptjs_1.default.compare(candidatePassword, this.password);
        }
        constructor() {
            super(...arguments);
            this.email = __runInitializers(this, _email_initializers, void 0);
            this.password = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _password_initializers, void 0));
            this.firstName = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
            this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
            this.fullName = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _fullName_initializers, void 0));
            this.avatar = (__runInitializers(this, _fullName_extraInitializers), __runInitializers(this, _avatar_initializers, void 0));
            this.role = (__runInitializers(this, _avatar_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.isActive = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.lastLogin = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _lastLogin_initializers, void 0));
            __runInitializers(this, _lastLogin_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "User");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _email_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            })];
        _password_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false
            })];
        _firstName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false
            })];
        _lastName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false
            })];
        _fullName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING
            })];
        _avatar_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING
            })];
        _role_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('user', 'admin'),
                defaultValue: 'user'
            })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true
            })];
        _lastLogin_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE
            })];
        _static_hashPassword_decorators = [sequelize_typescript_1.BeforeCreate, sequelize_typescript_1.BeforeUpdate];
        _static_setFullName_decorators = [sequelize_typescript_1.BeforeCreate, sequelize_typescript_1.BeforeUpdate];
        __esDecorate(_classThis, null, _static_hashPassword_decorators, { kind: "method", name: "hashPassword", static: true, private: false, access: { has: obj => "hashPassword" in obj, get: obj => obj.hashPassword }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(_classThis, null, _static_setFullName_decorators, { kind: "method", name: "setFullName", static: true, private: false, access: { has: obj => "setFullName" in obj, get: obj => obj.setFullName }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: obj => "password" in obj, get: obj => obj.password, set: (obj, value) => { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
        __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
        __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
        __esDecorate(null, null, _fullName_decorators, { kind: "field", name: "fullName", static: false, private: false, access: { has: obj => "fullName" in obj, get: obj => obj.fullName, set: (obj, value) => { obj.fullName = value; } }, metadata: _metadata }, _fullName_initializers, _fullName_extraInitializers);
        __esDecorate(null, null, _avatar_decorators, { kind: "field", name: "avatar", static: false, private: false, access: { has: obj => "avatar" in obj, get: obj => obj.avatar, set: (obj, value) => { obj.avatar = value; } }, metadata: _metadata }, _avatar_initializers, _avatar_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _lastLogin_decorators, { kind: "field", name: "lastLogin", static: false, private: false, access: { has: obj => "lastLogin" in obj, get: obj => obj.lastLogin, set: (obj, value) => { obj.lastLogin = value; } }, metadata: _metadata }, _lastLogin_initializers, _lastLogin_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
})();
exports.User = User;
