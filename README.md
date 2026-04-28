# Nexus Project

## การเริ่มต้นใช้งาน (Getting Started)

## 1. ติดตั้ง Tooling และสร้างโปรเจกต์

```bash
# ติดตั้ง pnpm (หากยังไม่มี)
npm install -g pnpm

# ติดตั้ง NestJS CLI
npm i -g @nestjs/cli

# สร้างโปรเจกต์ใหม่
nest new nexus-backend
```

## 2. การรันเซิร์ฟเวอร์

```bash
# พัฒนาในโหมด Watch mode
pnpm start:dev
```

## โครงสร้าง Project

```Plaintext
src/
├── auth/ # 🔐 ระบบ Login / JWT
├── users/ # 👤 ระบบจัดการโปรไฟล์ผู้ใช้
├── common/ # ⚙️ สิ่งที่ใช้ร่วมกัน (Interceptors, Guards, DTOs)
├── app.module.ts # 🧩 ศูนย์รวม Module ทั้งหมด
└── main.dart # 🚀 จุดเริ่มรัน Server
```

## การติดตั้ง Dependencies เพิ่มเติม

🔐 ระบบ Authentication & Security

```bash
pnpm install @nestjs/jwt passport-jwt @nestjs/passport passport bcrypt
pnpm install -D @types/passport-jwt @types/bcrypt

```

ระบบ Seed ฐานข้อมูล Default

```bash
pnpm add -D ts-node

```

🗄️ ระบบฐานข้อมูล (PostgreSQL & Prisma)

```bash
# ติดตั้ง Prisma
pnpm add prisma --save-dev
pnpm add @prisma/client

# Initialize Prisma
npx prisma init
```

⚙️ การจัดการ Configuration (.env)

```bash
pnpm add @nestjs/config dotenv
pnpm add -D @types/node
```

การจัดการ Type

```bash
pnpm i @nestjs/mapped-types
```

## 🛠️ Project Initialization (NestJS Generators)

ใช้คำสั่งเหล่านี้เพื่อสร้าง Module, Controller และ Service สำหรับระบบ Authentication และ Users:

### Authentication Module

| Task                    | Command                         |
| :---------------------- | :------------------------------ |
| **Generate Module**     | `nest generate module auth`     |
| **Generate Controller** | `nest generate controller auth` |
| **Generate Service**    | `nest generate service auth`    |

### Users Module

| Task                 | Command                       |
| :------------------- | :---------------------------- |
| **Generate Module**  | `nest generate module users`  |
| **Generate Service** | `nest generate service users` |

---

### Quick Copy-Paste (Terminal)

```bash
# Auth Setup
nest g mo auth
nest g co auth
nest g s auth

# Users Setup
nest g mo users
nest g s users
```

## 🗄️ Database & Migrations

### 🗄️ Scripts สำหรับ package.json

```json
"scripts": {
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev --name",
  "prisma:push": "prisma db push",
  "prisma:studio": "prisma studio"
}
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

### คำสั่ง Migration:

| Task                          | Command                      |
| :---------------------------- | :--------------------------- |
| **Apply Changes (Dev)**       | `pnpm prisma:migrate <name>` |
| **Sync DB (Production/Fast)** | `pnpm prisma:push`           |
| **Open DB UI**                | `pnpm prisma:studio`         |
| **Regenerate Client**         | `pnpm prisma:generate`       |

---

**เมื่อเเก้ไขไฟล์ Schema**

```bash
# ตัวอย่าง
# 1. เมื่อแก้ไข schema แล้วต้องการบันทึกเป็น Migration (ใช้บ่อยใน Dev)
pnpm prisma:migrate init_db

# 2. ในกรณีที่อยากอัปเดต DB ทันทีโดยไม่สร้างไฟล์ Migration (รวดเร็ว)
pnpm prisma:push

# 3. ดูข้อมูลในฐานข้อมูลผ่านหน้าเว็บ (สวยงามและจัดการง่าย)
pnpm prisma:studio
```

## รันโปรเจคใหม่

```bash
# หลังจาก clone โปรเจกต์มาใหม่
pnpm install
# สั่งให้ Prisma ทำการสร้างตารางให้ตรงกับ schema.prisma ที่มีอยู่
npx prisma migrate dev --name initial_setup

npx prisma generate

# สั่งให้ Prisma สร้างฐานข้อมูล Default
npx prisma db seed
```

## เพิ่มเติม

```bash
# สั่งให้ Prisma ลบฐานข้อมูล
npx prisma migrate reset
```

## 🔑 Environment Variables (.env)

อย่าลืมตั้งค่าไฟล์ `.env`
