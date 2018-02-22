import { shallow } from 'enzyme'

import Container, { Error, Loading } from './container'

describe('<Container />', () => {
  const initialProps = { error: false, loading: false, children: '🌚' }

  it('should render error', () => {
    const props = { ...initialProps, error: true }
    const component = shallow(<Container {...props} />)
    expect(component.find(Error)).toHaveLength(1)
  })

  it('should render loading', () => {
    const props = { ...initialProps, loading: true }
    const component = shallow(<Container {...props} />)
    expect(component.find(Loading)).toHaveLength(1)
  })

  it('should render children', () => {
    const props = { ...initialProps }
    const component = shallow(<Container {...props} />)
    expect(component.contains(props.children)).toEqual(true)
  })
})
