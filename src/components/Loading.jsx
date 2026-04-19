import React from 'react';
import './Loading.css';

const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <img src="/logo.svg" alt="Loading..." className="loading-logo" />
                <div className="loading-spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        </div>
    );
};

export default Loading;
