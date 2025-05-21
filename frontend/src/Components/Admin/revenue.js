import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { styled } from '@mui/material/styles';

const BASE_URL = process.env.REACT_APP_API_URL;

// Styled FilterToggleButton (aligned with ServiceProviderDetails and BookingDetails)
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

const RevenuePage = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/main/admin/revenue`);
        const flatData = response.data.flat().reverse();
        setRevenueData(flatData);
        setFilteredData(flatData);
      } catch (error) {
        setError('Failed to load revenue data. Please try again.');
      }
    };
    fetchRevenue();
  }, []);

  useEffect(() => {
    let filtered = revenueData;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((booking) =>
        [
          booking._id || '',
          booking.parlorEmail || 'n/a',
          booking.name || booking.user?.name || 'n/a',
          formatDate(booking.date) || '',
          (booking.amount || 0).toString(),
        ].some((field) => field.toLowerCase().includes(query))
      );
    }

    if (fromDate || toDate) {
      filtered = filtered.filter((booking) => {
        if (!booking.date) return false;
        try {
          const bookingDate = new Date(booking.date);
          if (isNaN(bookingDate.getTime())) return false;
          const from = fromDate ? new Date(fromDate) : null;
          const to = toDate ? new Date(toDate) : null;
          if (to) to.setHours(23, 59, 59, 999);
          if (from && to) {
            return bookingDate >= from && bookingDate <= to;
          } else if (from) {
            return bookingDate >= from;
          } else if (to) {
            return bookingDate <= to;
          }
          return true;
        } catch (error) {
          return false;
        }
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, revenueData, fromDate, toDate]);

  const clearFilter = () => {
    setFromDate('');
    setToDate('');
    setSearchQuery('');
    setFilteredData(revenueData);
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

  const totalAmount = filteredData.reduce((sum, booking) => sum + (booking.amount || 0), 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
            Revenue Report
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
            Total Revenue: ₹{totalAmount}
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
                  placeholder="Search by email, user, date..."
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
                    marginTop:"40px !important",
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
                  placeholder="Search by email, user, date..."
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
                      min={fromDate || undefined}
                      max={new Date().toISOString().split('T')[0]}
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
                    color: '#ffff',
                    marginTop:"27px !important",
                    cursor: !searchQuery && !fromDate && !toDate ? 'not-allowed' : 'pointer',
                    mt: { xs: 0, sm: '20px' },
                    transition: 'all 0.3s ease',
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
                {['Sl.No', 'Booking ID', 'Shop Email', 'User', 'Date', 'Amount'].map((header, idx) => (
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
                currentItems.map((booking, index) => (
                  <Box component="tr" key={booking._id || index} style={{ borderBottom: '1px solid #e2e8f0' }}>
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
                      {booking._id || 'N/A'}
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
                      {booking.parlorEmail || 'N/A'}
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
                      {booking.name || booking.user?.name || 'N/A'}
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
                      {formatDate(booking.date)}
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
                      ₹{booking.amount || 0}
                    </Box>
                  </Box>
                ))
              ) : (
                <Box component="tr">
                  <Box
                    component="td"
                    colSpan="6"
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
                    No revenue data available
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
                background: '#201548 ',
                color: '#fff',
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
                background: '#201548 ',
                color: '#fff',
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

export default RevenuePage;
