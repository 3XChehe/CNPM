// components/AddGroup.js
import React, { useState } from 'react';
import './addGroup.scss';

const AddGroup = ({ onClose, onSave, currentUser }) => {
    const [formData, setFormData] = useState({
        TenNhom: '',
        NoiDungChinh: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.TenNhom || !formData.NoiDungChinh) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Thêm Nhóm Phản ánh Mới</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="group-form">
                    <div className="form-group">
                        <label htmlFor="TenNhom">Tên nhóm phản ánh *</label>
                        <input
                            type="text"
                            id="TenNhom"
                            name="TenNhom"
                            value={formData.TenNhom}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="NoiDungChinh">Nội dung chính *</label>
                        <textarea
                            id="NoiDungChinh"
                            name="NoiDungChinh"
                            value={formData.NoiDungChinh}
                            onChange={handleChange}
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-cancel" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Tạo Nhóm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGroup;