const {Rental} = require("../../models/rental");
const {Movie} = require("../../models/movie");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");
const request = require("supertest");
// const jest = require("jest");
const returns = require("../../routes/returns");

describe("/api/returns", () => {
    let server;
    let customerId;
    let movieId; 
    let rental;
    let movie;
    let token;

    const exec = async() => {
        return request(server)
        .post("/api/returns")
        .set("x-auth-token", token)
        .send({customerId, movieId});
    }

    beforeEach( async() => {
        jest.setTimeout(20000);
        server = require("../../index");

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: "12345",
            dailyRentalRate: 2,
            genre: {name: "12345"},
            numberInStock: 10
        });    
    
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: "12345",
                phone: "12345"
            },
            movie:{
                _id: movieId,
                title: "12345",
                dailyRentalRate: 2
            }
        });   
        await rental.save();
    });

    afterEach(async() => {
        await server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({});
    });

    it("should return 401 if client is not logged in", async() => {
        jest.setTimeout(20000);
        token ="";

       const res = await exec();

        expect(res.status).toBe(401);
    });

    it("Should return 400 if customerId is not provided", async() => {
        customerId = "";

        const res = await exec();
        
        expect(res.status).toBe(400);
    });

    it("Should return 400 if movieId is not provided", async() => {
        movieId = "";

        const res = await exec();
        
        expect(res.status).toBe(400);
    });

    it("Should return 404 if no rental is found for this movie/customer", async() => {
        await Rental.deleteMany({});

        const res = await exec();
        
        expect(res.status).toBe(404);
    });

    it("Should return 400 if return is already processed", async() => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();
        
        expect(res.status).toBe(400);
    });

    it("Should return 200 if rental is valid and save it", async() => {
        const res = await exec();
        
        expect(res.status).toBe(200);
    });

    it("Should set the returnDate if input is valid", async() => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;

        expect(diff).toBeLessThan(10 * 1000);
        
        expect(res.status).toBe(200);
    });

    it("Should calculate the rentalFee if input is valid", async() => {
        rental.dateOut = moment().add(-7, "days").toDate();
        await rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);

        expect(rentalInDb.rentalFee).toBe(14);        
    });

    it("Should increase the numberInStock in movie if input is valid", async() => {
        const res = await exec();

        const movieInDb = await Movie.findById(movieId);

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);        
    });

    it("Should return the rental if all input are valid", async() => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);

        // expect(res.body).toHaveProperty("dateOut");        
        // expect(res.body).toHaveProperty("dateReturned");        
        // expect(res.body).toHaveProperty("customer");        
        // expect(res.body).toHaveProperty("movie"); 
        //The below syntax is equal to writing this above code in a better and short ways-   
        
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(["dateOut", "dateReturned", "rentalFee", "customer", "movie"])
        );               
    });
});
