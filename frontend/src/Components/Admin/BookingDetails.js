import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { styled } from '@mui/material/styles';

const BASE_URL = process.env.REACT_APP_API_URL;

// Styled FilterToggleButton (aligned with ServiceProviderDetails)
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

const BookingDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingDateFilter, setBookingDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/users/all/bookings`);
        const data = Array.isArray(response.data) ? response.data : response.data.bookings || [];
        setBookings(data);
        setFilteredBookings(data);
      } catch (error) {
        setError('Failed to load bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((b) =>
        [
          b._id || '',
          b.name || '',
          b.service || '',
          Array.isArray(b.relatedServices) ? b.relatedServices.join(', ') : '',
          b.amount?.toString() || '',
          formatDate(b.date) || '',
          b.time || '',
        ].some((field) => field.toLowerCase().includes(query))
      );
    }

    if (bookingDateFilter) {
      filtered = filtered.filter((booking) => {
        if (!booking.date) return false;
        try {
          const bookingDate = new Date(booking.date);
          if (isNaN(bookingDate.getTime())) return false;
          const filterDate = new Date(bookingDateFilter);
          return (
            bookingDate.getFullYear() === filterDate.getFullYear() &&
            bookingDate.getMonth() === filterDate.getMonth() &&
            bookingDate.getDate() === filterDate.getDate()
          );
        } catch (error) {
          return false;
        }
      });
    }

    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [searchQuery, bookingDateFilter, bookings]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setBookingDateFilter('');
    setFilteredBookings(bookings);
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

  const handleToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const reversedBookings = [...filteredBookings].reverse();
  const indexOfLastBooking = currentPage * itemsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
  const currentBookings = reversedBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
            Booking Details
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
                  placeholder="Search by ID, name, service..."
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
                Total Bookings: <strong>{filteredBookings.length}</strong>
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
                  placeholder="Search by ID, name, service..."
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
                      htmlFor="bookingDate"
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
                      Booking Date
                    </Box>
                    <Box
                      component="input"
                      id="bookingDate"
                      type="date"
                      value={bookingDateFilter}
                      onChange={(e) => setBookingDateFilter(e.target.value)}
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
                  onClick={handleClearFilters}
                  disabled={!searchQuery && !bookingDateFilter}
                  sx={{
                    p: '10px 20px',
                    borderRadius: "8px",
                    border: "2px solid #201548",
                    background: "#201548",
                    fontSize: "0.95rem",
                    fontWeight: "medium",
                    color: "#fff",
                    marginTop: "27px !important",

                  
                    cursor: !searchQuery && !bookingDateFilter ? 'not-allowed' : 'pointer',
                    mt: { xs: 0, sm: '20px' },
                    transition: 'all 0.3s ease',
                    marginTop: "27px !important",

                    '&:hover': {
                      ...(searchQuery || bookingDateFilter
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
                {['Sl.No.', 'Booking ID', 'Name', 'Booking Slot Date & Time', 'Service', 'Related Services', 'Amount'].map(
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
                  )
                )}
              </tr>
            </Box>
            <Box component="tbody">
              {loading ? (
                <Box component="tr">
                  <Box
                    component="td"
                    colSpan="7"
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
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                      },
                    }}
                  >
                    Loading bookings...
                  </Box>
                </Box>
              ) : currentBookings.length === 0 ? (
                <Box component="tr">
                  <Box
                    component="td"
                    colSpan="7"
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
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                      },
                    }}
                  >
                    No bookings available.
                  </Box>
                </Box>
              ) : (
                currentBookings.map((booking, index) => (
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
                          backgroundColor: '#ffffff',
                          boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                        },
                      }}
                    >
                      {indexOfFirstBooking + index + 1}
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
                          backgroundColor: '#ffffff',
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
                          backgroundColor: '#ffffff',
                          boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                        },
                      }}
                    >
                      {booking.name || 'N/A'}
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
                          backgroundColor: '#ffffff',
                          boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                        },
                      }}
                    >
                      {formatDate(booking.date)} {booking.time ? `& ${booking.time}` : ''}
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
                          backgroundColor: '#ffffff',
                          boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                        },
                      }}
                    >
                      {booking.service || 'N/A'}
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
                          backgroundColor: '#ffffff',
                          boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                        },
                      }}
                    >
                 {booking.relatedServices == null || !Array.isArray(booking.relatedServices) || booking.relatedServices.length === 0 ? 'N/A' : booking.relatedServices.join(', ')}
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
                          backgroundColor: '#ffffff',
                          boxShadow: '0 2px 8px rgba(32, 21, 72, 0.2)',
                        },
                      }}
                    >
                      {booking.amount || 'N/A'}
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>

        {filteredBookings.length > itemsPerPage && (
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

export default BookingDetails;