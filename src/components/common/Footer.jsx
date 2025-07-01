import React from 'react';

const Footer = () => (
  <footer style={{
    width: '100%',
    background: 'var(--cb-bg, #F1F5F9)',
    color: 'var(--cb-text-subtle, #6B7280)',
    textAlign: 'center',
    padding: '1.2rem 0',
    fontSize: '1rem',
    borderTop: '1px solid var(--cb-border, #E5E7EB)',
    marginTop: 'auto',
  }}>
    © {new Date().getFullYear()} CampusBuddy. Learn, Connect and Grow.
  </footer>
);

export default Footer; 