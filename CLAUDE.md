# Nexus Project - AI Assistant Guidelines

## โครงสร้างและมาตรฐานของโปรเจกต์ (Clean Architecture)

โปรเจกต์นี้เขียนด้วย **NestJS** โดยยึดหลัก **Clean Code** และ **Modular Architecture** เพื่อให้ระบบสามารถบำรุงรักษาได้ง่ายและมีประสิทธิภาพสูง

### 📂 โครงสร้างโฟลเดอร์
- `src/common/`: โค้ดที่ถูกเรียกใช้จากหลายๆ โมดูล ควรอยู่ที่นี่
  - `constants/`: ไฟล์เก็บค่าคงที่ เช่น `APP_CONSTANTS` เพื่อหลีกเลี่ยง Magic Numbers/Strings
  - `filters/`: เก็บ Exception Filters เช่น `prisma-client-exception.filter.ts`
  - `interceptors/`: เก็บ Interceptors เพื่อจัดการ Response/Request เช่น `transform.interceptor.ts`
  - `interfaces/`: เก็บ TypeScript Interfaces ที่ใช้ทั่วไป เช่น `PaginatedResponse`
  - `utils/`: เก็บฟังก์ชันช่วยเหลือที่ไม่ได้ขึ้นต่อโครงสร้างหลัก เช่น `pagination.util.ts`
- `src/<module>/`: แต่ละฟีเจอร์แยกเป็นโมดูลอิสระ (เช่น `auth`, `users`, `product`) โดยภายในมี `controller`, `service`, `dto`, `entities` และทำงานผ่าน Dependency Injection

### ✍️ กฎการเขียนโค้ด (Coding Standards)
1. **ห้ามใช้ Magic Strings / Magic Numbers**: ทุกครั้งที่ต้องใช้ตัวเลขตั้งต้น (เช่น ค่า salt 10 ของ bcrypt) หรือระยะเวลาหมดอายุ (เช่น `'15m'`), ให้เรียกผ่าน `APP_CONSTANTS` หรือ Enum จาก `src/common/constants/`
2. **การคืนค่า (Response)**:
   - ใช้ `TransformInterceptor` สำหรับการครอบ data แบบปกติให้ออกมาเป็นรูปแบบ `{ status: "success", data: ... }`
   - สำหรับการทำ Pagination ให้คืนค่าในรูปแบบ `PaginatedResponse<T>` ที่มีโครงสร้างตายตัว
3. **การจัดการข้อผิดพลาด (Error Handling)**:
   - โยน Exception โดยใช้ Built-in Exceptions ของ NestJS (เช่น `NotFoundException`, `BadRequestException`)
   - สำหรับฐานข้อมูล ใช้ `PrismaClientExceptionFilter` ดักจับ Prisma Error อัตโนมัติในระดับ Global
4. **ความสะอาดของโค้ด (Cleanliness)**:
   - ห้ามมี Comment โค้ดเก่าที่ไม่ได้ใช้ (Dead code)
   - ไม่ต้องเขียน Comment อธิบายโค้ดที่ทำหน้าที่ชัดเจนอยู่แล้ว ให้ใช้การตั้งชื่อฟังก์ชันและตัวแปรที่สื่อความหมาย (Self-documenting code)
   - ใช้ Swagger Decorator (`@ApiOperation`, `@ApiTags`) ใน Controller แทนการเขียน Comment ธรรมดา

### 🛠️ เครื่องมือหลักที่ใช้
- **Framework**: NestJS
- **Database ORM**: Prisma
- **Security**: Passport, JWT, Bcrypt
- **Documentation**: Swagger (`/api-docs`)

### 🧠 สรุปสำหรับ AI / ทีมงาน
ในการพัฒนาฟีเจอร์ใหม่ ให้ตรวจสอบในโฟลเดอร์ `common` ก่อนเสมอว่ามี Utility หรือ Constant ที่สามารถนำกลับมาใช้ใหม่ได้หรือไม่ หากต้องสร้าง Helper ใหม่ที่น่าจะได้ใช้ใน Module อื่น ให้นำมาสร้างไว้ใน `common` ทันที และดูแลโค้ดให้สะอาดตามหลักการข้างต้นเสมอ
