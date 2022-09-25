const {User} = require("../../../models/user");
const {Genre} = require("../../../models/genre");
const request = require("supertest");
let server;

describe("auth middleware", () => {

    beforeEach(() => { server = require("../../../index"); })
    afterEach(async() => { 
        await server.close(); 
        await Genre.deleteMany({});
    });

    let token;

    const exec = async() => {
        return request(server)
            .post("/api/genres")
            .set("x-auth-token", token)
            .send({name: "genre1"});
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    })

    it("Should return 401 error if there is no token", async() => {
        token = "";
        
        const res = await exec();
        
        expect(res.status).toBe(401);
    });

    it("Should return 400 error if there is invalid token", async() => {
        token = "a";
        
        const res = await exec();
        
        expect(res.status).toBe(400);
    });

    it("Should save the genre if there is valid token", async() => {        
        const res = await exec();
        
        expect(res.status).toBe(200);
    });
});
