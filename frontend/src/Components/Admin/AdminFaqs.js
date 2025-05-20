import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, ListGroup, Accordion, ButtonGroup } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';

// Custom CSS for responsive design and button colors
const customStyles = `
  /* Button colors for section toggle */
  .section-btn {
    transition: all 0.3s ease;
  }
  .section-btn.active {
    background-color: rgb(31, 21, 73) !important; /* Green for active */
    border-color: rgb(31, 21, 73) !important;
    color: white !important;
  }
  .section-btn.inactive {
    background-color: #f8f9fa !important; /* Light gray for inactive */
    border-color: #6c757d !important;
    color: #6c757d !important;
  }

  /* Edit, Delete, Save, and Cancel button styles */
  .edit-btn, .faq-edit-btn {
    background-color: rgb(31, 21, 73) !important; /* Blue for Edit */
    border-color: rgb(31, 21, 73) !important;
    margin-right: 5px !important;
  }
  .delete-btn, .faq-delete-btn {
    background-color: transparent !important; /* Transparent background */
    border-color: #dc3545 !important; /* Red border */
    color: #dc3545 !important; /* Red text */
    margin-right: 5px !important;
  }
  .delete-btn:hover, .faq-delete-btn:hover {
    background-color: #dc3545 !important; /* Red background on hover */
    color: white !important;
  }
  .save-btn {
    background-color: rgb(31, 21, 73) !important; /* Green for Save */
    border-color: rgb(31, 21, 73) !important;
    margin-right: 5px !important;
  }
  .cancel-btn {
    background-color: #6c757d !important; /* Gray for Cancel */
    border-color: #6c757d !important;
  }

  /* Responsive design for Terms and Conditions and FAQs */
  .term-item, .faq-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }
  .term-content, .faq-content {
    flex: 1;
    min-width: 200px;
  }
  .term-actions, .faq-actions {
    display: flex;
    gap: 5px;
  }
  .term-time, .faq-time {
    color: #6c757d;
    font-size: 0.9em;
  }

  @media (max-width: 576px) {
    .term-item, .faq-item {
      flex-direction: column;
      align-items: flex-start;
    }
    .term-content, .faq-content {
      width: 100%;
    }
    .term-actions, .faq-actions {
      width: 100%;
      justify-content: flex-start;
    }
    .section-btn {
      font-size: 0.85rem;
      padding: 8px 12px;
    }
    .edit-btn, .delete-btn, .save-btn, .cancel-btn, .faq-edit-btn, .faq-delete-btn {
      width: 100%;
      margin-bottom: 5px;
    }
  }
`;

// Inject custom styles into the document
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);

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

const BASE_URL = process.env.REACT_APP_API_URL;

const AdminFaqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [pendingFaqs, setPendingFaqs] = useState([]);
  const [terms, setTerms] = useState([]);
  const [newTerm, setNewTerm] = useState('');
  const [editTermId, setEditTermId] = useState(null);
  const [editTermText, setEditTermText] = useState('');
  const [answers, setAnswers] = useState({});
  const [activeSection, setActiveSection] = useState('pending');
  const [editFaqId, setEditFaqId] = useState(null);
  const [editFaqText, setEditFaqText] = useState('');

  useEffect(() => {
    // Fetch answered FAQs
    axios
      .get(`${BASE_URL}/api/terms/faqs`)
      .then((res) => setFaqs(res.data))
      .catch((err) => console.error(err));

    // Fetch pending FAQs
    axios
      .get(`${BASE_URL}/api/terms/pending-faqs`)
      .then((res) => setPendingFaqs(res.data))
      .catch((err) => console.error(err));

    // Fetch terms
    axios
      .get(`${BASE_URL}/api/terms/terms`)
      .then((res) => setTerms(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAnswerSubmit = async (faqId) => {
    const answer = answers[faqId];
    if (!answer?.trim()) return;

    try {
      const response = await axios.put(`${BASE_URL}/api/terms/faqs/${faqId}`, { answer });
      const updatedFaq = response.data;
      setPendingFaqs(pendingFaqs.filter((faq) => faq._id !== faqId));
      setFaqs([...faqs, updatedFaq]);
      setAnswers({ ...answers, [faqId]: '' });
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  const handleAddTerm = async () => {
    if (!newTerm.trim()) return;
    try {
      const res = await axios.post(`${BASE_URL}/api/terms/terms`, { term: newTerm });
      setTerms([...terms, res.data]);
      setNewTerm('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTerm = async (termId) => {
    if (!editTermText.trim()) return;
    try {
      const res = await axios.put(`${BASE_URL}/api/terms/terms/${termId}`, { term: editTermText });
      setTerms(terms.map((term) => (term._id === termId ? res.data : term)));
      setEditTermId(null);
      setEditTermText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTerm = async (termId) => {
    try {
      await axios.delete(`${BASE_URL}/api/terms/terms/${termId}`, {
        headers: {
          'user-email': localStorage.getItem('email'),
        },
      });
      setTerms(terms.filter((term) => term._id !== termId));
      alert('Term deleted successfully');
    } catch (err) {
      console.error('Error deleting term:', err);
      alert(`Failed to delete term: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEditFaq = async (faqId) => {
    if (!editFaqText.trim()) return;
    try {
      const res = await axios.put(`${BASE_URL}/api/terms/faqs/${faqId}`, { answer: editFaqText });
      setFaqs(faqs.map((faq) => (faq._id === faqId ? res.data : faq)));
      setEditFaqId(null);
      setEditFaqText('');
    } catch (err) {
      console.error('Error editing FAQ:', err);
      alert(`Failed to edit FAQ: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteFaq = async (faqId, isPending = false) => {
    try {
      await axios.delete(`${BASE_URL}/api/terms/faqs/${faqId}`, {
        headers: {
          'user-email': localStorage.getItem('email'),
        },
      });
      if (isPending) {
        setPendingFaqs(pendingFaqs.filter((faq) => faq._id !== faqId));
      } else {
        setFaqs(faqs.filter((faq) => faq._id !== faqId));
      }
      alert('FAQ deleted successfully');
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      alert(`Failed to delete FAQ: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <Container className="my-5" style={{ marginTop: '100px' }}>
      <h2 className="text-center mb-4" style={{ marginTop: '100px' }}>Admin FAQ & Terms Management</h2>
      <ButtonGroup className="mb-4 d-flex justify-content-center flex-wrap">
        <Button
          className={`section-btn ${activeSection === 'answered' ? 'active' : 'inactive'}`}
          onClick={() => setActiveSection('answered')}
        >
          Answered FAQs
        </Button>
        <Button
          className={`section-btn ${activeSection === 'pending' ? 'active' : 'inactive'}`}
          onClick={() => setActiveSection('pending')}
        >
          User Questions
        </Button>
        <Button
          className={`section-btn ${activeSection === 'terms' ? 'active' : 'inactive'}`}
          onClick={() => setActiveSection('terms')}
        >
          Terms & Conditions
        </Button>
      </ButtonGroup>
      <Row>
        {activeSection === 'answered' && (
          <Col md={12}>
            <Card>
              <Card.Body>
                <h5>Answered FAQs</h5>
                {faqs.length === 0 ? (
                  <p>No answered FAQs.</p>
                ) : (
                  <Accordion>
                    {faqs.slice().reverse().map((faq, index) => (
                      <Accordion.Item eventKey={index.toString()} key={faq._id}>
                        <Accordion.Header>
                          {faq.question}{' '}
                          <small className="text-muted ms-2">
                            ({formatTimeAgo(faq.createdAt)})
                          </small>
                        </Accordion.Header>
                        <Accordion.Body>
                          {editFaqId === faq._id ? (
                            <Form.Group>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={editFaqText}
                                onChange={(e) => setEditFaqText(e.target.value)}
                              />
                              <div className="faq-actions mt-2">
                                <Button
                                  className="save-btn"
                                  size="sm"
                                  onClick={() => handleEditFaq(faq._id)}
                                >
                                  Save
                                </Button>
                                <Button
                                  className="cancel-btn"
                                  size="sm"
                                  onClick={() => setEditFaqId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </Form.Group>
                          ) : (
                            <div className="faq-item">
                              <div className="faq-content">
                                {faq.answer}{' '}
                                <small className="faq-time">
                                  (Answered {formatTimeAgo(faq.updatedAt)})
                                </small>
                              </div>
                              <div className="faq-actions">
                                <Button
                                  className="faq-edit-btn"
                                  size="sm"
                                  onClick={() => {
                                    setEditFaqId(faq._id);
                                    setEditFaqText(faq.answer);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  className="faq-delete-btn"
                                  size="sm"
                                  onClick={() => handleDeleteFaq(faq._id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}

        {activeSection === 'pending' && (
          <Col md={12}>
            <Card>
              <Card.Body>
                <h5>User Questions (Pending)</h5>
                {pendingFaqs.length === 0 ? (
                  <p>No pending questions.</p>
                ) : (
                  <ListGroup>
                    {pendingFaqs.map((faq) => (
                      <ListGroup.Item key={faq._id}>
                        <div className="faq-item">
                          <div className="faq-content">
                            <p>
                              {faq.question}{' '}
                              <small className="faq-time">
                                ({formatTimeAgo(faq.createdAt)})
                              </small>
                            </p>
                            <Form.Group>
                              <Form.Label>Answer</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={answers[faq._id] || ''}
                                onChange={(e) => setAnswers({ ...answers, [faq._id]: e.target.value })}
                              />
                            </Form.Group>
                          </div>
                          <div className="faq-actions">
                            <Button
                              style={{ backgroundColor: 'rgb(31, 21, 73)' }}
                              size="sm"
                              className="mt-2"
                              onClick={() => handleAnswerSubmit(faq._id)}
                            >
                              Submit Answer
                            </Button>
                            <Button
                              className="faq-delete-btn"
                              size="sm"
                              onClick={() => handleDeleteFaq(faq._id, true)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}

        {activeSection === 'terms' && (
          <Col md={12}>
            <Card>
              <Card.Body>
                <h5>Terms and Conditions</h5>
                <ListGroup>
                  {terms.map((term) => (
                    <ListGroup.Item key={term._id}>
                      {editTermId === term._id ? (
                        <Form.Group>
                          <Form.Control
                            type="text"
                            value={editTermText}
                            onChange={(e) => setEditTermText(e.target.value)}
                          />
                          <div className="term-actions mt-2">
                            <Button
                              className="save-btn"
                              size="sm"
                              onClick={() => handleEditTerm(term._id)}
                            >
                              Save
                            </Button>
                            <Button
                              className="cancel-btn"
                              size="sm"
                              onClick={() => setEditTermId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </Form.Group>
                      ) : (
                        <div className="term-item">
                          <div className="term-content">
                            {term.term}{' '}
                            <small className="term-time">
                              ({formatTimeAgo(term.createdAt)})
                            </small>
                          </div>
                          <div className="term-actions">
                            <Button
                              className="edit-btn"
                              size="sm"
                              onClick={() => {
                                setEditTermId(term._id);
                                setEditTermText(term.term);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              className="delete-btn"
                              size="sm"
                              onClick={() => handleDeleteTerm(term._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Form.Group className="mt-3">
                  <Form.Label>Add New Term</Form.Label>
                  <Form.Control
                    type="text"
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    placeholder="Enter new term"
                  />
                </Form.Group>
                <Button className="mt-2" style={{ backgroundColor: 'rgb(31, 21, 73)' }} onClick={handleAddTerm}>
                  Add Term
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default AdminFaqs;
