// Initialize subjects array from localStorage or empty array
let subjects = JSON.parse(localStorage.getItem('subjects')) || [];

// DOM Elements
const subjectForm = document.getElementById('subjectForm');
const subjectsList = document.getElementById('subjectsList');
const totalTimeElement = document.getElementById('totalTime');
const totalSubjectsElement = document.getElementById('totalSubjects');
const modalTotalTime = document.getElementById('modalTotalTime');
const highPriorityCount = document.getElementById('highPriorityCount');
const mediumPriorityCount = document.getElementById('mediumPriorityCount');
const lowPriorityCount = document.getElementById('lowPriorityCount');

// Update statistics
function updateStats() {
    const totalTime = subjects.reduce((total, subject) => total + parseInt(subject.time), 0);
    const high = subjects.filter(subject => subject.priority === 'High').length;
    const medium = subjects.filter(subject => subject.priority === 'Medium').length;
    const low = subjects.filter(subject => subject.priority === 'Low').length;

    totalTimeElement.textContent = totalTime;
    totalSubjectsElement.textContent = subjects.length;
    modalTotalTime.textContent = totalTime;
    highPriorityCount.textContent = high;
    mediumPriorityCount.textContent = medium;
    lowPriorityCount.textContent = low;
}

// Save subjects to localStorage
function saveSubjects() {
    localStorage.setItem('subjects', JSON.stringify(subjects));
    updateStats();
}

// Add new subject
subjectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('subjectName').value;
    const time = document.getElementById('studyTime').value;
    const priority = document.getElementById('priority').value;
    
    subjects.push({ name, time, priority });
    saveSubjects();
    displaySubjects();
    subjectForm.reset();

    // Show success message
    showToast('Subject added successfully!');
});

// Display subjects
function displaySubjects(filterPriority = 'all') {
    subjectsList.innerHTML = '';
    
    let filteredSubjects = subjects;
    if (filterPriority !== 'all') {
        filteredSubjects = subjects.filter(subject => 
            subject.priority.toLowerCase() === filterPriority.toLowerCase()
        );
    }
    
    filteredSubjects.forEach((subject, index) => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        
        const priorityClass = `priority-${subject.priority.toLowerCase()}`;
        
        card.innerHTML = `
            <div class="subject-header">
                <h4 class="subject-name">${subject.name}</h4>
                <span class="priority-badge ${priorityClass}">${subject.priority}</span>
            </div>
            <div class="subject-time">
                <i class="fas fa-clock"></i> ${subject.time} minutes
            </div>
            <div class="mt-3">
                <button class="btn btn-sm btn-danger" onclick="deleteSubject(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
                <button class="btn btn-sm btn-primary" onclick="editSubject(${index})">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
        `;
        
        subjectsList.appendChild(card);
    });
}

// Delete subject
function deleteSubject(index) {
    if (confirm('Are you sure you want to delete this subject?')) {
        subjects.splice(index, 1);
        saveSubjects();
        displaySubjects();
        showToast('Subject deleted successfully!');
    }
}

// Edit subject
function editSubject(index) {
    const subject = subjects[index];
    const newName = prompt('Enter new subject name:', subject.name);
    const newTime = prompt('Enter new study time (minutes):', subject.time);
    const newPriority = prompt('Enter new priority (High/Medium/Low):', subject.priority);
    
    if (newName && newTime && newPriority) {
        subjects[index] = {
            name: newName,
            time: parseInt(newTime),
            priority: newPriority
        };
        saveSubjects();
        displaySubjects();
        showToast('Subject updated successfully!');
    }
}

// Filter subjects
function filterSubjects(priority) {
    displaySubjects(priority);
}

// Copy InstaPay account
function copyInstaPay() {
    const instapayAccount = document.getElementById('instapayAccount');
    navigator.clipboard.writeText(instapayAccount.textContent)
        .then(() => showToast('InstaPay account copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
}

// Show toast notification
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    // Add toast to document
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast styles
const style = document.createElement('style');
style.textContent = `
    .toast-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4a90e2;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .toast-notification.show {
        transform: translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Initial display
displaySubjects();
updateStats();
