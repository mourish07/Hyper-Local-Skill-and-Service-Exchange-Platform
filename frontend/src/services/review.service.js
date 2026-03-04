import api from './api';

const addReview = async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
};

const getServiceReviews = async (serviceId) => {
    const response = await api.get(`/reviews/service/${serviceId}`);
    return response.data;
};

export default {
    addReview,
    getServiceReviews
};
