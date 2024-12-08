import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Application from './application'
import { ChakraProvider, Flex } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'

const queryClient = new QueryClient()
const muiTheme = createTheme()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ChakraProvider>
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline />
          <Flex width="full" height="full" overflow="hidden">
            <Application />
          </Flex>
        </MuiThemeProvider>
      </ChakraProvider>
    </BrowserRouter>
  </QueryClientProvider>
)
