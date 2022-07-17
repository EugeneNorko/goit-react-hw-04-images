import React, { Component } from 'react';
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

export class App extends Component {
  state = {
    searchValue: '',
    images: [],
    page: 1,
    status: 'idle',
    error: null,
    totalImages: null,
    showModal: false,
    currentImage: null,
    tags: null,
  };

  componentDidMount() {
    fetchPopularImages()
      .then(images => {
        // console.log('didMount');
        this.setState({
          images: images.hits,
          status: 'resolved',
          totalImages: images.totalHits,
        });
      })
      .catch(error => this.setState({ status: 'rejected', error }))
      .finally(() => {
        this.setState({ status: 'resolved' });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('didUpdate');
    const { page, searchValue } = this.state;
    const prevValue = prevState.searchValue;

    if (prevValue !== searchValue) {
      // console.log('changeValue');
      this.setState({ status: 'pending' });
      return fetchImages(searchValue, 1)
        .then(images => {
          // console.log(images);
          this.setState({
            images: images.hits,
            status: 'resolved',
            page: 1,
            totalImages: images.totalHits,
          });
        })
        .catch(error => this.setState({ status: 'rejected', error }))
        .finally(() => {
          this.setState({ status: 'resolved' });
        });
    }
    if (prevState.page !== page && page !== 1) {
      // console.log('changePage');
      this.setState({ status: 'pending' });
      fetchImages(searchValue, page)
        .then(images => {
          this.setState(prevState => ({
            images: [...prevState.images, ...images.hits],
            status: 'resolved',
            totalImages: images.totalHits,
          }));
        })
        .catch(error => this.setState({ status: 'rejected', error }))
        .finally(() => {
          this.setState({ status: 'resolved' });
        });
    }
  }

  handleSubmit = search => {
    // console.log(search);
    if (search === this.state.searchValue) {
      return;
    }
    // console.log('кнопка работет');
    this.setState({ searchValue: search });
  };

  increasePage = () => {
    // console.log('кнопка работет');
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  onToggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));
  };

  onImageClick = (largeImageURL, tags) => {
    this.setState({
      currentImage: largeImageURL,
      tags,
    });
    this.onToggleModal();
  };

  render() {
    return (
      <Box>
        <SearchBar onSubmit={this.handleSubmit} />
        {this.state.status === 'pending' && <Loader />}
        {this.state.images.length > 0 && (
          <ImageGallery
            images={this.state.images}
            onImageClick={this.onImageClick}
          ></ImageGallery>
        )}
        {this.state.totalImages > this.state.images.length &&
          this.state.status === 'resolved' && (
            <Button onPageIncrease={this.increasePage} />
          )}
        {this.state.showModal && (
          <Modal
            onModalClose={this.onToggleModal}
            image={this.state.currentImage}
            tags={this.state.tags}
          />
        )}
        <ToastContainer />
      </Box>
    );
  }
}
