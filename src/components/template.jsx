import React from 'react'
import { graphql } from 'gatsby'

import Layout from './layout'
import Header from './header'
import Menu from './menu'

export default function Template({ data }) {
  const { markdownRemark, allMarkdownRemark } = data
  const { frontmatter, html } = markdownRemark

  const { nodes } = allMarkdownRemark
  const menuItems = nodes.map(it => it.frontmatter)

  return (
    <Layout>
      <Header activeKey={frontmatter.topic} />
      <div className="blog">
        <Menu items={menuItems} activeKey={frontmatter.slug} />
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
