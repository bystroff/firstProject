import request from 'supertest'
import {app} from '../src'
import {describe, beforeAll, it, expect} from '@jest/globals'

describe('/videos', () => {
   // let newVideo[];
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('get request should be return empty array', async () => {
        await request(app).get('/videos/').expect([])
    })

    it('post req with incorrect data (no title, no author) should be return 400', async () => {
        await request(app)
        .post('/videos/')
        .send({title: '', author: ''})
        .expect(400, {
            errorsMessages: [
                { message: 'title is required', field: 'title'},
                { message: 'author is required', field: 'author'},
            ],
        })
        const res = await request(app).get('/videos/')
        expect(res.body).toEqual([])
    })

    
})

