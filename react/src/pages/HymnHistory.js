import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import axios from 'axios';

function HymnHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/hymns/history');
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching hymn history:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        지난 성가 목록
      </Typography>
      <List>
        {history.map((entry, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={`${entry.date}`}
                secondary={entry.hymns.map(hymn => `${hymn.number}번 - ${hymn.title}`).join(', ')}
              />
            </ListItem>
            {index < history.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default HymnHistory; 