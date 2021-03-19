import React from 'react'
import Button from '@material-ui/core/Button'
import { navigate } from 'gatsby'

import topics from '../../topics'

function Header({ activeTopic }) {
  return (
    <>
      <Button className="header-title" onClick={() => navigate('/')}>
        首页
      </Button>

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
    </>
  )
}

export default Header
