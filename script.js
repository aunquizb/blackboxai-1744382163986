// Storage keys
const USERS_KEY = 'users';
const QUIZZES_KEY = 'quizzes';
const RESULTS_KEY = 'results';

// Initialize storage if empty
if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
}
if (!localStorage.getItem(QUIZZES_KEY)) {
    localStorage.setItem(QUIZZES_KEY, JSON.stringify([]));
}
if (!localStorage.getItem(RESULTS_KEY)) {
    localStorage.setItem(RESULTS_KEY, JSON.stringify([]));
}

// Registration handling
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        // Check if username already exists
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        if (users.some(user => user.username === username)) {
            alert('Username already exists. Please choose another.');
            return;
        }

        // Add new user
        users.push({ username, password, role });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        alert('Registration successful!');
        window.location.href = 'login.html';
    });
}

// Login handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        // Verify credentials
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        const user = users.find(u => u.username === username && u.password === password && u.role === role);
        
        if (user) {
            // Store logged in user
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            // Redirect based on role
            if (role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'student-dashboard.html';
            }
        } else {
            alert('Invalid credentials or wrong role selected!');
        }
    });
}

// Quiz management functions
function createQuiz(title, duration) {
    const quizzes = JSON.parse(localStorage.getItem(QUIZZES_KEY));
    const newQuiz = {
        id: Date.now(),
        title,
        duration,
        questions: [],
        createdBy: JSON.parse(sessionStorage.getItem('currentUser')).username
    };
    quizzes.push(newQuiz);
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
    return newQuiz.id;
}

function addQuestionToQuiz(quizId, question, options, correctAnswer) {
    const quizzes = JSON.parse(localStorage.getItem(QUIZZES_KEY));
    const quiz = quizzes.find(q => q.id === quizId);
    if (quiz) {
        quiz.questions.push({
            id: Date.now(),
            question,
            options,
            correctAnswer
        });
        localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
        return true;
    }
    return false;
}

function submitQuizResult(quizId, studentUsername, answers) {
    const quizzes = JSON.parse(localStorage.getItem(QUIZZES_KEY));
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return null;

    let score = 0;
    quiz.questions.forEach((question, index) => {
        if (question.correctAnswer === answers[index]) {
            score++;
        }
    });

    const result = {
        id: Date.now(),
        quizId,
        studentUsername,
        score,
        totalQuestions: quiz.questions.length,
        timestamp: new Date().toISOString()
    };

    const results = JSON.parse(localStorage.getItem(RESULTS_KEY));
    results.push(result);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    return result;
}

function getQuizResults(quizId) {
    const results = JSON.parse(localStorage.getItem(RESULTS_KEY));
    return results.filter(r => r.quizId === quizId);
}

function getStudentResults(username) {
    const results = JSON.parse(localStorage.getItem(RESULTS_KEY));
    return results.filter(r => r.studentUsername === username);
}
