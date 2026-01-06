# 💎 HerAura – Anti-Tarnish Jewellery E-Commerce Platform

![GitHub stars](https://img.shields.io/github/stars/pharande1028/HerAura?style=social)
![GitHub forks](https://img.shields.io/github/forks/pharande1028/HerAura?style=social)
![GitHub issues](https://img.shields.io/github/issues/pharande1028/HerAura)
![GitHub license](https://img.shields.io/github/license/pharande1028/HerAura)

**HerAura** is a modern, scalable full-stack e-commerce web application designed for premium anti-tarnish jewellery brands, similar to GIVA and Palmonas. The platform covers the complete customer journey—from product discovery to secure checkout and doorstep delivery.

Built with **Next.js for high-performance frontend**, **Node.js/NestJS for backend APIs**, and **PostgreSQL for data persistence**, HerAura integrates industry-standard tools for **payments, notifications, logistics, and customer support**.

## 🏗️ System Architecture

```
                    ┌────────────────────┐
                    │   Customer Browser  │
                    │ (Web / Mobile Web)  │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  CDN (Cloudflare)   │
                    │  Image + Static     │
                    └─────────┬──────────┘
                              │
                ┌─────────────▼─────────────┐
                │ Frontend (Next.js)         │
                │ - Landing Pages            │
                │ - Product Pages            │
                │ - Cart / Checkout          │
                │ - SEO + SSR                │
                └─────────────┬─────────────┘
                              │ REST / GraphQL
        ┌─────────────────────▼─────────────────────┐
        │ Backend API (Node.js + NestJS)              │
        │---------------------------------------------│
        │ Auth Service | Product Service | Order Svc │
        │ Payment Svc  | Notification Svc| Support   │
        └─────────────┬───────────────┬─────────────┘
                      │               │
      ┌───────────────▼───────┐   ┌───▼─────────────────┐
      │ PostgreSQL (Main DB)   │   │ Redis (Cache)       │
      │ Users, Orders, Product│   │ Sessions, Cart      │
      └───────────────┬───────┘   └─────────────────────┘
                      │
        ┌─────────────▼─────────────┐
        │ Object Storage (AWS S3)    │
        │ Product Images, Invoices   │
        └─────────────┬─────────────┘
                      │
 ┌───────────────┬────▼──────┬──────────────┐
 │ Payment       │ Logistics │ Notifications│
 │ Razorpay      │ Shiprocket│ Email / SMS  │
 │ Webhooks      │ APIs      │ WhatsApp     │
 └───────────────┴───────────┴──────────────┘
```

## 🛠️ Tech Stack

### Frontend
- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) **Next.js 14** - React framework with SSR/SSG
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript** - Type-safe development
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS** - Utility-first styling
- ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white) **Framer Motion** - Smooth animations

### Backend
- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) **Node.js** - JavaScript runtime
- ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) **NestJS** - Scalable backend framework
- ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express&logoColor=white) **Express.js** - Web application framework
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=JSON%20web%20tokens&logoColor=white) **JWT** - Secure authentication

### Database & Storage
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) **PostgreSQL** - Primary database
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white) **Prisma ORM** - Database toolkit
- ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white) **Redis** - Caching & sessions
- ![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=flat&logo=amazon-s3&logoColor=white) **AWS S3** - File storage

### Integrations
- ![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=flat&logo=razorpay&logoColor=white) **Razorpay** - Payment gateway
- **Shiprocket** - Logistics & shipping
- ![SendGrid](https://img.shields.io/badge/SendGrid-1A82E2?style=flat&logo=sendgrid&logoColor=white) **SendGrid** - Email service
- ![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=flat&logo=twilio&logoColor=white) **Twilio** - SMS & WhatsApp

### DevOps & Deployment
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) **Docker** - Containerization
- ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white) **GitHub Actions** - CI/CD
- ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white) **Vercel** - Frontend hosting
- ![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white) **AWS** - Backend infrastructure

## 🗄️ Database Schema

### Core Tables

