import { connect } from 'react-redux'
import View from '../Components/View'

/**
 * Extract properties for the view component from the state.
 */
export default connect(state => state)(View)
