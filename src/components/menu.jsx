import React from 'react'
import { navigate } from 'gatsby'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

function Menu({ items, activeKey }) {
  return (
    <List className="blog-menu" component="nav" aria-label="main mailbox folders">
      {items.map(it => (
        <ListItem
          key={it.title}
          style={{ color: activeKey === it.slug ? '#648dae' : 'inherit' }}
          button
          onClick={() => navigate(it.slug)}
        >
          {it.title}
        </ListItem>
      ))}
    </List>
  )
}

export default Menu
