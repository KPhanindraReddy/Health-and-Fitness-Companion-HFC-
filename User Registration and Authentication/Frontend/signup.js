document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isAdmin = document.getElementById('isAdmin').checked;
  
    const response = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, isAdmin }),
    });
  
    const data = await response.json();
    if (response.ok) {
      alert('Signup successful!');
      window.location.href = 'login.html';
    } else {
      alert(data.message || 'Signup failed');
    }
  });