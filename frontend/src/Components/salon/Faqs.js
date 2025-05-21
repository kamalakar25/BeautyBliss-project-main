import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Accordion, Pagination } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';

// Utility function to format time ago with error handling
const formatTimeAgo = (date) => {
  try {
    if (!date || isNaN(new Date(date).getTime())) {
      return 'Unknown time';
    }
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Unknown time';
  }
};

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const faqsPerPage = 5; // Number of FAQs per page
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const isLoggedIn = !!email;

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/terms/faqs')
      .then((res) => setFaqs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!question.trim()) {
      setError('Question is required');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/terms/faqs',
        { question },
        { headers: { 'user-email': email } }
      );
      setFaqs([...faqs, response.data]); // Add new FAQ to the list
      setQuestion('');
      setError('');
      alert('Question submitted successfully!');
      // Reset to the first page to show the latest question if needed
      setCurrentPage(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting question');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Pagination logic
  const indexOfLastFaq = currentPage * faqsPerPage;
  const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
  const currentFaqs = faqs.slice(indexOfFirstFaq, indexOfLastFaq); // Get FAQs for the current page
  const totalPages = Math.ceil(faqs.length / faqsPerPage); // Calculate total pages

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate pagination items
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Frequently Asked Questions</h2>
      <Row>
        <Col md={8} className="mx-auto">
          {faqs.length === 0 ? (
            <p>No FAQs available.</p>
          ) : (
            <>
              <Accordion>
                {currentFaqs.map((faq, index) => (
                  <Accordion.Item eventKey={index.toString()} key={faq._id}>
                    <Accordion.Header>
                      {faq.question}{' '}
                      <small className="text-muted ms-2">
                        ({formatTimeAgo(faq.createdAt)})
                      </small>
                    </Accordion.Header>
                    <Accordion.Body>
                      {faq.answer}{' '}
                      <small className="text-muted">
                        (Answered {formatTimeAgo(faq.updatedAt)})
                      </small>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
              {/* Pagination Component */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {paginationItems}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
          <Card className="mt-4">
            <Card.Body>
              <h5>Ask a Question</h5>
              {!isLoggedIn ? (
                <div>
                  <p className="text-muted">To post a question, please log in.</p>
                  <Button variant="primary" onClick={handleLoginRedirect}>
                    Log In
                  </Button>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="question">
                    <Form.Label>Your Question</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Enter your question here"
                      disabled={!isLoggedIn}
                    />
                  </Form.Group>
                  {error && <p className="text-danger mt-2">{error}</p>}
                  <Button
                    type="submit"
                    className="mt-3"
                    style={{ backgroundColor: 'rgb(31, 21, 73)' }}
                  >
                    Submit Question
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Faq;