import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, Grid, Container } from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  image: string;
}

const EventsJoinedPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        setError('You are not authenticated.');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/joined`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch joined events');
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching joined events:', err);
        setError('Failed to load joined events.');
      }
    };

    fetchJoinedEvents();
  }, []);

  return (
    <Container maxWidth="lg">
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/events/create')}
          style={{ margin: '0 10px' }}
        >
          Create Event
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => router.push('/events/my')}
          style={{ margin: '0 10px' }}
        >
          My Events
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => router.push('/events/joined')}
          style={{ margin: '0 10px' }}
        >
          Events I Joined
        </Button>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card>
              <Image
                src={event.image || '/images/default-events.jpg'}
                alt={event.name}
                width={500} // Set the width of the image
                height={300} // Set the height of the image
                objectFit="cover" // This ensures the image maintains its aspect ratio and fills the box
              />
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {event.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(event.date).toLocaleDateString()} - {event.location}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar'])),
  },
});

export default EventsJoinedPage;
