import React, { useState } from 'react'
import { navigate } from 'gatsby'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import topics from '../../topics'

function BlogHeader({ activeTopic, menuItems, activeTitle }) {
  const [title, setTitle] = useState(null)
  const [blog, setBlog] = useState(null)

  return (
    <>
      <div>
        <Button
          className="header-title"
          aria-controls="title-list"
          aria-haspopup="true"
          onClick={e => setTitle(e.currentTarget)}
        >
          {activeTopic}
        </Button>

        <Menu id="title-list" anchorEl={title} open={Boolean(title)}>
          {[{ title: '首页', key: 'home', to: '/' }, ...topics].map(it => (
            <MenuItem key={it.key} onClick={() => it.to && navigate(it.to)}>
              {it.title}
            </MenuItem>
          ))}
        </Menu>
      </div>

      <div>
        <Button
          className="header-blog-title"
          aria-controls="blog-list"
          aria-haspopup="true"
          onClick={e => setBlog(e.currentTarget)}
        >
          {activeTitle}
        </Button>

        <Menu id="blog-list" anchorEl={blog} open={Boolean(blog)}>
          {menuItems.map(it => (
            <MenuItem key={it.slug} onClick={() => navigate(it.slug)}>
              {it.title}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </>
  )
}

export default BlogHeader
