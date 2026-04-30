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
function toggleFaq(btn) {
    const item = btn.parentElement;
    const answer = item.querySelector(".faq-a");

    item.classList.toggle("active");

    if (item.classList.contains("active")) {
        answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
        answer.style.maxHeight = "0px";
    }
}

// 🔍 SEARCH
function doSearch(q) {
    const r = document.getElementById('searchResults');
    if (!q || q.length < 2) { r.classList.remove('show'); return; }

    const matches = searchData.filter(d =>
        d.text.toLowerCase().includes(q.toLowerCase()) ||
        d.sub.toLowerCase().includes(q.toLowerCase()) ||
        d.tag.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 6);

    if (!matches.length) { r.classList.remove('show'); return; }

    r.innerHTML = matches.map(m =>
        `<div class="search-item" onclick="goTo('${m.link}')">
            <span class="search-tag">${m.tag}</span>
            <div>
                <div class="search-text">${m.text}</div>
                <div class="search-sub">${m.sub}</div>
            </div>
        </div>`
    ).join('');

    r.classList.add('show');
}

function goTo(link) {
    document.getElementById('searchResults').classList.remove('show');
    document.getElementById('searchInput').value = '';
    document.querySelector(link)?.scrollIntoView({ behavior: 'smooth' });
}

// 📩 FORM SUBMIT (FINAL FIX)
function submitForm(event) {
    event.preventDefault();
    console.log("FORM SUBMITTED");

    const data = {
        student_name: document.getElementById("student_name").value,
        parent_name: document.getElementById("parent_name").value,
        quota: document.getElementById("quota").value,
        location: document.getElementById("location").value,
        college: document.getElementById("college").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value
    };

    console.log("DATA:", data);

    fetch("https://nextgen-educationaltrust-admission1.onrender.com/submit", {  // 🔥 LOCAL FIX
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        alert(res.message || "✅ Submitted Successfully");
        document.querySelector("form").reset();
    })
    .catch(err => {
        alert("❌ Error submitting form");
        console.error(err);
    });
}

// 📱 MOBILE MENU
function openMobileMenu() {
    document.getElementById('mobileMenu').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('show');
    document.body.style.overflow = '';
}
document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
        closeMobileMenu();
    });
});

// 🎥 VIDEO CONTROL
window.addEventListener("load", () => {
    const video = document.querySelector(".bg-video");
    if (!video) return;

    if (window.innerWidth < 500) {
        video.style.display = "none";
    }

    if (navigator.connection && navigator.connection.saveData) {
        video.style.display = "none";
    }
});
