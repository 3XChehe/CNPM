// Phananh.js
import React, { useState, useEffect } from 'react';
import './Phananh.scss';
import AddGroup from './actions/addGroup';        
import AddFeedback from './actions/addFeedback';    
import GroupDetail from './actions/GroupDetail';   

const Phananh = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [nhomPAKN, setNhomPAKN] = useState([]);
    const [PAKN, setPAKN] = useState([]);
    const [changeHistory, setChangeHistory] = useState([]);
    const [showAddGroup, setShowAddGroup] = useState(false);
    const [showAddFeedback, setShowAddFeedback] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showGroupDetail, setShowGroupDetail] = useState(false);
    const [searchMode, setSearchMode] = useState('group');

    useEffect(() => {
        checkLogin();
        loadData();
    }, []);

    const checkLogin = () => {
        setCurrentUser('CB_PAKN');
        setUserRole('CB_PAKN');
    };

    const loadData = () => {
        const savedNhomPAKN = JSON.parse(localStorage.getItem('nhomPAKN')) || [];
        const savedPAKN = JSON.parse(localStorage.getItem('PAKN')) || [];
        const savedHistory = JSON.parse(localStorage.getItem('phananh_history')) || [];
        
        setNhomPAKN(savedNhomPAKN);
        setPAKN(savedPAKN);
        setChangeHistory(savedHistory);
    };

    const saveNhomPAKN = (updatedNhomPAKN) => {
        setNhomPAKN(updatedNhomPAKN);
        localStorage.setItem('nhomPAKN', JSON.stringify(updatedNhomPAKN));
    };

    const savePAKN = (updatedPAKN) => {
        setPAKN(updatedPAKN);
        localStorage.setItem('PAKN', JSON.stringify(updatedPAKN));
    };

    const saveHistory = (updatedHistory) => {
        setChangeHistory(updatedHistory);
        localStorage.setItem('phananh_history', JSON.stringify(updatedHistory));
    };

    const getStatusText = (status) => {
        const statusMap = {
            'resolved': 'Đã giải quyết',
            'unresolved': 'Chưa giải quyết'
        };
        return statusMap[status] || status;
    };

    const getFeedbackCount = (NhomPAKNId) => {
        return PAKN.filter(p => p.NhomPAKNId === NhomPAKNId).length;
    };

    const getFeedbacksByGroup = (NhomPAKNId) => {
        return PAKN.filter(p => p.NhomPAKNId === NhomPAKNId);
    };

    const getResolvedCountByGroup = (NhomPAKNId) => {
        return PAKN.filter(p => p.NhomPAKNId === NhomPAKNId && p.TrangThaiPAKN === 'resolved').length;
    };

    const getGroupName = (NhomPAKNId) => {
        const group = nhomPAKN.find(g => g.NhomPAKNId === NhomPAKNId);
        return group ? group.TenNhom : 'Không xác định';
    };

    const handleAddGroup = (newGroup) => {
        const groupToSave = {
            NhomPAKNId: Date.now().toString(),
            TenNhom: newGroup.TenNhom,
            NoiDungChinh: newGroup.NoiDungChinh,
            SoLuong: 0,
            createdDate: new Date().toISOString(),
            sender: currentUser
        };

        const updatedNhomPAKN = [...nhomPAKN, groupToSave];
        saveNhomPAKN(updatedNhomPAKN);
        setShowAddGroup(false);

        if (userRole === 'TT' || userRole === 'TP') {
            const newHistory = [...changeHistory, {
                code: `HIST_${Date.now()}`,
                account: currentUser,
                object: `Tạo nhóm phản ánh: ${newGroup.TenNhom}`,
                timestamp: new Date().toISOString()
            }];
            saveHistory(newHistory);
        }
    };

    const handleAddFeedback = (newFeedback) => {
        const feedbackToSave = {
            PAKNId: Date.now().toString(),
            CCCD: newFeedback.CCCD,
            NguoiPA: newFeedback.NguoiPA,
            NgayPhanAnh: newFeedback.NgayPhanAnh,
            NoiDung: newFeedback.NoiDung,
            Email: newFeedback.Email,
            Sdt: newFeedback.Sdt,
            NhomPAKNId: newFeedback.NhomPAKNId,
            TrangThaiPAKN: 'unresolved'
        };

        const updatedPAKN = [...PAKN, feedbackToSave];
        savePAKN(updatedPAKN);
        setShowAddFeedback(false);

        const updatedNhomPAKN = nhomPAKN.map(group => {
            if (group.NhomPAKNId === newFeedback.NhomPAKNId) {
                return {
                    ...group,
                    SoLuong: getFeedbackCount(group.NhomPAKNId) + 1
                };
            }
            return group;
        });
        saveNhomPAKN(updatedNhomPAKN);
    };

    const changeFeedbackStatus = (PAKNId) => {
        if (userRole !== 'TT' && userRole !== 'TP') {
            alert('Bạn không có quyền thay đổi trạng thái');
            return;
        }

        const updatedPAKN = PAKN.map(feedback => {
            if (feedback.PAKNId === PAKNId) {
                const newStatus = feedback.TrangThaiPAKN === 'resolved' ? 'unresolved' : 'resolved';
                return { ...feedback, TrangThaiPAKN: newStatus };
            }
            return feedback;
        });
        savePAKN(updatedPAKN);
    };

    const viewGroupDetails = (group) => {
        setSelectedGroup(group);
        setShowGroupDetail(true);
        setSearchTerm('');
    };

    const backToGroupList = () => {
        setShowGroupDetail(false);
        setSelectedGroup(null);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        
        if (term.trim() === '') {
            setSearchMode('group');
        } else if (/^\d+$/.test(term.trim())) {
            setSearchMode('cccd');
        } else {
            setSearchMode('group');
        }
    };

    const filteredGroups = nhomPAKN.filter(group => {
        return group.TenNhom.toLowerCase().includes(searchTerm.toLowerCase()) ||
               group.NoiDungChinh.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const filteredFeedbacksByCCCD = searchMode === 'cccd' && searchTerm.trim() 
        ? PAKN.filter(feedback => feedback.CCCD.includes(searchTerm.trim()))
        : [];

    const totalFeedbacks = PAKN.length;
    const resolvedCount = PAKN.filter(p => p.TrangThaiPAKN === 'resolved').length;
    const unresolvedCount = PAKN.filter(p => p.TrangThaiPAKN === 'unresolved').length;
    const resolvedPercentage = totalFeedbacks > 0 ? Math.round((resolvedCount / totalFeedbacks) * 100) : 0;
    const unresolvedPercentage = totalFeedbacks > 0 ? Math.round((unresolvedCount / totalFeedbacks) * 100) : 0;

    const renderGroupList = () => {
        return (
            <>
                <div className="action-buttons">
                    <button className="btn btn-primary" onClick={() => setShowAddGroup(true)}>
                        Thêm Nhóm Phản ánh
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowAddFeedback(true)}>
                        Thêm Phản ánh
                    </button>
                </div>

                <div className="search-container" style={{ marginBottom: '30px' }}>
                    <div className="search-box" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '8px',
                        border: '1px solid #dee2e6'
                    }}>
                        <div style={{ fontWeight: 'bold', color: '#333' }}>
                            Tìm kiếm:
                        </div>
                        <input
                            type="text"
                            placeholder="Nhập tên nhóm hoặc số CCCD..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                fontSize: '14px'
                            }}
                        />
                        <div style={{
                            fontSize: '12px',
                            color: '#6c757d',
                            fontStyle: 'italic'
                        }}>
                            {searchMode === 'cccd' ? 'Đang tìm theo CCCD' : 'Đang tìm theo tên nhóm'}
                        </div>
                    </div>
                </div>

                {searchMode === 'cccd' && searchTerm.trim() && (
                    <div className="search-results" style={{
                        marginBottom: '30px',
                        padding: '20px',
                        backgroundColor: '#fff3cd',
                        borderRadius: '8px',
                        border: '1px solid #ffeaa7'
                    }}>
                        <h3 style={{ marginTop: '0', color: '#856404' }}>
                            Kết quả tìm kiếm phản ánh theo CCCD: <strong>{searchTerm}</strong>
                        </h3>
                        {filteredFeedbacksByCCCD.length === 0 ? (
                            <p style={{ color: '#856404' }}>Không tìm thấy phản ánh nào với CCCD này.</p>
                        ) : (
                            <div className="feedback-list">
                                {filteredFeedbacksByCCCD.map(feedback => (
                                    <div key={feedback.PAKNId} className="feedback-card" style={{
                                        backgroundColor: 'white',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '5px',
                                        padding: '15px',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h4 style={{ margin: '0' }}>{feedback.NguoiPA} - {feedback.CCCD}</h4>
                                            <span style={{ 
                                                padding: '2px 8px', 
                                                borderRadius: '12px',
                                                backgroundColor: feedback.TrangThaiPAKN === 'resolved' ? '#d4edda' : '#f8d7da',
                                                color: feedback.TrangThaiPAKN === 'resolved' ? '#155724' : '#721c24',
                                                fontSize: '12px'
                                            }}>
                                                {getStatusText(feedback.TrangThaiPAKN)}
                                            </span>
                                        </div>
                                        <p style={{ margin: '10px 0' }}>{feedback.NoiDung}</p>
                                        <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                            {feedback.Email && <span>Email: {feedback.Email} | </span>}
                                            {feedback.Sdt && <span>SĐT: {feedback.Sdt} | </span>}
                                            <span>Nhóm: {getGroupName(feedback.NhomPAKNId)}</span>
                                        </div>
                                        <button 
                                            style={{
                                                marginTop: '10px',
                                                background: 'none',
                                                border: 'none',
                                                color: '#007bff',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                            onClick={() => {
                                                const group = nhomPAKN.find(g => g.NhomPAKNId === feedback.NhomPAKNId);
                                                if (group) viewGroupDetails(group);
                                            }}
                                        >
                                            Xem nhóm này →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="groups-section">
                    <h2>Danh sách Nhóm Phản ánh</h2>
                    {filteredGroups.length === 0 && searchTerm && searchMode === 'group' ? (
                        <div className="empty-state">
                            <p>Không tìm thấy nhóm phản ánh nào phù hợp.</p>
                        </div>
                    ) : (
                        <div className="groups-grid">
                            {filteredGroups.length === 0 && !searchTerm ? (
                                <div className="empty-state">
                                    <p>Chưa có nhóm phản ánh nào</p>
                                </div>
                            ) : (
                                filteredGroups.map(group => {
                                    const resolvedInGroup = getResolvedCountByGroup(group.NhomPAKNId);
                                    return (
                                        <div key={group.NhomPAKNId} className="group-card">
                                            <div className="group-header">
                                                <h3>{group.TenNhom}</h3>
                                                <div className="group-stats">
                                                    <span className="stat-resolved">{resolvedInGroup} đã giải quyết</span>
                                                    <span className="stat-unresolved">{group.SoLuong - resolvedInGroup} chưa giải quyết</span>
                                                </div>
                                            </div>
                                            <div className="group-content">
                                                <p><strong>Nội dung chính:</strong> {group.NoiDungChinh}</p>
                                                <p><strong>Tổng số phản ánh:</strong> {group.SoLuong || 0}</p>
                                                <p><strong>Người tạo:</strong> {group.sender}</p>
                                                <p><strong>Ngày tạo:</strong> {new Date(group.createdDate).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                            <div className="group-actions">
                                                <button 
                                                    className="btn btn-primary"
                                                    onClick={() => viewGroupDetails(group)}
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>

                {(userRole === 'TT' || userRole === 'TP') && (
                    <div className="statistics-section">
                        <div className="statistics-card">
                            <h3>Báo cáo Phản ánh, Kiến nghị</h3>
                            <div className="stats-overview">
                                <div className="stat-item">
                                    <span className="stat-number">{totalFeedbacks}</span>
                                    <span className="stat-label">Tổng số phản ánh</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{resolvedCount}</span>
                                    <span className="stat-label">Đã giải quyết</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{unresolvedCount}</span>
                                    <span className="stat-label">Chưa giải quyết</span>
                                </div>
                            </div>
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
                            </div>
                        </div>
                    </div>
                )}

                {(userRole === 'TT' || userRole === 'TP') && (
                    <div className="history-section">
                        <h3>Lịch sử thay đổi</h3>
                        <div className="history-list">
                            {changeHistory.map((change, index) => (
                                <div key={index} className="history-item">
                                    <div className="change-code">Mã: {change.code}</div>
                                    <div className="change-account">Tài khoản: {change.account}</div>
                                    <div className="change-object">Đối tượng: {change.object}</div>
                                    <div className="change-time">
                                        Thời gian: {new Date(change.timestamp).toLocaleString('vi-VN')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="phananh-container">
            <header className="phananh-header">
                <h1>Quản lý Phản ánh, Kiến nghị</h1>
                <div className="user-info">
                    Xin chào: {currentUser} ({userRole})
                </div>
            </header>

            <div className="phananh-content">
                {showGroupDetail ? (
                    <GroupDetail
                        group={selectedGroup}
                        feedbacks={getFeedbacksByGroup(selectedGroup.NhomPAKNId)}
                        userRole={userRole}
                        onBack={backToGroupList}
                        onAddFeedback={() => setShowAddFeedback(true)}
                        onChangeStatus={changeFeedbackStatus}
                    />
                ) : renderGroupList()}
            </div>

            {showAddGroup && (
                <AddGroup
                    onClose={() => setShowAddGroup(false)}
                    onSave={handleAddGroup}
                    currentUser={currentUser}
                />
            )}

            {showAddFeedback && (
                <AddFeedback
                    onClose={() => setShowAddFeedback(false)}
                    onSave={handleAddFeedback}
                    nhomPAKN={nhomPAKN}
                    selectedGroupId={selectedGroup?.NhomPAKNId}
                />
            )}
        </div>
    );
};

export default Phananh;