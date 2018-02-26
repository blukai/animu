import { update } from './anititles'

import db from '../../db'
import { S3_URL, S3_BUCKET } from '../../../config'
import client from '../../client'

export default update({
  db,
  fetch,
  config: { S3_URL, S3_BUCKET },
  client,
  localStorage
})

export { types } from './anititles'
