module.exports = {
  plugins: [
    {
      module: require('sourcebit-source-contentful'),
      options: {
        accessToken: process.env['CONTENTFUL_ACCESS_TOKEN'],
        environment: 'master',
        spaceId: 'pyifz91mcau0'
      }
    },
    {
      module: require('sourcebit-transform-assets'),
      options: {
        assetPath: function(entry,asset) {
          return [
            "assets",
            [asset.__metadata.id, asset.fileName].join("-")
          ].join("/");
        },
        publicUrl: function(entry,asset,assetPath) {
          return '/' + assetPath;
        }
      }
    },
    {
      module: require('sourcebit-target-hugo'),
      options: {
        writeFile: function(entry,utils) {
          // This function is invoked for each entry and its return value determines
          // whether the entry will be written to a file. When an object with `content`,
          // `format` and `path` properties is returned, a file will be written with
          // those parameters. If a falsy value is returned, no file will be created.
          const { __metadata: meta, ...fields } = entry;
          
          if (!meta) return;
          
          const { createdAt = '', modelName, projectId, source } = meta;
          
          if (modelName === 'blogPost' && projectId === 'pyifz91mcau0' && source === 'sourcebit-source-contentful') {
            const { __metadata, 'body': content, layout, ...frontmatterFields } = entry;
          
            return {
              content: {
                body: fields['body'],
                frontmatter: { ...frontmatterFields, layout: 'post' },
              },
              format: 'frontmatter-md',
              path: 'content/posts/' + utils.slugify(fields['title']) + '.md'
            };
          }
        }
      }
    }
  ]
}
