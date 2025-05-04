// See https://observablehq.com/framework/config for documentation.
export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: "Clinical Trial Data Analysis",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
    {
      name: "Enrollment Monitoring",
      path: "/Enrollment-Monitoring",
      pages: [
      ]
    },
    {
      name: "Analytical Data Simulation",
      pages: [
        {name: "ADaM Datasets", path: "/ADaM-Datasets"},
        {name: "Master Dataset", path: "/Master-Dataset"},
      ]
    },
    {
      name: "Dynamic Analysis",
      pages: [
        {name: "Descriptive Statistics", path: "/Descriptive-Statistics"},
        {name: "Summarized Information", path: "/Summerized-Information"},
        {name: "Efficacy Analyses", path: "/Efficacy-Analyses"},
      ]
    },
    {
      name: "Output Tables",
      pages: [
        {name: "Demographic Table", path: "/Demographic-Table"},
        {name: "Primary Table", path: "/Primary-Table"},
        // {name: "Efficacy Table", path: "/Efficacy-Table"},
        {name: "Visit Completion Table", path: "/Followup-Table"},
      ]
    },
    {
      name: "About the Author",
      path: "/About-Author",
      pages: [
      ]
    },
  ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: '<link rel="icon" href="observable.png" type="image/png" sizes="32x32">',

  // The path to the source root.
  root: "src",

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  footer: "", // what to show in the footer (HTML)
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  // search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // cleanUrls: true, // drop .html from URLs
};
