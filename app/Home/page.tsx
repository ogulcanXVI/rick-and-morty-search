"use client";

import React, { use, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

function HomePage() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const recordsPerPage = 5;
  const [search, setSearch] = useState<string>("");
  const [episodeNames, setEpisodeNames] = useState<{ [key: number]: string }>(
    {}
  );

  useEffect(() => {
    axios
      .get(
        `https://rickandmortyapi.com/api/character?page=${page}&name=${search}`,
        { params: { count: 3 } }
      )
      .then((response: any) => {
        setCharacters(response.data.results.splice(0, 18));
      });
  }, [page, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    characters.forEach((character) => {
      if (character.episode.length > 0) {
        axios
          .get(character.episode[0])
          .then((response: any) => {
            setEpisodeNames((prev) => ({
              ...prev,
              [character.id]: response.data.name,
            }));
          })
          .catch((error) => {
            console.error("Error fetching episode name:", error);
          });
      }
    });
  }, [characters]);

  const totalPages = 42;
  const maxPageNumbers = 5;
  const startPage = Math.max(1, page - Math.floor(maxPageNumbers / 2));
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  return (
    <div className="container mx-auto my-8">
      <div className="flex items-center mb-4">
        <img
          src="./favicon.ico"
          alt="Rick & Morty Logo"
          className="w-10 mr-4"
        />
        <h1 className="text-2xl font-bold">The Rick and Morty App</h1>
      </div>
      <div className="flex justify-between my-10">
        <input
          type="text"
          placeholder="Search characters"
          value={search}
          onChange={handleSearch}
          className=" p-2 border border-gray-600s rounded w-1/5"
        />
        <nav className="flex mt-4 justify-center">
          <ul className="flex space-x-2">
            <li
              onClick={() => setPage(page > 1 ? page - 1 : 1)}
              className="p-2 bg-gray-300 rounded cursor-pointer"
            >
              Previous
            </li>
            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i
            ).map((pageNumber) => (
              <li
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-4 py-2 rounded cursor-pointer ${
                  pageNumber === page ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
              >
                {pageNumber}
              </li>
            ))}
            <li
              onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
              className="p-2 bg-gray-300 rounded cursor-pointer"
            >
              Next
            </li>
          </ul>
        </nav>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 bg-gray-800 p-10 rounded-lg">
        {characters.map((character: any) => (
          <div
            key={character.id}
            className="flex bg-gray-600 text-white rounded-xl overflow-hidden"
          >
            <Image
              width={208}
              height={208}
              alt={character.name}
              src={character.image}
            />
            <div className="flex flex-col justify-center items-start text-base ml-2">
              <h2 className="text-2xl font-bold">{character.name}</h2>
              {character.status === "Alive" ? (
                <p className="font-semibold flex    ">
                  <img src="./green.svg" alt="" className="w-3 mr-2" />{" "}
                  {character.status} - {character.species}
                </p>
              ) : character.status === "Dead" ? (
                <p className="font-semibold flex">
                  <img src="./red.svg" alt="" className="w-3 mr-2" />{" "}
                  {character.status} - {character.species}
                </p>
              ) : (
                <p className="font-semibold flex">
                  <img src="./gray.svg" alt="" className="w-3 mr-2" />{" "}
                  {character.status} - {character.species}
                </p>
              )}

              <p className="text-gray-400 mt-2">Last known location:</p>
              <a href={character.location.url} className="text-lg">
                {character.location.name}
              </a>
              <p className="text-gray-400 mt-2">First seen in:</p>
              <a href={character.episode[0]} className="text-lg">
                {episodeNames[character.id] || "Loading..."}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
