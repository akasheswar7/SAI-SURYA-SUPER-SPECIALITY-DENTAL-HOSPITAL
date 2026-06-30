const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static resources (CSS, JS, images, HTML) from the root folder
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/styles.css', express.static(path.join(__dirname, 'styles.css')));
app.use('/scripts.js', express.static(path.join(__dirname, 'scripts.js')));
app.use(express.static(__dirname));

// Helper for JSON Database paths
const DATA_DIR = path.join(__dirname, 'data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');

// Ensure data folder and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Mock Reviews data
const defaultReviews = [
  {
    name: "Ravi Kumar",
    rating: 5,
    text: "Sai Surya Dental Clinic provided exceptional care for my dental implant. The doctors are highly professional and explain everything clearly. Highly recommended!",
    date: "June 2026",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Siri Latha",
    rating: 5,
    text: "I was terrified of root canals, but the treatment here was completely painless! The clinic is extremely hygienic and the staff is very polite. Best dental clinic in Gajuwaka.",
    date: "May 2026",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "K. Srinivasa Rao",
    rating: 5,
    text: "Very affordable pricing compared to other premium clinics in Visakhapatnam. Dr. Surya is very experienced and did an excellent job with my crowns and bridges.",
    date: "April 2026",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Anjali Devi",
    rating: 5,
    text: "I got my invisible aligners done here. The results are amazing! The digital scanning and treatment planning were top-notch. Truly modern and advanced technology.",
    date: "March 2026",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

if (!fs.existsSync(REVIEWS_FILE)) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(defaultReviews, null, 2));
}

if (!fs.existsSync(APPOINTMENTS_FILE)) {
  fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify([], null, 2));
}

/* =========================================================================
   ROUTES TO SERVE PAGES
   ========================================================================= */

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'services.html'));
});

app.get('/testimonials', (req, res) => {
  res.sendFile(path.join(__dirname, 'testimonials.html'));
});

app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'gallery.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'faq.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

/* =========================================================================
   API ENDPOINTS
   ========================================================================= */

// Get all reviews
app.get('/api/reviews', (req, res) => {
  fs.readFile(REVIEWS_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read reviews data" });
    }
    res.json(JSON.parse(data));
  });
});

// Post a new review
app.post('/api/reviews', (req, res) => {
  const { name, rating, text } = req.body;
  if (!name || !rating || !text) {
    return res.status(400).json({ error: "Name, rating, and review text are required" });
  }

  fs.readFile(REVIEWS_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read database file" });
    }

    const reviews = JSON.parse(data);
    const avatarId = Math.floor(Math.random() * 70);
    
    // Create new review object
    const newReview = {
      name: name.trim(),
      rating: parseInt(rating, 10),
      text: text.trim(),
      date: "Just now",
      avatar: `https://i.pravatar.cc/150?img=${avatarId}`
    };

    reviews.unshift(newReview); // Add to beginning of array

    fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save review" });
      }
      res.status(201).json(newReview);
    });
  });
});

// Get all appointments (Admin panel endpoint)
app.get('/api/appointments', (req, res) => {
  fs.readFile(APPOINTMENTS_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read appointments" });
    }
    res.json(JSON.parse(data));
  });
});

// Post a new appointment
app.post('/api/appointments', (req, res) => {
  const { name, phone, email, treatment, message } = req.body;
  
  if (!name || !phone || !treatment) {
    return res.status(400).json({ error: "Name, mobile number, and treatment are required fields" });
  }

  fs.readFile(APPOINTMENTS_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read database file" });
    }

    const appointments = JSON.parse(data);
    const newAppointment = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : "",
      treatment,
      message: message ? message.trim() : "",
      dateCreated: new Date().toLocaleString()
    };

    appointments.push(newAppointment);

    fs.writeFile(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save appointment request" });
      }
      res.status(201).json(newAppointment);
    });
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Sai Surya Dental Clinic Server running on port ${PORT}`);
});
