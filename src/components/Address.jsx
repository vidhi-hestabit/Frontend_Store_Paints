import React, { useContext, useState } from 'react';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Address = () => {
    const { shippingAddress, userAddress } = useContext(AppContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullName: '', address: '', city: '', state: '', country: '', pincode: '', phoneNumber: '' });

    const onChangerHandler = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const { fullName, address, city, state, country, pincode, phoneNumber } = formData;
        const result = await shippingAddress(fullName, address, city, state, country, pincode, phoneNumber);
        if (result.success) navigate('/checkout');
        setFormData({ fullName: '', address: '', city: '', state: '', country: '', pincode: '', phoneNumber: '' });
    };

    return (
        <div style={{ maxWidth: '680px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '0.4rem' }}>Shipping Address</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Enter your delivery details below</p>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', boxShadow: 'var(--shadow)' }}>
                <form onSubmit={submitHandler}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="paint-form-group">
                            <label className="paint-form-label">Full Name</label>
                            <input name="fullName" value={formData.fullName} onChange={onChangerHandler} type="text" className="paint-form-input" />
                        </div>
                        <div className="paint-form-group">
                            <label className="paint-form-label">Phone Number</label>
                            <input name="phoneNumber" value={formData.phoneNumber} onChange={onChangerHandler} type="number" className="paint-form-input" />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="paint-form-group">
                            <label className="paint-form-label">Country</label>
                            <input name="country" value={formData.country} onChange={onChangerHandler} type="text" className="paint-form-input" />
                        </div>
                        <div className="paint-form-group">
                            <label className="paint-form-label">State</label>
                            <input name="state" value={formData.state} onChange={onChangerHandler} type="text" className="paint-form-input" />
                        </div>
                        <div className="paint-form-group">
                            <label className="paint-form-label">City</label>
                            <input name="city" value={formData.city} onChange={onChangerHandler} type="text" className="paint-form-input" />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="paint-form-group">
                            <label className="paint-form-label">Pincode</label>
                            <input name="pincode" value={formData.pincode} onChange={onChangerHandler} type="number" className="paint-form-input" />
                        </div>
                        <div className="paint-form-group">
                            <label className="paint-form-label">Address / Nearby Landmark</label>
                            <textarea name="address" value={formData.address} onChange={onChangerHandler} className="paint-form-input" rows={1} />
                        </div>
                    </div>

                    <button type="submit" className="btn-paint-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}>
                        Save & Continue to Checkout
                    </button>
                </form>
            </div>

            {userAddress && (
                <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>— or —</p>
                    <button className="btn-paint-outline" style={{ padding: '0.65rem 2rem' }} onClick={() => navigate('/checkout')}>
                        Use Saved Address
                    </button>
                </div>
            )}
        </div>
    );
};

export default Address;