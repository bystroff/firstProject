import request from 'supertest'
import {app} from '../src'
import { describe, it } from 'node:test'

describe ('/videos', () => {
    it('should be return 200 and all videos', async () => {
        await request(app).get('/videos').expect(200, [])
    })
})