import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'
import { navigate } from 'gatsby'

import topics from '../topics'

function Header({ activeKey }) {
  return (
    <AppBar color="transparent">
      <Toolbar className="header">
        <div className="header-left">
          <Button className="header-title" size="large" onClick={() => navigate('/')}>
            秘密花园
          </Button>
          <Typography color="textSecondary" variant="body2" component="h3">
            王小一的博客
          </Typography>
        </div>

        <Hidden only={['xs', 'sm', 'md']}>
          <div>
            {topics.map(it => (
              <Button
                key={it.title}
                className={activeKey === it.key ? 'active' : ''}
                onClick={() => it.to && navigate(it.to)}
              >
                {it.title}
              </Button>
            ))}
          </div>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

export default Header
