import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer
      className="py-5"
      style={{ background: "#f8f9fa", borderTop: "5px solid #201548" }}
    >
      <div className="container">
        <div className="row g-4">
          {/* Contact Info */}
          <motion.div
            className="col-md-4 text-center text-md-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h4
              className="fw-bold mb-4"
              style={{ color: "#201548", position: "relative" }}
            >
              Contact Us
            </h4>
            <p className="mb-2" style={{ color: "#0e0f0f" }}>
              <i className="bi bi-geo-alt me-2"></i>Lb nagar vanasthalipuram
              hyderabad 500070
            </p>
            <p className="mb-2" style={{ color: "#0e0f0f" }}>
              <i className="bi bi-telephone me-2"></i> (+91) 9777733220
            </p>
            <p className="mb-2" style={{ color: "#0e0f0f" }}>
              <i className="bi bi-envelope me-2"></i> beautybliss@gmail.com
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="col-md-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4
              className="fw-bold mb-4"
              style={{ color: "#201548", position: "relative" }}
            >
              Quick Links
            </h4>
            <div className="d-flex flex-column">
              <a
                href="/salon"
                className="mb-2 text-decoration-none"
                style={{
                  color: "#201548",
                  transition: "all 0.3s ease",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(5px)";
                  e.currentTarget.style.color = "#0e0f0f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.color = "#201548";
                }}
              >
                Salon Services
              </a>
              <a
                href="/beauty"
                className="mb-2 text-decoration-none"
                style={{
                  color: "#201548",
                  transition: "all 0.3s ease",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(5px)";
                  e.currentTarget.style.color = "#0e0f0f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.color = "#201548";
                }}
              >
                Beauty Treatments
              </a>
              <a
                href="/skincare"
                className="mb-2 text-decoration-none"
                style={{
                  color: "#201548",
                  transition: "all 0.3s ease",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(5px)";
                  e.currentTarget.style.color = "#0e0f0f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.color = "#201548";
                }}
              >
                Skincare Solutions
              </a>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            className="col-md-4 text-center text-md-end"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h4
              className="fw-bold mb-4"
              style={{ color: "#201548", position: "relative" }}
            >
              Follow Us
            </h4>
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a
                href="https://facebook.com"
                style={{
                  color: "#201548",
                  transition: "all 0.3s ease",
                }}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <i className="bi bi-facebook fs-3"></i>
              </a>
              <a
                href="https://twitter.com"
                style={{
                  color: "#201548",
                  transition: "all 0.3s ease",
                }}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <i className="bi bi-twitter fs-3"></i>
              </a>
              <a
                href="https://instagram.com"
                style={{
                  color: "#201548",
                  transition: "all 0.3s ease",
                }}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <i className="bi bi-instagram fs-3"></i>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-5" style={{ color: "#0e0f0f" }}>
          <p className="mb-0">
            ©️ {new Date().getFullYear()} BeautyBliss. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;