// Initialize data from LocalStorage
let members = JSON.parse(localStorage.getItem("members")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

// Elements
const memberForm = document.getElementById("memberForm");
const eventForm = document.getElementById("eventForm");
const memberTable = document.getElementById("memberTable");
const eventTable = document.getElementById("eventTable");
const eventSelect = document.getElementById("eventSelect");

// --- Member Functions ---
if (memberForm) {
    memberForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let m = {
            name: document.getElementById("name").value,
            reg: document.getElementById("reg").value,
            role: document.getElementById("role").value,
            contact: document.getElementById("contact").value
        };
        members.push(m);
        localStorage.setItem("members", JSON.stringify(members));
        displayMembers();
        this.reset();
    });
}

function displayMembers() {
    if (!memberTable) return;
    memberTable.innerHTML = "";
    members.forEach((m, i) => {
        memberTable.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.reg}</td>
            <td>${m.role}</td>
            <td>${m.contact}</td>
            <td><button class="del" onclick="delMember(${i})">Delete</button></td>
        </tr>`;
    });
}

function delMember(i) {
    members.splice(i, 1);
    localStorage.setItem("members", JSON.stringify(members));
    displayMembers();
}

// --- Event Functions ---
if (eventForm) {
    eventForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let ev = {
            name: document.getElementById("eventName").value,
            date: document.getElementById("eventDate").value,
            time: document.getElementById("eventTime").value,
            desc: document.getElementById("eventDesc").value
        };
        events.push(ev);
        localStorage.setItem("events", JSON.stringify(events));
        displayEvents();
        this.reset();
    });
}

function displayEvents() {
    if (!eventTable) return;
    eventTable.innerHTML = "";
    events.forEach(e => {
        eventTable.innerHTML += `
        <tr>
            <td>${e.name}</td>
            <td>${e.date}</td>
            <td>${e.time}</td>
            <td>${e.desc}</td>
        </tr>`;
    });
}

// --- Attendance Functions ---
function loadEventDropdown() {
    if (!eventSelect) return;
    eventSelect.innerHTML = "";
    events.forEach((e, i) => {
        eventSelect.innerHTML += `<option value="${i}">${e.name}</option>`;
    });
    loadAttendance();
}

function loadAttendance() {
    let table = document.getElementById("attendanceTable");
    if (!table || !eventSelect) return;

    let ev = eventSelect.value;
    table.innerHTML = "";
    members.forEach((m, i) => {
        // Try to get saved status for this event and member
        let savedStatus = (attendance[ev] && attendance[ev][i]) ? attendance[ev][i] : "Present";

        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>
                <select id="att-${i}" onchange="statusColor(this)">
                    <option ${savedStatus === 'Present' ? 'selected' : ''}>Present</option>
                    <option ${savedStatus === 'Absent' ? 'selected' : ''}>Absent</option>
                </select>
            </td>
        </tr>`;
    });

    // Set colors for the loaded statuses
    members.forEach((m, i) => {
        let sel = document.getElementById(`att-${i}`);
        if (sel) statusColor(sel);
    });
}

function statusColor(select) {
    if (select.value == "Absent") {
        select.style.color = "red";
        select.style.fontWeight = "bold";
    } else {
        select.style.color = "green";
        select.style.fontWeight = "bold";
    }
}

function saveAttendance() {
    let ev = eventSelect.value;
    if (ev === "" || events.length === 0) return;

    attendance[ev] = [];
    members.forEach((m, i) => {
        let status = document.getElementById(`att-${i}`).value;
        attendance[ev].push(status);
    });
    localStorage.setItem("attendance", JSON.stringify(attendance));
    showSummary();
}

function showSummary() {
    let ev = eventSelect.value;
    let data = attendance[ev] || [];
    let p = data.filter(x => x == "Present").length;
    let a = data.filter(x => x == "Absent").length;

    let summary = document.getElementById("summary");
    if (summary) {
        summary.innerHTML = `<h3>Summary</h3><p>Present: ${p}</p><p>Absent: ${a}</p>`;
    }
}

// Initial Load logic for each page
window.onload = function () {
    displayMembers();
    displayEvents();
    loadEventDropdown();
};