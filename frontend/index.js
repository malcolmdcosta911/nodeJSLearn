async function logMovies() {
  try {
    const response = await fetch("http://localhost:3000/api/genres");
    const resJson = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(resJson));
    console.log("movies------", resJson);
  } catch (error) {
    console.log("error-----", error.message);
  }
}

logMovies();
