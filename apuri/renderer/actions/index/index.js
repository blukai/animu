import { update } from './anititles'

import { anititles } from '../../db'
import { S3_URL, S3_BUCKET } from '../../../config'
import client from '../../client'

export default update({
  db: anititles,
  fetch,
  config: { S3_URL, S3_BUCKET },
  client
})

export { types } from './anititles'
