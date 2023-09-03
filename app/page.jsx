"use client";
import "bootstrap/dist/css/bootstrap.css";
import Movie from "./Movie";
import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Link from "next/link";

export default function Home() {
  const NEXT_PUBLIC_API_KEY = "3db13c45f774db248e51df9c1728e382"
  const apiKey = NEXT_PUBLIC_API_KEY;
  const [res, setRes] = useState(null);
  const [genres, setGenres] = useState(null);
  const [heading, setHeading] = useState("Most Popular Movies");
  const getData = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
    );
    const genreList = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
    );
    setRes(await data.json());
    setHeading("Most Popular Movies");
    setGenres(await genreList.json());
  };

  const handleLocalStorage = (id) =>{
    localStorage.setItem("id", id);
    console.log("id from local storage : ", localStorage.getItem("id"));
  }

  useEffect(() => {
    getData();
  }, []);
  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    // Get data from the form.
    console.log("inside handle submit");
    const value = event.target.searchQuery.value;
    if (value === "") {
      console.log("value is empty");
      setHeading("Most Popular Movies");
      getData();
    } else {
      setHeading(`"${value}" results`);
      console.log(`Is this your value: ${value}`);
      const movieAPI = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${value}&api_key=${apiKey}`
      );
      const response = await movieAPI.json();
      console.log(response);
      setRes(response);
    }
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const handleGenreClick = async (id, name) => {
    setDropdownOpen(false);
    const searchByGenre = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${id}`
    );
    const genreResponse = await searchByGenre.json();
    setHeading(`${name} Movies`);
    setRes(genreResponse);
  };

  return (
    <>
      <div className="background-image"></div>
      <div className="container content">
        <div className="row pt-3">
          <form
            onSubmit={handleSubmit}
            className="d-flex justify-content-between align-items-center"
          >
            <h4 className="col-md-2" onClick={getData} style={{cursor:"pointer"}}>
              PMDB
            </h4>
            <div className="col-md-8 d-flex justify-content-center align-items-center">
              <input
                className="my-4 pb-1 px-4"
                type="text"
                name="searchQuery"
                id="searchQuery"
                placeholder="Search a movie"
                style={{
                  width: "60%",
                  height: "30px",
                  borderRadius: "20px 0 0 20px",
                  border: "none",
                }}
              />
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "white",
                  height: "30px",
                  borderRadius: "0 20px 20px 0",
                  border: "none",
                }}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
            <div className={`dropdown${isDropdownOpen ? " show" : ""}`}>
              <button
                className="btn btn-danger dropdown-toggle"
                type="button"
                onClick={toggleDropdown}
              >
                Search by genre
              </button>
              <div className={`dropdown-menu${isDropdownOpen ? " show" : ""}`}>
                {genres?.genres.map((genre) => {
                  return (
                    <a
                      className="dropdown-item"
                      id={genre.id}
                      onClick={() => handleGenreClick(genre.id, genre.name)}
                    >
                      {genre.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </form>
        </div>
        <h1 className="display-1 py-4 text-center custom-heading">{heading}</h1>
        <div className="container py-4">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            {res?.results
              ?.filter((result) => result.poster_path !== null)
              ?.map((movie) => (
                <div className="d-flex col mb-4" key={movie.id} onClick={()=>{handleLocalStorage(movie.id)}}>
                    <Movie
                      id={movie.id}
                      title={movie.title}
                      poster_path={movie.poster_path}
                      release_date={movie.release_date}
                    />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
