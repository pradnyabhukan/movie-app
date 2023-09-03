"use client";
import "bootstrap/dist/css/bootstrap.css";
// import { useRouter } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect } from "react";
import { useState } from "react";
export default function MovieDetails() {

  const movie = sessionStorage.getItem("id");
  // console.log(movieId);

  const [movieData, setMovieData] = useState(null);
  const [creditsData, setCreditsData] = useState(null);
  const [trailerData, setTrailerData] = useState(null);
  // const [movieData, setMovieData] = useState();

  const NEXT_PUBLIC_API_KEY="3db13c45f774db248e51df9c1728e382"
  const apiKey = NEXT_PUBLIC_API_KEY;

  const getData = async() =>{
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movie}?api_key=${apiKey}`,
      { next: { revalidate: 0 } }
    );
    const movieData = await data.json();
    setMovieData(movieData);

//credits
    const cData = await fetch(
      `https://api.themoviedb.org/3/movie/${movie}/credits?api_key=${apiKey}`
    );
    const credits = await cData.json();
    setCreditsData(credits);

//trailerData
    const tData = await fetch(
      `https://api.themoviedb.org/3/movie/${movie}/videos?api_key=${apiKey}`
    );
    const trailerData = await tData.json();
    setTrailerData(trailerData);
  }

  //genres
  const genresArray = movieData?.genres;
  // Map the genre names to an array of <li> elements
  const genresList = genresArray?.map((genre) => (
    <li key={genre.id}>{genre.name}</li>
  ));

  //background image
  const imgPath = "https://image.tmdb.org/t/p/original";
  const bgImg = imgPath + movieData?.backdrop_path;
  const posterImage = imgPath + movieData?.poster_path;

  //fetch movie credits
  

  const directors = creditsData?.crew
    ?.filter((crew_member) => crew_member.job === "Director")
    .map((director) => director.name);

  const writerSet = new Set(creditsData?.crew
    ?.filter((crew_member) => crew_member.known_for_department === "Writing")
    .map((writer) => writer.name));

  const writers = [ ...writerSet]

  //fetch videos

  const key = trailerData?.results
    ?.filter((result) => result.name === "Official Trailer")
    .map((video) => video.key);
  // console.log("yt key:", key);
  const videoLink = `https://www.youtube.com/embed/${key}?autoplay=1&mute=1&controls=0`;

  const divStyle = {
    backgroundImage: `url(${bgImg})`,
  };
  

  const totalStars = 10;
  const filledStars = Math.round(movieData?.vote_average);

  useEffect(()=>{
    getData();
  },[])

  return (
    <div className="bg-image" style={divStyle}>
      <div className="blur-overlay"></div>
      <div className="custom-card p-4">
        <div className="text-center pb-5">
          <h1 className="custom-title">A film by</h1>
          <h1 className="display-1 custom-heading">{directors}</h1>
        </div>
        <div className="d-flex justify-content-between py-3">
          <h2 className="custom-title">{movieData?.title}</h2>
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
        <p className="custom-text">{movieData?.overview}</p>
      </div>
    </div>
  );
}
