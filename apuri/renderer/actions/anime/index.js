import { getTitle as getTitleX, titleTypes } from './anime'

import db from '../../providers/dexie'

export const getTitle = getTitleX({ db })
export { titleTypes }
