import request from 'supertest'
import {app} from '../src'
import {describe, beforeAll, it} from '@jest/globals'

describe('/videos', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('get request should be return empty array', async () => {
        await request(app).get('/videos/').expect([])
    })

    it('post reshould be return empty array', async () => {
        await request(app).get('/videos/').expect([])
    })

    it('should be return 404', async () => {
        await request(app).get('/videos/').expect(404)
    })
})

