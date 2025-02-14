"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  location: {
    name: string;
    url: string;
  };
  episode: string[];
}

function HomePage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [episodeNames, setEpisodeNames] = useState<{ [key: number]: string }>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://rickandmortyapi.com/api/character?page=${page}&name=${search}`,
        { params: { count: 3 } }
      )
      .then((response) => {
        setCharacters(response.data.results.splice(0, 18));
        setLoading(false);
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
          .then((response) => {
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
    <div className="flex justify-center items-center min-h-screen my-8">
      <div className="w-full max-w-fit">
        <div className="flex items-center mb-4">
          <Image
            src="/favicon.ico"
            alt="Rick & Morty Logo"
            width={40}
            height={40}
            className="mr-4"
          />
          <h1 className="text-2xl font-bold">The Rick and Morty App</h1>
        </div>
        <div className="flex justify-between my-10">
          <input
            type="text"
            placeholder="Search characters"
            value={search}
            onChange={handleSearch}
            className=" p-2 border border-gray-600 rounded w-1/5"
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
                    pageNumber === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {pageNumber}
                </li>
              ))}
              <li
                onClick={() =>
                  setPage(page < totalPages ? page + 1 : totalPages)
                }
                className="p-2 bg-gray-300 rounded cursor-pointer"
              >
                Next
              </li>
            </ul>
          </nav>
        </div>
        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 bg-gray-800 p-10 rounded-lg w-full">
            {characters.map((character) => (
              <div
                key={character.id}
                className="flex bg-gray-600 text-white rounded-xl overflow-hidden"
              >
                <Image
                  width={200}
                  height={190}
                  alt={character.name}
                  src={character.image}
                  className="w-24 h-auto sm:w-32 sm:h-auto md:w-40 md:h-auto lg:w-48 lg:h-auto xl:w-52 xl:h-auto 2xl:w-56 2xl:h-56"
                />
                <div className="flex flex-col justify-center items-start text-base ml-2">
                  <h2 className="text-2xl font-bold">{character.name}</h2>
                  {character.status === "Alive" ? (
                    <p className="font-semibold flex">
                      <Image
                        src="/green.svg"
                        alt=""
                        width={12}
                        height={12}
                        className="mr-2"
                      />{" "}
                      {character.status} - {character.species}
                    </p>
                  ) : character.status === "Dead" ? (
                    <p className="font-semibold flex">
                      <Image
                        src="/red.svg"
                        alt=""
                        width={12}
                        height={12}
                        className="mr-2"
                      />{" "}
                      {character.status} - {character.species}
                    </p>
                  ) : (
                    <p className="font-semibold flex">
                      <Image
                        src="/gray.svg"
                        alt=""
                        width={12}
                        height={12}
                        className="mr-2"
                      />{" "}
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
        )}
      </div>
    </div>
  );
}

export default HomePage;
