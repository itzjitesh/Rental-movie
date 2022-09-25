const {User} = require("../../../models/user");
const {Genre} = require("../../../models/genre");
const mongoose = require("mongoose");
const request = require("supertest");
const auth = require("../../../middleware/auth");
let server;

describe("auth middlware", () => {
    it("Should populate with JWT if there is a valid token", () => {
        const user ={
            _id: mongoose.Types.ObjectId().toHexString() ,
            isAdmin: true
        };

        const token = new User(user).generateAuthToken();

        const req = {
            header: jest.fn().mockReturnValue(token)
        };

        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});

