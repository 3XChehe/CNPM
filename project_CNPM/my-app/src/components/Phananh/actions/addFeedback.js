// 
// JS/addFeedback.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './addFeedback.scss';

const AddFeedback = ({ onClose, onSave, nhomPAKN, selectedGroupId }) => {
    const [formData, setFormData] = useState({
        NguoiPA: '',
        CCCD: '',
        NoiDung: '',
        NgayPhanAnh: new Date().toISOString().split('T')[0],
        Email: '',
        Sdt: '',
        NhomPAKNId: selectedGroupId || ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Khi selectedGroupId thay đổi, cập nhật form
    useEffect(() => {
        if (selectedGroupId) {
            setFormData(prev => ({
                ...prev,
                NhomPAKNId: selectedGroupId
            }));
        }
    }, [selectedGroupId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Clear error khi người dùng bắt đầu nhập
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Validate các trường bắt buộc
        if (!formData.NguoiPA.trim()) {
            newErrors.NguoiPA = 'Vui lòng nhập tên người phản ánh';
        }
        
        if (!formData.CCCD.trim()) {
            newErrors.CCCD = 'Vui lòng nhập CMND/CCCD';
        } else if (!/^\d{9,12}$/.test(formData.CCCD.trim())) {
            newErrors.CCCD = 'CMND/CCCD phải có 9-12 chữ số';
        }
        
        if (!formData.NoiDung.trim()) {
            newErrors.NoiDung = 'Vui lòng nhập nội dung phản ánh';
        } else if (formData.NoiDung.trim().length < 10) {
            newErrors.NoiDung = 'Nội dung phải có ít nhất 10 ký tự';
        }
        
        if (!formData.NgayPhanAnh) {
            newErrors.NgayPhanAnh = 'Vui lòng chọn ngày phản ánh';
        } else {
            const selectedDate = new Date(formData.NgayPhanAnh);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate > today) {
                newErrors.NgayPhanAnh = 'Ngày phản ánh không thể là ngày tương lai';
            }
        }
        
        if (!formData.NhomPAKNId) {
            newErrors.NhomPAKNId = 'Vui lòng chọn nhóm phản ánh';
        }
        
        // Validate email nếu có nhập
        if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
            newErrors.Email = 'Email không hợp lệ';
        }
        
        // Validate số điện thoại nếu có nhập
        if (formData.Sdt && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.Sdt)) {
            newErrors.Sdt = 'Số điện thoại không hợp lệ';
        }
        
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setIsSubmitting(true);
        try {
            await onSave(formData);
            // onSave sẽ xử lý đóng modal sau khi lưu thành công
        } catch (error) {
            console.error('Lỗi khi lưu phản ánh:', error);
            alert('Có lỗi xảy ra khi lưu phản ánh. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return;
        onClose();
    };

    // Xử lý phím ESC để đóng modal
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && !isSubmitting) {
                onClose();
            }
        };
        
        window.addEventListener('keydown', handleEscKey);
        return () => window.removeEventListener('keydown', handleEscKey);
    }, [onClose, isSubmitting]);

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Thêm phản ánh mới</h2>
                    <button 
                        className="close-btn" 
                        onClick={handleClose}
                        disabled={isSubmitting}
                        aria-label="Đóng"
                    >
                        ×
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="feedback-form">
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="NguoiPA" className="required">
                                    Người phản ánh
                                </label>
                                <input
                                    type="text"
                                    id="NguoiPA"
                                    name="NguoiPA"
                                    value={formData.NguoiPA}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className={errors.NguoiPA ? 'error' : ''}
                                    placeholder="Nhập họ tên người phản ánh"
                                />
                                {errors.NguoiPA && (
                                    <span className="error-message">{errors.NguoiPA}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="CCCD" className="required">
                                    CMND/CCCD
                                </label>
                                <input
                                    type="text"
                                    id="CCCD"
                                    name="CCCD"
                                    value={formData.CCCD}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className={errors.CCCD ? 'error' : ''}
                                    placeholder="Nhập 9-12 chữ số"
                                    maxLength="12"
                                />
                                {errors.CCCD && (
                                    <span className="error-message">{errors.CCCD}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="NoiDung" className="required">
                                Nội dung phản ánh
                            </label>
                            <textarea
                                id="NoiDung"
                                name="NoiDung"
                                value={formData.NoiDung}
                                onChange={handleChange}
                                rows="4"
                                disabled={isSubmitting}
                                className={errors.NoiDung ? 'error' : ''}
                                placeholder="Mô tả chi tiết nội dung phản ánh (tối thiểu 10 ký tự)"
                            />
                            <div className="text-counter">
                                {formData.NoiDung.length} ký tự
                            </div>
                            {errors.NoiDung && (
                                <span className="error-message">{errors.NoiDung}</span>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="NgayPhanAnh" className="required">
                                    Ngày phản ánh
                                </label>
                                <input
                                    type="date"
                                    id="NgayPhanAnh"
                                    name="NgayPhanAnh"
                                    value={formData.NgayPhanAnh}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className={errors.NgayPhanAnh ? 'error' : ''}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                                {errors.NgayPhanAnh && (
                                    <span className="error-message">{errors.NgayPhanAnh}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="NhomPAKNId" className="required">
                                    Nhóm phản ánh
                                </label>
                                <select
                                    id="NhomPAKNId"
                                    name="NhomPAKNId"
                                    value={formData.NhomPAKNId}
                                    onChange={handleChange}
                                    disabled={!!selectedGroupId || isSubmitting}
                                    className={errors.NhomPAKNId ? 'error' : ''}
                                >
                                    <option value="">-- Chọn nhóm phản ánh --</option>
                                    {nhomPAKN.map(group => (
                                        <option key={group.NhomPAKNId} value={group.NhomPAKNId}>
                                            {group.TenNhom}
                                        </option>
                                    ))}
                                </select>
                                {selectedGroupId && (
                                    <div className="info-message">
                                        <small>Đang thêm vào nhóm hiện tại</small>
                                    </div>
                                )}
                                {errors.NhomPAKNId && !selectedGroupId && (
                                    <span className="error-message">{errors.NhomPAKNId}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="Email">Email</label>
                                <input
                                    type="email"
                                    id="Email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className={errors.Email ? 'error' : ''}
                                    placeholder="example@email.com"
                                />
                                {errors.Email && (
                                    <span className="error-message">{errors.Email}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="Sdt">Số điện thoại</label>
                                <input
                                    type="tel"
                                    id="Sdt"
                                    name="Sdt"
                                    value={formData.Sdt}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className={errors.Sdt ? 'error' : ''}
                                    placeholder="0xxxxxxxxx"
                                />
                                {errors.Sdt && (
                                    <span className="error-message">{errors.Sdt}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-cancel" 
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Đang lưu...
                                </>
                            ) : (
                                'THÊM PHẢN ÁNH'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

AddFeedback.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    nhomPAKN: PropTypes.arrayOf(
        PropTypes.shape({
            NhomPAKNId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            TenNhom: PropTypes.string.isRequired
        })
    ).isRequired,
    selectedGroupId: PropTypes.string
};

AddFeedback.defaultProps = {
    nhomPAKN: [],
    selectedGroupId: ''
};

export default AddFeedback;