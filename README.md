# ⚽ Terrain Booking App - Football Field Reservation Platform for Senegal

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-98.7%25-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)

**A modern web platform for booking football fields and sports facilities in Senegal**

[Live Demo](https://terrain-booking-app.vercel.app) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started)

</div>

---

## 📋 About The Project

**Terrain Booking App** is a comprehensive booking platform designed specifically for football field reservations in Senegal. The application allows users to discover, book, and manage sports facilities across Dakar and other regions, providing a seamless booking experience for both customers and field owners.

### 🎯 Project Goals

- 🏟️ **Simplify Field Booking**: Make it easy for players to find and book football fields
- 📱 **User-Friendly Interface**: Provide an intuitive, modern booking experience
- 💼 **Business Management**: Empower field owners with powerful management tools
- 🇸🇳 **Serve Senegal**: Focus on the Senegalese market with local pricing (FCFA)

---

## ✨ Features

### 🔍 For Customers

- **🗺️ Field Discovery**
  - Browse football fields across Dakar (Fass, Almadies, Grand Yoff, Mamelles, etc.)
  - View detailed field information (surface, dimensions, capacity)
  - See amenities (WiFi, parking, security, changing rooms, showers)
  - Check real-time pricing per hour in FCFA

- **📅 Smart Booking System**
  - Real-time availability checking
  - Interactive calendar with date selection
  - Available time slots display (08:00 - 20:00)
  - Guest booking (no account required)
  - Instant booking confirmation with unique reservation code
  - Email and phone contact options

- **🎫 Reservation Management**
  - Track reservations with unique codes (TB-YYYYMMDD-XXXXXX)
  - Find existing reservations
  - View booking details and status

### 💼 For Field Owners & Managers

- **📊 Dashboard Analytics**
  - Revenue tracking and statistics
  - Booking trends and insights
  - Field performance metrics
  - Monthly/weekly/daily revenue reports

- **🏟️ Field Management**
  - Add and manage multiple fields
  - Set pricing and availability
  - Configure amenities and facilities
  - Upload field photos

- **📋 Reservation Management**
  - View all bookings in real-time
  - Manual reservation creation
  - Update booking status (pending, confirmed, paid, completed, cancelled)
  - Filter and search reservations

- **👥 Staff Management**
  - Role-based access (Owner/Manager)
  - Assign managers to fields
  - Secure authentication system

---

## 🗺️ Featured Locations

The platform currently features fields in key Dakar locations:

- **Place de l'Obélisque** (Fass) - 30,000 FCFA/hour
- **Grand Yoff** - 27,000 FCFA/hour
- **Almadies** - 25,000 FCFA/hour
- **Mamelles** - 34,000 FCFA/hour
- **Hann Maristes** - 31,000 FCFA/hour
- **Sicap Baobab** - 29,000 FCFA/hour
- **Parcelles Assainies** - Basketball courts
- And more...

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js) | 15.2.4 | React framework with SSR |
| ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) | 19 | UI library |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript) | 5.x | Type-safe development (98.7%) |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css) | 3.x | Utility-first CSS |
| ![Radix UI](https://img.shields.io/badge/Radix_UI-Latest-black) | Latest | Accessible components |

### Backend & Database

| Technology | Purpose |
|------------|---------|
| ![MongoDB](https://img.shields.io/badge/MongoDB-6.17-47A248?logo=mongodb) | NoSQL database |
| ![Next.js API Routes](https://img.shields.io/badge/API_Routes-Next.js-black) | RESTful API endpoints |

### UI Components & Libraries

- **Radix UI**: Accessible, unstyled component primitives
  - Dialogs, Dropdowns, Modals, Tooltips, etc.
- **Lucide React**: Beautiful icon library
- **React Hook Form**: Form validation and management
- **Date-fns**: Date manipulation
- **Recharts**: Data visualization
- **Sonner**: Toast notifications
- **Embla Carousel**: Image carousels

### Development Tools

- **Autoprefixer**: CSS vendor prefixing
- **Class Variance Authority**: Component variants
- **CMDK**: Command menu component
- **Input OTP**: OTP input handling

---

## 📁 Project Structure

```
terrain-booking-app/
├── app/
│   ├── (main)/                 # Main application routes
│   │   └── terrains/           # Field listing and details
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── dashboard/          # Dashboard analytics
│   │   ├── reservations/       # Booking management
│   │   └── terrains/           # Field data & availability
│   └── dashboard/              # Owner/Manager dashboard
├── components/
│   ├── terrain/                # Field-related components
│   │   ├── BookingSection.tsx  # Booking interface
│   │   └── GuestBookingModal.tsx
│   └── ui/                     # Reusable UI components
├── lib/
│   └── mongodb.ts              # Database connection
├── models/
│   └── terrain.ts              # Data models
└── scripts/
    └── data/                   # Seed data for terrains
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **MongoDB** database (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mamadbah2/terrain-booking-app.git
cd terrain-booking-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/terrainBooking
# or use MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/terrainBooking

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. **Seed the database** (Optional)
```bash
npm run seed
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🌐 Live Demo

Visit the live application: **[terrain-booking-app.vercel.app](https://terrain-booking-app.vercel.app)**

### Demo Credentials

**Field Owner Account:**
```
Email: owner@example.com
Password: demo123
```

**Manager Account:**
```
Email: manager@example.com
Password: demo123
```

---

## 📱 Key Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Browse all available fields |
| **Field Details** | `/terrains/[id]` | View field info and book |
| **Dashboard** | `/dashboard` | Owner/Manager analytics |
| **Login** | `/auth/login` | Staff authentication |
| **Reservations** | `/dashboard/reservations` | Manage bookings |
| **Find Booking** | `/retrouver-reservation` | Search for existing booking |

---

## 🎨 Design Features

### Modern UI/UX

- ✨ **Clean, professional interface**
- 📱 **Fully responsive** (mobile, tablet, desktop)
- 🌙 **Dark mode support** via next-themes
- ♿ **Accessibility-first** with Radix UI
- 🎯 **Intuitive navigation**

### Visual Elements

- 🖼️ **Image carousels** for field photos
- 📊 **Interactive charts** for analytics
- 🎨 **Color-coded status** indicators
- 💚 **Green accent** theme (representing football fields)

---

## 🔐 Authentication & Security

- **Session-based authentication** with HTTP-only cookies
- **Role-based access control** (Owner, Manager)
- **Secure API endpoints** with authentication checks
- **Input validation** on all forms
- **MongoDB ObjectId** validation

---

## 📊 Database Schema

### Collections

**Users**
```typescript
{
  _id: ObjectId,
  username: string,
  email: string,
  password: string,
  role: "proprio" | "gerant" | "client"
}
```

**Terrains**
```typescript
{
  _id: ObjectId,
  name: string,
  location: string,
  pricePerHour: number,
  sport: string,
  amenities: Array,
  images: Array,
  ownerId: ObjectId,
  managerId: ObjectId,
  isActive: boolean
}
```

**Reservations**
```typescript
{
  _id: ObjectId,
  fieldId: ObjectId,
  date: string,
  startTime: string,
  endTime: string,
  totalPrice: number,
  status: "pending" | "confirmed" | "paid" | "completed" | "cancelled",
  reservationCode: string,
  guestName: string,
  guestPhoneNumber: string,
  guestEmail: string
}
```

---

## 🔧 API Endpoints

### Public Endpoints

```
GET  /api/terrains              # List all fields
GET  /api/terrains/[id]         # Get field details
GET  /api/terrains/[id]/disponibilites?date=YYYY-MM-DD  # Check availability
POST /api/reservations/guest    # Create guest booking
```

### Protected Endpoints (Staff Only)

```
POST /api/auth/login            # Staff login
GET  /api/auth/me               # Get current user
GET  /api/dashboard/stats       # Analytics data
GET  /api/dashboard/revenue     # Revenue reports
GET  /api/dashboard/fields      # Field performance
POST /api/reservations/manual   # Manual booking creation
PATCH /api/reservations/[id]    # Update booking status
```

---

## 📈 Business Features

### Revenue Tracking

- 💰 **Total monthly revenue**
- 📊 **Revenue trends** (daily, weekly, monthly)
- 📈 **Growth metrics** and comparisons
- 🎯 **Per-field performance**

### Analytics Dashboard

- 📊 **Total bookings** and utilization rates
- 👥 **Customer statistics**
- 🏆 **Top-performing fields**
- 📅 **Booking calendar** overview
- 🔔 **Real-time activity feed**

---

## 🌍 Senegal-Specific Features

- 💵 **FCFA currency** (West African CFA franc)
- 📍 **Dakar locations** prominently featured
- 🇫🇷 **French language** support (primary UI language)
- 📞 **Local phone number** format (+221)
- ⚽ **Football-focused** (most popular sport in Senegal)

---

## 🚧 Roadmap

### Planned Features

- [ ] 💳 Mobile money integration (Orange Money, Wave)
- [ ] 📧 Email notifications for bookings
- [ ] 📱 SMS confirmations
- [ ] ⭐ Customer reviews and ratings
- [ ] 🏆 Loyalty programs
- [ ] 📅 Recurring bookings
- [ ] 🎁 Promotional codes
- [ ] 🌐 Multi-language support (Wolof, English)
- [ ] 📊 Advanced reporting
- [ ] 🔔 Push notifications

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is available for educational and demonstration purposes.

---

## 📧 Contact

**Mamadou Bah** - [@mamadbah2](https://github.com/mamadbah2)

Project Link: [https://github.com/mamadbah2/terrain-booking-app](https://github.com/mamadbah2/terrain-booking-app)

Live Demo: [https://terrain-booking-app.vercel.app](https://terrain-booking-app.vercel.app)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Hosting and deployment
- [MongoDB](https://www.mongodb.com/) - Database
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons

---

<div align="center">

**⚽ Built with ❤️ for the football community in Senegal 🇸🇳**

![TypeScript](https://img.shields.io/badge/TypeScript-98.7%25-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js&logoColor=white&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white&style=for-the-badge)

**⭐ If you find this project useful, please give it a star! ⭐**

</div>
