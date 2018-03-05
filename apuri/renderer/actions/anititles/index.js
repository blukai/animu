import { update, types } from './anititles'

import db from '../../providers/dexie'
import { S3_URL, S3_BUCKET } from '../../../config'
import client from '../../providers/apollo'

export default update({
  db,
  fetch,
  config: { S3_URL, S3_BUCKET },
  client,
  localStorage
})
export { types }
