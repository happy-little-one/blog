import React from 'react'
import { graphql } from 'gatsby'
import Typography from '@material-ui/core/Typography'

import Layout from './layout'
import Header from './header'
import Menu from './menu'

export default function Template({ data }) {
  const { markdownRemark, allMarkdownRemark } = data
  const { frontmatter, html } = markdownRemark

  const { nodes } = allMarkdownRemark
  const menuItems = nodes.map(it => it.frontmatter)

  const { title, date, slug } = frontmatter

  return (
    <Layout>
      <Header />
      <div className="blog">
        <Menu items={menuItems} activeKey={slug} />
        <div className="blog-body">
          <Typography variant="h5" component="h1">
            {title}
          </Typography>
          <Typography variant="body2" component="p" color="textSecondary">
            {date}
          </Typography>
          <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($slug: String!, $topic: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date
        slug
        title
      }
    }

    allMarkdownRemark(
      filter: { frontmatter: { topic: { eq: $topic } } }
      sort: { order: ASC, fields: frontmatter___date }
    ) {
      nodes {
        frontmatter {
          title
          slug
        }
      }
    }
  }
`
