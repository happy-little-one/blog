import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { navigate } from 'gatsby'

import topics from '../topics'

function Header() {
  return (
    <AppBar color="transparent" position="static">
      <Toolbar className="header">
        <div className="header-left">
          <Button className="header-title" size="large" onClick={() => navigate('/')}>
            秘密花园
          </Button>
          <Typography color="textSecondary" variant="body2" component="h3">
            王小一的博客
          </Typography>
        </div>

        <Typography>
          {topics.map(it => (
            <Button key={it.title} onClick={() => it.to && navigate(it.to)}>
              {it.title}
            </Button>
          ))}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Header
