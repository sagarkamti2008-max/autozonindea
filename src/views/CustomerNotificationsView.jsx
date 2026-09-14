import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Bell, Check, CheckCheck, Tag, ShoppingBag, ExternalLink, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import {
  getCustomerNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getCustomerNotificationPreferences,
  updateCustomerNotificationPreferences
} from '../services/marketingAutomationService';

export const CustomerNotificationsView = () => {
  const { user, setCurrentView, showToast } = useStore();
  const customerId = user?.id || 'cust-101';

  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'settings'

  useEffect(() => {
    loadData();
  }, [customerId]);

  const loadData = () => {
    const notifs = getCustomerNotifications(customerId);
    setNotifications(notifs);
    const prefs = getCustomerNotificationPreferences(customerId);
    setPreferences(prefs);
  };

  const handleMarkRead = (id) => {
    const updated = markNotificationAsRead(id);
    setNotifications(updated.filter(n => n.customer_id === customerId || n.customer_id === 'all'));
    showToast('Notification marked as read', 'success');
  };

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsAsRead(customerId);
    setNotifications(updated.filter(n => n.customer_id === customerId || n.customer_id === 'all'));
    showToast('All notifications marked as read', 'success');
  };

  const handleTogglePref = (key) => {
    const updated = updateCustomerNotificationPreferences(customerId, { [key]: !preferences[key] });
    setPreferences(updated);
    showToast('Notification preferences saved', 'success');
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = activeTab === 'unread' ? notifications.filter(n => !n.read) : notifications;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-secondary" onClick={() => setCurrentView('home')} style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Bell color="#FF6B00" size={24} /> Customer Notifications & Activity Center
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Real-time transactional updates, shipment tracking, and promotional alerts
            </span>
          </div>
        </div>

        {unreadCount > 0 && activeTab !== 'settings' && (
          <button className="btn-secondary" onClick={handleMarkAllRead} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCheck size={16} color="#059669" /> Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
        <button
          className={`btn-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
          style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', background: activeTab === 'all' ? '#0F172A' : '#F1F5F9', color: activeTab === 'all' ? '#FFF' : '#334155', fontWeight: 600 }}
        >
          All ({notifications.length})
        </button>
        <button
          className={`btn-tab ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}
          style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', background: activeTab === 'unread' ? '#0F172A' : '#F1F5F9', color: activeTab === 'unread' ? '#FFF' : '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          Unread {unreadCount > 0 && <span style={{ background: '#FF6B00', color: '#FFF', borderRadius: '50px', fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>{unreadCount}</span>}
        </button>
        <button
          className={`btn-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', background: activeTab === 'settings' ? '#0F172A' : '#F1F5F9', color: activeTab === 'settings' ? '#FFF' : '#334155', fontWeight: 600 }}
        >
          Notification Preferences
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'settings' ? (
        <div className="portal-card" style={{ maxWidth: '700px' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#059669" /> Communication & Consent Preferences
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
            Choose how AutoZoneIndia notifies you regarding order status updates, express delivery alerts, and exclusive automotive discounts.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div>
                <b style={{ display: 'block', fontSize: '0.95rem' }}>Transactional Order & Tracking Updates</b>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Order confirmation, AWB dispatch, delivery status, and warranty alerts</span>
              </div>
              <input type="checkbox" checked={preferences.order_updates !== false} onChange={() => handleTogglePref('order_updates')} style={{ width: '18px', height: '18px' }} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div>
                <b style={{ display: 'block', fontSize: '0.95rem' }}>Promotional & Special Offers</b>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Price drop alerts, back-in-stock notifications, and festival discount coupons</span>
              </div>
              <input type="checkbox" checked={preferences.promotional_messages !== false} onChange={() => handleTogglePref('promotional_messages')} style={{ width: '18px', height: '18px' }} />
            </label>

            <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Channel Preferences</h4>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span>Email Notifications</span>
              <input type="checkbox" checked={preferences.email_enabled !== false} onChange={() => handleTogglePref('email_enabled')} style={{ width: '18px', height: '18px' }} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span>WhatsApp Alerts & Tracking Updates</span>
              <input type="checkbox" checked={preferences.whatsapp_enabled !== false} onChange={() => handleTogglePref('whatsapp_enabled')} style={{ width: '18px', height: '18px' }} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span>SMS Text Messages</span>
              <input type="checkbox" checked={preferences.sms_enabled === true} onChange={() => handleTogglePref('sms_enabled')} style={{ width: '18px', height: '18px' }} />
            </label>
          </div>
        </div>
      ) : (
        <div>
          {filteredNotifications.length === 0 ? (
            <div className="portal-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Bell size={48} color="#CBD5E1" style={{ marginBottom: '1rem' }} />
              <h3>No {activeTab === 'unread' ? 'Unread' : ''} Notifications</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>You are all caught up! New order updates and notifications will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredNotifications.map(n => (
                <div
                  key={n.id}
                  className="portal-card"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justify: 'space-between',
                    gap: '1rem',
                    background: n.read ? '#FFFFFF' : '#EFF6FF',
                    borderLeft: n.read ? '4px solid #CBD5E1' : '4px solid #3B82F6',
                    padding: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ background: n.type === 'promotional' ? '#FEF3C7' : '#DBEAFE', padding: '0.6rem', borderRadius: '50px' }}>
                      {n.type === 'promotional' ? <Tag size={20} color="#D97706" /> : <ShoppingBag size={20} color="#2563EB" />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{n.title}</h4>
                        {!n.read && (
                          <span style={{ background: '#3B82F6', color: '#FFF', fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                            NEW
                          </span>
                        )}
                      </div>

                      <p style={{ margin: '0 0 0.5rem 0', color: '#334155', fontSize: '0.9rem', lineHeight: '1.4' }}>
                        {n.message}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#64748B' }}>
                        <span>{new Date(n.created_at || Date.now()).toLocaleString('en-IN')}</span>
                        {n.order_id && (
                          <button
                            onClick={() => setCurrentView('track-order')}
                            style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: 0 }}
                          >
                            View Order #{n.order_id} <ExternalLink size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {!n.read && (
                    <button
                      className="btn-secondary"
                      onClick={() => handleMarkRead(n.id)}
                      title="Mark as Read"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Check size={14} /> Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
