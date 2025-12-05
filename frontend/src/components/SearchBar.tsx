import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'

// Icons
import { FaChevronRight, FaGithub } from 'react-icons/fa6'
import { IoLogoGoogle, IoClose } from 'react-icons/io5'
import { AiOutlineSearch } from 'react-icons/ai'
import { SiDuckduckgo } from 'react-icons/si'
import { FaYandex } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

// Local Storage Keys
const LS_CURRENT_SEARCH_ENGINE = 'currentSearchEngineSaved'

type BrowserOptionType = {
  index: number
  label: string
  icon: React.ReactElement
  url: string
  param: string
}

const searchEngineOptions: BrowserOptionType[] = [
  { index: 0, label: 'DuckDuckGo', icon: <SiDuckduckgo />, url: 'https://duckduckgo.com', param: 'q' },
  { index: 1, label: 'Google', icon: <IoLogoGoogle />, url: 'https://www.google.com/search', param: 'q' },
  { index: 2, label: 'Yandex', icon: <FaYandex />, url: 'https://ya.ru/search', param: 'text' },
]

export default function SearchBar() {
  const searchRef = useRef<HTMLInputElement>(null)
  const [currentSearch, setCurrentSearch] = useState<string>('')
  const [suggestionsList, setSuggestionsList] = useState<string[]>([])
  const [currentSearchEngine, setCurrentSearchEngine] = useState<BrowserOptionType>(searchEngineOptions[0])

  useEffect(() => {
    const savedCurrentEngine = localStorage.getItem(LS_CURRENT_SEARCH_ENGINE)
    if (savedCurrentEngine) {
      const searchEngineOption = searchEngineOptions.find((option) => option.index == Number(savedCurrentEngine))

      if (!searchEngineOption) {
        localStorage.setItem(LS_CURRENT_SEARCH_ENGINE, '0')
        return
      }

      if (searchEngineOption == currentSearchEngine) return

      setCurrentSearchEngine(searchEngineOption)
      localStorage.setItem(LS_CURRENT_SEARCH_ENGINE, searchEngineOption.index.toString())
    } else {
      localStorage.setItem(LS_CURRENT_SEARCH_ENGINE, currentSearchEngine.index.toString())
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(LS_CURRENT_SEARCH_ENGINE, currentSearchEngine.index.toString())
  }, [currentSearchEngine])

  async function getRelatedSearches(query: string, language: string = 'en') {
    try {
      const response = await axios.get(`http://localhost:1212/searchSuggestions?lang=${language}&query=${query}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status != 200) throw new Error(`Status code ${response.status}`)

      setSuggestionsList(response.data)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  useEffect(() => {
    getRelatedSearches(currentSearch)
  }, [currentSearch])

  function proceedSearch(searchQuery: string) {
    const url = new URL(currentSearchEngine.url)
    url.searchParams.set(currentSearchEngine.param, searchQuery)
    window.location.replace(url)
  }

  const clearInput = () => {
    if (searchRef.current == null) return
    searchRef.current.value = ''
    setCurrentSearch('')
  }

  return (
    <div className="bg-zinc-600 flex flex-col w-full rounded-3xl flex-1">
      <div className="flex h-12 items-center w-full">
        <div className="flex items-center h-full flex-1 pl-3 pr-2 gap-2">
          <AiOutlineSearch className="size-5 text-zinc-200" />
          <input
            type="text"
            ref={searchRef}
            onChange={(event) => setCurrentSearch(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') proceedSearch(currentSearch)
            }}
            placeholder={`Поиск в ${currentSearchEngine.label}...`}
            className="flex-1 h-full bg-transparent text-white text-lg self-baseline outline-none"
          />
          {currentSearch != '' && <IoClose onClick={clearInput} className="size-5 mr-1 text-zinc-100 cursor-pointer hover:text-zinc-300" />}
        </div>
        <Popover className="flex gap-10 flex-col h-full">
          <PopoverButton className="h-full bg-transparent flex outline-none flex-row pr-3 justify-center items-center">
            <span className="text-zinc-300 text-2xl">{currentSearchEngine.icon}</span>
          </PopoverButton>
          <PopoverPanel transition anchor="top end" className="bg-zinc-600 py-2 rounded-2xl [--anchor-gap:8px]">
            {({ close }) => (
              <>
                {searchEngineOptions.map((option: BrowserOptionType, index: number) => (
                  <div
                    key={index}
                    onClick={() => {
                      setCurrentSearchEngine(option)
                      close()
                    }}
                    className={`select-none px-4 h-8 flex cursor-pointer justify-start items-center gap-2 hover:bg-zinc-500 ${option == currentSearchEngine ? 'text-zinc-200' : 'text-zinc-400'}`}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <span className="font-semibold">{option.label}</span>
                  </div>
                ))}
              </>
            )}
          </PopoverPanel>
        </Popover>
      </div>
      {currentSearch != '' && (
        <div className="border-t border-zinc-500 flex flex-col justify-center">
          {suggestionsList.length > 0 ? (
            <ul className="w-full select-none">
              {suggestionsList.map((suggestion: string, index: number) => (
                <li key={index} onClick={() => proceedSearch(suggestion)} className="text-zinc-100 flex justify-between items-center pl-5 pr-4 py-2 hover:bg-opacity-30 hover:bg-zinc-500 cursor-pointer">
                  <span>
                    <span className="text-zinc-400">{suggestion.substring(0, currentSearch.length)}</span>
                    <span className="font-semibold">{suggestion.substring(currentSearch.length)}</span>
                  </span>
                  <FaChevronRight className="size-3" />
                </li>
              ))}
            </ul>
          ) : (
            <span className="py-5 text-zinc-100 text-center text-xl font-semibold w-full">Нет результатов</span>
          )}
          <a href="/" target="_blank" className="border-t hover:text-zinc-300 transition-colors border-zinc-500 py-2 px-5 text-sm text-zinc-400 text-center flex select-none items-center justify-center gap-1.5">
            <span>See GitHub</span>
            <FaGithub />
          </a>
        </div>
      )}
    </div>
  )
}
