import React from 'react'
import { Helmet } from 'react-helmet'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

import '@fontsource/roboto'
import '@fontsource/fira-code'
import '../index.less'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
})

function Layout({ children }) {
  return (
    <MuiThemeProvider theme={theme}>
      <Helmet>
        <title>秘密花园-王小一的博客</title>
        <link rel="icon" href="/favicon.png" type="image/x-icon" />
      </Helmet>
      {children}
    </MuiThemeProvider>
  )
}

export default Layout
