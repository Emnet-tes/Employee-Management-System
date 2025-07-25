# Employee Management System

This is a full-stack Employee Management System designed to streamline HR processes, attendance tracking, leave management, and performance reviews for organizations. The project is built with a modern tech stack, featuring a Next.js frontend and a Sanity.io backend for content and data management.

## Features

- **User Authentication:** Secure login and signup for employees, managers, and admins.
- **Role-Based Access:** Different dashboards and permissions for Admin, Manager, and Employee roles.
- **Employee Directory:** View, add, edit, and delete employee records.
- **Attendance Tracking:** Record and view attendance for all employees.
- **Leave Management:** Apply for, approve, and track leaves.
- **Performance Reviews:** Submit and review employee performance.
- **Department & Role Management:** Organize employees by department and assign roles.
- **Notifications:** Receive important updates and alerts.
- **Schedules:** Assign and view work schedules.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Sanity.io (Headless CMS)
- **Authentication:** NextAuth.js
- **APIs:** RESTful endpoints using Next.js API routes

## Project Structure

```
employee-management-sanity/   # Sanity.io backend (schemas, config)
frontend/                    # Next.js frontend application
```

### Key Folders in `frontend/`

- `app/` - Main application pages and routes
- `component/` - Shared React components
- `lib/` - Utility libraries (e.g., authentication, Sanity client)
- `types/` - TypeScript type definitions
- `public/` - Static assets (images, icons)

### Key Folders in `employee-management-sanity/`

- `schemaTypes/` - Sanity schema definitions for employees, departments, etc.
- `static/` - Static files for Sanity Studio

## Getting Started

### Prerequisites

- Node.js (v18 or above recommended)
- npm or yarn

### Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Emnet-tes/Employee-Management-System.git
   cd Employee-Management-System
   ```

2. **Install dependencies:**

   - For the frontend:
     ```sh
     cd frontend
     npm install
     # or
     yarn install
     ```
   - For the Sanity backend:
     ```sh
     cd ../employee-management-sanity
     npm install
     # or
     yarn install
     ```

3. **Configure Environment Variables:**

   - Copy `.env.example` to `.env` in both `frontend/` and `employee-management-sanity/` and update the values as needed.

4. **Run the applications:**
   - Start the Sanity Studio:
     ```sh
     npm run dev
     ```
   - Start the Next.js frontend:
     ```sh
     npm run dev
     ```


## License

This project is licensed under the MIT License.
