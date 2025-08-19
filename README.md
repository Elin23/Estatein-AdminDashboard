# Estatien Real Estate | Admin Dashboard

Welcome to the **Estatien Real Estate Admin Dashboard**, a comprehensive control panel for managing properties, users, submissions, and content. The dashboard is built with **React + Vite + TypeScript**, styled with **Tailwind CSS**, and fully integrated with **Firebase** for real-time data management.  

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Sections & Permissions](#sections--permissions)
5. [Getting Started](#getting-started)
6. [Firebase Integration](#firebase-integration)
7. [Contact](#contact)

---

## Overview

The dashboard enables administrators and authorized users to manage Estatien Real Estate’s platform efficiently. Users can oversee submissions, properties, team members, client communications, and other content, while maintaining a clear view of statistics and notifications.

---

## Features

- **Submissions Management:** Review user requests, send email replies, and mark as Reviewed, Approved, or Rejected.  
- **Properties Management:** Add, update, delete, and export property listings.  
- **User Management:** Manage user accounts and assign roles (Admin, Support, Sales).  
- **Content Management:** Update achievements, values, team members, testimonials, FAQs, and platform steps.  
- **Contact Requests:** Handle inquiries with email responses and status tracking.  
- **Dashboard Stats & Notifications:** Monitor pending submissions, available/sold properties, and receive alerts for new activities.  
- **Newsletter Simulation:** Users can subscribe and receive confirmation emails.  

> **Permissions:** Admins have full access, while managers and support roles have restricted access depending on the section.

---

## Technologies Used

- **React (with Vite)**  
- **TypeScript**  
- **Tailwind CSS**  
- **Firebase**  
- **EmailJS**  

---

## Sections & Permissions

- **Dashboard:** View statistics like pending submissions, rejected submissions, available and sold properties, with notifications. *(All users, view-only for non-admins)*  
- **Properties:** Manage property listings including add/update/delete, and export data. *(Admin & Sales Manager)*  
- **Achievements & Values:** Edit and manage company achievements and values. *(Admin only)*  
- **Our Team:** Manage team members’ data. *(Admin only)*  
- **Testimonials:** Review and manage client feedback. *(Admin only)*  
- **Submissions:** Track user requests, send email replies, and update status. *(Admin & Sales Manager)*  
- **Steps:** Manage instructional steps for platform usage or services. *(Admin only)*  
- **Valued Clients:** Manage featured clients on the platform. *(Admin only)*  
- **Contact:** Handle user messages with response options and status updates. *(Admin & Support)*  
- **Company Info:** Edit company locations, social links, and official data. *(Admin only)*  
- **User Management:** Add, remove, or edit user roles. *(Admin only)*  
- **FAQs:** Edit, add, or remove frequently asked questions. *(Admin only)*  
- **Login / Logout:** Secure authentication for accessing the dashboard. *(Based on user role)*  

---

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)  
- npm or yarn  

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Elin23/Estatein-AdminDashboard
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

### Firebase Integration

- Real-time data storage for properties, submissions, and users.

- Authentication for Admin and other roles.

- Dashboard updates automatically with Firebase listeners.

## Contact

For questions or support, please reach out at:

- **Email:** [elinshaia23@gmail.com](mailto:elinshaia23@gmail.com)