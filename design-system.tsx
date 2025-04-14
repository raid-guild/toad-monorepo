/**
 * TOAD Landing Page Design System
 *
 * This file contains design tokens and specifications for recreating
 * the TOAD landing page in Figma.
 */

// Color Palette
const colors = {
  // Primary Colors
  green: {
    900: "#132A13", // Very dark green
    800: "#31572C", // Dark green
    700: "#4F772D", // Medium green
    600: "#90A955", // Light green
    500: "#90A955", // Light green (duplicate for consistent mapping)
    400: "#90A955", // Light green (duplicate for consistent mapping)
    300: "#ECF39E", // Very light green
    200: "#ECF39E", // Very light green (duplicate for consistent mapping)
    100: "#ECF39E", // Very light green with reduced opacity
    50: "#ECF39E80", // Very light green with more reduced opacity
  },

  // Neutrals
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },

  // Semantic Colors
  white: "#ffffff",
  black: "#000000",
}

// Typography
const typography = {
  fontFamily: {
    sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
}

// Spacing System (in pixels)
const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
  32: "128px",
}

// Border Radius
const borderRadius = {
  none: "0px",
  sm: "2px",
  DEFAULT: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  "2xl": "16px",
  "3xl": "24px",
  full: "9999px",
}

// Shadows
const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
}

// Component Specifications
const components = {
  // Navbar
  navbar: {
    height: "64px",
    logo: {
      width: "40px",
      height: "40px",
    },
    links: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: colors.gray[700],
      hoverColor: colors.green[600],
    },
    button: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      padding: `${spacing[2]} ${spacing[4]}`,
      backgroundColor: colors.green[600],
      textColor: colors.white,
      borderRadius: borderRadius.md,
    },
  },

  // Hero Section
  hero: {
    padding: `${spacing[16]} ${spacing[4]} ${spacing[24]} ${spacing[4]}`,
    logo: {
      width: "96px",
      height: "96px",
    },
    title: {
      fontSize: typography.fontSize["6xl"],
      fontWeight: typography.fontWeight.bold,
      color: colors.green[800],
    },
    subtitle: {
      fontSize: typography.fontSize["2xl"],
      fontWeight: typography.fontWeight.medium,
      color: colors.gray[700],
    },
    description: {
      fontSize: typography.fontSize.lg,
      color: colors.gray[600],
    },
    buttons: {
      primary: {
        fontSize: typography.fontSize.lg,
        padding: `${spacing[6]} ${spacing[6]}`,
        backgroundColor: colors.green[600],
        textColor: colors.white,
        borderRadius: borderRadius.md,
      },
      secondary: {
        fontSize: typography.fontSize.lg,
        padding: `${spacing[6]} ${spacing[6]}`,
        borderColor: colors.green[600],
        textColor: colors.green[700],
        borderRadius: borderRadius.md,
      },
    },
  },

  // About Section
  about: {
    padding: `${spacing[20]} ${spacing[4]}`,
    title: {
      fontSize: typography.fontSize["4xl"],
      fontWeight: typography.fontWeight.bold,
      color: colors.green[800],
    },
    description: {
      fontSize: typography.fontSize.lg,
      color: colors.gray[600],
    },
    card: {
      padding: spacing[6],
      backgroundColor: colors.white,
      borderColor: colors.green[100],
      borderRadius: borderRadius.lg,
      shadow: shadows.sm,
      iconContainer: {
        backgroundColor: colors.green[50],
        padding: spacing[3],
        borderRadius: borderRadius.full,
      },
      icon: {
        width: "24px",
        height: "24px",
        color: colors.green[600],
      },
      title: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semibold,
        color: colors.green[800],
      },
      text: {
        fontSize: typography.fontSize.base,
        color: colors.gray[600],
      },
    },
  },

  // Ecosystem Section
  ecosystem: {
    padding: `${spacing[20]} ${spacing[4]}`,
    backgroundColor: colors.green[50],
    title: {
      fontSize: typography.fontSize["4xl"],
      fontWeight: typography.fontWeight.bold,
      color: colors.green[800],
    },
    description: {
      fontSize: typography.fontSize.lg,
      color: colors.gray[600],
    },
    card: {
      padding: spacing[6],
      backgroundColor: colors.white,
      borderColor: colors.green[100],
      borderRadius: borderRadius.lg,
      shadow: shadows.sm,
      title: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semibold,
        color: colors.green[800],
      },
      text: {
        fontSize: typography.fontSize.base,
        color: colors.gray[600],
      },
      link: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
        color: colors.green[600],
      },
    },
    infoBox: {
      padding: `${spacing[8]} ${spacing[8]}`,
      backgroundColor: colors.white,
      borderRadius: borderRadius.xl,
      shadow: shadows.sm,
      title: {
        fontSize: typography.fontSize["2xl"],
        fontWeight: typography.fontWeight.bold,
        color: colors.green[800],
      },
      text: {
        fontSize: typography.fontSize.base,
        color: colors.gray[600],
      },
      logoContainer: {
        height: "320px",
        backgroundColor: colors.green[100],
        borderRadius: borderRadius.lg,
      },
    },
  },

  // Contact Section
  contact: {
    padding: `${spacing[20]} ${spacing[4]}`,
    title: {
      fontSize: typography.fontSize["4xl"],
      fontWeight: typography.fontWeight.bold,
      color: colors.green[800],
    },
    description: {
      fontSize: typography.fontSize.lg,
      color: colors.gray[600],
    },
    form: {
      maxWidth: "672px",
      label: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.gray[700],
      },
      input: {
        padding: `${spacing[2]} ${spacing[3]}`,
        borderColor: colors.green[200],
        borderRadius: borderRadius.md,
        fontSize: typography.fontSize.base,
      },
      button: {
        padding: `${spacing[3]} ${spacing[4]}`,
        backgroundColor: colors.green[600],
        textColor: colors.white,
        borderRadius: borderRadius.md,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
      },
    },
  },

  // Footer
  footer: {
    padding: `${spacing[12]} ${spacing[4]}`,
    backgroundColor: colors.green[900],
    textColor: colors.white,
    logo: {
      width: "40px",
      height: "40px",
      backgroundColor: colors.white,
      borderRadius: borderRadius.full,
      padding: spacing[1],
    },
    title: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: colors.white,
    },
    subtitle: {
      fontSize: typography.fontSize.base,
      color: colors.green[100],
    },
    heading: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      color: colors.white,
    },
    link: {
      fontSize: typography.fontSize.base,
      color: colors.green[100],
      hoverColor: colors.white,
    },
    icon: {
      width: "24px",
      height: "24px",
      color: colors.white,
    },
    copyright: {
      fontSize: typography.fontSize.base,
      color: colors.green[200],
      borderTopColor: colors.green[700],
      paddingTop: spacing[6],
      marginTop: spacing[12],
    },
  },
}

