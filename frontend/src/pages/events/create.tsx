import React, { useState } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Grid,
  InputAdornment,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const CreateEvent = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const theme = useTheme();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  const formatDateForApi = (date: Date | null) => {
    if (!date) {
      return '';
    }
    const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' '); // Format to 'YYYY-MM-DD HH:MM:SS'
    return formattedDate;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !date || !location || !maxParticipants || !image) {
      setError('Please fill in all fields and upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('date', formatDateForApi(date)); // Use the formatted date
    formData.append('location', location);
    formData.append('max_participants', maxParticipants);
    formData.append('image', image);

    console.log('Submitting event data:');
    formData.forEach((value, key) => {
      console.log(key, value); // Log each form data key and value
    });

    const authToken = localStorage.getItem('authToken');
    console.log('Auth Token:', authToken);

    if (!authToken) {
      setError('You are not authenticated.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (!response.ok) {
        throw new Error('Event creation failed');
      }

      router.push(`/events/${responseData.id}`); // Redirect to the newly created event page
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create Event
      </Typography>

      {error && (
        <Typography color="error" variant="body2" align="center">
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Event Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Event Date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Location"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Max Participants"
              fullWidth
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              margin="normal"
              InputProps={{
                startAdornment: <InputAdornment position="start">#</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                marginTop: 2,
                padding: 1.5,
                textTransform: 'none',
                backgroundColor: theme.palette.primary.light,
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              Upload Image
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            {image && (
              <Typography variant="body2" align="center" sx={{ marginTop: 1 }}>
                {image.name}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{ padding: 2, width: '50%' }}
              >
                {loading ? <CircularProgress size={24} color="secondary" /> : 'Create Event'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar'])),
  },
});

export default CreateEvent;
