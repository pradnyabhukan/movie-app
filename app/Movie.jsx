import "bootstrap/dist/css/bootstrap.css";
import Link from "next/link";
// import Image from "next/image";

export default function Movie({ title, id, poster_path, release_date }) {
  const imgPath = "https://image.tmdb.org/t/p/original";
  return (
    <div className="">
      
      {/* <h6>{release_date}</h6> */}
      <Link href={{ pathname : `/${id}`}} >
        <img
          src={imgPath + poster_path}
          alt={title}
          className="img-fluid"
          width={400}
          height={400}
          style={{borderRadius:"20px"}}
        />
      </Link>
      <h4 className="py-2 px-3 custom-title">{title}</h4>
    </div>
  );
}
