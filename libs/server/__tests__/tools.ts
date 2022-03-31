import { ObjectId } from 'mongodb';
import supertest from 'supertest';
import fixture from './fixture.json';
import { app } from '../src/server';

export const v4Uuid = '109156be-c4fb-41ea-b1b4-efe1671c5836';
export const v1Uuid = 'd9428888-122b-11e1-b85c-61cd3cbb3210';
export const validObjectId = new ObjectId();
export const invalidId = 'testId';
export const preExistData = () => fixture.map((i) => ({ ...i })); // clone for memory-mongodb sideeffect
export const preExistDummyToken = preExistData()[0].sessionToken;

export const requestWithCookie = (url: string, method: 'get' | 'post' | 'delete') =>
  supertest(app)
    [method](url)
    .set('Content-Type', 'application/json')
    .set('Cookie', [`token=${v4Uuid}`]);
export const requestWithDummyCookie = (url: string, method: 'get' | 'post' | 'delete') =>
  supertest(app)
    [method](url)
    .set('Content-Type', 'application/json')
    .set('Cookie', [`token=${preExistDummyToken}`]);
export const requestWithoutCookie = (url: string, method: 'get' | 'post' | 'delete') =>
  supertest(app)[method](url).set('Content-Type', 'application/json');
