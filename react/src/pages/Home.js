import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

// API 기본 URL 설정 - 개발 환경에 맞게 설정
const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL
});

// API 응답 및 오류 로깅
api.interceptors.request.use(request => {
  console.log('API 요청:', request.method, request.url);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('API 응답:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API 오류:', 
      error.response ? `${error.response.status} - ${error.response.config.url}` : error.message
    );
    return Promise.reject(error);
  }
);

function Home() {
  const [selectedHymns, setSelectedHymns] = useState([]);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const handleRandomSelect = async () => {
    try {
      console.log('랜덤 성가 요청...');
      const response = await api.get('/api/hymns/random');
      console.log('랜덤 성가 응답:', response.data);
      setSelectedHymns(response.data);
    } catch (error) {
      console.error('Error fetching random hymns:', error);
      setError('랜덤 성가를 가져오는데 실패했습니다.');
      setShowError(true);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        성가 랜덤 선택
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRandomSelect}
        sx={{ mb: 3 }}
      >
        랜덤 선택
      </Button>
      <Grid container spacing={2}>
        {selectedHymns.map((hymn) => (
          <Grid item xs={12} sm={6} md={4} key={hymn.number}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {hymn.number}번
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {hymn.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar 
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Home; 