// Theme Variants
const theme = {
  light: {
    background: colors.white,
    text: colors.gray[900],
    // Component-specific overrides for light theme
  },
  dark: {
    background: colors.green[900],
    text: colors.gray[100],
    // Component-specific overrides for dark theme
    navbar: {
      background: colors.green[900],
      borderColor: colors.green[800],
    },
    hero: {
      title: {
        color: colors.green[300],
      },
      subtitle: {
        color: colors.green[100],
      },
      description: {
        color: colors.green[200],
      },
    },
    about: {
      background: colors.green[900],
      title: {
        color: colors.green[300],
      },
      description: {
        color: colors.green[200],
      },
      card: {
        backgroundColor: colors.green[800],
        borderColor: colors.green[700],
        iconContainer: {
          backgroundColor: `${colors.green[700]}80`, // With opacity
        },
        icon: {
          color: colors.green[300],
        },
        title: {
          color: colors.green[300],
        },
        text: {
          color: colors.green[100],
        },
      },
    },
    ecosystem: {
      backgroundColor: colors.green[800],
      title: {
        color: colors.green[300],
      },
      description: {
        color: colors.green[100],
      },
      card: {
        backgroundColor: colors.green[800],
        borderColor: colors.green[700],
        title: {
          color: colors.green[300],
        },
        text: {
          color: colors.green[100],
        },
        link: {
          color: colors.green[400],
        },
      },
      infoBox: {
        backgroundColor: colors.green[800],
        title: {
          color: colors.green[300],
        },
        text: {
          color: colors.green[100],
        },
        logoContainer: {
          backgroundColor: `${colors.green[700]}50`, // With opacity
        },
      },
    },
    contact: {
      background: colors.green[900],
      title: {
        color: colors.green[300],
      },
      description: {
        color: colors.green[100],
      },
      form: {
        label: {
          color: colors.green[100],
        },
        input: {
          backgroundColor: colors.green[800],
          borderColor: colors.green[700],
        },
      },
    },
    footer: {
      backgroundColor: colors.green[900],
      borderColor: colors.green[800],
      logo: {
        backgroundColor: colors.green[800],
      },
      subtitle: {
        color: colors.green[100],
      },
      link: {
        color: colors.green[100],
      },
      copyright: {
        borderTopColor: colors.green[800],
      },
    },
  },
}

// Assets
const assets = {
  logo: "/logo.png", // TOAD logo
  banner: "/banner.jpeg", // Forest banner image
  icons: {
    // Lucide icons used in the project
    messageSquare: "Message Square icon",
    vote: "Vote icon",
    users: "Users icon",
    bot: "Bot icon",
    arrowRight: "Arrow Right icon",
    send: "Send icon",
    github: "GitHub icon",
    twitter: "Twitter icon",
    externalLink: "External Link icon",
    menu: "Menu icon",
    x: "X icon",
    sun: "Sun icon",
    moon: "Moon icon",
  },
}

// Breakpoints (in pixels)
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

// Export all design tokens
const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  theme,
  assets,
  breakpoints,
}

export default designSystem
