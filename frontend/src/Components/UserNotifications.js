import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { NotificationContext } from './NotificationContext.js';

const BASE_URL = process.env.REACT_APP_API_URL;

const UserNotifications = () => {
  const context = useContext(NotificationContext);
  const { notificationCount = 0, setNotificationCount = () => {}, fetchNotificationCount = () => {} } = context || {};
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchNotifications = async () => {
      const email = localStorage.getItem('email');
      console.log('UserNotifications: Fetching notifications for email:', email);
      try {
        const res = await axios.get(`${BASE_URL}/api/notifications/notifications/${email}`);
        const userNotifications = res.data
          .filter((notif) => notif.recipientType === 'User')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log('UserNotifications: Fetched notifications:', userNotifications);
        setNotifications(userNotifications);
      } catch (error) {
        console.error('UserNotifications: Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
    fetchNotificationCount();

    const intervalId = setInterval(() => {
      console.log('UserNotifications: Periodic fetch of notification count');
      fetchNotificationCount();
    }, 10000);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, [fetchNotificationCount]);

  const handleNotificationClick = async (notification) => {
    console.log('UserNotifications: Clicking notification, ID:', notification._id, 'isRead:', notification.isRead);
    setSelectedNotification(notification);
    setIsModalOpen(true);

    if (!notification.isRead) {
      try {
        console.log('UserNotifications: Marking notification as read, ID:', notification._id);
        const response = await axios.post(`${BASE_URL}/api/notifications/mark-notification-read`, {
          email: localStorage.getItem('email'),
          notificationId: notification._id,
        });
        console.log('UserNotifications: Mark notification response:', response.data);

        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notification._id ? { ...notif, isRead: true } : notif
          )
        );

        setNotificationCount(response.data.unreadCount);
        console.log('UserNotifications: Updated notification count to', response.data.unreadCount);
      } catch (error) {
        console.error('UserNotifications: Failed to mark notification as read:', error);
      }
    } else {
      console.log('UserNotifications: Notification already read, no count update');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target.className.includes('modal')) {
      closeModal();
    }
  };

  const formatDateTime = (createdAt) => {
    try {
      const date = new Date(createdAt);
      return date.toLocaleString();
    } catch (e) {
      console.error('Invalid date format:', createdAt);
      return 'N/A';
    }
  };

  console.log('UserNotifications: Rendering with notificationCount =', notificationCount);

  return (
    <div
      style={{
        padding: '2rem',
        minHeight: '100vh',
        background: '#f4f7fa',
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .notification-container {
            max-width: 800px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .notification-box {
            background: #ffffff;
            border-radius: 10px;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            animation: fadeIn 0.5s ease-out;
            border-left: 4px solid #201548;
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .notification-box.unread {
            border-left: 4px solid #ff6f61;
            background: #fff5f5;
          }
          .notification-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          }
          .notification-content {
            flex: 1;
            color: #0e0f0f;
            font-size: 0.9rem;
          }
          .notification-content h4 {
            margin: 0;
            color: #201548;
            font-size: 1.1rem;
            font-weight: 600;
          }
          .notification-content p {
            margin: 0.5rem 0 0;
            color: #555;
          }
          .notification-time {
            font-size: 0.8rem;
            color: #888;
            text-align: right;
          }
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .modal-content {
            background: #ffffff;
            padding: 2rem;
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            animation: fadeIn 0.3s ease-out;
          }
          .close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #555;
            transition: color 0.3s ease;
          }
          .close-btn:hover {
            color: #201548;
          }
          .modal-content h3 {
            margin-bottom: 1.5rem;
            color: #201548;
            font-size: 1.5rem;
            text-align: center;
          }
          .modal-content p {
            margin: 0.5rem 0;
            font-size: 0.95rem;
            color: #0e0f0f;
          }
          .modal-content p strong {
            color: #201548;
            margin-right: 0.5rem;
          }
          .no-notifications {
            text-align: center;
            font-size: 1.2rem;
            color: #555;
            margin-top: 2rem;
          }
          @media (max-width: 768px) {
            .notification-container {
              padding: 0 1rem;
            }
            .notification-box {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.5rem;
            }
            .notification-content h4 {
              font-size: 1rem;
            }
            .notification-content p {
              font-size: 0.85rem;
            }
            .notification-time {
              font-size: 0.75rem;
            }
            .modal-content {
              padding: 1.5rem;
              width: 95%;
            }
            .modal-content h3 {
              font-size: 1.3rem;
            }
            .modal-content p {
              font-size: 0.9rem;
            }
          }
          @media (max-width: 600px) {
            .notification-box {
              padding: 0.8rem;
            }
            .notification-content h4 {
              font-size: 0.9rem;
            }
            .notification-content p {
              font-size: 0.8rem;
            }
            .modal-content {
              padding: 1rem;
            }
            .modal-content h3 {
              font-size: 1.2rem;
            }
            .modal-content p {
              font-size: 0.85rem;
            }
          }
        `}
      </style>

      <div className="notification-container">
        <h1
          style={{
            textAlign: 'center',
            color: '#201548',
            marginBottom: '2rem',
            fontSize: '1.8rem',
          }}
        >
          Your Notifications
        </h1>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-box ${notification.isRead ? '' : 'unread'}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                {notification.type === 'Booking' && (
                  <p>
                    <strong>Booking ID:</strong> {notification.bookingId}
                  </p>
                )}
                {notification.type === 'NewService' && (
                  <p>
                    <strong>Service ID:</strong> {notification.serviceId}
                  </p>
                )}
              </div>
              <div className="notification-time">
                {formatDateTime(notification.createdAt)}
              </div>
            </div>
          ))
        ) : (
          <p className="no-notifications">No notifications found</p>
        )}
      </div>

      {isModalOpen && selectedNotification && (
       <div className="modal show d-block" onClick={handleBackdropClick} tabIndex="-1" role="dialog">
       <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
         <div className="modal-content p-3">
           <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
             <h5 className="modal-title mb-0">{selectedNotification.title}</h5>
             <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
           </div>
           <div className="modal-body">
             <p>
               <strong>Message:</strong> {selectedNotification.message}
             </p>
             <p>
               <strong>Time:</strong> {formatDateTime(selectedNotification.createdAt)}
             </p>
             {selectedNotification.type === 'Booking' && (
               <>
                 <p>
                   <strong>Booking ID:</strong> {selectedNotification.bookingId}
                 </p>
                 <p>
                   <strong>User Name:</strong> {selectedNotification.userDetails?.name || 'N/A'}
                 </p>
                 <p>
                   <strong>User Email:</strong> {selectedNotification.userDetails?.email || 'N/A'}
                 </p>
                 <p>
                   <strong>User Phone:</strong> {selectedNotification.userDetails?.phone || 'N/A'}
                 </p>
               </>
             )}
             {selectedNotification.type === 'NewService' && (
               <p>
                 <strong>Service ID:</strong> {selectedNotification.serviceId}
               </p>
             )}
           </div>
         </div>
       </div>
     </div>
     
      )}
    </div>
  );
};

export default UserNotifications;
