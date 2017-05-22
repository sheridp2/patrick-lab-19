'use strict';

const superagent = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const chai = require('chai');
const User = require('../models/user');
const Gallery = require('../models/gallery');
const Pic = require('../models/pic');
const expect = chai.expect;
require('../server.js');
const url = `http://localhost:${process.env.PORT}`;
mongoose.Promise = Promise;

const testUser = {
  username: 'carlomari',
  email: 'carlomari@squidbilly.com',
  password: 'password',
};

const testGallery = {
  name: 'this is only a test',
  desc: 'test all the things',
};

describe('Pic routes', function() {
  let tempUser;
  let tempToken;
  let tempGallery;

  beforeEach(done => {
    new User(testUser)
    .generatePasswordHash(testUser.password)
    .then(user => user.save())
    .then(user => {
      tempUser = user;
      return user.generateToken();
    })
    .then(token => {
      tempToken = token;
    })
    .then(() => new Gallery(testGallery))
    .then(gallery => {
      gallery.userId = tempUser._id;
      tempGallery = gallery;
      done();
    })
    .catch(err => done(err));
  });

  afterEach(done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
      Pic.remove({}),
    ])
    .then(() => done())
    .catch(err => done(err));
  });

  describe('POST method', function() {
    it('should post a picture and have status of 200', done => {
      superagent.post(`${url}/api/gallery/${tempGallery._id}/pic`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${tempToken}`)
      .field('name', 'pigame')
      .field('desc', 'superbatspider')
      .attach('image', `${__dirname}/assets/pigame.jpg`)
      .end((err, res) => {
        expect(res.body.name).to.equal('pigame');
        expect(res.status).to.equal(200);
        done();
      });
    });
    it('should post as status of 401 on bad request', done => {
      superagent.post(`${url}/api/gallery/${tempGallery._id}/pic`)
      .set('Content-Type', 'application/json')
      .field('name', 'pigame')
      .field('desc', 'superbatspider')
      .attach('image', `${__dirname}/assets/pigame.jpg`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
});
