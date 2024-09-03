import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Grid, Card, CardContent, CardActions } from '@mui/material';
import { styled } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

const HeroSection = styled('div')(({ theme }) => ({
  backgroundImage: 'url(https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjUzNzU3MTd8&ixlib=rb-4.0.3)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(8, 0, 6),
  marginBottom: theme.spacing(4),
}));

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await backend.createPost(data.title, data.body, data.author);
      reset();
      setShowForm(false);
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg">
      <HeroSection>
        <Typography variant="h2" align="center" gutterBottom>
          Crypto Blog
        </Typography>
        <Typography variant="h5" align="center" paragraph>
          Explore the latest in cryptocurrency news and insights
        </Typography>
      </HeroSection>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '2rem' }}
      >
        {showForm ? 'Cancel' : 'Create New Post'}
      </Button>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: 'Title is required' }}
            render={({ field, fieldState: { error } }) => (
              <div className="mb-4">
                <Typography variant="subtitle1">Title</Typography>
                <input {...field} className="w-full p-2 border rounded" />
                {error && <span className="text-red-500">{error.message}</span>}
              </div>
            )}
          />
          <Controller
            name="body"
            control={control}
            defaultValue=""
            rules={{ required: 'Body is required' }}
            render={({ field, fieldState: { error } }) => (
              <div className="mb-4">
                <Typography variant="subtitle1">Body</Typography>
                <textarea {...field} className="w-full p-2 border rounded" rows={4} />
                {error && <span className="text-red-500">{error.message}</span>}
              </div>
            )}
          />
          <Controller
            name="author"
            control={control}
            defaultValue=""
            rules={{ required: 'Author is required' }}
            render={({ field, fieldState: { error } }) => (
              <div className="mb-4">
                <Typography variant="subtitle1">Author</Typography>
                <input {...field} className="w-full p-2 border rounded" />
                {error && <span className="text-red-500">{error.message}</span>}
              </div>
            )}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit Post
          </Button>
        </form>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={Number(post.id)}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {post.body.length > 100 ? `${post.body.substring(0, 100)}...` : post.body}
                  </Typography>
                  <Typography variant="caption" display="block">
                    By {post.author} | {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Read More</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default App;
