import React from 'react'
import { graphql } from 'gatsby'
import Hidden from '@material-ui/core/Hidden'

import Layout from './layout'
import Header from './blog-header/index'
import Menu from './menu'

export default function Template({ data }) {
  const { markdownRemark, allMarkdownRemark } = data
  const { frontmatter, html } = markdownRemark
  const { topic, slug, title } = frontmatter

  const { nodes } = allMarkdownRemark
  const menuItems = nodes.map(it => it.frontmatter)

  return (
    <Layout>
      <Header activeTopic={topic} activeTitle={title} menuItems={menuItems} />

      <div className="blog">
        <Hidden only={['xs', 'sm', 'md']}>
          <Menu items={menuItems} activeKey={slug} />
        </Hidden>

        <div className="blog-content">
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
        slug
        title
        topic
      }
    }

    allMarkdownRemark(
      filter: { frontmatter: { topic: { eq: $topic } } }
      sort: { order: ASC, fields: frontmatter___index }
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
