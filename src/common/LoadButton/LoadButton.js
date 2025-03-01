import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  TERTIARY_BUTTON
} from 'igz-controls/constants'

import './loadButton.scss'

const LoadButton = React.forwardRef(
  ({ className, label, variant, ...restProps }, ref) => {
    const buttonClassName = classNames(
      'btn-load',
      `btn-load-${variant}`,
      className
    )

    return (
      <button ref={ref} {...restProps} className={buttonClassName}>
        {label}
      </button>
    )
  }
)

LoadButton.defaultProps = {
  className: '',
  label: 'Load button',
  variant: TERTIARY_BUTTON
}

LoadButton.propTypes = {
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  variant: PropTypes.PropTypes.oneOf([
    PRIMARY_BUTTON,
    SECONDARY_BUTTON,
    TERTIARY_BUTTON
  ]).isRequired
}

export default LoadButton
