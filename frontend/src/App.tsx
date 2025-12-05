// Component imports
import ImageSearch from './components/ImageSearch'
import SearchBar from './components/SearchBar'
import Time from './components/Time'

function App() {
  return (
    <>
      <div className="bg-zinc-900 h-screen flex justify-center w-full bg-pena">
        <div className="w-4/5 md:w-2/3 xl:w-2/5 flex flex-col gap-10 items-center mt-20">
          <Time />
          <div className="w-full flex flex-col gap-2">
            <div className="flex flex-row items-start gap-2 w-full">
              <SearchBar />
              <ImageSearch />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
