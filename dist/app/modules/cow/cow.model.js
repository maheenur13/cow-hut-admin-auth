"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowModel = void 0;
const mongoose_1 = require("mongoose");
const cow_constants_1 = require("./cow.constants");
const cowSchema = new mongoose_1.Schema({
    name: {
        required: true,
        type: String,
    },
    age: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        enum: cow_constants_1.cowLocationsEnums,
        required: true,
    },
    breed: {
        type: String,
        required: true,
        enum: cow_constants_1.cowBreedEnums,
    },
    weight: {
        type: Number,
        required: true,
    },
    seller: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    label: {
        type: String,
        enum: ['for sale', 'sold out'],
    },
    category: {
        type: String,
        required: true,
        enum: ['Dairy', 'Beef', 'Dual Purpose'],
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
cowSchema.statics.isCowExistBySellerId = function (id, sellerId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.CowModel.findOne({ _id: id, seller: sellerId }, { name: 1, seller: 1 });
    });
};
exports.CowModel = (0, mongoose_1.model)('Cow', cowSchema);
