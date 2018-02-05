import Titlebar, { Draggable, Button } from './titlebar'

describe('<Titlebar />', () => {
  const wrapper = shallow(<Titlebar />)

  describe('draggable region', () => {
    it('should render', () => {
      expect(wrapper.find(Draggable)).toHaveLength(1)
    })

    const styled = mount(<Draggable />)
    it('should be draggable', () => {
      expect(styled).toHaveStyleRule('-webkit-app-region', 'drag')
    })
    it('should grow', () => {
      expect(styled).toHaveStyleRule('flex-grow', '1')
    })
  })

  describe('titlebar buttons', () => {
    it('should render minimize', () => {
      expect(wrapper.find('#minimize')).toHaveLength(1)
    })
    it('should render zoom', () => {
      expect(wrapper.find('#zoom')).toHaveLength(1)
    })
    it('should render close', () => {
      expect(wrapper.find('#close')).toHaveLength(1)
    })
  })
})
