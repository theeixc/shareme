import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { client } from "../client";
import Spinner from "./Spinner";

import { categories } from "../utils/data";

// 创建 Pin 的组件
const CreatePin = ({ user }) => {
  // 加载
  const [loading, setLoading] = useState(false);
  // 图片格式是否错误
  const [isWrongImageType, setIsWrongImageType] = useState(false);
  // 图片是否上传
  const [imageAsset, setImageAsset] = useState(null);
  const [title, setTitle] = useState("")
  const [about, setAbout] = useState("")
  const [destination, setDestination] = useState("")
  // 判断字段是否填写完
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState("");

  const navigate = useNavigate();


  // 上传图片的回调
  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/gif' && file.type !== 'image/jpg') {
      // 图片格式错误
      setLoading(false);
      setIsWrongImageType(true);
    } else {
      setLoading(true);
      setIsWrongImageType(false);
      client.assets
        .upload("image", file, { contentType: file.type, filename: file.name })
        .then((doc) => {
          setImageAsset(doc);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Upload failed:", err.message);
        })
    }
  }

  // 上传Pin的回调
  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          },
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id
        },
        category
      };

      client.create(doc).then(() => {
        navigate("/");
      })
    } else {
      // 弹出提示，设置两秒后消失
      setFields(true);

      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
          Please fill in all the fields
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {isWrongImageType && <p>Iamge type was wrong</p>}
            {!imageAsset ? (
              // 用户未上传图片
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg font-bold">Click to upload</p>
                  </div>
                  <div>
                    <input
                      type="file"
                      name="upload-image"
                      onChange={uploadImage}
                      className='w-0 h-0'
                    />
                  </div>
                  <p className="mt-22 text-gray-400">Use high-quality JGP, JPEG, PNG, GIF less than 20MB</p>
                </div>
              </label>
            ) : (
              // 用户已上传图片
              <div className="relative h-full">
                <img src={imageAsset?.url} alt="uploaded-pic" className="h-full w-full" />
                {/* 图片右下角的删除按钮 */}
                <button
                  className="bg-pink-300 absolute bottom-3 right-3 p-3 rounded-full text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 对应 title */}
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Add your title'
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          {/* 对应 about */}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder='What is you pin about'
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          {/* 对应 Url */}
          <input
            type="url"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder='Add a url link'
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />

          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text:lg sm:text-xl">Choose Pin Category</p>
              <div className="flex justify-between">
                {/* 对应 下拉列表 */}
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'
                >
                  <option value="others" className="sm:text-bg bg-white">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.name} className="text-base border-0 outline-none capitalize bg-white text-black" value={category.name}>{category.name}</option>
                  ))}
                </select>
                {/* 对应 用户图像 */}
                {user && (
                  <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg ">
                    <img
                      src={user.image}
                      className="w-10 h-10 rounded-full"
                      alt="user-profile"
                    />
                    <p className="font-bold">{user.userName}</p>
                  </div>
                )}
              </div>
            </div>
            {/* 对应 保存按钮 */}
            <div className="flex justify-end items-end mt-5">
              <button
                onClick={savePin}
                className='bg-green-500 text-white font-bold p-2 rounded-full w-28 outline-none'
              >
                Save Pin
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;

// 3:30:40