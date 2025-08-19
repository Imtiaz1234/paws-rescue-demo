exports.charge = async (amount, paymentInfo) => {
  return Promise.resolve({ id: 'ch_mock_123456', amount, status: 'succeeded' });
};
