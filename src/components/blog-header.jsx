import React, { useState } from 'react'
import { navigate } from 'gatsby'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import topics from '../topics'

function BlogHeader({ activeTopic, menuItems, activeTitle }) {
  const [open, setOpen] = useState(false)

  return (
    <AppBar color="transparent" position="static">
      <Toolbar className="header">
        <Button className="header-title" size="large" onClick={() => navigate('/')}>
          {activeTopic}
        </Button>

        <Hidden only={['xs', 'sm', 'md']}>
          <div>
            {topics.map(it => (
              <Button
                key={it.title}
                className={activeTopic === it.key ? 'active' : ''}
                onClick={() => it.to && navigate(it.to)}
              >
                {it.title}
              </Button>
            ))}
          </div>
        </Hidden>

        <Hidden only={['lg', 'xl']}>
          <div>
            <Button
              className="header-blog-title"
              aria-controls="blog-menu"
              aria-haspopup="true"
              onClick={e => setOpen(true)}
            >
              {activeTitle}
            </Button>

            <Menu id="blog-menu" keepMounted open={open}>
              {menuItems.map(it => (
                <MenuItem key={it.slug} onClick={() => navigate(it.slug)}>
                  {it.title}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

export default BlogHeader
