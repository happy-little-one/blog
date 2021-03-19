import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Hidden from '@material-ui/core/Hidden'

import Large from './large'
import Small from './small'

function Header(props) {
  return (
    <AppBar color="transparent" position="static">
      <Toolbar className="header">
        <Hidden only={['xs', 'sm', 'md']}>
          <Large activeTopic={props.activeTopic} />
        </Hidden>
        <Hidden only={['lg', 'xl']}>
          <Small {...props} />
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

export default Header
