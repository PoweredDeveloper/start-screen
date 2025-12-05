import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChangeEvent, DragEvent, useRef, useState } from 'react'

// Icons
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { SiGooglelens } from 'react-icons/si'
import { PiImagesThin } from 'react-icons/pi'
import { IoClose } from 'react-icons/io5'
import axios from 'axios'

export default function ImageSearch() {
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [imageLoading, setImageLoading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (event: DragEvent<HTMLInputElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.type === 'dragenter' || event.type == 'dragover') {
      setDragActive(true)
    } else if (event.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (event: DragEvent<HTMLInputElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)

    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      handleFiles(event.dataTransfer.files)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    if (event.target.files && event.target.files[0]) {
      handleFiles(event.target.files)
    }
  }

  function handleFiles(files: FileList) {
    setImageLoading(false)

    let multipart = new FormData()
    multipart.append('image', files[0])

    axios.post(`http://localhost:1212/reverseSearchLink`, multipart).then((res) => {
      console.log(res)
    })
  }

  return (
    <Popover>
      <PopoverButton className="h-12 w-12 outline-none bg-zinc-600 rounded-full cursor-pointer hover:bg-zinc-500 transition-colors flex items-center justify-center">
        <SiGooglelens className="text-xl text-zinc-100" />
      </PopoverButton>
      <PopoverPanel transition anchor="bottom end" className="bg-zinc-600 w-2/5 rounded-3xl [--anchor-gap:8px] p-4 select-none">
        {({ close }) => (
          <div className="w-full">
            <div className="w-full flex justify-between items-center text-zinc-300 mb-4">
              <span className="text-xl font-medium leading-6">Поиск по изображению</span>
              <IoClose
                onClick={() => {
                  close()
                }}
                className="text-2xl cursor-pointer text-zinc-400"
              />
            </div>
            <input ref={fileInputRef} type="file" multiple={false} onChange={handleChange} className="hidden" accept="image/jpg, image/png, image/jpeg" />
            <div
              className={`border-2 border-dashed rounded-xl gap-6 h-52 flex items-center justify-center transition-colors ${dragActive ? 'border-indigo-500 bg-indigo-800 bg-opacity-30' : 'border-zinc-500 bg-zinc-600'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!imageLoading ? (
                <>
                  <PiImagesThin className="text-zinc-500 transition-colors text-9xl" />
                  <div className="text-zinc-100 flex flex-col items-center">
                    <span className="font-semibold text-xl">Перетащите изображение</span>
                    <span className="text-zinc-400 mb-2">или</span>
                    <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1 border border-zinc-400 rounded-md hover:bg-zinc-500 hover:bg-opacity-30">
                      Выберете файл
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <AiOutlineLoading3Quarters className="w-9 h-9 animate-spin text-zinc-400" />
                </>
              )}
            </div>
            {/* <div className='flex justify-end items-center'>
                <div
                    onClick={() => {
                    close()
                    }}
                    className='px-4 py-1 rounded-full flex gap-2 hover:bg-zinc-500 cursor-pointer items-center text-lg font-semibold text-zinc-100 border-2 border-zinc-400'
                >
                    Search
                    <AiOutlineSearch className='text-xl' />
                </div>
                </div> */}
          </div>
        )}
      </PopoverPanel>
    </Popover>
  )
}
