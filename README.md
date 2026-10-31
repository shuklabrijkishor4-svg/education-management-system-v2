# Education Website (MERN Stack, fully local)

Home page, Student Enquiry form, Contact Us page and an **Admin Panel**.
Data is saved in a **local MongoDB** database: `education_management`

| Collection | Stores |
|---|---|
| `student_enquiries` | Student Enquiry form data |
| `contact_messages` | Contact Us form data |
| `courses` | Courses shown on the website (managed in Admin Panel) |
| `admins` | Admin login (password is stored hashed with bcrypt) |

Only the first `npm install` needs the internet. After that everything runs offline.

## Project structure

```
education-website/
  backend/
    models/        Enquiry.js, Contact.js, Course.js, Admin.js
    controllers/   enquiryController.js, contactController.js, courseController.js, authController.js
    routes/        enquiryRoutes.js, contactRoutes.js, courseRoutes.js, authRoutes.js
    middleware/    authMiddleware.js   (checks the admin login token)
    seedData.js    creates the first admin + starter courses
    server.js      starts Express and connects to MongoDB
    .env           port, MongoDB address, JWT secret, first admin login
  frontend/
    src/
      components/  Navbar.jsx, Footer.jsx, ProtectedRoute.jsx
      pages/       Home.jsx, StudentEnquiry.jsx, Contact.jsx
      pages/admin/ AdminLogin, AdminLayout, AdminEnquiries, AdminMessages, AdminCourses, AdminPassword
      api.js       helper for calling the backend (adds the login token)
      csv.js       Excel/CSV export
      useCourses.js loads courses from the database
      config.js    institute name, address, phone, API address
  README.md
```

## Requirements

* Node.js (LTS version) - check with `node -v`
* MongoDB Community Server (already installed)
* VS Code

## Start MongoDB on Windows

### Option A: MongoDB runs as a Windows service (default after installation)

1. Press `Win + R`, type `services.msc`, press Enter.
2. Find **MongoDB Server (MongoDB)**. Status should be **Running**.
3. If it is not running, right-click it and choose **Start**.

Or use a terminal opened **as Administrator**:

```
sc query MongoDB
net start MongoDB
```

(`sc query MongoDB` shows `STATE : 4 RUNNING` when it is on.)

### Option B: Start MongoDB manually

Create the data folder once, then start the server. Keep this terminal open.

```
mkdir C:\data\db
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath C:\data\db
```

Change `8.0` to your installed version (look inside `C:\Program Files\MongoDB\Server\`).
When you see "Waiting for connections" on port 27017, MongoDB is ready.

### Check that MongoDB works

Open a new terminal and run:

```
mongosh
```

If it opens a prompt like `test>`, MongoDB is running. Type `exit` to leave.
(If `mongosh` is not found, install MongoDB Shell from the MongoDB download page, or use the full path to `mongosh.exe`.)

## Run the project in VS Code

1. **Open the project**: VS Code -> File -> Open Folder -> choose `education-website`.
2. **Open a terminal**: Terminal -> New Terminal.
3. **Backend** (first terminal):

```
cd backend
npm install
node server.js
```

You should see:

```
MongoDB connected: mongodb://127.0.0.1:27017/education_management
Server running at http://localhost:5000
```

4. **Frontend**: click the `+` in the terminal panel to open a second terminal:

```
cd frontend
npm install
npm run dev
```

5. **Open the website**: http://localhost:5173

Keep both terminals running while you use the site. Stop a server with `Ctrl + C`.

## API

| Method | URL | Who can use it |
|---|---|---|
| POST | /api/enquiries | Public (student form) |
| GET | /api/enquiries | Admin only |
| PATCH | /api/enquiries/:id/status | Admin only |
| DELETE | /api/enquiries/:id | Admin only |
| POST | /api/contact | Public (contact form) |
| GET | /api/contact | Admin only |
| PATCH | /api/contact/:id/read | Admin only |
| DELETE | /api/contact/:id | Admin only |
| GET | /api/courses | Public (active courses) |
| GET | /api/courses/all | Admin only |
| POST / PUT / DELETE | /api/courses, /api/courses/:id | Admin only |
| GET | /api/notices | Public (active notices) |
| GET | /api/notices/all | Admin only |
| POST / PUT / DELETE | /api/notices, /api/notices/:id | Admin only |
| POST | /api/auth/login | Public |
| PUT | /api/auth/password | Admin only |

Admin-only URLs need a login token, so opening them directly in the browser shows "Please log in first." Use the Admin Panel instead.

## Admin Panel

1. Start backend and frontend as usual (the first start creates the admin and the 6 starter courses).
2. Open **http://localhost:5173/admin/login** (or click "Admin login" in the website footer).
3. First login: username **admin**, password **admin123** (from `backend/.env`).
   (If you logged in earlier with an old build, click Logout once, or clear the site's localStorage.)
4. **Change the password right away**: Admin Panel -> Password.

What you can do:

* **Enquiries**: search, filter by course / status / date, change status (New -> Contacted -> Admitted), see full details, delete, export to Excel (CSV). The export contains the rows currently shown after filters.
* **Messages**: search, filter, mark read or unread, delete, export.
* **Notices**: write a notice (title, message, optional last date). It shows on the Home page; hide or delete it any time.
* **Courses**: add, edit, delete, or hide a course. The Home page and the enquiry form dropdown update automatically.

Notes:

* The admin account is created only when the `admins` collection is empty. Changing `ADMIN_PASSWORD` in `.env` later does not change an existing password; use the Password page.
* If you forget the password, run in mongosh: `use education_management` then `db.admins.deleteMany({})`, restart the backend, and log in with the `.env` values again.
* Change `JWT_SECRET` in `backend/.env` to your own long random text. After changing it, everyone must log in again.
* Enquiries saved before this update have no status; they show as "New" automatically.

## Customise

Open `frontend/src/config.js` and change the institute name, address, mobile, email and working hours. Courses are changed in the Admin Panel. Colours are at the top of `frontend/src/index.css`.

## Check saved data with mongosh

```
mongosh
use education_management
show collections
db.student_enquiries.find().pretty()
db.student_enquiries.countDocuments()
db.student_enquiries.find().sort({ createdAt: -1 }).limit(1)
db.contact_messages.find().pretty()
db.contact_messages.countDocuments()
db.courses.find().pretty()
db.admins.find({}, { username: 1 })
```

Delete test data if you want a clean start:

```
db.student_enquiries.deleteMany({})
db.contact_messages.deleteMany({})
```

MongoDB creates the database and collections automatically when the first record is saved, so they will not appear in `show collections` until you submit a form once.
You can also view data in **MongoDB Compass** (connect to `mongodb://127.0.0.1:27017`).

## Troubleshooting

| Problem | Fix |
|---|---|
| `Could not connect to MongoDB` | MongoDB is not running. Follow "Start MongoDB on Windows". |
| `Cannot reach the server` on the form | Backend is not running. Run `node server.js` in `backend`. |
| `EADDRINUSE: port 5000` | Another program uses port 5000. Change `PORT` in `backend/.env` and `API_BASE` in `frontend/src/config.js`. |
| CORS error in browser console | Open the site at `http://localhost:5173`, and keep `CLIENT_URL` in `backend/.env` the same. |
| `npm` or `node` not recognised | Install Node.js LTS, then restart VS Code. |
