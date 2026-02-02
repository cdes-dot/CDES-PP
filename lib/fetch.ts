export const getData = async (url: string, meta: boolean = false) => {
  try {
    const fullUrl = `${import.meta.env.PUBLIC_STRAPI_URL}/api/${url}`;
    console.log("Fetching URL:", fullUrl);
    
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.PUBLIC_STRAPI_KEY}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error response body:", errorBody);
      throw new Error(`HTTP error! status: ${response.status} - ${errorBody}`);
    }

    if (meta) {
      const json = await response.json();
      return [json.data, json.meta];
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
