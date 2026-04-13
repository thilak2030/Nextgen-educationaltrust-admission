    const searchData = [
        { tag: "Admission", text: "How to apply online", sub: "Step-by-step process", link: "#apply" },
        { tag: "Documents", text: "Documents required for admission", sub: "Mark sheets, TC, ID proof", link: "#requirements" },
        { tag: "Dates", text: "Application deadline – March 31", sub: "2025–26 admissions", link: "#dates" },
        { tag: "Dates", text: "Entrance test date – April 12", sub: "Written assessment", link: "#dates" },
        { tag: "Fees", text: "Fee structure and charges", sub: "Tuition, admission, transport fees", link: "#fees" },
        { tag: "Programs", text: "Grade 11 Science stream", sub: "Physics, Chemistry, Maths/Biology", link: "#programs" },
        { tag: "Programs", text: "Junior school – Grades 1 to 5", sub: "Primary program", link: "#programs" },
        { tag: "Programs", text: "Commerce and Humanities streams", sub: "Grade 11–12 options", link: "#programs" },
        { tag: "FAQ", text: "Scholarships and fee concessions", sub: "Merit and need-based support", link: "#faq" },
        { tag: "FAQ", text: "Mid-year transfer admissions", sub: "Seat availability basis", link: "#faq" },
        { tag: "Contact", text: "Contact admissions office", sub: "+91 431 234 5678 · admissions@brightpath.edu.in", link: "#contact" },
        { tag: "Eligibility", text: "Eligibility criteria by grade", sub: "Minimum marks required", link: "#requirements" },
        { tag: "Dates", text: "Results announcement – May 10", sub: "Check admission status online", link: "#dates" },
        { tag: "Dates", text: "Fee payment deadline – May 31", sub: "Confirm your seat", link: "#dates" },
    ];
    function doSearch(q) {
        const r = document.getElementById('searchResults');
        if (!q || q.length < 2) { r.classList.remove('show'); return; }
        const matches = searchData.filter(d =>
            d.text.toLowerCase().includes(q.toLowerCase()) ||
            d.sub.toLowerCase().includes(q.toLowerCase()) ||
            d.tag.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 6);
        if (!matches.length) { r.classList.remove('show'); return; }
        r.innerHTML = matches.map(m => `<div class="search-item" onclick="goTo('${m.link}')"><span class="search-tag">${m.tag}</span><div><div class="search-text">${m.text}</div><div class="search-sub">${m.sub}</div></div></div>`).join('');
        r.classList.add('show');
    }
    function goTo(link) {
        document.getElementById('searchResults').classList.remove('show');
        document.getElementById('searchInput').value = '';
        document.querySelector(link)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    function triggerSearch() {
        const q = document.getElementById('searchInput').value;
        if (q) goTo('#' + q); else doSearch('');
    }
    document.addEventListener('click', e => {
        if (!e.target.closest('.search-wrap')) document.getElementById('searchResults').classList.remove('show');
    });
    function toggleFaq(btn) {
        const a = btn.nextElementSibling;
        const arrow = btn.querySelector('.arrow');
        const open = a.classList.toggle('open');
        arrow.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
    }
    function filterPrograms(cat, pill) {
        document.querySelectorAll('.tab-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        document.querySelectorAll('.program-card').forEach(c => {
            c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
        });
    }
    function submitForm(event) {
    event.preventDefault(); // 🔥 VERY IMPORTANT

    const data = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        grade: document.getElementById("grade").value,
        dob: document.getElementById("dob").value,
        parentName: document.getElementById("parentName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value
    };

    fetch("http://127.0.0.1:5000/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        alert("✅ Submitted Successfully");
    });
}
    function openMobileMenu() { document.getElementById('mobileMenu').classList.add('show'); document.body.style.overflow = 'hidden'; }
    function closeMobileMenu() { document.getElementById('mobileMenu').classList.remove('show'); document.body.style.overflow = ''; }
    document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => { closeMobileMenu(); setTimeout(() => { document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' }) }, 200); }));
    const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // frontend serve panna

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/admissionDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const StudentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  grade: String,
  dob: String,
  parentName: String,
  phone: String,
  email: String
});

const Student = mongoose.model("Student", StudentSchema);

// API route
app.post("/submit", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.send("✅ Data Saved");
  } catch (err) {
    res.status(500).send("❌ Error");
  }
});

// Server start
app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});