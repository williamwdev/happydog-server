'use strict';

require('dotenv').config();

process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';
process.env.TEST_DB_URL = process.env.TEST_DB_URL || 'postgresql://happydog@localhost/happydog';

const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;