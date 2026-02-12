'use client'

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material/styles'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

function MuiThemeProviderContent({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedTheme === 'dark' ? 'dark' : 'light',
          ...(resolvedTheme === 'dark'
            ? {
                // Dark mode
                primary: { main: 'hsl(215, 80%, 55%)' },
                secondary: { main: 'hsl(168, 55%, 45%)' },
                background: {
                  default: 'hsl(224, 18%, 8%)',
                  paper: 'hsl(222, 16%, 11%)',
                },
                text: {
                  primary: 'hsl(210, 15%, 92%)',
                  secondary: 'hsl(215, 10%, 50%)',
                },
                divider: 'hsl(220, 14%, 18%)',
              }
            : {
                // Light mode
                primary: { main: 'hsl(215, 80%, 50%)' },
                secondary: { main: 'hsl(168, 60%, 42%)' },
                background: {
                  default: 'hsl(210, 20%, 98%)',
                  paper: 'hsl(0, 0%, 100%)',
                },
                text: {
                  primary: 'hsl(220, 20%, 10%)',
                  secondary: 'hsl(215, 10%, 46%)',
                },
                divider: 'hsl(214, 18%, 89%)',
              }),
        },
        shape: {
          borderRadius: 10,
        },
        typography: {
          fontFamily: 'var(--font-geist-sans), Inter, system-ui, sans-serif',
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [resolvedTheme]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  return <MuiThemeProviderContent>{children}</MuiThemeProviderContent>
}
