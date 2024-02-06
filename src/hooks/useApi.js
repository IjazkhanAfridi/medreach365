// Import necessary dependencies
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://conversational.avatare.com';

const useApi = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = async (url, method = 'get', body = null, headers = {}) => {
    setLoading(true);

    try {
      const config = {
        method,
        url: `${BASE_URL}/${url}`,
        headers,
      };

      if (body && method !== 'get') {
        config.data = body;
      }
      const response = await axios(config);
      setData(response.data);
    } catch (err) {
      if(err?.response?.data?.detail == "Given token not valid for any token type"){
        localStorage.clear()
        navigate("/login")
      }
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Wrapper functions for common HTTP methods
  const get = (url, headers = {}) => makeRequest(url, 'get', null, headers);
  const post = (url, body, headers = {}) => makeRequest(url, 'post', body, headers);
  const put = (url, body, headers = {}) => makeRequest(url, 'put', body, headers);
  const patch = (url, body, headers = {}) => makeRequest(url, 'patch', body, headers);
  const remove = (url, headers = {}) => makeRequest(url, 'delete', null, headers)

  // Function to make a request with FormData
  const postFormData = async (url, formData, headers = {}) => {
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/${url}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...headers,
        },
      });
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    patch,
    remove,
    postFormData,
  };
};

export default useApi;
