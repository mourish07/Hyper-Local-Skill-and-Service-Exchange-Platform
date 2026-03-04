import api from './api';

const createRequest = async (requestData) => {
    const response = await api.post('/requests', requestData);
    return response.data;
};

const getRequests = async (role) => {
    const response = await api.get('/requests', { params: { role } });
    return response.data;
};

const updateRequestStatus = async (id, status) => {
    const response = await api.put(`/requests/${id}/status`, { status });
    return response.data;
};

export default {
    createRequest,
    getRequests,
    updateRequestStatus
};
