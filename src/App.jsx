import { useState, useEffect } from "react";
import useDebounce from "./hooks/useDebounce";
import "./App.css";
import { GoOrganization, GoRepoForked } from "react-icons/go";
import { FaLocationDot, FaLink } from "react-icons/fa6";
import { FaCalendarAlt, FaGithub } from "react-icons/fa";
import { LuSquareCode } from "react-icons/lu";
import { IoIosPeople, IoMdPersonAdd } from "react-icons/io";

const App = () => {
  const [searchedTerm, setSearchedTerm] = useState("");
  const [isFound, setIsFound] = useState(false);
  const [data, setData] = useState(null);
  const debouncedSearchTerm = useDebounce({ value: searchedTerm, delay: 500 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${debouncedSearchTerm}`);
        if (!response.ok) {
          setIsFound(false);
          setData(null);
          return;
        }
        const result = await response.json();
        setIsFound(true);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsFound(false);
        setData(null);
      }
    };

    if (debouncedSearchTerm) {
      fetchData();
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col items-center px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">GitHub User Finder</h1>
      <div className="flex w-full max-w-md">
        <input
          type="text"
          placeholder="Enter a GitHub username..."
          onChange={e => setSearchedTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none dark:bg-gray-800 dark:border-gray-700"
        />
        <button className="px-4 py-2 bg-black text-white rounded-r-md">
          Search
        </button>
      </div>

      {isFound && data && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-10 w-full max-w-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={data.avatar_url}
              alt={data.name || "avatar"}
              className="w-24 h-24 rounded-full"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold">{data.name || "N/A"}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">@{data.login}</p>
              <div className="flex flex-col sm:flex-row gap-y-2 gap-x-3 mt-2 flex-wrap text-sm text-gray-500 dark:text-gray-300">
                {data.company && (
                  <div className="flex items-center gap-1 flex-1/3">
                    <GoOrganization /> {data.company}
                  </div>
                )}
                {data.location && (
                  <div className="flex items-center gap-1 flex-1/3">
                    <FaLocationDot /> {data.location}
                  </div>
                )}
                {data.created_at && (
                  <div className="flex items-center gap-1 flex-1/3">
                    <FaCalendarAlt /> Joined {new Date(data.created_at).toLocaleDateString()}
                  </div>
                )}
                {data.blog && (
                  <div className="flex items-center gap-1 flex-1/3 text-blue-600 dark:text-blue-400">
                    <FaLink />
                    <a
                      href={data.blog.startsWith("http") ? data.blog : `https://${data.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.blog.replace(/(^\w+:|^)\/\//, "")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4">
              <GoRepoForked className="w-5 h-5 mx-auto mb-1.5" />
              <p className="text-sm font-medium">{data.public_repos}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">Public Repos</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4">
              <LuSquareCode className="w-5 h-5 mx-auto mb-1.5" />
              <p className="text-sm font-medium">{data.public_gists}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">Public Gists</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4">
              <IoIosPeople className="w-5 h-5 mx-auto mb-1.5" />
              <p className="text-sm font-medium">{data.followers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">Followers</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4">
              <IoMdPersonAdd className="w-5 h-5 mx-auto mb-1.5" />
              <p className="text-sm font-medium">{data.following}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">Following</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href={data.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black dark:bg-gray-200 text-white dark:text-black px-4 py-2 rounded-md inline-flex items-center gap-2"
            >
              <FaGithub className="w-4 h-4" /> View Profile on GitHub
            </a>
          </div>
        </div>
      )}

      {!isFound && debouncedSearchTerm && (
        <div className="mt-10 text-red-500 font-medium">User not found. Please try another username.</div>
      )}
    </div>
  );
};

export default App;
