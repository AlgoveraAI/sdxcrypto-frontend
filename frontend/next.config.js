/** @type {import('next').NextConfig} */

// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require("@sentry/nextjs");

// get git branch using cli
const { execSync } = require("child_process");
const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

const moduleExports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "images.unsplash.com",
      "pbs.twimg.com",
      "firebasestorage.googleapis.com",
      "tailwindui.com",
      "img.icons8.com",
      "commons.wikimedia.org",
      "upload.wikimedia.org",
      "cdn-icons-png.flaticon.com",
    ],
  },
  env: {
    GIT_BRANCH: branch, // for when VERCEL_GIT_COMMIT_REF not available (local dev)
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
