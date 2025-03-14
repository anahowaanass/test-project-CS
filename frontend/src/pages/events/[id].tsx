import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Define the structure of an event
interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  image: string;
}

const EventDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  // State variables
  const [event, setEvent] = useState<Event | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>(
    'info'
  );

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchEvent = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setAlertMessage('You are not authenticated.');
        setAlertSeverity('error');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setAlertMessage('Failed to load event.');
        setAlertSeverity('error');
      }
    };

    fetchEvent();
  }, [id]);

  const handleJoinEvent = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setAlertMessage('You need to be logged in to join an event.');
      setAlertSeverity('error');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        setAlertMessage('Successfully joined!');
        setAlertSeverity('success');
      } else if (res.status === 409) {
        setAlertMessage('You have already joined this event.');
        setAlertSeverity('warning');
      } else {
        setAlertMessage(data.message || 'Failed to join.');
        setAlertSeverity('error');
      }
    } catch (error) {
      console.error('Error joining event:', error);
      setAlertMessage('Something went wrong. Please try again.');
      setAlertSeverity('error');
    }

    setOpenDialog(false);
  };

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: '40px' }}>
      <Card>
        <Image
          src={event.image || '/images/default-events.jpg'}
          alt={event.name}
          width={600}
          height={400}
          style={{ objectFit: 'cover', borderRadius: '5px' }}
        />
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {event.name}
          </Typography>
          <Typography variant="body1">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            <strong>Location:</strong> {event.location}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '20px' }}
            onClick={() => setOpenDialog(true)}
          >
            Join Event
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Join Event</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to join this event?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleJoinEvent} color="primary" autoFocus>
            Yes, Join
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alert */}
      <Snackbar open={!!alertMessage} autoHideDuration={3000} onClose={() => setAlertMessage(null)}>
        <Alert
          onClose={() => setAlertMessage(null)}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};
export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar'])),
  },
});

export default EventDetails;
