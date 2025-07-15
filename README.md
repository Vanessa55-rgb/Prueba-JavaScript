# Event Manager SPA

Single Page Application (SPA) built in vanilla JavaScript, HTML5, and CSS3 using Bootstrap 5.  
It allows two types of users: **Administrators** and **Visitors** to manage and register for events.

---

## 👤 Author Information

- **Name:** Vanessa Gomez Lopez
- **Clan:** Berners Lee
- **Email:** vanessagomezlopez55@gmail.com
- **ID:** 1011392976

---

## 🚀 Features

### ✅ Authentication & Session

- User registration with roles: `admin` and `visitor`.
- Login with email and password.
- Session persistence via `localStorage`.

### 👮 Route Protection

- Unauthenticated users are redirected to login.
- Authenticated users can't access `/login` or `/register` again.

### 🛠 Event Management (CRUD)

- **Admins** can create, view, and delete events.
- **Visitors** can view and register for events.
- Capacity limits are respected.
- Visitors can only register once per event.

### 📦 Data Consistency

- All data is stored in a `json-server` backend:
  - Users
  - Events
  - Enrollments

---

## 📁 Folder Structure

```
event-manager-spa/
├── db.json          # JSON database for json-server
├── index.html       # Main HTML (SPA structure)
├── index.js         # Application logic
├── style.css        # Custom styles
├── Event Manager API.postman_collection.json   # POSTMAN Collection
└── README.md        # Project documentation
```


## 🧪 Requirements

- Node.js installed
- `json-server` globally installed

```bash
npm install -g json-server
```

💻 How to Run the Project
1.	Clone this repository or download the files.
2.	Start the json-server:
```bash
json-server --watch db.json
 ```
This will start the API on:
📡 http://localhost:3000/

3.	Open index.html in your browser:

•	Double-click or open with Live Server / Browser.
•	The SPA will auto-detect the user session.
•	You can register or login using the UI.

---

🧪 Test Credentials

Admin User:
	•	Email: admin@example.com
	•	Password: admin123

Visitor User:
	•	Email: visitor@example.com
	•	Password: visitor123

You can also register new users with the form.
