import React from 'react';

const ContactUs = () => {
    return (
        <div className="info-page">
            <div className="info-page-header">
                <h1>Contact Us</h1>
                <p>We're here to help you with all your painting needs.</p>
            </div>

            <div className="info-section">
                <h2>Contact Details</h2>
                <ul>
                    <li><strong>Owner:</strong> Kamal Ajmera</li>
                    <li><strong>Phone:</strong> 9837140458</li>
                    <li><strong>Email:</strong> <a href="mailto:ajmerapaintsksg@gmail.com">ajmerapaintsksg@gmail.com</a></li>
                    <li><strong>Address:</strong> M/S Ajmera Paints, Barahdwari, Bilram Gate, Kasganj, Uttar Pradesh, India</li>
                </ul>
            </div>

            <div className="info-section">
                <h2>Our Offerings</h2>
                <ul>
                    <li>Interior and Exterior Paints</li>
                    <li>Primer and Sealers</li>
                    <li>Specialty Coatings</li>
                    <li>Paint Brushes and Rollers</li>
                    <li>Color Matching Services</li>
                </ul>
            </div>

            <div className="info-section">
                <h2>Business Hours</h2>
                <ul>
                    <li><strong>Monday – Saturday:</strong> 9:00 AM – 7:00 PM</li>
                    <li><strong>Sunday:</strong> 10:00 AM – 4:00 PM</li>
                </ul>
            </div>

            <div className="info-footer">
                <p>We look forward to hearing from you and assisting with your next painting project!</p>
            </div>
        </div>
    );
};

export default ContactUs;