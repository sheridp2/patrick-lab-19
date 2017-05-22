'use strict';

const expect= require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../models/user');
const Gallery = require('../models/gallery');

mongoose.Promsie = Promise;

require('../server');

const url = `http://localhost:${process.env.PORT}`;

const testUser = {
  username: 'testUser',
  password: 'testPassword',
  email: 'test@test.com',
};

const testGallery ={
  name: 'testGal',
  desc: 'test desc',
};

const updateGallery ={
  name: 'update',
  desc: 'its better now',
};


describe('Gallery Routes', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
    ])
    .then(() => done())
    .catch(() => done());
  });

  describe('Post route for gallery', function (){
    before( done => {
      new User(testUser)
      .generatePasswordHash(testUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        console.log('temp user', this.tempUser);
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(() => done());
    });
    it('should add gallery to DB and return gallery', done =>{
      request.post(`${url}/api/gallery`)
      .send(testGallery)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res)=>{
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(testGallery.name);
        expect(res.body.desc).to.equal(testGallery.desc);
        expect(res.body.userId).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        expect(res.status).to.equal(200);
        done();
      });
    });
    it('should return status 401 with invalid inputs and auth', done =>{
      request.post(`${url}/api/gallery`)
      .end((err, res)=>{
        expect(res.status).to.equal(401);
        done();
      });
    });
  });

  describe('GET route by id', function(){
    before( done => {
      new User(testUser)
      .generatePasswordHash(testUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(() => done());
    });

    before( done => {
      testGallery.userId = this.tempUser._id.toString();
      new Gallery(testGallery).save()
      .then( gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(() => done());
    });

    after( () => {
      delete testGallery.userId;
    });
    it('should return a gallery by id', done =>{
      request.get(`${url}/api/gallery/${this.tempGallery._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(testGallery.name);
        expect(res.body.desc).to.equal(testGallery.desc);
        expect(res.body.userId).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
    it('should return status 401 for incorrect auth', done =>{
      request.get(`${url}/api/gallery/${this.tempGallery._id}`)
      .end((err, res) =>{
        expect(res.status).to.equal(401);
        done();
      });
    });
  });

  describe('DELETE gallery by id', function(){
    before( done => {
      new User(testUser)
      .generatePasswordHash(testUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(() => done());
    });

    before( done => {
      testGallery.userId = this.tempUser._id.toString();
      new Gallery(testGallery).save()
      .then( gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(() => done());
    });

    after( () => {
      delete testGallery.userId;
    });
    it('should delete a gallery by id and return 204 status', done =>{
      request.delete(`${url}/api/gallery/${this.tempGallery._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });
    it('should return status 401 for incorrect auth', done =>{
      request.get(`${url}/api/gallery/${this.tempGallery._id}`)
      .end((err, res) =>{
        expect(res.status).to.equal(401);
        done();
      });
    });
  });

  describe('PUT gallery by id', function(){
    before( done => {
      new User(testUser)
      .generatePasswordHash(testUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(() => done());
    });

    before( done => {
      testGallery.userId = this.tempUser._id.toString();
      new Gallery(testGallery).save()
      .then( gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(() => done());
    });

    after( () => {
      delete testGallery.userId;
    });
    it('should delete a gallery by id and return 200 status', done =>{
      request.put(`${url}/api/gallery/${this.tempGallery._id}`)
      .send(updateGallery)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        expect(res.body.name).to.equal(updateGallery.name);
        expect(res.body.desc).to.equal(updateGallery.desc);
        expect(res.status).to.equal(200);
        done();
      });
    });
    it('should return status 401 for incorrect auth', done =>{
      request.put(`${url}/api/gallery/${this.tempGallery._id}`)
      .send(updateGallery)
      .end((err, res) =>{
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
});
