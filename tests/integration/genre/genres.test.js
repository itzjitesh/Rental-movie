const request = require("supertest");
const mongoose = require("mongoose");
const {Genre} = require("../../../models/genre");
const {User} = require("../../../models/user");
let server;

describe("/api/genres", () => {
    beforeEach(() => { server = require("../../../index"); })
    afterEach(async() => {
    await server.close();
    await Genre.deleteMany({});
});

    describe("GET /", () => {
        it("Should return all the genres", async() => {
            await Genre.insertMany([
                {name: "genre1"},
                {name: "genre2"}
            ]);

           const res = await request(server).get("/api/genres");

           expect(res.status).toBe(200);
           expect(res.body.length).toBe(2);
           expect(res.body.some(g => g.name === "genre1")).toBeTruthy();
           expect(res.body.some(g => g.name === "genre2")).toBeTruthy();
        });
    });

    describe("GET /:id", () => {
        it("Should return a particular genre", async() => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();
            
            const res = await request(server).get("/api/genres/" + genre._id);

            // expect(res.status).toBe(200);
            // expect(res.body.some(g => g.name === "genre1")).toBeTruthy();
            // expect(res.body).toMatchObject(genre);
            // expect(res.body).toHaveProperty("name", genre.name);
        });

        it("should give error if invalid genre Id is passed", async() => {
            const res = await request(server).get("/api/genres/1");
            expect(res.status).toBe(404);
        });

        it("should give error 404 if no genre with given Id exists", async() => {
            const _id = mongoose.Types.ObjectId();
            const res = await request(server).get("/api/genres/" + _id);
            expect(res.status).toBe(404);
        });
    });

    describe("POST /", () =>{

        //Refactor
        let token;    
        let name;    
        const exec = async() => {
            return await request(server)
            .post("/api/genres")
            .set("x-auth-token", token)
            .send({ name });
            // .send({ name: "genre1"});  //In ES6 if key and value are same then we can also write it like single entry.
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = "genre1";
        })

        it("Should give 401 error if client is not logged in", async() => {
            token="";

            const res = await exec();
            
            expect(res.status).toBe(401);
        });

        it("Should give 400 error if name is less than 5 characters", async() => {
            name = "1234";

            const res = await exec();
            
            expect(res.status).toBe(400);
        });
        it("Should give 400 error if name is more than 50 characters", async() => {
            name = new Array(52).join("a");
            
            const res = await exec();
            
            expect(res.status).toBe(400);
        });
        it("Should save the genre if it is a valid entry", async() => {
            await exec();
            
            const genre = await Genre.find({ name: "genre1"});

            expect(genre).not.toBeNull();
        });
        it("Should save the genre if it is a valid entry", async() => {
            const res = await exec();
            
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", "genre1");
        });
    });
});


