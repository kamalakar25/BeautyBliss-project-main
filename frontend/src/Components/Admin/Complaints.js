import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, IconButton,Badge  } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { styled } from '@mui/material/styles';

const BASE_URL = process.env.REACT_APP_API_URL;

// Styled FilterToggleButton (aligned with ServiceProviderDetails, BookingDetails, and RevenuePage)
const FilterToggleButton = styled(IconButton)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('lg')]: {
    display: 'block',
    color: '#201548',
    backgroundColor: 'transparent',
    border: '2px solid #201548',
    borderRadius: '50%',
    padding: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#201548',
      color: '#ffffff',
      transform: 'scale(1.1)',
      boxShadow: '0 4px 12px rgba(32, 21, 72, 0.4)',
    },
  },
}));

const StyledBadge = styled(Box)(({ theme, color }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  color: '#ffffff',
  marginLeft: '8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
}));

const Complaints = () => {
  const [userComplaints, setUserComplaints] = useState([]);
  const [spComplaints, setSpComplaints] = useState([]);
  const [activeView, setActiveView] = useState('user');
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users/get/all/complaints`);
        setUserComplaints(res.data.userComplaints || []);
        setSpComplaints(res.data.spComplaints || []);
        setFilteredData(res.data.userComplaints || []);
      } catch (err) {
        setError('Failed to load complaints data. Please try again.');
      }
    };
    fetchComplaints();
  }, []);

  useEffect(() => {
    const dataToDisplay = activeView === 'user' ? userComplaints : spComplaints;
    let filtered = dataToDisplay;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((complaint) =>
        [
          complaint.email || '',
          complaint.parlorEmail || complaint.userEmail || 'n/a',
          complaint.parlorName || 'n/a',
          complaint.complaint || 'n/a',
          formatDate(complaint.date) || '',
          complaint.service || 'n/a',
        ].some((field) => field.toLowerCase().includes(query))
      );
    }

    if (fromDate || toDate) {
      filtered = filtered.filter((complaint) => {
        if (!complaint.date) return false;
        try {
          const complaintDate = new Date(complaint.date);
          if (isNaN(complaintDate.getTime())) return false;
          const from = fromDate ? new Date(fromDate) : null;
          const to = toDate ? new Date(toDate) : null;
          if (to) to.setHours(23, 59, 59, 999);
          if (from && to) {
            return complaintDate >= from && complaintDate <= to;
          } else if (from) {
            return complaintDate >= from;
          } else if (to) {
            return complaintDate <= to;
          }
          return true;
        } catch (error) {
          return false;
        }
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, userComplaints, spComplaints, activeView, fromDate, toDate]);

  const clearFilter = () => {
    setFromDate('');
    setToDate('');
    setSearchQuery('');
    setFilteredData(activeView === 'user' ? userComplaints : spComplaints);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: '20px 10px', sm: '30px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        mt: '100px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          p: '24px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          margin: '0 auto',
          transition: 'all 0.3s ease',
          animation: 'fadeIn 0.5s ease-out',
          '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: '24px',
            gap: '16px',
          }}
        >
          <Box
            component="h2"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2rem' },
              color: '#0e0f0f',
              fontWeight: 'bold',
              m: 0,
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#201548',
                textShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
              },
            }}
          >
            Complaints Overview
          </Box>
          <Box
            component="h5"
            sx={{
              fontSize: '1.1rem',
              color: '#0e0f0f',
              m: 0,
              textAlign: 'center',
              fontWeight: 'medium',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#201548',
                transform: 'scale(1.05)',
              },
            }}
          >
            Total Complaints: {filteredData.length}
          </Box>
          <Box
            sx={{
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row', lg: 'row' },
                flexWrap: { sm: 'wrap' },
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 2, sm: 3 },
                width: '100%',
                mb: '20px',
              }}
            >
              <Box
                sx={{
                  display: { xs: 'flex', lg: 'none' },
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '400px' },
                }}
              >
                <Box
                  component="input"
                  type="text"
                  placeholder="Search by email, complaint, date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    p: '10px',
                    borderRadius: '8px',
                    border: '2px solid #201548',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    fontSize: '0.95rem',
                    width: '100%',
                    maxWidth: { xs: '100%', sm: '200px' },
                    color: '#0e0f0f',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:focus': {
                      borderColor: '#201548',
                      boxShadow: '0 0 10px rgba(32, 21, 72, 0.3)',
                      backgroundColor: '#ffffff',
                    },
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                    },
                  }}
                />
                <FilterToggleButton onClick={handleToggleFilters} style={{borderRadius:"20px"}}>
                  <FilterListIcon />
                </FilterToggleButton>
              </Box>
              <Box
                sx={{
                  display: { xs: showFilters ? 'flex' : 'none', lg: 'flex' },
                  flexDirection: { xs: 'column', sm: 'row' },
                  flexWrap: { sm: 'wrap' },
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: { xs: 2, sm: 3 },
                  width: '100%',
                }}
              >
                <Box
                  component="input"
                  type="text"
                  placeholder="Search by email, complaint, date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    p: '10px',
                    borderRadius: '8px',
                    border: '2px solid #201548',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    fontSize: '0.95rem',
                    width: { xs: '100%', sm: '200px' },
                    maxWidth: '200px',
                    color: '#0e0f0f',
                    mt: { xs: 0, sm: '20px' },
                    textAlign: 'center',
                    display: { xs: 'none', lg: 'block' },
                    transition: 'all 0.3s ease',
                    '&:focus': {
                      borderColor: '#201548',
                      boxShadow: '0 0 10px rgba(32, 21, 72, 0.3)',
                      backgroundColor: '#ffffff',
                    },
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                    },
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: { xs: '100%', sm: 'auto' },
                    gap: 2,
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: { xs: '50%', sm: 'auto' },
                    }}
                  >
                    <Box
                      component="label"
                      htmlFor="fromDate"
                      sx={{
                        fontSize: '0.95rem',
                        color: '#0e0f0f',
                        mb: '6px',
                        zIndex: 3,
                        fontWeight: 'medium',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#201548',
                        },
                      }}
                    >
                      From Date
                    </Box>
                    <Box
                      component="input"
                      id="fromDate"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      sx={{
                        p: '10px',
                        borderRadius: '8px',
                        border: '2px solid #201548',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(4px)',
                        fontSize: '0.95rem',
                        width: '100%',
                        maxWidth: { xs: '150px', sm: '200px' },
                        textAlign: 'center',
                        color: '#0e0f0f',
                        transition: 'all 0.3s ease',
                        '&:focus': {
                          borderColor: '#201548',
                          boxShadow: '0 0 10px rgba(32, 21, 72, 0.3)',
                          backgroundColor: '#ffffff',
                        },
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                        },
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: { xs: '50%', sm: 'auto' },
                    }}
                  >
                    <Box
                      component="label"
                      htmlFor="toDate"
                      sx={{
                        fontSize: '0.95rem',
                        color: '#0e0f0f',
                        mb: '6px',
                        zIndex: 3,
                        fontWeight: 'medium',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#201548',
                        },
                      }}
                    >
                      To Date
                    </Box>
                    <Box
                      component="input"
                      id="toDate"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      min={fromDate || undefined}
                      max={new Date().toISOString().split('T')[0]}
                      sx={{
                        p: '10px',
                        borderRadius: '8px',
                        border: '2px solid #201548',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(4px)',
                        fontSize: '0.95rem',
                        width: '0 10px 10px rgba(0,0,0,0.2)',
                        fontSize: '0.95rem',
                        width: '100%',
                        maxWidth: { xs: '150px', sm: '200px' },
                        textAlign: 'center',
                        color: '#0e0f0f',
                        transition: 'all 0.3s ease',
                        '&:focus': {
                          borderColor: '#201548',
                          boxShadow: '0 0 10px rgba(32, 21, 72, 0.3)',
                          backgroundColor: '#ffffff',
                        },
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                        },
                      }}
                    />
                  </Box>
                </Box>
                <Box
                  component="button"
                  onClick={clearFilter}
                  disabled={!searchQuery && !fromDate && !toDate}
                  sx={{
                    p: '10px 20px',
                    borderRadius: '8px',
                    border: '2px solid #201548',
                    background: '#201548',
                    fontSize: '0.95rem',
                    fontWeight: 'medium',
                    color: '#fff',
                    cursor: !searchQuery && !fromDate && !toDate ? 'not-allowed' : 'pointer',
                    mt: { xs: 0, sm: '20px' },
                    transition: 'all 0.3s ease',
                    marginTop:"27px !important",
                
                    '&:hover': {
                      ...(searchQuery || fromDate || toDate
                        ? {
                            background: 'linear-gradient(90deg, #201548, #201548)',
                            color: '#ffffff',
                            transform: 'scale(1.05)',
                            boxShadow: '0 4px 12px rgba(32, 21, 72, 0.3)',
                          }
                        : {}),
                    },
                  }}
                >
                  Clear Filters
                </Box>
              </Box>
              <Box
                component="span"
                sx={{
                  fontSize: '1.1rem',
                  color: '#0e0f0f',
                  mt: { xs: 0, sm: '20px' },
                  textAlign: 'center',
                  fontWeight: 'medium',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#201548',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Total Records: <strong>{filteredData.length}</strong>
              </Box>
            </Box>
            <Box
              sx={{
                mb: '20px',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: '16px',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              
                <Box
                  component="button"
                  onClick={() => {
                    setActiveView('user');
                    setCurrentPage(1);
                    setFilteredData(userComplaints);
                  }}
                  sx={{
                    p: '10px 20px',
                    fontSize: '0.95rem',
                    fontWeight: 'medium',
                    minWidth: '120px',
                    borderRadius: '8px',
                    border: activeView === 'user' ? 'none' : '2px solid #201548',
                    background:
                      activeView === 'user'
                        ? 'linear-gradient(90deg, #201548, #201548)'
                        : 'linear-gradient(90deg, #ffffff, #e2e8f0)',
                    color: activeView === 'user' ? '#ffffff' : '#0e0f0f',
                    cursor: 'pointer',
                    width: { xs: '100%', sm: 'auto' },
                    maxWidth: { xs: '200px', sm: 'none' },
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #201548, #201548)',
                      color: '#ffffff',
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(32, 21, 72, 0.3)',
                    },
                  }}
                >
                  User Complaints
                  <StyledBadge className="badge bg-danger">{userComplaints.length}</StyledBadge>
                </Box>
              
                <Box
                  component="button"
                  onClick={() => {
                    setActiveView('sp');
                    setCurrentPage(1);
                    setFilteredData(spComplaints);
                  }}
                  sx={{
                    p: '10px 20px',
                    fontSize: '0.95rem',
                    fontWeight: 'medium',
                    minWidth: '120px',
                    borderRadius: '8px',
                    border: activeView === 'sp' ? 'none' : '2px solid #201548',
                    background:
                      activeView === 'sp'
                        ? 'linear-gradient(90deg, #201548, #201548)'
                        : 'linear-gradient(90deg, #ffffff, #e2e8f0)',
                    color: activeView === 'sp' ? '#ffffff' : '#0e0f0f',
                    cursor: 'pointer',
                    width: { xs: '100%', sm: 'auto' },
                    maxWidth: { xs: '200px', sm: 'none' },
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #201548, #201548)',
                      color: '#ffffff',
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(32, 21, 72, 0.3)',
                    },
                  }}
                >
                 SP Complaints
                 <StyledBadge className="badge bg-warning">{spComplaints.length}</StyledBadge>
                </Box>

            </Box>
          </Box>
        </Box>

        {error && (
          <Box
            sx={{
              color: '#dc2626',
              fontSize: '0.95rem',
              textAlign: 'center',
              mb: 2,
              fontWeight: 'medium',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#b91c1c',
              },
            }}
          >
            {error}
          </Box>
        )}

        <Box sx={{ overflowX: 'auto', width: '100%' }}>
          <Box
            component="table"
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'transparent',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box
              component="thead"
              sx={{
                background: 'linear-gradient(90deg, #201548, #201548)',
                color: '#ffffff',
              }}
            >
              <tr>
                {activeView === 'user'
                  ? [
                      '#',
                      'Customer Email',
                      'SP Email',
                      'Shop/Clinic Name',
                      'Complaint',
                      'Date',
                      'Service',
                    ].map((header, idx) => (
                      <Box
                        component="th"
                        key={idx}
                        sx={{
                          p: '14px',
                          textAlign: 'center',
                          fontSize: '1rem',
                          fontWeight: 'medium',
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: '#201548',
                            boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                          },
                        }}
                      >
                        {header}
                      </Box>
                    ))
                  : ['#', 'SP Email', 'Customer Email', 'Complaint', 'Date', 'Service'].map(
                      (header, idx) => (
                        <Box
                          component="th"
                          key={idx}
                          sx={{
                            p: '14px',
                            textAlign: 'center',
                            fontSize: '1rem',
                            fontWeight: 'medium',
                            border: '1px solid #e2e8f0',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: '#201548',
                              boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                            },
                          }}
                        >
                          {header}
                      </Box>
                    ))}
              </tr>
            </Box>
            <Box component="tbody">
              {currentItems.length > 0 ? (
                currentItems.map((c, index) => (
                  <Box
                    component="tr"
                    key={c._id || index}
                    sx={{ borderBottom: '1px solid #e2e8f0' }}
                  >
                    <Box
                      component="td"
                      sx={{
                        p: '14px',
                        fontSize: '0.95rem',
                        textAlign: 'center',
                        border: '1px solid #e2e8f0',
                        color: '#0e0f0f',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(4px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                          boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                        },
                      }}
                    >
                      {indexOfFirstItem + index + 1}
                    </Box>
                    {activeView === 'user' ? (
                      <>
                        <Box
                          component="td"
                          sx={{
                            p: '14px',
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            color: '#0e0f0f',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                            },
                          }}
                        >
                          {c.email || 'N/A'}
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            p: '14px',
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            color: '#0e0f0f',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                            },
                          }}
                        >
                          {c.parlorEmail || 'N/A'}
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            p: '14px',
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            color: '#0e0f0f',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                            },
                          }}
                        >
                          {c.parlorName || 'N/A'}
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            p: '14px',
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            color: '#0e0f0f',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                            },
                          }}
                        >
                          {c.complaint || 'N/A'}
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            p: '14px',
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            color: '#0e0f0f',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                            },
                          }}
                        >
                          {formatDate(c.date)}
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            p: '14px',
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            color: '#0e0f0f',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                            },
                          }}
                        >
                          {c.service || 'N/A'}
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box
                          component="td"
                          sx={{
                            p: '14px',
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            color: '#0e0f0f',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                            },
                          }}
                        >
                          {c.email || 'N/A'}
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            p: '14px',
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            color: '#0e0f0f',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                            },
                          }}
                        >
                          {c.userEmail || 'N/A'}
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            p: '14px',
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            color: '#0e0f0f',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                            },
                          }}
                        >
                          {c.complaint || 'N/A'}
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            p: '14px',
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            color: '#0e0f0f',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                            },
                          }}
                        >
                          {formatDate(c.date)}
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            p: '14px',
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            color: '#0e0f0f',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                            },
                          }}
                        >
                          {c.service || 'N/A'}
                        </Box>
                      </>
                    )}
                  </Box>
                ))
              ) : (
                <Box component="tr">
                  <Box
                    component="td"
                    colSpan={activeView === 'user' ? 7 : 6}
                    sx={{
                      textAlign: 'center',
                      p: '20px',
                      color: '#0e0f0f',
                      fontSize: '1rem',
                      fontWeight: 'medium',
                      border: '1px solid #e2e8f0',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(4px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#f1f5f9',
                        boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                      },
                    }}
                  >
                    No {activeView === 'user' ? 'user' : 'service provider'} complaints available
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {filteredData.length > itemsPerPage && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mt: 3,
            }}
          >
            <Box
              component="button"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              sx={{
                p: '10px 20px',
                borderRadius: '8px',
                border: '2px solid #201548',
                background: 'linear-gradient(90deg, #ffffff, #e2e8f0)',
                color: '#0e0f0f',
                fontSize: '0.95rem',
                fontWeight: 'medium',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  ...(currentPage !== 1
                    ? {
                        background: 'linear-gradient(90deg, #201548, #201548)',
                        color: '#ffffff',
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(32, 21, 72, 0.3)',
                      }
                    : {}),
                },
              }}
            >
              Previous
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: '0.95rem',
                color: '#0e0f0f',
                fontWeight: 'medium',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#201548',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Page {currentPage} of {totalPages}
            </Box>
            <Box
              component="button"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              sx={{
                p: '10px 20px',
                borderRadius: '8px',
                border: '2px solid #201548',
                background: 'linear-gradient(90deg, #ffffff, #e2e8f0)',
                color: '#0e0f0f',
                fontSize: '0.95rem',
                fontWeight: 'medium',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  ...(currentPage !== totalPages
                    ? {
                        background: 'linear-gradient(90deg, #201548, #201548)',
                        color: '#ffffff',
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(32, 21, 72, 0.3)',
                      }
                    : {}),
                },
              }}
            >
              Next
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Complaints;