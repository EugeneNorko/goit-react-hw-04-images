import styled from 'styled-components';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import PropTypes from 'prop-types';

const List = styled.ul`
  display: grid;
  max-width: calc(100vw - 48px);
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: 16px;
  margin-top: 0;
  margin-bottom: 0;
  padding: 0;
  list-style: none;
  margin-left: auto;
  margin-right: auto;
  padding: 40px 0 40px 0;
`;

export const ImageGallery = ({ images, onImageClick }) => {
  return (
    <List>
      <ImageGalleryItem
        images={images}
        onImageClick={onImageClick}
      ></ImageGalleryItem>
    </List>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
  onImageClick: PropTypes.func.isRequired,
};
