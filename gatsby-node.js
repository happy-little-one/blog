exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const template = require.resolve(`./src/components/template.jsx`)

  const result = await graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            frontmatter {
              slug
              topic
            }
          }
        }
      }
    }
  `)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: template,
      context: {
        topic: node.frontmatter.topic,
        slug: node.frontmatter.slug,
      },
    })
  })
}
