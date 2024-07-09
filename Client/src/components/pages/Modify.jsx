import React, {useEffect, useState} from 'react'
import Createcss from './css/Create.module.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// import loader
import Loader from '../common/components/loader';

function Modify() {
  const [image, setImage] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [post, setPost] = useState();
  const [loading, setLoading] = useState(true);
  const [validatedmail, setValidatedmail] = useState({});

  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND}/modify/${postId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        }); 
        setPost(response.data);
        // console.log(response.data);
        setDescription(response.data.description || '');
        setTitle(response.data.title || '');
        setImage(response.data.image || '');
        setValidatedmail(response.data.email);
        setLoading(false);
      } catch (error) {
        setError('Error fetching post details');
        setLoading(false);
      }
    };
    fetchPostDetails();
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const UserToken = Cookies.get('auth');
      if (!UserToken) {
        console.error('Token not found');
        return;
      }
      await axios.put(
        `${import.meta.env.VITE_BACKEND}/modify/${postId}`,
        {
          email: validatedmail,
          title,
          description,
          image,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${UserToken}`,
          },
        }
      );
      console.log(post);
      console.log('Post updated successfully');
      navigate('/auth/editauth');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <>
    <button className={`${Createcss.Backbtn}`} onClick={() => window.history.back()}>{"< Back"}</button>
    {
      loading ? (
        <Loader/>
      ) : (
    <div className={`${Createcss.container}`}>
        <div className={`${Createcss.formconts}`}>
          <form onSubmit={handleSubmit}>
            <div className={`${Createcss.textareatitle}`}>
              <p htmlFor="title">Title: </p>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className={`${Createcss.imglink}`}>
              <p htmlFor="image">Image Link</p>
              <input
                type='url'
                name='image'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className={`${Createcss.textareadesc}`}>
              <p htmlFor="description">Description: </p>
              <textarea
                name='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${Createcss.textareadesc}`}
                wrap="soft" 
              />
            </div>
            <button type='submit'>Submit</button>
            <p className={`${Createcss.terms}`}>{"By clicking on Submit, you agree to our terms and conditions" }</p>
          </form>
        </div>
        <div className={`${Createcss.imgconts}`}>
          <div className={`${Createcss.imgdispdiv}`}>
            <img
              src={image}
              alt='Img could not be displayed'
              className={`${Createcss.imgdisplay}`}
            />
            <div className={`${Createcss.imgtext}`}>
              <h2>{title}</h2>
            </div>
            <div className={`${Createcss.imgtext}`}>
              <p>{description}</p>
            </div>
          </div>
        </div>
      </div>
      )
    }
    </>
  )
}

export default Modify;