# PIKSEL Website - Project Context

## Overview
LED screen advertising website (piksel.lt) for Lithuania market.

## Tech Stack
- **Framework**: Next.js 15.5.2 with Turbopack
- **Database**: Supabase (LED screens data)
- **Deployment**: Vercel
- **Maps**: Leaflet.js
- **Styling**: Tailwind CSS
- **Email**: EmailJS

## Key Components

### Web Version
- `Map.tsx` - Main map with Leaflet, popups, screen selection
- `ScreenList.tsx` - Desktop sidebar with screen cards
- `Sidebar.tsx` - Left navigation sidebar
- `page.tsx` - Main page with inquiry form

### Mobile Version  
- `MapMobile.tsx` - Mobile map with inquiry form
- `ResponsiveImage.tsx` - Handles mobile/desktop images

### Shared
- `useLEDScreens.ts` - Supabase data hook
- `GlobalSidebar.tsx` - Used in DUK/Klipai pages

## Recent Fixes & Issues

### ✅ Resolved
1. **Vercel Image Optimization Limits** - Upgraded to Pro plan (5K transformations exceeded)
2. **Supabase Bandwidth Issues** - 402 Payment Required errors resolved
3. **Mobile Submit Button** - Fixed visibility above keyboard (iOS/Android)
4. **Kaunas Screen Images** - Fixed mobile image display
5. **Web Inquiry Form** - Removed close button, form closes only after submit
6. **"Last Minute" Badges** - Proper sizing and placement
7. **Responsive Popups** - Fixed mobile popup sizing

### Current Status
- All major issues resolved
- Images loading properly (web & mobile)
- Inquiry forms working correctly
- Responsive design implemented

## Key Features
- LED screen selection and filtering by city
- Date range selection for advertising
- Inquiry forms (web sidebar + mobile inline)
- Popup modals with screen details
- "Last Minute" badges for urgent bookings
- Responsive design for all devices

## Database Structure
- `led_screens` table with fields: name, city, address, coordinates, image_url, mobile_image_url, is_active, etc.
- Automatic slug generation for URLs
- Screen filtering by city and region

## Deployment
- Vercel Pro plan (resolves image optimization limits)
- Supabase Pro plan (resolves bandwidth limits)
- Custom domain: piksel.lt


