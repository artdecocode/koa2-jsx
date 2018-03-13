import { connect } from 'react-redux'
import View from '../Components/View'

/**
 * Extract properties for the view component from the state.
 */
const mapStateToProps = ({ title, scripts, scriptSources, links }) => ({
  title,
  scripts,
  scriptSources,
  links,
})

export default connect(mapStateToProps)(View)
