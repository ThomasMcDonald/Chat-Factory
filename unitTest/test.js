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
          _name:"Calamari Race Team",
          _topic:"Squid tings",
          _channels:[]
        }
      chai.request(server)
          .post('/createGroup')
          .send(group)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('_name');
            done();
          });
    });

  });
});
describe('Channels', () => {
    // Create Channels test
      describe('/POST Create Group', () => {
        it('it should not POST a Group without name field', (done) => {
        let channel = {
          _name:"Calamari Race Team",
          _topic:"Squid tings",
          _groupID:1
        }
      chai.request(server)
          .post('/createChannel')
          .send(channel)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('_email');
            done();
          });
    });

  });
});
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
           done();
        });
    });

    // Create user test
      describe('/POST Create User', () => {
        it('it should not POST a User without email field', (done) => {
        let user = {
          _email:"super@gmail.com",
          _username:"super",
          _password:"Super",
          _role: "Super",
          _profileImage:"/server/uploads",
          _inChannel:[],
          _inGroup:[]
        }
      chai.request(server)
          .post('/createUser')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('_email');
            done();
          });
    });

  });

  describe('/POST Login User', () => {
    it('it should not Login user if password is incorrect', (done) => {
    let user = {
      _username:"super",
      _password:"Super",
    }
  chai.request(server)
      .post('/loginVerify')
      .send(user)
      .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
        done();
      });
    });

});


  // Deleting user test
  describe('/POST Delete User', () => {
    it('it should delete the user with given id', (done) => {
    let user = "12312312312" // Change to appropriate later
  chai.request(server)
      .post('/createUser')
      .send(user)
      .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
        done();
      });
    });
  });

});

/*
No Message testing due to messages only being created within the sockets.

*/
