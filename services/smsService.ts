// services/smsService.ts
import axios from 'axios';

export const analyzeSMS = async (message: string) => {
    try {
        const response = await axios.post('http://10.0.2.2:8000/analyze-sms/', { message });
        return response.data;
    } catch (error) {
        console.error('Error sending SMS to API:', error);
        throw error;
    }
};
