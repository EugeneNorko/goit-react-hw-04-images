import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import { SearchBar } from './Searchbar/Searchbar';
import { fetchImages, fetchPopularImages } from '../services/pixabayApi.js';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import styled from 'styled-components';

const Box = styled.div`
  padding: 0 0 40px 0;
`;

export const App = () => {
  const [searchValue, setSearchValue] = useState('');
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  // const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [tags, setTags] = useState(null);

  useEffect(() => {
    setStatus('pending');
    console.log('первый');
    fetchPopularImages()
      .then(images => {
        setImages(images.hits);
        setTotalImages(images.totalHits);
      })
      .catch(error => {
        // setError(error);
        console.log(error);
        setStatus('rejected');
      })
      .finally(() => {
        setStatus('resolved');
      });
  }, []);

  useEffect(() => {
    if (searchValue !== '') {
      console.log('значение');
      setStatus('pending');
      fetchImages(searchValue, 1)
        .then(images => {
          // console.log(images);
          setImages(images.hits);
          setTotalImages(images.totalHits);
          setPage(1);
          setStatus('resolved');
        })
        .catch(error => {
          // setError(error);
          console.log(error);
          setStatus('rejected');
        })
        .finally(() => {
          setStatus('resolved');
        });
    }
  }, [searchValue]);

  useEffect(() => {
    if (page !== 1) {
      // console.log('страница');
      setStatus('pending');
      fetchImages(searchValue, page)
        .then(images => {
          setImages(prevState => [...prevState, ...images.hits]);
          setTotalImages(images.totalHits);
          setStatus('resolved');
        })
        .catch(error => {
          // setError(error);
          console.log(error);
          setStatus('rejected');
        })
        .finally(() => {
          setStatus('resolved');
        });
    }
  }, [page, searchValue]);

  const handleSubmit = search => {
    // console.log(search);
    if (search === searchValue) {
      return;
    }
    // console.log('кнопка работет');
    setSearchValue(search);
  };

  const increasePage = () => {
    // console.log('кнопка работет');
    setPage(prevState => prevState + 1);
  };

  const onToggleModal = () => {
    setShowModal(prevState => !prevState);
  };

  const onImageClick = (largeImageURL, tags) => {
    setCurrentImage(largeImageURL);
    setTags(tags);
    onToggleModal();
  };

  return (
    <Box>
      <SearchBar formSubmit={handleSubmit} />
      {status === 'pending' && <Loader />}
      {images.length > 0 && status === 'resolved' && (
        <ImageGallery
          images={images}
          onImageClick={onImageClick}
        ></ImageGallery>
      )}
      {totalImages > images.length && status === 'resolved' && (
        <Button onPageIncrease={increasePage} />
      )}
      {showModal && (
        <Modal onModalClose={onToggleModal} image={currentImage} tags={tags} />
      )}
      <ToastContainer />
    </Box>
  );
};
