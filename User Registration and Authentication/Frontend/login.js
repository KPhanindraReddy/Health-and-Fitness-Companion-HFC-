document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      if (data.isAdmin) {
        const otp = prompt('Enter OTP for admin verification:');
        const otpResponse = await fetch('http://localhost:3000/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: otp }),
        });
        const otpData = await otpResponse.json();
        if (otpResponse.ok) {
          alert('Admin login successful!');
          window.location.href = 'dashboard.html';
        } else {
          alert(otpData.message || 'OTP verification failed');
        }
      } else {
        alert('Login successful!');
        window.location.href = 'dashboard.html';
      }
    } else {
      alert(data.message || 'Login failed');
    }
  });