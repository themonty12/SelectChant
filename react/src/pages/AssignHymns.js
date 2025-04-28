import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';

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

const AssignHymns = () => {
  const [dates, setDates] = useState({
    today: '',
    nextSunday: ''
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [hymnNumber, setHymnNumber] = useState('');
  const [hymnTitle, setHymnTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('entrance');
  const [assignedHymns, setAssignedHymns] = useState({
    entrance: { number: '', title: '' },
    offertory: { number: '', title: '' },
    communion: { number: '', title: '' },
    recessional: { number: '', title: '' }
  });
  const [randomHymns, setRandomHymns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [replacementData, setReplacementData] = useState(null);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAssignedHymns(selectedDate);
    }
  }, [selectedDate]);

  const showErrorMessage = (message) => {
    setError(message);
    setShowError(true);
  };

  const fetchDates = async () => {
    try {
      console.log('API 기본 URL:', API_BASE_URL);
      const response = await api.get('/api/hymns/dates');
      console.log('날짜 데이터:', response.data);
      setDates(response.data);
      // 자동으로 다음 일요일 선택
      setSelectedDate(response.data.nextSunday);
    } catch (error) {
      console.error('Error fetching dates:', error);
      showErrorMessage('날짜 정보를 가져오는데 실패했습니다.');
    }
  };

  const fetchAssignedHymns = async (date) => {
    try {
      const response = await api.get(`/api/hymns/assigned`, { 
        params: { date }
      });
      console.log('지정된 성가 데이터:', response.data);
      if (response.data && response.data.length > 0) {
        const hymnsObj = {
          entrance: { number: '', title: '' },
          offertory: { number: '', title: '' },
          communion: { number: '', title: '' },
          recessional: { number: '', title: '' }
        };
        
        response.data.forEach(hymn => {
          switch(hymn.category) {
            case '입당':
              hymnsObj.entrance = { number: hymn.number, title: hymn.title };
              break;
            case '봉헌':
              hymnsObj.offertory = { number: hymn.number, title: hymn.title };
              break;
            case '성체':
              hymnsObj.communion = { number: hymn.number, title: hymn.title };
              break;
            case '파견':
              hymnsObj.recessional = { number: hymn.number, title: hymn.title };
              break;
            default:
              break;
          }
        });
        
        setAssignedHymns(hymnsObj);
      }
    } catch (error) {
      console.error('Error fetching assigned hymns:', error);
      showErrorMessage('지정된 성가 정보를 가져오는데 실패했습니다.');
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleHymnNumberChange = async (e) => {
    const number = e.target.value;
    setHymnNumber(number);
    
    if (number) {
      try {
        // 테스트용 직접 데이터 읽기
        const response = await api.get(`/api/hymns/${number}`);
        console.log('성가 정보 응답:', response.data);
        if (response.data) {
          setHymnTitle(response.data.title);
        } else {
          setHymnTitle('');
        }
      } catch (error) {
        console.error('Error fetching hymn:', error);
        setHymnTitle('');
        if (error.response && error.response.status === 404) {
          showErrorMessage(`${number}번 성가를 찾을 수 없습니다.`);
        }
      }
    } else {
      setHymnTitle('');
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAddHymn = () => {
    if (hymnNumber && hymnTitle && selectedCategory) {
      const newAssignedHymns = { ...assignedHymns };
      newAssignedHymns[selectedCategory] = {
        number: hymnNumber,
        title: hymnTitle
      };
      setAssignedHymns(newAssignedHymns);
      
      // 입력 필드 초기화
      setHymnNumber('');
      setHymnTitle('');
    }
  };

  const handleAssignHymns = async () => {
    try {
      const hymnData = {
        date: selectedDate,
        hymns: {
          entrance: assignedHymns.entrance,
          offertory: assignedHymns.offertory,
          communion: assignedHymns.communion,
          recessional: assignedHymns.recessional
        }
      };
      
      console.log('성가 지정 요청 데이터:', hymnData);
      const response = await api.post('/api/hymns/assign', hymnData);
      console.log('성가 지정 응답:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error assigning hymns:', error);
      if (error.response && error.response.status === 409) {
        setReplacementData({ 
          date: selectedDate,
          hymns: assignedHymns
        });
        setShowModal(true);
      } else {
        showErrorMessage('성가 지정 중 오류가 발생했습니다.');
      }
    }
  };

  const handleRandomSelect = async () => {
    try {
      const response = await api.get('/api/hymns/random');
      console.log('랜덤 성가 응답:', response.data);
      setRandomHymns(response.data);

      // 랜덤으로 선택된 성가를 카테고리에 할당
      if (response.data && response.data.length >= 4) {
        setAssignedHymns({
          entrance: { number: response.data[0].number, title: response.data[0].title },
          offertory: { number: response.data[1].number, title: response.data[1].title },
          communion: { number: response.data[2].number, title: response.data[2].title },
          recessional: { number: response.data[3].number, title: response.data[3].title }
        });
      }
    } catch (error) {
      console.error('Error fetching random hymns:', error);
      showErrorMessage('랜덤 성가 선택 중 오류가 발생했습니다.');
    }
  };

  const handleConfirmReplace = async () => {
    try {
      console.log('성가 교체 요청 데이터:', replacementData);
      const response = await api.post('/api/hymns/replace', {
        date: replacementData.date,
        hymns: replacementData.hymns
      });
      console.log('성가 교체 응답:', response.data);
      setShowModal(false);
      navigate('/');
    } catch (error) {
      console.error('Error replacing hymns:', error);
      setShowModal(false);
      showErrorMessage('성가 교체 중 오류가 발생했습니다.');
    }
  };

  const getCategoryLabel = (category) => {
    switch(category) {
      case 'entrance': return '입당';
      case 'offertory': return '봉헌';
      case 'communion': return '영성체';
      case 'recessional': return '퇴장';
      default: return '';
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        성가 지정
      </Typography>
      
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="subtitle1" gutterBottom>
          오늘 날짜: {dates.today ? new Date(dates.today).toLocaleDateString() : ''}
        </Typography>
        
        <FormControl fullWidth sx={{ maxWidth: 300, mx: 'auto', mt: 2 }}>
          <InputLabel htmlFor="date" shrink>날짜 선택</InputLabel>
          <TextField
            id="date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleRandomSelect}
          sx={{ mt: 2, mb: 2 }}
        >
          랜덤 성가 선택
        </Button>
      </Box>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={5}>
            <TextField
              label="성가 번호"
              type="number"
              value={hymnNumber}
              onChange={handleHymnNumberChange}
              fullWidth
              margin="normal"
              placeholder="번호 입력"
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-select-label">분야</InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="분야"
              >
                <MenuItem value="entrance">입당</MenuItem>
                <MenuItem value="offertory">봉헌</MenuItem>
                <MenuItem value="communion">영성체</MenuItem>
                <MenuItem value="recessional">퇴장</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="outlined"
              onClick={handleAddHymn}
              fullWidth
              disabled={!hymnNumber || !hymnTitle}
            >
              추가
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              {hymnTitle ? `선택된 성가: ${hymnTitle}` : ''}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        선택된 성가
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {Object.entries(assignedHymns).map(([category, hymn]) => (
          <Grid item xs={12} sm={6} md={3} key={category}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1" component="div" gutterBottom>
                  {getCategoryLabel(category)}
                </Typography>
                {hymn.number ? (
                  <>
                    <Typography variant="h6" component="div">
                      {hymn.number}번
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {hymn.title}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    선택되지 않음
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ textAlign: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAssignHymns}
          sx={{ minWidth: 200 }}
          disabled={!Object.values(assignedHymns).some(hymn => hymn.number)}
        >
          성가 지정
        </Button>
      </Box>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>성가 교체 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            이 날짜에 이미 지정된 성가가 있습니다. 교체하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="error">
            취소
          </Button>
          <Button onClick={handleConfirmReplace} color="primary">
            교체
          </Button>
        </DialogActions>
      </Dialog>

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
};

export default AssignHymns; 