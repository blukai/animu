import Titlebar, { Draggable, Button } from './titlebar'

describe('<Titlebar />', () => {
  const nof = () => {}

  const sw = shallow(<Titlebar minimize={nof} zoom={nof} close={nof} />)

  describe('draggable region', () => {
    it('should render', () => {
      expect(sw.find(Draggable)).toHaveLength(1)
    })

    const styled = mount(<Draggable />)
    it('should grow', () => {
      expect(styled).toHaveStyleRule('flex-grow', '1')
    })
    it('should be draggable', () => {
      expect(styled).toHaveStyleRule('-webkit-app-region', 'drag')
    })
  })

  describe('titlebar buttons', () => {
    it('should render minimize', () => {
      expect(sw.find('#minimize')).toHaveLength(1)
    })
    it('should render zoom', () => {
      expect(sw.find('#zoom')).toHaveLength(1)
    })
    it('should render close', () => {
      expect(sw.find('#close')).toHaveLength(1)
    })
  })

  describe('props', () => {
    const mw = mount(<Titlebar minimize={nof} zoom={nof} close={nof} />)
    it('allows to set props', () => {
      expect(mw.props().minimize).toEqual(nof)
      expect(mw.props().zoom).toEqual(nof)
      expect(mw.props().close).toEqual(nof)
    })
  })
})
