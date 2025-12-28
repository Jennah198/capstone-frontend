import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useEventContext } from '../../../context/EventContext';
import { toastSuccess, toastError } from '../../../../utility/toast';

const VerifyPaymentPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { verifyPayment } = useEventContext();
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        const tx_ref = searchParams.get('trx_ref') || searchParams.get('tx_ref');

        if (!tx_ref) {
            setStatus('failed');
            setMessage('Invalid transaction reference.');
            return;
        }

        const verify = async () => {
            try {
                const res = await verifyPayment(tx_ref);
                if (res.status === 'success' || res.success) {
                    setStatus('success');
                    setMessage('Payment verified successfully!');
                    toastSuccess('Payment successful!');
                    setTimeout(() => navigate('/ticket-success'), 2000);
                } else {
                    throw new Error('Verification failed');
                }
            } catch (err: any) {
                setStatus('failed');
                setMessage(err.response?.data?.message || 'Payment verification failed.');
                toastError('Payment failed or was cancelled.');
            }
        };

        verify();
    }, [searchParams, verifyPayment, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                {status === 'verifying' && (
                    <>
                        <FaSpinner className="animate-spin text-5xl text-green-600 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
                        <p className="text-gray-600">{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <FaCheckCircle className="text-5xl text-green-600 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <p className="text-sm text-gray-500">Redirecting to your tickets...</p>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <FaTimesCircle className="text-5xl text-red-600 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
                        <p className="text-gray-600 mb-8">{message}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-full transition"
                        >
                            Back to Home
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyPaymentPage;
