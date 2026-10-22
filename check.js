
    const API = 'http://localhost:3001';
    let token = localStorage.getItem('token');
    let userName = localStorage.getItem('userName');
    let userEmail = localStorage.getItem('userEmail');
    let allCities = [];
    let userLat = null, userLng = null;
    let map = null;
    let lastBookingData = null;

    if (token) showApp(); else showAuth();

    function switchTab(tab) {
      document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
      document.getElementById('signupForm').classList.toggle('hidden', tab !== 'signup');
      document.getElementById('browseForm').classList.toggle('hidden', tab !== 'browse');
    }

    // Service Details Modal
    async function showServiceDetails(serviceId, serviceName) {
      try {
        // Fetch reviews and ratings
        const reviewRes = await fetch(`${API}/reviews/${serviceId}`);
        const reviewData = await reviewRes.json();
        console.log('Review data:', reviewData);
        
        const reviewsHTML = (reviewData.reviews || []).map(r => `
          <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
            <strong>${r.name}</strong> - ⭐ ${r.rating}/5
            <p style="margin: 5px 0; font-size: 0.9em;">${r.review_text}</p>
          </div>
        `).join('');
        
        const modal = document.createElement('div');
        modal.style.cssText = `
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
          background: rgba(0,0,0,0.7); display: flex; align-items: center; 
          justify-content: center; z-index: 1000;
        `;
        
        const closeModal = () => modal.remove();
        
        modal.innerHTML = `
          <div style="background: white; border-radius: 15px; padding: 30px; max-width: 600px; max-height: 80vh; overflow-y: auto; width: 90%;">
            <h2>${serviceName}</h2>
            <div style="display: flex; gap: 10px; margin: 15px 0;">
              <span style="background: #667eea; color: white; padding: 5px 10px; border-radius: 5px;">⭐ ${(reviewData.average_rating || 0).toFixed(1)}/5</span>
              <span style="background: #28a745; color: white; padding: 5px 10px; border-radius: 5px;">${reviewData.total_reviews || 0} Reviews</span>
            </div>
            <h3 style="color: #667eea; margin-top: 20px; margin-bottom: 10px;">⭐ Reviews</h3>
            <div style="max-height: 200px; overflow-y: auto; margin-bottom: 20px;">${reviewsHTML || '<p>No reviews yet</p>'}</div>
            <h3 style="color: #667eea; margin-top: 20px; margin-bottom: 10px;">✍️ Leave a Review</h3>
            <div>
              <label>Rating (1-5):</label>
              <input type="number" id="ratingInput" min="1" max="5" style="width: 100%; padding: 8px; margin-bottom: 10px; box-sizing: border-box;">
              <label>Review:</label>
              <textarea id="reviewInput" placeholder="Share your experience..." style="width: 100%; padding: 8px; margin-bottom: 10px; height: 80px; box-sizing: border-box;"></textarea>
              <button onclick="submitReview('${serviceId}')" style="background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; width: 100%;">Submit Review</button>
            </div>
            <button onclick="document.getElementById('serviceModal').remove()" style="width: 100%; margin-top: 20px; background: #ccc; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Close</button>
          </div>
        `;
        modal.id = 'serviceModal';
        modal.onclick = (e) => { if (e.target === modal) closeModal(); };
        document.body.appendChild(modal);
      } catch (err) {
        console.error('Error loading service details:', err);
        alert('Error loading service details. Please try again.');
      }
    }
    
    async function submitReview(serviceId) {
      const rating = document.getElementById('ratingInput').value;
      const review_text = document.getElementById('reviewInput').value;
      
      if (!rating || !review_text) {
        alert('Please fill in all fields');
        return;
      }
      
      try {
        const res = await fetch(`${API}/reviews`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ service_id: serviceId, rating: parseInt(rating), review_text })
        });
        
        const data = await res.json();
        if (res.ok) {
          alert('Review submitted successfully!');
          document.getElementById('serviceModal').remove();
        } else {
          alert('Error: ' + (data.error || 'Failed to submit review. Please try again.'));
          console.error('Review error:', data);
        }
      } catch (err) {
        alert('Error: ' + err.message);
        console.error('Review submission error:', err);
      }
    }
    
    function viewServiceDetails() {
      const serviceSelect = document.getElementById('service');
      if (!serviceSelect.value || serviceSelect.value === '') {
        alert('Please select a service first');
        return;
      }
      
      const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
      const serviceName = selectedOption.text.split(' - ')[0].replace(/[🟢🔴🟡]/g, '').trim();
      showServiceDetails(serviceSelect.value, serviceName);
    }

    function showAuth() {
      document.getElementById('authSection').classList.remove('hidden');
      document.getElementById('appSection').classList.add('hidden');
    }

    function showApp() {
      document.getElementById('authSection').classList.add('hidden');
      document.getElementById('appSection').classList.remove('hidden');
      document.getElementById('dashboardBtn').style.display = 'inline-block';
      document.getElementById('userName').textContent = userName || 'User';
      const isOwner = userEmail === 'owner.paul@bookhub.app';
      document.getElementById('sensitiveSection').style.display = isOwner ? 'block' : 'none';
      loadCities();
      loadServices();
      loadEarnings();
      loadPaymentHistory();
      loadBookings();
      setInterval(loadBookings, 5000);
    }

    async function login() {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const errorDiv = document.getElementById('authError');

      try {
        const res = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (!res.ok) {
          errorDiv.textContent = data.error || 'Login failed';
          errorDiv.classList.remove('hidden');
          return;
        }

        token = data.token;
        userName = data.name;
        userEmail = email;
        localStorage.setItem('token', token);
        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', email);
        showApp();
      } catch (err) {
        errorDiv.textContent = 'Error: ' + err.message;
        errorDiv.classList.remove('hidden');
      }
    }

    async function signup() {
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const errorDiv = document.getElementById('authError');

      try {
        const res = await fetch(`${API}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        
        if (!res.ok) {
          errorDiv.textContent = data.error || 'Signup failed';
          errorDiv.classList.remove('hidden');
          return;
        }

        token = data.token;
        userName = name;
        userEmail = email;
        localStorage.setItem('token', token);
        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', email);
        if (data.firstTime) showWelcomeModal(name);
        showApp();
      } catch (err) {
        errorDiv.textContent = 'Error: ' + err.message;
        errorDiv.classList.remove('hidden');
      }
    }

    function showWelcomeModal(userName) {
      const modal = document.createElement('div');
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1001;';
      modal.innerHTML = `
        <div style="background: white; border-radius: 15px; padding: 40px; max-width: 500px; text-align: center; animation: slideIn 0.5s ease;">
          <div style="font-size: 3em; margin-bottom: 20px;">🎉</div>
          <h2 style="color: #667eea; margin-bottom: 15px;">Welcome to BookHub, ${userName}!</h2>
          <p style="color: #666; font-size: 1.1em; margin-bottom: 20px; line-height: 1.6;">
            You're all set! Start exploring amazing services in your city. Browse, book, and enjoy premium experiences.
          </p>
          <div style="background: #f0f4ff; padding: 15px; border-radius: 10px; margin-bottom: 25px;">
            <p style="color: #667eea; font-weight: bold; margin: 0;">✨ Quick Tips:</p>
            <ul style="color: #666; text-align: left; margin: 10px 0 0 0; padding: 0 0 0 20px;">
              <li>Select your country and city to filter services</li>
              <li>Click on any service to see reviews and details</li>
              <li>Book your first service to get started!</li>
            </ul>
          </div>
          <button onclick="this.closest('div').parentElement.remove()" style="background: #667eea; color: white; border: none; padding: 12px 30px; font-size: 1em; border-radius: 5px; cursor: pointer; font-weight: bold;">Let's Explore! 🚀</button>
        </div>
        <style>@keyframes slideIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }</style>
      `;
      document.body.appendChild(modal);
    }
    
    function logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      token = null;
      showAuth();
    }

    async function loadCities() {
      try {
        const res = await fetch(`${API}/cities`);
        allCities = await res.json();
        
        const countrySelect = document.getElementById('country');
        const countries = [...new Set(allCities.map(c => c.country))].sort();
        
        let countryOptions = '<option value="">Select country</option>';
        countries.forEach(country => {
          countryOptions += `<option value="${country}">${country}</option>`;
        });
        countrySelect.innerHTML = countryOptions;
      } catch (err) {
        console.error('Error loading cities:', err);
      }
    }

    function loadCitiesByCountry() {
      const selectedCountry = document.getElementById('country').value;
      const citySelect = document.getElementById('city');
      
      let selectOptions = '<option>Select a city</option>';
      
      if (selectedCountry) {
        const filteredCities = allCities.filter(c => c.country === selectedCountry).sort((a, b) => a.name.localeCompare(b.name));
        filteredCities.forEach(c => {
          selectOptions += `<option value="${c.name}">${c.name}</option>`;
        });
        loadServicesByLocation(selectedCountry, '');
      }
      
      citySelect.innerHTML = selectOptions;
    }
    
    async function loadServicesByLocation(country, city) {
      try {
        const url = city ? `${API}/services-by-location?country=${country}&city=${city}` : `${API}/services-by-location?country=${country}`;
        const res = await fetch(url);
        const services = await res.json();
        const serviceSelect = document.getElementById('service');
        
        let selectOptions = '<option>Select a service</option>';
        if (services && services.length > 0) {
          services.forEach(s => {
            const availability = s.availability_status === 'available' ? '🟢' : s.availability_status === 'unavailable' ? '🔴' : '🟡';
            selectOptions += `<option value="${s.id}" title="${s.description}">${availability} ${s.name} - $${s.price}</option>`;
          });
        } else {
          // If no services found, load all services as fallback
          const allRes = await fetch(`${API}/services`);
          const allServices = await allRes.json();
          allServices.forEach(s => {
            selectOptions += `<option value="${s.id}" title="${s.description}">📦 ${s.name} - $${s.price}</option>`;
          });
        }
        serviceSelect.innerHTML = selectOptions;
        serviceSelect.style.display = 'block'; // Make sure it's visible
      } catch (err) {
        console.error('Error loading services:', err);
        // Load all services as fallback on error
        try {
          const res = await fetch(`${API}/services`);
          const services = await res.json();
          const serviceSelect = document.getElementById('service');
          let selectOptions = '<option>Select a service</option>';
          services.forEach(s => {
            selectOptions += `<option value="${s.id}">${s.name} - $${s.price}</option>`;
          });
          serviceSelect.innerHTML = selectOptions;
          serviceSelect.style.display = 'block';
        } catch (e) {
          console.error('Fallback error:', e);
        }
      }
    }

    async function loadServices() {
      try {
        const res = await fetch(`${API}/services`);
        const services = await res.json();
        const serviceSelect = document.getElementById('service');
        
        let selectOptions = '<option>Select a service</option>';
        services.forEach(s => {
          selectOptions += `<option value="${s.id}">${s.name} - $${s.price}</option>`;
        });
        serviceSelect.innerHTML = selectOptions;
      } catch (err) {
        console.error('Error loading services:', err);
      }
    }

    async function createBooking() {
      const service_id = document.getElementById('service').value;
      const booking_date = document.getElementById('date').value;
      const booking_time = document.getElementById('time').value;
      const address = document.getElementById('address').value;
      const city = document.getElementById('city').value;

      if (!service_id || !booking_date || !booking_time || !address || !city) {
        alert('Please fill all fields');
        return;
      }

      try {
        const res = await fetch(`${API}/bookings`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ service_id, booking_date, booking_time, address, city, latitude: userLat, longitude: userLng })
        });
        
        if (res.ok) {
          const data = await res.json();
          lastBookingData = data;
          document.getElementById('paymentMethodContainer').style.display = 'block';
          renderPayPalButton(data.id, data.totalPaid || data.price);
          alert('Booking created! Now pay with PayPal');
        } else {
          const data = await res.json();
          alert('Error: ' + (data.error || 'Booking failed'));
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }

    function renderPayPalButton(bookingId, amount) {
      if (window.paypal) {
        document.getElementById('paypal-button-container').innerHTML = '';
        paypal.Buttons({
          createOrder: async (data, actions) => {
            try {
              const res = await fetch(`${API}/payments/paypal/create-order`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_id: bookingId, amount: parseFloat(amount) })
              });
              const orderData = await res.json();
              console.log('Order created:', orderData);
              if (!orderData.id) {
                throw new Error('No order ID returned: ' + JSON.stringify(orderData));
              }
              return orderData.id;
            } catch (err) {
              console.error('Create order error:', err);
              throw err;
            }
          },
          onApprove: async (data, actions) => {
            try {
              const res = await fetch(`${API}/payments/paypal/capture-order`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: data.orderID, booking_id: bookingId })
              });
              const result = await res.json();
              if (result.status === 'COMPLETED') {
                alert('Payment successful!');
                document.getElementById('paypalContainer').style.display = 'none';
                document.getElementById('date').value = '';
                document.getElementById('time').value = '';
                document.getElementById('address').value = '';
                document.getElementById('city').value = '';
                document.getElementById('service').value = '';
                loadBookings();
              }
            } catch (err) {
              console.error('Capture order error:', err);
              alert('Capture error: ' + err.message);
            }
          },
          onError: (err) => {
            console.error('PayPal error:', err);
            alert('Payment error: ' + err.message);
          }
        }).render('#paypal-button-container');
      }
    }

    async function loadBookings() {
      try {
        const res = await fetch(`${API}/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const bookings = await res.json();
        const bookingsList = document.getElementById('bookingsList');
        
        if (!bookings || bookings.length === 0) {
          if (bookingsList) bookingsList.innerHTML = '<p>No bookings yet</p>';
        } else {
          if (bookingsList) {
            bookingsList.innerHTML = bookings.map(b => `
              <div class="card">
                <h4>${b.name}</h4>
                <p>📍 ${b.address}, ${b.city}</p>
                <p>📅 ${b.booking_date} at ${b.booking_time}</p>
                <p>💰 $${b.price}</p>
                <p>Status: <strong style="color: ${b.status === 'pending' ? '#ffc107' : b.status === 'confirmed' ? '#28a745' : '#dc3545'};">${b.status.toUpperCase()}</strong></p>
                <button onclick="cancelBooking('${b.id}')" style="background: #dc3545;">Cancel</button>
              </div>
            `).join('');
          }
        }
        await loadEarnings();
      } catch (err) {
        console.error('Error loading bookings:', err);
      }
    }

    async function loadEarnings() {
      try {
        const res = await fetch(`${API}/earnings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const earnings = await res.json();
        
        const totalCommission = parseFloat(earnings.total_commission || 0);
        const totalBookings = earnings.total_bookings || 0;
        const baseRevenue = totalCommission / 0.20;
        
        // Load user's own stats
        const userStatsRes = await fetch(`${API}/user-stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userStats = await userStatsRes.json();
        const userTotalBookings = userStats.total_bookings || 0;
        
        document.getElementById('totalEarnings').textContent = `$${totalCommission.toFixed(2)}`;
        document.getElementById('totalBookings').textContent = userTotalBookings;
        document.getElementById('baseRevenue').textContent = `$${baseRevenue.toFixed(2)}`;
        document.getElementById('commissionRevenue').textContent = `$${totalCommission.toFixed(2)}`;
        document.getElementById('totalRevenue').textContent = `$${(baseRevenue + totalCommission).toFixed(2)}`;
      } catch (err) {
        console.error('Error loading earnings:', err);
      }
    }

    async function loadPaymentHistory() {
      try {
        const res = await fetch(`${API}/payment-history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const payments = await res.json();
        const tbody = document.getElementById('ordersTableBody');
        
        if (!payments || payments.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No payments yet</td></tr>';
          return;
        }
        
        tbody.innerHTML = payments.map(p => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px;">${p.service_name}</td>
            <td style="padding: 12px; text-align: center;">${p.city}</td>
            <td style="padding: 12px; text-align: center;">${new Date(p.booking_date).toLocaleDateString()}</td>
            <td style="padding: 12px; text-align: center;">$${parseFloat(p.total_paid).toFixed(2)}</td>
            <td style="padding: 12px; text-align: center; color: #28a745; font-weight: bold;">$${parseFloat(p.commission).toFixed(2)}</td>
            <td style="padding: 12px; text-align: center;">
              <span style="background: ${p.payment_status === 'completed' ? '#28a745' : p.payment_status === 'refunded' ? '#dc3545' : '#ffc107'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; font-weight: bold;">
                ${p.payment_status.toUpperCase()}
              </span>
              ${p.payment_status === 'completed' ? `<button onclick="refundPayment('${p.id}', ${p.total_paid})" style="margin-left: 10px; padding: 4px 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em;">Refund</button>` : ''}
            </td>
          </tr>
        `).join('');
      } catch (err) {
        console.error('Error loading payment history:', err);
      }
    }

    async function cancelBooking(bookingId) {
      if (!confirm('Cancel this booking?')) return;
      
      try {
        const res = await fetch(`${API}/bookings/${bookingId}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'cancelled' })
        });
        
        if (res.ok) {
          alert('Booking cancelled');
          loadBookings();
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }

    async function refundPayment(paymentId) {
      const refundAmount = prompt('Enter refund amount (leave blank for full refund):');
      if (refundAmount === null) return;
      
      const reason = prompt('Reason for refund:');
      if (reason === null) return;
      
      try {
        const res = await fetch(`${API}/payments/${paymentId}/request-refund`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ refundAmount: refundAmount || null, reason })
        });
        
        const data = await res.json();
        
        if (res.ok) {
          alert('Refund request submitted! Our admin team will review and process it within 24-48 hours.');
          loadPaymentHistory();
        } else {
          alert('Error: ' + (data.error || 'Refund request failed'));
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }

    async function loadSubscriptionPlans() {}
    async function loadCurrentSubscription() {}
    async function upgradePlan(planId) {}

    function switchPage(page) {
      document.getElementById('bookingSection').classList.toggle('hidden', page !== 'bookings');
      document.getElementById('dashboardSection').classList.toggle('hidden', page !== 'dashboard');
      if (page === 'dashboard') {
        loadEarnings();
      }
    }

    function getLocation() {
      if (!navigator.geolocation) {
        alert('Geolocation not supported');
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        function(position) {
          userLat = position.coords.latitude;
          userLng = position.coords.longitude;
          document.getElementById('locationInfo').style.display = 'block';
          document.getElementById('locationCoords').textContent = userLat.toFixed(4) + ', ' + userLng.toFixed(4);
          initMap();
        },
        function(error) {
          alert('Location access denied: ' + error.message);
        }
      );
    }

    function initMap() {
      if (!document.getElementById('map')) return;
      if (map) map.remove();
      map = L.map('map').setView([userLat, userLng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19
      }).addTo(map);
      L.marker([userLat, userLng]).addTo(map).bindPopup('📍 Your Location').openPopup();
      
      // Click on map to set address
      map.on('click', async function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        try {
          // Use Nominatim for reverse geocoding (free, no API key)
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          
          if (data.address) {
            const address = data.address.road || data.address.village || data.address.town || data.address.city || data.display_name;
            document.getElementById('address').value = address;
            
            // Add marker at clicked location
            L.marker([lat, lng]).addTo(map).bindPopup('📍 Selected: ' + address).openPopup();
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err);
        }
      });
    }
  
