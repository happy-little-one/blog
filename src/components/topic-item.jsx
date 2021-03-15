import React from 'react'
import { navigate } from 'gatsby'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

function ItemCard({ topic }) {
  const { title, description, to } = topic

  return (
    <Grid xs={3} item>
      <Card onClick={() => to && navigate(to)}>
        <CardActionArea>
          <CardMedia
            component="img"
            image={`/topics/${title}.png`}
            height="150"
            style={{ background: '#f5f5f5' }}
          />
          <CardContent>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            <Typography color="textSecondary" variant="body2" component="p">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}

export default ItemCard
