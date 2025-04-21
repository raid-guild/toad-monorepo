/**
 * TOAD Landing Page - Dark Mode Color Guide
 *
 * This file provides guidance on implementing the dark mode
 * color scheme using the new green palette.
 */

/*
# Dark Mode Color Guide

## Dark Mode Color Mapping

1. Background Colors
   - Primary background: #132A13 (Very Dark Green / green-900)
   - Secondary background: #31572C (Dark Green / green-800)
   - Card background: #31572C (Dark Green / green-800)
   - Accent background: #4F772D (Medium Green / green-700)

2. Text Colors
   - Primary text: #ECF39E (Very Light Green / green-100)
   - Headings: #ECF39E (Very Light Green / green-300)
   - Secondary text: #90A955 (Light Green / green-400)
   - Links: #90A955 (Light Green / green-400)

3. UI Elements
   - Buttons: #90A955 (Light Green / green-600)
   - Button hover: #4F772D (Medium Green / green-700)
   - Borders: #4F772D (Medium Green / green-700)
   - Icons: #ECF39E (Very Light Green / green-300)

## Implementation in Figma

When creating dark mode variants in Figma:

1. Create a dark mode color style for each light mode color:
   - Light mode: green-800 (#31572C) → Dark mode: green-300 (#ECF39E)
   - Light mode: gray-600 (#4B5563) → Dark mode: green-100 (#ECF39E)
   - Light mode: white (#FFFFFF) → Dark mode: green-900 (#132A13)

2. Use color variables to toggle between light and dark mode:
   - Create a variable called "background" that switches between white and green-900
   - Create a variable called "text" that switches between gray-800 and green-100
   - Create a variable called "heading" that switches between green-800 and green-300

3. Apply these variables to your components:
   - Set background colors to use the "background" variable
   - Set text colors to use the "text" variable
   - Set heading colors to use the "heading" variable

## Dark Mode Design Principles

1. Maintain sufficient contrast between text and background
2. Use darker greens for backgrounds and lighter greens for text and accents
3. Invert the logo in dark mode for better visibility
4. Reduce the opacity of the banner image in dark mode
5. Use subtle gradients to create depth in dark mode
*/
