const API_URL = "http://localhost:3000";

// Views
const loginView = document.getElementById("login-view");
const registerView = document.getElementById("register-view");
const dashboardView = document.getElementById("dashboard-view");
const notFoundView = document.getElementById("not-found-view");

// Common elements
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const createEventForm = document.getElementById("create-event-form");
const eventsBody = document.getElementById("events-body");
const adminControls = document.getElementById("admin-controls");
const userInfo = document.getElementById("user-info");

// SPA Navigation
document.getElementById("go-register").addEventListener("click", (e) => {
  e.preventDefault();
  showView("register");
});
document.getElementById("go-login").addEventListener("click", (e) => {
  e.preventDefault();
  showView("login");
});
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("session");
  showView("login");
});
document.getElementById("back-home").addEventListener("click", () => {
  const session = getSession();
  if (session) showView("dashboard");
  else showView("login");
});

// View session on load
document.addEventListener("DOMContentLoaded", () => {
  const session = getSession();
  if (session) showView("dashboard");
  else showView("login");
});

// Main function to display views
function showView(view) {
  loginView.classList.add("d-none");
  registerView.classList.add("d-none");
  dashboardView.classList.add("d-none");
  notFoundView.classList.add("d-none");

  switch (view) {
    case "login":
      loginView.classList.remove("d-none");
      break;
    case "register":
      registerView.classList.remove("d-none");
      break;
    case "dashboard":
      dashboardView.classList.remove("d-none");
      loadDashboard();
      break;
    default:
      notFoundView.classList.remove("d-none");
  }
}

// Utilities
function getSession() {
  return JSON.parse(localStorage.getItem("session"));
}
function saveSession(user) {
  localStorage.setItem("session", JSON.stringify(user));
}

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const res = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
  const users = await res.json();

  if (users.length === 1) {
    saveSession(users[0]);
    showView("dashboard");
  } else {
    alert("Invalid credentials");
  }
});

// Register
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fullName = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const role = document.getElementById("register-role").value;

  const res = await fetch(`${API_URL}/users?email=${email}`);
  const exists = await res.json();
  if (exists.length > 0) {
    alert("User already exists");
    return;
  }

  const user = { fullName, email, password, role };
  const created = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  const newUser = await created.json();
  saveSession(newUser);
  showView("dashboard");
});

// Load dashboard by role
async function loadDashboard() {
  const session = getSession();
  userInfo.textContent = `${session.fullName} (${session.role})`;

  const events = await fetch(`${API_URL}/events`).then((res) => res.json());
  const enrollments = await fetch(`${API_URL}/enrollments?userId=${session.id}`).then((res) =>
    res.json()
  );

  eventsBody.innerHTML = "";

  events.forEach((event) => {
    const row = document.createElement("tr");
    const isEnrolled = enrollments.find((en) => en.eventId === event.id);

    row.innerHTML = `
      <td>${event.name}</td>
      <td>${event.description}</td>
      <td>${event.date}</td>
      <td>${event.capacity}</td>
      <td>${event.enrolled}</td>
      <td>
        ${session.role === "admin" ? `
          <button class="btn btn-sm btn-danger me-1" onclick="deleteEvent(${event.id})">Delete</button>
        ` : `
          ${
            isEnrolled
              ? `<span class="badge text-bg-success">Registered</span>`
              : event.enrolled < event.capacity
              ? `<button class="btn btn-sm btn-primary" onclick="registerToEvent(${event.id})">Join</button>`
              : `<span class="badge text-bg-secondary">Full</span>`
          }
        `}
      </td>
    `;
    eventsBody.appendChild(row);
  });

  // Show admin controls
  if (session.role === "admin") {
    adminControls.classList.remove("d-none");
  } else {
    adminControls.classList.add("d-none");
  }
}

// Create event (admin only)
createEventForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("event-name").value.trim();
  const description = document.getElementById("event-description").value.trim();
  const capacity = parseInt(document.getElementById("event-capacity").value);
  const date = document.getElementById("event-date").value;

  const newEvent = { name, description, capacity, date, enrolled: 0 };

  await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEvent),
  });

  createEventForm.reset();
  loadDashboard();
});

// Delete event (admin only)
async function deleteEvent(id) {
  if (confirm("Are you sure you want to delete this event?")) {
    await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
    });
    loadDashboard();
  }
}

// Register visitor to event
async function registerToEvent(eventId) {
  const session = getSession();
  const eventRes = await fetch(`${API_URL}/events/${eventId}`);
  const event = await eventRes.json();

  if (event.enrolled >= event.capacity) {
    alert("This event is full");
    return;
  }

  await fetch(`${API_URL}/enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId, userId: session.id }),
  });

  // Update subscriber content
  await fetch(`${API_URL}/events/${eventId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enrolled: event.enrolled + 1 }),
  });

  loadDashboard();
}