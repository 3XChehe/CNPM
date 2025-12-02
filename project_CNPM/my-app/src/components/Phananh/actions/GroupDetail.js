import React, { useState } from 'react';
import './GroupDetail.scss';

const GroupDetail = ({ 
    group, 
    feedbacks, 
    userRole, 
    onBack, 
    onAddFeedback,
    onChangeStatus 
}) => {
    
    // State cho filter và tìm kiếm
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'resolved', 'unresolved'
    const [searchCCCD, setSearchCCCD] = useState('');
    const [showChart, setShowChart] = useState(false);
    
    const getStatusText = (status) => {
        const statusMap = {
            'resolved': 'Đã giải quyết',
            'unresolved': 'Chưa giải quyết'
        };
        return statusMap[status] || status;
    };

    // Thống kê
    const totalFeedbacks = feedbacks.length;
    const resolvedCount = feedbacks.filter(f => f.TrangThaiPAKN === 'resolved').length;
    const unresolvedCount = feedbacks.filter(f => f.TrangThaiPAKN === 'unresolved').length;
    const resolvedPercentage = totalFeedbacks > 0 ? Math.round((resolvedCount / totalFeedbacks) * 100) : 0;
    const unresolvedPercentage = totalFeedbacks > 0 ? Math.round((unresolvedCount / totalFeedbacks) * 100) : 0;

    // Lọc phản ánh theo trạng thái
    const filteredByStatus = feedbacks.filter(feedback => {
        if (filterStatus === 'all') return true;
        return feedback.TrangThaiPAKN === filterStatus;
    });

    // Tìm kiếm theo CCCD
    const filteredFeedbacks = filteredByStatus.filter(feedback => {
        if (!searchCCCD.trim()) return true;
        return feedback.CCCD.includes(searchCCCD.trim());
    });

    return (
        <div className="group-detail-view">
            {/* Header với nút quay lại */}
            <div className="detail-header">
                <button className="btn btn-back" onClick={onBack}>
                    ← Quay lại danh sách nhóm
                </button>
                <h2>Chi tiết nhóm: {group.TenNhom}</h2>
            </div>

            {/* Thông tin nhóm */}
            <div className="group-info">
                <div className="info-card">
                    <h3>Thông tin nhóm</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <strong>Nội dung chính:</strong>
                            <p>{group.NoiDungChinh}</p>
                        </div>
                        <div className="info-item">
                            <strong>Tổng số phản ánh:</strong>
                            <span className="stat-number">{totalFeedbacks}</span>
                        </div>
                        <div className="info-item">
                            <strong>Đã giải quyết:</strong>
                            <span className="stat-resolved">{resolvedCount}</span>
                        </div>
                        <div className="info-item">
                            <strong>Chưa giải quyết:</strong>
                            <span className="stat-unresolved">{unresolvedCount}</span>
                        </div>
                        <div className="info-item">
                            <strong>Người tạo:</strong>
                            <span>{group.sender}</span>
                        </div>
                        <div className="info-item">
                            <strong>Ngày tạo:</strong>
                            <span>{new Date(group.createdDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>
                    
                    {/* Nút hiển thị biểu đồ */}
                    <div className="chart-toggle">
                        <button 
                            className={`btn ${showChart ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setShowChart(!showChart)}
                        >
                            {showChart ? 'Ẩn biểu đồ' : 'Hiển thị biểu đồ thống kê'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Biểu đồ thống kê */}
            {showChart && (
                <div className="chart-section">
                    <h4>Biểu đồ thống kê trạng thái phản ánh</h4>
                    <div className="chart-container">
                        <div className="pie-chart">
                            <div 
                                className="chart-segment resolved" 
                                style={{ '--percentage': `${resolvedPercentage}%` }}
                            >
                                <span>{resolvedPercentage}% Đã giải quyết</span>
                            </div>
                            <div 
                                className="chart-segment unresolved" 
                                style={{ '--percentage': `${unresolvedPercentage}%` }}
                            >
                                <span>{unresolvedPercentage}% Chưa giải quyết</span>
                            </div>
                        </div>
                        <div className="chart-legend">
                            <div className="legend-item">
                                <div className="legend-color resolved"></div>
                                <span>Đã giải quyết: {resolvedCount} ({resolvedPercentage}%)</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color unresolved"></div>
                                <span>Chưa giải quyết: {unresolvedCount} ({unresolvedPercentage}%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Thanh công cụ: Filter, tìm kiếm, thêm phản ánh */}
            <div className="toolbar">
                <div className="toolbar-left">
                    {/* Filter theo trạng thái */}
                    <div className="filter-control">
                        <label>Hiển thị:</label>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="status-filter"
                        >
                            <option value="all">Tất cả ({totalFeedbacks})</option>
                            <option value="resolved">Đã giải quyết ({resolvedCount})</option>
                            <option value="unresolved">Chưa giải quyết ({unresolvedCount})</option>
                        </select>
                    </div>

                    {/* Tìm kiếm theo CCCD */}
                    <div className="search-control">
                        <label>Tìm theo CCCD:</label>
                        <input
                            type="text"
                            placeholder="Nhập số CCCD..."
                            value={searchCCCD}
                            onChange={(e) => setSearchCCCD(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="toolbar-right">
                    <button 
                        className="btn btn-primary"
                        onClick={onAddFeedback}
                    >
                        + Thêm Phản ánh
                    </button>
                </div>
            </div>

            {/* Danh sách phản ánh */}
            <div className="feedbacks-section">
                <div className="section-header">
                    <h3>Danh sách Phản ánh ({filteredFeedbacks.length}/{totalFeedbacks})</h3>
                    {searchCCCD && (
                        <div className="search-info">
                            Đang hiển thị kết quả tìm kiếm cho CCCD: <strong>{searchCCCD}</strong>
                        </div>
                    )}
                </div>
                
                <div className="feedbacks-list">
                    {filteredFeedbacks.length === 0 ? (
                        <div className="empty-state">
                            {searchCCCD ? (
                                <p>Không tìm thấy phản ánh nào với CCCD "{searchCCCD}" trong nhóm này.</p>
                            ) : filterStatus !== 'all' ? (
                                <p>Không có phản ánh nào ở trạng thái "{getStatusText(filterStatus)}".</p>
                            ) : (
                                <p>Chưa có phản ánh nào trong nhóm này.</p>
                            )}
                        </div>
                    ) : (
                        filteredFeedbacks.map(feedback => (
                            <div key={feedback.PAKNId} className="feedback-card">
                                <div className="feedback-header">
                                    <div className="feedback-info">
                                        <h4>{feedback.NguoiPA}</h4>
                                        <div className="feedback-id">
                                            CCCD: <strong>{feedback.CCCD}</strong>
                                        </div>
                                    </div>
                                    <div className="feedback-status">
                                        <span className={`status-badge ${feedback.TrangThaiPAKN}`}>
                                            {getStatusText(feedback.TrangThaiPAKN)}
                                        </span>
                                        <span className="date">
                                            {new Date(feedback.NgayPhanAnh).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                                <div className="feedback-content">
                                    <p>{feedback.NoiDung}</p>
                                </div>
                                <div className="feedback-contact">
                                    {feedback.Email && (
                                        <div className="contact-item">
                                            <span className="contact-label">Email:</span>
                                            <span className="contact-value">{feedback.Email}</span>
                                        </div>
                                    )}
                                    {feedback.Sdt && (
                                        <div className="contact-item">
                                            <span className="contact-label">SĐT:</span>
                                            <span className="contact-value">{feedback.Sdt}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="feedback-actions">
                                    {(userRole === 'TT' || userRole === 'TP') && (
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => onChangeStatus(feedback.PAKNId)}
                                        >
                                            {feedback.TrangThaiPAKN === 'resolved' 
                                                ? 'Đánh dấu chưa giải quyết' 
                                                : 'Đánh dấu đã giải quyết'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupDetail;