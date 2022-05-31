import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';

import { Carousel } from 'react-bootstrap';

import { AppState } from '../../../store';
import useErrormsgStatusDtoAndExceptionError from '../../../hooks/useErrormsgStatusDtoAndExceptionError';
import { RoomFeatures } from './RoomFeatures';

export function RoomDetails(): JSX.Element {
  const { room, error } = useSelector((state: AppState) => state.roomDetails);
  const exceptionError = useSelector((state: AppState) => state.exceptionError);
  const dispatch = useDispatch();

  useErrormsgStatusDtoAndExceptionError(error, exceptionError, dispatch);

  return (
    <>
      {room ? (
        <Head>
          <title>{room?.name} - BookIT</title>
        </Head>
      ) : null}

      <div className="container container-fluid">
        <h2 className="mt-5">{room?.name}</h2>
        <p>{room?.address}</p>

        <div className="ratings mt-auto mb-3">
          <div className="rating-outer">
            <div
              className="rating-inner"
              style={{
                width: room ? `${(room.rating / 5) * 100}%` : undefined,
              }}
            ></div>
          </div>
          <span id="no_of_reviews">({room ? room.numOfReviews : 0} Reviews)</span>
        </div>

        <Carousel>
          {room &&
            room.images.map((image) => (
              <Carousel.Item key={image.public_id}>
                <div style={{ width: '100%', height: 440 }}>
                  <Image className="d-block m-auto" src={image.url} alt={room.name} layout="fill" />
                </div>
              </Carousel.Item>
            ))}
        </Carousel>

        <div className="row my-5">
          <div className="col-12 col-md-6 col-lg-8">
            <h3>Description</h3>
            <p>{room?.description}</p>
            <RoomFeatures room={room} />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="booking-card shadow-lg p-4">
              <p className="price-per-night">
                <b>${room?.pricePerNight}</b> / night
              </p>

              <button className="btn btn-block py-3 booking-btn">Pay</button>
            </div>
          </div>
        </div>

        <div className="reviews w-75">
          <h3>Reviews:</h3>
          <hr />
          <div className="review-card my-3">
            <div className="rating-outer">
              <div className="rating-inner"></div>
            </div>
            <p className="review_user">by John</p>
            <p className="review_comment">Good Quality</p>

            <hr />
          </div>

          <div className="review-card my-3">
            <div className="rating-outer">
              <div className="rating-inner"></div>
            </div>
            <p className="review_user">by John</p>
            <p className="review_comment">Good Quality</p>

            <hr />
          </div>
        </div>
      </div>
    </>
  );
}
