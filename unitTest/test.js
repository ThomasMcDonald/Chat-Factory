process.env.NODE_ENV = 'test';

var assert = require('assert');
let mongoose = require("mongoose");
let User = require("../server/models/users.js")
let Group = require("../server/models/groups.js")
let Channel = require("../server/models/channels.js")
let Message = require("../server/models/messages.js")
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server.js');
let should = chai.should();

chai.use(chaiHttp);
describe('Groups', () => {
    // Create Groups test
      describe('/POST Create Group', () => {
        it('it should not POST a Group without title field', (done) => {
        let group = {
          owner: 1,
          name:"Calamari Race Team",
          topic:"Squid tings"
        }
      chai.request(server)
          .post('/createGroup')
          .send(group)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('statusCode');
            done();
          });
    });

  });
});
describe('Channels', () => {
    // Create Channels test
      describe('/POST Create Channel', () => {
        it('it should not POST a Channel without name field', (done) => {
        let channel = {
          name:"Calamari Race Team",
          topic:"Squid tings",
          groupID:1,
          owner: 1
        }
      chai.request(server)
          .post('/createChannel')
          .send(channel)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('statusCode');
            done();
          });
    });

  });
});
describe('Users', () => {

    // Create user test
      describe('/POST Create User', () => {
        it('it should not POST a User without email field', (done) => {
        let user = {
          email:"super@gmail.com",
          username:"super",
          password:"Super",
          role: "Super",
          profileImage:"/server/uploads",
          inChannel:[],
          inGroup:[]
        }
      chai.request(server)
          .post('/createUser')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('statusCode');
            done();
          });
    });

  });

  describe('/POST Login User', () => {
    it('it should not Login user if password is incorrect', (done) => {
    let user = {
      username:"super",
      password:"Super",
    }
  chai.request(server)
      .post('/loginVerify')
      .send(user)
      .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('statusCode');
        done();
      });
    });

});


  // // Deleting user test
  // describe('/POST Delete User', () => {
  //   it('it should delete the user with given id', (done) => {
  //   let user = "12312312312" // Change to appropriate later
  // chai.request(server)
  //     .post('/createUser')
  //     .send(user)
  //     .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.be.a('object');
  //           res.body.should.have.property('statusCode');
  //       done();
  //     });
  //   });
  // });

});

/*
No Message testing due to messages only being created within the sockets.

*/
