const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch all properties
async function fetchProperties({ showFeatured = false } = {}) {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) {
      return [];
    }

    const res = await fetch(
      `${apiDomain}/properties${showFeatured ? "/featured" : ""}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchProperty(id) {
  try {
    if (!apiDomain) {
      // Domain not available
      return null;
    }

    const url = `${apiDomain}/properties/${id}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching property:", error.message);
    return null;
  }
}

export { fetchProperties, fetchProperty };
