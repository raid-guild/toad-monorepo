import { Inter, Roboto } from 'next/font/google'
import localFont from 'next/font/local'

// Google Fonts
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

// Okay Jelly Font
export const okayJelly = localFont({
  src: [
    {
      path: './Okay Jelly.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-okay-jelly',
})

// If you have local font files, you can use them like this:
// import localFont from 'next/font/local'

// export const myLocalFont = localFont({
//   src: [
//     {
//       path: './my-font.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: './my-font-bold.woff2',
//       weight: '700',
//       style: 'normal',
//     },
//   ],
//   variable: '--font-my-local',
// }) 