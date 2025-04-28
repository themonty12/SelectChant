import React, { useState } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Search as SearchIcon, NavigateBefore, NavigateNext } from '@mui/icons-material';
import axios from 'axios';

function HymnSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedHymn, setSelectedHymn] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/hymns/search?q=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching hymns:', error);
    }
  };

  const handleHymnClick = (hymn) => {
    setSelectedHymn(hymn);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePrevHymn = () => {
    const currentIndex = searchResults.findIndex(h => h.number === selectedHymn.number);
    if (currentIndex > 0) {
      setSelectedHymn(searchResults[currentIndex - 1]);
    }
  };

  const handleNextHymn = () => {
    const currentIndex = searchResults.findIndex(h => h.number === selectedHymn.number);
    if (currentIndex < searchResults.length - 1) {
      setSelectedHymn(searchResults[currentIndex + 1]);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        성가 검색
      </Typography>
      <Box sx={{ display: 'flex', mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="성가 제목 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSearch}
          sx={{ ml: 1 }}
        >
          <SearchIcon />
        </IconButton>
      </Box>
      <List>
        {searchResults.map((hymn) => (
          <ListItem
            button
            key={hymn.number}
            onClick={() => handleHymnClick(hymn)}
          >
            <ListItemText
              primary={`${hymn.number}번 - ${hymn.title}`}
            />
          </ListItem>
        ))}
      </List>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedHymn && `${selectedHymn.number}번 - ${selectedHymn.title}`}
        </DialogTitle>
        <DialogContent>
          {selectedHymn && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
              {[`${selectedHymn.number}.jpg`, `${selectedHymn.number}-1.jpg`].map((filename, index) => {
                const imagePath = `/images/${Math.floor(selectedHymn.number / 10)}/${filename}`;
                return (
                  <img
                    key={index}
                    src={imagePath}
                    alt={`${selectedHymn.number}번 성가 ${index + 1}`}
                    style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem' }}
                    onError={(e) => {
                      // 이미지 로드 실패 시 해당 이미지 요소를 숨김
                      e.target.style.display = 'none';
                    }}
                  />
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handlePrevHymn} disabled={!selectedHymn || searchResults.findIndex(h => h.number === selectedHymn.number) === 0}>
            <NavigateBefore />
          </IconButton>
          <IconButton onClick={handleNextHymn} disabled={!selectedHymn || searchResults.findIndex(h => h.number === selectedHymn.number) === searchResults.length - 1}>
            <NavigateNext />
          </IconButton>
          <Button onClick={handleCloseModal}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default HymnSearch; 