// art.js

import { getPlayerStatus } from './funifierApi.js';

const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
const logoutBtn = document.getElementById('logout-btn');
const completedCoursesEl = document.getElementById('completed-courses');
const certificatesEarnedEl = document.getElementById('certificates-earned');
const learningHoursEl = document.getElementById('learning-hours');
const courseButtons = document.querySelectorAll('.course-card .btn-primary');

let playerData = null;

// Check if user is authenticated
function checkAuth() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.log('No authentication token found, redirecting to login page');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Logout function
function logout() {
  localStorage.removeItem('access_token');
  window.location.href = 'login.html';
}

// Load player data and progress
async function loadPlayerData() {
  // Check authentication before loading player data
  if (!checkAuth()) return;
  
  try {
    const status = await getPlayerStatus();
    if (status) {
      playerData = status;
      
      // Mock data for ART-Docebo progress
      // In a real implementation, this would come from the API
      const mockProgress = {
        completedCourses: 2,
        certificatesEarned: 1,
        learningHours: 15
      };
      
      // Update UI with progress data
      completedCoursesEl.textContent = mockProgress.completedCourses;
      certificatesEarnedEl.textContent = mockProgress.certificatesEarned;
      learningHoursEl.textContent = mockProgress.learningHours;
    } else {
      console.log('Failed to load player status, redirecting to login page');
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Error loading player data:', error);
  }
}

// Handle course button clicks
function setupCourseButtons() {
  courseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const courseCard = e.target.closest('.course-card');
      const courseTitle = courseCard.querySelector('h3').textContent;
      
      // In a real implementation, this would navigate to the course
      alert(`Starting course: ${courseTitle}`);
      console.log(`Starting course: ${courseTitle}`);
    });
  });
}

// Menu toggle functionality
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

// Add logout event listener
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

// Initialize page
loadPlayerData();
setupCourseButtons(); 