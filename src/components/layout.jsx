import React from 'react'
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
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}

export default Layout
