export const websiteURL = "<%= websiteURL %>";
export const logoURL = "";
export const companyName = "<%= websiteFullName %>";
export const metadataDefaults = {
  title: companyName,
  description: "",
  openGraph: {
    type: "website",
    locale: " ",
    url: websiteURL,
    title: companyName,
    description: "<%= websiteDescription %>",
    images: [
      {
        url: logoURL,
        alt: companyName
      }
    ],
    site_name: companyName
  },
  twitter: {
    handle: "",
    site: "",
    cardType: "summary_large_image"
  }
};
