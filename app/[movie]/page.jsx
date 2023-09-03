import "bootstrap/dist/css/bootstrap.css";

export default async function MovieDetail(params) {
  const NEXT_PUBLIC_API_KEY="3db13c45f774db248e51df9c1728e382"
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const {
    params: { movie },
  } = params; //access movie id
  // console.log(title)

  // fetching basic movie data
  const data = await fetch(
    `https://api.themoviedb.org/3/movie/${movie}?api_key=${apiKey}`,
    { next: { revalidate: 0 } }
  );
  const res = await data.json();
  //genres
  const genresArray = res.genres;
  // Map the genre names to an array of <li> elements
  const genresList = genresArray?.map((genre) => (
    <li key={genre.id}>{genre.name}</li>
  ));

  //background image
  const imgPath = "https://image.tmdb.org/t/p/original";
  const bgImg = imgPath + res.backdrop_path;
  const posterImage = imgPath + res.poster_path;

  //fetch movie credits
  const creditsData = await fetch(
    `https://api.themoviedb.org/3/movie/${movie}/credits?api_key=${apiKey}`
  );
  const credits = await creditsData.json();

  const directors = credits?.crew
    ?.filter((crew_member) => crew_member.job === "Director")
    .map((director) => director.name);

  const writerSet = new Set(credits?.crew
    ?.filter((crew_member) => crew_member.known_for_department === "Writing")
    .map((writer) => writer.name));

  const writers = [ ...writerSet]

  //fetch videos
  const trailerData = await fetch(
    `https://api.themoviedb.org/3/movie/${movie}/videos?api_key=${apiKey}`
  );
  const trailer = await trailerData.json();
  const key = trailer?.results
    ?.filter((result) => result.name === "Official Trailer")
    .map((video) => video.key);
  // console.log("yt key:", key);
  const videoLink = `https://www.youtube.com/embed/${key}?autoplay=1&mute=1&controls=0`;

  const divStyle = {
    backgroundImage: `url(${bgImg})`,
  };
  

  const totalStars = 10;
  const filledStars = Math.round(res.vote_average);

  return (
    <div className="bg-image" style={divStyle}>
      <div className="blur-overlay"></div>
      <div className="custom-card p-4">
        <div className="text-center pb-5">
          <h1 className="custom-title">A film by</h1>
          <h1 className="display-1 custom-heading">{directors}</h1>
        </div>
        <div className="d-flex justify-content-between py-3">
          <h2 className="custom-title">{res?.title}</h2>
          <h4 className="">
            {genresArray?.map((genre) => (
              <div
                className="genre-button"
                key={genre.id}
                data-genre-id={genre.id}
              >
                {genre.name}
              </div>
            ))}
          </h4>
        </div>
        <div className="row " style={{}}>
          <div className="col-md-8">
          <iframe src={videoLink} title="Trailer" height="100%" width="100%" style={{}}></iframe>
          </div>
          <div className="col-md-4" style={{}} >
            <img src={posterImage} alt="" style={{ height: "100%", width: "100%" }}/>
          </div>
        </div>
        <div className="starRating pt-5">
          {[...Array(totalStars)].map((_, index) => (
            <span
              key={index}
              className={index < filledStars ? "starFilled" : "starEmpty"}
            >
              ★
            </span> 
            
          ))}
        </div>
        <p className=" pt-3 custom-text">Writers : {writers.join(', ')}</p>
        <p className="custom-text">{res?.overview}</p>
      </div>
    </div>
  );
}
