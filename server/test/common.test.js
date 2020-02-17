process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const sinon = require('sinon');
const network = require('../fabric/network');
const app = require('../app');

require('dotenv').config();

describe('#GET /common/courses', () => {
  let connect;
  let query;

  beforeEach(() => {
    connect = sinon.stub(network, 'connectToNetwork');
    query = sinon.stub(network, 'query');
  });

  afterEach(() => {
    connect.restore();
    query.restore();
  });

  it('success query all courses', (done) => {
    let data = JSON.stringify(
      {
        CourseID: '00',
        CourseName: 'Blockchain101',
        CourseCode: 'BC101',
        Description: 'Blockchain'
      },
      {
        CourseID: '01',
        CourseName: 'Blockchain102',
        CourseCode: 'BC102',
        Description: 'Blockchain'
      }
    );

    query.returns({
      success: true,
      msg: data
    });

    request(app)
      .get('/common/courses')
      .set('authorization', `${process.env.JWT_ADMIN_ACADEMY_EXAMPLE}`)
      .then((res) => {
        expect(res.status).equal(200);
        expect(res.body.success).equal(true);
        done();
      });
  });

  it('do not success query all courses because error query chaincode', (done) => {
    query.returns({
      success: false,
      msg: 'Error query chaincode'
    });

    request(app)
      .get('/common/courses')
      .set('authorization', `${process.env.JWT_ADMIN_ACADEMY_EXAMPLE}`)
      .then((res) => {
        expect(res.status).equal(500);
        expect(res.body.success).equal(false);
        done();
      });
  });
});

describe('#GET /common/course/:courseId', () => {
  let connect;
  let query;
  let courseId = '4ca7fc39-7523-424d-984e-87ea590cac68';

  beforeEach(() => {
    connect = sinon.stub(network, 'connectToNetwork');
    query = sinon.stub(network, 'query');
  });

  afterEach(() => {
    connect.restore();
    query.restore();
  });

  it('success query course', (done) => {
    let data = JSON.stringify({
      CourseID: '4ca7fc39-7523-424d-984e-87ea590cac68',
      CourseName: 'Blockchain101',
      CourseCode: 'BC101',
      Description: 'Blockchain'
    });

    query.returns({
      success: true,
      msg: data
    });

    request(app)
      .get(`/common/course/${courseId}`)
      .set('authorization', `${process.env.JWT_ADMIN_ACADEMY_EXAMPLE}`)
      .then((res) => {
        expect(res.status).equal(200);
        expect(res.body.success).equal(true);
        done();
      });
  });

  it('do not success query course because error query chaincode', (done) => {
    query.returns({
      success: false,
      msg: 'Error query chaincode'
    });

    request(app)
      .get(`/common/course/${courseId}`)
      .set('authorization', `${process.env.JWT_ADMIN_ACADEMY_EXAMPLE}`)
      .then((res) => {
        expect(res.status).equal(500);
        expect(res.body.success).equal(false);
        done();
      });
  });
});
