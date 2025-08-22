export const getData = async (url: string, meta: boolean = false) => {
  try {
    const response = await fetch(
      `${import.meta.env.PUBLIC_STRAPI_URL}/api/${url}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.PUBLIC_STRAPI_KEY}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
