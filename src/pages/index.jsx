import React from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import Layout from '../components/layout'
import Header from '../components/header'
import TopicItem from '../components/topic-item'
import topics from '../topics'

const Home = () => {
  return (
    <Layout>
      <div className="home">
        <Header />
        <Container className="home-content">
          <Grid spacing={4} container>
            {topics.map(topic => (
              <TopicItem key={topic.title} topic={topic} />
            ))}
          </Grid>
        </Container>
      </div>
    </Layout>
  )
}

export default Home
