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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Event interface
interface Event {
  name: string;
  date: string;
  location: string;
  image: string;
}

// Participant interface
interface Participant {
  email: string;
}

const EventDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>(
    'info'
  );

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchEventDetails = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setAlertMessage('You are not authenticated.');
        setAlertSeverity('error');
        return;
      }

      try {
        // Fetch event details
        const eventRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
          headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/json' },
        });

        if (!eventRes.ok) {
          throw new Error('Failed to fetch event details');
        }
        const eventData = await eventRes.json();
        setEvent(eventData);

        // Fetch participants
        const participantsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${id}/participants`,
          {
            headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/json' },
          }
        );

        if (!participantsRes.ok) {
          throw new Error('Failed to fetch participants');
        }
        const participantsData = await participantsRes.json();
        setParticipants(participantsData);
      } catch (err) {
        console.error(err);
        setAlertMessage('Failed to load data.');
        setAlertSeverity('error');
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleDeleteEvent = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setAlertMessage('You need to be logged in to delete an event.');
      setAlertSeverity('error');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/json' },
      });

      if (res.ok) {
        setAlertMessage('Event deleted successfully.');
        setAlertSeverity('success');
        setTimeout(() => router.push('/events/my'), 2000);
      } else {
        setAlertMessage('Failed to delete event.');
        setAlertSeverity('error');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setAlertMessage('Something went wrong. Please try again.');
      setAlertSeverity('error');
    }

    setOpenDeleteDialog(false);
  };

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <Container maxWidth="md" style={{ marginTop: '40px' }}>
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

          {/* Delete Button */}
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            style={{ marginTop: '10px', backgroundColor: 'red' }}
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete Event
          </Button>
        </CardContent>
      </Card>

      {/* Participants Table */}
      <Typography variant="h5" style={{ marginTop: '20px' }}>
        Participants
      </Typography>
      {participants.length > 0 ? (
        <TableContainer component={Paper} style={{ marginTop: '10px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((participant, index) => (
                <TableRow key={index}>
                  <TableCell>{participant.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No participants yet.
        </Typography>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this event?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteEvent} color="error" autoFocus>
            Yes, Delete
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
