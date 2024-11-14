document.querySelector('button[type="submit"]').addEventListener('click', function() {
    window.location.href = 'dashboard.html';
  });

function login() {
    const username = document.getElementById("username").value;
    const location = document.getElementById("location").value;
    if (username && location) {
      // Store username and location in local storage
      localStorage.setItem("username", username);
      localStorage.setItem("location", location);
      // Redirect to dashboard
      window.location.href = "dashboard.html";
    } else {
      alert("Please enter both username and location.");
    }
  }