import { configure } from '@storybook/react'

function loadStories() {
  // automatically import all files ending in *.stories.js
  const req = require.context('../', true, /.stories.js$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
