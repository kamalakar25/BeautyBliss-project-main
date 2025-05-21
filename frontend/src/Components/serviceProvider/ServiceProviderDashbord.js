import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import './AddEmployee.css';

const BASE_URL = process.env.REACT_APP_API_URL;

const SuccessMessage = ({ message, onClose, screenWidth }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isAddService = message.toLowerCase().includes('added');
  const isMobile = screenWidth <= 768;

  return createPortal(
    <>
      <div className="backdrop" />
      <div className={`success-modal ${isAddService ? 'add' : 'update'}`}>
        <div className="success-content">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`particle ${isAddService ? 'add-particle' : 'update-particle'}`}
              style={{ '--angle': `${Math.random() * 360}deg` }}
            />
          ))}
          <div className={`success-icon ${isAddService ? 'add-icon' : 'update-icon'}`}>
            <div className="inner-circle" />
            <div className="tick-container">
              <div className="tick-short" />
              <div className="tick-long" />
            </div>
          </div>
          <h4 className="success-title">{message}</h4>
          <p className="success-text">Success!</p>
        </div>
        <div className="success-footer">
          <button className="success-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

const AdminPage = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 4;
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [_id, set_Id] = useState(null);
  const [showTooltip, setShowTooltip] = useState({});
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [showDustbin, setShowDustbin] = useState(false);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    salary: '',
    experience: ''
  });
  const svgIconRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (showDeleteModal || showSuccess) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showDeleteModal, showSuccess]);

  useEffect(() => {
    return () => {
      setShowDeleteModal(false);
      setShowDustbin(false);
      setDeletingEmployeeId(null);
      setShowSuccess(false);
    };
  }, []);

  const fetchEmployees = async () => {
    const email = localStorage.getItem('email');
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/get-manpower/${email}`);
      setEmployees(response.data.reverse());
    } catch (error) {
      // console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const name = String(formData.name || '').trim();
    if (!name) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(name)) {
      newErrors.name = 'Name must be 2-50 characters long and contain only letters and spaces';
      isValid = false;
    }

    const phone = String(formData.phone || '').trim();
    if (!phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits and start with 6, 7, 8, or 9';
      isValid = false;
    }

    const salaryStr = String(formData.salary || '').trim();
    if (!salaryStr) {
      newErrors.salary = 'Salary is required';
      isValid = false;
    } else {
      const salaryNum = parseFloat(salaryStr);
      if (isNaN(salaryNum) || salaryNum < 1000 || salaryNum > 1000000) {
        newErrors.salary = 'Salary must be a number between 1000 and 1000000';
        isValid = false;
      }
    }

    const experience = String(formData.experience || '').trim();
    if (!experience) {
      newErrors.experience = 'Experience is required';
      isValid = false;
    } else if (experience.length < 1 || experience.length > 100) {
      newErrors.experience = 'Experience must be 1-100 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const email = localStorage.getItem('email');
    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/api/admin/update-manpower/${_id}`, {
          name: formData.name,
          phone: formData.phone,
          salary: parseFloat(formData.salary),
          experience: formData.experience
        });
        setSuccessMessage('Employee Updated');
        setShowSuccess(true);
        fetchEmployees();
        setIsEditing(false);
        setEditIndex(null);
      } else {
        await axios.post(`${BASE_URL}/api/admin/add-manpower/${email}`, {
          name: formData.name,
          phone: formData.phone,
          salary: parseFloat(formData.salary),
          experience: formData.experience
        });
        setSuccessMessage('Employee Added');
        setShowSuccess(true);
        fetchEmployees();
      }

      setFormData({ name: '', phone: '', salary: '', experience: '' });
      setErrors({});
      setShowForm(false);
      setCurrentPage(1);
    } catch (error) {
      setErrors({ general: 'Failed to submit employee data. Please try again.' });
    }
  };

  const handleEdit = (index) => {
    const globalIndex = (currentPage - 1) * employeesPerPage + index;
    set_Id(employees[globalIndex]._id);
    setFormData({
      name: String(employees[globalIndex].name || ''),
      phone: String(employees[globalIndex].phone || ''),
      salary: String(employees[globalIndex].salary || ''),
      experience: String(employees[globalIndex].experience || '')
    });
    setIsEditing(true);
    setEditIndex(globalIndex);
    setShowForm(true);
    setErrors({});
    if (screenWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteClick = (_id) => {
    setPendingDeleteId(_id);
    setShowDeleteModal(true);
  };

  const triggerDeleteAnimation = async (_id) => {
    setDeletingEmployeeId(_id);
    setShowDustbin(true);

    setTimeout(async () => {
      setShowDustbin(false);
      setShowDeleteModal(false);
      setDeletingEmployeeId(null);
      try {
        await axios.delete(`${BASE_URL}/api/admin/delete-manpower/${_id}`);
        fetchEmployees();
        const totalPages = Math.ceil((employees.length - 1) / employeesPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
      } catch (error) {
        // console.error('Error deleting employee:', error);
      }
    }, 1000);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      triggerDeleteAnimation(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPendingDeleteId(null);
    setShowDustbin(false);
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(employees.length / employeesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const isMobile = screenWidth <= 768;

  return (
    <div className="admin-page">
      <h2 className="page-title">Employee Management</h2>

      <button
        className="add-employee-btn"
        onClick={() => {
          setFormData({ name: '', phone: '', salary: '', experience: '' });
          setShowForm(true);
          setIsEditing(false);
          setErrors({});
        }}
      >
        + Add Employee
      </button>

      {showForm && (
        <div className="employee-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Employee Name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              maxLength="10"
              className={`form-input ${errors.phone ? 'error' : ''}`}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <input
              type="number"
              name="salary"
              placeholder="Salary"
              min="0"
              value={formData.salary}
              onChange={handleInputChange}
              className={`form-input ${errors.salary ? 'error' : ''}`}
            />
            {errors.salary && <span className="error-message">{errors.salary}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="experience"
              placeholder="Experience"
              value={formData.experience}
              onChange={handleInputChange}
              className={`form-input ${errors.experience ? 'error' : ''}`}
            />
            {errors.experience && <span className="error-message">{errors.experience}</span>}
          </div>

          {errors.general && <div className="general-error">{errors.general}</div>}

          <div className="form-actions">
            <button
              className={`submit-btn ${isEditing ? 'edit' : ''}`}
              onClick={handleSubmit}
            >
              {isEditing ? 'Update' : 'Submit'}
            </button>
            <button
              className="cancel-btn"
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setFormData({ name: '', phone: '', salary: '', experience: '' });
                setErrors({});
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showSuccess && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccess(false)}
          screenWidth={screenWidth}
        />
      )}

      {showDeleteModal && createPortal(
        <>
          <div className="modal-backdrop" onClick={handleCancelDelete} />
          <div
            className="delete-modal"
            onMouseEnter={() => {
              if (svgIconRef.current && !showDustbin) {
                svgIconRef.current.classList.add('bounce');
              }
            }}
            onMouseLeave={() => {
              if (svgIconRef.current && !showDustbin) {
                svgIconRef.current.classList.remove('bounce');
              }
            }}
          >
            {!showDustbin ? (
              <div className="delete-content">
                <svg
                  ref={svgIconRef}
                  className="delete-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  />
                </svg>
                <h2 className="delete-title">Are you sure?</h2>
                <p className="delete-text">
                  Do you really want to delete this employee? This process cannot be undone.
                </p>
              </div>
            ) : (
              <div className="dustbin-container">
                <svg
                  className="dustbin-icon"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="4" y="4" width="8" height="10" rx="1" fill="white" />
                  <rect
                    className="lid"
                    x="4" y="2" width="8" height="2" rx="0.5"
                    fill="white"
                  />
                  <path
                    d="M6 6H7V12H6V6Z"
                    fill="black"
                    className="dustbin-path"
                  />
                  <path
                    d="M9 6H10V12H9V6Z"
                    fill="black"
                    className="dustbin-path"
                  />
                </svg>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="trash-particle"
                    style={{ animationDelay: `${0.3 + i * 0.05}s` }}
                  />
                ))}
              </div>
            )}

            {!showDustbin && (
              <div className="delete-actions">
                <button className="cancel-delete-btn" onClick={handleCancelDelete}>
                  Cancel
                </button>
                <button className="confirm-delete-btn" onClick={handleConfirmDelete}>
                  Confirm
                </button>
              </div>
            )}
          </div>
        </>,
        document.body
      )}

      <div className="employee-table">
        {isMobile ? (
          <div className="mobile-employee-list">
            {currentEmployees.map((emp, index) => (
              <div
                key={emp._id}
                className={`employee-card ${
                  deletingEmployeeId === emp._id ? 'deleting' : ''
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="employee-field">
                  <strong className="field-label">Name:</strong>
                  <span className="field-value">{emp.name}</span>
                </div>
                <div className="employee-field">
                  <strong className="field-label">Phone:</strong>
                  <span className="field-value">{emp.phone}</span>
                </div>
                <div className="employee-field">
                  <strong className="field-label">Salary:</strong>
                  <span className="field-value">₹{emp.salary}</span>
                </div>
                <div className="employee-field">
                  <strong className="field-label">Experience:</strong>
                  <span className="field-value">{emp.experience}</span>
                </div>
                <div className="employee-field">
                  <strong className="field-label">Actions:</strong>
                  <div className="action-buttons">
                    <div className="action-wrapper">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(index)}
                        onMouseEnter={() =>
                          setShowTooltip((prev) => ({
                            ...prev,
                            [`edit_${emp._id}`]: true
                          }))
                        }
                        onMouseLeave={() =>
                          setShowTooltip((prev) => ({
                            ...prev,
                            [`edit_${emp._id}`]: false
                          }))
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          className="edit-icon"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Edit
                      </button>
                      <span
                        className={`tooltip ${
                          showTooltip[`edit_${emp._id}`] ? 'visible' : ''
                        }`}
                      >
                        Edit
                      </span>
                    </div>
                    <div className="action-wrapper">
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(emp._id)}
                        onMouseEnter={() =>
                          setShowTooltip((prev) => ({
                            ...prev,
                            [`delete_${emp._id}`]: true
                          }))
                        }
                        onMouseLeave={() =>
                          setShowTooltip((prev) => ({
                            ...prev,
                            [`delete_${emp._id}`]: false
                          }))
                        }
                      >
                        <svg
                          className="trash-icon"
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect x="4" y="4" width="8" height="10" rx="1" fill="white" />
                          <rect
                            className="lid"
                            x="4" y="2" width="8" height="2" rx="0.5"
                            fill="white"
                          />
                          <path d="M6 6H7V12H6V6Z" fill="black" />
                          <path d="M9 6H10V12H9V6Z" fill="black" />
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="particle"
                              style={{
                                top: '10px',
                                left: '50%',
                                transform: 'translateX(-50%)'
                              }}
                            />
                          ))}
                        </svg>
                      </button>
                      <span
                        className={`tooltip ${
                          showTooltip[`delete_${emp._id}`] ? 'visible' : ''
                        }`}
                      >
                        Delete
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {currentEmployees.length === 0 && (
              <div className="no-employees">No Employees Found</div>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="employee-table-desktop">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Salary</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((emp, index) => (
                  <tr
                    key={emp._id}
                    className={deletingEmployeeId === emp._id ? 'deleting' : ''}
                    style={{
                      animationDelay: `${(indexOfFirstEmployee + index) * 0.1}s`
                    }}
                  >
                    <td>{emp.name}</td>
                    <td>{emp.phone}</td>
                    <td>₹{emp.salary}</td>
                    <td>{emp.experience}</td>
                    <td>
                      <div className="action-buttons">
                        <div className="action-wrapper">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(index)}
                            onMouseEnter={() =>
                              setShowTooltip((prev) => ({
                                ...prev,
                                [`edit_${emp._id}`]: true
                              }))
                            }
                            onMouseLeave={() =>
                              setShowTooltip((prev) => ({
                                ...prev,
                                [`edit_${emp._id}`]: false
                              }))
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              className="edit-icon"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                            Edit
                          </button>
                          <span
                            className={`tooltip ${
                              showTooltip[`edit_${emp._id}`] ? 'visible' : ''
                            }`}
                          >
                            Edit
                          </span>
                        </div>
                        <div className="action-wrapper">
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteClick(emp._id)}
                            onMouseEnter={() =>
                              setShowTooltip((prev) => ({
                                ...prev,
                                [`delete_${emp._id}`]: true
                              }))
                            }
                            onMouseLeave={() =>
                              setShowTooltip((prev) => ({
                                ...prev,
                                [`delete_${emp._id}`]: false
                              }))
                            }
                          >
                            <svg
                              className="trash-icon"
                              viewBox="0 0 16 16"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect x="4" y="4" width="8" height="10" rx="1" fill="white" />
                              <rect
                                className="lid"
                                x="4" y="2" width="8" height="2" rx="0.5"
                                fill="white"
                              />
                              <path d="M6 6H7V12H6V6Z" fill="black" />
                              <path d="M9 6H10V12H9V6Z" fill="black" />
                              {[...Array(3)].map((_, i) => (
                                <div
                                  key={i}
                                  className="particle"
                                  style={{
                                    top: '10px',
                                    left: '50%',
                                    transform: 'translateX(-50%)'
                                  }}
                                />
                              ))}
                            </svg>
                          </button>
                          <span
                            className={`tooltip ${
                              showTooltip[`delete_${emp._id}`] ? 'visible' : ''
                            }`}
                          >
                            Delete
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentEmployees.length === 0 && (
                  <tr>
                    <td colSpan="5" className="no-employees">
                      No Employees Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {employees.length > employeesPerPage && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;