```sql
-- Users & Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Product Management
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    category_id UUID REFERENCES categories(id),
    material VARCHAR(100),
    anti_tarnish BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Orders & Payments
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status order_status DEFAULT 'placed',
    payment_status payment_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    gateway VARCHAR(50) DEFAULT 'razorpay',
    payment_id VARCHAR(255),
    status payment_status DEFAULT 'pending',
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🌟 Features

### ✅ Current Features (MVP)
- **Responsive Landing Page** - Modern, mobile-first design
- **Product Showcase** - Category-wise jewelry display
- **Search Functionality** - Real-time product search
- **Shopping Cart** - Add/remove items with quantity
- **Wishlist** - Save favorite products
- **User Authentication** - Secure login/signup
- **Contact Integration** - Direct communication channels

### 🚧 Planned Features (Full-Scale)
- **Secure Payments** - Razorpay integration (UPI, Cards, Net Banking)
- **Order Management** - Complete lifecycle tracking
- **Admin Dashboard** - Product & order management
- **Email Notifications** - Order confirmations & updates
- **SMS/WhatsApp** - Real-time order notifications
- **Inventory Management** - Stock tracking & alerts
- **Customer Support** - Ticket system & live chat
- **Analytics Dashboard** - Sales & customer insights

### 🔮 Future Enhancements
- **Loyalty Programs** - Points & rewards system
- **Product Reviews** - Customer feedback & ratings
- **AR Try-On** - Virtual jewelry fitting
- **Influencer Pages** - Brand ambassador integration
- **Multi-language** - Regional language support
- **Mobile App** - React Native application

## 📁 Project Structure

```
HerAura/
├── frontend/                 # Next.js Application
│   ├── app/                 # App Router (Next.js 13+)
│   │   ├── page.tsx         # Landing page
│   │   ├── products/        # Product pages
│   │   ├── cart/           # Shopping cart
│   │   └── checkout/       # Checkout flow
│   ├── components/         # Reusable components
│   │   ├── Navbar.tsx      # Navigation header
│   │   ├── Footer.tsx      # Site footer
│   │   └── ProductCard.tsx # Product display
│   ├── services/           # API integration
│   ├── styles/            # Global styles
│   └── utils/             # Helper functions
├── backend/                # Node.js/NestJS API
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── users/      # User management
│   │   │   ├── products/   # Product catalog
│   │   │   ├── orders/     # Order processing
│   │   │   └── payments/   # Payment handling
│   │   ├── database/       # DB configuration
│   │   ├── middlewares/    # Custom middleware
│   │   └── utils/         # Backend utilities
│   ├── prisma/            # Database schema
│   └── docker/            # Container configs
├── docs/                  # Documentation
├── deployment/            # CI/CD & deployment
└── README.md             # This file
```

## 🚀 Development Roadmap

### Phase 1: MVP (2-3 Months)
- [x] Landing page design
- [x] Product showcase
- [x] Basic navigation
- [ ] User authentication
- [ ] Shopping cart
- [ ] Basic checkout
- [ ] Payment integration

### Phase 2: Core Features (3-4 Months)
- [ ] Admin dashboard
- [ ] Order management
- [ ] Email notifications
- [ ] Inventory tracking
- [ ] Customer support

### Phase 3: Advanced Features (4-6 Months)
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Loyalty programs
- [ ] AR try-on
- [ ] Multi-language support

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Input Validation** - Comprehensive data sanitization
- **Rate Limiting** - API abuse prevention
- **HTTPS Enforcement** - Secure data transmission
- **PCI Compliance** - Payment security standards
- **CORS Configuration** - Cross-origin security
- **SQL Injection Prevention** - Parameterized queries

## 📊 Performance Optimizations

- **Server-Side Rendering** - Fast initial page loads
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Lazy loading components
- **Redis Caching** - Database query optimization
- **CDN Integration** - Global content delivery
- **Database Indexing** - Optimized query performance
- **Compression** - Gzip/Brotli compression

## 🧪 Testing Strategy

- **Unit Tests** - Jest & React Testing Library
- **Integration Tests** - API endpoint testing
- **E2E Tests** - Cypress automation
- **Performance Tests** - Lighthouse CI
- **Security Tests** - OWASP compliance
- **Load Tests** - Artillery.js stress testing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/pharande1028/HerAura.git
cd HerAura

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run development server
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨💻 Author

**Rahul Pharande**  
Full-Stack Developer  

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pharande1028)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/rahul-pharande)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rahul.pharande@example.com)

## 🙏 Acknowledgments

- Inspired by modern e-commerce platforms like GIVA and Palmonas
- Built with industry-standard tools and best practices
- Designed for scalability and real-world deployment

---

⭐ **Star this repository if you find it helpful!**

💎 **HerAura - Where everyday elegance meets anti-tarnish technology**