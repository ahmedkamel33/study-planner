// Store subjects in Local Storage
let subjects = JSON.parse(localStorage.getItem('subjects')) || [];

// DOM Elements
const subjectForm = document.getElementById('subjectForm');
const subjectsList = document.getElementById('subjectsList');
const totalTimeElement = document.getElementById('totalTime');

// Update subjects list display
function updateSubjectsList() {
    subjectsList.innerHTML = '';
    let totalTime = 0;

    subjects.forEach((subject, index) => {
        totalTime += parseInt(subject.time);
        
        const priorityColors = {
            'High': 'danger',
            'Medium': 'warning',
            'Low': 'info'
        };
        
        const subjectElement = document.createElement('div');
        subjectElement.className = 'subject-card';
        subjectElement.innerHTML = `
            <div class="subject-content">
                <div class="subject-header">
                    <h4>${subject.name}</h4>
                    <span class="badge bg-${priorityColors[subject.priority]}">${subject.priority}</span>
                </div>
                <div class="subject-info">
                    <div class="time-info">
                        <i class="fas fa-clock"></i> ${subject.time} minutes
                    </div>
                    <div class="actions">
                        <button class="btn btn-sm btn-outline-primary edit-btn" onclick="editSubject(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" onclick="deleteSubject(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        subjectsList.appendChild(subjectElement);
    });

    totalTimeElement.textContent = totalTime;
    localStorage.setItem('subjects', JSON.stringify(subjects));
}

// Add new subject
subjectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('subjectName').value;
    const time = document.getElementById('studyTime').value;
    const priority = document.getElementById('priority').value;

    subjects.push({
        name,
        time,
        priority
    });

    updateSubjectsList();
    subjectForm.reset();
});

// Edit subject
function editSubject(index) {
    const subject = subjects[index];
    document.getElementById('subjectName').value = subject.name;
    document.getElementById('studyTime').value = subject.time;
    document.getElementById('priority').value = subject.priority;
    
    subjects.splice(index, 1);
    updateSubjectsList();
}

// Delete subject
function deleteSubject(index) {
    if (confirm('Are you sure you want to delete this subject?')) {
        subjects.splice(index, 1);
        updateSubjectsList();
    }
}

// Load subjects on startup
updateSubjectsList();
