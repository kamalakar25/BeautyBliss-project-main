import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button } from '@mui/material';

const BASE_URL = process.env.REACT_APP_API_URL;

const Approvals = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [providersPerPage] = useState(5);
  const [loadingStates, setLoadingStates] = useState({}); // Track loading state for each provider

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/main/admin/service-providers/pending`)
      .then((res) => {
        setProviders(res.data.reverse());
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching providers:', err);
        setLoading(false);
      });
  }, []);

  const handleApprove = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to approve this service provider?');
    if (isConfirmed) {
      setLoadingStates((prev) => ({ ...prev, [id]: true })); // Set loading state for this provider
      axios
        .post(`${BASE_URL}/api/main/admin/service-providers/approve/${id}`)
        .then((res) => {
          setProviders((prev) => prev.filter((provider) => provider._id !== id));
          setLoadingStates((prev) => ({ ...prev, [id]: false })); // Clear loading state
        })
        .catch((err) => {
          console.error('Error approving provider:', err);
          setLoadingStates((prev) => ({ ...prev, [id]: false })); // Clear loading state on error
        });
    }
  };

  const handleReject = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to reject this service provider?');
    if (isConfirmed) {
      axios
        .post(`${BASE_URL}/api/main/admin/service-providers/reject/${id}`)
        .then((res) => {
          setProviders((prev) => prev.filter((provider) => provider._id !== id));
        })
        .catch((err) => console.error('Error rejecting provider:', err));
    }
  };

  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = providers.slice(indexOfFirstProvider, indexOfLastProvider);
  const totalPages = Math.ceil(providers.length / providersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: '20px 10px', sm: '30px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: '100px',
        background: 'linear-gradient(180deg, #ffffff 0%, #E8ECEF 100%)',
      }}
    >
      {/* Dot Spinner CSS */}
      <style>
        {`
          .dot-spinner {
            --uib-size: 2.8rem;
            --uib-speed: .9s;
            --uib-color: #183153;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: var(--uib-size);
            width: var(--uib-size);
          }

          .dot-spinner__dot {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 100%;
            width: 100%;
          }

          .dot-spinner__dot::before {
            content: '';
            height: 20%;
            width: 20%;
            border-radius: 50%;
            background-color: var(--uib-color);
            transform: scale(0);
            opacity: 0.5;
            animation: pulse0112 calc(var(--uib-speed) * 1.111) ease-in-out infinite;
            box-shadow: 0 0 20px rgba(18, 31, 53, 0.3);
          }

          .dot-spinner__dot:nth-child(2) {
            transform: rotate(45deg);
          }

          .dot-spinner__dot:nth-child(2)::before {
            animation-delay: calc(var(--uib-speed) * -0.875);
          }

          .dot-spinner__dot:nth-child(3) {
            transform: rotate(90deg);
          }

          .dot-spinner__dot:nth-child(3)::before {
            animation-delay: calc(var(--uib-speed) * -0.75);
          }

          .dot-spinner__dot:nth-child(4) {
            transform: rotate(135deg);
          }

          .dot-spinner__dot:nth-child(4)::before {
            animation-delay: calc(var(--uib-speed) * -0.625);
          }

          .dot-spinner__dot:nth-child(5) {
            transform: rotate(180deg);
          }

          .dot-spinner__dot:nth-child(5)::before {
            animation-delay: calc(var(--uib-speed) * -0.5);
          }

          .dot-spinner__dot:nth-child(6) {
            transform: rotate(225deg);
          }

          .dot-spinner__dot:nth-child(6)::before {
            animation-delay: calc(var(--uib-speed) * -0.375);
          }

          .dot-spinner__dot:nth-child(7) {
            transform: rotate(270deg);
          }

          .dot-spinner__dot:nth-child(7)::before {
            animation-delay: calc(var(--uib-speed) * -0.25);
          }

          .dot-spinner__dot:nth-child(8) {
            transform: rotate(315deg);
          }

          .dot-spinner__dot:nth-child(8)::before {
            animation-delay: calc(var(--uib-speed) * -0.125);
          }

          @keyframes pulse0112 {
            0%,
            100% {
              transform: scale(0);
              opacity: 0.5;
            }

            50% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>

      <Box
        sx={{
          width: '100%',
          maxWidth: '1300px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          p: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 0 15px rgba(32, 21, 72, 0.2)',
          margin: '0 auto',
          border: '1px solid rgba(32, 21, 72, 0.3)',
          animation: 'glow 2s ease-in-out infinite alternate',
          '@keyframes glow': {
            '0%': { borderColor: 'rgba(32, 21, 72, 0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 0 15px rgba(32, 21, 72, 0.2)' },
            '100%': { borderColor: 'rgba(32, 21, 72, 0.5)', boxShadow: '0 10px 30px rgba(0,0,0,0.2), 0 0 20px rgba(32, 21, 72, 0.4)' },
          },
        }}
      >
        <Box
          component="h2"
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.2rem' },
            color: '#0e0f0f',
            m: 0,
            textAlign: 'center',
            mb: '30px',
            fontWeight: '700',
            letterSpacing: '0.5px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.4s ease, color 0.4s ease',
            animation: 'fadeInTitle 1s ease',
            '@keyframes fadeInTitle': {
              from: { opacity: 0, transform: 'translateY(-20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
            '&:hover': {
              transform: 'scale(1.03)',
              color: '#201548',
            },
          }}
        >
          Pending Service Provider Approvals
        </Box>

        {loading ? (
          <Box
            sx={{
              fontSize: '1.2rem',
              textAlign: 'center',
              color: '#0e0f0f',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              animation: 'fadeIn 0.8s ease',
              '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            }}
          >
            <Box
              sx={{
                width: '30px',
                height: '30px',
                border: '4px solid #0e0f0f',
                borderTop: '4px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
            Loading Providers...
          </Box>
        ) : providers.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              mt: '50px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: 'fadeIn 1s ease',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'scale(0.9)' },
                to: { opacity: 1, transform: 'scale(1)' },
              },
            }}
          >
            <Box
              component="img"
              src="https://t4.ftcdn.net/jpg/10/94/69/29/360_F_1094692957_4FCjgR355Mwl9Oosvpz67f9Kplgzy9Gr.jpg"
              alt="All approved"
              sx={{
                width: '140px',
                opacity: 0.8,
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                '&:hover': { opacity: 1, transform: 'scale(1.15) rotate(5deg)' },
              }}
            />
            <Box
              component="h5"
              sx={{
                mt: '20px',
                fontSize: '1.4rem',
                color: '#0e0f0f',
                fontWeight: '500',
                letterSpacing: '0.5px',
                textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              All service providers are approved!
            </Box>
          </Box>
        ) : (
          <>
            <Box sx={{ overflowX: 'auto', width: '100%' }}>
              <Box
                component="table"
                sx={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: '0',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                }}
              >
                <Box
                  component="thead"
                  sx={{
                    background: 'linear-gradient(135deg, #201548, #201548)',
                    color: '#ffffff',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <tr>
                    {[
                      'Sl. No',
                      'Name',
                      'Email',
                      'Phone',
                      'Designation',
                      'Shop Name',
                      'Address',
                      'Actions',
                    ].map((header, idx) => (
                      <Box
                        component="th"
                        key={idx}
                        sx={{
                          p: '16px',
                          textAlign: 'center',
                          fontSize: '1rem',
                          borderBottom: '2px solid rgba(255,255,255,0.2)',
                          fontWeight: '600',
                          letterSpacing: '0.5px',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                          transition: 'background 0.3s ease',
                          '&:hover': {
                            background: 'rgba(255,255,255,0.1)',
                          },
                        }}
                      >
                        {header}
                      </Box>
                    ))}
                  </tr>
                </Box>
                <Box component="tbody">
                  {currentProviders.map((provider, index) => (
                    <Box
                      component="tr"
                      key={provider._id}
                      sx={{
                        background: index % 2 === 0 ? '#ffffff' : 'rgba(240, 244, 255, 0.5)',
                        borderBottom: '1px solid rgba(32, 21, 72, 0.2)',
                        transition: 'all 0.4s ease',
                        animation: `rowSlideIn 0.6s ease ${index * 0.15}s both`,
                        '@keyframes rowSlideIn': {
                          from: { opacity: 0, transform: 'translateX(-20px)' },
                          to: { opacity: 1, transform: 'translateX(0)' },
                        },
                        '&:hover': {
                          background: 'linear-gradient(135deg, #ffffff, #E8ECEF)',
                          transform: 'scale(1.02)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <Box
                        component="td"
                        sx={{
                          p: '16px',
                          fontSize: '0.95rem',
                          textAlign: 'center',
                          border: '1px solid rgba(32, 21, 72, 0.1)',
                          color: '#0e0f0f',
                          fontWeight: '500',
                          letterSpacing: '0.3px',
                        }}
                      >
                        {indexOfFirstProvider + index + 1}
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          p: '16px',
                          fontSize: '0.95rem',
                          textAlign: 'center',
                          border: '1px solid rgba(32, 21, 72, 0.1)',
                          color: '#0e0f0f',
                          fontWeight: '500',
                          letterSpacing: '0.3px',
                        }}
                      >
                        {provider.name}
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          p: '16px',
                          fontSize: '0.95rem',
                          textAlign: 'center',
                          border: '1px solid rgba(32, 21, 72, 0.1)',
                          color: '#0e0f0f',
                          fontWeight: '500',
                          letterSpacing: '0.3px',
                        }}
                      >
                        {provider.email}
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          p: '16px',
                          fontSize: '0.95rem',
                          textAlign: 'center',
                          border: '1px solid rgba(32, 21, 72, 0.1)',
                          color: '#0e0f0f',
                          fontWeight: '500',
                          letterSpacing: '0.3px',
                        }}
                      >
                        {provider.phone}
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          p: '16px',
                          fontSize: '0.95rem',
                          textAlign: 'center',
                          border: '1px solid rgba(32, 21, 72, 0.1)',
                          color: '#0e0f0f',
                          fontWeight: '500',
                          letterSpacing: '0.3px',
                        }}
                      >
                        {provider.designation}
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          p: '16px',
                          fontSize: '0.95rem',
                          textAlign: 'center',
                          border: '1px solid rgba(32, 21, 72, 0.1)',
                          color: '#0e0f0f',
                          fontWeight: '500',
                          letterSpacing: '0.3px',
                        }}
                      >
                        {provider.shopName}
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          p: '16px',
                          fontSize: '0.95rem',
                          textAlign: 'center',
                          border: '1px solid rgba(32, 21, 72, 0.1)',
                          color: '#0e0f0f',
                          fontWeight: '500',
                          letterSpacing: '0.3px',
                        }}
                      >
                        {provider.spAddress}
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          p: '16px',
                          fontSize: '0.95rem',
                          textAlign: 'center',
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '12px',
                        }}
                      >
                        <Button
                          onClick={() => handleApprove(provider._id)}
                          disabled={loadingStates[provider._id]} // Disable button when loading
                          sx={{
                            p: '10px 20px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #201548, #201548)',
                            color: '#ffffff',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.2), inset -2px -2px 5px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.15)',
                            transition: 'all 0.4s ease',
                            letterSpacing: '0.5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #ffffff, #ffffff)',
                              color: '#0e0f0f',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.2), 0 0 15px rgba(32, 21, 72, 0.3)',
                            },
                            '&:active': {
                              '&:before': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '0',
                                height: '0',
                                background: 'rgba(255,255,255,0.4)',
                                borderRadius: '50%',
                                transform: 'translate(-50%, -50%)',
                                animation: 'ripple 0.8s linear',
                              },
                            },
                            '&:disabled': {
                              opacity: 0.6,
                              cursor: 'not-allowed',
                              transform: 'none',
                              boxShadow: 'none',
                            },
                            '@keyframes ripple': {
                              to: {
                                width: '300px',
                                height: '300px',
                                opacity: 0,
                              },
                            },
                          }}
                        >
                          {loadingStates[provider._id] ? (
                            <div className="dot-spinner">
                              <div className="dot-spinner__dot"></div>
                              <div className="dot-spinner__dot"></div>
                              <div className="dot-spinner__dot"></div>
                              <div className="dot-spinner__dot"></div>
                              <div className="dot-spinner__dot"></div>
                              <div className="dot-spinner__dot"></div>
                              <div className="dot-spinner__dot"></div>
                              <div className="dot-spinner__dot"></div>
                            </div>
                          ) : (
                            'Approve'
                          )}
                        </Button>
                        <Button
                          onClick={() => handleReject(provider._id)}
                          sx={{
                            p: '10px 20px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #ffffff, #ffffff)',
                            color: '#0e0f0f',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.2), inset -2px -2px 5px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.15)',
                            transition: 'all 0.4s ease',
                            letterSpacing: '0.5px',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #201548, #201548)',
                              color: '#ffffff',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.2), 0 0 15px rgba(32, 21, 72, 0.3)',
                            },
                            '&:active': {
                              '&:before': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '0',
                                height: '0',
                                background: 'rgba(32,21,72,0.4)',
                                borderRadius: '50%',
                                transform: 'translate(-50%, -50%)',
                                animation: 'ripple 0.8s linear',
                              },
                            },
                            '@keyframes ripple': {
                              to: {
                                width: '300px',
                                height: '300px',
                                opacity: 0,
                              },
                            },
                          }}
                        >
                          Reject
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            {providers.length > 0 && (
              <Box
                sx={{
                  mt: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '16px',
                  animation: 'slideUp 0.7s ease',
                  '@keyframes slideUp': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                <Box
                  component="button"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  sx={{
                    p: '10px 24px',
                    borderRadius: '30px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #201548, #201548)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.4s ease',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.2), 0 0 10px rgba(32, 21, 72, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    letterSpacing: '0.5px',
                    '&:hover': {
                      ...(currentPage !== 1
                        ? {
                            background: 'linear-gradient(135deg, #ffffff, #ffffff)',
                            color: '#0e0f0f',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.25), 0 0 15px rgba(32, 21, 72, 0.4)',
                            '&:after': {
                              width: '100%',
                            },
                          }
                        : {}),
                    },
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '0',
                      height: '3px',
                      background: '#ffffff',
                      transition: 'width 0.4s ease',
                    },
                    '&:disabled': {
                      opacity: 0.5,
                      boxShadow: 'none',
                    },
                  }}
                >
                  Previous
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#0e0f0f',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
                    letterSpacing: '0.5px',
                    position: 'relative',
                    transition: 'transform 0.4s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      width: '0',
                      height: '2px',
                      background: '#201548',
                      transition: 'width 0.4s ease',
                    },
                    '&:hover:after': {
                      width: '100%',
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
                    p: '10px 24px',
                    borderRadius: '30px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #201548, #201548)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.4s ease',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.2), 0 0 10px rgba(32, 21, 72, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    letterSpacing: '0.5px',
                    '&:hover': {
                      ...(currentPage !== totalPages
                        ? {
                            background: 'linear-gradient(135deg, #ffffff, #ffffff)',
                            color: '#0e0f0f',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.25), 0 0 15px rgba(32, 21, 72, 0.4)',
                            '&:after': {
                              width: '100%',
                            },
                          }
                        : {}),
                    },
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '0',
                      height: '3px',
                      background: '#ffffff',
                      transition: 'width 0.4s ease',
                    },
                    '&:disabled': {
                      opacity: 0.5,
                      boxShadow: 'none',
                    },
                  }}
                >
                  Next
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Approvals;
